import React, { useState, useEffect } from 'react';
// Import components
import {
    Grid, Typography, Button, IconButton, Box, Modal,
    TextField,
} from '@mui/material';
import DeleteModal from '../../../components/modal/DeleteModal';
import EditScriptModal from './EditScriptModal';
import Editor from "@monaco-editor/react"; // Code Editor
// Import Icon
import PublicIcon from '@mui/icons-material/Public';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
// Translation
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
// Theme
import { useTheme } from "@mui/material/styles";
// API
import scriptApi from '../../../api/scriptAPI';
// Hooks
import { useFetchScriptInfo, useFetchScriptFile } from '../../../hooks/useFetchScript';

const ScriptCode = () => {
   
    const { userId, scriptId } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const theme = useTheme();
    // File Data
    const { data: fileData, setData: setFileData } = useFetchScriptFile(`${userId}%2F${scriptId}%2Fv1.0.json`)
    const handleEditorChange = (value) => {
        setFileData(value);
    };
    const [disableEditFile, setDisableEditFile] = useState(true);
    // Confirm upload file
    const handleSubmitFile = async (userId, scriptId) => {
        if (!fileData) return;

        try {
            // Convert JSON string to Blob
            const jsonBlob = new Blob([fileData], { type: "application/json" });

            // Create a File object (optional: give it a name)
            const jsonFile = new File([jsonBlob], "v1.0.json", { type: "application/json" });

            // Create FormData
            const formFileData = new FormData();
            formFileData.append("files", jsonFile); // Attach JSON file
            formFileData.append("remote_path", `/${userId}/${scriptId}/`);

            // Upload using Axios
            const response = await scriptApi.uploadScriptFile(formFileData);
            //console.log("File uploaded successfully:", response.data);
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    }

    // Fetch Script Info
    const { data: scriptInfo, setData: setScriptInfo, loading: scriptInfoLoading, error: scriptInfoError } = useFetchScriptInfo(userId, scriptId);

    // Handle Delete Modal
    const [openDelete, setOpenDelete] = useState(false);
    const handleOpenDelete = () => setOpenDelete(true);
    const handleCloseDelete = () => setOpenDelete(false);
    // Handle Cofirm Delete
    const handleConfirmDelete = async (e) => {
        e.preventDefault();
        try {
            let response = await scriptApi.deleteScriptInfo(userId, scriptId);
            response = await scriptApi.deleteScriptFiles(userId, scriptId);
        } catch (error) {
            console.error('Error delete script:', error);
        }
        // Close Model
        handleCloseDelete();
        navigate(`/${userId}/scripts`);
    }

    // Handle Edit Modal
    const [openEdit, setOpenEdit] = useState(false);
    const handleOpenEdit = () => setOpenEdit(true);
    const handleCloseEdit = () => setOpenEdit(false);
    const handleConfirmEdit = async (e, newData) => {
        e.preventDefault();
        try {
            let response = await scriptApi.updateScriptInfo(userId, scriptId, newData);
            //response = await scriptApi.deleteScriptFiles(userId, scriptId);
        } catch (error) {
            console.error('Error update script:', error);
        }
        // Close Model
        handleCloseEdit();
        setScriptInfo(newData);
        //navigate(`/${userId}/scripts/${scriptId}`);
    }

    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
        >
            <Grid container
                justifyContent="center"
            >
                <Grid container item
                    xs={11} md={9} spacing={2} mb={2}
                >
                    <Grid items xs={12} md={12} mt={3} display="flex" justifyContent="space-between">
                        {/* Title */}
                        <Typography
                            variant="h5" gutterBottom
                            fontWeight="bold"
                        >
                            {scriptInfo?.name ? scriptInfo.name : null}
                        </Typography>
                        {/* Delete Script Button */}
                        <Button
                            variant="contained"
                            size="small"
                            color="error"
                            onClick={handleOpenDelete}
                            startIcon={<DeleteOutlineIcon />}
                            sx={{ borderRadius: '8px' }}
                        >
                            {t("button.delete_script")}
                        </Button>
                        <DeleteModal
                            open={openDelete}
                            handleClose={handleCloseDelete}
                            handleConfirm={handleConfirmDelete}
                            title="delete-script.title"
                            note="delete-script.note"
                        />
                    </Grid>

                    <Grid container item
                        xs={12} md={7}
                        sx={{
                            order: { xs: 2, md: 1 },
                            minHeight: "700px", display: "block"
                        }}
                    >
                        <Grid container justifyContent="flex-end" alignItems="center">
                            {localStorage.getItem("userId") == userId ?
                                <>
                                    {/* Save file Button */}
                                    {!disableEditFile ?
                                        <IconButton aria-label="edit" size="small" color="success"
                                            onClick={() => handleSubmitFile(userId, scriptId)}
                                        >
                                            <SaveOutlinedIcon fontSize="small" />
                                        </IconButton>
                                    : null}
                                    {/* Edit File Button */}
                                    <IconButton aria-label="edit" size="small" color={disableEditFile ? "text" : "warning"}
                                        onClick={() => setDisableEditFile((prev) => !prev)}
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <EditScriptModal
                                        open={openEdit}
                                        handleClose={handleCloseEdit}
                                        handleConfirm={handleConfirmEdit}
                                        oldData={scriptInfo}
                                        title="edit-script.title"
                                    />
                            </>
                                : null}
                        </Grid>
                        {/* Text Editor */}
                        <Editor
                            height="700px"
                            width="100%"
                            language="json"
                            theme={theme.palette.mode === "dark" ? "vs-dark" : "light"}
                            value={fileData || "{}"}
                            onChange={handleEditorChange}
                            options={{
                                inlineSuggest: true,
                                fontSize: "16px",
                                formatOnType: true,
                                autoClosingBrackets: true,
                                minimap: { enabled: false },
                                readOnly: disableEditFile,
                            }}
                        />
                    </Grid>
                    {/* Script's Information */}
                    <Grid item xs={12} md={5} alignItems="flex-start" sx={{ order: { xs: 1, md: 2 } }}>
                        <Grid container justifyContent="space-between" alignItems="center">
                            <Typography variant="h6" fontWeight="bold">
                                {t("script-detail.about")}
                            </Typography>
                            {/*Edit Script Button*/}
                            {localStorage.getItem("userId") == userId ? <>
                            <IconButton aria-label="edit" size="small" color="warning"
                                onClick={handleOpenEdit}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                            <EditScriptModal
                                open={openEdit}
                                handleClose={handleCloseEdit}
                                handleConfirm={handleConfirmEdit}
                                oldData={scriptInfo}
                                title="edit-script.title"
                            /> </>
                            : null}
                        </Grid>
                        {/* Description */}
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mt: 1 }}>
                            {scriptInfo?.description ? scriptInfo.description : t('script-detail.no-description')}
                        </Typography>
                        {/* Privacy */}
                        <Grid container alignItems="center" mt={1} spacing={1}>
                            <Grid item>
                                {scriptInfo?.privacy === "public" ? <PublicIcon color="info"/> : <LockOutlinedIcon color="warning"/>}
                            </Grid>
                            <Grid item>
                                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                    {scriptInfo?.privacy ? t(`privacy.${scriptInfo.privacy}`) : null}
                                </Typography>
                            </Grid>
                        </Grid>

                    </Grid>

                </Grid>
            </Grid>
        </Box>  
    );
}

export default ScriptCode;