import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#7FB3D5',
            light: '#A9CCE3',
            dark: '#5499C7',
            contrastText: '#fff',
        },
        secondary: {
            main: '#F7DC6F',
            light: '#F9E79F',
            dark: '#F1C40F',
            contrastText: '#333',
        },
        background: {
            default: '#FDFEFE',
            paper: '#FBFCFC',
        },
        text: {
            primary: '#2C3E50',
            secondary: '#566573',
        },
        success: {
            main: '#82E0AA',
        },
        error: {
            main: '#F1948A',
        },
        warning: {
            main: '#F8C471',
        },
        info: {
            main: '#85C1E9',
        },
    },
    typography: {
        fontFamily: 'Roboto, sans-serif',
        h1: {
            fontWeight: 700,
            color: '#2C3E50',
        },
        h2: {
            fontWeight: 600,
            color: '#2C3E50',
        },
        h3: {
            fontWeight: 600,
            color: '#34495E',
        },
        h4: {
            fontWeight: 500,
            color: '#34495E',
        },
        h5: {
            fontWeight: 500,
        },
        h6: {
            fontWeight: 500,
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 16,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 25,
                    padding: '10px 24px',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    },
                },
                containedPrimary: {
                    background: 'linear-gradient(45deg, #7FB3D5 30%, #5499C7 90%)',
                },
                containedSecondary: {
                    background: 'linear-gradient(45deg, #F7DC6F 30%, #F1C40F 90%)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 20,
                    boxShadow: '0 8px 24px rgba(149, 157, 165, 0.1)',
                },
                elevation1: {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                },
                elevation2: {
                    boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 24,
                    overflow: 'hidden',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 12,
                    },
                },
            },
        },
    },
});

export default theme;
