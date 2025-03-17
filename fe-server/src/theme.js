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
            main: "#29B6F6",
            contrastText: "#FFFFFF"
        },
        warning: {
            main: "#FF6F00",
            contrastText: "#FFFFFF"
        },
        error: {
            main: '#e53935'
        },
        script: {
            main: '#E91E63'
        },
        comment: {
            main: '#8E24AA'
        },
        background: {
            default: '#FAFAFA', // Background color
            trans_black: 'rgba(120, 120, 120, 0.5)'
        },
        text: {
            primary: '#212121', // Primary text color
            secondary: '#616161', // Secondary text color
            default_white: '#FFFFFF',
            pink: "#E91E63"

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
            main: "#4FC3F7",
            contrastText: "#FFFFFF"
        },
        warning: {
            main: "#FEA011",
            contrastText: "#FFFFFF"
        },
        error: {
            main: '#e53935'
        },
        script: {
            main: '#F06292'
        },
        comment: {
            main: '#9C27B0'
        },
        background: {
            default: '#121212', // Background color
            trans_black: 'rgba(0, 0, 0, 0.5)'
        },
        text: {
            primary: '#FAFAFA', // Primary text color
            secondary: '#CECECE', // Secondary text color
            default_white: '#FFFFFF',
            pink: "#F06292"
        },
    },
});

export { lightTheme, darkTheme };