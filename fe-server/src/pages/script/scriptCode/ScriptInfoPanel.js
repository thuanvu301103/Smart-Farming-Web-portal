// Import components
import {
    Typography,
    TextField,
    CardContent,
} from '@mui/material';
import { CardWrapper } from '../../../components/CardWrapper';
// Translation
import { useTranslation } from 'react-i18next';

const ScriptInfoPanel = ({formData, handleChange, error}) => {
    const { t } = useTranslation();

    return (
        <CardWrapper borderThickness="9px" borderSide="right" borderColor="info">
            <CardContent>
                {/*Script Name*/}
                <Typography
                    variant="body1" gutterBottom
                    fontWeight="bold"
                >
                    {t("new-script.script-name")}
                </Typography>
                {error && <Typography variant="body2" color="error" mb={2}>{t("new-script.no_name_err")}</Typography>}
                <TextField
                    id="script-name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    color="success"
                    variant="outlined"
                    size="small"
                    fullWidth
                />
                {/*Script Description*/}
                <Typography
                    variant="body1" gutterBottom
                    fontWeight="bold"
                    sx={{ mt: 1 }}
                >
                    {t("new-script.description")}
                </Typography>
                <TextField
                    fullWidth
                    multiline
                    id="description"
                    name="description"
                    color="success"
                    value={formData.description}
                    onChange={handleChange}
                    variant="outlined"
                    size="small"
                    rows={6}
                />

            </CardContent>
        </CardWrapper>
        );
}

export default ScriptInfoPanel;