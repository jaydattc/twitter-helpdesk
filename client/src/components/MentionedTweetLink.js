import { Avatar, Box, Button, Flex, Text } from "@chakra-ui/react";
import React from "react";
import { NavLink } from "react-router-dom";

const MentionedTweetLink = ({ tweet }) => {
  return (
    <Button
      as={NavLink}
      to={`/d/mentions/${tweet.id}`}
      activeStyle={{ backgroundColor: "#EDF2F7" }}
      variant="outline"
      d="flex"
      py="2rem"
      px="1rem"
      bg={"white"}
      my="0.25rem"
      _first={{ mt: "0px !important" }}
      justifyContent="space-between"
      textOverflow="ellipsis"
      overflow="hidden"
      whiteSpace="nowrap"
      border="2px solid"
    >
      <Flex w="100%">
        <Avatar src={tweet.user.profile_image_url} size="sm" />
        <Box ml="0.5rem" w="calc(100% - 3rem)">
          <Text isTruncated fontSize="0.875rem" fontWeight="semibold">
            {tweet.user.name}
          </Text>
          <Text isTruncated fontSize="0.75rem">
            {tweet.text}
          </Text>
        </Box>
      </Flex>
    </Button>
  );
};

export default MentionedTweetLink;
