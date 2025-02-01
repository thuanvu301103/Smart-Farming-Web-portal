import React, { useEffect, useState } from 'react';
// Import components
import Tabnav from '../components/Tabnav';
// Import pages
import BookmarkList from '../pages/BookmarkList';
import ScriptList from '../pages/ScriptList';
import ModelList from '../pages/ModelList';
import Overview from '../pages/Overview';
// Import Icons
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ImportContactsOutlinedIcon from '@mui/icons-material/ImportContactsOutlined';
import ModelTrainingOutlinedIcon from '@mui/icons-material/ModelTrainingOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import TravelExploreOutlinedIcon from '@mui/icons-material/TravelExploreOutlined';
// Translation
import { useTranslation } from 'react-i18next';
// React Router DOM
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const User = () => {

    const { t } = useTranslation();

    // Get userId
    const { userId } = useParams();

    // Fetch scripts List
    const [scripts, setScripts] = useState([]);
    const [scriptLoading, setScriptLoading] = useState(true); // Add loading state

    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/${userId}/scripts`);
                setScripts(response.data);
            } catch (error) {
                console.error('Error fetching scripts:', error);
            } finally {
                setScriptLoading(false); // Set loading to false after fetching data
            }
        };
        fetch();
    }, [userId]);

    // Fetch user's profile
    const [profile, setProfile] = useState([]);
    const [profileLoading, setProfileLoading] = useState(true); // Add loading state

    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await axios.get('http://localhost:3000/679b765e8496f00b99063cb8/profile');
                setProfile(response.data);
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setProfileLoading(false); // Set loading to false after fetching data
            }
        };
        fetch();
    }, [userId]);

    // Tab data
    const tabdata = [
        {
            icon: <ImportContactsOutlinedIcon />,
            value: "overview",
            path: "./overview",
            label: t("tab.overview"),
            element: <Overview profile={profile}/>
        },
        {
            icon: <DescriptionOutlinedIcon />,
            value: "scripts",
            path: "./scripts",
            label: t("tab.script"),
            element: <ScriptList data={scripts} loading={scriptLoading}/>
        },
        {
            icon: <ModelTrainingOutlinedIcon />,
            value: "model",
            path: "/model",
            label: t("tab.model"),
            element: <ModelList />
        },
        {
            icon: <BookmarkBorderOutlinedIcon />,
            value: "bookmark",
            path: "/bookmark",
            label: t("tab.bookmark"),
            element: <BookmarkList />
        },
        {
            icon: <TravelExploreOutlinedIcon />,
            value: "explore",
            path: "/explore",
            label: t("tab.explore"),
            element: <BookmarkList />
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