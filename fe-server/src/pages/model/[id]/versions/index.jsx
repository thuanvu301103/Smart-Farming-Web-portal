import React, { useEffect, useState } from "react";
import { Typography, Button, Box, Card, Chip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import HistoryIcon from "@mui/icons-material/History";
import { useTranslation } from "react-i18next";
import modelApi from "../../../../api/modelAPI";
import { useParams } from "react-router-dom";
import { convertTimestamp } from "../../../../utils/dateUtils";
const VersionsOfModel = ({ modelInfo }) => {
  const { t } = useTranslation();
  const userId = localStorage.getItem("userId");
  const { modelName } = useParams();

  const [versions, setVersions] = useState([]);
  const [versionLoading, setVersionLoading] = useState(false);
  const [versionError, setVersionError] = useState(false);

  useEffect(() => {
    if (!userId || !modelName) {
      setVersionError("User ID or Model Name is missing");
      setVersionLoading(false);
      return;
    }
    const fetchVersions = async () => {
      try {
        const response = await modelApi.getModelVersion(userId, modelName);
        setVersions(response.model_versions);
      } catch (err) {
        setVersionError("Error fetching model");
        console.error("Error fetching model:", err);
      } finally {
        setVersionLoading(false);
      }
    };
    fetchVersions();
  }, [userId, modelName]);

  // console.log("version", versions);

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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "32px",
            marginTop: "24px",
          }}
        >
          {versions?.map((item, index) => {
            return (
              <Box
                key={index}
                sx={{
                  pl: "30px",
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <Box sx={{ display: "flex", gap: "8px", position: "relative" }}>
                  <HistoryIcon sx={{ position: "absolute", left: "-30px" }} />
                  <Typography fontWeight={600}>
                    Version {item.version}
                  </Typography>
                  <Typography fontStyle={"italic"}>
                    {convertTimestamp(item.creation_timestamp)}
                  </Typography>
                </Box>
                <Card
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    p: "16px",
                  }}
                >
                  <Typography fontWeight={600}>
                    {t("model-detail.name")}: {item.name}
                  </Typography>
                  <Typography>
                    {t("model-detail.description")}: {item.description}
                  </Typography>
                  <Box sx={{ display: "flex", gap: "8px" }}>
                    <Typography>
                      {t("model-detail.tags")}: <t />
                      {item?.tags?.map((tag, i) => {
                        return (
                          <Chip
                            sx={{ width: "fit-content" }}
                            label={`${tag.key}: ${tag.value}`}
                            variant="outlined"
                          />
                        );
                      })}
                    </Typography>
                  </Box>
                </Card>
              </Box>
            );
          })}
        </Box>
      </Card>
    </Box>
  );
};

export default VersionsOfModel;
