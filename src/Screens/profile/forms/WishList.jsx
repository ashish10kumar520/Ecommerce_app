import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import CommonForm from "../../../commons/CommonForm";
import CommonListItem from "../../../commons/CommonListItem";
import AppLoader from "../../../commons/AppLoader";
import { getApi } from "../../../config/api";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const DUMMY_WISHLIST = [
  {
    id: 1,
    productId: "p1",
    name: "Wireless Bluetooth Headphones",
    price: 2499,
    image: null,
    addedAt: "2024-01-15",
  },
  {
    id: 2,
    productId: "p2",
    name: "Smart Watch Pro",
    price: 4999,
    image: null,
    addedAt: "2024-02-01",
  },
  {
    id: 3,
    productId: "p3",
    name: "Portable Power Bank 20000mAh",
    price: 1299,
    image: null,
    addedAt: "2024-02-10",
  },
];

const WISHLIST_API_KEY = "wishlist";

const WishList = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loader, setLoader] = useState(false);

  const fetchWishlist = async () => {
    try {
      const response = await getApi(WISHLIST_API_KEY, {}, setLoader);
      const list = Array.isArray(response) ? response : response?.data ?? response?.wishlist ?? [];
      setWishlist(Array.isArray(list) && list.length > 0 ? list : DUMMY_WISHLIST);
    } catch (error) {
      console.error("Error fetching wishlist", error);
      setWishlist(DUMMY_WISHLIST);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = (id) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id && item.productId !== id));
  };

  const formatPrice = (price) => {
    if (typeof price !== "number" && typeof price !== "string") return "";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(price));
  };

  return (
    <>
      {loader && <AppLoader />}
      <CommonForm title="Wishlist">
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          {wishlist.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Your wishlist is empty.
            </Typography>
          ) : (
            wishlist.map((item) => (
              <CommonListItem key={item.id ?? item.productId ?? item.name}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
                  {item.image && (
                    <Box
                      component="img"
                      src={item.image}
                      alt={item.name}
                      sx={{
                        width: 56,
                        height: 56,
                        objectFit: "cover",
                        borderRadius: 1,
                      }}
                    />
                  )}
                  <Box>
                    <Typography fontWeight="bold">{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatPrice(item.price)}
                    </Typography>
                  </Box>
                </Box>
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => handleRemove(item.id ?? item.productId)}
                  aria-label="Remove from wishlist"
                >
                  <DeleteOutlineIcon />
                </IconButton>
              </CommonListItem>
            ))
          )}
        </Box>
      </CommonForm>
    </>
  );
};

export default WishList;
