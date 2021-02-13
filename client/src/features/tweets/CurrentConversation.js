import {
  Avatar,
  Box,
  Button,
  Code,
  Flex,
  Input,
  InputGroup,
  InputLeftAddon,
  Link,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Linkify from "react-linkify";
import {
  selectCurrentThread,
  selectIsFetchingTweets,
  selectTweet,
  selectTweets,
  useGetCurrentThread,
  useReplyToTweet,
} from "./tweetSlice";
import calendar from "dayjs/plugin/calendar";
import dayjs from "dayjs";

dayjs.extend(calendar);

const Tweet = ({ tweet }) => {
  return (
    <Box
      d="flex"
      py="0.75rem"
      px="1.5rem"
      bg="white"
      my="0.25rem"
      _first={{ mt: "0px !important" }}
      justifyContent="space-between"
      alignItems="center"
      textOverflow="ellipsis"
      overflow="hidden"
      whiteSpace="nowrap"
    >
      <Flex w="100%" alignItems="center">
        <Link
          color="blue.700"
          target="_blank"
          href={`https://twitter.com/${tweet.user.screen_name}`}
        >
          <Avatar src={tweet.user.profile_image_url} size="sm" />
        </Link>
        <Box ml="0.5rem" w="calc(100% - 3rem)">
          <Text isTruncated fontSize="0.875rem" fontWeight="semibold">
            <Link
              color="blue.700"
              target="_blank"
              href={`https://twitter.com/${tweet.user.screen_name}`}
            >
              {tweet.user.name}
            </Link>
          </Text>
          <Text overflowWrap="break-word" fontSize="0.75rem">
            <Linkify
              componentDecorator={(href, text, key) => (
                <Link color="blue.700" target="_blank" href={href} key={key}>
                  {text}
                </Link>
              )}
            >
              {tweet.text}
            </Linkify>
          </Text>
        </Box>
      </Flex>
      <Text
        fontSize="xs"
        mb="auto"
        children={dayjs().calendar(dayjs(tweet.created_at))}
      />
    </Box>
  );
};
const CurrentConversation = () => {
  const { id } = useParams();

  const { data: currentThreadTweets, originalTweet } = useSelector(
    selectCurrentThread
  );
  const { data: tweets, isReplying } = useSelector(selectTweet);
  const isFetchingTweets = useSelector(selectIsFetchingTweets);
  const getCurrentThread = useGetCurrentThread();
  const { replyText, setReplyText, replyToTweet } = useReplyToTweet();

  const handleSubmit = (e) => {
    e.preventDefault();
    replyToTweet();
  };

  useEffect(() => {
    if (!!id && !isFetchingTweets && tweets?.length > 0) {
      getCurrentThread(id, tweets);
      setReplyText("");
    }
  }, [id, isFetchingTweets, tweets]);

  if (isFetchingTweets)
    return (
      <Text color="gray.700" textAlign="center" mt="4rem">
        Loading...
      </Text>
    );

  if (!id)
    return (
      <Text color="gray.700" textAlign="center" mt="4rem">
        Select a tweet to continue.
      </Text>
    );
  return (
    <>
      {currentThreadTweets.map((tweet) => (
        <Tweet key={tweet.id} tweet={tweet} />
      ))}
      <Flex
        as="form"
        onSubmit={handleSubmit}
        w="100%"
        position="absolute"
        bottom="0"
        p="0.5rem"
      >
        <InputGroup>
          <InputLeftAddon
            children={`@${originalTweet?.user?.screen_name}`}
            bg="transparent"
            fontSize="sm"
            borderRight="none"
          />
          <Input
            value={replyText}
            disabled={!!isReplying}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={`Reply to ${getCurrentThread?.user?.name ?? "user"}`}
          />
        </InputGroup>
        <Button
          disabled={!replyText || !!isReplying}
          type="submit"
          ml="0.5rem"
          bg="rgb(29, 161, 242)"
          _hover={{ bg: "rgba(29, 161, 242, 0.8)" }}
          color="white"
        >
          Reply
        </Button>
      </Flex>
    </>
  );
};
export default CurrentConversation;
