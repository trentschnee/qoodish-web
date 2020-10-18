import { memo, useCallback, useContext } from 'react';
import { useDispatch } from 'redux-react-hook';
import openSignInRequiredDialog from '../../actions/openSignInRequiredDialog';
import openCreateActions from '../../actions/openCreateActions';
import openPlaceSelectDialog from '../../actions/openPlaceSelectDialog';
import AuthContext from '../../context/AuthContext';
import {
  createStyles,
  Fab,
  makeStyles,
  useMediaQuery,
  useTheme
} from '@material-ui/core';
import { Add } from '@material-ui/icons';

const useStyles = makeStyles(() =>
  createStyles({
    buttonLarge: {
      zIndex: 1100,
      position: 'fixed',
      bottom: 32,
      right: 32,
      backgroundColor: '#ffc107',
      color: 'white'
    },
    buttonSmall: {
      zIndex: 1100,
      position: 'fixed',
      bottom: 20,
      right: 20,
      backgroundColor: '#ffc107',
      color: 'white'
    },
    withBottomAction: {
      position: 'relative',
      bottom: 28,
      right: 'unset'
    },
    forMap: {
      position: 'absolute'
    },
    disabled: {
      color: 'rgba(0, 0, 0, 0.26)',
      boxShadow: 'none',
      backgroundColor: 'rgba(0, 0, 0, 0.12)'
    }
  })
);

type Props = {
  defaultCreateReview?: boolean;
  disabled?: boolean;
  bottomAction?: boolean;
  buttonForMap?: boolean;
};

export default memo(function CreateResourceButton(props: Props) {
  const { defaultCreateReview, disabled, bottomAction, buttonForMap } = props;
  const { currentUser } = useContext(AuthContext);
  const dispatch = useDispatch();
  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up('sm'));
  const classes = useStyles();

  const handleButtonClick = useCallback(() => {
    if (currentUser.isAnonymous) {
      dispatch(openSignInRequiredDialog());
    } else if (defaultCreateReview) {
      dispatch(openPlaceSelectDialog());
    } else {
      dispatch(openCreateActions());
    }
  }, [dispatch, currentUser, defaultCreateReview]);

  return (
    <Fab
      className={`
        ${smUp ? classes.buttonLarge : classes.buttonSmall}
        ${bottomAction ? classes.withBottomAction : ''}
        ${buttonForMap ? classes.forMap : ''}
        ${disabled ? classes.disabled : ''}
      `}
      onClick={handleButtonClick}
      disabled={disabled}
      data-test="create-resource-button"
    >
      <Add />
    </Fab>
  );
});
