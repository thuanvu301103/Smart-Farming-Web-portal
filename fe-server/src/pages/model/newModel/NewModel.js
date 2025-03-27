import React, { useEffect, useState } from 'react';
// Import components
import {
    Typography,
    FormControl, TextField,
    Box,
    Button,
    Stack
} from '@mui/material';
// Import Icon
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
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
        tags: [],
        description: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle Tag Change
    const handleTagChange = (index, field, value) => {
        const newTags = [...formData.tags];
        newTags[index][field] = value;
        setFormData({ ...formData, tags: newTags });
    };

    // Add New Tag
    const handleAddTag = () => {
        setFormData({ ...formData, tags: [...formData.tags, { key: '', value: '' }] });
    };

    // Remove Tag
    const handleRemoveTag = (index) => {
        const newTags = formData.tags.filter((_, i) => i !== index);
        setFormData({ ...formData, tags: newTags });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.name.length == 0) {
            return;
        }

        const hasEmptyTag = formData.tags.some(tag => !tag.key.trim() || !tag.value.trim());

        if (hasEmptyTag) {
            alert("Please fill in all tag fields before submitting.");
            return;
        }

        const userId = localStorage.getItem("userId");
        try {
            const modelId = await modelApi.createModel(userId, formData);
            navigate(-1);
            console.log(modelId);
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
                sx={{ mt: 2 }}
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

                <Stack direction="row" alignItems="center" justifyContent="start" gap={3} sx={{ mt: 2, width: '100%' }}>
                    <Typography variant="body1">
                        {t("new-model.tags")} ({t("optional")})
                    </Typography>
                    <Button
                        variant="contained"
                        size="small"
                        color="info"
                        onClick={handleAddTag}
                        startIcon={<AddIcon />} // Add the plus icon
                    >
                        {t("button.add")}
                    </Button>
                </Stack>

                {/* Tag Fields */}
                <Box sx={{ mt: 2 }}>
                    {formData.tags.map((tag, index) => (
                        <Box key={index} display="flex" alignItems="center" gap={1} sx={{ mb: 1 }}>
                            <TextField
                                label="Key"
                                name="key"
                                value={tag.key}
                                onChange={(e) => handleTagChange(index, "key", e.target.value)}
                                variant="outlined"
                                size="small"
                                color='success'
                            />
                            <TextField
                                label={t("Value")}
                                name="value"
                                value={tag.value}
                                onChange={(e) => handleTagChange(index, "value", e.target.value)}
                                variant="outlined"
                                size="small"
                                color='success'
                            />
                            <Button onClick={() => handleRemoveTag(index)} color="error">
                                <DeleteIcon />
                            </Button>
                        </Box>
                    ))}
                </Box>
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