import React, { useState, useEffect } from "react";
import { IconButton, Menu, MenuItem, List, ListItem } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { NotificationListItem } from "../../components/ListItem";
import axios from "axios";
import { useSocket } from "../../hooks/useSocket";

const SINotification = ({ t }) => {
    const [notifyActive, setNotificationActive] = useState(0);
    const [notificationData, setNotificationData] = useState([]);
    const [notifyAnchorEl, setNotifyAnchorEl] = useState(null);

    const { notifications, socket } = useSocket();
  useEffect(() => {
    socket.on("message", () => {
      setNotificationActive((prevCount) => prevCount + 1);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("http://localhost:3000/notification", {
          params: { userId: "679b765e8496f00b99063cb8" },
        });
        setNotificationData(response.data);
      } catch (error) {
        console.error("Error fetching notification data:", error);
      }
    };
    fetchNotifications();
  }, []);

  const handleNotifyClick = (event) => {
    setNotifyAnchorEl(event.currentTarget);
  };

  const handleNotifyClose = () => {
    setNotifyAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleNotifyClick}>
        {notifyActive !== 0 ? (
          <NotificationsActiveIcon fontSize="small" color="info" />
        ) : (
          <NotificationsIcon fontSize="small" />
        )}
      </IconButton>

      <Menu anchorEl={notifyAnchorEl} open={Boolean(notifyAnchorEl)} onClose={handleNotifyClose}>
        <MenuItem>
          <List sx={{ width: "100%" }}>
            {notificationData.map((item, index) => (
              <ListItem key={index} sx={{ p: 0 }}>
                <NotificationListItem item={item} />
              </ListItem>
            ))}
          </List>
        </MenuItem>
      </Menu>
    </>
  );
};

export default SINotification;
