// ProfilePage.jsx
import { Box } from "@mui/material";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { profileConfig } from "./profileConfig";
import LeftSidebar from "./LeftSideBar";
import CommonRenderer from "./CommonRenderer";

export default function ProfilePage() {
  const [active, setActive] = useState("profile");

  return (
    <Box display="flex" gap={3}>
      <Box width={"300px"}>
        <LeftSidebar
          config={profileConfig}
          active={active}
          onChange={setActive}
        />
      </Box>
      <Box flex={1}>
        <CommonRenderer config={profileConfig} active={active} />
      </Box>
    </Box>
  );
}
