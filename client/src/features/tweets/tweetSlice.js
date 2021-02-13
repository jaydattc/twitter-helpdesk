import { createSlice } from "@reduxjs/toolkit";
import api from "api";
import { BACKEND_URI } from "config";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAlerts } from "useAlerts";
import { createQuery } from "utils/createQuery";

const initialState = {
  currentUser: {
    isFetching: false,
    data: {},
  },
  currentThread: {
    originalTweet: null,
    isFetching: false,
    data: [],
  },
  notifyThreadList: {},
  data: [],
  isFetching: false,
  isReplying: false,
};

export const tweetSlice = createSlice({
  name: "tweets",
  initialState,
  reducers: {
    reset: () => initialState,
    fetchTweetsPending: (state) => {
      state.isFetching = true;
    },
    fetchTweetsSuccess: (state, action) => {
      state.data = action.payload;
      state.isFetching = false;
    },
    fetchTweetsFailure: (state, action) => {
      state.data = action.payload;
      state.isFetching = false;
    },
    getCurrentThreadPending: (state) => {
      state.currentThread.isFetching = true;
    },
    getCurrentThreadSuccess: (state, action) => {
      state.currentThread.data = action.payload.data;
      state.currentThread.originalTweet = action.payload.originalTweet;
      state.currentThread.isFetching = false;
    },
    getCurrentThreadFailure: (state, action) => {
      state.currentThread.data = [];
      state.currentThread.isFetching = false;
    },
    replyToTweetPending: (state) => {
      state.isReplying = true;
    },
    replyToTweetSuccess: (state, action) => {
      state.data = [...state.data, action.payload].sort(
        (tweetA, tweetB) => parseInt(tweetA.id) < parseInt(tweetB.id)
      );
      state.isReplying = false;
    },
    replyToTweetFailure: (state, action) => {
      state.isReplying = false;
    },
    fetchCurrentUserPending: (state) => {
      state.currentUser.isFetching = true;
    },
    fetchCurrentUserSuccess: (state, action) => {
      state.currentUser.data = action.payload;
      state.currentUser.isFetching = false;
    },
    fetchCurrentUserFailure: (state, action) => {
      state.currentUser.data = null;
      state.currentUser.isFetching = false;
    },
    addToNotifyThreadList: (state, action) => {
      if (state.notifyThreadList[action.payload.id])
        state.notifyThreadList[action.payload.id].tweetCount++;
      else state.notifyThreadList[action.payload.id] = action.payload;
    },
  },
});

// ACTION CREATORS
export const {
  handleNewReplies,
  fetchTweetsPending,
  fetchTweetsSuccess,
  fetchTweetsFailure,
  getCurrentThreadPending,
  getCurrentThreadSuccess,
  getCurrentThreadFailure,
  fetchCurrentUserPending,
  fetchCurrentUserSuccess,
  fetchCurrentUserFailure,
  replyToTweetPending,
  replyToTweetSuccess,
  replyToTweetFailure,
  addToNotifyThreadList,
  reset: resetTweets,
} = tweetSlice.actions;

// REDUX ASYNC ACTIONS
export const useHandleRealTimeTweetInsert = () => {
  const dispatch = useDispatch();
  const tweets = useSelector(selectTweets);
  return (tweet) => {
    dispatch(replyToTweetSuccess(tweet));

    function findMentionedTweet(_tweet) {
      if (!_tweet.in_reply_to_status_id) return _tweet;
      const inReplyToStatus = tweets.find(
        (x) => x.id == _tweet.in_reply_to_status_id
      );
      if (!inReplyToStatus) return _tweet;
      return findMentionedTweet(inReplyToStatus);
    }
    const mentionedParentTweet = findMentionedTweet(tweet);

    dispatch(
      addToNotifyThreadList({ id: mentionedParentTweet.id, tweetCount: 0 })
    );
  };
};
export const useGetCurrentThread = () => {
  const dispatch = useDispatch();
  const { errorAlert } = useAlerts();
  return async (tweetId, tweets) => {
    try {
      dispatch(getCurrentThreadPending());
      const tweetsFromThread = [];
      const tweetThread = [...tweets].reverse().filter((tweet) => {
        // using == (doubleEqual) as the tweet.id in DB is a string and in_reply_to_status_id is Int64
        if (tweetId == tweet.id || tweetId == tweet.in_reply_to_status_id) {
          tweetsFromThread.push(tweet.id);
          return true;
        } else {
          if (
            tweetsFromThread.some(
              (tweetId) => tweetId == tweet.in_reply_to_status_id
            )
          ) {
            tweetsFromThread.push(tweet.id);
            return true;
          }
          return false;
        }
      });
      const originalTweet = tweets.find((tweet) => tweet.id == tweetId);
      dispatch(getCurrentThreadSuccess({ data: tweetThread, originalTweet }));
    } catch (e) {
      console.log(e);
      dispatch(getCurrentThreadFailure());
      errorAlert({ title: "Error while fetching the tweet thread!" });
    }
  };
};

export const useFetchTweets = () => {
  const dispatch = useDispatch();
  const { errorAlert } = useAlerts();
  return (options) => {
    dispatch(fetchTweetsPending());
    api()
      .get(createQuery(`${BACKEND_URI}/v1/twitter/tweets`, options))
      .then((res) => {
        if (res.data) {
          dispatch(fetchTweetsSuccess(Object.values(res.data)));
        } else {
          dispatch(fetchTweetsFailure());
          errorAlert({
            title: "Error while trying fetch tweets!",
            description: res.message || res.data.message,
          });
        }
      })
      .catch((e) => {
        dispatch(fetchTweetsFailure());
        errorAlert({
          title: "Error while trying fetch tweets!",
          description: e?.description,
        });
      });
  };
};

export const useReplyToTweet = () => {
  const dispatch = useDispatch();
  const { errorAlert } = useAlerts();
  const { originalTweet } = useSelector(selectCurrentThread);
  const [replyText, setReplyText] = useState("");
  const replyToTweet = (options) => {
    dispatch(replyToTweetPending());
    api()
      .post(`${BACKEND_URI}/v1/twitter/reply`, {
        status: `@${originalTweet?.user?.screen_name} ${replyText}`,
        in_reply_to_status_id: originalTweet?.id_str,
      })
      .then((res) => {
        if (res.data) {
          dispatch(replyToTweetSuccess(res.data));
          setReplyText("");
        } else {
          dispatch(replyToTweetFailure());
          errorAlert({
            title: "Error while trying reply tweet!",
            description: res.message || res.data.message,
          });
        }
      })
      .catch((e) => {
        dispatch(replyToTweetFailure());
        errorAlert({
          title: "Error while trying reply tweet!",
          description: e?.description,
        });
      });
  };
  return {
    replyText,
    setReplyText,
    replyToTweet,
  };
};

// REDUX SELECTORS
export const selectTweet = (state) => state.tweets;
export const selectTweets = (state) => state.tweets?.data;
export const selectCurrentThread = (state) => state.tweets?.currentThread;
export const selectIsFetchingTweets = (state) => state.tweets?.isFetching;
export const tweetTypes = {
  mentionedTweets: "mentioned-tweets",
  userReplies: "user-replies",
};

export default tweetSlice.reducer;
