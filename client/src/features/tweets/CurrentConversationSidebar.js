import { Link, Avatar, Code, Flex, Text } from "@chakra-ui/react";
import React from "react";
import { useSelector } from "react-redux";
import { selectCurrentThread, selectIsFetchingTweets } from "./tweetSlice";

const CurrentConversationSidebar = () => {
  const { originalTweet } = useSelector(selectCurrentThread);
  const isFetchingTweets = useSelector(selectIsFetchingTweets);

  return (
    <Flex
      flexDir="column"
      width="25%"
      borderRightRadius="lg"
      m="1rem 1rem 1rem 0px"
      borderLeft="none !important"
      border="2px solid"
      borderColor="gray.200"
      alignItems="center"
    >
      {(() => {
        if (isFetchingTweets)
          return (
            <Text color="gray.700" textAlign="center" mt="4rem">
              Loading...
            </Text>
          );
        if (!originalTweet)
          return (
            <Text color="gray.700" textAlign="center" mt="4rem">
              Select a tweet to view user details.
            </Text>
          );
        return (
          <>
            <Link
              mt="4rem"
              color="blue.700"
              target="_blank"
              href={`https://twitter.com/${originalTweet.user.screen_name}`}
              d="flex"
              flexDir="column"
              alignItems="center"
            >
              <Avatar src={originalTweet?.user?.profile_image_url} size="xl" />
              <Text mt="0.25rem" fontWeight="bold">
                {originalTweet?.user?.name}
              </Text>
              <Code children={`@${originalTweet?.user?.screen_name}`} />
            </Link>
          </>
        );
      })()}
    </Flex>
  );
};
export default CurrentConversationSidebar;
