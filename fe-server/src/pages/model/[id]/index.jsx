import React, { useEffect, useState } from "react";
import Tabnav from "../../../components/Tabnav";
import { useTranslation } from "react-i18next";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import modelApi from "../../../api/modelAPI";
import {
  Box,
  Button,
  CircularProgress,
  Modal,
  Typography,
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import DeleteIcon from "@mui/icons-material/Delete";
import ModelOverview from "./overview";
import ScriptsOfModel from "./scripts";
import VersionsOfModel from "./versions";
const DeleteModelModal = ({ open, handleClose, modelInfo }) => {
  const userId = localStorage.getItem("userId");
  const { t } = useTranslation();
  const navigate = useNavigate();
  // Handle Cofirm
  const handleConfirm = async (e) => {
    e.preventDefault(); // Prevent default form submission
    // Call delete api
    try {
      const response = await modelApi.deleteModelInfo(userId, modelInfo._id);
      console.log(response);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
    // Close Modal
    navigate(`/${userId}/model`);
    handleClose();
  };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 1000,
    bgcolor: "background.paper",
    border: "2px",
    boxShadow: 24,
    borderRadius: "10px",
    p: 4,
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={style}
        gap={2}
        display="flex"
        flexDirection="column"
        component="form"
        onSubmit={handleConfirm}
      >
        {/*Title*/}
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {t("delete-model.title")}
        </Typography>
        {/*Note confirm*/}
        <Typography variant="body1" gutterBottom sx={{ mt: 1 }}>
          {t("delete-model.note")}
        </Typography>

        {/*Submit Button*/}
        <Button
          type="submit"
          variant="contained"
          color="error"
          size="small"
          sx={{ alignSelf: "flex-end" }}
        >
          {t("button.confirm")}
        </Button>
      </Box>
    </Modal>
  );
};
const Model = () => {
  const { t } = useTranslation();
  const { modelName } = useParams();
  const userId = localStorage.getItem("userId");

  const [modelInfo, setModelInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Handle Delete Modal
  const [openDelete, setOpenDelete] = useState(false);
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);

  useEffect(() => {
    if (!userId || !modelName) {
      setError("User ID or Model Name is missing");
      setLoading(false);
      return;
    }

    const fetchModel = async () => {
      try {
        const response = await modelApi.getModelInfo(userId, modelName);
        setModelInfo(response.registered_model);
      } catch (err) {
        setError("Error fetching model");
        console.error("Error fetching model:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchModel();
  }, [userId, modelName]);

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
        <Typography variant="caption" sx={{ mt: 2 }}>
          {t("loading")}
        </Typography>
      </Box>
    );

  // Tab data
  const tabdata = [
    {
      value: "overview",
      path: "overview",
      label: t("tab.overview"),
      element: <ModelOverview modelInfo={modelInfo} />,
    },
    {
      value: "details",
      path: "details",
      label: t("tab.details"),
      // element: <ScriptsOfModel modelInfo={modelInfo} />
    },
    {
      value: "scripts",
      path: "scripts",
      label: t("tab.scripts"),
      element: <ScriptsOfModel modelInfo={modelInfo} />,
    },
    {
      value: "versions",
      path: "versions",
      label: t("tab.versions"),
      element: <VersionsOfModel modelInfo={modelInfo} />,
    },
    {
      value: "settings",
      path: "settings",
      label: t("tab.settings"),
      // element: <ScriptsOfModel modelInfo={modelInfo} />
    },
    {
      value: "analytics",
      path: "analytics",
      label: t("tab.analytics"),
      // element: <ScriptsOfModel modelInfo={modelInfo} />
    },
  ];

  const defaultTab = tabdata[0]?.value || "overview";

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent={loading || error ? "center" : "start"}
      sx={{
        gap: "24px",
        mx: "auto",
        width: "100%",
        minHeight: "100vh",
        padding: { xs: "16px", md: "40px 16px" },
        maxWidth: "1600px",
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          gap: "16px",
          justifyContent: "space-between",
        }}
      >
        <Typography sx={{ fontSize: "30px", fontWeight: "700" }}>
          {modelInfo.name}
        </Typography>
        <Box sx={{ display: "flex", gap: "8px" }}>
          <Button
            startIcon={<TuneIcon />}
            variant="contained"
            sx={{
              textTransform: "none",
              padding: "8px 16px",
            }}
          >
            Edit Model
          </Button>
          <Button
            startIcon={<DeleteIcon />}
            variant="contained"
            color="error"
            sx={{
              textTransform: "none",
              padding: "8px 16px",
            }}
            onClick={handleOpenDelete}
          >
            {t("button.delete")}
          </Button>
          <DeleteModelModal
            open={openDelete}
            handleClose={handleCloseDelete}
            modelInfo={modelInfo}
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          width: "100%",
        }}
      >
        <Tabnav data={tabdata} />
        <Routes>
          {tabdata
            ? tabdata.map((item, index) => (
                <Route
                  key={index}
                  path={item?.value ? item.value : null}
                  element={item?.element ? item.element : null}
                />
              ))
            : null}
        </Routes>
      </Box>
    </Box>
  );
};

export default Model;
