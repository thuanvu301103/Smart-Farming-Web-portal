import logo from './logo.svg';
import React from 'react';
import './App.css';
// Import from components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ScriptListItem, FileStructListItem } from './components/ListItem';

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
            <CssBaseline />
            <div className="main-content">
                <Navbar />
                <div>
                    <ScriptListItem name="This is a simple name of Peoject" description="This is a simple description" />
                </div>
                <div>
                    <FileStructListItem name="Magic.py" isFile={true} />
                </div>
                <Footer />
            </div>
        </ThemeProvider>
    );
}

export default App;
