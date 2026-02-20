import React, { useState, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Grid,
  Chip,
  IconButton,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useCart } from "../config/CartContext";
import { useSnackbar } from "notistack";

const CATEGORIES = ["All", "Electronics", "Fashion", "Home", "Sports", "Books"];

const DUMMY_PRODUCTS = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    price: 2499,
    category: "Electronics",
    image: null,
    description: "Noise cancelling, 20hr battery",
    inStock: true,
  },
  {
    id: 2,
    name: "Smart Watch Pro",
    price: 4999,
    category: "Electronics",
    image: null,
    description: "Health tracking, 7-day battery",
    inStock: true,
  },
  {
    id: 3,
    name: "Cotton T-Shirt",
    price: 599,
    category: "Fashion",
    image: null,
    description: "100% cotton, multiple colors",
    inStock: true,
  },
  {
    id: 4,
    name: "Running Shoes",
    price: 3299,
    category: "Sports",
    image: null,
    description: "Lightweight, breathable",
    inStock: true,
  },
  {
    id: 5,
    name: "Desk Lamp LED",
    price: 899,
    category: "Home",
    image: null,
    description: "Adjustable brightness",
    inStock: true,
  },
  {
    id: 6,
    name: "4K Smart TV 55\"",
    price: 54999,
    category: "Electronics",
    image: null,
    description: "Ultra HD, Smart TV",
    inStock: false,
  },
  {
    id: 7,
    name: "Backpack",
    price: 1299,
    category: "Fashion",
    image: null,
    description: "Laptop compartment, water resistant",
    inStock: true,
  },
  {
    id: 8,
    name: "Yoga Mat",
    price: 699,
    category: "Sports",
    image: null,
    description: "Non-slip, 6mm thick",
    inStock: true,
  },
  {
    id: 9,
    name: "Coffee Maker",
    price: 2499,
    category: "Home",
    image: null,
    description: "Programmable, 12-cup",
    inStock: true,
  },
  {
    id: 10,
    name: "Novel - Best Seller",
    price: 399,
    category: "Books",
    image: null,
    description: "Paperback edition",
    inStock: true,
  },
];

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(price));

const ProductCard = ({ product, onAddToCart, onWishlistToggle, isWishlisted }) => {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "box-shadow 0.2s",
        "&:hover": { boxShadow: 4 },
      }}
    >
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="div"
          sx={{
            height: 180,
            bgcolor: "grey.200",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            No image
          </Typography>
        </CardMedia>
        <IconButton
          size="small"
          sx={{ position: "absolute", top: 8, right: 8, bgcolor: "background.paper" }}
          onClick={() => onWishlistToggle(product.id)}
        >
          {isWishlisted ? (
            <FavoriteIcon color="error" />
          ) : (
            <FavoriteBorderIcon />
          )}
        </IconButton>
        {!product.inStock && (
          <Chip
            label="Out of stock"
            color="warning"
            size="small"
            sx={{ position: "absolute", bottom: 8, left: 8 }}
          />
        )}
      </Box>
      <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Typography gutterBottom variant="subtitle2" color="text.secondary">
          {product.category}
        </Typography>
        <Typography fontWeight="bold" variant="subtitle1" gutterBottom>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {product.description}
        </Typography>
        <Typography variant="h6" color="primary" sx={{ mt: "auto" }}>
          {formatPrice(product.price)}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddShoppingCartIcon />}
          fullWidth
          disabled={!product.inStock}
          onClick={() => onAddToCart(product)}
          sx={{ mt: 1 }}
        >
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};

const Products = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const { addToCart } = useCart();
  const { enqueueSnackbar } = useSnackbar();

  const filteredProducts = useMemo(() => {
    let list = DUMMY_PRODUCTS.filter((p) => {
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(search.toLowerCase()));
      const matchCategory = category === "All" || p.category === category;
      return matchSearch && matchCategory;
    });
    if (sortBy === "priceLow") list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === "priceHigh") list = [...list].sort((a, b) => b.price - a.price);
    if (sortBy === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [search, category, sortBy]);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    enqueueSnackbar(`${product.name} added to cart`, { variant: "success" });
  };

  const handleWishlistToggle = (id) => {
    setWishlistIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          alignItems: "center",
          mb: 3,
        }}
      >
        <TextField
          placeholder="Search products..."
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 280 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            label="Category"
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Sort by</InputLabel>
          <Select
            value={sortBy}
            label="Sort by"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <MenuItem value="default">Default</MenuItem>
            <MenuItem value="priceLow">Price: Low to High</MenuItem>
            <MenuItem value="priceHigh">Price: High to Low</MenuItem>
            <MenuItem value="name">Name A-Z</MenuItem>
          </Select>
        </FormControl>
        <Typography variant="body2" color="text.secondary">
          {filteredProducts.length} product(s)
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {filteredProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <ProductCard
              product={product}
              onAddToCart={handleAddToCart}
              onWishlistToggle={handleWishlistToggle}
              isWishlisted={wishlistIds.has(product.id)}
            />
          </Grid>
        ))}
      </Grid>

      {filteredProducts.length === 0 && (
        <Typography color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
          No products match your filters.
        </Typography>
      )}
    </Box>
  );
};

export default Products;
