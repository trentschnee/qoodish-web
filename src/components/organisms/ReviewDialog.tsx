import React, { useCallback } from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Slide from '@material-ui/core/Slide';
import Fade from '@material-ui/core/Fade';

import ReviewCard from '../molecules/ReviewCard';
import ReviewCardActions from '../molecules/ReviewCardActions';
import I18n from '../../utils/I18n';
import DialogAppBar from '../molecules/DialogAppBar';

import requestMapCenter from '../../actions/requestMapCenter';
import { useDispatch, useMappedState } from 'redux-react-hook';
import { useTheme, useMediaQuery } from '@material-ui/core';
import closeReviewDialog from '../../actions/closeReviewDialog';

const styles = {
  dialogContent: {
    padding: 0
  },
  dialogActions: {
    paddingLeft: 20,
    paddingRight: 12
  }
};

const Transition = React.forwardRef(function Transition(props, ref) {
  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up('sm'));
  return <Slide direction={smUp ? 'up' : 'left'} ref={ref} {...props} />;
});

const ReviewDialog = () => {
  const mapState = useCallback(
    state => ({
      currentReview: state.reviews.currentReview,
      reviewDialogOpen: state.reviews.reviewDialogOpen
    }),
    []
  );
  const { currentReview, reviewDialogOpen } = useMappedState(mapState);

  const dispatch = useDispatch();
  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up('sm'));

  const handleDialogOpen = useCallback(() => {
    if (currentReview) {
      (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_TRACKING_ID, {
        page_path: `/maps/${currentReview.map.id}/reports/${currentReview.id}`,
        page_title: `${currentReview.spot.name} - ${currentReview.map.name} | Qoodish`
      });

      dispatch(
        requestMapCenter(currentReview.spot.lat, currentReview.spot.lng)
      );
    }
  }, [dispatch, currentReview]);

  const handleDialogClose = useCallback(() => {
    dispatch(closeReviewDialog());
  }, [dispatch]);

  return (
    <Dialog
      disableScrollLock
      open={reviewDialogOpen}
      onEntered={handleDialogOpen}
      onClose={handleDialogClose}
      TransitionComponent={smUp ? Fade : Transition}
      fullWidth
      fullScreen={smUp ? false : true}
      scroll={smUp ? 'body' : 'paper'}
      disableRestoreFocus
    >
      {!smUp && (
        <DialogAppBar
          title={I18n.t('report')}
          iconType="back"
          handleRequestDialogClose={handleDialogClose}
        />
      )}
      <DialogContent style={styles.dialogContent}>
        <div>
          {currentReview && (
            <ReviewCard
              currentReview={currentReview}
              detail={!smUp}
              hideActions
            />
          )}
        </div>
      </DialogContent>
      <DialogActions disableSpacing style={styles.dialogActions}>
        <ReviewCardActions review={currentReview} />
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(ReviewDialog);
