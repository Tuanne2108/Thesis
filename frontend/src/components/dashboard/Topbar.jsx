import { Box, IconButton, useTheme } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import SearchIcon from "@mui/icons-material/Search";
import * as AuthApi from "../../api/AuthApi";
import {
    signOutStart,
    signOutSuccess,
    signOutFailure,
} from "../../redux/user/UserSlice";

export default function Topbar() {
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);

    const handleSignOut = async () => {
        try {
            dispatch(signOutStart());
            const res = await AuthApi.signOut();
            if (res.status === "success") {
                dispatch(signOutSuccess("Signed out successfully"));
                navigate("/sign-in");
            }
        } catch (error) {
            dispatch(signOutFailure(error.message));
        }
    };

    return (
        <Box display="flex" justifyContent="space-between" p={2}>
            <Box
                display="flex"
                backgroundColor={colors.primary[300]}
                borderRadius="3px">
                <InputBase
                    sx={{ ml: 2, flex: 1, color: colors.grey[100] }}
                    placeholder="Search"
                />
                <IconButton
                    type="button"
                    sx={{ p: 1, color: colors.grey[100] }}>
                    <SearchIcon />
                </IconButton>
            </Box>

            {/* ICONS */}
            <Box display="flex">
                <IconButton onClick={colorMode.toggleColorMode}>
                    {theme.palette.mode === "dark" ? (
                        <DarkModeOutlinedIcon
                            sx={{ color: colors.accent.gold }}
                        />
                    ) : (
                        <LightModeOutlinedIcon
                            sx={{ color: colors.accent.tan }}
                        />
                    )}
                </IconButton>
                <IconButton>
                    <NotificationsOutlinedIcon />
                </IconButton>
                <IconButton onClick={handleSignOut}>
                    <ExitToAppOutlinedIcon />
                </IconButton>
            </Box>
        </Box>
    );
}
