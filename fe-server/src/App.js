import logo from './logo.svg';
import React, { useState, useEffect} from 'react';
import './App.css';
// Import from components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ScriptListItem, FileStructListItem } from './components/ListItem';
import { PaginatedList } from './components/List';

import { Tab, Tabs } from '@mui/material';
// React Router DOM
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
// Import for theme and Dark Mode
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from './theme';
import CssBaseline from '@mui/material/CssBaseline';
import { useDarkMode } from './context/DarkModeContext';
// Import Icons
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ImportContactsOutlinedIcon from '@mui/icons-material/ImportContactsOutlined';
// Translation
import { useTranslation } from 'react-i18next';

function App() {

    const { t } = useTranslation();

    // Handle Dark Mode
    const { darkMode } = useDarkMode();

    // Dump script items list
    const items = [
        { name: "Magic 1", description: "This is a simple item 1" },
        { name: "Magic 2", description: "This is a simple item 2" },
        { name: "Magic 3", description: "This is a simple item 3" },
    ];

    // Tab value
    const [value, setValue] = useState('overview');
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    /*
    const location = useLocation();
    useEffect(() => {
        const lastSegment = location.pathname.split('/').filter(Boolean).pop();
        setValue(lastSegment || 'overview'); // Default to 'overview' if no segment
    }, [location]);
    */

    return (
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
            <CssBaseline />
            <div className="full-page">
                <Router>
                    <Navbar />
                    <div className="main-content">
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor="secondary"
                        textColor="inherit"
                        aria-label="secondary tabs example"
                        size="small"
                        sx={{
                            '& .MuiTab-root': {
                                textTransform: 'none', // Disable uppercase text
                                minHeight: '45px', // Adjust the minimum height of the tab
                            },
                        }}
                    >
                        <Tab
                            icon={<ImportContactsOutlinedIcon />} iconPosition="start"
                            value="overview"
                            component={Link} to="/overview"
                            label={t("tab.overview")}
                        />
                        <Tab
                            icon={<DescriptionOutlinedIcon />} iconPosition="start"
                            value="script"
                            component={Link} to="/script"
                            label={t("tab.script")}
                        />
                    </Tabs>
                    <Routes>
                        <Route
                            path="/overview"
                            element={<FileStructListItem name="Magic.py" isFile={true} />}
                        />
                        <Route
                            path="/script"
                            element={
                                <PaginatedList
                                    ListItemComponents={ScriptListItem}
                                    items={items} search={'name'}
                                />
                            }
                        />
                        </Routes>
                    </div>
                    <Footer />
                </Router>
            </div>
        </ThemeProvider>
    );
}

export default App;
