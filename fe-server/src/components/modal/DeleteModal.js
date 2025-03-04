// Components
import {
    List, ListItem,
    Grid, Typography, Button, Box, Modal,
    FormControl, FormControlLabel, TextField, Radio, RadioGroup,
} from '@mui/material';
// Icon
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
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
    // maxHeight: '10vh', // Set a maximum height for the modal
    // overflowY: 'auto', // Enable vertical scrolling
};

const DeleteModal = ({ open, handleClose, handleConfirm }) => {

    const { t } = useTranslation();

    return (
        <Modal
            open={open}
            onClose={handleClose}
        >
            
            <Box sx={style} gap={2} display="flex" flexDirection="column" alignItems="center">
                {/*Title */}
                <Typography id="modal-modal-title" variant="h6" component="h2" fontWeight="bold">
                    {t("delete-script.title")}
                </Typography>
               
                <ReportGmailerrorredIcon color="error" sx={{ width: '150px', height: '150px' }}/>

                {/*Note confirm */}
                <Typography
                    variant="body1" gutterBottom
                    sx={{ mt: 1 }}
                >
                    {t("delete-script.note")}
                </Typography>
                <Grid display="flex" justifyContent="flex-end" sx={{ width: "100%" }}>
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
                        color="error"
                        sx={{
                            ml: 1,
                            borderRadius: '8px'
                        }}
                        onClick={handleConfirm}
                    >
                        {t("button.confirm")}
                    </Button>
                </Grid>
            </Box>
        </Modal>
    );
}

export default DeleteModal;