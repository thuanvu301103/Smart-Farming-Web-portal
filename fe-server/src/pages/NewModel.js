import React, { useEffect, useState } from 'react';
// Import components
import {
    Typography,
    FormControl, TextField,
    Box,
    Button,
} from '@mui/material';
// Import Icon
// Translation
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const NewModel = ({ userId}) => {

    const { t } = useTranslation();

    // Form Data
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:3000/${userId}/models`, formData);
            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <Box
            component="form" className="main-content"
            onSubmit={handleSubmit}
            display="flex" flexDirection="column" alignItems="flex-start" gap={2}
        >
            {/*Title*/}
            <Typography
                variant="h5" gutterBottom
                sx={{mt:2}}
            >
                {t("new-script.title")}
            </Typography>
            <FormControl variant="standard" fullWidth>

                {/*Model Name*/}
                <Typography
                    variant="body1" gutterBottom
                >
                    {t("new-script.script-name")}
                </Typography>
                <TextField
                    id="script-name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    color="success"
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{ width: '50%' }}
                />

                {/* Model Description*/}
                <Typography
                    variant="body1" gutterBottom
                    sx={{ mt: 1 }}
                >
                    {t("new-script.description")}
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
                {t("button.create_script")}
            </Button>
        </Box>
        );
}

export default NewModel;