import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { useMappedState } from 'redux-react-hook';

import NavDrawer from '../molecules/NavDrawer';
import MapToolbar from '../molecules/MapToolbar';
import NavToolbar from './NavToolbar';

import AppBar from '@material-ui/core/AppBar';

import { match } from 'path-to-regexp';
import DrawerContext from '../../context/DrawerContext';

const routesShowBackButton = [
  {
    path: '/maps/:mapId'
  },
  {
    path: '/maps/:mapId/reports/:reviewId'
  },
  {
    path: '/spots/:placeId'
  },
  {
    path: '/users/:userId'
  }
];

const NavBar = () => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [showMapToolbar, setShowMapToolbar] = useState(false);

  const mapState = useCallback(
    state => ({
      currentLocation: state.shared.currentLocation
    }),
    []
  );

  const { currentLocation } = useMappedState(mapState);

  useEffect(() => {
    if (match('/maps/:mapId')(currentLocation)) {
      setShowMapToolbar(true);
    } else {
      setShowMapToolbar(false);
    }
  }, [currentLocation]);

  const showBackButton = useMemo(() => {
    return routesShowBackButton.find(route => {
      return match(route.path)(currentLocation);
    });
  }, [currentLocation, routesShowBackButton]);

  return (
    <DrawerContext.Provider
      value={{
        drawerOpen: drawerOpen,
        setDrawerOpen: setDrawerOpen
      }}
    >
      <AppBar position="fixed">
        {showMapToolbar ? (
          <MapToolbar />
        ) : (
          <NavToolbar showBackButton={showBackButton as boolean} />
        )}
      </AppBar>
      <NavDrawer />
    </DrawerContext.Provider>
  );
};

export default React.memo(NavBar);
