import React, { useState, useEffect } from 'react';
// Import from components
import { ScriptListItem, FileStructListItem } from './ListItem';
import { PaginatedList } from './List';

import { Tab, Tabs } from '@mui/material';
// React Router DOM
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';

const Tabnav = ({data}) => {

    // Tab value
    const [value, setValue] = useState('');
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const location = useLocation();
    useEffect(() => {
        const lastSegment = location.pathname.split('/').filter(Boolean).pop();
        setValue(lastSegment || 'overview'); // Default to 'overview' if no segment
    }, [location]);

    return (
        <div>
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
                {data ? data.map((item, index) => (
                    <Tab
                        icon={item?.icon ? item.icon : null} iconPosition="start"
                        value={item?.value ? item.value : null}
                        component={Link} to={item?.path ? item.path : null}
                        label={item?.label ? item.label : null}
                    />
                )) : null}
            </Tabs>
            <Routes>
                {data ? data.map((item, index) => (
                    <Route
                        path={item?.path ? item.path : null}
                        element={item?.element ? item.element : null}
                    />
                )) : null}
            </Routes>
        </div>
        );
}

export default Tabnav;