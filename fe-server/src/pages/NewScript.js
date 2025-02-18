import React, { useEffect, useState } from 'react';
// Import components
import {
    Typography,
    FormControl, TextField,
    RadioGroup, FormControlLabel, Radio,
    Box,
    Button,
} from '@mui/material';
// Import Icon
import PublicIcon from '@mui/icons-material/Public';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
// Translation
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
        try {
            const response = await axios.post(`http://localhost:3000/${userId}/scripts`, formData);
            console.log('Response:', response.data);
            navigate(`/${userId}/scripts`);
            return response.data._id;
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <Box
            component="form" className="main-content"
            onSubmit={async (e) => {
                const scriptId = await handleSubmit(e);
                await handleSubmitFile(scriptId);
            }}
            display="flex" flexDirection="column" alignItems="flex-start" gap={2}
        >
            {/*Title*/}
            <Typography
                variant="h5" gutterBottom
                sx={{mt:2}}
            >
                {t("new-script.title")}
            </Typography>
            <FormControl variant="standard" fullWidth>

                {/*Script Name*/}
                <Typography
                    variant="body1" gutterBottom
                >
                    {t("new-script.script-name")}
                </Typography>
                <TextField
                    id="script-name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    color="success"
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{ width: '50%' }}
                />

                {/*Description*/}
                <Typography
                    variant="body1" gutterBottom
                    sx={{ mt: 1 }}
                >
                    {t("new-script.description")}
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
                {/*Privacy*/}
                <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="privacy"
                    value={formData.privacy}
                    onChange={handleChange}
                    sx={{ mt: 1 }}
                >
                    <FormControlLabel
                        value="public"
                        control={<Radio />}
                        label={
                            <Box display="flex" alignItems="center">
                                <PublicIcon style={{ marginRight: 8 }} />
                                <Box>
                                    <Typography variant="body1">{t("new-script.public")}</Typography>
                                    <Typography variant="body2" color="text.secondary">{t("new-script.public-note")}</Typography>
                                </Box>
                            </Box>
                        }
                    />
                    <FormControlLabel
                        value="private"
                        control={<Radio />}
                        label={
                            <Box display="flex" alignItems="center" sx={{mt:1}}>
                                <LockOutlinedIcon style={{ marginRight: 8 }} />
                                <Box>
                                    <Typography variant="body1">{t("new-script.private")}</Typography>
                                    <Typography variant="body2" color="text.secondary">{t("new-script.private-note")}</Typography>
                                </Box>
                            </Box>
                        }
                    />
                </RadioGroup>
            </FormControl>

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

            {/*Submit Button*/}
            <Button
                type="submit"
                variant="contained"
                color="success"
                size="small"
                sx={{ alignSelf: 'flex-end' }}
            >
                {t("button.create_script")}
            </Button>
        </Box>
        );
}

export default NewScript;