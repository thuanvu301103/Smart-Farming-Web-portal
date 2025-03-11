import React, { useEffect, useState } from 'react';
import Tabnav from '../../../components/Tabnav';
import ScriptsOfModel from './ScriptsOfModel';
import CodeIcon from '@mui/icons-material/Code';
import { useTranslation } from 'react-i18next';
import { Route, Routes, useParams } from 'react-router-dom';
import modelApi from '../../../api/modelAPI';
import { Box, CircularProgress, Typography } from '@mui/material';

const Model = () => {
    const { t } = useTranslation();
    const { modelId } = useParams(); 
    const userId = localStorage.getItem("userId");

    const [modelInfo, setModelInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        if (!userId || !modelId) {
            setError("User ID or Model ID is missing");
            setLoading(false);
            return;
        }

        const fetchModel = async () => {
            try {
                const response = await modelApi.getModelInfo(userId, modelId);
                setModelInfo(response);
            } catch (err) {
                setError("Error fetching model");
                console.error("Error fetching model:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchModel();
    }, [userId, modelId]);

    if (loading) return (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '30vh' }}>
            <CircularProgress />
            <Typography variant="caption" sx={{ mt: 2 }}>{t("loading")}</Typography>
        </Box>
    );
    if (error) return (
        <Typography color="error" variant="h6">
            {t('bookmark.error')}
        </Typography>
    );

    // Tab data
    const tabdata = [
        {
            icon: <CodeIcon />,
            value: "code",
            path: "code", 
            label: t("tab.code"),
            element: <ScriptsOfModel modelInfo={modelInfo} />
        }
    ];
    const defaultTab = tabdata[0]?.value || "code";

    return (
        <Box
            sx = {{
                width: '100%',
                minHeight: '100vh',
                mx: 'auto'
            }}
        >
            <Tabnav data={tabdata} defaultValue={defaultTab}/>
            <Routes>
                {tabdata.map((item, index) => (
                    <Route 
                        key={index}
                        path={item.value} 
                        element={item.element} 
                    />
                ))}
            </Routes>
        </Box>
    );
};

export default Model;
