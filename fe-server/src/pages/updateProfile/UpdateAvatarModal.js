import React, { useEffect, useState, useRef } from 'react';
// Components
import {
    Grid, Button, Box, Modal,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AvatarEditor from "react-avatar-editor";
// Translation
import { useTranslation } from 'react-i18next';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    bgcolor: 'background.paper',
    borderRadius: '16px',
    p: 2,
    maxHeight: '80vh', // Set a maximum height for the modal
    overflowY: 'auto', // Enable vertical scrolling
};

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 50,
    left: 50,
    whiteSpace: 'nowrap',
    width: 5,
});

const UpdateAvatarModal = ({ open, handleClose, image, handleConfirm }) => {
    const editorRef = useRef(null);
    const { t } = useTranslation();

    const [newAvatar, setNewAvatar] = useState('');
    useEffect(() => {
        setNewAvatar(image)
    }, [image, open]);

    // Resize image before returning
    const resizeImage = (base64Str, maxWidth = 800, maxHeight = 800) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = base64Str;
            img.onload = () => {
                const canvas = document.createElement("canvas");
                let width = img.width;
                let height = img.height;

                if (width > maxWidth || height > maxHeight) {
                    if (width > height) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    } else {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);

                resolve(canvas.toDataURL("image/png", 0.4));
            };
        });
    };

    // Handle Crop Image
    const handleCrop = async () => {
        if (editorRef.current) {
            const canvas = editorRef.current.getImageScaledToCanvas();
            const croppedBase64 = canvas.toDataURL("image/png");

            const resizedImage = await resizeImage(croppedBase64, 800, 800);
            return resizedImage;
        }
        return null;
    };


    // Handle Upload File
    const handleUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            setNewAvatar(e.target.result); 
        };
        reader.readAsDataURL(file);
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
        >
            <Box sx={style}>
                <Grid container direction="column" alignItems="center" spacing={2}>
                    {/* Avatar Editor */}
                    <Grid item>
                        {newAvatar ? (
                            <AvatarEditor
                                ref={editorRef}
                                image={newAvatar}
                                width={300}
                                height={300}
                                border={0.5}
                                borderRadius={300}
                                scale={1.0}
                            />
                        ) : (
                            <p>No image uploaded</p>
                        )}
                    </Grid>

                    {/* Buttons */}
                    <Grid item container justifyContent="space-between" spacing={2}>
                        <Grid item xs={6}>
                            <Button
                                component="label"
                                variant="contained"
                                color="info"
                                sx={{borderRadius: '8px'}}
                                fullWidth
                            >
                                {t("button.upload")}
                                <VisuallyHiddenInput
                                    type="file" accept="image/png, image/jpeg, image/jpg"
                                    onChange={handleUpload}
                                    multiple
                                />
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button variant="contained" color="success"
                                fullWidth
                                sx={{ borderRadius: '8px' }}
                                onClick={async () => {
                                    const croppedImage = await handleCrop(); // Lấy ảnh đã cắt
                                    if (croppedImage) {
                                        handleConfirm(croppedImage); // Gửi ảnh đã cắt vào handleConfirm
                                    }
                                    handleClose();
                                }}
                            >
                                {t("button.save")}
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
        
        );
}

export default UpdateAvatarModal;