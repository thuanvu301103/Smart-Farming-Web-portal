import React from 'react';
import { Box, Container, Typography, Link, Grid } from '@mui/material';

const Footer = () => {
    return (
        <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
            <Container maxWidth="lg">
                <Grid container spacing={2} justifyContent="center" alignItems="center">
                    <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                        <img src="/logo192.png" alt="Logo" style={{ height: '25px', marginRight: '5px' }} />
                        <Link color="inherit" href="https://your-website.com/" sx={{ textDecoration: 'none' }}>
                            Your Website
                        </Link>{', '}
                        {new Date().getFullYear()}
                        {'.'}
                    </Grid>
                    <Grid item>
                        <Link href="#" color="inherit" sx={{ textDecoration: 'none' }}>
                            Terms
                        </Link>
                    </Grid>
                    <Grid item>
                        <Link href="#" color="inherit" sx={{ textDecoration: 'none' }}>
                            Privacy
                        </Link>
                    </Grid>
                    <Grid item>
                        <Link href="#" color="inherit" sx={{ textDecoration: 'none' }}>
                            Security
                        </Link>
                    </Grid>
                    <Grid item>
                        <Link href="#" color="inherit" sx={{ textDecoration: 'none' }}>
                            Status
                        </Link>
                    </Grid>
                    <Grid item>
                        <Link href="#" color="inherit" sx={{ textDecoration: 'none' }}>
                            Docs
                        </Link>
                    </Grid>
                    <Grid item>
                        <Link href="#" color="inherit" sx={{ textDecoration: 'none' }}>
                            Contact
                        </Link>
                    </Grid>
                    <Grid item>
                        <Link href="#" color="inherit" sx={{ textDecoration: 'none' }}>
                            Manage cookies
                        </Link>
                    </Grid>
                    <Grid item>
                        <Link href="#" color="inherit" sx={{ textDecoration: 'none' }}>
                            Do not share my personal information
                        </Link>
                    </Grid>
                </Grid>
                
            </Container>
        </Box>
    );
};

export default Footer;
