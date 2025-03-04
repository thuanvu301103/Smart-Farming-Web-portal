import React, { useEffect, useState } from 'react';
// Import components
import Tabnav from '../components/Tabnav';
// Import pages
import ScriptCode from './script/scriptCode/ScriptCode';
// Import Icons
import CodeIcon from '@mui/icons-material/Code';
import CommentIcon from '@mui/icons-material/Comment';
// Translation
import { useTranslation } from 'react-i18next';
// React Router DOM
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import ScriptComment from './ScriptComment';
// Hooks
import { useFetchScriptInfo } from '../hooks/useFetchScript';


const Script = () => {

    const { t } = useTranslation();
    // Get scriptId and userId
    const { userId, scriptId } = useParams();
    // Navigation
    const navigation = useNavigate();

    // Fetch Script Info
    const { data: scriptInfo, loading: scriptInfoLoading, error: scriptInfoError } = useFetchScriptInfo(userId, scriptId);

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

    // Auto navigate to code tab
    useEffect(() => {
        if (scriptInfo && !scriptInfoLoading && !scriptInfoError) {
            setTimeout(() => {
                navigation("./code"); // Navigate afetr render loop is complete
            }, 0);
        }
    }, [scriptInfo, scriptInfoLoading, scriptInfoError, navigation])

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