import React, { useEffect, useState } from 'react';
// Import components
import { PaginatedList } from '../../components/List';
import { ScriptListItem } from '../../components/ListItem';
import {
    Grid, Typography, Link, Box,
    CardContent, ListItem, List, Divider
} from '@mui/material';

const ScriptList = ({data, loading}) => {

    //console.log("ScriptList data: ", data);

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
                        addHref={'/new-script'}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}

export default ScriptList;