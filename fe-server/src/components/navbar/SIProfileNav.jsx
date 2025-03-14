import React, { useState } from "react";
import { IconButton, Menu, MenuItem, ListItemIcon, Avatar, Switch } from "@mui/material";
// Icons
import ImportContactsOutlinedIcon from '@mui/icons-material/ImportContactsOutlined';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import { useDarkMode } from "../../context/DarkModeContext";
import { useNavigate } from "react-router-dom";

const SIProfileNav = ({ t }) => {
  const { darkMode, handleThemeChange } = useDarkMode();
  const navigate = useNavigate();
  const [avatarAnchorEl, setAvatarAnchorEl] = useState(null);

  const handleAvatarClick = (event) => {
    setAvatarAnchorEl(event.currentTarget);
  };

  const handleAvatarClose = () => {
    setAvatarAnchorEl(null);
  };

  const handleSignout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("profileImage");
    localStorage.removeItem("curUsername");
    navigate("/");
    window.location.reload();
  };

  return (
    <>
      <IconButton onClick={handleAvatarClick}>
        <Avatar alt="User Avatar" src={localStorage.getItem("profileImage")} />
      </IconButton>

          <Menu anchorEl={avatarAnchorEl} open={Boolean(avatarAnchorEl)} onClose={handleAvatarClose}>
              {/* Overview */}
              <MenuItem onClick={() => navigate(`/${localStorage.getItem("userId")}/overview`)}>
                  <ListItemIcon>
                      <ImportContactsOutlinedIcon fontSize="small" />
                  </ListItemIcon>
                  {t("navbar.avatar_menu.overview")}
              </MenuItem>
        <MenuItem onClick={handleSignout}>
          <ListItemIcon>
            <PowerSettingsNewIcon fontSize="small" color="script" />
          </ListItemIcon>
          {t("navbar.avatar_menu.sign_out")}
        </MenuItem>
      </Menu>
    </>
  );
};

export default SIProfileNav;
