import { useState, useEffect } from "react";
// Components
import {
    Card, CardContent,
    Box, Grid,
    Typography,
    InputAdornment, IconButton
} from "@mui/material";
import { TextField, Button } from "@mui/material";
// Translation
import { useTranslation } from 'react-i18next';
// API
import authApi from "../../api/authAPI";
// React Dom
import { useNavigate, useLocation } from "react-router-dom";
// Auth
import { isAuthenticated } from "../../auth";
// Icon
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


export default function Login() {
    const { t } = useTranslation();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || localStorage.getItem("userId");
    if (isAuthenticated()) {
        navigate(from);
        window.location.reload();
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null); // Reset previous error
        try {
            if (username === "" || password === "") {
                setError("login.unfilled_fields");
                return;
            }
            const data = await authApi.login(username, password);
            localStorage.setItem("token", data.access_token);
            localStorage.setItem("userId", data.user_id);
            const userId = localStorage.getItem("userId");
            navigate(`/${userId}/overview`);
            window.location.reload();
        } catch (err) {
            setError("login.login_failed");
        }
    };

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (e) => {
        e.preventDefault();
    };
    const handleMouseUpPassword = (e) => {
        e.preventDefault();
    };

    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{
                backgroundImage: 'url(/landscape.jpg)',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                opacity: 0.9,
                height: '100vh'
            }}
        >
            {/*Login Card*/}
            <Grid container
                alignItems="center"
                item
                mt={1} mb={1}
                xs={11} md={6}
            >
                <Card sx={{ width: '100%', borderRadius: '16px', backgroundColor: 'background.trans_black' }}>
                    {/*Login Title*/}
                    <Typography
                        variant="h4"
                        align="center"
                        color="text.default_white"
                        mt={3}
                        mb={3}
                    >
                        {t("login.title")}
                    </Typography>
                    {/*Login Form*/}
                    <CardContent>
                        {error && <Typography variant="body1" color="error" mb={2}>{t(error)}</Typography>}
                        <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="flex-start"
                                gap={1}
                            fullWidth
                            >
                                {/*Username*/}
                                <Typography
                                variant="body1"
                                color="text.default_white"
                                    >
                                        {t("login.username")}
                                    </Typography>
                                <TextField
                                    fullWidth
                                    type="text"
                                    label={t("login.username_label")}
                                variant="filled"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    color="success"
                                    size="small"
                                fullWidth
                                sx={{
                                    '& .MuiInputBase-input': {
                                        color: 'text.default_white',
                                    },
                                }}
                                />
                            {/*Pasword*/}
                            <Typography
                                variant="body1"
                                color="text.default_white"
                                mt={2}
                            >
                                {t("login.password")}
                            </Typography>
                                <TextField
                                    fullWidth
                                    label={t("login.password_label")}
                                variant="filled"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    color="success"
                                    size="small"
                                fullWidth
                                sx={{
                                    '& .MuiInputBase-input': {
                                        color: 'text.default_white',
                                    },
                                }}
                                type={showPassword ? 'text' : 'password'}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label={
                                                showPassword ? 'hide the password' : 'display the password'
                                            }
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            onMouseUp={handleMouseUpPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                />
                                {/*Buttons*/}
                                <Grid container
                                    columns={21} mt={6} mb={4}
                                    justifyContent="space-between"
                                    xs={21} md={21}
                                >
                                    <Grid item mt={2}
                                        xs={21} md={10}
                                    >
                                        <Button type="submit" variant="contained" color="success" fullWidth
                                            sx={{ borderRadius: '8px' }}
                                        onClick={handleLogin}
                                        >
                                            {t("login.title")}
                                        </Button>
                                    </Grid>
                                    <Grid item mt={2}
                                        xs={21} md={10}
                                    >
                                    <Button type="submit" variant="contained" color="info" fullWidth
                                            sx={{ borderRadius: '8px' }}  
                                        >
                                            {t("signup.title")}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
        </Box>
    );
}
