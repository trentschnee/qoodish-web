import {
  SIGN_IN,
  SIGN_OUT,
  FETCH_REGISTRATION_TOKEN,
  FETCH_MY_PROFILE
} from '../actionTypes';

const initialState = {
  currentUser: null,
  registrationToken: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SIGN_IN:
      return Object.assign({}, state, {
        currentUser: action.payload.user,
        registrationToken: null
      });
    case SIGN_OUT:
      return Object.assign({}, state, {
        currentUser: null,
        registrationToken: null
      });
    case FETCH_REGISTRATION_TOKEN:
      return Object.assign({}, state, {
        registrationToken: action.payload.token
      });
    case FETCH_MY_PROFILE:
      return Object.assign({}, state, {
        currentUser: action.payload.user
      });
    default:
      return state;
  }
};

export default reducer;
