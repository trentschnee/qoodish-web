import React from 'react';
import { connect } from 'react-redux';
import Profile from '../ui/Profile';
import fetchMyProfile from '../actions/fetchMyProfile';
import fetchMyMaps from '../actions/fetchMyMaps';
import loadMyMapsStart from '../actions/loadMyMapsStart';
import loadMyMapsEnd from '../actions/loadMyMapsEnd';
import fetchFollowingMaps from '../actions/fetchFollowingMaps';
import loadFollowingMapsStart from '../actions/loadFollowingMapsStart';
import loadFollowingMapsEnd from '../actions/loadFollowingMapsEnd';
import fetchUserReviews from '../actions/fetchUserReviews';
import fetchMoreUserReviews from '../actions/fetchMoreUserReviews';
import loadUserReviewsStart from '../actions/loadUserReviewsStart';
import loadUserReviewsEnd from '../actions/loadUserReviewsEnd';
import loadMoreUserReviewsStart from '../actions/loadMoreUserReviewsStart';
import loadMoreUserReviewsEnd from '../actions/loadMoreUserReviewsEnd';
import fetchUserLikes from '../actions/fetchUserLikes';
import clearProfileState from '../actions/clearProfileState';
import openEditProfileDialog from '../actions/openEditProfileDialog';
import openSignInRequiredDialog from '../actions/openSignInRequiredDialog';
import openFollowingMapsDialog from '../actions/openFollowingMapsDialog';
import ApiClient from './ApiClient.js';

const mapStateToProps = state => {
  return {
    large: state.shared.large,
    currentUser: state.app.currentUser,
    defaultZoom: state.gMap.defaultZoom,
    center: state.gMap.center,
    myMaps: state.profile.myMaps,
    loadingMyMaps: state.profile.loadingMyMaps,
    currentReviews: state.profile.currentReviews,
    loadingReviews: state.profile.loadingReviews,
    loadingMoreReviews: state.profile.loadingMoreReviews,
    noMoreReviews: state.profile.noMoreReviews,
    nextTimestamp: state.profile.nextTimestamp,
    likes: state.profile.likes,
    pathname: state.shared.currentLocation
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchUserProfile: async () => {
      const client = new ApiClient();
      let response = await client.fetchUser();
      let user = await response.json();
      dispatch(fetchMyProfile(user));
    },

    fetchReviews: async () => {
      dispatch(loadUserReviewsStart());
      const client = new ApiClient();
      let response = await client.fetchUserReviews();
      let reviews = await response.json();
      dispatch(loadUserReviewsEnd());
      dispatch(fetchUserReviews(reviews));
    },

    loadMoreReviews: async timestamp => {
      dispatch(loadMoreUserReviewsStart());
      const client = new ApiClient();
      let response = await client.fetchUserReviews(undefined, timestamp);
      let reviews = await response.json();
      dispatch(loadMoreUserReviewsEnd());
      dispatch(fetchMoreUserReviews(reviews));
    },

    fetchMyMaps: async () => {
      dispatch(loadMyMapsStart());
      const client = new ApiClient();
      let response = await client.fetchMyMaps();
      let maps = await response.json();
      dispatch(fetchMyMaps(maps));
      dispatch(loadMyMapsEnd());
    },

    fetchFollowingMaps: async () => {
      dispatch(loadFollowingMapsStart());
      const client = new ApiClient();
      let response = await client.fetchFollowingMaps();
      let maps = await response.json();
      dispatch(fetchFollowingMaps(maps));
      dispatch(loadFollowingMapsEnd());
    },

    fetchUserLikes: async () => {
      const client = new ApiClient();
      let response = await client.fetchUserLikes();
      let likes = await response.json();
      dispatch(fetchUserLikes(likes));
    },

    clearProfileState: () => {
      dispatch(clearProfileState());
    },

    handleEditProfileButtonClick: currentUser => {
      if (currentUser.isAnonymous) {
        dispatch(openSignInRequiredDialog());
        return;
      }
      dispatch(openEditProfileDialog());
    },

    handleFollowingClick: () => {
      dispatch(openFollowingMapsDialog());
    }
  };
};

export default React.memo(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Profile)
);
