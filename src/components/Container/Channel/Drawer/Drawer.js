import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ReactMarkdown from "react-markdown";
import { CircularProgress, InputBase } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Context } from "../../../Context/Context";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import TimelineIcon from "@mui/icons-material/Timeline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Button, Modal } from "@mui/material";
import MemberItem from "./MemberItem";
import axios from "axios";
import DragnDrop from "../MessageForm/DragnDrop";
import StyledAvatar from "../../../StyledAvatar/StyledAvatar";
import getBase64 from "../../../../functions/dist/base64";
import shortString from "../../../../functions/string";
const styles = {
  root: {
    background: "transparent!important",
    width: "95%",
    padding: 0,
    margin: "1px auto 1px auto",
    borderRadius: "4px",
  },
  rootActive: {
    background: "#424242",
    width: "95%",
    padding: 0,
    margin: "1px auto 1px auto",
    borderRadius: "4px",
  },
  text: {
    color: "#8e9297",
  },
  item: {
    padding: 3,
  },
  deleteIcon: {
    color: "#8e9297",
    padding: 0,
    margin: 0,
  },
  input: {
    backgroundColor: "#36393e",
    color: "#f5f5f5",
    marginTop: "6px",
    marginBottom: "6px",
    padding: "8px",
    width: "100%",
    borderRadius: "6px",
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
    maxHeight: "80%",
    overflowY: "auto",
    bgcolor: "rgba(0,0,0,0.6)",
    borderRadius: "8px",
    boxShadow: 24,
    p: 4,
  },
  avatar: { marginLeft: 3, width: 30, height: 30 },
};
export default function SwipeableTemporaryDrawer({
  handleOpenAddPersonModal,
  openDrawer,
  setOpenDrawer,
}) {
  const {
    removeChannel,
    setChannel,
    channel,
    messages,
    members,
    setSnackBarMessage,
    user,
    onUser,
    channels,
    setOpenSnack,
    setCookie,
  } = React.useContext(Context);
  const onFileChange = (file) => {
    setFile(file);
    console.log(file);
  };
  const [file, setFile] = React.useState(null);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [openLeaveModal, setOpenLeaveModal] = React.useState(false);
  const [openModifModal, setOpenModifModal] = React.useState(false);
  const [name, setName] = React.useState();
  React.useEffect(() => {
    setName(channel.name);
  }, [channel.name]);
  const getMediasFromChannel = () => {
    return messages.filter(
      (message) => message?.media === true && !message.deleted
    );
  };
  const handleDeleteChannelAdmin = async () => {
    const chId = channel.id;
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/channels/${chId}`);
      removeChannel(channel);
      setCookie("channels", channels);
    } catch (err) {
      console.error(err);
    }
    //remove channel for user
    try {
      const newUser = user;
      // from array of objects to array of ids
      const newChannelsIds = channels.map((channel) => channel.id);
      newUser.channelsList = newChannelsIds;

      await axios.put(`${process.env.REACT_APP_API_URL}/users/${user.id}`, {
        user: newUser,
      });
      setSnackBarMessage({
        success: true,
        message: "This channel was successfully deleted.",
      });
    } catch (e) {
      console.error(e);
      setSnackBarMessage({
        success: false,
        message: "Could not delete this channel. Try again later.",
      });
    }
    //remove channel for every other users
    for (let i = 0; i < members.length; i++) {
      try {
        const newUser = members[i];
        var newList = newUser.channelsList.filter(function (u) {
          return u !== channel.id;
        });
        newUser.channelsList = newList;
        await axios.put(`${process.env.REACT_APP_API_URL}/users/${newUser.id}`, {
          user: newUser,
        });
        console.log(
          `Successfully removed ${channel.name} from ${newUser.firstname}`
        );
        setSnackBarMessage({
          success: true,
          message: `Successfully removed ${channel.name} from ${newUser.firstname}`,
        });
      } catch (err) {
        setSnackBarMessage({
          success: false,
          message: "Could not delete this channel. Try again later.",
        });
      }
    }
    setOpenDeleteModal(false);
    setOpenDrawer(false);
    setOpenSnack(true);
  };
  const onFileSubmit = () => {
    console.log(file[0]);
    try {
      getBase64(file[0])
        .then(async (result) => {
          handleModifyChannel(result);
        })
        .catch((e) => {
          console.log(e);
          setSnackBarMessage({
            success: false,
            message: "Could not upload this file. Try again later.",
          });
          setOpenSnack(true);
        });
    } catch (err) {
      setSnackBarMessage({
        success: false,
        message: "Could not upload this file. Try again later.",
      });
      setOpenSnack(true);
    }
  };
  const handleModifyChannel = async (file) => {
    try {
      if (file) channel.avatarUrl = file;
      channel.name = name;
      await axios.put(`${process.env.REACT_APP_API_URL}/channels/${channel.id}`, {
        channel: channel,
      });
      setChannel(channel);
      setSnackBarMessage({
        success: true,
        message: "Channel's infos successfully modifed.",
      });
      setOpenSnack(true);
    } catch (err) {
      setSnackBarMessage({
        success: false,
        message: "Could not modify this channel's infos. Try again later.",
      });
      setOpenSnack(true);
    }
    setOpenModifModal(false);
  };
  const handleLeaveChannel = async (use) => {
    const chId = channel.id;
    const newUser = use;
    //remove channel for user
    try {
      var newList = newUser.channelsList.filter(function (u) {
        return u !== chId;
      });
      newUser.channelsList = newList;
      await axios.put(`${process.env.REACT_APP_API_URL}/users/${newUser.id}`, {
        user: newUser,
      });
      onUser(newUser);
    } catch (e) {
      console.error(e);
      setSnackBarMessage({
        success: false,
        message:
          "Could not remove this channel from your list. Try again later.",
      });
      setOpenSnack(true);
    }
    //remove member from channel
    try {
      var newUsersList = channel.members.filter(function (u) {
        return u !== newUser.id;
      });
      channel.members = newUsersList;
      await axios.put(`${process.env.REACT_APP_API_URL}/channels/${chId}`, {
        channel: channel,
      });
      removeChannel(channel);
      setSnackBarMessage({
        success: true,
        message: "You successfully left the channel.",
      });
      setOpenSnack(true);
    } catch (err) {
      setSnackBarMessage({
        success: false,
        message:
          "Could not remove this channel from your list. Try again later.",
      });
      setOpenSnack(true);
    }
  };
  const countDeletedMessages = () => {
    var countDeletedMessages = 0;
    for (let i = 0; i < messages.length; i++) {
      if (messages[i].deleted) countDeletedMessages++;
    }
    return countDeletedMessages;
  };
  const countModifiedMessages = () => {
    var countModifiedMessages = 0;
    for (let i = 0; i < messages.length; i++) {
      if (messages[i].modified) countModifiedMessages++;
    }
    return countModifiedMessages;
  };
  const list = () => (
    <Box
      sx={{
        color: "#fefefe",
        bgcolor: "rgba(0,0,0,0.8)",
        flexGrow: 1,
        overflowY: "scroll",
        width: { xs: "100%", sm: 350 },
      }}
      onKeyDown={() => setOpenDrawer(false)}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "20px",
          background: "transparent!important",
        }}
      >
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={() => setOpenDrawer(false)}
          style={{ position: "absolute", left: 1, marginLeft: "8px" }}
          sx={{ mr: 2, display: { sm: "none" } }}
        >
          <ChevronLeftIcon fontSize="large" />
        </IconButton>{" "}
        <StyledAvatar size={100} font={"2rem"} user={channel} group={true} />
        {channel?.admin === user?.id && !channel.private && (
          <IconButton
            onClick={() => setOpenModifModal(true)}
            style={{
              marginTop: "-25px",
              backgroundColor: "#36393e",
              border: "solid 1px #f5f5f5",
            }}
          >
            <EditIcon sx={{ color: "#bdbdbd" }} />
          </IconButton>
        )}
        <Typography variant="h5">{shortString(channel.name, 15)}</Typography>
        <List sx={{ width: "100%" }}>
          <ListItem
            key={"members"}
            sx={{ width: "100%", margin: 0, padding: 1 }}
          >
            <Accordion
              style={{
                width: "100%",
                margin: 0,
                backgroundColor: "#f5f5f5!important",
              }}
            >
              <AccordionSummary
                style={{ backgroundColor: "#f5f5f5!important" }}
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                {!channel.private ? (
                  <Typography>Members ({members?.length})</Typography>
                ) : (
                  <Typography>Members (2)</Typography>
                )}
              </AccordionSummary>
              <AccordionDetails>
                {!members.length ? (
                  <CircularProgress />
                ) : (
                  <List key={"l"}>
                    {members?.map((member, index) => (
                      <MemberItem
                        member={member}
                        key={index}
                        index={index}
                        setOpenDrawer={setOpenDrawer}
                      />
                    ))}
                  </List>
                )}
              </AccordionDetails>
            </Accordion>
          </ListItem>
          <ListItem
            key={"statistics"}
            sx={{ width: "100%", margin: 0, padding: 1 }}
          >
            <Accordion
              style={{
                width: "100%",
                margin: 0,
                backgroundColor: "#f5f5f5!important",
              }}
            >
              <AccordionSummary
                style={{ backgroundColor: "#f5f5f5!important" }}
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Statistics</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  <ListItem
                    key={"messages"}
                    style={{
                      backgroundColor: "whitesmoke",
                      borderRadius: "5px",
                      padding: "5px",
                      margin: "4px",
                    }}
                  >
                    <ListItemIcon>
                      <TimelineIcon />
                    </ListItemIcon>
                    <ListItemText>
                      {messages?.length} sent message(s)
                    </ListItemText>
                  </ListItem>
                  <ListItem
                    key={"deletemessages"}
                    style={{
                      backgroundColor: "whitesmoke",
                      borderRadius: "5px",
                      padding: "5px",
                      margin: "4px",
                    }}
                  >
                    <ListItemIcon>
                      <HighlightOffIcon />
                    </ListItemIcon>
                    <ListItemText>
                      {countDeletedMessages()} deleted message(s)
                    </ListItemText>
                  </ListItem>
                  <ListItem
                    key={"modifiedmessages"}
                    style={{
                      backgroundColor: "whitesmoke",
                      borderRadius: "5px",
                      padding: "5px",
                      margin: "4px",
                    }}
                  >
                    <ListItemIcon>
                      <EditIcon />
                    </ListItemIcon>
                    <ListItemText>
                      {countModifiedMessages()} modified message(s)
                    </ListItemText>
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>
          </ListItem>
          <ListItem
            key={"medias"}
            sx={{ width: "100%", margin: 0, padding: 1 }}
          >
            <Accordion
              style={{
                width: "100%",
                margin: 0,
                backgroundColor: "#f5f5f5!important",
              }}
            >
              <AccordionSummary
                style={{ backgroundColor: "#f5f5f5!important" }}
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>
                  Medias ({getMediasFromChannel().length})
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {getMediasFromChannel().length !== 0 ? (
                    getMediasFromChannel().map((message) => (
                      <ListItem
                        key={message.id}
                        style={{
                          backgroundColor: "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "5px",
                          padding: "5px",
                          margin: "4px",
                        }}
                      >
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </ListItem>
                    ))
                  ) : (
                    <ListItem
                      key={"no message"}
                      style={{
                        backgroundColor: "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "5px",
                        padding: "5px",
                        margin: "4px",
                      }}
                    >
                      <Typography style={{ fontStyle: "italic" }}>
                        No media yet.
                      </Typography>
                    </ListItem>
                  )}
                </List>
              </AccordionDetails>
            </Accordion>
          </ListItem>
          {channel?.admin === user?.id && !channel.private && (
            <>
              <ListItem
                button
                onClick={handleOpenAddPersonModal}
                key={"addUser"}
                alignItems="center"
                sx={{
                  bgcolor: "#2e3136",
                  color: "#bdbdbd",
                }}
              >
                <ListItemIcon>
                  <PersonAddIcon sx={{ color: "#bdbdbd" }} />
                </ListItemIcon>
                <ListItemText primary={"Add a new member"} />
              </ListItem>
              {/* <ListItem
                button
                key={"manageAccess"}
                alignItems="center"
                sx={{
                  bgcolor: "#2e3136",
                  color: "#bdbdbd",
                  marginTop: "2px",
                }}
              >
                <ListItemIcon>
                  <SupervisorAccountIcon sx={{ color: "#bdbdbd" }} />
                </ListItemIcon>
                <ListItemText primary={"Manage access"} />
              </ListItem> */}
            </>
          )}
        </List>
        <Divider style={{ color: "red" }} variant="middle">
          DANGER ZONE
        </Divider>
        <List sx={{ width: "100%", color: "red", margin: 1 }}>
          {channel?.admin === user?.id && !channel.private ? (
            <>
              <ListItem key="typo">
                <Typography variant="caption">
                  You are an administrator of this channel. If you delete this
                  channel, other members will not be able to talk on it. Be
                  careful, the delete is definitive.
                </Typography>
              </ListItem>
              <ListItem
                onClick={() => setOpenDeleteModal(true)}
                button
                key={"delete"}
                alignItems="center"
                sx={{
                  bgcolor: "#2e3136",
                }}
              >
                <ListItemIcon>
                  <DeleteForeverIcon sx={{ color: "red" }} />
                </ListItemIcon>
                <ListItemText primary={"Delete this channel"} />
              </ListItem>
            </>
          ) : (
            !channel.private && (
              <>
                <ListItem key="typo">
                  <Typography variant="caption">
                    You are not an administrator of this channel. If you leave
                    this channel, other users of this channel will be notified.
                    However, the other member will still be in this channel.
                  </Typography>
                </ListItem>
                <ListItem
                  button
                  onClick={() => setOpenLeaveModal(true)}
                  key={"leave"}
                  alignItems="center"
                  sx={{
                    bgcolor: "#2e3136",
                  }}
                >
                  <ListItemIcon>
                    <ExitToAppIcon sx={{ color: "red" }} />
                  </ListItemIcon>
                  <ListItemText primary={"Leave this channel"} />
                </ListItem>
              </>
            )
          )}
          {channel.private && (
            <>
              <ListItem key="typo">
                <Typography variant="caption">
                  If you delete this conversation, {channel.name} and you will
                  loose all messages. However, you'll still be able to recreate
                  a new conversation.
                </Typography>
              </ListItem>
              <ListItem
                onClick={() => setOpenDeleteModal(true)}
                button
                key={"delete"}
                alignItems="center"
                sx={{
                  bgcolor: "#2e3136",
                }}
              >
                <ListItemIcon>
                  <DeleteForeverIcon sx={{ color: "red" }} />
                </ListItemIcon>
                <ListItemText primary={"Delete this private conversation"} />
              </ListItem>
            </>
          )}
        </List>
      </div>
    </Box>
  );

  return (
    <>
      <Drawer
        ModalProps={{
          keepMounted: true,
        }}
        anchor={"right"}
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        {list()}
      </Drawer>
      <Modal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styles.modal}>
          {!channel.private ? (
            <>
              <Typography align="left">
                Are you sure yo want to delete channel "{channel.name}" ?
              </Typography>
              <Typography variant="caption" align="left">
                Other users will not be able to talk on it anymore.
              </Typography>
            </>
          ) : (
            <>
              <Typography align="left">
                Are you sure yo want to delete your conversation with{" "}
                {channel.name} ?
              </Typography>
              <Typography variant="caption" align="left">
                This conversation will disappear for {channel.name} as well.
              </Typography>
            </>
          )}
          <div
            style={{
              width: "100%",
              display: "flex",
              marginTop: "20px",
              justifyContent: "space-between",
            }}
          >
            <Button
              onClick={() => handleDeleteChannelAdmin()}
              variant="contained"
            >
              Delete channel
            </Button>
            <Button onClick={() => setOpenDeleteModal(false)}>Cancel</Button>
          </div>
        </Box>
      </Modal>
      <Modal
        open={openLeaveModal}
        onClose={() => setOpenLeaveModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styles.modal}>
          <Typography align="left">
            Are you sure yo want to leave channel "{channel.name}" ?
          </Typography>
          <Typography variant="caption" align="left">
            Other users will be alerted.
          </Typography>
          <div
            style={{
              width: "100%",
              display: "flex",
              marginTop: "20px",
              justifyContent: "space-between",
            }}
          >
            <Button
              onClick={() => handleLeaveChannel(user)}
              variant="contained"
            >
              Leave channel
            </Button>
            <Button onClick={() => setOpenLeaveModal(false)}>Cancel</Button>
          </div>
        </Box>
      </Modal>
      <Modal
        open={openModifModal}
        onClose={() => setOpenModifModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styles.modal}>
          <StyledAvatar user={channel} size={100} group />
          <DragnDrop
            avatar={true}
            onFileChange={(file) => onFileChange(file)}
            onFileSubmit={onFileSubmit}
            setOpenModal={setOpenModifModal}
          />
          <InputBase
            placeholder="Name cannot be empty..."
            style={styles.input}
            defaultValue={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button
            sx={{ width: "100%", marginTop: "20px" }}
            variant={"contained"}
            disabled={name !== "" ? false : true}
            onClick={!file ? () => handleModifyChannel() : () => onFileSubmit()}
          >
            save changes
          </Button>
        </Box>
      </Modal>
    </>
  );
}
