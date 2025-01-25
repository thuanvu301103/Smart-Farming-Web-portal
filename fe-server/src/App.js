import logo from './logo.svg';
import React, {useState} from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LngSwitch from './components/LngSwitch';
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from './theme';
import CssBaseline from '@mui/material/CssBaseline';
import { useDarkMode } from './context/DarkModeContext';

function App() {

    // Handle Dark Mode
    const { darkMode } = useDarkMode();

    /* Handle Language */

    return (
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
            <LngSwitch />
            <CssBaseline />
            <div className="main-content">
                <Navbar />
                <Footer />
            </div>
        </ThemeProvider>
    );
}

export default App;
