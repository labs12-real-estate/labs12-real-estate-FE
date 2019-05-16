import { Auth } from 'aws-amplify';
import { makeHouse } from './houseActions';
import {
  OPEN_MODAL,
  CLOSE_MODAL,
  SIGN_IN_FAIL,
  SIGN_IN_FETCH,
  SIGN_IN_SUCCESS,
  SIGN_UP_FAIL,
  SIGN_UP_FETCH,
  SIGN_UP_PENDING,
  CONFIRM_FETCH,
  CONFIRM_FAIL,
  SIGN_UP_SUCCESS,
  SIGN_OUT_FETCH,
  SIGN_OUT_SUCCESS,
  SIGN_OUT_FAIL,
  IS_LOGGED_IN,
  IS_LOGGED_OUT,
  TOGGLE_FORGOT_PASSWORD,
  FORGOT_PASSWORD_FETCH,
  FORGOT_PASSWORD_FAIL,
  FORGOT_PASSWORD_PENDING,
  FORGOT_PASSWORD_SUCCESS,
  UPDATE_USER_EMAIL_FETCH,
  UPDATE_USER_EMAIL_PENDING,
  UPDATE_USER_EMAIL_FAIL,
  UPDATE_USER_EMAIL_CONFIRM_FETCH,
  UPDATE_USER_EMAIL_SUCCESS,
  UPDATE_USER_EMAIL_CONFIRM_FAIL,
  UPDATE_USER_EMAIL_CANCEL_FETCH,
  UPDATE_USER_EMAIL_CANCEL_SUCCESS,
  UPDATE_USER_EMAIL_CANCEL_FAIL,
  UPDATE_USER_FULLNAME_FETCH,
  UPDATE_USER_FULLNAME_SUCCESS,
  UPDATE_USER_FULLNAME_FAIL
} from './index';

export const openModal = e => {
  e.preventDefault();
  return {
    type: OPEN_MODAL,
    payload: true
  };
};

export const closeModal = e => {
  e.preventDefault();
  return {
    type: CLOSE_MODAL,
    payload: false
  };
};

export const signIn = (creds, history, houseInput) => dispatch => {
  dispatch({
    type: SIGN_IN_FETCH
  });

  return Auth.signIn(creds)
    .then(user => {
      dispatch({
        type: SIGN_IN_SUCCESS,
        payload: {
          username: user.username,
          name: user.attributes.name,
          email: user.attributes.email
        }
      });
      houseInput ? makeHouse({ id: user.username, houseInput }, history)(dispatch) : history.push('/overview');
    })
    .catch(error => {
      dispatch({
        type: SIGN_IN_FAIL,
        payload: error
      });
    });
};

export const signUp = user => dispatch => {
  dispatch({
    type: SIGN_UP_FETCH
  });

  Auth.signUp(user)
    .then(_user => {
      dispatch({
        type: SIGN_UP_PENDING
      });
    })
    .catch(error => {
      dispatch({
        type: SIGN_UP_FAIL,
        payload: error
      });
    });
};

export const confirmSignUp = ({ username, password, code }, history, houseInput) => dispatch => {
  dispatch({
    type: CONFIRM_FETCH
  });

  return Auth.confirmSignUp(username, code)
    .then(user => {
      dispatch({
        type: SIGN_UP_SUCCESS,
        payload: user
      });
      return signIn({ username, password }, history, houseInput)(dispatch);
    })
    .catch(error => {
      dispatch({
        type: CONFIRM_FAIL,
        payload: error
      });
    });
};

export const signOut = history => dispatch => {
  dispatch({
    type: SIGN_OUT_FETCH
  });

  Auth.signOut()
    .then(data => {
      dispatch({
        type: SIGN_OUT_SUCCESS
      });
      history.push('/');
      localStorage.clear();
    })
    .catch(error => {
      dispatch({
        type: SIGN_OUT_FAIL,
        payload: error
      });
    });
};

export const isLoggedInAction = () => dispatch => {
  Auth.currentSession()
    .then(session => {
      const { name, email, 'cognito:username': username } = session.idToken.payload;
      dispatch({
        type: IS_LOGGED_IN,
        payload: { name, email, username }
      });
    })
    .catch(error => {
      dispatch({
        type: IS_LOGGED_OUT
      });
    });
};

export const toggleForgotPassword = () => {
  return {
    type: TOGGLE_FORGOT_PASSWORD
  };
};

export const forgotPassword = (e, { username }) => dispatch => {
  e.preventDefault();
  dispatch({
    type: FORGOT_PASSWORD_FETCH
  });

  Auth.forgotPassword(username)
    .then(_user => {
      dispatch({
        type: FORGOT_PASSWORD_PENDING
      });
    })
    .catch(error => {
      dispatch({
        type: FORGOT_PASSWORD_FAIL,
        payload: error
      });
    });
};

export const confirmForgotPassword = (e, { username, new_password, code }) => dispatch => {
  e.preventDefault();
  dispatch({
    type: CONFIRM_FETCH
  });

  return Auth.forgotPasswordSubmit(username, code, new_password)
    .then(_user => {
      dispatch({
        type: FORGOT_PASSWORD_SUCCESS
      });
    })
    .catch(error => {
      dispatch({
        type: CONFIRM_FAIL,
        payload: error
      });
    });
};

export const updateUserEmail = (user, email) => dispatch => {
  Auth.updateUserAttributes(user, { email })
    .then(() => {
      dispatch({
        type: UPDATE_USER_EMAIL_PENDING,
        payload: email
      });
    })
    .catch(error => {
      dispatch({
        type: UPDATE_USER_EMAIL_FAIL,
        payload: error
      });
    });
};

export const cancelUpdateUserEmail = () => async (dispatch, getState) => {
  dispatch({
    type: UPDATE_USER_EMAIL_CANCEL_FETCH
  });
  const { email } = getState().authReducer.user;
  const user = await Auth.currentAuthenticatedUser();
  console.log({ user, email });
  await Auth.updateUserAttributes(user, { email });
  dispatch({
    type: UPDATE_USER_EMAIL_CANCEL_SUCCESS
  });
};

export const confirmUserEmail = confirmationCode => dispatch => {
  dispatch({
    type: UPDATE_USER_EMAIL_CONFIRM_FETCH
  });
  Auth.verifyCurrentUserAttributeSubmit('email', confirmationCode)
    .then(() => {
      dispatch({
        type: UPDATE_USER_EMAIL_SUCCESS
      });
    })
    .catch(error => {
      dispatch({
        type: UPDATE_USER_EMAIL_CONFIRM_FAIL,
        payload: error
      });
    });
};

export const updateUserFullName = (user, name) => dispatch => {
  Auth.updateUserAttributes(user, { name })
    .then(() => {
      dispatch({
        type: UPDATE_USER_FULLNAME_SUCCESS,
        payload: name
      });
    })
    .catch(error => {
      dispatch({
        type: UPDATE_USER_FULLNAME_FAIL,
        payload: error
      });
    });
};

export const updateUserAttributes = ({ email, name }) => async dispatch => {
  // Conditionally dispatch that we are initiating the attribute update.
  email &&
    dispatch({
      type: UPDATE_USER_EMAIL_FETCH
    });
  name &&
    dispatch({
      type: UPDATE_USER_FULLNAME_FETCH
    });
  const user = await Auth.currentAuthenticatedUser();
  // We need to branch this into two handlers because the confirmation step
  // will be bypassed if only the user's name is updated.
  email && updateUserEmail(user, email)(dispatch);
  name && updateUserFullName(user, name)(dispatch);
};
