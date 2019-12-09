import {
  FETCH_SPOT,
  FETCH_SPOT_REVIEWS,
  CLEAR_SPOT_STATE,
  CREATE_REVIEW,
  EDIT_REVIEW,
  DELETE_REVIEW,
  LOCATION_CHANGE
} from '../actionTypes';

const initialState = {
  currentSpot: undefined,
  spotReviews: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SPOT:
      return Object.assign({}, state, {
        currentSpot: action.payload.spot
      });
    case FETCH_SPOT_REVIEWS:
      return Object.assign({}, state, {
        spotReviews: action.payload.reviews
      });
    case CREATE_REVIEW:
      return Object.assign({}, state, {
        spotReviews: [action.payload.review, ...state.spotReviews]
      });
    case EDIT_REVIEW:
      if (state.spotReviews.length === 0) {
        return state;
      } else {
        let index = state.spotReviews.findIndex(review => {
          return review.id == action.payload.review.id;
        });
        let currentReview = state.spotReviews[index];
        if (!currentReview) {
          return state;
        }

        return Object.assign({}, state, {
          spotReviews: [
            ...state.spotReviews.slice(0, index),
            action.payload.review,
            ...state.spotReviews.slice(index + 1)
          ]
        });
      }
    case DELETE_REVIEW:
      if (state.spotReviews.length === 0) {
        return state;
      }

      let rejected = state.spotReviews.filter(review => {
        return review.id != action.payload.id;
      });
      return Object.assign({}, state, {
        spotReviews: rejected
      });
    case CLEAR_SPOT_STATE:
      return Object.assign({}, state, {
        spotLoading: false,
        currentSpot: undefined,
        spotReviews: []
      });
    default:
      return state;
  }
};

export default reducer;
