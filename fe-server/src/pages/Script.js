import React, { useEffect, useState } from 'react';
// Import components
import Tabnav from '../components/Tabnav';
// Import pages
import ScriptCode from '../pages/ScriptCode';
// Import Icons
import CodeIcon from '@mui/icons-material/Code';
import CommentIcon from '@mui/icons-material/Comment';
// Translation
import { useTranslation } from 'react-i18next';
// React Router DOM
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ScriptComment from './ScriptComment';

const Script = () => {

    const { t } = useTranslation();

    // Get scriptId
    const { userId, scriptId } = useParams();

    // Fetch Script info
    const [scriptInfo, setScriptInfo] = useState([]);
    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3000/${userId}/scripts/${scriptId}`
                );
                //console.log(response.data);
                setScriptInfo(response.data);
            } catch (error) {
                console.error('Error fetching scripts:', error);
            }
        };
        fetch();
    }, [userId, scriptId]);

    // Tab data
    const tabdata = [
        {
            icon: <CodeIcon />,
            value: "code",
            path: "./code",
            label: t("tab.code"),
            element: <ScriptCode scriptInfo={scriptInfo} />
        },
        {
            icon: <CommentIcon />,
            value: "comment",
            path: "./comment",
            label: t("tab.comment"),
            element: <ScriptComment scriptInfo={scriptInfo} />
        },
    ];

    return (
        <div>
            <Tabnav data={tabdata} />
            <Routes>
                {tabdata ? tabdata.map((item, index) => (
                    <Route
                        key={index}
                        path={item?.value ? item.value : null}
                        element={item?.element ? item.element : null}
                    />
                )) : null}
            </Routes>
        </div>
    );
    
}

export default Script;