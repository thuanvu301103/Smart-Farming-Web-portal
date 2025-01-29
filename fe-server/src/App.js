import logo from './logo.svg';
import React from 'react';
import './App.css';
// Import from components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Tabnav from './components/Tabnav';
// Import pages
import ScriptList from './pages/ScriptList';
import Overview from './pages/Overview';
// React Router DOM
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
// Import for theme and Dark Mode
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from './theme';
import CssBaseline from '@mui/material/CssBaseline';
import { useDarkMode } from './context/DarkModeContext';
// Translation
import { useTranslation } from 'react-i18next';
// Import Icons
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ImportContactsOutlinedIcon from '@mui/icons-material/ImportContactsOutlined';

function App() {

    const { t } = useTranslation();

    // Handle Dark Mode
    const { darkMode } = useDarkMode();

    // Tab data
    const tabdata = [
        {
            icon: <ImportContactsOutlinedIcon />,
            value: "overview",
            path: "/overview",
            label: t("tab.overview"),
            element: <Overview />
        },
        {
            icon: <DescriptionOutlinedIcon />,
            value: "script",
            path: "/script",
            label: t("tab.script"),
            element: <ScriptList />
        },
    ];


    return (
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
            <CssBaseline />
            <div className="full-page">
                <Router>
                    <div>
                        <Navbar />
                        <Tabnav data={tabdata} />
                    </div>
                    <Footer />
                </Router>
            </div>
        </ThemeProvider>
    );
}

export default App;
