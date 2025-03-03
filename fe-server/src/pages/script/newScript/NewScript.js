import React, { useEffect, useState } from 'react';
// Import components
import {
    Typography,
    FormControl, TextField,
    RadioGroup, FormControlLabel, Radio,
    Box, Grid, CardContent,
    Button,
} from '@mui/material';
import { CardWrapper } from '../../../components/CardWrapper';
// Import Icon
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
// Import Panels
import ScriptInfoPanel from './ScriptInfoPanel'
import PrivacyPanel from './PrivacyPanel'
// Translation
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// API
import scriptApi from '../../../api/scriptAPI';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const NewScript = ({ userId}) => {

    const { t } = useTranslation();

    const navigate = useNavigate();

    const [fileContent, setFileContent] = useState("");
    const [fileName, setFileName] = useState("");
    const [uploadedFile, setUploadedFile] = useState(null);

    // Error before submit
    const [nameError, setNameError] = useState(false);

    const handleUpload = (event) => {
        const file = event.target.files[0];
        setFileName(file.name);
        setUploadedFile(file);

        const reader = new FileReader();
        reader.onload = (e) => {
            setFileContent(e.target.result);
        };
        reader.readAsText(file);
    };

    const handleSubmitFile = async (scriptId) => {
        if (!uploadedFile) return;

        const formFileData = new FormData();
        formFileData.append("files", uploadedFile);
        formFileData.append("remote_path", `/${userId}/${scriptId}/`);

        try {
            const response = await fetch("http://localhost:3000/files/upload", {
                method: "POST",
                body: formFileData,
            });
            const result = await response.json();
            console.log("File uploaded successfully:", result);
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    }


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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setNameError(false);
        if (formData.name.length == 0) {
            setNameError(true)
            return;
        }
        const userId = localStorage.getItem("userId");
        try {
            const response = await scriptApi.createScript(userId, formData);
            navigate(`/${userId}/scripts`);
            return response.data._id;
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
        >
            <Grid container justifyContent="center">
                <Grid container item xs={11} md={9} spacing={2}>
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
                    {/* Text Editor */}
                    <Grid container item xs={12} md={7}>
                    </Grid>

                    {/* Script's Information */}
                    <Grid container item xs={12} md={5} spacing={2}>
                        <Grid item xs={12}>
                            <ScriptInfoPanel formData={formData} handleChange={handleChange} error={nameError} />
                        </Grid>
                        <Grid item xs={12}>
                            <PrivacyPanel formData={formData} handleChange={handleChange} setFormData={setFormData}/>
                        </Grid>
                        <Grid item xs={12} display="flex" justifyContent="flex-end">
                            {/*Submit Button*/}
                            <Button
                                type="submit"
                                variant="contained"
                                color="success"
                                size="small"
                                onClick={handleSubmit}
                            >
                                {t("button.create_script")}
                            </Button>
                        </Grid>

                    </Grid>



            <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
            >
                Upload files
                <VisuallyHiddenInput
                    type="file"
                    onChange={handleUpload}
                    multiple
                />
            </Button>

            {fileName && (
                <>
                    <Typography variant="h6">{fileName}</Typography>
                    <TextField
                        label="File Content"
                        multiline
                        rows={10}
                        value={fileContent}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                    />
                </>
            )}

            
                </Grid>
            </Grid>
        </Box>
        );
}

export default NewScript;