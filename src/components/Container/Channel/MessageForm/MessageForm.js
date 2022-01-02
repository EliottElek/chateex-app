import React, { useState } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import GifSharpIcon from "@mui/icons-material/GifSharp";
import AddReactionSharpIcon from "@mui/icons-material/AddReactionSharp";
import Popover from "@mui/material/Popover";
import Paper from "@mui/material/Paper";
import { Modal, Box } from "@mui/material";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import getCurrentTime from "../../../../functions/time";
import EmojiPicker from "emoji-picker-react";
import GiphyPicker from "react-giphy-picker";
import { useContext } from "react";
import { Context } from "../../../Context/Context";
import axios from "axios";
import { sendMessage } from "../../../../App";
import { Typography } from "@mui/material";
import DragnDrop from "./DragnDrop";
import getBase64 from "../../../../functions/dist/base64";
const { v4: uuid } = require("uuid");
const styles = {
  input: {
    height: "40px",
    borderRadius: "10px",
    margin: "auto",
    border: "none",
    outline: "none!important",
    background: "rgba(0,0,0,0.4)",
    color: "#D9E2EC",
    paddingLeft: "10px",
    paddingRight: "10px",
    underline: "none!important",
    borderBottom: "none!important",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: { xs: "85%", sm: "95%" },
  },
  icon: {
    color: "#f5f5f5",
  },
  modal: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#fefefe",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    maxHeight: "70%",
    overflowY: "auto",
    bgcolor: "rgba(0,0,0,0.6)",
    borderRadius: "8px",
    boxShadow: 24,
    p: 4,
  },
};

const MessageForm = () => {
  const { user, channel, setSnackBarMessage, setOpenSnack, image } =
    useContext(Context);
  const [anchorElEmoji, setanchorElEmoji] = useState(null);
  const [anchorELGif, setanchorELGif] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const onFileChange = (files) => {
    setFiles(files);
    console.log(files);
  };
  const onFileSubmit = () => {
    try {
      for (let i = 0; i < files.length; i++) {
        getBase64(files[i])
          .then(async (result) => {
            var today = getCurrentTime();
            try {
              const { data: message } = await axios.post(
                `http://localhost:3001/channels/${channel.id}/messages`,
                {
                  id: uuid(),
                  channelId: channel.id,
                  content: `![Media](${result})`,
                  author: user.id,
                  creation: today.toString(),
                  media: true,
                }
              );
              console.log(message);
              //addMessage(message);
              sendMessage(message);
              setContent("");
            } catch (err) {
              console.log(err);
            }
          })
          .catch((e) => {
            console.log(e);
            setSnackBarMessage({
              success: false,
              message: "Could not upload this file. Try again later.",
            });
            setOpenSnack(true);
          });
      }
    } catch (err) {
      setSnackBarMessage({
        success: false,
        message: "Could not upload this file. Try again later.",
      });
      setOpenSnack(true);
    }
  };
  const onEmojiClick = (event, emojiObject) => {
    emojiObject && setContent(content + emojiObject?.emoji);
  };
  const onGifSelected = async (gifObject) => {
    try {
      var today = getCurrentTime();
      const { data: message } = await axios.post(
        `http://localhost:3001/channels/${channel.id}/messages`,
        {
          id: uuid(),
          channelId: channel.id,
          content: `![Gif](${gifObject.downsized.url})`,
          author: user.id,
          creation: today.toString(),
          media: true,
        }
      );
      //addMessage(message);
      setanchorELGif(null);
      sendMessage(message);
      setContent("");
    } catch {
      setSnackBarMessage({
        success: false,
        message: "Could not send this GIF. Try again later.",
      });
      setOpenSnack(true);
    }
  };
  const handleOpenEmojiPopper = (event) => {
    setanchorElEmoji(event.currentTarget);
  };
  const handleOpenGifPopper = (event) => {
    setanchorELGif(event.currentTarget);
  };

  const handleCloseEmojiPopper = () => {
    setanchorElEmoji(null);
  };
  const handleCloseGifPopper = () => {
    setanchorELGif(null);
  };
  const idEmoji = anchorElEmoji ? "simple-popover" : undefined;
  const idGif = anchorELGif ? "simple-popover" : undefined;
  const openEmoji = Boolean(anchorElEmoji);
  const openGif = Boolean(anchorELGif);
  const handleChange = (e) => {
    setContent(e.target.value);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    if (content !== "") {
      var today = getCurrentTime();
      e.preventDefault();
      try {
        const { data: message } = await axios.post(
          `http://localhost:3001/channels/${channel.id}/messages`,
          {
            id: uuid(),
            channelId: channel.id,
            content: content,
            author: user.id,
            creation: today.toString(),
          }
        );
        //addMessage(message);
        sendMessage(message);
        setContent("");
      } catch {
        setSnackBarMessage({
          success: false,
          message: "Could not connect to server",
        });
        setOpenSnack(true);
      }
    }
  };
  return (
    <>
      <form
        onSubmit={onSubmit}
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          background: image ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.3)",
        }}
      >
        <Paper elevation={0} sx={styles.input}>
          <IconButton
            onClick={() => setOpenModal(true)}
            disabled={channel.name === undefined ? true : false}
            sx={{ p: "10px", color: "#b9bbbe" }}
          >
            <AddCircleIcon />
          </IconButton>
          <InputBase
            autoFocus
            sx={{ flexGrow: 1, color: "#b9bbbe" }}
            disabled={channel.name === undefined ? true : false}
            placeholder={
              channel.name !== undefined
                ? `Send a message to #${channel.name}`
                : "Choose a channel on the left pannel."
            }
            value={content}
            onChange={handleChange}
          />
          <IconButton
            onClick={handleOpenGifPopper}
            disabled={channel.name === undefined ? true : false}
            sx={{ p: "10px", color: "#b9bbbe" }}
          >
            <GifSharpIcon fontSize="large" />
          </IconButton>
          <IconButton
            disabled={channel.name === undefined ? true : false}
            sx={{ p: "10px", color: "#b9bbbe" }}
            onClick={handleOpenEmojiPopper}
          >
            <AddReactionSharpIcon />
          </IconButton>
        </Paper>
        <Popover
          id={idEmoji}
          open={openEmoji}
          anchorEl={anchorElEmoji}
          onClose={handleCloseEmojiPopper}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </Popover>
        <Popover
          id={idGif}
          open={openGif}
          anchorEl={anchorELGif}
          onClose={handleCloseGifPopper}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <GiphyPicker onSelected={onGifSelected} />
        </Popover>
      </form>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styles.modal}>
          <Typography variant="h6">Upload file</Typography>
          <Typography variant="caption">
            Browse your file system or drag and drop a file !
          </Typography>
          <DragnDrop
            onFileChange={(files) => onFileChange(files)}
            onFileSubmit={onFileSubmit}
            setOpenModal={setOpenModal}
          />
        </Box>
      </Modal>
    </>
  );
};
export default MessageForm;
