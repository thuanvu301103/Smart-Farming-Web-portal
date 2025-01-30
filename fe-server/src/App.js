import React from 'react';
import './App.css';
// Import from components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
// Import pages
import User from './pages/User';
// React Router DOM
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
// Import for theme and Dark Mode
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from './theme';
import CssBaseline from '@mui/material/CssBaseline';
import { useDarkMode } from './context/DarkModeContext';

function App() {

    // Handle Dark Mode
    const { darkMode } = useDarkMode();

    return (
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
            <CssBaseline />
            <div className="full-page">
                <Router>
                    <div>
                        <Navbar />
                        <Routes>
                            <Route path="/:userId/*" element={<User />} />
                        </Routes>
                    </div>
                    <Footer />
                </Router>
            </div>
        </ThemeProvider>
    );
}

export default App;
