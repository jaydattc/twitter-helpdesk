import React from "react";
import { Heading, Flex } from "@chakra-ui/react";

const Navbar = (props) => {
  return (
    <Flex
      as="nav"
      alignItems="center"
      justifyContent="space-between"
      wrap="wrap"
      height="4rem"
      borderBottom="1px solid rgb(224,224,224)"
      px="2rem"
      {...props}
    >
      <Flex alignItems="center">
        <Heading as="h1" size="lg">
          Twitter Helpdesk
        </Heading>
      </Flex>
    </Flex>
  );
};

export default Navbar;
