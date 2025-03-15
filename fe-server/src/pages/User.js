import React, { useEffect, useState } from 'react';
// Import components
import Tabnav from '../components/Tabnav';
// Import pages
import BookmarkList from './bookmark/BookmarkList';
import ScriptList from './script/ScriptList';
import ModelList from './model/ModelList';
import Overview from './overview/Overview';
import Explore from './explore/Explore';
// Import Icons
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ImportContactsOutlinedIcon from '@mui/icons-material/ImportContactsOutlined';
import ModelTrainingOutlinedIcon from '@mui/icons-material/ModelTrainingOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import TravelExploreOutlinedIcon from '@mui/icons-material/TravelExploreOutlined';
// Translation
import { useTranslation } from 'react-i18next';
// React Router DOM
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
// Hooks
import { useFetchProfile, useFetchTopScripts, useFetchScriptsList} from "../hooks/useFetchUser";

const User = () => {

    const { t } = useTranslation();

    // Get userId
    const { userId } = useParams();

    // Fetch user's profile
    const { data: profile, loading: profileLoading, error: profileError } = useFetchProfile(userId);
    //console.log("Profile", profile);

    // Fetch user's top scripts
    const { data: topScripts, loading: topScriptsLoading, error: topScriptsError } = useFetchTopScripts(userId);

    // Fetch models list

    const tabdata = [
        {
            icon: <ImportContactsOutlinedIcon />,
            value: "overview",
            path: "./overview",
            label: t("tab.overview"),
            element: <Overview profile={profile} topScripts={topScripts}/>
        },
        {
            icon: <DescriptionOutlinedIcon />,
            value: "scripts",
            path: "./scripts",
            label: t("tab.script"),
            element: <ScriptList/>
        },
        {
            icon: <ModelTrainingOutlinedIcon />,
            value: "model",
            path: "./model",
            label: t("tab.model"),
            element: <ModelList/>
        },
        {
            icon: <BookmarkBorderOutlinedIcon />,
            value: "bookmark",
            path: "./bookmark",
            label: t("tab.bookmark"),
            element: <BookmarkList/>
        },
        {
            icon: <TravelExploreOutlinedIcon />,
            value: "explore",
            path: "./explore",
            label: t("tab.explore"),
            element: <Explore />
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

export default User;