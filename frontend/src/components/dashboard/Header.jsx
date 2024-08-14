/* eslint-disable react/prop-types */
import { Typography, Box, useTheme } from "@mui/material";
import { tokens } from "../../theme";

export default function Header({ title, subtitle }) {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <Box mb="30px">
            <Typography
                variant="h2"
                color={colors.primary[300]}
                fontWeight="bold"
                sx={{ m: "0 0 5px 0" }}>
                {title}
            </Typography>
            <Typography variant="h5" color={colors.accent.gold}>
                {subtitle}
            </Typography>
        </Box>
    );
}
