import React, { ReactNode } from "react";
import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";

const theme = createTheme();

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box display="flex" minHeight="100vh">
        <Box flexGrow={1} flexDirection="column">
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
};
export default MainLayout;
