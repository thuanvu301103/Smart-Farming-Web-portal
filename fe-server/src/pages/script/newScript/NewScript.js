import React, { useEffect, useState } from 'react';
// Import components
import {
    Typography,
    Box, Grid,
    Button,
    Menu, MenuItem,
} from '@mui/material';
import Editor from "@monaco-editor/react"; // Code Editor
// Import Icon
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import { styled } from '@mui/material/styles';
// Import Panels
import ScriptInfoPanel from './ScriptInfoPanel'
import PrivacyPanel from './PrivacyPanel'
// Theme
import { useTheme } from "@mui/material/styles";
// Translation
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
// API
import scriptApi from '../../../api/scriptAPI';

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

const NewScript = () => {

    const { t } = useTranslation();
    const navigate = useNavigate();
    const theme = useTheme();

    // Hanle Template Menu
    const [anchorElTemplateMenu, setAnchorElTemplateMenu] = useState(null);
    const openTemplateMenu = Boolean(anchorElTemplateMenu);
    const handleClickTemplateMenu = (e) => {
        setAnchorElTemplateMenu(e.currentTarget);
    };
    const handleCloseTemplateMenu = () => {
        setAnchorElTemplateMenu(null);
    };

    // File Data
    const [fileData, setFileData] = useState("");
    const handleEditorChange = (value) => {
        setFileData(value);
    };
    const fetchDefaultTemplate = () => {
        fetch("/scriptTemplates/defaultTemplate.json")
            .then((response) => {
                //console.log("Running: ", response);
                if (!response.ok) throw new Error("Failed to fetch JSON");
                return response.json();
            })
            .then((jsonData) => {
                //console.log("Fetched Data:", jsonData); // Debug
                setFileData(JSON.stringify(jsonData, null, 2));
            })
            .catch((error) => console.error("Error when reading JSON:", error));
    }
    // Read default file Template
    useEffect(() => {
        fetchDefaultTemplate();
    }, []);

    // Form Data
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        share_id: [],
        privacy: 'public',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Error before submit
    const [nameError, setNameError] = useState(false);
    // Handle Submit File
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
    // Handle Submit Script
    const handleSubmit = async (e) => {
        e.preventDefault();
        setNameError(false);
        if (formData.name.length == 0) {
            setNameError(true)
            return;
        }
        const userId = localStorage.getItem("userId");
        try {
            const scriptId = await scriptApi.createScript(userId, formData);
            handleSubmitFile(userId, scriptId._id)
            navigate(`/${userId}/scripts`);
            return scriptId._id;
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };
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
                    {/*Title*/}
                    <Grid container item xs={12} md={12}>
                        <Typography
                            variant="h5" gutterBottom
                            fontWeight="bold"
                            sx={{mt:2}}
                        >
                            {t("new-script.title")}
                        </Typography>
                    </Grid>
                    
                    <Grid container item
                        xs={12} md={7}
                        sx={{
                            order: { xs: 2, md: 1 },
                            minHeight: "700px", display: "block"
                        }}
                    >
                        <Grid mb={1} xs={12} display="flex" justifyContent="flex-end">
                            {/*Upload Button*/}
                            <Button
                                component="label"
                                variant="contained"
                                size="small"
                                startIcon={<CloudUploadIcon />}
                                color="success"
                                sx={{ borderRadius: '8px' }}
                            >
                                {t("button.upload")}
                                <VisuallyHiddenInput
                                    type="file" accept="application/json"
                                    onChange={handleUpload}
                                    multiple
                                />
                            </Button>
                            {/* Template Button */}
                            <Button
                                variant="contained"
                                size="small"
                                startIcon={<ContentPasteIcon />}
                                color="info"
                                sx={{ borderRadius: '8px', ml: 1 }}
                                onClick={handleClickTemplateMenu}
                            >
                                {t("button.template")}
                            </Button>
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorElTemplateMenu}
                                open={openTemplateMenu}
                                onClose={handleCloseTemplateMenu}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                }}
                                PaperProps={{
                                    sx: { minWidth: "200px" }
                                }}
                            >
                                <MenuItem
                                    onClick={() => {
                                        fetchDefaultTemplate();
                                        handleCloseTemplateMenu();
                                    }}
                                >
                                    {t("button.default")}
                                </MenuItem>
                            </Menu>
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
                            }}
                        />
                    </Grid>

                    {/* Script's Information */}
                    <Grid item xs={12} md={5} alignItems="flex-start" sx={{ order: { xs: 1, md: 2 } }}>
                        <ScriptInfoPanel formData={formData} handleChange={handleChange} error={nameError} />
                        <Box mt={2}>
                            <PrivacyPanel formData={formData} handleChange={handleChange} setFormData={setFormData} />
                        </Box>
                        <Grid mt={2} xs={12} display="flex" justifyContent="flex-end">
                            {/*Submit Button*/}
                            <Button
                                type="submit"
                                variant="contained"
                                color="success"
                                size="medium"
                                onClick={handleSubmit}
                                sx={{ borderRadius: '8px' }}
                            >
                                {t("button.create_script")}
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
        );
}

export default NewScript;