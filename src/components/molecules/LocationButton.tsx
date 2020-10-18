import React, { memo, useCallback } from 'react';
import { useDispatch } from 'redux-react-hook';
import fetchCurrentPosition from '../../utils/fetchCurrentPosition';
import getCurrentPosition from '../../actions/getCurrentPosition';
import requestCurrentPosition from '../../actions/requestCurrentPosition';
import I18n from '../../utils/I18n';
import {
  createStyles,
  Fab,
  makeStyles,
  Tooltip,
  useMediaQuery,
  useTheme
} from '@material-ui/core';
import { MyLocation } from '@material-ui/icons';

const useStyles = makeStyles(() =>
  createStyles({
    buttonLarge: {
      zIndex: 1100,
      position: 'absolute',
      bottom: 108,
      right: 32,
      backgroundColor: 'white'
    },
    buttonSmall: {
      zIndex: 1100,
      position: 'absolute',
      bottom: 90,
      right: 20,
      backgroundColor: 'white'
    }
  })
);

export default memo(function LocationButton() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up('sm'));
  const classes = useStyles();

  const handleButtonClick = useCallback(async () => {
    const position = await fetchCurrentPosition();

    dispatch(
      getCurrentPosition(position.coords.latitude, position.coords.longitude)
    );

    dispatch(requestCurrentPosition());
  }, [dispatch, fetchCurrentPosition]);

  return (
    <Tooltip title={I18n.t('button current location')}>
      <Fab
        className={smUp ? classes.buttonLarge : classes.buttonSmall}
        onClick={handleButtonClick}
      >
        <MyLocation />
      </Fab>
    </Tooltip>
  );
});
