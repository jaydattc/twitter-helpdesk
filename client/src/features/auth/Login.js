import React, { useEffect } from "react";
import { Button, Box, Heading, Flex } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import FullscreenLoader from "components/FullscreenLoader";
import { useDispatch, useSelector } from "react-redux";
import { login, selectAuth } from "./authSlice";

const Login = () => {
  const { isAuthenticated, isLoggingIn } = useSelector(selectAuth);
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      history.push("/d");
    }
  }, []);

  return (
    <Flex w="full" h="100%" align="center" justifyContent="center">
      <FullscreenLoader open={isLoggingIn} />
      <Box
        p={8}
        minW="320px"
        maxWidth="500px"
        borderWidth={1}
        borderRadius={8}
        my="10%"
        boxShadow="sm"
        bg="white"
      >
        <Heading my={4} textAlign="center" size="xl" letterSpacing={"-.1rem"}>
          Login
        </Heading>
        <Button
          variant="outline"
          width="full"
          onClick={() => dispatch(login())}
          isLoading={isLoggingIn}
          mt={4}
        >
          Sign In with Twitter
        </Button>
      </Box>
    </Flex>
  );
};

export default Login;
