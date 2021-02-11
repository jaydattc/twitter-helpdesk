import { CircularProgress } from "@chakra-ui/react";
import styled from "@emotion/styled";
import React from "react";

const Overlay = styled.div`
  background: #ffffff;
  color: #666666;
  position: fixed;
  height: 100%;
  width: 100%;
  z-index: 5000;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.8;
`;

const FullscreenLoader = ({ open }) => {
  return (
    <>
      {open && (
        <Overlay>
          <CircularProgress isIndeterminate />
        </Overlay>
      )}
    </>
  );
};

export default FullscreenLoader;
