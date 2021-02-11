import React from "react";
import Navbar from "./Navbar";
import PageContainer from "./PageContainer";

const Layout = ({ children }) => (
  <>
    <Navbar />
    <PageContainer>{children}</PageContainer>
  </>
);
export default Layout;
