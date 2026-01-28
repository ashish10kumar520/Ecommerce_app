import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import { Link as RouterLink } from "react-router-dom";

const linkStyle = {
  display: "block",
  textDecoration: "none",
  color: "inherit",
  fontSize: "0.9rem",
  cursor: "pointer",
  mb: 0.5,
  "&:hover": {
    textDecoration: "underline",
  },
};

const iconStyle = {
  color: "white",
  fontSize: "1.6rem",
  cursor: "pointer",
  transition: "0.3s",
  "&:hover": {
    color: "#ffeb3b",
    transform: "scale(1.15)",
  },
};

const Footer = () => {
  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "#1976d2",
        color: "white",
        py: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          px: 20,
        }}
      >
        <Box sx={{ textAlign: "left" }}>
          <Typography
            variant="subtitle2"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            Resources
          </Typography>

          <Typography component={RouterLink} to="/aboutUs" sx={linkStyle}>
            About Us
          </Typography>
          <Typography component={RouterLink} to="/help" sx={linkStyle}>
            Help
          </Typography>
          <Typography component={RouterLink} to="/contact" sx={linkStyle}>
            Contact Us
          </Typography>
        </Box>

        <Box sx={{ textAlign: "left" }}>
          <Typography
            variant="subtitle2"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            Support
          </Typography>

          <Typography component={RouterLink} to="/faq" sx={linkStyle}>
            FAQ
          </Typography>
          <Typography component={RouterLink} to="/terms" sx={linkStyle}>
            Terms & Conditions
          </Typography>
          <Typography component={RouterLink} to="/privacy" sx={linkStyle}>
            Privacy Policy
          </Typography>
        </Box>
        <Box sx={{ textAlign: "left" }}>
          <Typography
            variant="subtitle2"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            Registered Office Address:
          </Typography>

          <Typography variant="body2">
            HSR Layout, Bangalore, Karnataka, India - 560102
          </Typography>
        </Box>
        <Box sx={{ textAlign: "left" }}>
          <Typography
            variant="subtitle2"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            Mail Us:
          </Typography>

          <Typography variant="body2">
            ShopEasy Pvt Ltd, HSR Layout, Bangalore, Karnataka, India - 560102
          </Typography>
        </Box>
      </Box>

      {/* 🔹 DIVIDER */}
      <Divider
        sx={{
          bgcolor: "rgba(255,255,255,0.4)",
          my: 2,
        }}
      />
      <Box sx={{ px: 20, display: "flex", justifyContent: "space-between" }}>
        <Typography variant="body2" align="center">
          © 2026 ShopEasy. All rights reserved.
        </Typography>
        <Box>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            Follow Us
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
            <Box
              component="a"
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={iconStyle}
            >
              <FacebookIcon />
            </Box>

            <Box
              component="a"
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={iconStyle}
            >
              <GitHubIcon />
            </Box>

            <Box
              component="a"
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={iconStyle}
            >
              <LinkedInIcon />
            </Box>

            <Box
              component="a"
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={iconStyle}
            >
              <TwitterIcon />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
