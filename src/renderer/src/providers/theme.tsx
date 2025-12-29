
import { ThemeProvider, createTheme } from '@mui/material/styles';

import CssBaseline from '@mui/material/CssBaseline';
import React from 'react';

export interface MyThemeContextType {
    darkMode: boolean;
    toggleDarkMode: () => void;
}

export const MyThemeContext = React.createContext<MyThemeContextType | null>(null);
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

export const MyThemeProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
           {children}
        </ThemeProvider>
    );
}