import { Box } from "@mui/material";

const listItemSx = {
  border: "1px solid #ddd",
  p: 3,
  borderRadius: 2,
  bgcolor: "background.paper",
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const CommonListItem = ({ children, sx = {} }) => {
  return <Box sx={{ ...listItemSx, ...sx }}>{children}</Box>;
};

export default CommonListItem;
