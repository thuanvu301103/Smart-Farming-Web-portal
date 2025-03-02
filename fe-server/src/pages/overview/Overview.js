import React from 'react';
// Import components
import {
    Grid, Avatar, Typography, Link, Button, Box,
    Card, CardContent, ListItem, List, Divider
} from '@mui/material';
import LinkIcon from '../../components/LinkIcon';
import { ExpanableList } from '../../components/List';
import { ActivityListItem } from '../../components/ListItem';
import { CardWrapper } from '../../components/CardWrapper'
// Icons
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';

import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import ModelTrainingOutlinedIcon from '@mui/icons-material/ModelTrainingOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import TravelExploreOutlinedIcon from '@mui/icons-material/TravelExploreOutlined';
import { Stack } from '@mui/material';
// Translation
import { useTranslation } from 'react-i18next';

const Overview = ({ profile, topScripts }) => {

    const { t } = useTranslation();
    const loading = false;

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
                    <CardWrapper borderThickness="9px" borderSide="bottom">
                        <Grid container item justifyContent="center"
                            xs={3} md={11} m={2}
                        >
                            {/*Avatar*/}
                            <Avatar
                                alt="User's avatar"
                                src={profile?.profile_image ? profile.profile_image : null}
                                sx={{ width: '85%', height: 'auto' }}
                            />
                        </Grid>
                        <Grid item m={2} xs={8} md={12}>
                            {/*Username*/}
                            <Typography
                                variant="h4"
                                mt={1} mb={1}
                                sx={{ fontWeight: 'bold' }}
                            >
                                {profile?.username ? profile.username : null}
                            </Typography>
                            {/*Folower and Following*/}
                            <Grid container alignItems="center" mt={1} mb={1}>
                                <Grid item xs={6} md={12} container alignItems="center">
                                    <RemoveRedEyeOutlinedIcon color="text.secondary" />
                                    <Typography variant="body2" sx={{ ml: 1 }} color="text.secondary">
                                        {t("profile.following")}: {profile?.following ? profile?.following : 0}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} md={12} container alignItems="center">
                                    <PersonOutlineOutlinedIcon color="text.secondary"/>
                                    <Typography variant="body2" sx={{ ml: 1 }} color="text.secondary">
                                        {t("profile.follower")}: {profile?.follower ? profile?.follower : 0}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item m={2} xs={12} md={12}>
                            {/*Links*/}
                            {profile?.links ? profile.links.map((item, index) => {
                        return (
                            <Grid container alignItems="center" >
                                <Grid item xs={1} container alignItems="center">
                                    <LinkIcon type={item?.type ? item.type : null} />
                                </Grid>
                                <Grid item xs={11} container alignItems="center">
                                    <Link
                                        href={item?.link ? item.link : "#"}
                                        underline="hover"
                                        sx={{ ml: 1 }}
                                        color="info"
                                        size="caption"
                                    >
                                        {item?.link ? item.link : null}
                                    </Link>
                                </Grid>
                            </Grid>);
                    })
                                : null}
                            {/*Edit profile Button */}
                            <Box mt={2}>
                                <Button
                                    variant="contained"
                                    size="small"
                                    color="success"
                                    fullWidth
                                    sx={{ borderRadius: '8px' }}
                                >
                                    {t("button.edit_profile")}
                                </Button>
                            </Box>
                        </Grid>
                    </CardWrapper>
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
                                    <CardWrapper borderThickness="0px" borderSide="right" height="120px">
                                        <Typography variant="body1" m={2} color="success" sx={{ fontWeight: "bold" }}>
                                            {item.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" m={2}>
                                            {item.description}
                                        </Typography>
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
                                                <CardWrapper borderThickness="10px" borderSide="right" borderColor={color}>
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

                        {/*<ExpanableList
                            ListItemComponents={ActivityListItem}
                            items={activities}
                            loading={loading}
                        />*/}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Overview;