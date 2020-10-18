import {
  Avatar,
  Button,
  Chip,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  Slide,
  SlideProps,
  Theme,
  useMediaQuery,
  useTheme
} from '@material-ui/core';
import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import fileToDataUrl from '../../utils/fileToDataUrl';
import uploadToStorage from '../../utils/uploadToStorage';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useMappedState } from 'redux-react-hook';
import closeEditReviewDialog from '../../actions/closeEditReviewDialog';
import openPlaceSelectDialog from '../../actions/openPlaceSelectDialog';
import { MapsApi } from '@yusuke-suzuki/qoodish-api-js-client';
import { ReviewsApi, NewReview } from '@yusuke-suzuki/qoodish-api-js-client';
import fetchPostableMaps from '../../actions/fetchPostableMaps';
import openToast from '../../actions/openToast';
import I18n from '../../utils/I18n';
import DialogAppBar from '../molecules/DialogAppBar';
import { Place } from '@material-ui/icons';
import MapSelect from '../molecules/MapSelect';
import PhotoTiles from '../molecules/PhotoTiles';
import AddPhotoButton from '../molecules/AddPhotoButton';
import requestStart from '../../actions/requestStart';
import requestFinish from '../../actions/requestFinish';
import sleep from '../../utils/sleep';
import createReview from '../../actions/createReview';
import requestMapCenter from '../../actions/requestMapCenter';
import selectMapSpot from '../../actions/selectMapSpot';
import editReview from '../../actions/editReview';
import ReviewCommentForm from '../molecules/ReviewCommentForm';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    addPhotoButton: {
      marginRight: 'auto'
    },
    placeChipLabel: {
      overflow: 'hidden',
      maxWidth: 'calc(100vw - 100px)',
      textOverflow: 'ellipsis'
    },
    photoTiles: {
      marginTop: theme.spacing(2)
    },
    dialogContent: {
      paddingTop: theme.spacing(3),
      [theme.breakpoints.up('sm')]: {
        paddingTop: 0
      }
    },
    dialogActions: {
      padding: theme.spacing(2)
    }
  })
);

type Image = {
  id?: number;
  url: string;
  thumbnail_url?: string;
  thumbnail_url_400?: string;
  thumbnail_url_800?: string;
};

const Transition = forwardRef(function Transition(props: SlideProps, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default memo(function EditReviewDialog() {
  const dispatch = useDispatch();

  const mapState = useCallback(
    state => ({
      dialogOpen: state.reviews.editReviewDialogOpen,
      selectedPlace: state.reviews.selectedPlace,
      currentReview: state.reviews.targetReview
    }),
    []
  );

  const { dialogOpen, selectedPlace, currentReview } = useMappedState(mapState);

  const [comment, setComment] = useState<string>(null);
  const [currentFiles, setCurrentFiles] = useState<File[]>([]);
  const [currentImages, setCurrentImages] = useState<Image[]>([]);
  const [targetMapId, setTargetMapId] = useState<number>(null);

  const disabled = useMemo(() => {
    return !(comment && targetMapId && selectedPlace);
  }, [comment, targetMapId && selectedPlace]);

  const classes = useStyles();
  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up('sm'));

  const initPostableMaps = useCallback(async () => {
    const apiInstance = new MapsApi();
    const opts = {
      postable: true
    };

    apiInstance.mapsGet(opts, (error, data, response) => {
      if (response.ok) {
        dispatch(fetchPostableMaps(response.body));
      } else if (response.status == 401) {
        dispatch(openToast('Authenticate failed'));
      } else {
        console.error(error);
      }
    });
  }, [dispatch]);

  const handleEnter = useCallback(() => {
    initPostableMaps();
  }, [initPostableMaps]);

  const handleExited = useCallback(() => {
    setComment(null);
    setCurrentFiles([]);
    setCurrentImages([]);
    setTargetMapId(null);
  }, []);

  const handleRequestClose = useCallback(() => {
    dispatch(closeEditReviewDialog());
  }, [dispatch]);

  const handleSpotClick = useCallback(() => {
    dispatch(openPlaceSelectDialog());
  }, [dispatch]);

  const handleImageFilesChange = useCallback(files => {
    setCurrentFiles(files);
  }, []);

  const handleImageRemove = useCallback(
    index => {
      setCurrentImages(
        currentImages.filter((image, i) => {
          return i !== index;
        })
      );
    },
    [currentImages]
  );

  const handleCommentChange = useCallback(value => {
    setComment(value);
  }, []);

  const handleMapChange = useCallback(currentMapId => {
    setTargetMapId(currentMapId);
  }, []);

  const filesToImages = useCallback(async () => {
    const items: Image[] = [];

    for (let file of currentFiles) {
      const dataUrl = await fileToDataUrl(file);
      items.push({
        url: dataUrl
      });
    }

    setCurrentImages([...currentImages, ...items]);
  }, [currentFiles, currentImages]);

  const handleSaveClick = useCallback(async () => {
    dispatch(requestStart());

    const photos = [];

    for (let image of currentImages) {
      const url = new URL(image.url);

      if (url.protocol === 'data:') {
        const fileName = `images/${uuidv4()}.jpg`;
        const imageUrl = await uploadToStorage(image.url, fileName, 'data_url');
        photos.push({ url: imageUrl });
      } else if (url.protocol === 'https:') {
        // Do nothing
        photos.push({ url: image.url });
      }
    }

    const review = NewReview.constructFromObject({
      comment: comment,
      place_id: selectedPlace.placeId,
      images: photos
    });

    if (currentReview) {
      handleEditReview(review);
    } else {
      handleCreateReview(review);
    }
  }, [
    dispatch,
    comment,
    currentImages,
    uploadToStorage,
    currentReview,
    selectedPlace
  ]);

  const handleCreateReview = useCallback(
    review => {
      const apiInstance = new ReviewsApi();

      apiInstance.mapsMapIdReviewsPost(
        targetMapId,
        review,
        async (error, data, response) => {
          dispatch(requestFinish());

          if (response.ok) {
            dispatch(closeEditReviewDialog());
            dispatch(openToast(I18n.t('create review success')));

            (window as any).gtag('event', 'create', {
              event_category: 'engagement',
              event_label: 'review'
            });

            // wait until thumbnail created on cloud function
            await sleep(3000);

            const newReview = response.body;
            dispatch(createReview(newReview));
            dispatch(requestMapCenter(newReview.spot.lat, newReview.spot.lng));
            dispatch(selectMapSpot(newReview.spot));
          } else {
            dispatch(openToast(response.body.detail));
          }
        }
      );
    },
    [targetMapId, dispatch]
  );

  const handleEditReview = useCallback(
    review => {
      const apiInstance = new ReviewsApi();

      apiInstance.reviewsReviewIdPut(
        currentReview.id,
        review,
        async (error, data, response) => {
          dispatch(requestFinish());

          if (response.ok) {
            dispatch(closeEditReviewDialog());
            dispatch(openToast(I18n.t('edit review success')));

            // wait until thumbnail created on cloud function
            await sleep(3000);

            const newReview = response.body;
            dispatch(editReview(newReview));
            dispatch(requestMapCenter(newReview.spot.lat, newReview.spot.lng));
          } else {
            dispatch(openToast(response.body.detail));
          }
        }
      );
    },
    [currentReview, dispatch]
  );

  useEffect(() => {
    filesToImages();
  }, [currentFiles]);

  useEffect(() => {
    if (currentReview) {
      setTargetMapId(currentReview.map.id);
      setComment(currentReview.comment);
      setCurrentImages(currentReview.images);
    }
  }, [currentReview]);

  return (
    <Dialog
      open={dialogOpen}
      onEnter={handleEnter}
      onClose={handleRequestClose}
      onExited={handleExited}
      disableBackdropClick
      disableEscapeKeyDown
      fullWidth
      fullScreen={!smUp}
      TransitionComponent={Transition}
    >
      {smUp ? (
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
              onClick={handleSaveClick}
              color="secondary"
              disabled={disabled}
              data-test="save-review-button"
            >
              {I18n.t('save')}
            </Button>
          }
          handleRequestDialogClose={handleRequestClose}
        />
      )}

      <DialogContent className={classes.dialogContent}>
        <Chip
          avatar={
            <Avatar>
              <Place />
            </Avatar>
          }
          label={
            <div className={classes.placeChipLabel}>
              {selectedPlace && selectedPlace.description}
            </div>
          }
          onClick={handleSpotClick}
          clickable
        />

        <MapSelect
          currentReview={currentReview}
          onMapChange={handleMapChange}
        />

        <ReviewCommentForm
          currentReview={currentReview}
          onChange={handleCommentChange}
        />

        <div className={classes.photoTiles}>
          <PhotoTiles
            photoURLs={currentImages.map(image => image.url)}
            onRemove={handleImageRemove}
            variant="preview"
          />
        </div>
      </DialogContent>

      {smUp ? (
        <DialogActions className={classes.dialogActions}>
          <div className={classes.addPhotoButton}>
            <AddPhotoButton
              id="review-image-input"
              onChange={handleImageFilesChange}
            />
          </div>

          <Button onClick={handleRequestClose}>{I18n.t('cancel')}</Button>
          <Button
            variant="contained"
            onClick={handleSaveClick}
            color="primary"
            disabled={disabled}
            data-test="save-review-button"
          >
            {I18n.t('save')}
          </Button>
        </DialogActions>
      ) : (
        <DialogActions className={classes.dialogActions}>
          <AddPhotoButton
            id="review-image-input"
            onChange={handleImageFilesChange}
          />
        </DialogActions>
      )}
    </Dialog>
  );
});
