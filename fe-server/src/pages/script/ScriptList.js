import React, { useEffect, useState } from 'react';
// Import components
import { PaginatedList } from '../../components/List';
import { ScriptListItem } from '../../components/ListItem';
import {
    Grid, Box,
} from '@mui/material';
import { useFetchScriptsList } from '../../hooks/useFetchUser';

const ScriptList = () => {

    const userId = localStorage.getItem("userId");
    // Fetch scripts List
    const { data: scriptsList, loading: scriptsListLoading  } = useFetchScriptsList(userId);

    return (
        <Box
            display="flex"
            flexDirection="column" // Stack children vertically
            alignItems="flex-start" // Align items at the top
            justifyContent="flex-start" // Ensure content starts at the top
            sx={{ minHeight: '100vh'}}
        >
            <Grid container justifyContent="center">
                <Grid item xs={11} md={9}>
                    <PaginatedList
                        ListItemComponents={ScriptListItem}
                        items={scriptsList}
                        search={'name'}
                        loading={scriptsListLoading}
                        addHref={localStorage.getItem("userId") == userId ? '/new-script' : null}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}

export default ScriptList;