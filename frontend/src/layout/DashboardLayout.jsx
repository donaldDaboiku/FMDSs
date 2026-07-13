import React from "react";
import {
  Box,
  IconButton,
  Drawer,
  Toolbar,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  AppBar,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const drawerWidth = 240;

export default function DashboardLayout({ children }) {
  const { settings } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();

  const showBack = location.pathname !== "/dashboard";

    // const handleLogout = () => {
    //   localStorage.removeItem("token");
    //   navigate("/login");
    // };
  const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};
  const handleNavigation = (path) => {
    if (location.pathname !== path) {
      navigate(path);
    }
  };

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { text: "Orders", icon: <ShoppingCartIcon />, path: "/orders" },
    { text: "Designs", icon: <DesignServicesIcon />, path: "/designs" },
    { text: "Inventory", icon: <InventoryIcon />, path: "/inventory" },
    { text: "Appointments", icon: <CalendarTodayIcon />, path: "/appointments" },
    { text: "Settings", icon: <SettingsIcon />, path: "/settings" },
  ];

  return (
    <Box sx={{ display: "flex", minHeight: '100vh' }}>
      {/* TOP BAR */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: 1300,
          backgroundColor: settings?.themeColor || '#1976d2',
          width: `calc(100% - ${drawerWidth}px)`,
          marginLeft: `${drawerWidth}px`,
        }}
      >
        <Toolbar>
          {/* Back button - shows on ALL pages except dashboard */}
          {showBack && (
            <IconButton
              edge="start"
              sx={{ color: "white", mr: 2 }}
              onClick={() => navigate("/dashboard")}
            >
              <ArrowBackIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap>
            {settings?.appName || "My App"}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* SIDEBAR */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: settings?.themeColor || '#1976d2',
            color: 'white',
            position: 'relative',
            height: '100vh',
          },
        }}
      >
        <Toolbar />

        <Box sx={{ p: 2, textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
            {settings?.appName || "My App"}
          </Typography>
        </Box>

        <List sx={{ mt: 2 }}>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.text}
              onClick={() => handleNavigation(item.path)}
              sx={{
                color: 'white',
                mx: 1,
                mb: 1,
                borderRadius: 1,
                backgroundColor: location.pathname === item.path ? 'rgba(255,255,255,0.3)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.2)',
                },
              }}
            >
              <Box sx={{ mr: 2, display: 'flex' }}>
                {item.icon}
              </Box>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>

        <Box sx={{ mt: 'auto', p: 2 }}>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              color: 'white',
              borderRadius: 1,
              backgroundColor: 'rgba(255,0,0,0.2)',
              '&:hover': {
                backgroundColor: 'rgba(255,0,0,0.3)',
              },
            }}
          >
            <LogoutIcon sx={{ mr: 2 }} />
            <ListItemText primary="Logout" />
          </ListItemButton>
        </Box>
      </Drawer>

      {/* MAIN CONTENT */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 3,
          px: 3,
          pb: 3,
          minHeight: '100vh',
          backgroundColor: '#f5f5f5',
          // marginLeft: `${drawerWidth}px`,
          // width: `calc(100% - ${drawerWidth}px)`,
        }}
      >
        {/* Back button in main content - shows on ALL pages except dashboard */}
        {showBack && (
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <IconButton onClick={() => navigate("/dashboard")}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" sx={{ ml: 1 }}>
              Back to Dashboard
            </Typography>
          </Box>
        )}
        {/* <Toolbar sx={{minHeight: '64px !important'}}/> */}
        {children}
      </Box>
    </Box>
  );
}