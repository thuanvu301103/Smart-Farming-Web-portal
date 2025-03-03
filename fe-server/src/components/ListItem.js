// Components
import {
    ListItem, ListItemText, ListItemIcon,
    Link, Box, Typography, Grid, Button, IconButton, Avatar,
    Chip, Divider,
    CardContent,
} from '@mui/material';
import { CardWrapper } from './CardWrapper';
// Import Icons
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import FolderIcon from '@mui/icons-material/Folder';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ModelTrainingOutlinedIcon from '@mui/icons-material/ModelTrainingOutlined';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShareIcon from '@mui/icons-material/Share';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import SpaOutlinedIcon from '@mui/icons-material/SpaOutlined';
// Translation
import { useTranslation } from 'react-i18next';
// API
import userApi from "./../api/userAPI";
// React DOM
import { useNavigate, useLocation, Navigate } from "react-router-dom";

// Truncate Text function
const truncateText = (text, maxWords) => {
    const words = text.split(' ');
    if (words.length > maxWords) {
        return words.slice(0, maxWords).join(' ') + '...';
    }
    return text;
};

const ScriptListItem = ({ item }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleFavorite = async () => {
        let action = item.isFavorite ? "remove" : "add";
        await userApi.favoriteScript(localStorage.getItem("userId"), item._id, action);
        item.isFavorite = !item.isFavorite;
        if (action == "add") item.favorite++;
        else item.favorite--;
    }

    return (
        <CardWrapper borderThickness="10px" borderSide="right" borderColor="success">
            <CardContent>
                <Grid container>
                    {/* Script Info */}
                    <Grid item xs={9}>
                        <Link
                            variant="h6"
                            color="success"
                            style={{ textDecoration: 'none', fontWeight: 'bold' }}
                            onClick={() => navigate(`${item?._id ? item._id : '#'}/code`)}
                        >
                            {item?.name ? item.name : null}
                        </Link>
                        <Typography variant="body2" color="text.secondary" mt={1}>
                            {truncateText(item.description, 100)}
                        </Typography>
                        <Divider sx={{ flexGrow: 1, mt: 2, backgroundColor: "success.main" }} />
                        <Grid container spacing={0} mt={1}>
                            {/* Plant type */}
                            <Grid item xs={12} container alignItems="center">
                                <SpaOutlinedIcon color="success" fontSize="small" />
                                <Typography variant="caption" color="text.secondary" ml={1}>
                                    {Array.isArray(item?.plant_type) && item.plant_type.length === 0
                                        ? t("common.unknown")
                                        : truncateText((item?.plant_type || []).join(", "), 30)}
                                </Typography>
                            </Grid>

                            {/* Location */}
                            <Grid item xs={12} container alignItems="center">
                                <LocationOnOutlinedIcon color="warning" fontSize="small" />
                                <Typography variant="caption" color="text.secondary" ml={1}>
                                    {Array.isArray(item?.location) && item.location.length === 0
                                        ? t("common.unknown")
                                        : truncateText((item?.location || []).join(", "), 30)}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    {/* Script Privacy and Bookmark button */}
                    <Grid item xs={3} display="flex" flexDirection="column" alignItems="flex-end" justifyContent="space-between" gap={2}>
                        <Grid container spacing={2} alignItems="flex-start" justifyContent="flex-end">
                            {/* Script Privacy */}
                            <Grid item xs={12} display="flex" justifyContent="flex-end">
                                <Chip
                                    size="small"
                                    label={item?.privacy ? t("privacy." + item.privacy) : null}
                                    color={item?.privacy ? (item.privacy === "public" ? "info" : "warning") : null}
                                />
                            </Grid>
                            {/* Bookmark */}
                            <Grid item xs={12} display="flex" justifyContent="flex-end">
                                <Button
                                    variant='outlined' size="small"
                                    startIcon={<BookmarkBorderIcon color={item?.isFavorite ? (item.isFavorite ? "script" : "text") : "text"} />}
                                    color={item?.isFavorite ? (item.isFavorite ? "script" : "text") : "text"}
                                    sx={{ borderRadius: '8px' }}
                                    onClick={handleFavorite}
                                >
                                    {t("button.favorite")}
                                </Button>
                            </Grid>
                        </Grid>
                        {/* Other info */}
                        <Grid container spacing={0} alignItems="flex-start" sx={{ ml: 2 }}>
                            {/* Favorite count */}
                            <Grid item xs={12} container alignItems="center" ml={2}>
                                <BookmarkBorderIcon color="script" fontSize="small" />
                                <Typography variant="caption" color="text.secondary" ml={1}>
                                    {t("common.favorite")}: {item.favorite}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </CardContent>
        </CardWrapper>
    );
}

const ScriptModelListItem = ({ item }) => {

    const { t } = useTranslation();

    return (
        <ListItem sx={{
                display: 'flex',
                alignItems: 'flex-start',
                bgcolor: 'background.paper',
                padding: '16px',
                border: '1px solid #3D444D',
                borderRadius: '6px',
                gap: '16px',
                alignItems: 'center',
            }}
        >
                <ListItemText
                    sx = {{display: 'flex', flexDirection: 'column', flex: '1 1 0%'}}
                    primary={
                        <Link
                            href={`scripts/${item?._id ? item._id : '#'}/code`}
                            color='success'
                            sx={{ textDecoration: 'none', fontWeight: 'bold' }}
                        >
                            {item?.name ? item.name : null}
                        </Link>
                    }
                    secondary={
                        <Typography
                        sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 3, // Limit text to 3 lines
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >{item?.description}</Typography>
                    }
                />
                <Chip 
                label={item?.privacy ? t("privacy." + item.privacy) : null} variant="outlined" />
        </ListItem>
        );
}

const UserListItem = ({
    item,
    removeItemFunc = null,
    addItemFunc = null,
    disableAdd = false,
    newLable = false
}) => {

    const { t } = useTranslation();

    return (
        <ListItem sx={{
            display: 'flex',
            alignItems: 'flex-start',
            bgcolor: 'background.paper',
            padding: '16px',
            border: '1px solid #3D444D',
            borderRadius: '6px',
            gap: '16px',
            alignItems: 'center',
        }}
        >
            <Avatar alt="User Avatar" src={item.profile_image} />
            <ListItemText
                sx={{ display: 'flex', flexDirection: 'column', flex: '1 1 0%' }}
                primary={
                    <Link
                        href={`scripts/${item?._id ? item._id : '#'}/code`}
                        color='success'
                        sx={{ textDecoration: 'none', fontWeight: 'bold' }}
                    >
                        {item?.username ? item.username : null}
                        {newLable ? <Chip label="new" color="info" size="small" variant="outlined" sx={{}} /> : null}
                    </Link>   
                }
                secondary={
                    <Typography
                        sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 3, // Limit text to 3 lines
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                        }}
                    >insert user email?</Typography>
                }
            />
            {removeItemFunc ?
                <IconButton aria-label="remove" size="medium"
                    onClick={removeItemFunc}
                >
                    <RemoveIcon fontSize="inherit" />
                </IconButton> : null
            }
            {addItemFunc ?
                <IconButton aria-label="remove" size="medium"
                    onClick={addItemFunc}
                    disabled={disableAdd}
                >
                    <AddIcon fontSize="inherit" />
                </IconButton> : null
            }
        </ListItem>
    );
}

const UserListItem1 = ({
    item,
    removeItemFunc = null,
    addItemFunc = null,
    disableAdd = false,
    newLable = false
}) => {

    const { t } = useTranslation();

    return (
        <CardWrapper
            borderThickness="0px"
            borderSide="right"
            borderColor="success"
        >
            <Box display="flex" alignItems="center" m={1} justifyContent="space-between" width="90%">
                {/* Bên trái */}
                <Box display="flex" alignItems="center" gap={1}>
                    <Avatar alt="User Avatar" src={item.profile_image} />
                    <Link
                        href={`${item?._id ? item._id : '#'}/overview`}
                        color='warning'
                        sx={{ textDecoration: 'none', fontWeight: 'bold' }}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {item?.username ? item.username : null}
                        {newLable ? <Chip label="new" color="info" size="small" variant="outlined" /> : null}
                    </Link>
                </Box>

                {/* Bên phải */}
                <Box display="flex" alignItems="center" gap={1}>
                    {removeItemFunc && (
                        <IconButton aria-label="remove" size="medium" onClick={removeItemFunc}>
                            <RemoveIcon fontSize="inherit" />
                        </IconButton>
                    )}
                    {addItemFunc && (
                        <IconButton aria-label="add" size="medium" onClick={addItemFunc} disabled={disableAdd}>
                            <AddIcon fontSize="inherit" />
                        </IconButton>
                    )}
                </Box>
            </Box>
        </CardWrapper>

    );
}

const ModelListItem = ({ item }) => {

    const { t } = useTranslation();

    return (
        <ListItem sx={{
                display: 'flex',
                alignItems: 'flex-start',
                bgcolor: 'background.paper',
                padding: '16px',
                border: '1px solid #3D444D',
                borderRadius: '6px',
                gap: '16px'
            }}
        >
                <ListItemText
                    sx = {{display: 'flex', flexDirection: 'column', flex: '1 1 0%'}}
                    primary={
                        <Link
                            href={`models/${item?._id ? item._id : '#'}/code`}
                            color='success'
                            sx={{ textDecoration: 'none', fontWeight: 'bold' }}
                        >
                            {item?.name ? item.name : null}
                        </Link>
                    }
                    secondary={
                        <Typography
                        sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 3, // Limit text to 3 lines
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >{item?.description}</Typography>
                    }
                />
                <Button variant='outlined' sx={{textTransform:'initial', padding: '4px 8px'}} startIcon={<BookmarkBorderIcon />}>
                    {t("button.favorite")}
                </Button>
            </ListItem>
        );
}

const ActivityListItem = ({ item }) => {

    const { t } = useTranslation();

    const time = item.time.split(' ', 2);

    return (
        <Box sx={
            {
                display: 'flex', flexDirection: 'column',
                bgcolor: 'background.paper',
                borderTop: '2px solid', borderColor: '#A1C038',
                p:2,
            }}
        >
            {/*Time*/}
            <Typography variant="subtitle1" size="caption">
                {t("time." + time[0])} {time[1]}
            </Typography>
            {/*Activities*/}
            {Object.entries(item.activities).map(([key, value]) => (
                <Box 
                    sx = {{
                        display: 'flex', flexDirection: 'column',
                        bgcolor: 'background.paper',
                        borderLeft: '2px solid', borderColor: '#A1C038',
                        mb: 1, ml: 2, mt:1,
                        pl: 2
                    }}
                >
                    {/*Icon*/}
                    {key === "create_script" ?
                        <Box sx={{ display: 'flex', alignItems: 'center'}}>
                            <DescriptionOutlinedIcon sx={{ mr: 1 }} /> {t("create")} {value.length} {t("script")}
                        </Box> :
                        key === "create_model" ?
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <ModelTrainingOutlinedIcon sx={{ mr: 1 }} /> {t("create")} {value.length} {t("model")}
                            </Box> :
                            null
                    }
                    {/*Link*/}
                    {value.map((val) => (
                        <Link
                            href={val}
                            underline="hover"
                            sx={{ ml: 4 }}
                            color="info"
                        >
                            {val}
                        </Link>
                        ))}
                </Box>
            ))}
        </Box>
    );
}

const FileStructListItem = ({ item }) => {
    return (
        <Box sx={{ bgcolor: 'background.paper', m: 2}}>
            <ListItem>
                <ListItemIcon>
                    {item?.isFile ? <InsertDriveFileOutlinedIcon /> : <FolderIcon />}
                </ListItemIcon>
                <ListItemText
                    primary={item?.name ? item.name : null}
                />
            </ListItem>
        </Box>
        );
}

// Notification ListItem
const NotificationListItem = ({ item }) => {
    if (item.type == "share")
        return(
            <Box
                display="flex"
                flexDirection="column"
            >
                <Box
                    alignItems="center"
                >
                    <ShareIcon size="small" color="info" /> {item.script_id.name}
                </Box>
                <Box>
                    Bạn được chia sẻ kịch bản này từ {item.from.username}
                </Box>
                
            </Box>
        );
}

export {
    ScriptListItem,
    ScriptModelListItem,
    ModelListItem,
    UserListItem,
    UserListItem1,
    FileStructListItem,
    ActivityListItem,
    NotificationListItem
};