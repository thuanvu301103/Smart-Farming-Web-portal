import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#E2EAF4', // Primary color
        },
        secondary: {
            main: '#dc004e', // Secondary color
        },
        success: {
            main: "#32AA02"
        },
        meta: {
            main: "#FE9900"
        },
        background: {
            default: '#FAFAFA', // Background color
        },
        text: {
            primary: '#000000', // Primary text color
            secondary: '#575656', // Secondary text color
        },
    },
});

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#FFFFFF', // Primary color
        },
        secondary: {
            main: '#f48fb1', // Secondary color
        },
        success: {
            main: "#7DDA58"
        },
        meta: {
            main: "#FE9900"
        },
        background: {
            default: '#121212', // Background color
        },
        text: {
            primary: '#ffffff', // Primary text color
            secondary: '#E2EAF4', // Secondary text color
        },
    },
});

export { lightTheme, darkTheme };