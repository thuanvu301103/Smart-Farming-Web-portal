import React, { useEffect, useState } from 'react';
// Import components
import Tabnav from '../components/Tabnav';
// Import pages
import ScriptsOfModel from './ScriptsOfModel';
// Import Icons
import CodeIcon from '@mui/icons-material/Code';
// Translation
import { useTranslation } from 'react-i18next';
// React Router DOM
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';


const Model = () => {

    const { t } = useTranslation();

    // Get modelId
    const { userId, modelId } = useParams();

    // Fetch Script info
    const [modelInfo, setModelInfo] = useState([]);
    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/${userId}/models/${modelId}`);
                setModelInfo(response.data);
            } catch (error) {
                console.error('Error fetching model:', error);
            }
        };
        fetch();
    }, [userId, modelId]);

    // Tab data
    const tabdata = [
        {
            icon: <CodeIcon />,
            value: "code",
            path: "./code",
            label: t("tab.code"),
            element: <ScriptsOfModel modelInfo={modelInfo} />
        },
    ];

    return (
        <div>
            <Tabnav data={tabdata} />
            <Routes>
                {tabdata ? tabdata.map((item, index) => (
                    <Route
                        path={item?.value ? item.value : null}
                        element={item?.element ? item.element : null}
                    />
                )) : null}
            </Routes>
        </div>
    );
    
}

export default Model;