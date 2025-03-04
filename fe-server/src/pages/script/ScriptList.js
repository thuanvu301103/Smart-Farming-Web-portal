import React, { useEffect, useState } from 'react';
// Import components
import { PaginatedList } from '../../components/List';
import { ScriptListItem } from '../../components/ListItem';
import {
    Grid, Box,
} from '@mui/material';
// React Router DOM
import { useParams } from 'react-router-dom';

const ScriptList = ({ data, loading }) => {

    const { userId } = useParams();

    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
        >
            <Grid container justifyContent="center">
                <Grid item xs={11} md={9}>
                    <PaginatedList
                        ListItemComponents={ScriptListItem}
                        items={data}
                        search={'name'}
                        loading={loading}
                        addHref={localStorage.getItem("userId") == userId ? '/new-script' : null}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}

export default ScriptList;