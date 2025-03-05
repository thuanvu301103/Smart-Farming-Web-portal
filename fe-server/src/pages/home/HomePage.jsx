import React from "react";
import { Box, Typography, Button, Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import ScheduleIcon from "@mui/icons-material/Schedule";
import InsightsIcon from "@mui/icons-material/Insights";

export default function HomePage() {
  const navigate = useNavigate();
  const theme = useTheme();

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
      }}
    >
      {/* Hero Section */}
      <Typography variant="h2" fontWeight="bold" sx={{ mb: 2 }}>
        Smart Irrigation Script Management
      </Typography>
      <Typography variant="h6" sx={{ mb: 3, maxWidth: 600 }}>
        Automate irrigation schedules, monitor water usage, and optimize efficiency 
        with our smart irrigation management system.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/dashboard")}
        sx={{ mb: 4 }}
      >
        Get Started
      </Button>

      {/* Feature Cards - Flexbox Layout */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "90%", maxWidth: 600 }}>
        <Card sx={{ textAlign: "center", p: 2 }}>
          <CardContent>
            <WaterDropIcon sx={{ fontSize: 50 }} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Smart Watering
            </Typography>
            <Typography variant="body2">
              Optimize water distribution based on real-time weather conditions.
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ textAlign: "center", p: 2 }}>
          <CardContent>
            <ScheduleIcon sx={{ fontSize: 50 }} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Automated Scheduling
            </Typography>
            <Typography variant="body2">
              Set up irrigation scripts and let automation handle the rest.
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ textAlign: "center", p: 2 }}>
          <CardContent>
            <InsightsIcon sx={{ fontSize: 50 }} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Data Insights
            </Typography>
            <Typography variant="body2">
              Monitor usage and get reports to improve efficiency.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
