import { Box } from "@chakra-ui/react";
import React from "react";

const PageContainer = ({ children, ...props }) => (
  <Box
    w="100%"
    minH="calc(100vh - 4rem)"
    bg="gray.100"
    d="flex"
    flexDirection="column"
    alignItems="center"
    {...props}
  >
    {children}
  </Box>
);

export default PageContainer;
