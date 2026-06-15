import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HistoryIcon from "@mui/icons-material/History";
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import LogoutIcon from "@mui/icons-material/Logout";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List, ListItemButton, ListItemIcon, ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Outlet } from "react-router";
import { useApp } from "../AppContext";

const DRAWER_OPEN = 220;
const DRAWER_CLOSED = 64;

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: <DashboardIcon /> },
  { id: "goals", label: "My Goals", icon: <TrackChangesIcon /> },
  { id: "foods", label: "Foods", icon: <LocalDiningIcon /> },
  { id: "recipes", label: "Recipes", icon: <MenuBookIcon /> },
  { id: "mealplans", label: "Meal Plans", icon: <CalendarMonthIcon /> },
  { id: "meallog", label: "Meal Log", icon: <HistoryIcon /> },
] as const;

export function Layout() {
  const { page, setPage, user, logout } = useApp();
  const [open, setOpen] = useState(true);
  const drawerWidth = open ? DRAWER_OPEN : DRAWER_CLOSED;

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden", bgcolor: "background.default" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          transition: "width 0.2s ease",
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            overflowX: "hidden",
            transition: "width 0.2s ease",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: open ? 2.5 : 1.5,
            py: 3,
            overflow: "hidden",
            borderBottom: "1px solid",
            borderColor: "divider",
            minHeight: 72,
          }}
        >
          {/*<FitnessCenterIcon sx={{ color: "primary.main", fontSize: 28, flexShrink: 0 }} />*/}
          {open && (
            <Typography
              variant="h5"
              sx={{ whiteSpace: "nowrap", color: "text.primary", letterSpacing: "0.04em" }}
            >
              MEAL<Box component="span" sx={{ color: "primary.main" }}>SHARK</Box>
            </Typography>
          )}
        </Box>

        {/* Nav */}
        <List sx={{ flex: 1, px: 1, pt: 1.5 }}>
          {NAV_ITEMS.map(({ id, label, icon }) => (
            <Tooltip key={id} title={open ? "" : label} placement="right">
              <ListItemButton
                selected={page === id}
                onClick={() => setPage(id as any)}
                sx={{ px: open ? 2 : 1.5, justifyContent: open ? "flex-start" : "center" }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: open ? 36 : "unset",
                    color: page === id ? "primary.main" : "text.secondary",
                  }}
                >
                  {icon}
                </ListItemIcon>
                {open && (
                  <ListItemText
                    primary={label}
                    primaryTypographyProps={{
                      variant: "overline",
                      fontSize: 13,
                      color: page === id ? "primary.main" : "text.secondary",
                    }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          ))}
        </List>

        <Divider />

        {/* User + collapse */}
        <Box sx={{ p: 1.5 }}>
          {open && user && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 1, py: 1.5 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main", color: "#0d0d0d", fontSize: 13, fontWeight: 800 }}>
                {user.name.charAt(0)}
              </Avatar>
              <Box sx={{ overflow: "hidden", flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: 13 }}>
                  {user.name}
                </Typography>
                <Typography variant="caption" sx={{ fontSize: 11 }}>{user.email}</Typography>
              </Box>
              <Tooltip title="Logout">
                <IconButton size="small" onClick={logout} sx={{ color: "text.secondary" }}>
                  <LogoutIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          )}
          <ListItemButton
            onClick={() => setOpen(!open)}
            sx={{ borderRadius: 1.5, justifyContent: open ? "flex-end" : "center", py: 1 }}
          >
            {open ? <ChevronLeftIcon sx={{ color: "text.secondary" }} /> : <ChevronRightIcon sx={{ color: "text.secondary" }} />}
          </ListItemButton>
        </Box>
      </Drawer>

      {/* Main */}
      <Box component="main" sx={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
        <Outlet/>
      </Box>
    </Box>
  );
}
