import React from "react";
import {
  Button,
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import Person2Icon from "@mui/icons-material/Person2";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../../config/authContext.jsx";
import { useState, useEffect } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import logo from "../../assets/shopEasyLogo.png";
import { Link, NavLink, useNavigate } from "react-router-dom";

const Header = () => {
  const { login, isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    await logout();
    navigate("/", { replace: true });
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated]);

  return (
    <Box>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ ml: 1, flexGrow: 1 }}>
            <Box component={NavLink} to="/">
              <img
                src={logo}
                style={{
                  height: 60,
                  cursor: "pointer",
                }}
              />
            </Box>
          </Box>
          <Box display="flex" gap={8} sx={{ marginRight: 3 }}>
            <Button
              color="inherit"
              component={NavLink}
              to="/products"
              sx={{
                "&.active": {
                  borderBottom: "2px solid white",
                  borderRadius: 0,
                },
              }}
            >
              Products
            </Button>

            {!isAuthenticated ? (
              <Button
                color="inherit"
                onClick={() => (isAuthenticated ? logout() : login())}
              >
                Login
              </Button>
            ) : (
              <Box sx={{ cursor: "pointer" }}>
                <Box
                  onClick={handleOpen}
                  display="flex"
                  gap={8}
                  sx={{ marginTop: 1 }}
                >
                  <Typography>{user?.name}</Typography>
                </Box>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <MenuItem
                    component={NavLink}
                    to="/profile"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      "&:hover svg": {
                        color: "primary.main",
                      },
                    }}
                  >
                    <Person2Icon />
                    My Profile
                  </MenuItem>

                  <MenuItem
                    onClick={handleLogout}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      "&:hover svg": {
                        color: "error.main",
                      },
                    }}
                  >
                    <LogoutIcon />
                    Logout
                  </MenuItem>
                </Menu>
              </Box>
            )}

            <IconButton color="inherit" component={NavLink} to="/cart">
              <ShoppingCartIcon />
              <Typography>Cart</Typography>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
