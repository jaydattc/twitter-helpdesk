import React, { useEffect } from "react";
import { Flex } from "@chakra-ui/react";
import CurrentConversation from "features/tweets/CurrentConversation";
import CurrentConversationSidebar from "features/tweets/CurrentConversationSidebar";
import MentionedTweets from "features/tweets/MentionedTweets";
import { Route, Switch } from "react-router-dom";
import { useHandleRealTimeTweetInsert } from "features/tweets/tweetSlice";
import { selectAuth } from "features/auth/authSlice";
import { useSelector } from "react-redux";
import SocketIoClient from "socket.io-client";
import { BACKEND_URI } from "config";

const Dashboard = () => {
  const { user } = useSelector(selectAuth);
  const handleRealTimeTweetInsert = useHandleRealTimeTweetInsert();
  useEffect(() => {
    const socket = SocketIoClient(BACKEND_URI, { withCredentials: true });
    socket.on("connect", async () => {
      socket.emit("register_screen_name", {
        screen_name: user.screen_name,
      });
      socket.on("tweets", (tweet) => {
        if (tweet.id) {
          handleRealTimeTweetInsert(tweet);
        }
      });
    });
    socket.on("disconnect", () => {
      socket.off("tweets");
      socket.removeAllListeners("tweets");
    });
    return () => socket.disconnect();
  }, []);

  return (
    <Flex
      w="full"
      flexDir="row"
      minH="calc(100vh - 4rem)"
      justifyContent="stretch"
      alignItems="stretch"
    >
      <MentionedTweets />
      <Flex
        flexDir="column"
        width="50%"
        m="1rem 0px"
        borderLeftRadius="lg"
        border="2px solid"
        position="relative"
        borderColor="gray.200"
      >
        <Switch>
          <Route path="/d/mentions/:id" component={CurrentConversation} />
          <Route path="/d" component={CurrentConversation} />
        </Switch>
      </Flex>
      <CurrentConversationSidebar />
    </Flex>
  );
};

export default Dashboard;
