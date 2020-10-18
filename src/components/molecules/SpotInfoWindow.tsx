import React, { useCallback, useMemo, useEffect } from 'react';
import {
  CardContent,
  Typography,
  Avatar,
  Button,
  CardActions,
  makeStyles,
  createStyles
} from '@material-ui/core';
import SpotImageStepper from './SpotImageStepper';
import { useMappedState, useDispatch } from 'redux-react-hook';
import I18n from '../../utils/I18n';
import selectPlaceForReview from '../../actions/selectPlaceForReview';
import GoogleMapsLink from './GoogleMapsLink';
import ReviewsApi from '@yusuke-suzuki/qoodish-api-js-client/dist/api/ReviewsApi';
import fetchMapSpotReviews from '../../actions/fetchMapSpotReviews';
import Skeleton from '@material-ui/lab/Skeleton';
import SpotLink from './SpotLink';
import ReviewLink from './ReviewLink';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: 300
    },
    cardContent: {
      paddingBottom: 16
    },
    reviewsContainer: {
      display: 'inline-flex'
    },
    reviewerAvatar: {
      marginBottom: '0.35em',
      marginRight: -10.66666667,
      borderColor: '#fff',
      backgroundColor: '#fff',
      borderRadius: '50%',
      borderStyle: 'solid',
      float: 'right',
      borderWidth: 1,
      width: 32,
      height: 32
    },
    skeletonAvatar: {
      marginBottom: '0.35em'
    },
    cardActions: {
      padding: 12,
      paddingTop: 0
    }
  })
);

const SpotInfoWindow = () => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const mapState = useCallback(
    state => ({
      currentSpot: state.spotCard.currentSpot,
      spotReviews: state.spotCard.spotReviews,
      currentMap: state.mapDetail.currentMap
    }),
    []
  );
  const { currentSpot, spotReviews, currentMap } = useMappedState(mapState);

  const initSpotReviews = useCallback(async () => {
    const apiInstance = new ReviewsApi();

    apiInstance.mapsMapIdSpotsPlaceIdReviewsGet(
      currentSpot.map_id,
      currentSpot.place_id,
      (error, data, response) => {
        if (response.ok) {
          dispatch(fetchMapSpotReviews(response.body));
        }
      }
    );
  }, [dispatch, currentSpot]);

  useEffect(() => {
    if (currentSpot.place_id) {
      initSpotReviews();
    }
  }, [currentSpot.place_id]);

  const handleCreateReviewClick = useCallback(() => {
    const place = {
      description: currentSpot.name,
      placeId: currentSpot.place_id
    };
    dispatch(selectPlaceForReview(place));
  }, [dispatch, currentSpot]);

  const reviewAlreadyExists = useMemo(() => {
    return spotReviews.some(review => {
      return review.spot.place_id === currentSpot.place_id && review.editable;
    });
  }, [spotReviews, currentSpot]);

  return (
    <div className={classes.root}>
      <SpotImageStepper spotReviews={spotReviews} currentSpot={currentSpot} />
      <CardContent className={classes.cardContent}>
        <SpotLink spot={currentSpot}>
          <Typography variant="h6" gutterBottom>
            {currentSpot.name}
          </Typography>
        </SpotLink>
        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
          {currentSpot.formatted_address}
        </Typography>
        <Typography variant="subtitle2" gutterBottom color="textSecondary">
          {`${spotReviews.length} ${I18n.t('reviews count')}`}
        </Typography>
        {spotReviews.length > 0 ? (
          spotReviews.map(review => (
            <div className={classes.reviewsContainer} key={review.id}>
              <ReviewLink review={review}>
                <Avatar
                  src={review.author.profile_image_url}
                  className={classes.reviewerAvatar}
                  imgProps={{
                    alt: review.author.name,
                    loading: 'lazy'
                  }}
                />
              </ReviewLink>
            </div>
          ))
        ) : (
          <Skeleton
            variant="circle"
            width={32}
            height={32}
            className={classes.skeletonAvatar}
          />
        )}
        <GoogleMapsLink currentSpot={currentSpot} />
      </CardContent>
      {currentMap.postable && (
        <CardActions className={classes.cardActions}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleCreateReviewClick}
            disabled={reviewAlreadyExists}
          >
            {I18n.t('create new report')}
          </Button>
        </CardActions>
      )}
    </div>
  );
};

export default React.memo(SpotInfoWindow);
