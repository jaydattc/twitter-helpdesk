import { CircularProgress, Flex } from "@chakra-ui/react";
import MentionedTweetLink from "components/MentionedTweetLink";
import React, { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  useFetchTweets,
  selectTweets,
  selectIsFetchingTweets,
  tweetTypes,
} from "./tweetSlice";

const MentionedTweets = () => {
  const tweets = useSelector(selectTweets);
  const isFetchingMentionedTweets = useSelector(selectIsFetchingTweets);
  const getTweets = useFetchTweets();

  useEffect(() => {
    getTweets();
  }, []);

  const tweetsWithReplies = useMemo(
    () => tweets?.filter((tweet) => tweet.in_reply_to_status_id === null) ?? [],
    [tweets]
  );

  return (
    <Flex
      flexDir="column"
      width="25%"
      p="1rem 0.5rem"
      maxH="calc(100vh - 4rem)"
      overflowY="auto"
    >
      {isFetchingMentionedTweets && (
        <CircularProgress mx="auto" mt="4rem" isIndeterminate />
      )}
      {!isFetchingMentionedTweets &&
        tweetsWithReplies?.map((tweet) => (
          <MentionedTweetLink key={tweet.id} tweet={tweet} />
        ))}
    </Flex>
  );
};
export default MentionedTweets;
