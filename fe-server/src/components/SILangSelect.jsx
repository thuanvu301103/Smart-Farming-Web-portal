import { Button, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import TranslateIcon from '@mui/icons-material/Translate';

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

const SILangSelect = () => {
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
    return (
        <>
            {/* Language Selected Button */}
            <Button sx={{textTransform: 'none'}}  startIcon={<TranslateIcon />} onClick={handleLngList}>
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
        </>
    )
}
export default SILangSelect;