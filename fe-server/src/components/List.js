import React, { useState } from 'react';
import {
    List, Pagination,
    Box,
    TextField,
    Button,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';


const PaginatedList = ({ ListItemComponents, items, itemsPerPage = 30, search }) => {

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
                {paginatedItems.map((item, index) => (
                    <ListItemComponents item={item} />
                ))}
            </List>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <Pagination
                    count={Math.ceil(items.length / itemsPerPage)}
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
