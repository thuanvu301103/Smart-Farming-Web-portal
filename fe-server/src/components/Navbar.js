import React, { useState } from 'react';
import {
    AppBar,     // Create a top-level navigation bar
    Toolbar,    // Create a container for elements within an AppBar
    Typography,
    Button, IconButton,
    Avatar,
    Menu, MenuItem, ListItemIcon
} from '@mui/material';
import Switch from '@mui/material/Switch';
import MenuIcon from '@mui/icons-material/Menu';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useDarkMode } from '../context/DarkModeContext';
import { useTranslation } from 'react-i18next';

// Avatar Menu
const AvatarMenu = ({ anchorEl, handleClose, t}) => {

    const { darkMode, handleThemeChange } = useDarkMode();

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
            <MenuItem onClick={handleClose}></MenuItem>
            <MenuItem onClick={handleClose}></MenuItem>
        </Menu>
    );

}

const Navbar = () => {

    const { t } = useTranslation();

    // Avatar Menu anchor
    const [avatarAnchorEl, setAvatarAnchorEl] = useState (null);
    const handleAvatarClick = (event) => {
        setAvatarAnchorEl(event.currentTarget);
    };
    const handleAvatarClose = () => {
        setAvatarAnchorEl(null);
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: 'black' }}>
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu">
                    <MenuIcon />
                </IconButton>

                {/* App logo - Use '/' to get image from public */}
                <img src="/logo192.png" alt="Logo" style={{ height: '40px', marginRight: '10px' }} />

                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    username / project name
                </Typography>
                <Button color="inherit">{t('navbar.home')}</Button>
                <Button color="inherit">{t('navbar.about')}</Button>
                <Button color="inherit">{t('navbar.contact')}</Button>

                {/* Account Avatar Icon Button */}
                <IconButton onClick={handleAvatarClick}>
                    <Avatar alt="User Avatar" src="/logo192.png" />
                </IconButton>
                {/* Avatar Menu */}
                <AvatarMenu anchorEl={avatarAnchorEl} handleClose={handleAvatarClose} t={t} />
               

            </Toolbar>
        </AppBar>
    );
};

export default Navbar;