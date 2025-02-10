import React, { useEffect, useRef } from 'react';
// Import components
import {
    Grid, 
} from '@mui/material';
import Map from '../components/Map';
// Translation
import { useTranslation } from 'react-i18next';

const Explore = () => {

    const { t } = useTranslation();
    const loading = false;

    return (
        <div className="main-content">
            <Grid container alignItems="start" mt={1} mb={1}>
                <Grid item xs={3}>
                    {/*Map*/}
                    <Map />
                </Grid>
                <Grid item xs={9}>
                    
                </Grid>
            </Grid>

        </div>
    );
}

export default Explore;