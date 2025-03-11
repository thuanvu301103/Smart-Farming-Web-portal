import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, CircularProgress, Typography, Stack } from '@mui/material';
import { PaginatedList } from '../../components/List';
import { BookmarkListItem } from '../../components/ListItem';
import { useFetchBookmarkList } from '../../hooks/useFetchUser';
import { useTranslation } from 'react-i18next';

const BookmarkList = () => {
    const {t} = useTranslation();
    const { userId } = useParams();
    const { data: initialBookmarkList, loading: bookmarkListLoading, error: bookmarkListError } = useFetchBookmarkList(userId);
    const [bookmarkList, setBookmarkList] = useState([]);

    useEffect(() => {
        if (initialBookmarkList) {
            setBookmarkList(initialBookmarkList);
        }
    }, [initialBookmarkList]);

    const handleUpdateBookmarkList = (newList) => {
        console.log('bookmarkList', newList)
        setBookmarkList(newList);
    };


    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent={bookmarkListLoading || bookmarkListError ? "center" : "start"}
            sx={{ 
                mx: 'auto',
                width: '100%',
                minHeight: '100vh', 
                padding: { xs: '16px', md: '20px', lg: '24px 0' }, 
                maxWidth: '1366px' 
            }}
        >
            {bookmarkListLoading && <CircularProgress />}
            {bookmarkListError && (
                <Typography color="error" variant="h6">
                    {t('bookmark.error')}
                </Typography>
            )}
            {!bookmarkListLoading && !bookmarkListError && bookmarkList && (
                <Stack spacing={2} width="100%" alignItems="center">
                    <PaginatedList
                        ListItemComponents={BookmarkListItem}
                        items={bookmarkList}
                        search="name"
                        loading={bookmarkListLoading}
                        updatedDataHook={handleUpdateBookmarkList}
                    />
                </Stack>
            )}
        </Box>
    );
};

export default BookmarkList;
