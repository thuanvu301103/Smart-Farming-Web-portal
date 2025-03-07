import React, { useEffect, useState } from 'react';
import Tabnav from '../../../components/Tabnav';
import ScriptsOfModel from './ScriptsOfModel';
import CodeIcon from '@mui/icons-material/Code';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import modelApi from '../../../api/modelAPI';

const Model = () => {
    const { t } = useTranslation();
    const { userId, modelId } = useParams();

    // Fetch Script info
    const [modelInfo, setModelInfo] = useState([]);

    useEffect(() => {
        const fetchModel = async () => {
            try {
                const response = await modelApi.getModelInfo(userId, modelId);
                setModelInfo(response);
            } catch (error) {
                console.error('Error fetching model:', error);
            }
        };
        fetchModel();
    }, [userId, modelId]);

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

    return (
        <div>
            <Tabnav data={tabdata} />
            <Routes>
                {tabdata.map((item, index) => (
                    <Route 
                        key={index}
                        path={item.value} 
                        element={item.element} 
                    />
                ))}
            </Routes>
        </div>
    );
};

export default Model;
