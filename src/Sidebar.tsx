import React from "react";
import { Link } from "react-router-dom";
import { Box, List, ListItem, ListItemText } from "@mui/material";

const Sidebar: React.FC = () => {
  return (
    <Box
      sx={{
        width: "240px",
        height: "100vh",
        backgroundColor: "#f4f4f4",
        boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
      }}
    >
      <List>
        <ListItem button component={Link} to="/">
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/users">
          <ListItemText primary="Users" />
        </ListItem>
        <ListItem button component={Link} to="/reports">
          <ListItemText primary="Reports" />
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar;