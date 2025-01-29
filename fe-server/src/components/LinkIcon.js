import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';

const LinkIcon = ({ type }) => {
    if (type === "link") return <LinkOutlinedIcon />;
    else if (type === "mail") return <EmailOutlinedIcon />;
    else return null;
}

export default LinkIcon;