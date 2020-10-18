import React, { useCallback } from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Slide from '@material-ui/core/Slide';
import Fade from '@material-ui/core/Fade';

import SpotCard from './SpotCard';
import I18n from '../../utils/I18n';
import DialogAppBar from '../molecules/DialogAppBar';
import closeSpotDialog from '../../actions/closeSpotDialog';
import { useDispatch, useMappedState } from 'redux-react-hook';
import { useMediaQuery, useTheme } from '@material-ui/core';

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

const SpotDialog = () => {
  const mapState = useCallback(
    state => ({
      currentSpot: state.spotDetail.currentSpot,
      spotDialogOpen: state.spotDetail.spotDialogOpen
    }),
    []
  );

  const { currentSpot, spotDialogOpen } = useMappedState(mapState);

  const dispatch = useDispatch();

  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up('sm'));

  const handleDialogOpen = useCallback(() => {
    if (currentSpot) {
      (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_TRACKING_ID, {
        page_path: `/spots/${currentSpot.place_id}`,
        page_title: `${currentSpot.name} | Qoodish`
      });
    }
  }, [currentSpot]);

  const handleDialogClose = useCallback(() => {
    dispatch(closeSpotDialog());
  }, [dispatch]);

  return (
    <Dialog
      open={spotDialogOpen}
      onEntered={handleDialogOpen}
      onClose={handleDialogClose}
      TransitionComponent={smUp ? Fade : Transition}
      fullWidth
      fullScreen={smUp ? false : true}
      scroll={smUp ? 'body' : 'paper'}
    >
      {!smUp && (
        <DialogAppBar
          title={I18n.t('spot')}
          iconType="back"
          handleRequestDialogClose={handleDialogClose}
        />
      )}
      <DialogContent style={styles.dialogContent}>
        <div>
          {currentSpot && (
            <SpotCard
              currentSpot={currentSpot}
              placeId={currentSpot.place_id}
              dialog={true}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(SpotDialog);
