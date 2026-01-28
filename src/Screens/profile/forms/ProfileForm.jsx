import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import {
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  CardActions,
  Button,
  Box,
} from "@mui/material";
import { useState } from "react";
import { useAuth } from "../../../config/authContext";
import CommonForm from "../../../commons/CommonForm";

const ProfileForm = () => {
  const [isEdit, setIsEdit] = useState(false);
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    phone: "9876543210",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <CommonForm
      title="Profile Information"
      actions={
        <>
          {isEdit ? (
            <>
              <Box sx={{ mr: 2 }} />
              <Button color="inherit" onClick={() => setIsEdit(false)}>
                Cancel
              </Button>
              <Button variant="contained" onClick={() => setIsEdit(false)}>
                Save
              </Button>
            </>
          ) : (
            <Button variant="contained" onClick={() => setIsEdit(true)}>
              Edit
            </Button>
          )}
        </>
      }
      headerSx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Grid container direction="column" spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Name"
            name="name"
            value={user?.name}
            onChange={handleChange}
            sx={{ width: "300px" }}
            disabled={true}
          />
        </Grid>
        <Typography variant="h6" gutterBottom>
          Email Address
        </Typography>
        <Grid item xs={12}>
          <TextField
            label="Email"
            name="email"
            value={user?.email}
            onChange={handleChange}
            sx={{ width: "300px" }}
            disabled={true}
          />
        </Grid>
        <Typography variant="h6" gutterBottom>
          Phone Number
        </Typography>
        <Grid item xs={12}>
          <TextField
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            sx={{ width: "300px" }}
            disabled={!isEdit}
          />
        </Grid>
        <Typography variant="h6" gutterBottom>
          FAQs
        </Typography>
        <Typography variant="h9" gutterBottom>
          What happens when I update my email address (or mobile number)? Your
          login email id (or mobile number) changes, likewise. You'll receive
          all your account related communication on your updated email address
          (or mobile number).
        </Typography>
        <Typography variant="h9" gutterBottom>
          When will my ShopEasy account be updated with the new email address
          (or mobile number)? It happens as soon as you confirm the verification
          code sent to your email (or mobile) and save the changes.
        </Typography>
        <Typography variant="h9" gutterBottom>
          What happens to my existing Flipkart account when I update my email
          address (or mobile number)? Updating your email address (or mobile
          number) doesn't invalidate your account. Your account remains fully
          functional. You'll continue seeing your Order history, saved
          information and personal details.
        </Typography>
      </Grid>
    </CommonForm>
  );
};

export default ProfileForm;
