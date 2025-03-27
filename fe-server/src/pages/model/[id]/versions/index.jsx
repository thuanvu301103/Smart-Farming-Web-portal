import React, { useEffect, useState } from "react";
// Import components
import { Typography, Button, Box, Card } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "react-i18next";
import axios from "axios";
import modelApi from "../../../../api/modelAPI";
const VersionsOfModel = ({ modelInfo }) => {
  const { t } = useTranslation();
  const [versions, setVersions] = useState([]);
  const [scriptLoading, setScriptLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        setScriptLoading(true);
        const userId = localStorage.getItem("userId");
        const response = await modelApi.getScriptsModel(userId, modelInfo._id);
        setVersions(response);
      } catch (error) {
        console.error("Error fetching versions of model:", error);
      } finally {
        setScriptLoading(false);
      }
    };
    fetch();
  }, [modelInfo]);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr" },
        gap: "24px",
      }}
    >
      <Card
        variant="outlined"
        sx={{ display: "flex", flexDirection: "column", padding: "24px" }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <Typography sx={{ fontSize: "24px", fontWeight: "600" }}>
              Version History
            </Typography>
            <Typography>
              Track changes and updates to this irrigation model
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="success"
            size="small"
            sx={{ textTransform: "none" }}
            startIcon={<AddIcon />}
            href="new-script"
          >
            {t("button.create_new_version")}
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default VersionsOfModel;
