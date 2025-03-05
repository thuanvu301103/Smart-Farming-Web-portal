import React from "react";
import { Card, useTheme } from "@mui/material";

const CardWrapper = ({ children, borderThickness = "9px", borderSide = "bottom", borderColor, height = "auto", mt = "8px" }) => {
    const theme = useTheme(); // Get theme colors

    // Use borderColor from theme if provided, else fallback to primary
    const resolvedBorderColor = theme.palette[borderColor]?.main || theme.palette.success.main;

    // Dynamically set border styles based on borderSide
    const borderStyles = {
        [`border${borderSide.charAt(0).toUpperCase() + borderSide.slice(1)}`]: `${borderThickness} solid ${resolvedBorderColor}`
    };

    return (
        <Card sx={{
            width: "100%",
            borderRadius: "8px",
            ...borderStyles,
            height: height,
            mt: mt
        }}
        >
            {children}
        </Card>
    );
};

export { CardWrapper };
