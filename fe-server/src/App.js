import logo from './logo.svg';
import React, {useState} from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LngSwitch from './components/LngSwitch';
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from './theme';
import CssBaseline from '@mui/material/CssBaseline';
import Switch from '@mui/material/Switch';

function App() {

    /* Handle Dark mode */

    // Get savedMode from localStorage
    const [darkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : false;
    });

    // Handle Theme Change function - Save the change to localStorage
    const handleThemeChange = () => {
        setDarkMode((prevMode) => {
            const newMode = !prevMode;
            localStorage.setItem('darkMode', JSON.stringify(newMode));
            return newMode;
        });
    };

    /* Handle Language */

    return (
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
            <Switch checked={darkMode} onChange={handleThemeChange} />
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
