import React, { useState } from 'react';
import {
    List, Pagination,
    Box,
    TextField,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

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

    const filteredItems = items.filter(item =>
        item[search].toLowerCase().includes(searchTerm.toLowerCase())
    );
    const paginatedItems = filteredItems.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <Box>
            {search? 
                <TextField
                    label={t("list.search_for")}
                    variant="filled"
                    color="background.paper"
                    fullWidth
                    margin="normal"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    size="small"
                /> : null
            }
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
