// Import components
import {
    Grid, Avatar, Typography, Link, Button, Box
} from '@mui/material';
import LinkIcon from '../components/LinkIcon';
// Icons
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
// Translation
import { useTranslation } from 'react-i18next';

const Overview = () => {

    const { t } = useTranslation();

    const profile = {
        username: "KatBOT",
        follower: 2,
        following: 5,
        link: [
            { type: "link", link: "https://yotube"},
            { type: "link", link: "https://meo" },
            { type: "mail", link: "katbot345@gmail.com" },
        ]
    }

    return (
        <div className="main-content">
            <Grid container alignItems="center" mt={1} mb={1}>
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
                    {profile?.link ? profile.link.map((item, index) => {
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
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Button
                            variant="contained"
                            size="small"
                            color="success"
                            sx={{ flexGrow: 1, mt: 2 }}
                        >
                            {t("button.edit_profile")}
                        </Button>
                    </Box>
                    
                </Grid>
                <Grid item xs={9}>
                    Contribution...
                </Grid>
            </Grid>
        </div>
    );
}

export default Overview;