import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Paper,
  Typography,
  Stack,
  Avatar,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Modal,
  Box,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ScriptSubCommentItem from "./ScriptSubCommentItem";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import ReplyIcon from "@mui/icons-material/Reply";
import HistoryIcon from "@mui/icons-material/History";
import { formatDate } from "../FormatTime";
import { useTranslation } from "react-i18next";
import { useFetchSubComments } from "../../hooks/useFetchComment";
import commentApi from "../../api/commentAPI";
import { darkTheme } from "../../theme";
const ScriptCommentItem = ({
  comment,
  handleReply,
  handleEdit,
  getAllComments,
  setSnackbarMessage,
  setSnackbarOpen,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { userId, scriptId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  //   const [allSubComments, setAllSubComments] = useState([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const { data: allSubComments, setData: setAllSubComments } =
    useFetchSubComments(userId, scriptId, comment._id);

  useEffect(() => {
    if (comment.owner_id._id === localStorage.getItem("userId")) {
      setIsOwner(true);
    }
  }, [comment]);

  const getAllSubComments = async (commentId) => {
    try {
      const response = await commentApi.getAllSubComments(
        userId,
        scriptId,
        commentId
      );
      setAllSubComments(response);
      console.log("Sub comment", response);
    } catch (error) {
      console.error("Error getting subcomments:", error);
    }
  };

  //   useEffect(() => {
  //     if (!scriptInfo?.owner_id || !scriptInfo?._id) return;
  //     getAllSubComments();
  //   }, [scriptInfo?.owner_id, scriptInfo?._id]);

  const handleSaveEdit = async () => {
    await handleEdit(comment, editedContent);
    await getAllSubComments(comment._id);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedContent(comment.content);
    setIsEditing(false);
  };

  const handleSendReply = async () => {
    await handleReply(comment, replyContent);
    await getAllSubComments(comment._id);
    setReplyContent("");
    setIsReplying(false);
  };

  const confirmDelete = (comment) => {
    setCommentToDelete(comment);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!commentToDelete) return;
    try {
      await commentApi.deleteComment(userId, scriptId, commentToDelete._id);
      await getAllComments();
      await getAllSubComments(comment._id);

      setDeleteModalOpen(false);
      setCommentToDelete(null);

      // Show Snackbar on success
      setSnackbarMessage(t("delete-comment.success"));
      setSnackbarOpen(true); // Open Snackbar
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await commentApi.getCommentHistory(
        userId,
        scriptId,
        comment._id
      );
      setHistory(response);
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
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar alt="User Avatar" src={comment.owner_id.profile_image} />

        {/* <Avatar sx={{ bgcolor: "#1976d2", fontSize: 16 }}>
          {usernames[comment.owner_id]?.charAt(0).toUpperCase() || (
            <PersonIcon />
          )}
        </Avatar> */}

        <Stack spacing={0.5} sx={{ flex: 1 }}>
          <Typography variant="body1" fontWeight="bold">
            {comment.owner_id.username || "Unknown User"}
          </Typography>

          {isEditing ? (
            <Stack direction="row" alignItems="center" spacing={1}>
              <TextField
                fullWidth
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                size="small"
                autoFocus
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: theme.palette.text.primary }, // Border color
                    "&:hover fieldset": {
                      borderColor: theme.palette.text.primary,
                    }, // Hover effect
                    "&.Mui-focused fieldset": {
                      borderColor: theme.palette.text.primary,
                    }, // Focus effect
                  },
                  "& .MuiInputBase-input": {
                    color: theme.palette.text.primary, // Text color
                    padding: "8px 10px",
                  },
                  "& .MuiInputLabel-root": {
                    color: theme.palette.text.secondary, // Default label color
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: theme.palette.text.primary, // Label color when focused
                  },
                }}
              />
              {editedContent !== comment.content && (
                <IconButton onClick={handleSaveEdit} color="success">
                  <DoneIcon />
                </IconButton>
              )}

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
              <IconButton onClick={() => setIsReplying(!isReplying)}>
                <ReplyIcon />
              </IconButton>
              {isOwner && (
                <>
                  <IconButton onClick={() => setIsEditing(true)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => confirmDelete(comment)}>
                    <DeleteIcon />
                  </IconButton>
                </>
              )}
            </>
          )}
        </Stack>
      </Stack>

      {/* Reply Input Field */}
      {isReplying && (
        <Stack spacing={1} sx={{ pl: 6 }}>
          <TextField
            fullWidth
            variant="outlined"
            label={t("Reply")}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            size="small"
            multiline
            sx={{
              width: "100%",
              backgroundColor: theme.palette.background.default, // Match theme background
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: theme.palette.text.primary }, // Border color
                "&:hover fieldset": {
                  borderColor: theme.palette.text.primary,
                }, // Hover effect
                "&.Mui-focused fieldset": {
                  borderColor: theme.palette.text.primary,
                }, // Focus effect
              },
              "& .MuiInputBase-input": {
                color: theme.palette.text.primary, // Text color
              },
              "& .MuiInputLabel-root": {
                color: theme.palette.text.secondary, // Default label color
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: theme.palette.text.primary, // Label color when focused
              },
            }}
          />
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              onClick={handleSendReply}
              sx={{
                borderColor: theme.palette.text.primary,
                color: theme.palette.text.primary,
                "&:hover": {
                  backgroundColor: theme.palette.background.trans_black,
                },
              }}
            >
              {t("Send")}
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setIsReplying(false);
                setReplyContent("");
              }}
              sx={{
                color: theme.palette.text.primary,
                borderColor: theme.palette.text.primary,
                "&:hover": {
                  backgroundColor: theme.palette.background.trans_black,
                },
              }}
            >
              {t("Cancel")}
            </Button>
          </Stack>
        </Stack>
      )}

      {/* Show Replies Button */}
      {allSubComments?.length > 0 && (
        <Stack spacing={1} sx={{ pl: 6, mt: 1 }}>
          <Button
            onClick={() => setShowReplies(!showReplies)}
            variant="text"
            size="small"
            sx={{
              color: theme.palette.text.primary,
            }}
          >
            {showReplies
              ? t("sub-comment.hide_reply")
              : t("sub-comment.show_reply")}{" "}
            ({allSubComments?.length})
          </Button>

          {showReplies &&
            allSubComments?.map((reply) => (
              <ScriptSubCommentItem
                key={reply._id}
                comment={reply}
                handleEdit={handleEdit}
                confirmDelete={confirmDelete}
                getAllSubComments={getAllSubComments}
              />
            ))}
        </Stack>
      )}

      {/* History Modal */}
      <Dialog open={historyOpen} onClose={() => setHistoryOpen(false)}>
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

      {/* Delete Confirmation Modal */}
      <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 3,
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" gutterBottom>
            {t("delete-comment.title")}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {t("delete-comment.content")}
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            sx={{ mt: 2 }}
          >
            <Button
              variant="outlined"
              onClick={() => setDeleteModalOpen(false)}
              sx={{
                color: theme.palette.text.primary, // Adjust text color
                borderColor: theme.palette.primary.main, // Border color
                "&:hover": {
                  borderColor: theme.palette.secondary.main, // Border color on hover
                  backgroundColor: theme.palette.background.trans_black, // Light transparent effect
                },
              }}
            >
              {t("button.cancel")}
            </Button>

            <Button
              variant="contained"
              color="error"
              onClick={handleDelete}
              sx={{
                color: theme.palette.text.default_white, // Ensures contrast
                backgroundColor: theme.palette.error.main, // Primary error color
                "&:hover": {
                  backgroundColor: theme.palette.error.dark, // Darker shade on hover
                },
              }}
            >
              {t("button.delete")}
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Paper>
  );
};

export default ScriptCommentItem;
