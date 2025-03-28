import React, {useState, useEffect, useRef} from 'react';
// Import components
import {
    Grid, Typography, Link, Box,
    CardContent, Button, 
} from '@mui/material';
import { CardWrapper } from '../../components/CardWrapper'
// Translation
import { useTranslation } from 'react-i18next';
// Panels
import { ProfilePanel } from './ProfilePanel';
import { ActivityPanel } from './ActivityPanel';
// React DOM
import { useNavigate, useParams } from "react-router-dom";
// Hooks
import { useFetchActivities } from "../../hooks/useFetchUser";
// api
import userApi from "../../api/userAPI";


// Truncate Text function
const truncateText = (text, maxWords) => {
    const words = text.split(' ');
    if (words.length > maxWords) {
        return words.slice(0, maxWords).join(' ') + '...';
    }
    return text;
};

const transformActivities = (activitiesData) => {
    return Object.entries(activitiesData).map(([date, activityTypes]) => {
        // Chuyển đổi "YYYY-MM" thành "Month YYYY"
        const [year, month] = date.split("-");
        const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        const formattedTime = `${monthNames[parseInt(month, 10) - 1]} ${year}`;

        // Chuyển đổi từng loại activity
        const activities = {};
        Object.entries(activityTypes).forEach(([type, items]) => {
            if (!Array.isArray(items)) return; // Đề phòng items bị undefined

            activities[type] = items.map((item) => {
                if (!item || typeof item !== "object") return null; // Bỏ qua nếu item bị lỗi

                if (type === "create_script" || type === "create_model" ) {
                    return { name: item.name || "Unnamed Script", _id: item._id || "Unknown" };
                } else if (type === "create_comment") {
                    return {
                        content: item.content || "No Content",
                        _id: item._id || "Unknown",
                        script_name: item.script_id?.name ? item.script_id.name : "Unknown",
                        script_id: item.script_id._id || "Unknown",
                    };
                } else {
                    return item;
                }
            }).filter(Boolean); // Xóa các giá trị null
        });

        return {
            time: formattedTime,
            activities
        };
    });
};

const Overview = ({ profile, topScripts }) => {

    const navigate = useNavigate();
    const { t } = useTranslation();
    const { userId } = useParams();
    const [curYear, setCurYear] = useState(new Date().getFullYear().toString());

    const { data: activitiesData, loading: activitiesLoading, error: activitiesError } = useFetchActivities(userId, curYear);
    const [activitiesList, setActivitiesList] = useState([]);

    useEffect(() => {
        const result = transformActivities(activitiesData);
        setActivitiesList((prevList) => {
            const merged = [...prevList, ...result]; // Lấy từ ref để đảm bảo giá trị cũ
            //console.log("Marge: ", merged);
            return merged.filter((item, index, self) =>
                index === self.findIndex((t) => t.time === item.time)
            );
        });
    }, [activitiesData]);

    const handleLoadMoreAct = async () => {
        let newActs = await userApi.activities(userId, curYear - 1);
        newActs = transformActivities(newActs) || [];
        setActivitiesList((prevList) => {
            const merged = [...prevList, ...newActs]; // Lấy từ ref để đảm bảo giá trị cũ
            //console.log("Marge: ", merged);
            return merged.filter((item, index, self) =>
                index === self.findIndex((t) => t.time === item.time)
            );
        });
        setCurYear((prev) => prev - 1);
        //console.log("After Merge: ", activitiesList);
    };

    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
        >
            <Grid container
                alignItems="start"
                mt={1} mb={1}
                xs={11} md={9}
            >
                <Grid container alignItems="start" item direction="row"
                    mt={1} xs={12} md={4}
                >
                    {/* Profile Panel */}
                    <ProfilePanel profile={profile}/>
                </Grid>
                <Grid item xs={12} md={8}>
                    <Box
                        m={2}
                        sx={{
                            display: 'flex', flexDirection: 'column',
                        }}
                    >
                        {/*Top Scripts Panel*/}
                        <Typography variant="h6" mb={1} sx={{ fontWeight: "bold" }}>
                            {t("overview.top_script")}
                        </Typography>
                        <Grid container spacing={1}>
                            {topScripts.map((item, index) => (
                                <Grid item xs={6} key={index}>
                                    <CardWrapper borderThickness="0px" borderSide="right" height="130px">
                                        <CardContent>
                                            <Link
                                                variant="body1"
                                                color="success"
                                                style={{ textDecoration: 'none', fontWeight: 'bold' }}
                                                onClick={() => navigate(`../scripts/${item?._id ? item._id : '#'}/code`)}
                                            >
                                                {item?.name ? item.name : null}
                                            </Link>
                                            <Typography variant="body2" color="text.secondary" mt={2}>
                                                {truncateText(item.description,15)}
                                            </Typography>
                                        </CardContent>
                                    </CardWrapper>
                                </Grid>
                            ))}
                        </Grid>
                        {/*Activity Panel*/}
                        <Typography variant="h6" mt={2} sx={{ fontWeight: "bold" }}>
                            {t("overview.activity")}
                        </Typography>
                        <ActivityPanel activities={activitiesList} />
                        <Button
                            variant="contained"
                            size="small"
                            color="info"
                            fullWidth
                            sx={{ borderRadius: '8px' }}
                            onClick={handleLoadMoreAct}
                        >
                            {t("button.edit_profile")}
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Overview;