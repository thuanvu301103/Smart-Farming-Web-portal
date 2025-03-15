import React, { useEffect, useState, useRef } from 'react';
// Import components
import {
    Grid, Typography, TextField, Box, Button,
    Avatar
} from '@mui/material';
import UpdateAvatarModal from './UpdateAvatarModal';
// Icons
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import InsertLinkOutlinedIcon from '@mui/icons-material/InsertLinkOutlined';
// Translation
import { useTranslation } from 'react-i18next';
// Hooks
import { useFetchProfile } from "../../hooks/useFetchUser";
// API
import userApi from "../../api/userAPI";

const UpdateProfile = () => {
    const { t } = useTranslation();
    // Get userId
    const userId = localStorage.getItem("userId");
    //console.log(userId);
    // Fetch user's profile
    const { data: profile, loading: profileLoading, error: profileError } = useFetchProfile(userId);
    // Form Data
    const [formData, setFormData] = useState({
        username: '',
        bio: '',
        email: '',
        link1: '',
        link2: '',
        link3: '',
        link4: '',
        profile_image: '',
    });
    useEffect(() => {
        if (profile) {
            setFormData({
                username: profile.username,
                bio: profile.bio,
                email:
                    (profile.links.filter(item => item.type == "mail")[0] ?
                        profile.links.filter(item => item.type == "mail")[0].link : ''),
                link1:
                    (profile.links.filter(item => item.type == "link")[0] ?
                        profile.links.filter(item => item.type == "link")[0].link : ''),
                link2:
                    (profile.links.filter(item => item.type == "link")[1] ?
                        profile.links.filter(item => item.type == "link")[1].link : ''),
                link3:
                    (profile.links.filter(item => item.type == "link")[2] ?
                        profile.links.filter(item => item.type == "link")[2].link : ''),
                link4:
                    (profile.links.filter(item => item.type == "link")[3] ?
                        profile.links.filter(item => item.type == "link")[3].link : ''),
                profile_image: profile.profile_image,
            });
        }
        //console.log(profile);
    }, [profile]);
    // Handle Change FormData
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    // Handle Reset
    const handleReset = () => {
        setFormData({
            username: profile.username,
            bio: profile.bio,
            email:
                (profile.links.filter(item => item.type == "mail")[0] ?
                    profile.links.filter(item => item.type == "mail")[0].link : ''),
            link1:
                (profile.links.filter(item => item.type == "link")[0] ?
                    profile.links.filter(item => item.type == "link")[0].link : ''),
            link2:
                (profile.links.filter(item => item.type == "link")[1] ?
                    profile.links.filter(item => item.type == "link")[1].link : ''),
            link3:
                (profile.links.filter(item => item.type == "link")[2] ?
                    profile.links.filter(item => item.type == "link")[2].link : ''),
            link4:
                (profile.links.filter(item => item.type == "link")[3] ?
                    profile.links.filter(item => item.type == "link")[3].link : ''),
            profile_image: profile.profile_image,
        });
    }
    // Handle Save 
    const handleSave = () => {
        const updateInfo = {
            username: formData.username,
            bio: formData.bio,
            links: [
                {
                    type: "mail",
                    link: formData.email
                },
                {
                    type: "link",
                    link: formData.link1
                },
                {
                    type: "link",
                    link: formData.link2
                },
                {
                    type: "link",
                    link: formData.link3
                },
                {
                    type: "link",
                    link: formData.link4
                }
            ],
            profile_image: formData.profile_image
        }
        userApi.editProfile(userId, updateInfo);
    }
    // Handle Edit Profile Image
    const [openEdit, setOpenEdit] = useState(false);
    const handleOpenEdit = () => setOpenEdit(true);
    const handleCloseEdit = () => setOpenEdit(false);
    const handleConfirmEdit = (image) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            profile_image: image,
        }));
    }

    return (
        <Box
            display="flex"
            alignItems="start"
            justifyContent="center"
            minHeight='80vh'
        >
            <Grid container
                alignItems="start"
                mt={1} mb={1}
                xs={11} md={9}
                spacing={2}
            >
                {/* Title */}
                <Grid container alignItems="start" item direction="row"
                    mt={1} xs={12} md={12}
                >
                    <Typography
                        variant="h5" gutterBottom
                        fontWeight="bold"
                    >
                        {t("edit-profile.title")}
                    </Typography>
                </Grid>
                {/* Profile Info */}
                <Grid container alignItems="start" item direction="column"
                    mt={1} xs={12} md={9}
                    sx={{
                        order: { xs: 2, md: 1 },
                    }}
                >
                    {/* Userame */}
                    <Typography
                        variant="body1" gutterBottom
                        fontWeight="bold"
                        sx={{ mt: 2 }}
                    >
                        {t("edit-profile.username")}
                    </Typography>
                    <TextField
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        color="success"
                        variant="outlined"
                        size="small"
                        fullWidth
                    />
                    {/* Bio */}
                    <Typography
                        variant="body1" gutterBottom
                        fontWeight="bold"
                        sx={{ mt: 1 }}
                    >
                        {t("edit-profile.bio")}
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        id="bio"
                        name="bio"
                        color="success"
                        value={formData.bio}
                        onChange={handleChange}
                        variant="outlined"
                        size="small"
                        rows={7}
                    />
                    {/* Email */}
                    <Grid container alignItems="center" display="flex" sx={{ mb: 1, mt:2 }}>
                        <EmailOutlinedIcon fontSize="small" sx={{ height: "1em" }} />
                        <Typography variant="body1" fontWeight="bold" sx={{ ml: 1, lineHeight: "1em" }}>
                            {t("edit-profile.email")}
                        </Typography>
                    </Grid>

                    <TextField
                        sx={{ width: '60%' }}
                        id="email"
                        name="email"
                        color="success"
                        value={formData.email}
                        onChange={handleChange}
                        variant="outlined"
                        size="small"
                    />
                    {/* External Links */}
                    <Grid container alignItems="center" display="flex" sx={{ mb: 1, mt: 2 }}>
                        <InsertLinkOutlinedIcon fontSize="small" sx={{ height: "1em" }} />
                        <Typography variant="body1" fontWeight="bold" sx={{ ml: 1, lineHeight: "1em" }}>
                            {t("edit-profile.link")}
                        </Typography>
                    </Grid>
                    <TextField
                        sx={{ width: '60%' }}
                        id="link1"
                        name="link1"
                        color="success"
                        value={formData.link1}
                        onChange={handleChange}
                        variant="outlined"
                        size="small"
                    />
                    <TextField
                        sx={{ width: '60%', mt: '5px' }}
                        id="link2"
                        name="link2"
                        color="success"
                        value={formData.link2}
                        onChange={handleChange}
                        variant="outlined"
                        size="small"
                    />
                    <TextField
                        sx={{ width: '60%', mt: '5px' }}
                        id="link3"
                        name="link3"
                        color="success"
                        value={formData.link3}
                        onChange={handleChange}
                        variant="outlined"
                        size="small"
                    />
                    <TextField
                        sx={{ width: '60%', mt: '5px' }}
                        id="link4"
                        name="link4"
                        color="success"
                        value={formData.link4}
                        onChange={handleChange}
                        variant="outlined"
                        size="small"
                    />
                    {/* Button Group */}
                    <Grid container justifyContent="flex-end" spacing={1} sx={{ mt: 2 }}>
                        {/* Reset Button */}
                        <Grid item>
                            <Button variant="contained" color="text"
                                onClick={handleReset}
                                sx={{borderRadius: '8px'}}
                            >
                                {t("edit-profile.reset")}
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color="success"
                                onClick={handleSave}
                                sx={{ borderRadius: '8px' }}
                            >
                                {t("edit-profile.save")}
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                {/* Avatar */}
                <Grid container alignItems="start" item direction="column"
                    mt={1} xs={5} md={3}
                    sx={{
                        order: { xs: 1, md: 2 },
                    }}
                >
                    <Typography
                        variant="body1" gutterBottom
                        fontWeight="bold"
                    >
                        {t("edit-profile.avatar")}
                    </Typography>
                    <Avatar
                        alt="User's avatar"
                        src={formData.profile_image ? formData.profile_image : null}
                        sx={{
                            width: '95%', height: 'auto',
                            mt: 2, mb: 2,
                            border: "1px solid green"
                        }}
                    />
                    <Button variant="contained" color="warning"
                        onClick={handleOpenEdit}
                        fullWidth
                        sx={{ borderRadius: '8px' }}
                    >
                        {t("button.edit")}
                    </Button>
                    <UpdateAvatarModal
                        open={openEdit}
                        handleClose={handleCloseEdit}
                        image={formData.profile_image}
                        handleConfirm={handleConfirmEdit}
                    />
                </Grid>
            </Grid>
        </Box>
        );

}

export default UpdateProfile;