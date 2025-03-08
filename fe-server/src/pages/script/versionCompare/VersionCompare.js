import {
    Grid, Box,
} from '@mui/material';

const VesionCompare = () => {
    return (
        <Box
            display="flex"
            flexDirection="column" // Stack children vertically
            alignItems="flex-start" // Align items at the top
            justifyContent="flex-start" // Ensure content starts at the top
            sx={{ minHeight: '100vh' }}
        >
            <Grid container justifyContent="center">
                <Grid item xs={11} md={11}>
                   
                </Grid>
            </Grid>
        </Box>
    );
}

export default VesionCompare;