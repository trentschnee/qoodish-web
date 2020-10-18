import React, { useCallback, memo } from 'react';
import { useMappedState } from 'redux-react-hook';
import I18n from '../../utils/I18n';
import OverlayView from './OverlayView';
import {
  Avatar,
  createStyles,
  Fab,
  makeStyles,
  Tooltip,
  useMediaQuery,
  useTheme
} from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    overlayButton: {
      backgroundColor: 'white',
      width: 40,
      height: 40
    }
  })
);

export default memo(function CurrentPositionIcon() {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up('md'));
  const classes = useStyles();

  const mapState = useCallback(
    state => ({
      currentPosition: state.gMap.currentPosition,
      profile: state.app.profile
    }),
    []
  );
  const { currentPosition, profile } = useMappedState(mapState);

  if (!currentPosition || !currentPosition.lat || !currentPosition.lng) {
    return null;
  }

  return (
    <OverlayView
      position={
        new google.maps.LatLng(
          parseFloat(currentPosition.lat),
          parseFloat(currentPosition.lng)
        )
      }
    >
      {mdUp ? (
        <Tooltip title={I18n.t('you are hear')}>
          <Fab className={classes.overlayButton}>
            <Avatar src={profile.thumbnail_url} alt={I18n.t('you are hear')} />
          </Fab>
        </Tooltip>
      ) : (
        <Fab className={classes.overlayButton}>
          <Avatar src={profile.thumbnail_url} alt={I18n.t('you are hear')} />
        </Fab>
      )}
    </OverlayView>
  );
});
