import React, { useEffect, useState } from 'react';
// Import components
import {
    Typography, Button, Box, Modal,
    FormControl, TextField,
    Select,
    MenuItem,
} from '@mui/material';
// Import Icon
import AddIcon from '@mui/icons-material/Add';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BookmarkIcon from '@mui/icons-material/Bookmark';
// Translation
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { PaginatedList } from '../../../components/List';
import { ScriptModelListItem } from '../../../components/ListItem';
import modelApi from '../../../api/modelAPI';
const EditModelModal = ({ open, handleClose, oldData }) => {

    const { t } = useTranslation();
    // Form Data
    const [formData, setFormData] = useState({
        _id: '',
        name: '',
        description: '',
        owner_id: '',
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
            [name]: value
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
                    {t("edit-model.title")}
                </Typography>
                {/*Form data*/}
                <FormControl variant="standard" fullWidth>

                    {/*Script Name*/}
                    <Typography
                        variant="body1" gutterBottom
                    >
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
                        sx={{ width: '50%' }}
                    />

                    {/*Description*/}
                    <Typography
                        variant="body1" gutterBottom
                        sx={{ mt: 1 }}
                    >
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
                    sx={{ alignSelf: 'flex-end' }}
                >
                    {t("button.confirm")}
                </Button>
            </Box>
        </Modal>
        );
}
const DeleteModelModal = ({ open, handleClose, modelInfo }) => {
    const userId = localStorage.getItem('userId');
    const { t } = useTranslation();
    const navigate = useNavigate();
    // Handle Cofirm
    const handleConfirm = async (e) => {
        e.preventDefault(); // Prevent default form submission
        // Call delete api
        try {
            const response = await modelApi.deleteModelInfo(userId, modelInfo._id)
            console.log(response);            
        } catch (error) {
            console.error('Error submitting form:', error);
        }
        // Close Modal
        navigate(`/${userId}/model`);
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
                    {t("delete-model.title")}
                </Typography>
                {/*Note confirm*/}
                <Typography
                    variant="body1" gutterBottom
                    sx={{ mt: 1 }}
                >
                    {t("delete-model.note")}
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

const ScriptsOfModel = ({ modelInfo }) => {
    const { t } = useTranslation();
    const [scripts, setScripts] = useState([]);
    const [scriptLoading, setScriptLoading] = useState(false);

    // Handle Edit Modal
    const [openEdit, setOpenEdit] = useState(false);
    const handleOpenEdit = () => setOpenEdit(true);
    const handleCloseEdit = () => setOpenEdit(false);

    // Handle Delete Modal
    const [openDelete, setOpenDelete] = useState(false);
    const handleOpenDelete = () => setOpenDelete(true);
    const handleCloseDelete = () => setOpenDelete(false);
    
    useEffect(() => {
        const fetch = async () => {
            try {
                setScriptLoading(true);
                const userId= localStorage.getItem('userId');
                const response = await modelApi.getScriptsModel(userId, modelInfo._id);
                setScripts(response);
            } catch (error) {
                console.error('Error fetching scripts of model:', error);
            } finally {
                setScriptLoading(false);
            }
        };
        fetch();
    }, [modelInfo]);

    return (
        <Box className="main-content">
            <Box display='flex' flexDirection='row' justifyContent='space-between' borderBottom='1px solid #3D444D' paddingBottom='16px'>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mt:1 }}>
                    {modelInfo.name}
                </Typography>
                <Box sx={{display:'flex', gap: '8px'}}>
                    <Button
                        startIcon={<BookmarkBorderIcon/>}
                        disableElevation
                        variant="contained"
                        sx = {{ minWidth: '120px', textTransform:'initial', padding: '2px 8px'}}
                    >
                        {t("button.favorite")}
                    </Button>
                    {/*Edit Model*/}
                    <Button
                        startIcon={<EditIcon />}
                        variant="contained"
                        disableElevation     
                        sx = {{ minWidth: '120px', textTransform:'initial', padding: '2px 8px'}}
                        onClick={handleOpenEdit}
                    >
                        {t("button.edit")}
                    </Button>
                    <EditModelModal open={openEdit} handleClose={handleCloseEdit} oldData={modelInfo} />
                    
                    {/*Delete Model*/}
                    <Button
                        startIcon={<DeleteIcon/>}
                        variant="contained"
                        color="error"
                        disableElevation
                        sx = {{ minWidth: '120px', textTransform:'initial', padding: '2px 8px'}}
                        onClick={handleOpenDelete}
                    >
                        {t("button.delete")}
                    </Button>
                    <DeleteModelModal open={openDelete} handleClose={handleCloseDelete} modelInfo = {modelInfo} />
                </Box>
            </Box>
            <Box sx={{display:'flex', gap: '16px', margin:'16px 0'}}>
                <Box sx={{display:'flex', flex:'1', flexDirection:'column', gap:'16px'}}>
                    <Box sx={{display:'flex', justifyContent:'space-between'}}>
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <Select
                                defaultValue=""
                                displayEmpty
                                inputProps={{ 'aria-label': 'Without label' }}
                            >
                                <MenuItem value="">
                                    <em>Artifact</em>
                                </MenuItem>
                                <MenuItem value={10}>Artifact 1</MenuItem>
                                <MenuItem value={20}>Artifact 2</MenuItem>
                                <MenuItem value={30}>Artifact 3</MenuItem>
                            </Select>
                        </FormControl>
                        <Button variant="contained" color="success" size="small" sx={{textTransform: 'initial'}}
                            startIcon={<AddIcon />}
                            href="new-script"
                        >
                        {t("button.new")}
                        </Button>
                    </Box>
                    <Box sx = {{border:'1px solid #3D444D',borderRadius:'6px', padding:'8px'}} >
                        <PaginatedList
                            itemsPerPage = {5}
                            ListItemComponents={ScriptModelListItem}
                            items={scripts}
                            search={'name'}
                            loading={scriptLoading}
                        />
                    </Box>
                </Box>
                <Box sx={{display:'flex', flexDirection:'column', width: '30%', gap:'16px'}}>
                    <Typography variant='h6' sx={{fontWeight: '700'}}>{t("model-detail.about")}</Typography>
                    <Typography sx={{fontStyle:'italic'}}>{modelInfo.description}</Typography>
                    <Box sx={{display:'flex', gap:'8px'}}>
                        <PersonIcon/>
                        <Typography>Trinh Tran Phuong Tuan</Typography>
                    </Box>
                    <Box sx={{display:'flex', gap:'8px'}}>
                        <LocationOnIcon/>
                        <Typography>Ben Tre</Typography>
                    </Box>
                    <Box sx={{display:'flex', gap:'8px'}}>
                        <BookmarkIcon/>
                        <Typography>97 {t("model-detail.favorite")}</Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
        );
}

export default ScriptsOfModel;