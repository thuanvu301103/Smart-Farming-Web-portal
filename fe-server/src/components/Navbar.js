import React from 'react';
// Import component
import {
    AppBar,     
    Toolbar,   
    Button, IconButton,
    Avatar,
    Box,
} from '@mui/material';
// Icons
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness5Icon from '@mui/icons-material/Brightness5';
import SearchIcon from '@mui/icons-material/Search';
import { useDarkMode } from '../context/DarkModeContext';
import { useTranslation } from 'react-i18next';
// Auth
import { isAuthenticated } from "../auth";
// React DOM
import { useNavigate, useLocation, Navigate, Link } from "react-router-dom";
import { Search, SearchIconWrapper, StyledInputBase } from './SIExpandableInput';
import SIDrawer from './SIDrawer';
import SILangSelect from './SILangSelect';
import SINotification from './SINotification';
import SIProfileNav from './SIProfileNav';

const Navbar = () => {

    const { t, i18n } = useTranslation();
    // const userId = localStorage.getItem("userId");

    const { darkMode, handleThemeChange } = useDarkMode();

    const isAuthed = isAuthenticated();

    return (
        <AppBar position="static" color="success" sx={{ boxShadow: 'none'}}>
            <Toolbar sx={{ 
                display: "flex",
                width: '100%',
                alignSelf: "center",
                justifyContent: 'space-between',
                padding: {xl: '0'},
                maxWidth: {xl: '1260px'},    
            }}>
                <Box sx={{display:'flex', gap:'8px', alignItems:'center'}}>
                    <SIDrawer/>
                    <Avatar component={Link} sx={{overflow:'hidden'}} to="/" alt="Logo" src="/logo.jpg"/>
                </Box>
                

                <Box sx={{ display: "flex", alignItems: "center", gap: '16px' }}>
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon/>
                        </SearchIconWrapper>
                        <StyledInputBase
                        placeholder="Search…"
                        inputProps={{ 'aria-label': 'search' }}
                        />
                    </Search>

                    {isAuthed && <SINotification t={t} />}

                    {isAuthed ? <SIProfileNav t={t} /> : <Button component={Link} to="/login">Get Started</Button>}

                    <SILangSelect/>
                    
                    <IconButton onClick={handleThemeChange}>{darkMode ? <Brightness4Icon/> : <Brightness5Icon/>}</IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;