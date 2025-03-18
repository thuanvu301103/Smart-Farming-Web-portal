import React, { useState, useEffect } from 'react';
// Import components
import {
    TextField,
    Grid, Typography, Button, IconButton, Box,
    Menu, MenuItem,
} from '@mui/material';
import DeleteModal from '../../../components/modal/DeleteModal';
import EditScriptModal from './EditScriptModal';
import Editor from "@monaco-editor/react"; // Code Editor
import { NumericFormat } from 'react-number-format';
import { saveAs } from "file-saver"; // For downloading version file 
// Import Icon
import PublicIcon from '@mui/icons-material/Public';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined';
import BookOutlinedIcon from '@mui/icons-material/BookOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { styled } from '@mui/material/styles';
// Translation
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
// Theme
import { useTheme } from "@mui/material/styles";
// API
import scriptApi from '../../../api/scriptAPI';
// Hooks
import { useFetchScriptInfo, useFetchScriptFile } from '../../../hooks/useFetchScript';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 50,
    left: 50,
    whiteSpace: 'nowrap',
    width: 5,
});

const ScriptCode = () => {
   
    const { userId, scriptId } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const theme = useTheme();

    // Fetch Script Info
    const { data: scriptInfo, setData: setScriptInfo, loading: scriptInfoLoading, error: scriptInfoError } = useFetchScriptInfo(userId, scriptId);
    // Current Version
    const [curVersion, setCurVersion] = useState(null);
    const [stateVersion, setStateVersion] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            setCurVersion(scriptInfo?.version ? (scriptInfo.version.sort((a, b) => b - a))[0] : -1.0);
            reloadFileData();
        };
        fetchData();
    }, [scriptInfo]);
    useEffect(() => {
        setStateVersion(curVersion)
    }, [curVersion]);

    // File Data
    const { data: fileData, setData: setFileData, reload: reloadFileData } = useFetchScriptFile(userId, scriptId, curVersion)
    const handleEditorChange = (value) => {
        setFileData(value);
    };
    const [disableEditFile, setDisableEditFile] = useState(true);
    // Confirm upload file
    const handleSubmitFile = async (userId, scriptId, newFile = false, newVersion = -1.0) => {
        // Rename version
        let newVersionArr = scriptInfo.version;
        if (newFile) {
            newVersionArr.push(newVersion);
            newVersionArr = newVersionArr.sort((a, b) => b - a);
            await scriptApi.updateScriptInfo(userId, scriptId, { version: newVersionArr });
            setCurVersion(newVersion);
            scriptInfo.version = newVersionArr;
        }
        else if (stateVersion != curVersion) {
            // Rename File
            if (!newFile) {
                await scriptApi.renameFile(userId, scriptId, curVersion, stateVersion);
                newVersionArr = newVersionArr.map(item => item == curVersion ? stateVersion : item);
                newVersionArr = newVersionArr.sort((a, b) => b - a);
            } else {
                newVersionArr = newVersionArr.append(newVersion);
                newVersionArr = newVersionArr.sort((a, b) => b - a);
            }
            //console.log("New Version: ", newVersionArr);
            await scriptApi.updateScriptInfo(userId, scriptId, { version: newVersionArr });
            setCurVersion(stateVersion);
            scriptInfo.version = newVersionArr;
        }

        if (!fileData) return;
        //console.log("Version: ", curVersion, stateVersion);
        try {
            // Convert JSON string to Blob
            const jsonBlob = new Blob([fileData], { type: "application/json" });

            // Create a File object (optional: give it a name)
            let jsonFile = null;
            if (!newFile) jsonFile = new File([jsonBlob], `v${stateVersion.toFixed(1)}.json`, { type: "application/json" });
            else jsonFile = new File([jsonBlob], `v${newVersion.toFixed(1)}.json`, { type: "application/json" });

            // Create FormData
            const formFileData = new FormData();
            formFileData.append("files", jsonFile); // Attach JSON file
            formFileData.append("remote_path", `/${userId}/${scriptId}/`);

            // Upload using Axios
            return await scriptApi.uploadScriptFile(formFileData);
            //console.log("File uploaded successfully:", response.data);
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    }

    // Handle Delete Version File
    const [openVersionDelete, setOpenVersionDelete] = useState(false);
    const handleOpenVersionDelete = () => setOpenVersionDelete(true);
    const handleCloseVersionDelete = () => setOpenVersionDelete(false);
    // Handle Cofirm Version Delete
    const handleConfirmVersionDelete = async (e) => {
        e.preventDefault();
        let newVersionArr = scriptInfo.version.filter(item => item !== curVersion);
        try {
            await scriptApi.deleteScriptFileVersion(userId, scriptId, curVersion);
            newVersionArr = newVersionArr.sort((a, b) => b - a);
            await scriptApi.updateScriptInfo(userId, scriptId, { version: newVersionArr });
            scriptInfo.version = newVersionArr;
        } catch (error) {
            console.error('Error delete script version:', error);
        }
        // Close Model
        handleCloseDelete();
        setCurVersion(newVersionArr[0]);
        reloadFileData();
    }

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
        navigate(-1);
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

    // Handle Upload File
    const handleUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const jsonData = JSON.parse(e.target.result); // Parse JSON
                setFileData(JSON.stringify(jsonData, null, 2)); // Convert to formatted string
            } catch (error) {
                console.error("Invalid JSON file:", error);
                alert("Invalid JSON file. Please upload a valid JSON.");
            }
        };
        reader.readAsText(file);
    };

    // Hanle Version Menu
    const [anchorElVersionMenu, setAnchorElVersionMenu] = useState(null);
    const openVersionMenu = Boolean(anchorElVersionMenu);
    const handleClickVersionMenu = (e) => {
        setAnchorElVersionMenu(e.currentTarget);
    };
    const handleCloseVersionMenu = () => {
        setAnchorElVersionMenu(null);
    };

    // Handle create new version
    const handleNewVersion = async () => {
        const newVersion = Math.floor(scriptInfo.version[0] + 1.0);
        setFileData("{}");
        setStateVersion(newVersion);
        handleSubmitFile(userId, scriptId, true, newVersion);
    }

    // Handle download version file
    const handleDownloadVersion = async () => {
        // Convert string to JSON
        const jsonObject = JSON.parse(fileData);
        // Convert JSON to blob
        const blob = new Blob([JSON.stringify(jsonObject, null, 2)], {
            type: "application/json",
        });
        saveAs(blob, `V${curVersion.toFixed(1)}.json`);
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
                        <Grid container justifyContent="space-between" alignItems="center">
                            {/* Left Section - Version Button */}
                            <Grid item display="flex" justifyContent="flex-start" alignItems="center" gap={1}>
                                {/* Version Menu button */}
                                <IconButton
                                    variant="contained"
                                    size="small"
                                    color="success"
                                    onClick={handleClickVersionMenu}
                                >
                                    <BookOutlinedIcon fontSize="small" />
                                </IconButton>
                                <Typography variant="body1">
                                    {t("common.version")}
                                </Typography>
                                {/* Version Field */}
                                <NumericFormat
                                    value={stateVersion ? stateVersion.toFixed(1) : Number(0.0).toFixed(1)}
                                    onChange={(e) => {
                                        const { name, value } = e.target
                                        setStateVersion(Number(value));
                                    }}
                                    customInput={TextField}
                                    thousandSeparator
                                    valueIsNumericString
                                    color="success"
                                    variant="outlined"
                                    size="small"
                                    sx={{ width: '90px' }}
                                    disabled={disableEditFile}
                                />
                                {/* Version Menu */}
                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorElVersionMenu}
                                    open={openVersionMenu}
                                    onClose={handleCloseVersionMenu}
                                    MenuListProps={{ 'aria-labelledby': 'basic-button' }}
                                    PaperProps={{ sx: { minWidth: "200px" } }}
                                >
                                    {scriptInfo?.version
                                        ?.slice() // Create a copy before sorting to prevent modifying the original data
                                        .sort((a, b) => b - a)
                                        .map((version, index) => (
                                            <MenuItem key={index}
                                                onClick={() => {
                                                    setCurVersion(version);
                                                    reloadFileData();
                                                }}
                                            >
                                                {`${t("common.version")} ${version.toFixed(1)}`}
                                            </MenuItem>
                                        ))
                                    }
                                </Menu>
                            </Grid>

                            {/* Right Section - Action Buttons */}
                            <Grid item justifyContent="flex-end" alignItems="center">
                                {/* Reload Button */}
                                <IconButton aria-label="reload" size="small" color="text"
                                    onClick={() => {
                                        setStateVersion(curVersion);
                                        reloadFileData();
                                    }}
                                >
                                    <ReplayOutlinedIcon fontSize="small" />
                                </IconButton>

                                {/* Dowload Version Button */}
                                <IconButton aria-label="reload" size="small" color="text"
                                    onClick={handleDownloadVersion}
                                >
                                    <ArrowDownwardIcon fontSize="small" />
                                </IconButton>

                                {localStorage.getItem("userId") == userId && (
                                    <>
                                        {!disableEditFile && (
                                            <>
                                                {/* New File Button */}
                                                <IconButton component="label" aria-label="upload" size="small" color="script"
                                                    onClick={handleNewVersion}
                                                >
                                                    <AddCircleOutlineOutlinedIcon fontSize="small" />
                                                </IconButton>
                                                {/* Upload File Button */}
                                                <IconButton component="label" aria-label="upload" size="small" color="info">
                                                    <CloudUploadOutlinedIcon fontSize="small" />
                                                    <VisuallyHiddenInput
                                                        type="file"
                                                        accept="application/json"
                                                        onChange={handleUpload}
                                                        multiple
                                                    />
                                                </IconButton>

                                                {/* Save File Button */}
                                                <IconButton
                                                    aria-label="save"
                                                    size="small"
                                                    color="success"
                                                    onClick={() => handleSubmitFile(userId, scriptId)}
                                                >
                                                    <SaveOutlinedIcon fontSize="small" />
                                                </IconButton>

                                                {/* Delete File Version Button */}
                                                <IconButton
                                                    aria-label="save"
                                                    size="small"
                                                    color="error"
                                                    onClick={handleOpenVersionDelete}
                                                >
                                                    <DeleteForeverOutlinedIcon fontSize="small" />
                                                </IconButton>
                                                <DeleteModal
                                                    open={openVersionDelete}
                                                    handleClose={handleCloseVersionDelete}
                                                    handleConfirm={handleConfirmVersionDelete}
                                                    title="delete-script-version.title"
                                                    note="delete-script-version.note"
                                                />
                                            </>
                                        )}

                                        {/* Edit File Button */}
                                        <IconButton
                                            aria-label="edit"
                                            size="small"
                                            color={disableEditFile ? "text" : "warning"}
                                            onClick={() => setDisableEditFile(prev => !prev)}
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>

                                        {/* Edit Script Modal */}
                                        <EditScriptModal
                                            open={openEdit}
                                            handleClose={handleCloseEdit}
                                            handleConfirm={handleConfirmEdit}
                                            oldData={scriptInfo}
                                            title="edit-script.title"
                                        />
                                    </>
                                )}
                            </Grid>
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