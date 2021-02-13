import { createSlice } from "@reduxjs/toolkit";
import api from "api";
import { BACKEND_URI } from "config";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useAlerts } from "useAlerts";
import { resetTweets } from "features/tweets/tweetSlice";

const initialState = {
  user: null,
  isAuthenticating: true,
  isAuthenticated: false,
  isLoggingOut: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginPending: (state) => {
      state.isAuthenticating = true;
    },
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticating = false;
      state.isAuthenticated = true;
    },
    loginFailure: (state, action) => {
      state.user = action.payload;
      state.isAuthenticating = false;
      state.isAuthenticated = false;
    },
    checkPending: (state) => {
      state.isAuthenticating = true;
    },
    checkSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticating = false;
      state.isAuthenticated = true;
    },
    checkFailure: (state, action) => {
      state.user = action.payload;
      state.isAuthenticating = false;
      state.isAuthenticated = false;
    },
    logoutPending: (state) => {
      state.isLoggingOut = true;
    },
    logoutSuccess: () => ({ ...initialState, isAuthenticating: false }),
    logoutFailure: (state) => {
      state.isLoggingOut = false;
    },
  },
});

// ACTION CREATORS
export const {
  loginPending,
  loginSuccess,
  loginFailure,
  checkPending,
  checkSuccess,
  checkFailure,
  logoutPending,
  logoutSuccess,
  logoutFailure,
} = authSlice.actions;

export const useLogout = () => {
  const { errorAlert, successAlert } = useAlerts();
  const dispatch = useDispatch();
  return () => {
    dispatch(logoutPending());
    api()
      .post(`${BACKEND_URI}/v1/auth/logout`)
      .then(() => {
        successAlert({ title: "Logged out!" });
        dispatch(resetTweets());
        dispatch(logoutSuccess());
      })
      .catch((e) => {
        dispatch(logoutFailure());
        errorAlert({
          title: "Error while trying to login!",
          description: e?.description,
        });
      });
  };
};

// REDUX ASYNC ACTIONS
export const useCheck = () => {
  const dispatch = useDispatch();
  const { errorAlert, successAlert } = useAlerts();
  const history = useHistory();
  return () => {
    dispatch(checkPending());
    api({ isHandlerDisabled: true })
      .post(`${BACKEND_URI}/v1/auth/check`)
      .then((res) => {
        if (res.data && res.data.user) {
          dispatch(checkSuccess(res.data.user));
          if (!window?.location || window?.location?.pathname === "/") {
            history.replace("/d");
            successAlert({ title: "logged in successfully!" });
          }
        } else {
          dispatch(checkFailure());
          if (!window?.location || window?.location?.pathname !== "/") {
            history.replace("/");
            errorAlert({
              title: "Error while trying to login!",
              description: res.message || res.data.message,
            });
          }
        }
      })
      .catch((e) => {
        console.log(e);
        dispatch(checkFailure());
        if (!window?.location || window?.location?.pathname !== "/") {
          errorAlert({
            title: "Error while trying to login!",
            description: e?.description,
          });
          history.replace("/");
        }
      });
  };
};

export const useLogin = () => {
  const dispatch = useDispatch();
  const { errorAlert } = useAlerts();
  return () => {
    dispatch(loginPending());
    api()
      .post(`${BACKEND_URI}/v1/auth/twitter/reverse`)
      .then((res) => {
        if (res.data && res.data.oauth_token) {
          window.location.href =
            "https://api.twitter.com/oauth/authenticate?oauth_token=" +
            res.data.oauth_token;
        } else {
          dispatch(loginFailure());
          errorAlert({
            title: "Error while trying to login!",
            description: res.message,
          });
        }
      })
      .catch((e) => {
        dispatch(loginFailure());
        errorAlert({
          title: "Error while trying to login!",
          description: e?.description,
        });
      });
  };
};

// REDUX SELECTORS
export const selectAuth = (state) => state.auth;
export const selectIsAuthenticating = (state) => state.auth.isAuthenticating;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export default authSlice.reducer;
