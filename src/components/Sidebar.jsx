import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  IconButton,
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import VillaIcon from "@mui/icons-material/Villa";
import { useNavigate } from "react-router-dom";
import api from "../assets/api";
import logo from "../assets/images/logo.png";
import ProfileModal from "./ProfileModal";

const drawerWidth = 240;

function Sidebar() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser?.user?.id) return;

    const fetchProfile = async () => {
      try {
        const res = await api.get(`/api/profile/${storedUser.user.id}/`);
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  const isSuperUser = user?.user?.is_superuser === true || user?.user?.is_superuser === "true";

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },

    isSuperUser && {
      text: "Rooms",
      icon: <VillaIcon />,
      path: "/rooms",
    },

    { text: "Profile", icon: <PersonIcon /> },
  ].filter(Boolean);

  console.log("User in Sidebar:", user);
  console.log("is_superuser in Sidebar:", user?.user?.is_superuser);
  const drawerContent = (
    <>
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold">
          ZDSPGC Room Reservation
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />

      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item, index) => (
          <ListItemButton
            key={index}
            onClick={() => {
              if (item.text === "Profile") {
                setProfileOpen(true);
              } else {
                navigate(item.path);
              }

              if (isMobile) setMobileOpen(false);
            }}
            sx={{
              mx: 1.5,
              my: 0.5,
              borderRadius: 2,
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.15)",
                transform: "translateX(5px)",
              },
            }}
          >
            <ListItemIcon sx={{ color: "#fff" }}>{item.icon}</ListItemIcon>

            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ p: 2 }}>
        <Divider sx={{ borderColor: "rgba(255,255,255,0.2)", mb: 2 }} />

        <div className="flex flex-row items-center gap-2">
          <img
            src={
              user?.student?.profile_picture
                ? `${import.meta.env.VITE_API_URL}${user.student.profile_picture}`
                : logo
            }
            className="w-8 h-8 object-cover rounded-full"
            alt="profile"
          />

          <p className="text-md truncate">
            {user?.student?.full_name || "Loading..."}
          </p>
        </div>

        <ListItemButton
          sx={{
            mt: 2,
            borderRadius: 2,
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.15)",
            },
          }}
          onClick={() => {
            localStorage.removeItem("user");
            navigate("/");
          }}
        >
          <ListItemIcon sx={{ color: "#fff" }}>
            <LogoutIcon />
          </ListItemIcon>

          <ListItemText primary="Logout" />
        </ListItemButton>
      </Box>
    </>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {isMobile && (
        <AppBar position="fixed" sx={{ zIndex: 1300 }}>
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>

            <Typography variant="h6" noWrap>
              ZDSPGC Room Reservation
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      <Box component="nav">
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              background: "linear-gradient(180deg, #0d47a1 0%, #1976d2 100%)",
              color: "#fff",
              boxShadow: "4px 0 20px rgba(0,0,0,0.2)",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      <ProfileModal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        user={user}
      />

      <Box
        component="main"
        sx={{ flexGrow: 1, p: 2, mt: isMobile ? "64px" : 0 }}
      />
    </Box>
  );
}

export default Sidebar;
