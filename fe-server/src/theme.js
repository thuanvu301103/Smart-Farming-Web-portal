import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#FFFFFF', // Primary color
        },
        secondary: {
            main: '#FFDE59', // Secondary color
        },
        success: {
            main: "#009688"
        },
        info: {
            main: "#29B6F6"
        },
        warning: {
            main: "#F59504"
        },
        error: {
            main: '#e53935'
        },
       background: {
            default: '#121212', // Background color
            trans_black: 'rgba(120, 120, 120, 0.5)'
        },
        text: {
            primary: '#000000', // Primary text color
            secondary: '#BDBDBD', // Secondary text color
            default_white: '#FFFFFF'
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
            main: '#FFDE59', // Secondary color
        },
        success: {
            main: "#26A69A"
        },
        info: {
            main: "#4FC3F7"
        },
        warning: {
            main: "#FEA011"
        },
        error: {
            main: '#e53935'
        },
        background: {
            default: '#121212', // Background color
            trans_black: 'rgba(0, 0, 0, 0.5)'
        },
        text: {
            primary: '#FAFAFA', // Primary text color
            secondary: '#CECECE', // Secondary text color
            default_white: '#FFFFFF'
        },
    },
});

export { lightTheme, darkTheme };