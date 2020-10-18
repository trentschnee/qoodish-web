import React, { useCallback, useContext } from 'react';
import { useDispatch } from 'redux-react-hook';

import Link from 'next/link';
import MapIcon from '@material-ui/icons/Map';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import SearchIcon from '@material-ui/icons/Search';
import RateReviewIcon from '@material-ui/icons/RateReview';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import PlaceIcon from '@material-ui/icons/Place';
import MailIcon from '@material-ui/icons/Mail';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import I18n from '../../utils/I18n';

import openCreateMapDialog from '../../actions/openCreateMapDialog';
import openPlaceSelectDialog from '../../actions/openPlaceSelectDialog';
import openSignInRequiredDialog from '../../actions/openSignInRequiredDialog';
import AuthContext from '../../context/AuthContext';
import { createStyles, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      textAlign: 'center',
      color: '#9e9e9e',
      padding: 20
    },
    icon: {
      width: 150,
      height: 150
    },
    buttonIcon: {
      marginRight: 8
    }
  })
);

const ContentsIcon = props => {
  const classes = useStyles();

  switch (props.contentType) {
    case 'map':
      return <MapIcon className={classes.icon} />;
    case 'review':
      return <RateReviewIcon className={classes.icon} />;
    case 'notification':
      return <NotificationsIcon className={classes.icon} />;
    case 'like':
      return <ThumbUpIcon className={classes.icon} />;
    case 'spot':
      return <PlaceIcon className={classes.icon} />;
    case 'invite':
      return <MailIcon className={classes.icon} />;
    default:
      return null;
  }
};

const PrimaryAction = props => {
  const { currentUser } = useContext(AuthContext);
  const dispatch = useDispatch();
  const classes = useStyles();

  const handleCreateMapButtonClick = useCallback(() => {
    if (currentUser.isAnonymous) {
      dispatch(openSignInRequiredDialog());
    } else {
      dispatch(openCreateMapDialog());
    }
  }, [dispatch, currentUser]);

  const handleCreateReviewButtonClick = useCallback(() => {
    if (currentUser.isAnonymous) {
      dispatch(openSignInRequiredDialog());
    } else {
      dispatch(openPlaceSelectDialog());
    }
  }, [dispatch, currentUser]);

  switch (props.action) {
    case 'create-map':
      return (
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateMapButtonClick}
        >
          <AddIcon className={classes.buttonIcon} />
          {I18n.t('create new map')}
        </Button>
      );
    case 'create-review':
      return (
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateReviewButtonClick}
        >
          <EditIcon className={classes.buttonIcon} />
          {I18n.t('create new report')}
        </Button>
      );
    case 'discover-reviews':
      return (
        <Link href="/discover" passHref>
          <Button color="primary">
            <SearchIcon className={classes.buttonIcon} />
            {I18n.t('discover reviews')}
          </Button>
        </Link>
      );
    default:
      return null;
  }
};

const SecondaryAction = props => {
  const classes = useStyles();

  switch (props.secondaryAction) {
    case 'discover-maps':
      return (
        <Link href="/discover" passHref>
          <Button color="primary">
            <SearchIcon className={classes.buttonIcon} />
            {I18n.t('discover maps')}
          </Button>
        </Link>
      );
    case 'discover-reviews':
      return (
        <Link href="/discover" passHref>
          <Button color="primary">
            <SearchIcon className={classes.buttonIcon} />
            {I18n.t('discover reviews')}
          </Button>
        </Link>
      );
    default:
      return null;
  }
};

const NoContents = props => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <ContentsIcon {...props} />
      <Typography variant="subtitle1" color="inherit">
        {props.message}
      </Typography>
      <br />
      <div>
        <PrimaryAction {...props} />
      </div>
      <br />
      <div>
        <SecondaryAction {...props} />
      </div>
    </div>
  );
};

export default React.memo(NoContents);
