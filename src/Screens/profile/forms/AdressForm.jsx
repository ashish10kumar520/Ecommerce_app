import React, { useState, useCallback, useRef, useEffect } from "react";
import { Button, Box, Typography } from "@mui/material";
import CommonForm from "../../../commons/CommonForm";
import CommonDialog from "../../../commons/CommonDialog";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton, Menu, MenuItem } from "@mui/material";
import SchemaForm from "../../../commons/SchemaForm";
import { INDIAN_STATES } from "../../../constants/constants";
import { PINCODE_URL } from "../../../config/config";
import axios from "axios";
import debounce from "lodash/debounce";
import { getApi, postApi } from "../../../config/api";
import AppLoader from "../../../commons/AppLoader";
import { useSnackbar } from "notistack";

const emptyAddress = {
  name: "",
  phoneNo: "",
  addressLine1: "",
  landmark: "",
  city: "",
  state: "",
  pincode: "",
  addressType: "home",
};

const AddressForm = () => {
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loader, setLoader] = useState();
  const formRef = useRef(null);
  const { enqueueSnackbar } = useSnackbar();

  const [addresses, setAddresses] = useState([]);
  const [formValues, setFormValues] = useState(emptyAddress);

  const handleOpen = () => {
    setIsEdit(false);
    setFormValues(emptyAddress);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormValues(emptyAddress);
    setIsEdit(false);
    setEditId(null);
  };

  const handleEdit = (address) => {
    setFormValues(address);
    setEditId(address.id);
    setIsEdit(true);
    setOpen(true);
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const openMenu = Boolean(anchorEl);

  const handleMenuClick = (event, addr) => {
    setAnchorEl(event.currentTarget);
    setSelectedAddress(addr);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAddress(null);
  };

  const handleSubmit = async () => {
    if (!formRef.current) return;

    await formRef.current.handleSubmit();
    const data = formRef.current.values;
    if (!data) return;

    postApi(
      "address",
      data,
      setLoader,
      () => {
        setOpen(false);
        fetchUserAddress();
      },
      (message = "", info = {}) => {
        enqueueSnackbar(message, info);
      },
    );

    handleClose();
  };

  const fetchUserAddress = async () => {
    try {
      const response = await getApi("getAddress", {}, setLoader);
      setAddresses(response || []);
    } catch (error) {
      console.error("Error fetching address", error);
    }
  };

  useEffect(() => {
    fetchUserAddress();
  }, []);

  const fetchStatesAndCities = async (pincode) => {
    try {
      const response = await getApi(`pinCode/${pincode}`, {}, setLoader);
      console.log(response);

      if (response && formRef.current) {
        const { state, district } = response;
        formRef.current.setFieldValue("state", state);
        formRef.current.setFieldValue("city", district);
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };

  const debouncedFetch = useCallback(
    debounce((pincode) => {
      if (pincode.length === 6) {
        fetchStatesAndCities(pincode);
      }
    }, 800),
    [],
  );
  return (
    <>
      {loader && <AppLoader />}
      <CommonForm
        title="Manage Addresses"
        actions={
          <Button variant="outlined" fullWidth onClick={handleOpen}>
            + Add New Address
          </Button>
        }
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          {addresses.map((addr) => (
            <Box
              key={addr.id}
              sx={{
                border: "1px solid #ddd",
                p: 3,
                borderRadius: 2,
                bgcolor: "background.paper",
                position: "relative",
              }}
            >
              <IconButton
                size="small"
                onClick={(e) => handleMenuClick(e, addr)}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  opacity: 0,
                  transition: "0.3s",
                  ".MuiBox-root:hover &": {
                    opacity: 1,
                  },
                }}
              >
                <MoreVertIcon />
              </IconButton>

              <Typography fontWeight="bold">{addr.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {addr.phoneNo}
              </Typography>
              <Typography variant="body2">{addr.address}</Typography>
              <Typography variant="body2">
                {addr.city}, {addr.state} - {addr.pinCode}
              </Typography>
            </Box>
          ))}
        </Box>
      </CommonForm>
      <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose}>
        <MenuItem
          onClick={() => {
            handleEdit(selectedAddress);
            handleMenuClose();
          }}
        >
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleDelete(selectedAddress?.id);
            handleMenuClose();
          }}
        >
          Delete
        </MenuItem>
      </Menu>

      <CommonDialog
        open={open}
        onClose={handleClose}
        title={isEdit ? "Edit Address" : "Add New Address"}
        maxWidth="md"
        fullWidth
        actions={
          <>
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="contained" onClick={handleSubmit}>
              Save
            </Button>
          </>
        }
      >
        <SchemaForm
          schema={[
            {
              name: "name",
              label: "Full Name",
              required: true,
              variant: "outlined",
              width: 400,
            },
            {
              name: "phoneNo",
              label: "Mobile Number",
              required: true,
              variant: "outlined",
              width: 400,
            },
            {
              name: "pinCode",
              label: "Pincode",
              required: true,
              variant: "outlined",
              width: 400,
              onFieldValueChange: (e) => {
                const value = e.target.value;
                debouncedFetch(value);
              },
            },
            {
              name: "landMark",
              label: "Landmark",
              variant: "outlined",
              width: 400,
            },
            {
              name: "address",
              label: "Address",
              required: true,
              variant: "outlined",
              width: 815,
            },
            {
              name: "city",
              label: "City/District/Town",
              required: true,
              variant: "outlined",
              width: 400,
            },
            {
              name: "state",
              label: "State",
              required: true,
              type: "select",
              options: INDIAN_STATES,
              variant: "outlined",
              width: 400,
            },
            {
              name: "addressType",
              label: "Address Type",
              type: "radio",
              options: [
                { label: "Home", value: "home" },
                { label: "Work", value: "work" },
              ],
              width: 400,
            },
          ]}
          initialValues={formValues}
          formRef={formRef}
          edit={true}
        />
      </CommonDialog>
    </>
  );
};

export default AddressForm;
