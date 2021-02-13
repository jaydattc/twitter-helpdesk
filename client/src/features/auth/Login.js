import React, { useEffect } from "react";
import { Button, Box, Heading, Flex, Icon } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import FullscreenLoader from "components/FullscreenLoader";
import { useSelector } from "react-redux";
import { selectAuth, useLogin } from "./authSlice";
import { FaTwitter } from "react-icons/fa";
const Login = () => {
  const { isAuthenticated, isLoggingIn } = useSelector(selectAuth);
  const history = useHistory();
  const login = useLogin();

  useEffect(() => {
    if (isAuthenticated) {
      history.push("/d");
    }
  }, [isAuthenticated]);

  return (
    <Flex w="full" minH="100%" align="center" justifyContent="center">
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
        <Heading mb={4} textAlign="center" size="xl" letterSpacing={"-.1rem"}>
          Login
        </Heading>
        <Button
          variant="outline"
          width="full"
          onClick={() => login()}
          isLoading={isLoggingIn}
          color="white"
          py="1.5rem"
          leftIcon={<Icon as={FaTwitter} h="1.25rem" w="1.25rem" />}
          bg="rgb(29, 161, 242)"
          _hover={{ bg: "rgba(29, 161, 242, 0.8)" }}
          mt={4}
        >
          Sign In with Twitter
        </Button>
      </Box>
    </Flex>
  );
};

export default Login;
