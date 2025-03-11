import React, { useState, useMemo } from 'react';
import { ModelListItem } from '../../components/ListItem';
import { Box, CircularProgress, Typography, TextField, Button, Pagination } from '@mui/material';
import FolderOpenIcon from '@mui/icons-material/FolderOpen'; // Import missing icon
import {useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import { useFetchModelsList } from '../../hooks/useFetchUser';
const ModelList = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const userId = localStorage.getItem("userId");
    const { data: modelsList, loading: modelsListLoading, error: modelsListError  } = useFetchModelsList(userId);

    // Pagination State
    const [page, setPage] = useState(1);
    const itemsPerPage = 6; 

    const handleChange = (event, value) => {
        setPage(value);
    };

    // Search State
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setPage(1); // Reset to first page on search
    };

    // Ensure modelsList is an array to prevent errors
    const models = modelsList || [];

    // Filter and paginate items
    const filteredItems = models.filter((item) =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) 
    );

    const paginatedItems = filteredItems.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    const processedItems = useMemo(() => paginatedItems, [paginatedItems]);

    // Handle Delete (dummy function for now)
    const handleDeleteItem = (index) => {
        console.log("Delete item at index:", index);
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent={modelsListLoading || modelsListError ? "center" : "start"}
            sx={{ 
                mx: 'auto',
                width: '100%',
                minHeight: '100vh', 
                padding: { xs: '16px', md: '20px', lg: '24px 0' }, 
                maxWidth: '1366px' 
            }}
        >
            {/* Search Bar + Button */}
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'nowrap',
                    gap: 2,
                    width: '100%',
                    alignItems: 'center',
                    mb: 2,
                }}
            >    
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder={t("search")}
                    value={searchTerm}
                    onChange={handleSearchChange}
                    sx={{ flex: 1 }}
                    size="small"
                />
                <Button
                    variant="contained"
                    color="success"
                    size="large"
                    startIcon={<AddIcon />}
                    size="medium"
                    sx={{
                        borderRadius: '8px',
                        padding: '10px 20px',
                        whiteSpace: 'nowrap',
                        minWidth: '150px',
                        height: '56px',
                    }}
                    onClick={() => navigate(`/${userId}/models/new-model`)}
                >
                    {t("button.new")}
                </Button>
            </Box>

            {/* Error State */}
            {modelsListError && (
                <Typography color="error" variant="h6">
                    {t('bookmark.error')}
                </Typography>
            )}

            {/* Loading State */}
            {modelsListLoading && (
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '30vh' }}>
                    <CircularProgress />
                    <Typography variant="caption" sx={{ mt: 2 }}>{t("loading")}</Typography>
                </Box>
            )}

            {/* List Items */}
            {!modelsListLoading && !modelsListError && (
                <Box
                    sx={{
                        display: 'grid',
                        gap: '16px',
                        gridTemplateColumns: {
                            xs: '1fr',
                            md: processedItems.length >= 2 ? '1fr 1fr' : '1fr',
                        },
                        width: '100%',
                    }}
                >
                    {/* Empty State */}
                    {processedItems.length === 0 ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '30vh' }}>
                            <FolderOpenIcon sx={{ fontSize: 90, color: 'grey.500' }} />
                            <Typography variant="h6" sx={{ mt: 2, color: 'grey.600' }}>{t("no_data")}</Typography>
                        </Box>
                    ) : (
                        processedItems.map((item, index) => (
                            <ModelListItem key={index} item={item} removeItemFunc={() => handleDeleteItem(index)} />
                        ))
                    )}
                    
                    {/* Pagination */}
                    {filteredItems.length > itemsPerPage && (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                            <Pagination
                                count={Math.ceil(filteredItems.length / itemsPerPage)}
                                page={page}
                                onChange={handleChange}
                                color="primary"
                            /> 
                        </Box>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default ModelList;
