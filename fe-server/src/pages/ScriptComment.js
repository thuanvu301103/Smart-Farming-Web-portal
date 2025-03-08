import React, { useEffect, useState } from "react";
import {
  Grid,
  Box,
  List,
  ListItem,
  Stack,
  Snackbar,
  Alert,
  TextField,
  IconButton,
  Avatar,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import ScriptCommentItem from "../components/comment/ScriptCommentItem";
//Import icon
import SendIcon from "@mui/icons-material/Send";
import PersonIcon from "@mui/icons-material/Person";
import { useFetchScriptInfo } from "../hooks/useFetchScript";
import { useFetchComments } from "../hooks/useFetchComment";
import userApi from "../api/userAPI";
import commentApi from "../api/commentAPI";
const ScriptComment = () => {
  const { t } = useTranslation();
  const { userId, scriptId } = useParams();
  //   const [allComments, setAllComments] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar state
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Snackbar message
  const [newComment, setNewComment] = useState(""); // State for new comment input

  const {
    data: scriptInfo,
    setData: setScriptInfo,
    loading: scriptInfoLoading,
    error: scriptInfoError,
  } = useFetchScriptInfo(userId, scriptId);

  const { data: allComments, setData: setAllComments } = useFetchComments(
    userId,
    scriptId
  );

  const getAllComments = async () => {
    try {
      const response = await commentApi.getAllComments(userId, scriptId);
      setAllComments(response);
    } catch (error) {
      console.error("Error getting comments:", error);
    }
  };

  //   useEffect(() => {
  //     if (!scriptInfo?.owner_id || !scriptInfo?._id) return;
  //     getAllComments();
  //   }, [scriptInfo?.owner_id, scriptInfo?._id]);

  // useEffect(() => {
  //   const fetchUsernames = async () => {
  //     const newUsernames = { ...usernames };
  //     for (const comment of allComments) {
  //       try {
  //         const user = await userApi.profile(comment.owner_id);
  //         newUsernames[comment.owner_id] = user.username;
  //       } catch (error) {
  //         console.error("Error getting username:", error);
  //       }
  //     }

  //     setUsernames(newUsernames);
  //   };

  //   if (allComments?.length > 0) fetchUsernames();
  // }, [allComments]);

  const handleEdit = async (comment, content) => {
    if (!content.trim()) return;
    try {
      const response = await commentApi.updateComment(
        userId,
        scriptId,
        comment._id,
        content
      );
      console.log("Update comment", response, content);

      await getAllComments();

      // Show Snackbar on success
      setSnackbarMessage(t("edit-comment.success"));
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error editing comment:", error);
      setSnackbarMessage(t("edit-comment.error"));
      setSnackbarOpen(true);
    }
  };

  const handleReply = async (comment, replyContent) => {
    if (!replyContent.trim()) return;

    const replyCommentData = {
      content: replyContent,
      ownerId: localStorage.getItem("userId"),
      subCommentId: comment._id,
      // owner_id: scriptInfo.owner_id,
    };

    try {
      const response = await commentApi.createComment(
        userId,
        scriptId,
        replyCommentData
      );
      console.log(response);

      await getAllComments();
    } catch (error) {
      console.error("Error sending reply:", error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const newCommentData = {
        content: newComment,
        ownerId: localStorage.getItem("userId"),
      };
      const response = await commentApi.createComment(
        userId,
        scriptId,
        newCommentData
      );
      console.log("New comment", response);
      setNewComment("");

      await getAllComments();

      // Show Snackbar on success
      setSnackbarMessage(t("add-comment.success"));
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error adding comment:", error);
      setSnackbarMessage(t("add-comment.error"));
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false); // Close Snackbar
  };

  return (
    <Box
      className="main-content"
      sx={{ width: "100%", maxWidth: "80vw", mx: "auto", p: 2 }}
    >
      <Grid container alignItems="start">
        <List sx={{ width: "100%" }}>
          {allComments?.map((comment, index) => (
            <ListItem key={index} sx={{ p: 0 }}>
              <ScriptCommentItem
                comment={comment}
                handleReply={handleReply}
                handleEdit={handleEdit}
                getAllComments={getAllComments}
                setSnackbarMessage={setSnackbarMessage}
                setSnackbarOpen={setSnackbarOpen}
              />
            </ListItem>
          ))}
        </List>
      </Grid>

      {/* Add Comment Section */}
      <Box sx={{ mt: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: "#1976d2", fontSize: 16 }}>
            {<PersonIcon />}
          </Avatar>
          <TextField
            label={t("add-comment.placeholder")}
            variant="outlined"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            multiline
            minRows={1}
            maxRows={6}
            sx={{ width: "100%" }}
          />
          <IconButton color="primary" onClick={handleAddComment} sx={{ mt: 2 }}>
            <SendIcon />
          </IconButton>
        </Stack>
      </Box>

      {/* Snackbar for Add/Delete Success */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ScriptComment;
