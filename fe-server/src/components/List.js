import React, { useState } from 'react';
import { List, Pagination, Box } from '@mui/material';

const PaginatedList = ({ ListItemComponents, items, itemsPerPage = 30 }) => {
    const [page, setPage] = useState(1);
    const handleChange = (event, value) => {
        setPage(value);
    };

    const paginatedItems = items.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <Box>
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
