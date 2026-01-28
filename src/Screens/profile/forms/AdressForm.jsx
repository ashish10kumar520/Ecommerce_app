import React from "react";
import {
  Button,
  Grid,
  TextField,
  Box,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import CommonForm from "../../../commons/CommonForm";
import { useState } from "react";
const AdressForm = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setNewAddress({ addressLine1: "", city: "", pincode: "" });
  };

  const handleChange = (e) => {
    setNewAddress({
      ...newAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    setAddresses([...addresses, newAddress]);
    setNewAddress({ addressLine1: "", city: "", pincode: "" });
    setShowForm(false);
  };
  const addresses = [
    {
      name: "John Doe",
      phoneNo: "1234567890",
      addressLine1: "house no 123, street abc",
      city: "New York",
      state: "NY",
      pincode: "10001",
    },
    {
      name: "Jane Smith",
      phoneNo: "0987654321",
      addressLine1: "house no 456, street def",
      city: "Los Angeles",
      state: "CA",
      pincode: "90001",
    },
  ];

  return (
    <>
      <CommonForm
        title="Manage Addresses"
        actions={
          <Button
            variant="outlined"
            fullWidth
            sx={{
              justifyContent: "flex-start",
              padding: "12px",
              fontWeight: 500,
              justifyContent: "center",
            }}
            onClick={handleOpen}
          >
            + Add New Address
          </Button>
        }
      >
        <Box display="flex" flexDirection="column" gap={3}>
          {addresses.map((address, index) => (
            <Box
              key={index}
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: 2,
                padding: 2,
              }}
            >
              <Grid container spacing={2}>
                <Typography variant="h6" gutterBottom>
                  {`${address.addressLine1}, ${address.city} - ${address.pincode}`}
                </Typography>
              </Grid>
            </Box>
          ))}
        </Box>
      </CommonForm>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Add New Address</DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Name"
                fullWidth
                value={addresses.name}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                name="phoneNo"
                label=" Phone Number"
                fullWidth
                value={addresses.phoneNo}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                name="addressLine1"
                label="Address"
                fullWidth
                value={addresses.addressLine1}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="city"
                label="Area/City"
                fullWidth
                value={addresses.city}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="state"
                label="State"
                fullWidth
                value={addresses.state}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdressForm;
