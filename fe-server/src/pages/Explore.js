import React, { useEffect, useRef } from 'react';
// Import components
import {
    Grid,
    TextField, Autocomplete,
    Button,
} from '@mui/material';
import Map from '../components/Map';
// Translation
import { useTranslation } from 'react-i18next';
// Icon
import SearchIcon from '@mui/icons-material/Search';

const top100Films = [
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
    { title: 'The Godfather: Part II', year: 1974 },
];

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
                    <Autocomplete
                        multiple
                        limitTags={2}
                        id="multiple-limit-tags"
                        options={top100Films}
                        getOptionLabel={(option) => option.title}
                        defaultValue={[top100Films[1]]}
                        renderInput={(params) => (
                            <TextField {...params} label="limitTags" placeholder="Favorites" />
                        )}
                    />
                    <Autocomplete
                        multiple
                        limitTags={2}
                        id="multiple-limit-tags"
                        options={top100Films}
                        getOptionLabel={(option) => option.title}
                        defaultValue={[top100Films[1]]}
                        renderInput={(params) => (
                            <TextField {...params} label="limitTags" placeholder="Favorites" />
                        )}
                    />
                    
                    <Button variant="contained" color="success" size="large"
                        startIcon={<SearchIcon />}
                    >
                        {t("button.new")}
                    </Button>
                </Grid>
            </Grid>

        </div>
    );
}

export default Explore;