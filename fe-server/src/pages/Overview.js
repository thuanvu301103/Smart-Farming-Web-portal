// Import components
import {
    Grid, Avatar, Typography, Link, Button, Box
} from '@mui/material';
import LinkIcon from '../components/LinkIcon';
import { ExpanableList } from '../components/List';
import { ActivityListItem } from '../components/ListItem';
// Icons
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
// Translation
import { useTranslation } from 'react-i18next';

const Overview = ({profile}) => {

    const { t } = useTranslation();
    const loading = false;

    const activities = [
        {
            time: "Jan 2025",
            activities: {
                create_script: ["#link1", "#link2"],
                create_model: ["#link1", "#link2"],
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
        <div className="main-content">
            <Grid container alignItems="start" mt={1} mb={1}>
                <Grid item xs={3}>
                    {/*Avatar*/}
                    <Avatar
                        alt="User's avatar"
                        src="/logo192.png"
                        sx={{ width: '85%', height: 'auto' }}
                        mt={1} mb={1}
                    />
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
                        <Grid item xs={6} container alignItems="center">
                            <PersonOutlineOutlinedIcon color="text.secondary"/>
                            <Typography variant="body2" sx={{ ml: 1 }} color="text.secondary">
                                {t("profile.follower")}: {profile?.follower ? profile?.follower : 0}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} container alignItems="center">
                            <RemoveRedEyeOutlinedIcon color="text.secondary"/>
                            <Typography variant="body2" sx={{ ml: 1 }} color="text.secondary">
                                {t("profile.following")}: {profile?.following ? profile?.following : 0}
                            </Typography>
                        </Grid>
                    </Grid>
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
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', ml: '2' }}>
                        <Button
                            variant="contained"
                            size="small"
                            color="success"
                            sx={{ flexGrow: 1, mt: 2, boxShadow: 'none' }}

                        >
                            {t("button.edit_profile")}
                        </Button>
                    </Box>
                    
                </Grid>
                <Grid item xs={9}>
                    <Box
                        sx={{
                            display: 'flex', flexDirection: 'column',
                            ml: 2, p: 2,
                        }}
                    >
                        {/*Activity Panel*/}
                        <Typography variant="h6" >
                            {t("overview.activity")}
                        </Typography>
                        <ExpanableList
                                ListItemComponents={ActivityListItem}
                                items={activities}
                                loading={loading}
                            />
                    </Box>
                </Grid>
            </Grid>
        </div>
    );
}

export default Overview;