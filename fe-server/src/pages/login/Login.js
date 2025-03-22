import { useState } from "react";
// Components
import {
  Card,
  CardContent,
  Box,
  Grid,
  Typography,
  InputAdornment,
  IconButton,
  TextField,
  Button,
  Container,
  Divider,
  Avatar,
} from "@mui/material";
// Translation
import { useTranslation } from "react-i18next";
// API
import authApi from "../../api/authAPI";
// React Dom
import { useNavigate, useLocation } from "react-router-dom";
// Auth
import { isAuthenticated } from "../../auth";
// Icons
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
// Animation
import { motion } from "framer-motion";

// Motion components
const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionTypography = motion(Typography);
const MotionButton = motion(Button);

export default function Login() {
  const { t } = useTranslation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || localStorage.getItem("userId");

  if (isAuthenticated()) {
    if (from === "/login") {
      const userId = localStorage.getItem("userId");
      navigate(`/${userId}/overview`);
    }
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
      localStorage.setItem("profileImage", data.profile_image);
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <Box
      component="main"
      sx={{
        backgroundImage: "url(/landscape.jpg)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.3))",
          zIndex: 1,
        },
      }}
    >
      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 2 }}>
        <MotionCard
          component="form"
          onSubmit={handleLogin}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          sx={{
            borderRadius: "24px",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            overflow: "hidden",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <MotionBox
            variants={itemVariants}
            sx={{
              bgcolor: "rgba(76, 175, 80, 0.2)",
              p: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar
              sx={{
                bgcolor: "success.main",
                width: 56,
                height: 56,
                mb: 2,
              }}
            >
              <LockOutlinedIcon />
            </Avatar>
            <MotionTypography
              variant="h4"
              component="h1"
              color="white"
              fontWeight="500"
              textAlign="center"
            >
              {t("login.title")}
            </MotionTypography>
          </MotionBox>

          <CardContent sx={{ p: 4 }}>
            {error && (
              <MotionBox
                variants={itemVariants}
                sx={{
                  bgcolor: "rgba(244, 67, 54, 0.1)",
                  p: 2,
                  borderRadius: 2,
                  mb: 3,
                  border: "1px solid rgba(244, 67, 54, 0.3)",
                }}
              >
                <Typography variant="body2" color="error.light" align="center">
                  {t(error)}
                </Typography>
              </MotionBox>
            )}

            <MotionBox variants={itemVariants} component="div" sx={{ mb: 3 }}>
              <Typography
                variant="subtitle1"
                color="white"
                sx={{ mb: 1, fontWeight: 500 }}
              >
                {t("login.username")}
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder={t("login.username_label")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineOutlinedIcon
                        sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                      />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 2,
                    bgcolor: "rgba(255, 255, 255, 0.07)",
                    color: "white",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.1)",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255, 255, 255, 0.2)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255, 255, 255, 0.3)",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "success.main",
                    },
                  },
                }}
              />
            </MotionBox>

            <MotionBox variants={itemVariants} component="div" sx={{ mb: 4 }}>
              <Typography
                variant="subtitle1"
                color="white"
                sx={{ mb: 1, fontWeight: 500 }}
              >
                {t("login.password")}
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder={t("login.password_label")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon
                        sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                      />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={
                          showPassword ? "hide password" : "show password"
                        }
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 2,
                    bgcolor: "rgba(255, 255, 255, 0.07)",
                    color: "white",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.1)",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255, 255, 255, 0.2)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255, 255, 255, 0.3)",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "success.main",
                    },
                  },
                }}
              />
            </MotionBox>

            <MotionBox variants={itemVariants} component="div" sx={{ mb: 3 }}>
              <MotionButton
                type="submit"
                fullWidth
                variant="contained"
                color="success"
                size="large"
                onClick={handleLogin}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                sx={{
                  borderRadius: "12px",
                  py: 1.5,
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 600,
                  boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)",
                }}
              >
                {t("login.title")}
              </MotionButton>
            </MotionBox>

            <MotionBox
              variants={itemVariants}
              component="div"
              sx={{ position: "relative", my: 2 }}
            >
              <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)" }} />
              <Typography
                variant="body2"
                component="span"
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  bgcolor: "rgba(0, 0, 0, 0.7)",
                  px: 2,
                  color: "rgba(255, 255, 255, 0.6)",
                }}
              >
                {t("or")}
              </Typography>
            </MotionBox>

            <MotionBox variants={itemVariants} component="div">
              <MotionButton
                fullWidth
                variant="outlined"
                color="info"
                size="large"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                sx={{
                  borderRadius: "12px",
                  py: 1.5,
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 600,
                  borderColor: "rgba(33, 150, 243, 0.5)",
                  color: "rgba(33, 150, 243, 0.9)",
                  "&:hover": {
                    borderColor: "info.main",
                    bgcolor: "rgba(33, 150, 243, 0.1)",
                  },
                }}
              >
                {t("signup.title")}
              </MotionButton>
            </MotionBox>
          </CardContent>
        </MotionCard>
      </Container>
    </Box>
  );
}
