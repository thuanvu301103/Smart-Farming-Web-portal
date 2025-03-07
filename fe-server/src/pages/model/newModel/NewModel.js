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
import modelApi from '../../../api/modelAPI';
import { useNavigate, useParams } from 'react-router-dom';

const NewModel = () => {

    const { t } = useTranslation();
    const navigate = useNavigate();

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
        if (formData.name.length == 0) {
            return;
        }
        const userId = localStorage.getItem("userId");
        try {
            const modelId = await modelApi.createModel (userId, formData);
            navigate(-1);
            return modelId._id;
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
                {t("new-model.title")}
            </Typography>
            <FormControl variant="standard" fullWidth>

                {/*Model Name*/}
                <Typography
                    variant="body1" gutterBottom
                >
                    {t("new-model.model-name")}
                </Typography>
                <TextField
                    id="model-name"
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
                    {t("new-model.description")}
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
                {t("button.create_model")}
            </Button>
        </Box>
        );
}

export default NewModel;