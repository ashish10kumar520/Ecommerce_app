import {
  List,
  ListItemButton,
  ListItemText,
  Grid,
  Card,
  CardContent,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { useAuth } from "../../config/authContext";

export default function LeftSidebar({ config, active, onChange }) {
  const { user } = useAuth();
  return (
    <Grid
      container
      spacing={2}
      sx={{ mb: 2, marginLeft: "40px", marginTop: "20px", width: "220px" }}
    >
      <Grid item xs={12} md={3}>
        <Card sx={{ mb: 4, width: "320px" }}>
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <PersonIcon sx={{ fontSize: 50, color: "primary.main" }} />
            <Box>
              <Typography variant="subtitle1">Hello,</Typography>
              <Typography fontWeight={600}>{user?.name}</Typography>
            </Box>
          </CardContent>
        </Card>
        <Card sx={{ width: "320px" }}>
          <List>
            {config.map((section) => (
              <Box key={section.section} sx={{ mb: 2 }}>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 600,
                    color: "text.secondary",
                    ml: 1,
                    textTransform: "uppercase",
                  }}
                >
                  {section.section}
                </Typography>

                <List>
                  {section.items.map((item) => (
                    <ListItemButton
                      key={item.key}
                      selected={active === item.key}
                      onClick={() => onChange(item.key)}
                      sx={{ width: "320px", borderRadius: 1 }}
                    >
                      <ListItemText primary={item.label} />
                    </ListItemButton>
                  ))}
                </List>

                <Divider sx={{ width: "300px" }} />
              </Box>
            ))}
          </List>
        </Card>
      </Grid>
    </Grid>
  );
}
