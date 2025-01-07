"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const material_1 = require("@mui/material");
const Sidebar = () => {
    return (<material_1.Box sx={{
            width: "240px",
            height: "100vh",
            backgroundColor: "#f4f4f4",
            boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
        }}>
      <material_1.List>
        <material_1.ListItem button component={react_router_dom_1.Link} to="/">
          <material_1.ListItemText primary="Dashboard"/>
        </material_1.ListItem>
        <material_1.ListItem button component={react_router_dom_1.Link} to="/users">
          <material_1.ListItemText primary="Users"/>
        </material_1.ListItem>
        <material_1.ListItem button component={react_router_dom_1.Link} to="/reports">
          <material_1.ListItemText primary="Reports"/>
        </material_1.ListItem>
      </material_1.List>
    </material_1.Box>);
};
exports.default = Sidebar;
