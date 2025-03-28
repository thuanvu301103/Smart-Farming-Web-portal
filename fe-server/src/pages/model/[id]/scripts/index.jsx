import React, { useEffect, useState } from "react";
// Import components
import {
  Box,
  FormControl,
  Card,
  MenuItem,
  Select,
  Paper,
  CircularProgress,
  Button,
  buttonBaseClasses,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import Editor from "@monaco-editor/react"; // Code Editor
import { saveAs } from "file-saver"; // For downloading version file
import modelApi from "../../../../api/modelAPI";
//Icon
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const ScriptsOfModel = ({ modelInfo }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [scriptVersions, setScriptVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [scriptContent, setScriptContent] = useState(null);
  const [loadingVersions, setLoadingVersions] = useState(false);
  const [loadingContent, setLoadingContent] = useState(false);

  useEffect(() => {
    const fetchScriptVersions = async () => {
      try {
        setLoadingVersions(true);
        const userId = localStorage.getItem("userId");
        const response = await modelApi.getScriptsModel(userId, modelInfo._id);
        const versions = response.map((script) => ({
          _id: script._id,
          version: script.version, // Gán version dựa vào thứ tự
          createdAt: script.createdAt,
        }));
        setScriptVersions(versions);
        if (versions.length > 0) {
          setSelectedVersion(versions[0].version);
        }
      } catch (error) {
        console.error("Error fetching script versions:", error);
      } finally {
        setLoadingVersions(false);
      }
    };
    fetchScriptVersions();
  }, [modelInfo]);

  useEffect(() => {
    if (selectedVersion) {
      const fetchScriptContent = async () => {
        try {
          setLoadingContent(true);
          const userId = localStorage.getItem("userId");
          const response = await modelApi.getScriptsModelVersion(
            userId,
            modelInfo._id,
            selectedVersion
          );

          let parsedContent;
          if (typeof response === "string") {
            try {
              parsedContent = JSON.parse(response);
            } catch (error) {
              console.error("Lỗi parse JSON:", error);
              parsedContent = { error: "Invalid JSON format", raw: response };
            }
          } else {
            parsedContent = response;
          }

          setScriptContent(JSON.stringify(parsedContent, null, 2)); // Chuẩn hóa thành JSON string
        } catch (error) {
          console.error("Error fetching script content:", error);
        } finally {
          setLoadingContent(false);
        }
      };
      fetchScriptContent();
    }
  }, [selectedVersion]);

  // Handle download version file
  const handleDownloadVersion = async (version) => {
    // Convert JSON to blob
    const blob = new Blob([JSON.stringify(scriptContent, null, 2)], {
      type: "application/json",
    });
    saveAs(blob, `V${parseFloat(version).toFixed(1)}.json`);
  };

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr" }, gap: 3 }}>
      <Card
        variant="outlined"
        sx={{ display: "flex", flexDirection: "column", p: 3 }}
      >
        {/* Choose version */}
        <FormControl
          fullWidth
          sx={{ mt: 3 }}
          variant="outlined"
          color="success"
        >
          <Select
            value={selectedVersion || ""}
            onChange={(e) => setSelectedVersion(e.target.value)}
            disabled={loadingVersions}
          >
            {scriptVersions.map((script) => (
              <MenuItem key={script._id} value={script.version}>
                Version {script.version} -{" "}
                {new Date(script.createdAt).toLocaleDateString()}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Content */}
        <Paper sx={{ mt: 3, p: 2 }}>
          {loadingContent ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress color="success" />
            </Box>
          ) : (
            <Editor
              height="700px"
              width="100%"
              language="json"
              theme={theme.palette.mode === "dark" ? "vs-dark" : "light"}
              value={scriptContent || "{}"}
              options={{
                fontSize: 16,
                formatOnType: true,
                autoClosingBrackets: true,
                minimap: { enabled: false },
                readOnly: true,
              }}
            />
          )}
        </Paper>

        {/* Download */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button
            variant="contained"
            color="success"
            size="small"
            startIcon={<ArrowDownwardIcon />}
            onClick={() => handleDownloadVersion(selectedVersion)}
          >
            {t("button.download")}
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default ScriptsOfModel;
