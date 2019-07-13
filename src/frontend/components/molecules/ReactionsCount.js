import React, { useCallback } from 'react';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import I18n from '../../utils/I18n';
import { LikesApi } from 'qoodish_api';
import fetchLikes from '../../actions/fetchLikes';
import openLikesDialog from '../../actions/openLikesDialog';
import { useDispatch } from 'redux-react-hook';

const styles = {
  disablePadding: {
    paddingBottom: 0,
    display: 'flex'
  },
  reactionsCount: {
    paddingBottom: 16,
    display: 'flex'
  },
  comment: {
    marginRight: 16,
    height: '0.875rem'
  },
  like: {
    cursor: 'pointer',
    height: '0.875rem'
  },
  empty: {
    height: '0.875rem'
  }
};

const ReactionsCount = props => {
  const { review, disablePadding } = props;
  const dispatch = useDispatch();

  const handleLikesClick = useCallback(async () => {
    dispatch(openLikesDialog());
    const apiInstance = new LikesApi();

    apiInstance.reviewsReviewIdLikesGet(review.id, (error, data, response) => {
      if (response.ok) {
        dispatch(fetchLikes(response.body));
      }
    });
  });

  return (
    <CardContent
      style={disablePadding ? styles.disablePadding : styles.reactionsCount}
    >
      {!review || (review.comments.length < 1 && review.likes_count < 1) ? (
        <Typography
          variant="subtitle2"
          color="textSecondary"
          gutterBottom
          style={styles.empty}
        >
          {``}
        </Typography>
      ) : (
        <React.Fragment>
          <Typography
            variant="subtitle2"
            color="textSecondary"
            gutterBottom
            style={styles.comment}
          >
            {`${review.comments.length} ${I18n.t('comment count')}`}
          </Typography>

          <Typography
            variant="subtitle2"
            color="textSecondary"
            gutterBottom
            style={styles.like}
            onClick={handleLikesClick}
          >
            {`${review.likes_count} ${I18n.t('likes count')}`}
          </Typography>
        </React.Fragment>
      )}
    </CardContent>
  );
};

export default React.memo(ReactionsCount);
