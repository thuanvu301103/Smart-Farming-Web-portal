import React, { useState, useEffect } from 'react';
// Import component
import {
    AppBar,     // Create a top-level navigation bar
    Toolbar,    // Create a container for elements within an AppBar
    Typography,
    Button, IconButton,
    Avatar,
    Menu, MenuItem, ListItemIcon,
    List, ListItem,
    Breadcrumbs, Link,
    Box,
} from '@mui/material';
import Switch from '@mui/material/Switch';
import { NotificationListItem } from '../components/ListItem';
// Icons
import MenuIcon from '@mui/icons-material/Menu';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import TranslateIcon from '@mui/icons-material/Translate';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { useDarkMode } from '../context/DarkModeContext';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
// Socket
import socket from '../socket/websocket'; // Import file socket.js
// Auth
import { isAuthenticated } from "../auth";
// React DOM
import { useNavigate, useLocation, Navigate } from "react-router-dom";

// Avatar Menu
const AvatarMenu = ({ anchorEl, handleClose, t}) => {
    const navigate = useNavigate();
    const { darkMode, handleThemeChange } = useDarkMode();

    const handleSignout = () => {
        console.log("Sign-OUT")
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("profileImage");
        localStorage.removeItem("curUsername");
        navigate("/login");
        window.location.reload();
    }

    return (
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
        >
            {/* Dark Mode Switch */}
            <MenuItem>
                <ListItemIcon>
                    <DarkModeIcon fontSize="small" />
                </ListItemIcon>
                {t('navbar.avatar_menu.dark_mode')}
                <Switch checked={darkMode} onChange={handleThemeChange} />
            </MenuItem>
            <MenuItem onClick={handleSignout}> Đăng xuất</MenuItem>
            <MenuItem onClick={handleClose}></MenuItem>
        </Menu>
    );

}

// Language Selected Menu
const LngSelectedMenu = ({ anchorEl, handleClose, handleMenuItemClick, options, selectedIndex, t }) => {

    return (
        <Menu
            id="lock-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            MenuListProps={{
                'aria-labelledby': 'lock-button',
                role: 'listbox',
            }}
        >
            {Object.entries(options).map(([key, value], index) => (
                <MenuItem
                    key={key}
                    selected={key === selectedIndex}
                    onClick={(event) => handleMenuItemClick(event, key)}
                >
                    {value}
                </MenuItem>
            ))}
        </Menu>
    );
}

// Notification Menu
const NotificationMenu = ({ anchorEl, handleClose, data, t }) => {
    const { darkMode, handleThemeChange } = useDarkMode();

    return (
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
        >         
            <MenuItem>
                <List sx={{ width: "100%" }}>
                    {data.map((item, index) => (
                        <ListItem key={index} sx={{ p: 0 }}>
                            <NotificationListItem
                                item={item}
                            />
                        </ListItem>
                    ))}
                </List>
            </MenuItem>
        </Menu>
    );
}

// Navigate Bar
const Navbar = () => {

    const { t, i18n } = useTranslation();
    const options = {
        vi: t('navbar.language_menu.vi'),
        en: t('navbar.language_menu.en'),
    };

    // Language Selected Menu
    const [lngAnchorEl, setLngAnchorEl] = useState(null);
    const [selectedLngIndex, setSelectedLngIndex] = useState(localStorage.getItem('i18nextLng'));    // Selected language
    const handleLngList = (event) => {
        setLngAnchorEl(event.currentTarget);
    };
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };
    const handleLngItemClick = (event, index) => {  // Handling clicking a Language Menu Item
        setSelectedLngIndex(index);
        changeLanguage(index);
        setLngAnchorEl(null);
    };
    const handleLngClose = () => {  // Handling closing Language Menu
        setLngAnchorEl(null);
    };

    /* Notification */
    // Handle Notification realtiem active
    const [notifyActive, setNotificationActive] = useState(0);
    useEffect(() => {
        // Listen message event from Server
        socket.on('message', (newMessage) => {
            setNotificationActive((prevCount) => prevCount + 1);
        });

        // Cleanup when component is unmounted
        return () => {
            socket.off('message');
        };
    }, []);

    const [notificationData, setNotificationData] = useState([]);
    // Notification data
    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3000/notification`,
                    {
                        params: {
                            userId: "679b765e8496f00b99063cb8"
                        }
                    }
                );
                console.log("Notification data: ", response.data);
                setNotificationData(response.data);
            } catch (error) {
                console.error('Error fetching notification data:', error);
            }
        };
        fetch();
    }, []);
    // Notification menu handlers
    const [notifyAnchorEl, setNotifyAnchorEl] = useState(null);
    const handleNotifyClick = (event) => {
        setNotifyAnchorEl(event.currentTarget);
    };
    const handleNotifyClose = () => {
        setNotifyAnchorEl(null);
    };

    // Avatar Menu anchor
    const [avatarAnchorEl, setAvatarAnchorEl] = useState (null);
    const handleAvatarClick = (event) => {
        setAvatarAnchorEl(event.currentTarget);
    };
    const handleAvatarClose = () => {
        setAvatarAnchorEl(null);
    };

    const isAuthed = isAuthenticated();

    return (
        <AppBar position="static" color="success" sx={{ boxShadow: 'none' }}>
            <Toolbar sx={{ display: "flex" }}>
                {isAuthed ? <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>

                    <Avatar alt="Logo" src="/logo.jpg"/>
                    {/* Breadcrumbs?????????? */}
                    <Breadcrumbs aria-label="breadcrumb" ml={2}>
                        <Link underline="hover" color="text.default_white">
                            {localStorage.getItem("curUsername")}
                        </Link>
                    </Breadcrumbs>
                </Box> : null}

                <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
                {/* Language Selected Button */}
                <Button color="primary" variant="contained" startIcon={<TranslateIcon />} onClick={handleLngList}>
                    {options[selectedLngIndex]}
                </Button>
                {/* Language Selected Menu */}
                <LngSelectedMenu
                    anchorEl={lngAnchorEl}
                    handleClose={handleLngClose}
                    handleMenuItemClick={handleLngItemClick}
                    options={options}
                    selectedIndex={selectedLngIndex}
                    t={t}
                />

                <Button color="background.paper">{t('navbar.home')}</Button>
                <Button color="inherit">{t('navbar.about')}</Button>
                <Button color="inherit">{t('navbar.contact')}</Button>

                {isAuthed ? <>
                {/* Notification button */}
                <IconButton onClick={handleNotifyClick}>
                    {(notifyActive != 0) ? <NotificationsActiveIcon fontSize="small" color="info"/>
                        : <NotificationsIcon fontSize="small" />}
                </IconButton>
                {/* Notification Mneu */}
                <NotificationMenu
                    anchorEl={notifyAnchorEl}
                    handleClose={handleNotifyClose}
                    t={t}
                    data={notificationData}
                    />
                </> : null}

                {/* Account Avatar Icon Button */}
                    <IconButton onClick={handleAvatarClick}>
                    {isAuthed ? <Avatar alt="User Avatar" src={localStorage.getItem('profileImage')} /> : <Avatar alt="Logo" src="/logo.jpg" />}
                    </IconButton>
                    {/* Avatar Menu */}
                    <AvatarMenu anchorEl={avatarAnchorEl} handleClose={handleAvatarClose} t={t} />
               
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;