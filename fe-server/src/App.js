import React from 'react';
import './App.css';
// Import from components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
// Import pages
import User from './pages/User';
import Script from './pages/Script';
import NewScript from './pages/NewScript';
// React Router DOM
import { BrowserRouter as Router, Route, Routes, } from 'react-router-dom';
// Import for theme and Dark Mode
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from './theme';
import CssBaseline from '@mui/material/CssBaseline';
import { useDarkMode } from './context/DarkModeContext';

function App() {

    // Handle Dark Mode
    const { darkMode } = useDarkMode();

    // User Info - after login
    const userId = "679b765e8496f00b99063cb8";

    return (
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
            <CssBaseline />
            <div className="full-page">
                <Router>
                    <div>
                        <Navbar />
                        <Routes>
                            <Route path="/:userId/*" element={<User />} />
                            <Route path="/:userId/scripts/:scriptId/*" element={<Script />} />
                            <Route path="/new-script" element={<NewScript userId={userId}/>} />
                        </Routes>
                    </div>
                    <Footer />
                </Router>
            </div>
        </ThemeProvider>
    );
}

export default App;
