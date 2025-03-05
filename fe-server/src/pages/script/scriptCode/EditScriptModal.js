import React, { useEffect, useState } from 'react';
// Components
import {
    Grid, Typography, Button, IconButton, Box, Modal,
    TextField,
    CardContent,
    RadioGroup, FormControlLabel, Radio,
    List, ListItem, Paper
} from '@mui/material';
import { CardWrapper } from '../../../components/CardWrapper';
import { UserListItem1 } from '../../../components/ListItem';
// Icon
import PublicIcon from '@mui/icons-material/Public';
import SearchIcon from '@mui/icons-material/Search';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CloseIcon from "@mui/icons-material/Close";
// API
import userApi from '../../../api/userAPI';
// Translation
import { useTranslation } from 'react-i18next';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60%',
    bgcolor: 'background.paper',
    borderRadius: '16px',
    p: 2,
    maxHeight: '80vh', // Set a maximum height for the modal
    overflowY: 'auto', // Enable vertical scrolling
};

const SearchResults = ({ searchUserRes, handleAddItem, updatedSharedIds, handleClose }) => {
    return (
        searchUserRes.length !== 0 && (
            <Paper
                elevation={3}
                sx={{
                    width: "100%",
                    maxHeight: "400px",
                    overflowY: "auto",
                    p: 2,
                    position: "relative"
                }}
            >
                {/* Title */}
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption">Kết quả tìm kiếm</Typography>
                    <IconButton onClick={handleClose} size="small">
                        <CloseIcon size="small" sx={{ p: 0, width: 15, height: 15 }} />
                    </IconButton>
                </Box>

                {/* Result  List */}
                <List sx={{ width: "100%" }}>
                    {searchUserRes.map((user, index) => (
                        <ListItem key={index} sx={{ p: '3px' }}>
                            <UserListItem1
                                item={user}
                                addItemFunc={() => handleAddItem(index, user._id)}
                                disableAdd={updatedSharedIds.includes(user._id)}
                                newLable={null}
                            />
                        </ListItem>
                    ))}
                </List>
            </Paper>
        )
    );
};

const EditScriptModel = ({ open, handleClose, handleConfirm, oldData, title }) => {
    const { t } = useTranslation();
    const [error, setError] = useState(null);

    // Form Data
    const [formData, setFormData] = useState({
        _id: '',
        name: '',
        description: '',
        privacy: '',
        owner_id: '',
        share_id: [],
    });
    const [oldUserShareId, setOldUserShareId] = useState([]);
    useEffect(() => {
        if (oldData) {
            setFormData({
                _id: oldData._id,
                name: oldData.name,
                description: oldData.description,
                privacy: oldData.privacy,
                owner_id: oldData.owner_id,
                share_id: oldData.share_id.map(item => item._id)
            });
            setUpdatedSharedUsers(oldData.share_id);
            setSearchUserTerm(null);
            setShowSearchRes(false);
            setOldUserShareId(oldData.share_id.map(item => item._id));
            setError(false);
        }
    }, [oldData, open]); // Reload formData when Close Modal
    // Handle Change FormData
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle Search user
    const [searchUserTerm, setSearchUserTerm] = useState(null);
    const handleChangeSearchTerm = (e) => {
        const { value } = e.target;
        setSearchUserTerm(value);
    };
    const [searchUserRes, setSearchUserRes] = useState([]);
    // Handle Cofirm Search
    const handleConfirmSearch = async (e) => {
        e.preventDefault(); // Prevent default form submission
        try {
            const response = await userApi.searchUser(searchUserTerm);
            setSearchUserRes(response);
            setShowSearchRes(true);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    }

    // Handle show search result
    const [showSearchRes, setShowSearchRes] = useState(false);

    // Handle delete user
    const handleDeleteItem = (index, userId) => {
        const newItems = [...updatedSharedUsers]; // Work with filtered data
        newItems.splice(index, 1); // Adjust index for pagination
        setUpdatedSharedUsers(newItems); // Ensure the main data source is updated
        setFormData({
            ...formData,
            share_id: formData.share_id.filter(id => id !== userId), // Loại bỏ `value`
        });
    };

    // Handle add user
    const handleAddItem = (index, userId) => {
        const newItem = searchUserRes[index]; // Work with filtered data
        setUpdatedSharedUsers([...updatedSharedUsers, newItem]); // Ensure the main data source is updated
        setFormData({
            ...formData,
            share_id: [...(formData.share_id || []), userId], // Append new value
        });
    };

    // Handle Accessible users
    const [updatedSharedUsers, setUpdatedSharedUsers] = useState([]);
    const [updatedSharedIds, setUpdatedSharedIds] = useState([]);
    useEffect(() => {
        const func = async () => {
            const ids = updatedSharedUsers.map(user => user._id); // Assuming _id is the ID field
            setUpdatedSharedIds(ids);
            setFormData({
                ...formData,
                share_id: ids
            });
            //console.log(formData);
        };
        func();
    }, [updatedSharedUsers]);

    return (
        <Modal
            open={open}
            onClose={handleClose}
        >
            <Box sx={style}>
                {/* Title */}
                <Typography id="modal-modal-title" variant="h6" component="h2" fontWeight="bold">
                    {t(title)}
                </Typography>
                {/* Genral Info */}
                <CardWrapper borderThickness="9px" borderSide="right" borderColor="info">
                    <CardContent>
                        {/*Script Name*/}
                        <Typography
                            variant="body1" gutterBottom
                            fontWeight="bold"
                        >
                            {t("new-script.script-name")}
                        </Typography>
                        {error && <Typography variant="body2" color="error" mb={2}>{t("new-script.no_name_err")}</Typography>}
                        <TextField
                            id="script-name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            color="success"
                            variant="outlined"
                            size="small"
                            fullWidth
                        />
                        {/*Script Description*/}
                        <Typography
                            variant="body1" gutterBottom
                            fontWeight="bold"
                            sx={{ mt: 1 }}
                        >
                            {t("new-script.description")}
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            id="description"
                            name="description"
                            color="success"
                            value={formData.description}
                            onChange={handleChange}
                            variant="outlined"
                            size="small"
                            rows={6}
                        />

                    </CardContent>
                </CardWrapper>
                {/* Privacy */}
                <CardWrapper borderThickness="9px" borderSide="right" borderColor="warning">
                    <CardContent>
                        {/* Privacy */}
                        <Typography
                            variant="body1" gutterBottom
                            fontWeight="bold"
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
                                control={<Radio color="info" />}
                                label={
                                    <Box display="flex" alignItems="center">
                                        <PublicIcon style={{ marginRight: 8 }} color="info" />
                                        <Box>
                                            <Typography variant="body2">{t("new-script.public")}</Typography>
                                            <Typography variant="caption" color="text.secondary">{t("new-script.public-note")}</Typography>
                                        </Box>
                                    </Box>
                                }
                            />
                            <FormControlLabel
                                value="private"
                                control={<Radio color="warning" />}
                                label={
                                    <Box display="flex" alignItems="center" sx={{ mt: 1 }}>
                                        <LockOutlinedIcon style={{ marginRight: 8 }} color="warning" />
                                        <Box>
                                            <Typography variant="body2">{t("new-script.private")}</Typography>
                                            <Typography variant="caption" color="text.secondary">{t("new-script.private-note")}</Typography>
                                        </Box>
                                    </Box>
                                }
                            />
                        </RadioGroup>

                        {/*Share User*/}
                        <Typography
                            variant="body1" gutterBottom
                            fontWeight="bold"
                            sx={{ mt: 2 }}
                        >
                            {t("new-script.shared-user")}
                        </Typography>
                        {/*Search*/}
                        <Box display="flex" alignItems="center" gap={2}>
                            <TextField
                                label={t("list.search_for")}
                                variant="filled"
                                color="success"
                                sx={{ flexGrow: 1 }}
                                margin="normal"
                                value={searchUserTerm}
                                onChange={handleChangeSearchTerm}
                                size="small"
                            />
                            {/* Search Button */}
                            <Button
                                variant="contained"
                                color="success" size="small"
                                startIcon={<SearchIcon />}
                                sx={{ borderRadius: '8px' }}
                                onClick={handleConfirmSearch}
                            >
                                {t("button.search")}
                            </Button>
                        </Box>
                        {/* Search User Results */}
                        {showSearchRes ? <SearchResults
                            searchUserRes={searchUserRes}
                            handleAddItem={handleAddItem}
                            updatedSharedIds={updatedSharedIds}
                            handleClose={() => setShowSearchRes(false)}
                        /> : null}
                        {/*Shared User List*/}
                        <List sx={{ width: "100%" }}>
                            {updatedSharedUsers.map((user, index) => (
                                <ListItem key={index} sx={{ p: '3px' }}>
                                    <UserListItem1
                                        item={user}
                                        removeItemFunc={() => handleDeleteItem(index, user._id)}
                                        newLabel={!oldUserShareId.includes(user._id)}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </CardWrapper>
                {/* Buttons */}
                <Grid display="flex" justifyContent="flex-end" sx={{ width: "100%" }} mt={2}>
                    {/* Cancel Button */}
                    <Button
                        variant="contained"
                        size="small"
                        onClick={handleClose}
                        sx={{ borderRadius: '8px' }}
                    >
                        {t("button.cancel")}
                    </Button>
                    {/* Confirm Button */}
                    <Button
                        variant="contained"
                        size="small"
                        color="success"
                        sx={{
                            ml: 1,
                            borderRadius: '8px'
                        }}
                        onClick={(e) => {
                            setError(false);
                            if (formData.name.length == 0) {
                                setError(true);
                                return;
                            }
                            handleConfirm(e, formData);
                        }}
                    >
                        {t("button.confirm")}
                    </Button>
                </Grid>
            </Box>
        </Modal>    
    );
}

export default EditScriptModel;