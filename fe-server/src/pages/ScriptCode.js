import React, { useEffect, useState } from 'react';
// Import components
import {
    Grid, Typography, Button, Box, Modal,
    FormControl, FormControlLabel, TextField, Radio, RadioGroup,
    FormHelperText
} from '@mui/material';
// Import Icon
import PublicIcon from '@mui/icons-material/Public';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// Translation
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const EditScriptModel = ({ open, handleClose, oldData }) => {

    const { t } = useTranslation();
    // Form Data
    const [formData, setFormData] = useState({
        _id: '',
        name: '',
        description: '',
        privacy: '',
        owner_id: '',
    });

    useEffect(() => {
        if (oldData) {
            setFormData({
                _id: oldData._id,
                name: oldData.name,
                description: oldData.description,
                privacy: oldData.privacy,
                owner_id: oldData.owner_id,
            });
        }
    }, [oldData]);
    // Handle Change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    // Handle Cofirm
    const handleConfirm = async (e) => {
        e.preventDefault(); // Prevent default form submission
        // Call Edit api
        try {
            const response = await axios.put(
                `http://localhost:3000/${formData.owner_id}/scripts/${formData._id}`,
                {
                    name: formData.name,
                    description: formData.description,
                    privacy: formData.privacy,
                }
            );
            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
        // Close Model
        window.location.reload(); // Reload after update
        handleClose();
    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 1000,
        bgcolor: 'background.paper',
        border: '2px',
        boxShadow: 24,
        borderRadius: '10px',
        p: 4,
    };


    return (
        <Modal
            open={open}
            onClose={handleClose}
        >
            <Box sx={style} gap={2} display="flex" flexDirection="column"
                component="form"
                onSubmit={handleConfirm}
            >
                {/*Title*/}

                <Typography id="modal-modal-title" variant="h6" component="h2">
                    {t("edit-script.title")}
                </Typography>
                {/*Form data*/}
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
                                <Box display="flex" alignItems="center" sx={{ mt: 1 }}>
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
                {/*Submit Button*/}
                <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    size="small"
                    sx={{ alignSelf: 'flex-end' }}
                >
                    {t("button.confirm")}
                </Button>
            </Box>
        </Modal>
        );
}

const DeleteScriptModel = ({ open, handleClose, oldData }) => {

    const { t } = useTranslation();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        _id: '',
        name: '',
        description: '',
        privacy: '',
        owner_id: '',
    });

    useEffect(() => {
        if (oldData) {
            setFormData({
                _id: oldData._id,
                name: oldData.name,
                description: oldData.description,
                privacy: oldData.privacy,
                owner_id: oldData.owner_id,
            });
        }
    }, [oldData]);
    
    // Handle Cofirm
    const handleConfirm = async (e) => {
        e.preventDefault(); // Prevent default form submission
        // Call Edit api
        try {
            const response = await axios.delete(
                `http://localhost:3000/${formData.owner_id}/scripts/${formData._id}`,
            );
            console.log('Response:', response.data);
            
        } catch (error) {
            console.error('Error submitting form:', error);
        }
        // Close Model
        
        handleClose();
        navigate(-1);
    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 1000,
        bgcolor: 'background.paper',
        border: '2px',
        boxShadow: 24,
        borderRadius: '10px',
        p: 4,
    };


    return (
        <Modal
            open={open}
            onClose={handleClose}
        >
            <Box sx={style} gap={2} display="flex" flexDirection="column"
                component="form"
                onSubmit={handleConfirm}
            >
                {/*Title*/}
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    {t("delete-script.title")}
                </Typography>
                {/*Note confirm*/}
                <Typography
                    variant="body1" gutterBottom
                    sx={{ mt: 1 }}
                >
                    {t("delete-script.note")}
                </Typography>
               
                {/*Submit Button*/}
                <Button
                    type="submit"
                    variant="contained"
                    color="error"
                    size="small"
                    sx={{ alignSelf: 'flex-end' }}
                >
                    {t("button.confirm")}
                </Button>
            </Box>
        </Modal>
    );
}

const EditFileModal = ({ open, handleClose, oldData, oldFileName }) => {

    const { t } = useTranslation();
    const navigate = useNavigate();

    const { scriptId } = useParams();

    const [fileNameCheck, setFileNameCheck] = useState(false);
    const [fileData, setFileData] = useState(null);
    
    const handleFileChange = (event) => {
        const files = event.target.files;
        setFileData(files)
    };

    useEffect(() => {
        // console.log("New:", newFileName);
        // console.log("Old:", oldFileName);
        if(fileData === null) return;

        const fileNames = Array.from(fileData).map(file => file.name);

        if (fileNames[0] !== oldFileName) {
            setFileNameCheck(false);
        } else {
            setFileNameCheck(true);
        }
    }, [fileData, oldFileName]);

    // Handle Cofirm
    const handleConfirm = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("files", fileData[0]); // Append file
        formData.append("remote_path", `/${oldData.owner_id}/${scriptId}/v1.0`);

        // Call Edit api
        try {
            const response = await axios.post(`http://localhost:3000/files/upload`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
        // Close Model
        setFileData(null);
        setFileNameCheck(false);
        handleClose();
        navigate(`/${oldData.owner_id}/scripts`);
    }


    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 1000,
        bgcolor: 'background.paper',
        border: '2px',
        boxShadow: 24,
        borderRadius: '10px',
        p: 4,
    };


    return (
        <Modal
            open={open}
            onClose={() => {
                setFileData(null);
                setFileNameCheck(false);
                handleClose();
            }}
        >
            <Box sx={style} gap={2} display="flex" flexDirection="column"
                component="form"
                onSubmit={handleConfirm}
            >
                <input
                    type="file"
                    directory="true" // Allow selecting directories in the file dialog
                    multiple
                    onChange={handleFileChange}
                />

                {!fileNameCheck && fileData && (
                    <FormHelperText>{t("invalid_file_name")}</FormHelperText>
                )}
            

                <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                    <Button
                        type="button"
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => {
                            setFileData(null);
                            setFileNameCheck(false);
                            handleClose();
                        }}
                    >
                        {t("button.cancel")}
                    </Button>

                    <Button
                        type="submit"
                        variant="contained"
                        color="success"
                        size="small"
                        disabled={!fileNameCheck}
                    >
                        {t("button.confirm")}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

const ScriptCode = ({ scriptInfo }) => {
    const { t } = useTranslation();
    
    // Handle Edit Modal
    const [openEdit, setOpenEdit] = useState(false);
    const handleOpenEdit = () => setOpenEdit(true);
    const handleCloseEdit = () => setOpenEdit(false);

    // Handle Delete Modal
    const [openDelete, setOpenDelete] = useState(false);
    const handleOpenDelete = () => setOpenDelete(true);
    const handleCloseDelete = () => setOpenDelete(false);

    //Handle Edit Fife
    const [openEditFile, setOpenEditFile] = useState(false);
    const handleOpenEditFile = () => setOpenEditFile(true);
    const handleCloseEditFile = () => setOpenEditFile(false);

    const [fileContent, setFileContent] = useState("");
    const [fileName, setFileName] = useState("");

    const { scriptId } = useParams();
    
    useEffect(() => {
        if (!scriptInfo.owner_id || !scriptId) return;

        const getFileName = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/files/folder-contents/${scriptInfo.owner_id}%2F${scriptId}%2Fv1.0`) 
                setFileName(response.data.contents[0].name);
            } catch (error) {
                console.error('Error getting file name:', error);
            }
        }
        getFileName();
    }, [scriptInfo.owner_id, scriptId])

    useEffect(() => {
        if (!scriptInfo.owner_id || !scriptId || !fileName) return;

        const getFileContent = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/files/file-content/${scriptInfo.owner_id}%2F${scriptId}%2Fv1.0%2F${fileName}`) 
                setFileContent(response.data);
            } catch (error) {
                console.error('Error getting file content:', error);
            }
        }
        getFileContent();
    }, [scriptInfo.owner_id, scriptId, fileName])


    return (
        <div className="main-content">
            <Box display='flex' flexDirection='row' justifyContent='space-between'>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mt:1 }}>
                    {scriptInfo.name}
                </Typography>
                <Button
                    variant="contained"
                    size="small"
                    color="error"
                    sx={{ boxShadow: 'none' }}
                    onClick={handleOpenDelete}
                >
                    {t("button.delete")}
                </Button>
                {/*Delete Script Model*/}
                <DeleteScriptModel open={openDelete} handleClose={handleCloseDelete} oldData={scriptInfo} />
            </Box>
            <Grid container alignItems="start" mt={1} mb={1}>
                {/*File and Folder*/}
                <Grid item xs={9} gap={2} display={'flex'} flexDirection={'column'} justifyContent={'center'}>
                    <TextField
                    multiline
                    fullWidth
                    minRows={6}
                    value={fileContent}
                    variant="outlined"
                    margin="normal"
                    InputProps={{
                        style: { whiteSpace: "pre-wrap" }, // Preserves new lines
                        readOnly: true,
                    }}
                    />
                    <Grid item>
                    <Button variant="outlined" color='info' onClick={handleOpenEditFile}>
                        {t("button.edit")}
                    </Button>
                    <EditFileModal open={openEditFile} handleClose={handleCloseEditFile} oldData={scriptInfo} oldFileName={fileName}/>
                </Grid>
            </Grid>
                
                {/*Script Info*/}
                <Grid item xs={3}>
                    <Box
                        sx={{
                            display: 'flex', flexDirection: 'column',
                            ml: 2,
                        }}
                        gap={2}
                    >
                        {/*Title*/}
                        <Box
                            sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between',}}
                        >
                            <Typography variant="h6" >
                                {t("script-detail.about")}
                            </Typography>
                            {/*Edit Script Button*/}
                            <Button
                                variant="contained"
                                size="small"
                                color="warning"
                                sx={{ boxShadow: 'none' }}
                                onClick={handleOpenEdit}
                            >
                                {t("button.edit")}
                            </Button>
                            {/*Edit Script Model*/}
                            <EditScriptModel open={openEdit} handleClose={handleCloseEdit} oldData={scriptInfo} />
                        </Box>
                        {/*Description*/}
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mt:1 }}>
                            {scriptInfo?.description ? scriptInfo.description : t('script-detail.no-description')}
                        </Typography>
                        {/*Privacy*/}
                        <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}
                            gap={2}
                        >
                            {scriptInfo.privacy === "public" ? <PublicIcon /> : <LockOutlinedIcon />}
                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mt: 1 }}>
                                {scriptInfo?.privacy ? t(`privacy.${scriptInfo.privacy}`) : null}
                            </Typography>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </div>
        );
}

export default ScriptCode;