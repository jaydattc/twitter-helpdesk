import React from "react";
import {
  Heading,
  Flex,
  Popover,
  PopoverTrigger,
  Avatar,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  Text,
  Button,
  Box,
  Link,
  PopoverFooter,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { useLogout, selectAuth } from "features/auth/authSlice";

const Navbar = (props) => {
  const { user, isAuthenticated } = useSelector(selectAuth);
  const logout = useLogout();
  return (
    <Flex
      as="nav"
      alignItems="center"
      justifyContent="space-between"
      wrap="wrap"
      height="4rem"
      px="2rem"
      maxW="6xl"
      mx="auto"
      color="gray.700"
      borderBottom="1px solid"
      borderColor="gray.200"
      {...props}
    >
      <Flex alignItems="center">
        <Heading as="h1" size="lg">
          Twitter Helpdesk
        </Heading>
      </Flex>
      {isAuthenticated && (
        <Popover placement="bottom-start">
          <PopoverTrigger>
            <Avatar src={user?.profile_image_url} size="sm" />
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverBody>
              <Link
                color="blue.700"
                target="_blank"
                href={`https://twitter.com/${user.screen_name}`}
                d="flex"
                alignItems="center"
              >
                <Avatar src={user?.profile_image_url} size="md" />
                <Box ml="0.5rem">
                  <Text fontWeight="bold" fontSize="md">
                    {user?.name}
                  </Text>
                  <Text
                    color="gray.600"
                    fontSize="sm"
                    children={`@${user?.screen_name}`}
                  />
                </Box>
              </Link>
            </PopoverBody>
            <PopoverFooter d="flex" flexDir="row-reverse">
              <Button ml="auto" onClick={() => logout()}>
                Logout
              </Button>
            </PopoverFooter>
          </PopoverContent>
        </Popover>
      )}
    </Flex>
  );
};

export default Navbar;
