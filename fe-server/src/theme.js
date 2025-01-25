import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2', // Primary color
        },
        secondary: {
            main: '#dc004e', // Secondary color
        },
        background: {
            default: '#f5f5f5', // Background color
        },
        text: {
            primary: '#000000', // Primary text color
            secondary: '#ffffff', // Secondary text color
        },
    },
});

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#90caf9', // Primary color
        },
        secondary: {
            main: '#f48fb1', // Secondary color
        },
        background: {
            default: '#121212', // Background color
        },
        text: {
            primary: '#ffffff', // Primary text color
            secondary: '#000000', // Secondary text color
        },
    },
});

export { lightTheme, darkTheme };