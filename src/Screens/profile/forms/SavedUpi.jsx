import React, { useState, useRef, useEffect } from "react";
import { Box, Button, Typography, Chip } from "@mui/material";
import CommonForm from "../../../commons/CommonForm";
import CommonDialog from "../../../commons/CommonDialog";
import CommonListItem from "../../../commons/CommonListItem";
import SchemaForm from "../../../commons/SchemaForm";
import AppLoader from "../../../commons/AppLoader";
import { getApi, postApi } from "../../../config/api";
import { useSnackbar } from "notistack";

const DUMMY_UPI_LIST = [
  { id: 1, label: "Personal UPI", upiId: "user.personal@upi", isPrimary: true },
  { id: 2, label: "Work UPI", upiId: "user.work@upi", isPrimary: false },
  { id: 3, label: "Family UPI", upiId: "family@upi", isPrimary: false },
];

// API keys for integration: GET list, POST add, POST update, POST/DELETE remove
const SAVED_UPI_API_KEY = "savedUpi";
const UPI_ADD_API_KEY = "savedUpi";
const UPI_UPDATE_API_KEY = "savedUpi";
const UPI_DELETE_API_KEY = "deleteUpi";

const emptyUpi = { label: "", upiId: "" };

const SavedUpi = () => {
  const [upiList, setUpiList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formValues, setFormValues] = useState(emptyUpi);
  const formRef = useRef(null);
  const { enqueueSnackbar } = useSnackbar();

  const fetchSavedUpi = async () => {
    try {
      const response = await getApi(SAVED_UPI_API_KEY, {}, setLoader);
      const list = Array.isArray(response)
        ? response
        : response?.data ?? response?.upiList ?? [];
      setUpiList(
        Array.isArray(list) && list.length > 0 ? list : DUMMY_UPI_LIST,
      );
    } catch (error) {
      console.error("Error fetching saved UPI", error);
      setUpiList(DUMMY_UPI_LIST);
    }
  };

  useEffect(() => {
    fetchSavedUpi();
  }, []);

  const handleOpen = () => {
    setIsEdit(false);
    setEditId(null);
    setFormValues(emptyUpi);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormValues(emptyUpi);
    setIsEdit(false);
    setEditId(null);
  };

  const handleEdit = (item) => {
    setFormValues({ label: item.label, upiId: item.upiId });
    setEditId(item.id ?? item.upiId);
    setIsEdit(true);
    setOpen(true);
  };

  const handleSave = async () => {
    if (!formRef.current) return;
    await formRef.current.handleSubmit();
    const data = formRef.current.values;
    if (!data) return;

    const onSuccess = () => {
      fetchSavedUpi();
      handleClose();
    };

    const onError = (message = "", info = {}) => enqueueSnackbar(message, info);

    if (isEdit) {
      postApi(
        `${UPI_UPDATE_API_KEY}/${editId}`,
        data,
        setLoader,
        onSuccess,
        onError,
      );
    } else {
      postApi(
        UPI_ADD_API_KEY,
        data,
        setLoader,
        onSuccess,
        onError,
      );
    }
  };

  const handleSetPrimary = (id) => {
    setUpiList((prev) =>
      prev.map((item) => ({
        ...item,
        isPrimary: item.id === id || item.upiId === id,
      })),
    );
  };

  const handleRemove = (id) => {
    setUpiList((prev) =>
      prev.filter((item) => item.id !== id && item.upiId !== id),
    );
  };

  return (
    <>
      {loader && <AppLoader />}
      <CommonForm
        title="Saved UPI"
        actions={
          <Button variant="outlined" fullWidth onClick={handleOpen}>
            + Add New UPI
          </Button>
        }
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          {upiList.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No saved UPI IDs. Add one to get started.
            </Typography>
          ) : (
            upiList.map((item) => (
              <CommonListItem key={item.id ?? item.upiId}>
                <Box sx={{ minWidth: 0 }}>
                  <Typography fontWeight="bold">{item.label}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.upiId}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: 1,
                    flexShrink: 0,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {item.isPrimary ? (
                      <Chip label="Primary" color="primary" size="small" />
                    ) : (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() =>
                          handleSetPrimary(item.id ?? item.upiId)
                        }
                        sx={{ minWidth: 120 }}
                      >
                        Set as Primary
                      </Button>
                    )}
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Button
                      size="small"
                      variant="text"
                      onClick={() => handleEdit(item)}
                      sx={{ minWidth: "auto", px: 1 }}
                    >
                      Edit
                    </Button>
                    <Typography variant="body2" color="text.secondary">
                      |
                    </Typography>
                    <Button
                      size="small"
                      variant="text"
                      color="error"
                      onClick={() => handleRemove(item.id ?? item.upiId)}
                      sx={{ minWidth: "auto", px: 1 }}
                    >
                      Remove
                    </Button>
                  </Box>
                </Box>
              </CommonListItem>
            ))
          )}
        </Box>
      </CommonForm>

      <CommonDialog
        open={open}
        onClose={handleClose}
        title={isEdit ? "Edit UPI" : "Add New UPI"}
        maxWidth="sm"
        fullWidth
        actions={
          <>
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
          </>
        }
      >
        <SchemaForm
          schema={[
            {
              name: "label",
              label: "Account Name",
              required: true,
              variant: "outlined",
              width: 400,
            },
            {
              name: "upiId",
              label: "UPI ID",
              required: true,
              variant: "outlined",
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

export default SavedUpi;
