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
import { useFetchSubComments } from "../hooks/useFetchComment";
import commentApi from "../api/commentAPI";
const ScriptCommentItem = ({
  comment,
  usernames,
  handleReply,
  handleEdit,
  confirmDelete,
  scriptInfo,
  isSubComment,
}) => {
  const { t } = useTranslation();
  const { userId, scriptId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  //   const [allSubComments, setAllSubComments] = useState([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const { data: allSubComments, setData: setAllSubComments } =
    useFetchSubComments(userId, scriptId, comment._id);

  useEffect(() => {
    if (comment.owner_id === localStorage.getItem("userId")) {
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

  const handleSaveEdit = async () => {
    await handleEdit(comment, editedContent);
    if (isSubComment) {
      await getAllSubComments(comment.sub_comment_id);
    } else {
      getAllSubComments(comment._id);
    }
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

  //   useEffect(() => {
  //     if (!scriptInfo?.owner_id || !scriptInfo?._id) return;
  //     getAllSubComments();
  //   }, [scriptInfo?.owner_id, scriptInfo?._id]);

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
        <Avatar sx={{ bgcolor: "#1976d2", fontSize: 16 }}>
          {usernames[comment.owner_id]?.charAt(0).toUpperCase() || (
            <PersonIcon />
          )}
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
              {!isSubComment && (
                <IconButton onClick={() => setIsReplying(!isReplying)}>
                  <ReplyIcon />
                </IconButton>
              )}
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
            label={t("Reply")}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            size="small"
            multiline
          />
          <Stack direction="row" spacing={1}>
            <Button variant="contained" onClick={handleSendReply}>
              {t("Send")}
            </Button>
            <Button variant="outlined" onClick={() => setIsReplying(false)}>
              {t("Cancel")}
            </Button>
          </Stack>
        </Stack>
      )}

      {/* Show Replies Button */}
      {allSubComments?.length > 0 && !isSubComment && (
        <Stack spacing={1} sx={{ pl: 6, mt: 1 }}>
          <Button
            onClick={() => setShowReplies(!showReplies)}
            variant="text"
            size="small"
          >
            {showReplies
              ? t("sub-comment.hide_reply")
              : t("sub-comment.show_reply")}{" "}
            ({allSubComments?.length})
          </Button>

          {showReplies &&
            allSubComments?.map((reply) => (
              <ScriptCommentItem
                key={reply._id}
                comment={reply}
                usernames={usernames}
                handleReply={handleReply}
                handleEdit={handleEdit}
                confirmDelete={confirmDelete}
                scriptInfo={scriptInfo}
                isSubComment={true}
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
    </Paper>
  );
};

export default ScriptCommentItem;
