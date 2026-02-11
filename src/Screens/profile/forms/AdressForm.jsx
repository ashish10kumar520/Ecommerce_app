import React, { useState, useCallback } from "react";
import { Button, Box, Typography } from "@mui/material";
import CommonForm from "../../../commons/CommonForm";
import CommonDialog from "../../../commons/CommonDialog";
import SchemaForm from "../../../commons/SchemaForm";
import { INDIAN_STATES } from "../../../constants/constants";
import { PINCODE_URL } from "../../../config/config";
import axios from "axios";
import debounce from "lodash/debounce";

const emptyAddress = {
  name: "",
  phoneNo: "",
  addressLine1: "",
  landmark: "",
  city: "",
  state: "",
  pincode: "",
};

const AddressForm = () => {
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: "John Doe",
      phoneNo: "1234567890",
      addressLine1: "House No 123, Street ABC",
      landmark: "Near Central Park",
      city: "New York",
      state: "NY",
      pincode: "10001",
    },
    {
      id: 2,
      name: "Jane Smith",
      phoneNo: "9876543210",
      addressLine1: "Flat 45, Sunset Apartments",
      landmark: "Opposite Mall",
      city: "Los Angeles",
      state: "CA",
      pincode: "90001",
    },
  ]);

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

  const handleSubmit = (values) => {
    if (isEdit) {
      const updatedAddresses = addresses.map((addr) =>
        addr.id === editId ? { ...values, id: editId } : addr,
      );
      setAddresses(updatedAddresses);
    } else {
      const newAddress = {
        ...values,
        id: Date.now(), // temporary ID (backend will generate later)
      };
      setAddresses([...addresses, newAddress]);
    }

    handleClose();
  };

  const fetchStatesAndCities = async (pincode) => {
    await axios.get(`${PINCODE_URL}/${pincode}`).then((res) => {
      try {
        console.log("Pincode API response:", res);
        if (res?.Status === "Success") {
          const { State, Circle } = res?.PostOffice[0];
          setFormValues((prev) => ({
            ...prev,
            state: State,
            city: Circle,
          }));
        }
      } catch (error) {
        console.error("Error fetching location data:", error);
      }
    });
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
              {/* Edit Button */}
              <Button
                size="small"
                variant="text"
                onClick={() => handleEdit(addr)}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  fontWeight: 600,
                }}
              >
                Edit
              </Button>

              <Typography fontWeight="bold">{addr.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {addr.phoneNo}
              </Typography>
              <Typography variant="body2">{addr.addressLine1}</Typography>
              <Typography variant="body2">{addr.landmark}</Typography>
              <Typography variant="body2">
                {addr.city}, {addr.state} - {addr.pincode}
              </Typography>
            </Box>
          ))}
        </Box>
      </CommonForm>

      <CommonDialog
        open={open}
        onClose={handleClose}
        title={isEdit ? "Edit Address" : "Add New Address"}
        maxWidth="md"
        actions={
          <>
            {" "}
            <Button onClick={handleClose}>Cancel</Button>{" "}
            <Button variant="contained" onClick={handleSubmit}>
              {" "}
              Save{" "}
            </Button>{" "}
          </>
        }
        fullWidth
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
              name: "pincode",
              label: "Pincode",
              required: true,
              variant: "outlined",
              onFieldValueChange: (e) => {
                e.target.value.length === 6 && debouncedFetch(e.target.value);
              },
              width: 400,
            },
            {
              name: "landmark",
              label: "Landmark",
              required: false,
              variant: "outlined",
              width: 400,
            },
            {
              name: "addressLine",
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
              name: "Address Type",
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
          //onSubmit={handleSubmit}
          edit={true}
          //bottomButton={false}
        />
      </CommonDialog>
    </>
  );
};
// http://www.postalpincode.in/api/pincode/752031
export default AddressForm;
