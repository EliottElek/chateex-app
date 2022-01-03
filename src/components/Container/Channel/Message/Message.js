import React, { useContext, useState } from "react";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import {
  ListItem,
  Typography,
  IconButton,
  Modal,
  Box,
  Button,
  Paper,
  Tooltip,
  InputBase,
} from "@mui/material";
import AddReactionIcon from "@mui/icons-material/AddReaction";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import ReactMarkdown from "react-markdown";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import "./Message.css";
import Picker from "emoji-picker-react";
import Popover from "@mui/material/Popover";
import StyledAvatar from "../../../StyledAvatar/StyledAvatar";
import axios from "axios";
import { Context } from "../../../Context/Context";
import ClearIcon from "@mui/icons-material/Clear";

const styles = {
  message: {
    padding: "0px 12px 0px 12px",
    background: "#424242",
    opacity: "0.9",
  },
  title: {
    color: "#6588DE",
    fontWeight: "bold",
  },
  deletedContent: {
    padding: 0,
    marginTop: 4,
    color: "#d6d8d9",
    fontWeight: "200",
    fontSize: "0.9rem",
    width: "100%",
    display: "flex",
    fontStyle: "italic",
  },
  content: {
    padding: 0,
    margin: 0,
    color: "#d6d8d9",
    fontWeight: "200",
    width: "100%",
    display: "flex",
    alignItems: "flex-end",
  },
  item: {
    margin: 0,
    cursor: "pointer",
    padding: "0px 6px 0px 12px!important",
    background: "transparent",
    width: "100%",
  },
  time: {
    color: "#fefefe",
    fontSize: "0.7em",
  },
  timeTransparent: {
    color: "transparent",
    fontSize: "0.7em",
  },
  reactCont: {
    margin: "0px 0px -5px 8px",
    color: "#d6d8d9",
    height: "auto",
    minWdth: "40px",
    borderRadius: "3px",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  modal: {
    color: "#fefefe",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    maxHeight: "70%",
    overflowY: "auto",
    bgcolor: "rgba(0,0,0,0.5)",
    borderRadius: "8px",
    boxShadow: 24,
    p: 4,
  },
  input: {
    width: "100%",
    height: "auto",
    borderRadius: "4px",
    margin: "auto",
    border: "none",
    outline: "none!important",
    background: "rgba(0,0,0,0.5)",
    color: "#D9E2EC",
    // paddingLeft: "10px",
    // paddingRight: "10px",
    marginTop: "3px",
    marginBottom: "3px",
    underline: "none!important",
    borderBottom: "none!important",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    // width: { xs: "85%", sm: "95%" },
  },
};

const Message = ({ message, newUser }) => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newContent, setNewContent] = useState(message.content);
  const [hover, toggleHover] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElEmoji, setAnchorElEmoji] = React.useState(null);
  const {
    user,
    members,
    channel,
    setMessages,
    messages,
    setSnackBarMessage,
    setOpenSnack,
  } = useContext(Context);
  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const id = hover ? "simple-popover" : undefined;

  const open = Boolean(anchorEl);
  ////////////////////////////////////////////////////////////
  const handlePopoverOpenEmoji = (event) => {
    setAnchorElEmoji(event.currentTarget);
  };
  const onEmojiClick = (event, emojiObject) => {
    const reaction = {
      reaction: emojiObject?.emoji,
      author: user.id,
    };
    handleAddReaction(reaction);
    setAnchorElEmoji(null);
    handlePopoverClose();
  };
  const handlePopoverCloseEmoji = () => {
    setAnchorElEmoji(null);
  };
  const idEmoji = anchorElEmoji ? "simple-popover" : undefined;

  const openEmoji = Boolean(anchorElEmoji);

  const handleModifyMessage = async (e) => {
    e.preventDefault();
    try {
      const { data: mess } = await axios.put(
        `${process.env.REACT_APP_API_URL}/channels/${channel.id}/messages/${message.id}`,
        { content: newContent }
      );
      message.content = newContent;
      message.modified = true;
      const newMessages = messages;
      newMessages[newMessages.findIndex((x) => x.id === message.id)] = mess;
      setMessages(newMessages);
      setEditMode(false);
      setSnackBarMessage({
        success: true,
        message: `Message was successfully modified.`,
      });
    } catch (err) {
      setSnackBarMessage({
        success: false,
        message: `Could not modify message. Try again mater.`,
      });
    }
    setOpenSnack(true);
  };
  const handleAddReaction = async (react) => {
    try {
      //when we add a new reaction
      if (!message.reactions) {
        //if there's not an array of reactions yet
        message.reactions = [react];
      }
      //else if there's already a reaction
      else {
        //we need to check if the user wanting to add a reaction has already reacted before
        const index = message.reactions.findIndex(
          (reaction) => reaction.author === user.id
        );
        if (index !== -1) {
          //if we find out that he already has reacted
          message.reactions[index] = react;
        } else message.reactions = [...message.reactions, react];
      }
      const newMessages = messages;
      newMessages[newMessages.findIndex((x) => x.id === message.id)] = message;
      setMessages(newMessages);
      await axios.put(
        `${process.env.REACT_APP_API_URL}/channels/${channel.id}/messages/${message.id}/react`,
        { reactions: message.reactions }
      );
    } catch (err) {
      console.log(err);
      setSnackBarMessage({
        success: false,
        message: `Could not add reaction. Try again later`,
      });
      setOpenSnack(true);
    }
  };
  const handleRemoveReaction = async () => {
    try {
      const reactions = message.reactions;
      const newReactions = reactions.filter(
        (reaction) => reaction.author !== user.id
      );
      message.reactions = newReactions;
      const newMessages = messages;
      newMessages[newMessages.findIndex((x) => x.id === message.id)] = message;
      setMessages(newMessages);
      await axios.put(
        `${process.env.REACT_APP_API_URL}/channels/${channel.id}/messages/${message.id}/react`,
        { reactions: message.reactions }
      );
    } catch (err) {
      console.log(err);
    }
  };
  const handleDeleteMessage = async () => {
    try {
      const { data: mess } = await axios.delete(
        `${process.env.REACT_APP_API_URL}/channels/${channel.id}/messages/${message.id}`
      );
      const newMessages = messages;
      newMessages[newMessages.findIndex((x) => x.id === message.id)] = mess;
      setMessages(newMessages);
      message.content = mess.content;
      message.deleted = true;
      message.reaction = null;
      setOpenDeleteModal(false);
      setSnackBarMessage({
        success: true,
        message: `Message was successfully deleted.`,
      });
    } catch (err) {
      setSnackBarMessage({
        success: false,
        message: `Could not modify message. Try again mater.`,
      });
      setOpenSnack(true);
    }
  };
  return (
    <div>
      <ListItem
        onClick={!editMode && handlePopoverOpen}
        onMouseEnter={() => toggleHover(true)}
        onMouseLeave={() => toggleHover(false)}
        className="message"
        alignItems="flex-start"
        sx={styles.item}
        key={message.id}
      >
        <ListItemAvatar sx={{ height: "100%" }}>
          {newUser && message.author === user.id && (
            <StyledAvatar user={user}></StyledAvatar>
          )}
          {newUser && message.author !== user.id && (
            <StyledAvatar
              user={members?.find((other) => other.id === message?.author)}
            ></StyledAvatar>
          )}
        </ListItemAvatar>
        {!editMode ? (
          <ListItemText
            style={{ height: "auto", padding: 0, margin: 0 }}
            primary={
              <>
                {newUser && message.author === user.id && (
                  <Typography
                    variant="body3"
                    style={styles.title}
                    className="name"
                  >
                    {user?.firstname} {user?.lastname}
                  </Typography>
                )}
                {newUser && message.author !== user.id && (
                  <Typography
                    variant="body3"
                    style={styles.title}
                    className="name"
                  >
                    {members.find((other) => other.id === message.author)
                      ? members?.find((other) => other.id === message?.author)
                          ?.firstname
                      : "User"}{" "}
                    {
                      members?.find((other) => other.id === message?.author)
                        ?.lastname
                    }
                  </Typography>
                )}
              </>
            }
            secondary={
              <Typography
                component="div"
                style={{
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                {message.deleted ? (
                  <Typography
                    component={"div"}
                    variant="body1"
                    style={styles.deletedContent}
                  >
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </Typography>
                ) : (
                  <Typography
                    id={message.id}
                    component={"div"}
                    variant="body1"
                    style={styles.content}
                  >
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                    {message.modified && (
                      <Typography
                        variant="caption"
                        style={{ fontSize: "0.7rem", marginLeft: "3px" }}
                      >
                        {" "}
                        (modified)
                      </Typography>
                    )}
                    {message.reactions && message.reactions.length > 0 && (
                      <Tooltip
                        title={
                          <React.Fragment>
                            <div>
                              {message.reactions.map((reaction, i) => (
                                <Typography
                                  key={i}
                                  variant="body1"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <span
                                    style={{
                                      marginRight: "3px",
                                      fontSize: "1.3rem",
                                    }}
                                  >
                                    {reaction.reaction}
                                  </span>
                                  {members.find(
                                    (other) => other.id === reaction.author
                                  )
                                    ? members?.find(
                                        (other) => other.id === reaction?.author
                                      )?.firstname
                                    : "User"}
                                  {user.id === reaction.author && (
                                    <IconButton onClick={handleRemoveReaction}>
                                      <ClearIcon style={{ color: "#fdfdfd" }} />
                                    </IconButton>
                                  )}
                                  <br />
                                </Typography>
                              ))}
                            </div>
                          </React.Fragment>
                        }
                      >
                        <div style={styles.reactCont}>
                          <Typography
                            variant={"body1"}
                            sx={{ color: "#fdfdfd", display: "flex" }}
                          >
                            {message.reactions.map(
                              (reaction) => reaction.reaction
                            )}{" "}
                            {message.reactions.length}
                          </Typography>
                        </div>
                      </Tooltip>
                    )}
                  </Typography>
                )}
                {hover ? (
                  <Tooltip title="Click to show actions" arrow followCursor>
                    <Typography style={styles.time} variant="body2">
                      {new Date(message.creation).getHours() +
                        ":" +
                        new Date(message.creation).getMinutes()}
                    </Typography>
                  </Tooltip>
                ) : (
                  <Tooltip title="Click to show actions" arrow followCursor>
                    <Typography style={styles.timeTransparent} variant="body2">
                      {new Date(message.creation).getHours() +
                        ":" +
                        new Date(message.creation).getMinutes()}
                    </Typography>
                  </Tooltip>
                )}
              </Typography>
            }
          />
        ) : (
          <div style={{ width: "100%" }}>
            <Paper elevation={0} sx={styles.input}>
              <form onSubmit={handleModifyMessage} style={{ width: "100%" }}>
                <InputBase
                  fullWidth
                  autoFocus
                  sx={{ color: "#b9bbbe" }}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                />
              </form>
            </Paper>
          </div>
        )}
      </ListItem>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        style={{ marginLeft: "-120px" }}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {!editMode && message.deleted && (
          <Typography
            style={{ padding: "3px", color: "#fefefe" }}
            variant="caption"
          >
            Deleted.
          </Typography>
        )}
        {!editMode && !message.deleted ? (
          <div style={{ display: "flex" }}>
            <IconButton
              onClick={handlePopoverOpenEmoji}
              disabled={message.deleted ? true : false}
            >
              <AddReactionIcon
                fontSize="small"
                style={{ bgcolor: "#2f3136", color: "#fefefe" }}
              />
            </IconButton>
            {user.id === message.author && (
              <>
                <IconButton
                  onClick={() => {
                    setEditMode(true);
                    handlePopoverClose();
                  }}
                >
                  <EditIcon
                    fontSize="small"
                    style={{ bgcolor: "#2f3136", color: "#fefefe" }}
                  />
                </IconButton>
                <IconButton onClick={() => setOpenDeleteModal(true)}>
                  <DeleteForeverIcon
                    fontSize="small"
                    style={{ color: "#fefefe" }}
                  />
                </IconButton>
              </>
            )}
          </div>
        ) : (
          !message.deleted && (
            <div style={{ display: "flex" }}>
              <IconButton onClick={handleModifyMessage}>
                <CheckCircleIcon
                  fontSize="small"
                  style={{ bgcolor: "#2f3136", color: "#fefefe" }}
                />
              </IconButton>
              <IconButton
                onClick={() => {
                  setEditMode(false);
                }}
              >
                <CancelIcon
                  fontSize="small"
                  style={{
                    bgcolor: "#2f3136",
                    color: "#fefefe",
                  }}
                />
              </IconButton>
            </div>
          )
        )}
      </Popover>
      <Popover
        id={idEmoji}
        open={openEmoji}
        anchorEl={anchorElEmoji}
        onClose={handlePopoverCloseEmoji}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Picker onEmojiClick={onEmojiClick} />
      </Popover>
      <Modal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styles.modal}>
          <Typography>
            Are you sure you want to delete this message ?
          </Typography>
          <Typography variant="caption">
            Other users will be alerted.
          </Typography>
          <div
            style={{
              display: "flex",
              marginTop: "20px",
              justifyContent: "space-between",
            }}
          >
            <Button onClick={handleDeleteMessage} variant="contained">
              Delete
            </Button>
            <Button onClick={() => setOpenDeleteModal(false)}>Cancel</Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default Message;
