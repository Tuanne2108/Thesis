import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

export const tokens = (mode) => ({
    ...(mode === "dark"
        ? {
              grey: {
                  100: "#e0e0e0",
                  200: "#c2c2c2",
                  300: "#a3a3a3",
                  400: "#858585",
                  500: "#666666",
                  600: "#525252",
                  700: "#3d3d3d",
                  800: "#292929",
                  900: "#141414",
              },
              primary: {
                  100: "#f4ebd0",
                  200: "#d6ad60",
                  300: "#b68d40",
                  400: "#122620",
                  500: "#122620",
                  600: "#1f3a36",
                  700: "#2b4d4b",
                  800: "#377060",
                  900: "#83a899",
              },
              accent: {
                  tan: "#b68d40",
                  gold: "#d6ad60",
              },
          }
        : {
              grey: {
                  100: "#141414",
                  200: "#292929",
                  300: "#3d3d3d",
                  400: "#525252",
                  500: "#666666",
                  600: "#858585",
                  700: "#a3a3a3",
                  800: "#c2c2c2",
                  900: "#e0e0e0",
              },
              primary: {
                  100: "#f4ebd0",
                  200: "#d6ad60",
                  300: "#b68d40",
                  400: "rgba(182, 141, 64, 0.3)",
                  500: "#f4ebd0",
                  600: "#ede1c0",
                  700: "#e5d5a0",
                  800: "#ddca80",
                  900: "#d6bf60",
              },
              accent: {
                  tan: "#b68d40",
                  gold: "#d6ad60",
              },
          }),
});

export const themeSettings = (mode) => {
    const colors = tokens(mode);
    return {
        palette: {
            mode: mode,
            ...(mode === "dark"
                ? {
                      primary: {
                          main: colors.primary[500],
                      },
                      secondary: {
                          main: colors.accent.gold,
                      },
                      neutral: {
                          dark: colors.grey[700],
                          main: colors.grey[500],
                          light: colors.grey[100],
                      },
                      background: {
                          default: colors.primary[500],
                      },
                      accent: {
                          tan: colors.accent.tan,
                          gold: colors.accent.gold,
                      },
                  }
                : {
                      primary: {
                          main: colors.primary[100],
                      },
                      secondary: {
                          main: colors.accent.tan,
                      },
                      neutral: {
                          dark: colors.grey[700],
                          main: colors.grey[500],
                          light: colors.grey[100],
                      },
                      background: {
                          default: colors.primary[100],
                      },
                      accent: {
                          tan: colors.accent.tan,
                          gold: colors.accent.gold,
                      },
                  }),
        },
        typography: {
            fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
            fontSize: 12,
            h1: {
                fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
                fontSize: 40,
            },
            h2: {
                fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
                fontSize: 32,
            },
            h3: {
                fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
                fontSize: 24,
            },
            h4: {
                fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
                fontSize: 20,
            },
            h5: {
                fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
                fontSize: 16,
            },
            h6: {
                fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
                fontSize: 14,
            },
        },
    };
};

// context for color mode
export const ColorModeContext = createContext({
    toggleColorMode: () => {},
});

export const useMode = () => {
    const [mode, setMode] = useState("light");

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () =>
                setMode((prev) => (prev === "dark" ? "light" : "dark")),
        }),
        []
    );

    const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
    return [theme, colorMode];
};
