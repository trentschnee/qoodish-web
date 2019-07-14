import React, { useCallback, useState, useEffect } from 'react';
import { useMappedState, useDispatch } from 'redux-react-hook';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import PlaceIcon from '@material-ui/icons/Place';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import CancelIcon from '@material-ui/icons/Cancel';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Slide from '@material-ui/core/Slide';
import Fade from '@material-ui/core/Fade';
import * as loadImage from 'blueimp-load-image';

import createReview from '../../actions/createReview';
import editReview from '../../actions/editReview';
import closeEditReviewDialog from '../../actions/closeEditReviewDialog';
import openToast from '../../actions/openToast';
import requestStart from '../../actions/requestStart';
import requestFinish from '../../actions/requestFinish';
import openPlaceSelectDialog from '../../actions/openPlaceSelectDialog';
import requestMapCenter from '../../actions/requestMapCenter';
import selectSpot from '../../actions/selectSpot';
import uploadToStorage from '../../utils/uploadToStorage';
import deleteFromStorage from '../../utils/deleteFromStorage';
import canvasToBlob from '../../utils/canvasToBlob';
import sleep from '../../utils/sleep';
import fetchPostableMaps from '../../actions/fetchPostableMaps';
import I18n from '../../utils/I18n';

import { MapsApi, ReviewsApi, NewReview } from 'qoodish_api';
import DialogAppBar from '../molecules/DialogAppBar';

const styles = {
  dialogContentLarge: {},
  dialogContentSmall: {
    paddingTop: 24
  },
  imagePreviewContainer: {
    position: 'relative'
  },
  imagePreview: {
    width: '100%'
  },
  clearImageIcon: {
    position: 'absolute',
    right: 0
  },
  imageInput: {
    display: 'none'
  },
  placeChipLabel: {
    overflow: 'hidden',
    maxWidth: 'calc(100vw - 100px)',
    textOverflow: 'ellipsis'
  }
};

const Transition = props => {
  return <Slide direction="up" {...props} />;
};

const AddImageButton = () => {
  const handleAddImageClick = useCallback(() => {
    document.getElementById('review-image-input').click();
  });

  return (
    <IconButton onClick={handleAddImageClick}>
      <PhotoCameraIcon />
    </IconButton>
  );
};

const EditReviewDialog = () => {
  const large = useMediaQuery('(min-width: 600px)');

  const [id, setId] = useState(undefined);
  const [mapId, setMapId] = useState(undefined);
  const [comment, setComment] = useState('');
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [errorComment, setErrorComment] = useState(undefined);
  const [errorMap, setErrorMap] = useState(undefined);
  const [disabled, setDisabled] = useState(true);
  const [imageDeleteRequest, setImageDeleteRequest] = useState(false);

  useEffect(() => {
    if (mapId && comment && !errorComment && !errorMap) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [id, mapId, comment]);

  const dispatch = useDispatch();

  const mapState = useCallback(
    state => ({
      dialogOpen: state.reviews.editReviewDialogOpen,
      selectedPlace: state.reviews.selectedPlace,
      currentReview: state.reviews.targetReview,
      currentMap: state.mapDetail.currentMap,
      postableMaps: state.maps.postableMaps,
      isMapDetail: state.shared.isMapDetail
    }),
    []
  );

  const {
    dialogOpen,
    selectedPlace,
    currentReview,
    currentMap,
    postableMaps,
    isMapDetail
  } = useMappedState(mapState);

  const handleMapChange = useCallback(selectedMapId => {
    if (!selectedMapId) {
      setErrorMap(I18n.t('map is required'));
    }
    setMapId(selectedMapId);
  });

  const handleCommentChange = useCallback(input => {
    if (input) {
      if (input.length > 500) {
        setErrorComment(I18n.t('max characters 500'));
      } else {
        setErrorComment(undefined);
      }
    } else {
      setErrorComment(I18n.t('comment is required'));
    }
    setComment(input);
  });

  const setCurrentMap = useCallback(() => {
    if (currentReview) {
      setMapId(currentReview.map.id);
    } else if (currentMap) {
      setMapId(currentMap.id);
    } else if (postableMaps.length > 0) {
      setMapId(postableMaps[0].id);
    }
  });

  const setCurrentReview = useCallback(() => {
    if (currentReview) {
      setId(currentReview.id);
      setComment(currentReview.comment);
      setImagePreviewUrl(currentReview.image ? currentReview.image.url : '');
      setDisabled(false);
    }
  }, [currentReview]);

  const handleClickCreateButton = useCallback(async (mapId, params, canvas) => {
    dispatch(requestStart());
    let fileName;
    if (canvas) {
      let blob = await canvasToBlob(canvas);
      let response = await uploadToStorage(blob);
      params.image_url = response.imageUrl;
      fileName = response.fileName;
    }

    const apiInstance = new ReviewsApi();
    const newReview = NewReview.constructFromObject(params);
    apiInstance.mapsMapIdReviewsPost(
      mapId,
      newReview,
      async (error, data, response) => {
        dispatch(requestFinish());
        if (response.ok) {
          dispatch(closeEditReviewDialog());
          dispatch(openToast(I18n.t('create review success')));

          gtag('event', 'create', {
            event_category: 'engagement',
            event_label: 'review'
          });

          if (canvas) {
            // wait until thumbnail created on cloud function
            await sleep(5000);
          }
          const review = response.body;
          dispatch(createReview(review));
          dispatch(requestMapCenter(review.spot.lat, review.spot.lng));
          dispatch(selectSpot(review.spot));
        } else {
          dispatch(openToast(response.body.detail));
          if (fileName) {
            deleteFromStorage(fileName);
          }
        }
      }
    );
  });

  const handleClickEditButton = useCallback(
    async (oldReview, params, canvas, isImageDeleteRequest = false) => {
      dispatch(requestStart());
      let fileName;
      if (canvas) {
        let blob = await canvasToBlob(canvas);
        let response = await uploadToStorage(blob);
        params.image_url = response.imageUrl;
        fileName = response.fileName;
      } else if (isImageDeleteRequest) {
        params.image_url = '';
      }

      const apiInstance = new ReviewsApi();
      const newReview = NewReview.constructFromObject(params);
      apiInstance.reviewsReviewIdPut(
        oldReview.id,
        newReview,
        async (error, data, response) => {
          dispatch(requestFinish());
          if (response.ok) {
            if (oldReview.image && canvas) {
              deleteFromStorage(oldReview.image.file_name);
            }
            dispatch(closeEditReviewDialog());
            dispatch(openToast(I18n.t('edit review success')));

            if (canvas) {
              // wait until thumbnail created on cloud function
              await sleep(5000);
            }
            const review = response.body;
            dispatch(editReview(review));
            dispatch(requestMapCenter(review.spot.lat, review.spot.lng));
          } else {
            dispatch(openToast(response.body.detail));
            if (fileName) {
              deleteFromStorage(fileName);
            }
          }
        }
      );
    }
  );

  const handleRequestClose = useCallback(() => {
    dispatch(closeEditReviewDialog());
  });

  const handleSpotClick = useCallback(() => {
    dispatch(openPlaceSelectDialog());
  });

  const initForm = useCallback(async () => {
    setCurrentReview();

    const apiInstance = new MapsApi();
    const opts = {
      postable: true
    };

    apiInstance.mapsGet(opts, (error, data, response) => {
      if (response.ok) {
        const maps = response.body;
        dispatch(fetchPostableMaps(maps));
      } else if (response.status == 401) {
        dispatch(openToast('Authenticate failed'));
      } else {
        console.log(error);
      }
      setCurrentMap();
    });
  });

  const imageNotChanged = useCallback(() => {
    return (
      currentReview &&
      currentReview.image &&
      imagePreviewUrl == currentReview.image.url
    );
  });

  const handleSaveButtonClick = useCallback(() => {
    let params = {
      comment: comment,
      place_id: selectedPlace.placeId
    };
    let canvas = document.getElementById('canvas');
    if (imageNotChanged()) {
      canvas = null;
    }
    if (currentReview) {
      params.review_id = id;
      handleClickEditButton(currentReview, params, canvas, imageDeleteRequest);
    } else {
      handleClickCreateButton(mapId, params, canvas);
    }
  });

  const handleImageChange = useCallback(e => {
    // 一回リセットしないと canvas の CORS エラーになる
    handleClearImageClick();

    let file = e.target.files[0];
    if (!file.type.match(/image\/*/)) {
      return;
    }

    loadImage.parseMetaData(file, data => {
      const options = {
        canvas: true
      };
      if (data.exif) {
        options.orientation = data.exif.get('Orientation');
      }
      loadImage(
        file,
        canvas => {
          let dataUrl = canvas.toDataURL('image/jpeg');
          setImagePreviewUrl(dataUrl);
          setImageDeleteRequest(false);
        },
        options
      );
    });
  });

  const handleClearImageClick = useCallback(() => {
    setImagePreviewUrl('');
    setImageDeleteRequest(true);
  });

  const clearInputs = useCallback(() => {
    setId(undefined);
    setMapId(undefined);
    setComment('');
    setImagePreviewUrl('');
    setErrorComment(undefined);
    setErrorComment(undefined);
    setErrorMap(undefined);
    setDisabled(true);
  });

  const renderSelectValue = useCallback(mapId => {
    let map = postableMaps.find(map => {
      return map.id == mapId;
    });
    return map ? map.name : '';
  });

  useEffect(() => {
    let canvas = document.getElementById('canvas');
    if (!canvas) {
      return;
    }
    if (canvas.getContext) {
      let context = canvas.getContext('2d');
      let image = new Image();
      image.src = imagePreviewUrl;
      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0);
      };
    }
  }, [imagePreviewUrl]);

  return (
    <Dialog
      open={dialogOpen}
      onEnter={initForm}
      onClose={handleRequestClose}
      onExit={clearInputs}
      disableBackdropClick
      disableEscapeKeyDown
      fullWidth
      fullScreen={!large}
      TransitionComponent={large ? Fade : Transition}
    >
      {large ? (
        <DialogTitle>
          {currentReview ? I18n.t('edit report') : I18n.t('create new report')}
        </DialogTitle>
      ) : (
        <DialogAppBar
          title={
            currentReview ? I18n.t('edit report') : I18n.t('create new report')
          }
          action={
            <Button
              variant="contained"
              onClick={handleSaveButtonClick}
              color="secondary"
              disabled={disabled}
              data-test="save-review-button"
              style={styles.saveButton}
            >
              {I18n.t('save')}
            </Button>
          }
          handleRequestDialogClose={handleRequestClose}
        />
      )}
      <DialogContent
        style={large ? styles.dialogContentLarge : styles.dialogContentSmall}
      >
        <Chip
          avatar={
            <Avatar>
              <PlaceIcon />
            </Avatar>
          }
          label={
            <div style={styles.placeChipLabel}>
              {selectedPlace && selectedPlace.description}
            </div>
          }
          onClick={handleSpotClick}
          clickable
        />
        <FormControl
          fullWidth
          error={errorMap ? true : false}
          disabled={currentReview ? true : false}
          margin="normal"
          required
        >
          <InputLabel htmlFor="map-input">{I18n.t('map')}</InputLabel>
          <Select
            value={mapId ? mapId : ''}
            onChange={e => handleMapChange(e.target.value)}
            input={<Input id="map-input" style={{ padding: 20 }} />}
            renderValue={value => renderSelectValue(value)}
            style={{ height: 'auto' }}
            data-test="map-select"
          >
            {postableMaps.map(map => (
              <MenuItem key={map.id} value={map.id} data-test="map-item">
                <ListItemAvatar>
                  <Avatar src={map.thumbnail_url} />
                </ListItemAvatar>
                <ListItemText primary={map.name} />
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{errorMap}</FormHelperText>
        </FormControl>
        <TextField
          label={I18n.t('comment')}
          onChange={e => handleCommentChange(e.target.value)}
          error={errorComment ? true : false}
          helperText={errorComment}
          fullWidth
          value={comment}
          multiline
          required
          autoFocus
          rows="7"
          margin="normal"
          data-test="review-comment-input"
        />
        {imagePreviewUrl ? (
          <div style={styles.imagePreviewContainer}>
            <IconButton
              style={styles.clearImageIcon}
              onClick={handleClearImageClick}
            >
              <CancelIcon />
            </IconButton>
            <canvas id="canvas" style={styles.imagePreview} />
          </div>
        ) : null}
        {large && <AddImageButton />}
        <input
          type="file"
          accept="image/*"
          id="review-image-input"
          onChange={handleImageChange}
          style={styles.imageInput}
        />
      </DialogContent>
      {large ? (
        <DialogActions>
          <Button onClick={handleRequestClose}>{I18n.t('cancel')}</Button>
          <Button
            variant="contained"
            onClick={handleSaveButtonClick}
            color="primary"
            disabled={disabled}
            data-test="save-review-button"
          >
            {I18n.t('save')}
          </Button>
        </DialogActions>
      ) : (
        <DialogActions>
          <AddImageButton />
        </DialogActions>
      )}
    </Dialog>
  );
};

export default React.memo(EditReviewDialog);
