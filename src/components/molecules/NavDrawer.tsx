import React, { memo, useCallback, useContext } from 'react';
import { useDispatch, useMappedState } from 'redux-react-hook';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Link from 'next/link';
import { useRouter } from 'next/router';

import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';

import HomeIcon from '@material-ui/icons/Home';
import ExploreIcon from '@material-ui/icons/Explore';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SettingsIcon from '@material-ui/icons/Settings';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import I18n from '../../utils/I18n';

import openFeedbackDialog from '../../actions/openFeedbackDialog';

import getFirebase from '../../utils/getFirebase';
import getFirebaseAuth from '../../utils/getFirebaseAuth';
import requestStart from '../../actions/requestStart';
import requestFinish from '../../actions/requestFinish';
import ProfileCard from './ProfileCard';
import deleteRegistrationToken from '../../utils/deleteRegistrationToken';
import Logo from './Logo';
import openAnnouncementDialog from '../../actions/openAnnouncementDialog';
import AuthContext from '../../context/AuthContext';
import { makeStyles, createStyles, useTheme } from '@material-ui/core';
import DrawerContext from '../../context/DrawerContext';

const useStyles = makeStyles(() =>
  createStyles({
    titleLarge: {
      height: 64
    },
    titleSmall: {
      height: 56
    },
    drawerPaper: {
      width: 280
    }
  })
);

const Title = memo(() => {
  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up('sm'));
  const { setDrawerOpen } = useContext(DrawerContext);

  const handleCloseDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  const classes = useStyles();

  return (
    <Link href="/" passHref>
      <ListItem
        divider
        className={smUp ? classes.titleLarge : classes.titleSmall}
      >
        <ListItemText disableTypography primary={<Logo />} />
        <ListItemSecondaryAction>
          <IconButton onClick={handleCloseDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    </Link>
  );
});

const DrawerContents = memo(() => {
  const mapState = useCallback(
    state => ({
      currentLocation: state.shared.currentLocation,
      announcementIsNew: state.shared.announcementIsNew
    }),
    []
  );
  const { currentLocation, announcementIsNew } = useMappedState(mapState);

  const { currentUser } = useContext(AuthContext);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleSignOutClick = useCallback(async () => {
    dispatch(requestStart());

    deleteRegistrationToken();

    const firebase = await getFirebase();
    await getFirebaseAuth();

    await firebase.auth().signOut();
    router.push('/login');

    dispatch(requestFinish());
  }, [dispatch, router]);

  const handleAnnouncementClick = useCallback(() => {
    dispatch(openAnnouncementDialog());
  }, [dispatch]);

  const handleFeedbackClick = useCallback(() => {
    dispatch(openFeedbackDialog());
  }, [dispatch]);

  const isSelected = useCallback(
    pathname => {
      return currentLocation === pathname;
    },
    [currentLocation]
  );

  return (
    <div>
      <List disablePadding component="nav">
        <Title />
        <ProfileCard />
        <Link href="/" passHref>
          <ListItem button title={I18n.t('home')}>
            <ListItemIcon>
              <HomeIcon color={isSelected('/') ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText
              primary={I18n.t('home')}
              primaryTypographyProps={
                isSelected('/') ? { color: 'primary' } : {}
              }
            />
          </ListItem>
        </Link>
        <Link href="/discover" passHref>
          <ListItem button title={I18n.t('discover')}>
            <ListItemIcon>
              <ExploreIcon
                color={isSelected('/discover') ? 'primary' : 'inherit'}
              />
            </ListItemIcon>
            <ListItemText
              primary={I18n.t('discover')}
              primaryTypographyProps={
                isSelected('/discover') ? { color: 'primary' } : {}
              }
            />
          </ListItem>
        </Link>
        <Link href="/profile" passHref>
          <ListItem button title={I18n.t('account')}>
            <ListItemIcon>
              <AccountCircleIcon
                color={isSelected('/profile') ? 'primary' : 'inherit'}
              />
            </ListItemIcon>
            <ListItemText
              primary={I18n.t('account')}
              primaryTypographyProps={
                isSelected('/profile') ? { color: 'primary' } : {}
              }
            />
          </ListItem>
        </Link>
        <Link href="/notifications" passHref>
          <ListItem button title={I18n.t('notifications')}>
            <ListItemIcon>
              <NotificationsIcon
                color={isSelected('/notifications') ? 'primary' : 'inherit'}
              />
            </ListItemIcon>
            <ListItemText
              primary={I18n.t('notifications')}
              primaryTypographyProps={
                isSelected('/notifications') ? { color: 'primary' } : {}
              }
            />
          </ListItem>
        </Link>
        <Link href="/settings" passHref>
          <ListItem button title={I18n.t('settings')}>
            <ListItemIcon>
              <SettingsIcon
                color={isSelected('/settings') ? 'primary' : 'inherit'}
              />
            </ListItemIcon>
            <ListItemText
              primary={I18n.t('settings')}
              primaryTypographyProps={
                isSelected('/settings') ? { color: 'primary' } : {}
              }
            />
          </ListItem>
        </Link>
        <Link href="/invites" passHref>
          <ListItem button title={I18n.t('invites')}>
            <ListItemIcon>
              <MailIcon
                color={isSelected('/invites') ? 'primary' : 'inherit'}
              />
            </ListItemIcon>
            <ListItemText
              primary={I18n.t('invites')}
              primaryTypographyProps={
                isSelected('/invites') ? { color: 'primary' } : {}
              }
            />
          </ListItem>
        </Link>
        <Divider />
        {currentUser.isAnonymous ? (
          <Link href="/login" passHref>
            <ListItem button title={I18n.t('login')}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText
                primary={I18n.t('login')}
                primaryTypographyProps={{ color: 'textSecondary' }}
              />
            </ListItem>
          </Link>
        ) : (
          <ListItem button onClick={handleSignOutClick}>
            <ListItemText
              primary={I18n.t('logout')}
              primaryTypographyProps={{ color: 'textSecondary' }}
            />
          </ListItem>
        )}
        <ListItem button onClick={handleAnnouncementClick}>
          <ListItemText
            primary={I18n.t('announcement')}
            primaryTypographyProps={{ color: 'textSecondary' }}
          />
          {announcementIsNew && (
            <ListItemSecondaryAction onClick={handleAnnouncementClick}>
              <Button color="primary">NEW</Button>
            </ListItemSecondaryAction>
          )}
        </ListItem>
        <ListItem button onClick={handleFeedbackClick}>
          <ListItemText
            primary={I18n.t('send feedback')}
            primaryTypographyProps={{ color: 'textSecondary' }}
          />
        </ListItem>
        <Link href="/terms" passHref>
          <ListItem button title={I18n.t('terms of service')}>
            <ListItemText
              primary={I18n.t('terms of service')}
              primaryTypographyProps={{ color: 'textSecondary' }}
            />
          </ListItem>
        </Link>
        <Link href="/privacy" passHref>
          <ListItem button title={I18n.t('privacy policy')}>
            <ListItemText
              primary={I18n.t('privacy policy')}
              primaryTypographyProps={{ color: 'textSecondary' }}
            />
          </ListItem>
        </Link>
      </List>
    </div>
  );
});

export default memo(function NavDrawer() {
  const { drawerOpen, setDrawerOpen } = useContext(DrawerContext);

  const handleOpenDrawer = useCallback(() => {
    setDrawerOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  const classes = useStyles();

  return (
    <SwipeableDrawer
      open={drawerOpen}
      onOpen={handleOpenDrawer}
      onClose={handleCloseDrawer}
      onClick={handleCloseDrawer}
      PaperProps={{ className: classes.drawerPaper }}
    >
      <DrawerContents />
    </SwipeableDrawer>
  );
});
