import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./commons/Header/Header.jsx";
import Footer from "./commons/Footer/Footer.jsx";
import { Toolbar } from "@mui/material";
const Layout = () => {
  return (
    <>
      <Header />
      <Toolbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
