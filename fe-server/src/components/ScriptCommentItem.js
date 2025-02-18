import React, { useState } from "react";
import {
    Paper,
    Typography,
    Stack,
    Avatar,
    IconButton,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    List,
    ListItem,
    ListItemText,
    CircularProgress
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import ReplyIcon from "@mui/icons-material/Reply";
import HistoryIcon from "@mui/icons-material/History";
import { formatDate } from "../components/FormatTime";
import { useTranslation } from "react-i18next";
import axios from "axios";

const ScriptCommentItem = ({ comment, usernames, handleReply, handleEdit, confirmDelete, scriptInfo }) => {
    const { t } = useTranslation();
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);
    const [historyOpen, setHistoryOpen] = useState(false);
    const [history, setHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    const handleSaveEdit = () => {
        handleEdit(comment, editedContent);
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setEditedContent(comment.content);
        setIsEditing(false);
    };

    const fetchHistory = async () => {
        setLoadingHistory(true);
        try {
            const response = await axios.get(`http://localhost:3000/${scriptInfo.owner_id}/scripts/${scriptInfo._id}/comments/${comment._id}/history`);
            setHistory(response.data);

        } catch (error) {
            console.error("Error fetching editing history:", error);
        } finally {
            setLoadingHistory(false);
        }
    };

    const openHistoryModal = () => {
        setHistoryOpen(true);
        fetchHistory();
    };

    return (
        <Paper
            elevation={2}
            sx={{
                width: "100%",
                p: 2,
                borderRadius: 2,
                mb: 2,
                display: "flex",
                gap: 2,
                alignItems: "center",
            }}
        >
            <Avatar sx={{ bgcolor: "#1976d2", fontSize: 16 }}>
                {usernames[comment.owner_id]?.charAt(0).toUpperCase() || <PersonIcon />}
            </Avatar>

            <Stack spacing={0.5} sx={{ flex: 1 }}>
                <Typography variant="body1" fontWeight="bold">
                    {usernames[comment.owner_id] || "Unknown User"}
                </Typography>

                {isEditing ? (
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <TextField
                            fullWidth
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            size="small"
                            autoFocus
                        />
                        <IconButton onClick={handleSaveEdit} color="success">
                            <DoneIcon />
                        </IconButton>
                        <IconButton onClick={handleCancelEdit} color="error">
                            <CloseIcon />
                        </IconButton>
                    </Stack>
                ) : (
                    <>
                        <Typography variant="body2" color="text.secondary">
                            {comment.content}
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography variant="caption" color="text.disabled">
                                {formatDate(comment.updatedAt, t)}
                            </Typography>
                            <IconButton size="small" onClick={openHistoryModal}>
                                <HistoryIcon fontSize="small" />
                            </IconButton>
                        </Stack>
                    </>
                )}

                
            </Stack>

            <Stack direction="row" spacing={1}>
                {!isEditing && (
                    <>
                        <IconButton onClick={() => handleReply(comment)}>
                            <ReplyIcon />
                        </IconButton>
                        <IconButton onClick={() => setIsEditing(true)}>
                            <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => confirmDelete(comment)}>
                            <DeleteIcon />
                        </IconButton>
                    </>
                )}
            </Stack>

            <Dialog 
                open={historyOpen} 
                onClose={() => setHistoryOpen(false)} 
                sx={{ 
                    "& .MuiDialog-paper": { 
                    width: "fit-content", 
                    maxWidth: "90vw" // Prevents it from getting too large
                }}}
            >
                <DialogTitle>{t("edit-comment.history.title")}</DialogTitle>
                <DialogContent>
                    {loadingHistory ? (
                        <CircularProgress />
                    ) : (
                        <List>
                            {history.length > 0 ? (
                                history.map((entry) => (
                                    <ListItem key={entry._id}>
                                        <ListItemText
                                            primary={entry.changes.join(", ")}
                                            secondary={formatDate(entry.updatedAt, t)}
                                        />
                                    </ListItem>
                                ))
                            ) : (
                                <Typography>{t("edit-comment.history.no-data")}</Typography>
                            )}
                        </List>
                    )}
                </DialogContent>
            </Dialog>
        </Paper>
    );
};

export default ScriptCommentItem;
