import {
    ListItem, ListItemText, ListItemIcon,
    Link, Box, Typography, Grid,
} from '@mui/material';
// Import Icons
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import FolderIcon from '@mui/icons-material/Folder';
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
                boxShadow: '0px 2px 2px rgba(0, 128, 0, 0.5)',
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
                                    href="#"
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

export { ScriptListItem, FileStructListItem };