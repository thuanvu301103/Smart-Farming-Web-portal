import React, { useEffect, useState } from "react";
// Import components
import {
  Typography,
  Button,
  Box,
  Modal,
  FormControl,
  TextField,
  Card,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "react-i18next";
import axios from "axios";
import modelApi from "../../../../api/modelAPI";
const EditModelModal = ({ open, handleClose, oldData }) => {
  const { t } = useTranslation();
  // Form Data
  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    description: "",
    owner_id: "",
  });

  useEffect(() => {
    if (oldData) {
      setFormData({
        _id: oldData._id,
        name: oldData.name,
        description: oldData.description,
        owner_id: oldData.owner_id,
      });
    }
  }, [oldData]);
  // Handle Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  // Handle Cofirm
  const handleConfirm = async (e) => {
    e.preventDefault(); // Prevent default form submission
    // Call Edit api
    try {
      const response = await axios.put(
        `http://localhost:3000/${formData.owner_id}/models/${formData._id}`,
        {
          name: formData.name,
          description: formData.description,
        }
      );
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
    // Close Model
    window.location.reload(); // Reload after update
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
          {t("edit-model.title")}
        </Typography>
        {/*Form data*/}
        <FormControl variant="standard" fullWidth>
          {/*Script Name*/}
          <Typography variant="body1" gutterBottom>
            {t("new-model.model-name")}
          </Typography>
          <TextField
            id="model-name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            color="success"
            variant="outlined"
            size="small"
            fullWidth
            sx={{ width: "50%" }}
          />

          {/*Description*/}
          <Typography variant="body1" gutterBottom sx={{ mt: 1 }}>
            {t("new-model.description")}
          </Typography>
          <TextField
            id="description"
            name="description"
            color="success"
            value={formData.description}
            onChange={handleChange}
            variant="outlined"
            size="small"
          />
        </FormControl>
        {/*Submit Button*/}
        <Button
          type="submit"
          variant="contained"
          color="success"
          size="small"
          sx={{ alignSelf: "flex-end" }}
        >
          {t("button.confirm")}
        </Button>
      </Box>
    </Modal>
  );
};

const ScriptsOfModel = ({ modelInfo }) => {
  const { t } = useTranslation();
  const [scripts, setScripts] = useState([]);
  const [scriptLoading, setScriptLoading] = useState(false);

  // Handle Edit Modal
  const [openEdit, setOpenEdit] = useState(false);
  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => setOpenEdit(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        setScriptLoading(true);
        const userId = localStorage.getItem("userId");
        const response = await modelApi.getScriptsModel(userId, modelInfo._id);
        setScripts(response);
      } catch (error) {
        console.error("Error fetching scripts of model:", error);
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
              Associated Scripts
            </Typography>
            <Typography>
              Scripts that are currently associated with this model
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
            {t("button.add_script")}
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default ScriptsOfModel;
