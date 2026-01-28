import { Box } from "@mui/material";
import { NavLink } from "react-router-dom";
import React from "react";
import cartImage from "../assets/cartImage.jpg";
import blackFridayImage from "../assets/blackFriday.jpg";
const Home = () => {
  return (
    <Box component={NavLink} to="">
      <img
        src={blackFridayImage}
        alt="ShopEasy Home"
        style={{ width: "100vw", height: "100vh", objectFit: "cover" }}
      />
      <img
        src={cartImage}
        alt="ShopEasy Home"
        style={{ width: "100vw", height: "100vh", objectFit: "cover" }}
      />
    </Box>
  );
};

export default Home;
