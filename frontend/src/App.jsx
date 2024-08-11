import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./Routes";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
function App() {
    const [theme, colorMode] = useMode();
    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <div className="h-screen w-full">
                    <BrowserRouter>
                        <AppRoutes />
                    </BrowserRouter>
                </div>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

export default App;
