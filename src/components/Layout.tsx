import { useCurrentUser, useLogout } from "@/hooks/auth";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HistoryIcon from "@mui/icons-material/History";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link, Navigate, Outlet, useLocation, useNavigate } from "react-router";

const DRAWER_OPEN = 220;
const DRAWER_CLOSED = 64;

const NAV_ITEMS = [
  { id: "/", label: "Dashboard", icon: <DashboardIcon /> },
  { id: "/goals", label: "Nutrition Goals", icon: <TrackChangesIcon /> },
  { id: "/foods", label: "Foods", icon: <LocalDiningIcon /> },
  { id: "/recipes", label: "Recipes", icon: <MenuBookIcon /> },
  { id: "/meal-plans", label: "Meal Plans", icon: <CalendarMonthIcon /> },
  { id: "/meal-log", label: "Meal Log", icon: <HistoryIcon /> },
] as const;

export function Layout() {
  const [open, setOpen] = useState(true);
  const drawerWidth = open ? DRAWER_OPEN : DRAWER_CLOSED;
  const page = useLocation().pathname;
  const { data: user, isLoading: isLoadingUser } = useCurrentUser();
  const navigate = useNavigate();
  const logout = useLogout();
  const handleLogout = async () => {
    await logout.mutateAsync();
    navigate("/auth");
  };

  if (isLoadingUser) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to={"/auth"} replace />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        bgcolor: "background.default",
      }}
    >
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
              sx={{
                whiteSpace: "nowrap",
                color: "text.primary",
                letterSpacing: "0.04em",
              }}
            >
              MEAL
              <Box component="span" sx={{ color: "primary.main" }}>
                SHARK
              </Box>
            </Typography>
          )}
        </Box>

        {/* Nav */}
        <List sx={{ flex: 1, px: 1, pt: 1.5 }}>
          {NAV_ITEMS.map(({ id, label, icon }) => (
            <Tooltip key={id} title={open ? "" : label} placement="right">
              <Link to={id}>
                <ListItemButton
                  selected={page === id}
                  sx={{
                    px: open ? 2 : 1.5,
                    justifyContent: open ? "flex-start" : "center",

                    // normal hover
                    "&:hover": {
                      bgcolor: "rgba(96,200,245,0.08)",
                    },

                    "&.Mui-selected": {
                      bgcolor: "rgba(96,200,245,0.12)", 
                    },

                    "&.Mui-selected:hover": {
                      bgcolor: "rgba(96,200,245,0.18)",
                    },
                  }}
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
              </Link>
            </Tooltip>
          ))}
        </List>

        <Divider />

        {/* User + collapse */}
        <Box sx={{ p: 1.5 }}>
          {user && (
            <Box
  onClick={() => navigate("/profile")}
  sx={{
    display: "flex",
    alignItems: "center",
    gap: open ? 1.5 : 0,
    px: open ? 1 : 1.5,
    py: 1,
    mb: 0.5,
    borderRadius: 2,
    cursor: "pointer",
    justifyContent: open ? "flex-start" : "center",



    bgcolor: page === "/profile"
      ? "rgba(96,200,245,0.12)"
      : "transparent",

    // hover effect
    "&:hover": {
      bgcolor: page === "/profile"
        ? "rgba(96,200,245,0.18)"
        : "rgba(255,255,255,0.05)",
    },

    transition: "all 0.15s",
  }}
>
              <Avatar
                sx={{
                  width: 34,
                  height: 34,
                  bgcolor: "primary.main",
                  color: "#0d0d0d",
                  fontSize: 14,
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </Avatar>
              {open && (
                <Box sx={{ overflow: "hidden", flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: 13 }}>
                    {user.name}
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: 11, display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {user.email}
                  </Typography>
                </Box>
              )}
              {open && (
                <Tooltip title="Logout">
                  <IconButton
                    size="small"
                    onClick={handleLogout}
                    sx={{ color: "text.secondary", flexShrink: 0 }}
                  >
                    <LogoutIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
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
      <Box
        component="main"
        sx={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
