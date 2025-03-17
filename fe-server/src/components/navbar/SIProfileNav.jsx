import React, { useState } from "react";
import { IconButton, Menu, MenuItem, ListItemIcon, Avatar } from "@mui/material";
// Icons
import ImportContactsOutlinedIcon from '@mui/icons-material/ImportContactsOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ModelTrainingOutlinedIcon from '@mui/icons-material/ModelTrainingOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
// React Router DOM
import { useNavigate } from "react-router-dom";

const SIProfileNav = ({ t }) => {
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
              {/* Script List */}
              <MenuItem onClick={() => navigate(`/${localStorage.getItem("userId")}/scripts`)}>
                  <ListItemIcon>
                      <DescriptionOutlinedIcon fontSize="small" />
                  </ListItemIcon>
                  {t("navbar.avatar_menu.script")}
              </MenuItem>
              {/* Script Model */}
              <MenuItem onClick={() => navigate(`/${localStorage.getItem("userId")}/model`)}>
                  <ListItemIcon>
                      <ModelTrainingOutlinedIcon fontSize="small" />
                  </ListItemIcon>
                  {t("navbar.avatar_menu.model")}
              </MenuItem>
              {/* Bookmark */}
              <MenuItem onClick={() => navigate(`/${localStorage.getItem("userId")}/bookmark`)}>
                  <ListItemIcon>
                      <BookmarkBorderOutlinedIcon fontSize="small" />
                  </ListItemIcon>
                  {t("navbar.avatar_menu.bookmark")}
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
