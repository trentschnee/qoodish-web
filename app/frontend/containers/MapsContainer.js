import { connect } from 'react-redux';
import Maps from '../ui/Maps';
import ApiClient from '../containers/ApiClient';
import openToast from '../actions/openToast';
import signOut from '../actions/signOut';
import { push } from 'react-router-redux';

import CreateMapDialogContainer from '../containers/CreateMapDialogContainer';
import fetchMyMaps from '../actions/fetchMyMaps';
import fetchFollowingMaps from '../actions/fetchFollowingMaps';
import loadMyMapsStart from '../actions/loadMyMapsStart';
import loadMyMapsEnd from '../actions/loadMyMapsEnd';
import loadFollowingMapsStart from '../actions/loadFollowingMapsStart';
import loadFollowingMapsEnd from '../actions/loadFollowingMapsEnd';
import selectMap from '../actions/selectMap';
import openCreateMapDialog from '../actions/openCreateMapDialog';
import updatePageTitle from '../actions/updatePageTitle';
import showMapsTab from '../actions/showMapsTab';
import hideMapsTab from '../actions/hideMapsTab';
import switchMyMaps from '../actions/switchMyMaps';
import switchFollowingMaps from '../actions/switchFollowingMaps';

const mapStateToProps = state => {
  return {
    myMaps: state.maps.myMaps,
    followingMaps: state.maps.followingMaps,
    loadingMyMaps: state.maps.loadingMyMaps,
    loadingFollowingMaps: state.maps.loadingFollowingMaps,
    large: state.shared.large,
    hash: state.router.location.hash,
    tabValue: state.maps.tabValue
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updatePageTitle: () => {
      dispatch(updatePageTitle('Maps'));
    },

    showTabs: () => {
      dispatch(showMapsTab());
    },

    hideTabs: () => {
      dispatch(hideMapsTab());
    },

    handleCreateMapButtonClick: () => {
      dispatch(openCreateMapDialog());
    },

    refreshMyMaps: async () => {
      dispatch(loadMyMapsStart());
      const client = new ApiClient();
      let response = await client.fetchMyMaps();
      let maps = await response.json();
      dispatch(fetchMyMaps(maps));
      dispatch(loadMyMapsEnd());
    },

    refreshFollowingMaps: async () => {
      dispatch(loadFollowingMapsStart());
      const client = new ApiClient();
      let response = await client.fetchFollowingMaps();
      let maps = await response.json();
      dispatch(fetchFollowingMaps(maps));
      dispatch(loadFollowingMapsEnd());
    },

    handleClickMap: map => {
      dispatch(selectMap(map));
      dispatch(push(`/maps/${map.id}`));
      dispatch(openToast(`Log in to ${map.name}!`));
    },

    switchMyMaps: () => {
      dispatch(switchMyMaps());
    },

    switchFollowingMaps: () => {
      dispatch(switchFollowingMaps());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Maps);
