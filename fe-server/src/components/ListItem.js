import {
    ListItem, ListItemText, ListItemIcon,
    Link, Box
} from '@mui/material';
// Import Icons
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import FolderIcon from '@mui/icons-material/Folder';

const ScriptListItem = ({ item }) => {
    return (
        <Box sx={
            {
                bgcolor: 'background.paper',
                boxShadow: '0px 2px 2px rgba(0, 128, 0, 0.5)',
                m: 0.5,
                borderRadius: '8px'
            }}
        >
            <ListItem>
                <ListItemText
                    primary={
                        <Link
                            href="#"
                            variant="h6"
                            style={{ color: 'green', textDecoration: 'none', fontWeight: 'bold' }}
                        >
                            {item?.name ? item.name : null}
                        </Link>
                    }
                    secondary={item?.description ? item.description : null}
                />
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