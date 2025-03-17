import React, { useState, useEffect } from 'react';
// Icons
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import ModelTrainingOutlinedIcon from '@mui/icons-material/ModelTrainingOutlined';
// Components
import {
    Grid, Typography, Link, Box,
    CardContent, ListItem, List, Divider
} from '@mui/material';
import { CardWrapper } from '../../components/CardWrapper'
import LinkIcon from '../../components/LinkIcon';
// Translation
import { useTranslation } from 'react-i18next';
// React Router DOM
import { useParams, useNavigate } from 'react-router-dom';

const ActivityPanel = ({ activities }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { userId } = useParams();
    console.log("Load: ", activities);

    return (
        <List sx={{ width: "100%" }}>
            {activities.map((activity, index) => (
                <React.Fragment key={index}>
                    {/* Time */}
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
                                                <ListItem key={subIndex} sx={{ mt: 0.7, my: 0.5, paddingY: 0, display: "block" }}>
                                                    {type === "create_comment" ? (
                                                        <>
                                                            {/* Comment ID with Divider */}
                                                            <Typography
                                                                variant="caption"
                                                                fontWeight="bold"
                                                                color="comment"
                                                                sx={{ display: "flex", alignItems: "center" }}
                                                                onClick={() => navigate(`/${userId}/scripts/${item.script_id}/code`)}
                                                            >
                                                                {item.script_name}
                                                                <Divider sx={{ flexGrow: 1, mx: 1, backgroundColor: "comment.main" }} />
                                                            </Typography>

                                                            {/* Comment Content */}
                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary"

                                                                sx={{ mt: 0.5 }}>
                                                                {item.content}
                                                            </Typography>
                                                        </>
                                                    ) : (
                                                        <Typography
                                                            variant="body2"
                                                            color={color || "text.secondary"}
                                                            onClick={() => {
                                                                const link = type == "create_script" ? `/${userId}/scripts/${item._id}/code`
                                                                    : `/${userId}/models/${item._id}/code`
                                                                navigate(link);
                                                            }}
                                                        >
                                                            {item.name}
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
    );
}

export {
    ActivityPanel
};