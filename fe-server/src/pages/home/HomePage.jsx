import React from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import ScheduleIcon from "@mui/icons-material/Schedule";
import InsightsIcon from "@mui/icons-material/Insights";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { motion } from "framer-motion";

// Create motion components
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionButton = motion(Button);
const MotionCard = motion(Card);

export default function HomePage() {
  const navigate = useNavigate();
  const theme = useTheme();

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        p: 4,
        backgroundImage:
          theme.palette.mode === "light"
            ? "linear-gradient(180deg, rgba(224, 242, 254, 0.4) 0%, rgba(255,255,255,0) 100%)"
            : "linear-gradient(180deg, rgba(13, 71, 161, 0.1) 0%, rgba(0,0,0,0) 100%)",
      }}
    >
      {/* Hero Section */}
      <MotionBox
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        sx={{ mb: 8 }}
      >
        <MotionTypography
          variant="h2"
          fontWeight="bold"
          sx={{
            mb: 2,
            background:
              theme.palette.mode === "light"
                ? "linear-gradient(90deg, #1565c0 0%, #42a5f5 100%)"
                : "linear-gradient(90deg, #64b5f6 0%, #bbdefb 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Smart Irrigation Script Management
        </MotionTypography>

        <MotionTypography
          variant="h6"
          sx={{
            mb: 4,
            maxWidth: 700,
            mx: "auto",
            color: theme.palette.text.secondary,
            lineHeight: 1.6,
          }}
        >
          Automate irrigation schedules, monitor water usage, and optimize
          efficiency with our smart irrigation management system.
        </MotionTypography>

        <MotionButton
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate("/dashboard")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          sx={{
            mb: 2,
            px: 4,
            py: 1.5,
            borderRadius: 2,
            fontSize: "1.1rem",
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "0 4px 14px rgba(0, 0, 0, 0.15)",
          }}
          endIcon={<ArrowForwardIcon />}
        >
          Get Started
        </MotionButton>
      </MotionBox>

      {/* Feature Cards - Grid Layout */}
      <MotionBox
        component={Grid}
        container
        spacing={3}
        sx={{ width: "100%", maxWidth: 1200 }}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <Grid item xs={12} md={4}>
          <MotionCard
            variants={fadeIn}
            whileHover={{ y: -10, boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)" }}
            sx={{
              height: "100%",
              textAlign: "center",
              p: 3,
              borderRadius: 4,
              boxShadow: "0 6px 16px rgba(0, 0, 0, 0.05)",
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <CardContent>
              <WaterDropIcon
                sx={{
                  fontSize: 60,
                  mb: 2,
                  // color: theme.palette.primary.main,
                }}
              />
              <Typography variant="h6" fontWeight="600" sx={{ mt: 2, mb: 1 }}>
                Smart Watering
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Optimize water distribution based on real-time weather
                conditions.
              </Typography>
            </CardContent>
          </MotionCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <MotionCard
            variants={fadeIn}
            whileHover={{ y: -10, boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)" }}
            sx={{
              height: "100%",
              textAlign: "center",
              p: 3,
              borderRadius: 4,
              boxShadow: "0 6px 16px rgba(0, 0, 0, 0.05)",
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <CardContent>
              <ScheduleIcon
                sx={{
                  fontSize: 60,
                  mb: 2,
                  // color: theme.palette.primary.main,
                }}
              />
              <Typography variant="h6" fontWeight="600" sx={{ mt: 2, mb: 1 }}>
                Automated Scheduling
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Set up irrigation scripts and let automation handle the rest.
              </Typography>
            </CardContent>
          </MotionCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <MotionCard
            variants={fadeIn}
            whileHover={{ y: -10, boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)" }}
            sx={{
              height: "100%",
              textAlign: "center",
              p: 3,
              borderRadius: 4,
              boxShadow: "0 6px 16px rgba(0, 0, 0, 0.05)",
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <CardContent>
              <InsightsIcon
                sx={{
                  fontSize: 60,
                  mb: 2,
                  // color: theme.palette.primary.main,
                }}
              />
              <Typography variant="h6" fontWeight="600" sx={{ mt: 2, mb: 1 }}>
                Data Insights
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Monitor usage and get reports to improve efficiency.
              </Typography>
            </CardContent>
          </MotionCard>
        </Grid>
      </MotionBox>
    </Box>
  );
}
