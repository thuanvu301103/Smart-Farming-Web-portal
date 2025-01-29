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
import TranslateIcon from '@mui/icons-material/Translate';
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

    // Avatar Menu anchor
    const [avatarAnchorEl, setAvatarAnchorEl] = useState (null);
    const handleAvatarClick = (event) => {
        setAvatarAnchorEl(event.currentTarget);
    };
    const handleAvatarClose = () => {
        setAvatarAnchorEl(null);
    };   

    return (
        <AppBar position="static" color="success">
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu">
                    <MenuIcon />
                </IconButton>

                {/* App logo - Use '/' to get image from public */}
                <img src="/logo192.png" alt="Logo" style={{ height: '40px', marginRight: '10px' }} />

                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    username / project name
                </Typography>

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