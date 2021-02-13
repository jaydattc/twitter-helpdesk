import { configureStore } from "@reduxjs/toolkit";
import authReducer from "features/auth/authSlice";
import tweetSlice from "features/tweets/tweetSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    tweets: tweetSlice
  },
});
