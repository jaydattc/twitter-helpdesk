import { createSlice } from "@reduxjs/toolkit";
import api from "api";
import { BACKEND_URI } from "config";

export const counterSlice = createSlice({
  name: "auth",
  initialState: {
    user: {
      name: "",
      id: "",
    },
    isAuthenticating: false,
    isAuthenticated: false,
  },
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
  },
});

// ACTION CREATORS
export const {
  loginPending,
  loginSuccess,
  loginFailure,
} = counterSlice.actions;

// REDUX ASYNC ACTIONS
export const login = () => (dispatch) => {
  dispatch(loginPending());
  api()
    .post(`${BACKEND_URI}/v1/auth/twitter/reverse`)
    .then((res) => {
      console.log(res.data.oauth_token);
      if (res.data && res.data.oauth_token) {
        dispatch(loginSuccess(res.data));
        window.location.href =
          "https://api.twitter.com/oauth/authenticate?oauth_token=" +
          res.data.oauth_token;
      } else {
        dispatch(loginFailure());
        window.alert("ERROR : " + res.message);
      }
    })
    .catch((e) => {
      dispatch(loginFailure());
      window.alert("ERROR : " + e?.description);
    });
};

// REDUX SELECTORS
export const selectAuth = (state) => state.auth;
export const selectIsAuthenticating = (state) => state.auth.isAuthenticating;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export default counterSlice.reducer;
