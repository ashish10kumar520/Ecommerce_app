import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Button, Grid, TextField } from "@mui/material";
import CommonForm from "../../../commons/CommonForm";

const GiftCards = () => {
  return (
    <CommonForm
      title="Gift Cards"
      actions={
        <>
          <Button color="inherit">+ Add New Address</Button>
        </>
      }
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField label="Address Line 1" fullWidth />
        </Grid>

        <Grid item xs={12}>
          <TextField label="City" fullWidth />
        </Grid>

        <Grid item xs={12}>
          <TextField label="Pincode" fullWidth />
        </Grid>
      </Grid>
    </CommonForm>
  );
};
export default GiftCards;
