import React, { useEffect, useState } from 'react';
// Import components
import {
    Typography,
    TextField,
    RadioGroup, FormControlLabel, Radio,
    Box, CardContent, Paper,
    List, ListItem,
    Button, IconButton, 
} from '@mui/material';
import { CardWrapper } from '../../../components/CardWrapper';
import { UserListItem1 } from '../../../components/ListItem';
// Impoer Icon
import PublicIcon from '@mui/icons-material/Public';
import SearchIcon from '@mui/icons-material/Search';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from "@mui/icons-material/Close";
// Translation
import { useTranslation } from 'react-i18next';
// API
import userApi from '../../../api/userAPI';

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
                        <CloseIcon size="small" sx={{ p: 0, width: 15, height: 15 }}/>
                    </IconButton>
                </Box>

                {/* Result  List */}
                <List sx={{ width: "100%" }}>
                    {searchUserRes.map((user, index) => (
                        <ListItem key={index} sx={{p: '3px'}}>
                            <UserListItem1
                                item={user}
                                addItemFunc={() => handleAddItem(index)}
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

const PrivacyPanel = ({ formData, handleChange, setFormData }) => {
    const { t } = useTranslation();
    // Handle Search user
    const [searchUserTerm, setSearchUserTerm] = useState();
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
            //console.log("Search Users Result: ", response);
            setSearchUserRes(response);
            setShowSearchRes(true);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    }

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
            console.log(formData);
        };
        func();
    }, [updatedSharedUsers]);
    

    // Handle delete user
    const handleDeleteItem = (index) => {
        const newItems = [...updatedSharedUsers]; // Work with filtered data
        newItems.splice(index, 1); // Adjust index for pagination
        setUpdatedSharedUsers(newItems); // Ensure the main data source is updated
    };

    // Handle add user
    const handleAddItem = (index) => {
        const newItem = searchUserRes[index]; // Work with filtered data
        setUpdatedSharedUsers([...updatedSharedUsers, newItem]); // Ensure the main data source is updated
        //console.log(updatedSharedUsers);
    };

    // Handle show search result
    const [showSearchRes, setShowSearchRes] = useState(false);

    return (
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
                                removeItemFunc={() => handleDeleteItem(index)}
                            />
                        </ListItem>
                    ))}
                </List>
            </CardContent>
        </CardWrapper>
    );
}

export default PrivacyPanel;