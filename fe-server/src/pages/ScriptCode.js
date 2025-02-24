import React, { useEffect, useState } from 'react';
// Import components
import {
    List, ListItem,
    Grid, Typography, Button, Box, Modal,
    FormControl, FormControlLabel, TextField, Radio, RadioGroup,
    FormHelperText
} from '@mui/material';
//import { PaginatedList } from '../components/List';
import { UserListItem } from '../components/ListItem';
// Import Icon
import PublicIcon from '@mui/icons-material/Public';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
// Translation
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EditScriptModel = ({ open, handleClose, oldData }) => {

    const { t } = useTranslation();

    // Handle Search user
    const [searchUserTerm, setSearchUserTerm] = useState();
    const handleChangeSearchTerm = (e) => {
        const { value } = e.target;
        setSearchUserTerm(value);
    };
    const [searchUserRes, setSearchUserRes] = useState([]);
    // Handle Cofirm
    const handleConfirmSearch = async (e) => {
        e.preventDefault(); // Prevent default form submission
        // Call Edit api
        try {
            const response = await axios.get(
                `http://localhost:3000/users/search`,
                {
                    params: {
                        username: searchUserTerm
                    }
                }
            );
            //console.log('Response search user(s):', response.data);
            setSearchUserRes(response.data);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    }

    // Handle Accessible users
    const [sharedUsers, setSharedUsers] = useState([]);
    const [updatedSharedUsers, setUpdatedSharedUsers] = useState([]);
    const [updatedSharedIds, setUpdatedSharedIds] = useState([]);
    useEffect(() => {
        const func = async () => {
            const ids = updatedSharedUsers.map(user => user._id); // Assuming _id is the ID field
            setUpdatedSharedIds(ids);
        };
        func();
    }, [updatedSharedUsers]);
    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3000/users`,
                    {
                        params: {
                            ids: oldData.share_id.join(',')
                        }
                    }
                );
                console.log("Share id: ", response.data);
                setSharedUsers(response.data);
                setUpdatedSharedUsers(response.data);
            } catch (error) {
                console.error('Error fetching script:', error);
            }
        };
        fetch();
    }, [oldData]);

    useEffect(() => {
        const fetch = async () => {
            setUpdatedSharedUsers(sharedUsers);
        };
        fetch();
    }, [open]);

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

    // Handle delete user
    const handleDeleteItem = (index) => {
        const newItems = [...sharedUsers]; // Work with filtered data
        newItems.splice(index, 1); // Adjust index for pagination
        setUpdatedSharedUsers(newItems); // Ensure the main data source is updated
    };

    // Handle add user
    const handleAddItem = (index) => {
        const newItem = searchUserRes[index]; // Work with filtered data
        setUpdatedSharedUsers([...updatedSharedUsers, newItem]); // Ensure the main data source is updated
        console.log(updatedSharedUsers);
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
                    share_id: updatedSharedUsers.map((item, index) => item._id)
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
        border: '2px solid #000',
        boxShadow: 24,
        borderRadius: '10px',
        p: 4,
        maxHeight: '80vh', // Set a maximum height for the modal
        overflowY: 'auto', // Enable vertical scrolling
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
                        multiline={true}
                        rows={3}
                    />
                    {/*Privacy*/}
                    <Typography
                        variant="body1" gutterBottom
                        sx={{ mt: 1 }}
                    >
                        {t("new-script.privacy")}
                    </Typography>
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
                    {/*Granted access IDs*/}
                    <Typography
                        variant="body1" gutterBottom
                        sx={{ mt: 1 }}
                    >
                        {t("new-script.shared-user")}
                    </Typography>
                    {/*Search*/}
                    <TextField
                        label={t("list.search_for")}
                        variant="outlined"
                        color="success"
                        sx={{ flexGrow: 1 }}
                        margin="normal"
                        value={searchUserTerm}
                        onChange={handleChangeSearchTerm}
                        size="small"
                    />
                    <Button variant="contained" color="success" size="large"
                        startIcon={<AddIcon />}
                        onClick={handleConfirmSearch}
                    >
                        Search
                    </Button>
                    {searchUserRes.length != 0 ?
                        <List sx={{ width: "100%" }}>
                            {searchUserRes.map((user, index) => (
                                <ListItem key={index} sx={{ p: 0 }}>
                                    <UserListItem
                                        item={user}
                                        addItemFunc={() => handleAddItem(index)}
                                        disableAdd={updatedSharedIds.includes(user._id)}
                                        newLable={!oldData.share_id.includes(user._id)}
                                    />
                                </ListItem>
                            ))}
                        </List> : null
                    }
                    {/*Shared User List*/}
                    <List sx={{ width: "100%" }}>
                        {updatedSharedUsers.map((user, index) => (
                            <ListItem key={index} sx={{ p: 0 }}>
                                <UserListItem
                                    item={user}
                                    removeItemFunc={() => handleDeleteItem(index)}
                                    newLable={!oldData.share_id.includes(user._id)}
                                />
                            </ListItem>
                        ))}
                    </List>
                    {/*
                        <PaginatedList
                            ListItemComponents={UserListItem}
                            items={sharedUsers}
                            search={'username'}
                            loading={false}
                            addHref={'/new-script'}
                            updatedDataHook={setUpdatedSharedUsers}
                        />
                    */}

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

            const deleteFolderResponse = await axios.delete(
                `http://localhost:3000/files/deleteFolder`,
                { params: { path: `${formData.owner_id}/${formData._id}` } }
            );
            console.log('Folder Deleted:', deleteFolderResponse.data);
            
        } catch (error) {
            console.error('Error submitting form:', error);
        }
        // Close Model
        
        handleClose();
        navigate(`/${oldData.owner_id}/scripts`);
        // navigate(-1);
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

//Edit File content
const EditFileModal = ({ open, handleClose, oldData, getFileContent}) => {

    const { t } = useTranslation();
    const navigate = useNavigate();

    const [fileData, setFileData] = useState(null);
    const [fileName, setFileName] = useState("");
    const [fileContent, setFileContent] = useState("");

    const handleFileChange = (event) => {
        const files = event.target.files;
        setFileData(files)
        setFileName(files[0].name);

        const reader = new FileReader();
        reader.onload = (e) => {
            setFileContent(e.target.result);
        };
        reader.readAsText(files[0]);
    };

    // Handle Cofirm
    const handleConfirm = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("files", fileData[0]); // Append file
        formData.append("remote_path", `/${oldData.owner_id}/${oldData._id}`);

        // Call Edit api
        try {
            const response = await axios.post(`http://localhost:3000/files/upload`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log('Response:', response.data);
            
            await getFileContent();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
        // Close Model
        setFileData(null);
        setFileName("");
        setFileContent("");
        handleClose();
        // navigate(`/${oldData.owner_id}/scripts`);
    }


    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 1000,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        borderRadius: '10px',
        p: 4,
        // maxHeight: '10vh', // Set a maximum height for the modal
        // overflowY: 'auto', // Enable vertical scrolling
    };



    return (
        <Modal
            open={open}
            onClose={() => {
                setFileData(null);
                setFileName("");
                setFileContent("");
                handleClose();
            }}
        >
            <Box sx={style} gap={2} display="flex" flexDirection="column"
                component="form"
                onSubmit={handleConfirm}
            >
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
                        onChange={handleFileChange}
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
            

                <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                    <Button
                        type="button"
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => {
                            setFileData(null);
                            setFileName("");
                            setFileContent("");
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
                        disabled={!fileData}             
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
    
    useEffect(() => {
        if (!scriptInfo.owner_id || !scriptInfo._id) return;

        const getFileName = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/files/folder-contents/${scriptInfo.owner_id}%2F${scriptInfo._id}`) 
                setFileName(response.data.contents[0].name);
            } catch (error) {
                console.error('Error getting file name:', error);
            }
        }
        getFileName();
    }, [scriptInfo.owner_id, scriptInfo._id])

    const getFileContent = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/files/file-content/${scriptInfo.owner_id}%2F${scriptInfo._id}%2F${fileName}`) 
            setFileContent(response.data);
        } catch (error) {
            console.error('Error getting file content:', error);
        }
    }

    useEffect(() => {
        if (!scriptInfo.owner_id || !scriptInfo._id || !fileName) return;
        getFileContent();
    }, [scriptInfo.owner_id, scriptInfo._id, fileName])


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
                    <EditFileModal open={openEditFile} handleClose={handleCloseEditFile} oldData={scriptInfo} getFileContent={getFileContent}/>
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