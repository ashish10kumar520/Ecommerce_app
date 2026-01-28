import { Card, CardContent, Typography, Box } from "@mui/material";

const CommonForm = ({ title, children, actions, sx = {}, headerSx = {} }) => {
  return (
    <Card
      sx={{
        marginLeft: "70px",
        marginTop: "20px",
        marginRight: "20px",
        padding: 2,
        ...sx,
      }}
    >
      <CardContent>
        <Box sx={{ ...headerSx }}>
          <Typography variant="h5" gutterBottom>
            {title}
          </Typography>
          {actions && <Box mt={1}>{actions}</Box>}
        </Box>
        <Box mt={2}>{children}</Box>
      </CardContent>
    </Card>
  );
};

export default CommonForm;
