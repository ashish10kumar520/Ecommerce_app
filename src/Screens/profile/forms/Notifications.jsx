import React, { useState, useEffect } from "react";
import { Box, Typography, Chip, Switch, Button } from "@mui/material";
import CommonForm from "../../../commons/CommonForm";
import CommonListItem from "../../../commons/CommonListItem";
import AppLoader from "../../../commons/AppLoader";
import { getApi } from "../../../config/api";

const DUMMY_NOTIFICATIONS = [
  {
    id: 1,
    productId: "p1",
    name: "Noise Cancelling Headphones",
    variant: "Black · Wireless",
    status: "out_of_stock",
    notifyEnabled: true,
  },
  {
    id: 2,
    productId: "p2",
    name: "4K Smart TV 55\"",
    variant: "Ultra HD · 55 inch",
    status: "out_of_stock",
    notifyEnabled: false,
  },
  {
    id: 3,
    productId: "p3",
    name: "Gaming Laptop",
    variant: "16GB RAM · 512GB SSD",
    status: "out_of_stock",
    notifyEnabled: true,
  },
];

const NOTIFICATIONS_API_KEY = "notifyProducts";

const Notifications = () => {
  const [products, setProducts] = useState([]);
  const [loader, setLoader] = useState(false);

  const fetchNotifications = async () => {
    try {
      const response = await getApi(NOTIFICATIONS_API_KEY, {}, setLoader);
      const list = Array.isArray(response)
        ? response
        : response?.data ?? response?.products ?? [];
      setProducts(
        Array.isArray(list) && list.length > 0 ? list : DUMMY_NOTIFICATIONS,
      );
    } catch (error) {
      console.error("Error fetching notifications", error);
      setProducts(DUMMY_NOTIFICATIONS);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleToggleNotify = (id) => {
    setProducts((prev) =>
      prev.map((item) =>
        (item.id === id || item.productId === id)
          ? { ...item, notifyEnabled: !item.notifyEnabled }
          : item,
      ),
    );
  };

  const handleClearAll = () => {
    setProducts((prev) =>
      prev.map((item) => ({ ...item, notifyEnabled: false })),
    );
  };

  return (
    <>
      {loader && <AppLoader />}
      <CommonForm
        title="Stock Notifications"
        actions={
          <Button variant="outlined" onClick={handleClearAll}>
            Clear all notifications
          </Button>
        }
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          {products.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              You have no products marked for availability notifications.
            </Typography>
          ) : (
            products.map((item) => (
              <CommonListItem key={item.id ?? item.productId}>
                <Box>
                  <Typography fontWeight="bold">{item.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.variant ?? item.description ?? ""}
                  </Typography>
                  <Box mt={1}>
                    <Chip
                      label="Out of stock"
                      color="warning"
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {item.notifyEnabled
                      ? "You will be notified"
                      : "Notify when available"}
                  </Typography>
                  <Switch
                    checked={!!item.notifyEnabled}
                    onChange={() =>
                      handleToggleNotify(item.id ?? item.productId)
                    }
                    color="primary"
                  />
                </Box>
              </CommonListItem>
            ))
          )}
        </Box>
      </CommonForm>
    </>
  );
};

export default Notifications;
