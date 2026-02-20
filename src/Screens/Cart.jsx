import React from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useCart } from "../config/CartContext";
import { useNavigate } from "react-router-dom";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(price));

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <Box sx={{ p: 3, maxWidth: 800, mx: "auto", textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Your cart is empty
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Add items from the Products page to see them here.
        </Typography>
        <Button variant="contained" onClick={() => navigate("/products")}>
          Browse Products
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1000, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Cart
      </Typography>

      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align="center">Price</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="right">Subtotal</TableCell>
              <TableCell align="right" />
            </TableRow>
          </TableHead>
          <TableBody>
            {cartItems.map((item) => {
              const subtotal = (item.price || 0) * (item.quantity || 1);
              return (
                <TableRow key={item.id ?? item.productId}>
                  <TableCell>
                    <Typography fontWeight="bold">{item.name}</Typography>
                    {item.description && (
                      <Typography variant="body2" color="text.secondary">
                        {item.description}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {formatPrice(item.price)}
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={() =>
                          updateQuantity(item.id ?? item.productId, (item.quantity || 1) - 1)
                        }
                      >
                        <RemoveIcon />
                      </IconButton>
                      <Typography component="span" sx={{ minWidth: 28, textAlign: "center" }}>
                        {item.quantity || 1}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() =>
                          updateQuantity(item.id ?? item.productId, (item.quantity || 1) + 1)
                        }
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell align="right">{formatPrice(subtotal)}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => removeFromCart(item.id ?? item.productId)}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Card sx={{ maxWidth: 360, ml: "auto" }}>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography fontWeight="bold">Total</Typography>
            <Typography fontWeight="bold">{formatPrice(cartTotal)}</Typography>
          </Box>
          <Button variant="contained" fullWidth size="large">
            Proceed to Checkout
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Cart;
