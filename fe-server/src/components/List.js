import React, { useState } from 'react';
// Import components
import {
    List, Pagination,
    Box,
    TextField, Typography,
    Button,
    CircularProgress,
} from '@mui/material';
// Translation
import { useTranslation } from 'react-i18next';
// Import Icons
import AddIcon from '@mui/icons-material/Add';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';

const PaginatedList = ({ ListItemComponents, items, itemsPerPage = 10, search, loading }) => {

    const { t } = useTranslation();
    // Handle pagination
    const [page, setPage] = useState(1);
    const handleChange = (event, value) => {
        setPage(value);
    };
    // Handle Search term
    const [searchTerm, setSearchTerm] = useState('');
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setPage(1); // Reset to first page on search
    };

    const filteredItems = search ? items.filter(item =>
        item[search].toLowerCase().includes(searchTerm.toLowerCase())
    ) : items;
    const paginatedItems = filteredItems.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end', // Align items to the right
                    alignItems: 'center', // Center align items vertically
                    gap: 2, // Add space between items
                }}
            >
            {search? 
                <TextField
                    label={t("list.search_for")}
                    variant="outlined"
                    color="success"
                    sx={{ flexGrow: 1 }}
                    margin="normal"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    size="small"
                /> : null
            }
            <Button variant="contained" color="success" size="large" startIcon={<AddIcon />}>
                {t("button.new")}
            </Button>
            </Box>
            <List>
                {loading ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '30vh' }}>
                        <CircularProgress />
                        <Typography variant="caption" sx={{ mt: 2 }}>{t("loading")}</Typography>
                    </Box>
                ) : paginatedItems.length === 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '30vh' }}>
                            <FolderOpenIcon sx={{ fontSize: 90 }} />
                        <Typography variant="h6" sx={{ mt: 2 }}>{t("no_data")}</Typography>
                    </Box>
                ) : (
                    paginatedItems.map((item, index) => (
                        <ListItemComponents key={index} item={item} />
                    ))
                )}

            </List>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <Pagination
                    count={Math.ceil(filteredItems.length / itemsPerPage)}
                    page={page}
                    onChange={handleChange}
                    color="primary"
                />
            </Box>
        </Box>
    );
};

const FList = ({ ListItemComponents, items }) => {
    return (
        <List>
            {items.map((item, index) => (
                <ListItemComponents item={item} />
            ))}
        </List>
    );
}

export { FList, PaginatedList };
