import React from 'react';
// Import components
import {
    Grid, Typography, Link, Box,
    CardContent, ListItem, List, Divider
} from '@mui/material';
import { CardWrapper } from '../../components/CardWrapper'
// Icons
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import ModelTrainingOutlinedIcon from '@mui/icons-material/ModelTrainingOutlined';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
// Translation
import { useTranslation } from 'react-i18next';
// ProfilePanel
import { ProfilePanel } from './ProfilePanel';
// React DOM
import { useNavigate, useLocation, Navigate } from "react-router-dom";

// Truncate Text function
const truncateText = (text, maxWords) => {
    const words = text.split(' ');
    if (words.length > maxWords) {
        return words.slice(0, maxWords).join(' ') + '...';
    }
    return text;
};

const Overview = ({ profile, topScripts }) => {

    const navigate = useNavigate();
    const { t } = useTranslation();

    const activitiesList = [
        {
            time: "Jan 2025",
            activities: {
                create_model: [{ name: "Đây là tên một model", model_id: "1" }],
                create_script: [{ name: "Đây là tên một script", script_id: "1" }, { name: "aa", script_id: "1" }],
                create_comment: [{ content: "Đây là nội dung cơ bản của comment", comment_id: "1" }]
            }
        },
        {
            time: "Dec 2024",
            activities: {
                create_script: ["#link1", "#link2"],
                create_model: ["#link1", "#link2"],
            }
        },
        {
            time: "Nov 2024",
            activities: {
                create_script: ["#link1", "#link2"],
                create_model: ["#link1", "#link2"],
            }
        },
    ]

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
                        {/* Hiển thị danh sách hoạt động */}
                        <List sx={{ width: "100%" }}>
                            {activitiesList.map((activity, index) => (
                                <React.Fragment key={index}>
                                    {/* Hiển thị thời gian */}
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                        <Typography
                                            variant="caption"
                                            fontWeight="bold"
                                            color="info"
                                            sx={{ whiteSpace: "nowrap", mr: 1 }}
                                        >
                                            {activity.time}
                                        </Typography>
                                        <Divider sx={{ flexGrow: 1 }} />
                                    </Box>

                                    {/* Hiển thị danh sách hoạt động */}
                                 

                                    {Object.entries(activity.activities).map(([type, items]) => {
                                        let color = null;
                                        let title = null;
                                        let icon = null;

                                        if (type === "create_script") {
                                            color = "script";
                                            icon = <DescriptionOutlinedIcon color="script" sx={{ mr: 1 }} />;
                                            title = t("overview.act_title.create") + " " + items.length + " " + t("overview.act_title.script");
                                        } else if (type === "create_comment") {
                                            color = "comment";
                                            icon = <CommentOutlinedIcon color="comment" sx={{ mr: 1 }} />;
                                            title = t("overview.act_title.create") + " " + items.length + " " + t("overview.act_title.comment");
                                        } else if (type === "create_model") {
                                            color = "warning";
                                            icon = <ModelTrainingOutlinedIcon color="warning" sx={{ mr: 1 }} />;
                                            title = t("overview.act_title.create") + " " + items.length + " " + t("overview.act_title.model");
                                        }

                                        return (
                                            <ListItem key={type} sx={{ display: "flex", justifyContent: "center" }}>
                                                <CardWrapper borderThickness="10px" borderSide="right" borderColor={color} mt="0px">
                                                    <CardContent>
                                                        {/* Title with Icon */}
                                                        <Typography variant="body1" fontWeight="bold" sx={{ display: "flex", alignItems: "center" }}>
                                                            {icon} {title}
                                                        </Typography>

                                                        {/* Items List */}
                                                        <List sx={{ padding: 0, gap: 0.5 }}>
                                                            {items.map((item, subIndex) => (
                                                                <ListItem key={subIndex} sx={{ my: 0.5, paddingY: 0, display: "block" }}>
                                                                    {type === "create_comment" ? (
                                                                        <>
                                                                            {/* Comment ID with Divider */}
                                                                            <Typography variant="caption" fontWeight="bold" color="comment" sx={{ display: "flex", alignItems: "center" }}>
                                                                                {item.comment_id}
                                                                                <Divider sx={{ flexGrow: 1, mx: 1, backgroundColor: "comment.main" }} />
                                                                            </Typography>

                                                                            {/* Comment Content */}
                                                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                                                                {item.content}
                                                                            </Typography>
                                                                        </>
                                                                    ) : (
                                                                        <Typography variant="body2" color={color || "text.secondary"}>
                                                                            {item.name || item.content}
                                                                        </Typography>
                                                                    )}
                                                                </ListItem>
                                                            ))}
                                                        </List>
                                                    </CardContent>
                                                </CardWrapper>
                                            </ListItem>
                                        );
                                    })}



                                </React.Fragment>
                            ))}
                        </List>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Overview;