import {
    ListItem, ListItemText, ListItemIcon,
    Link, Box, Typography, Grid,
} from '@mui/material';
// Import Icons
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import FolderIcon from '@mui/icons-material/Folder';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ModelTrainingOutlinedIcon from '@mui/icons-material/ModelTrainingOutlined';
// Translation
import { useTranslation } from 'react-i18next';

// Truncate Text function
const truncateText = (text, maxWords) => {
    const words = text.split(' ');
    if (words.length > maxWords) {
        return words.slice(0, maxWords).join(' ') + '...';
    }
    return text;
};

const ScriptListItem = ({ item }) => {

    const { t } = useTranslation();

    return (
        <Box sx={
            {
                bgcolor: 'background.paper',
                borderBottom: '2px solid', borderColor: '#A1C038',
                m: 1,
                borderRadius: '8px'
            }}
        >
            <ListItem>
                <Grid container alignItems="center">
                    <Grid item xs={9}>
                        <ListItemText
                            primary={
                                <Link
                                    href={`scripts/${item?._id ? item._id : '#'}/code`}
                                    variant="h6"
                                    color="success"
                                    style={{ textDecoration: 'none', fontWeight: 'bold' }}
                                >
                                    {item?.name ? item.name : null}
                                </Link>
                            }
                            secondary={item?.description ? truncateText(item.description, 30) : null}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Typography
                                component="span"
                                color={item?.privacy ? (item.privacy === "public" ? "info" : "warning") : null}
                                sx={{
                                    border: '1px solid', // Border color similar to outlined button
                                    padding: '2px 5px',
                                    borderRadius: '10px',
                                    fontWeight: 'bold',
                                    display: 'inline-block',
                                }}
                                variant="caption"
                            >
                                {item?.privacy ? t("privacy." + item.privacy) : null}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </ListItem>
        </Box>
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

export { ScriptListItem, FileStructListItem, ActivityListItem };