import { Box } from "@chakra-ui/react";
import React from "react";

const PageContainer = ({ children, ...props }) => (
  <Box
    w="100%"
    minH="calc(100vh - 4rem)"
    maxW="6xl"
    mx="auto"
    d="flex"
    flexDirection="column"
    alignItems="center"
    color="gray.700"
    {...props}
  >
    {children}
  </Box>
);

export default PageContainer;
