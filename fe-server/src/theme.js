import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#EDF9F8', // Primary color
        },
        secondary: {
            main: '#FE9900', // Secondary color
        },
        success: {
            main: "#92D654"
        },
        info: {
            main: "#00A1FE"
        },
        warning: {
            main: "#F59504"
        },
        background: {
            default: '#F3FFFE', // Background color
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
            main: '#FFDE59', // Secondary color
        },
        success: {
            main: "#A8F761"
        },
        info: {
            main: "#5DE2E7"
        },
        warning: {
            main: "#FEA011"
        },
        background: {
            default: '#121212', // Background color
        },
        text: {
            primary: '#FAFAFA', // Primary text color
            secondary: '#CECECE', // Secondary text color
        },
    },
});

export { lightTheme, darkTheme };