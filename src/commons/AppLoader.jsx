import { Box, CircularProgress, Typography } from "@mui/material";

const AppLoader = ({ text = "Loading..." }) => {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      <CircularProgress color="inherit" size={60} />
      <Typography color="text.secondary">{text}</Typography>
    </Box>
  );
};

export default AppLoader;
