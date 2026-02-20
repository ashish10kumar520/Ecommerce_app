import axios from "axios";
import keycloak from "./keycloak";
import { API_BASE_URL } from "./config";

export const getApi = async (key, payload = {}, setLoader = (a) => a) => {
  if (!key) return;

  try {
    setLoader(true);

    const response = await axios.get(`${API_BASE_URL}/${key}`, {
      params: payload,
      headers: {
        Authorization: `Bearer ${keycloak?.token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  } finally {
    setLoader(false);
  }
};

export async function postApi(
  key,
  payload = {},
  setLoader = (a) => a,
  callBack = (a) => a,
  enqueueSnackbar = (a, b) => a,
) {
  setLoader(true);
  await axios
    .post(`${API_BASE_URL}/${key}`, payload, {
      headers: {
        Authorization: `Bearer ${keycloak?.token}`,
      },
    })
    .then((response) => {
      setLoader(false);
      const { message = "", status = "" } = response.data;
      enqueueSnackbar &&
        enqueueSnackbar(message || "Successful", {
          variant: "success",
          autoHideDuration: 5000,
        });

      callBack(response);
    })
    .catch((error) => {
      setLoader(false);
      const message =
        error?.response?.data?.message || "Something went wrong";
      enqueueSnackbar &&
        enqueueSnackbar(message, {
          variant: "error",
          autoHideDuration: 5000,
        });
    });
}

export async function deleteApi(
  key,
  setLoader = (a) => a,
  callBack = () => {},
  enqueueSnackbar = (a, b) => a,
) {
  if (!key) return;
  setLoader(true);
  try {
    const response = await axios.delete(`${API_BASE_URL}/${key}`, {
      headers: {
        Authorization: `Bearer ${keycloak?.token}`,
      },
    });
    setLoader(false);
    const { message = "Successful" } = response.data || {};
    enqueueSnackbar &&
      enqueueSnackbar(message, {
        variant: "success",
        autoHideDuration: 5000,
      });
    callBack(response);
  } catch (error) {
    setLoader(false);
    const message =
      error?.response?.data?.message || "Something went wrong";
    enqueueSnackbar &&
      enqueueSnackbar(message, {
        variant: "error",
        autoHideDuration: 5000,
      });
  }
}
