import logo from './logo.svg';
import React from 'react';
import './App.css';
// Import from components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ScriptListItem, FileStructListItem } from './components/ListItem';
import { PaginatedList } from './components/List';

import { ThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from './theme';
import CssBaseline from '@mui/material/CssBaseline';
import { useDarkMode } from './context/DarkModeContext';


function App() {

    // Handle Dark Mode
    const { darkMode } = useDarkMode();

    // Dump script items list
    const items = [
        { name: "Magic 1", description: "This is a simple item 1" },
        { name: "Magic 2", description: "This is a simple item 2" },
        { name: "Magic 3", description: "This is a simple item 3" },
    ];

    return (
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
            <CssBaseline />
            <div className="main-content">
                <Navbar />
                <div>
                    <PaginatedList ListItemComponents={ScriptListItem} items={items} search={'name'} />
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
