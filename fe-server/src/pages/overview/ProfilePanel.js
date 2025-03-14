// Icons
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
// Components
import {
    Link, Box, Typography, Grid, Button, Avatar,
} from '@mui/material';
import { CardWrapper } from '../../components/CardWrapper'
import LinkIcon from '../../components/LinkIcon';
// Translation
import { useTranslation } from 'react-i18next';
// React Router DOM
import { useParams } from 'react-router-dom';

const ProfilePanel = ({ profile }) => {

    const { t } = useTranslation();
    const { userId } = useParams();

    return (
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
            <Grid item m={2} xs={12} md={12}>
                {/*Username*/}
                <Typography
                    variant="h4"
                    mt={1} mb={1}
                    sx={{ fontWeight: 'bold' }}
                >
                    {profile?.username ? profile.username : null}
                </Typography>
                {/*Bio*/}
                <Typography
                    variant="body2"
                    mt={1} mb={1}
                >
                    {profile?.bio ? profile.bio : null}
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
                        <PersonOutlineOutlinedIcon color="text.secondary" />
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
                {localStorage.getItem("userId") == userId ? 
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
                : null}
            </Grid>
        </CardWrapper>
        );
}

export {
    ProfilePanel
};