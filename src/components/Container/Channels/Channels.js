import React, { useState } from "react";
import axios from "axios";
import {
  List,
  ListItem,
  IconButton,
  Typography,
  Button,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import Modal from "../../Modal/Modal";
import ChannelItem from "./ChannelItem/ChannelItem";
import AddIcon from "@mui/icons-material/Add";
import { useContext } from "react";
import { Context } from "../../Context/Context";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import CommentIcon from "@mui/icons-material/Comment";
import { Tab, Box, ListItemAvatar, ListItemText } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import StyledAvatar from "../../StyledAvatar/StyledAvatar";
import { useNavigate } from "react-router-dom";
const { v4: uuid } = require("uuid");

const styles = {
  root: {
    width: "100%",
    height: "inherit",
    display: "grid",
    gridTemplateRows: "40px auto",
    backgroundColor: "transparent",
  },
  listChannels: {
    width: "100%",
    overflowY: "auto",
    bgcolor: "transparent",
    color: "#D9E2EC",
  },
  listContainer: {
    height: "100%",
    flexGrow: 1,
  },
  channels: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#fefefe",
    borderBottom: "solid 0.2px rgb(66, 69, 74)",
  },
  channelsLoading: {
    margin: 0,
    height: "60px",
    color: "#fefefe",
  },
  add: {
    color: "#fefefe",
    width: "20px",
  },
  input: {
    marginBottom: "10px",
    marginTop: "5px",
    border: "none",
    outline: "none",
    width: "95%",
    borderRadius: "5px",
    padding: "8px",
    color: "#rgba(0,0,0,0.8)",
    background: "#d6d8d9",
  },
  label: {
    color: "#fefefe",
    textTransform: "uppercase",
    fontWeight: "bold",
    fontSize: "0.8rem",
    margin: "15px 0px 5px 5px",
  },
  button: {
    width: "100%",
    borderRadius: "5px",
    padding: "8px",
    margin: 0,
    marginTop: "12px",
    cursor: "pointer",
  },
};
const Channels = () => {
  const {
    user,
    onUser,
    addChannel,
    setMembers,
    channels,
    setMobileOpen,
    setSnackBarMessage,
    setOpenSnack,
  } = useContext(Context);
  const navigate = useNavigate();
  const [checked, setChecked] = React.useState([]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
      selectedMembers.push(value);
      setSelectedMembers(selectedMembers);
    } else {
      newChecked.splice(currentIndex, 1);
      selectedMembers.splice(currentIndex, 1);
      setSelectedMembers(selectedMembers);
    }

    setChecked(newChecked);
  };
  const [channelName, setChannelName] = useState("");
  const [openBackdrop, setOpenBackDrop] = useState(false);
  const [value, setValue] = useState("1");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [selectedMembers, setSelectedMembers] = useState([]);

  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);

  const handleChangeName = (event) => {
    setChannelName(event.target.value);
  };
  const handleOpenModal = () => {
    setOpen(true);
    fetchUsers();
  };
  const handleCloseModal = () => {
    setOpen(false);
  };
  const fetchUsers = async () => {
    try {
      const { data: usrs } = await axios.get(
        `${process.env.REACT_APP_API_URL}/users`
      );
      var usersFiltered = usrs.filter(function (u) {
        return u.id !== user.id;
      });
      setUsers(usersFiltered);
    } catch (err) {
      console.error();
    }
  };

  const handlePrivateConv = async (e, userto) => {
    var isAlreadyCreated = false;
    setOpen(false);
    var foundConversation = {};
    //First, we check to see if we already created a conversation with this person
    for (let i = 0; i < channels.length; i++) {
      if (
        channels[i].private &&
        channels[i].members.findIndex((member) => member === userto.id) !== -1
      ) {
        isAlreadyCreated = true;
        foundConversation = channels[i];
      }
    }
    if (isAlreadyCreated) {
      navigate(`/channels/${foundConversation.id}`);
      setMobileOpen(false);
    } else {
      //Then, if not :
      e.preventDefault();
      const id = uuid();
      const channel = {
        private: true,
        admin: user.id,
        avatarUrl: userto.avatarUrl,
        name: userto.firstname + " " + userto.lastname,
        id: id,
        members: [user.id, userto.id],
      };
      //first, we create the channel
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/channels/`, channel);
        addChannel(channel);
        setMembers([]);
        setChannelName("");
        navigate(`/channels/${channel.id}`);
      } catch (err) {
        setSnackBarMessage({
          success: false,
          message: "Could not create this channel. Try again later.",
        });
      }
      //then, we add thee channel to user's channel list
      try {
        const newUser = user;
        newUser.channelsList.push(channel.id);
        await axios.put(`${process.env.REACT_APP_API_URL}/users/${user.id}`, {
          user: newUser,
        });
        onUser(newUser);
      } catch (e) {
        console.error(e);
      }
      try {
        userto.channelsList.push(channel.id);
        await axios.put(`${process.env.REACT_APP_API_URL}/users/${userto.id}`, {
          user: userto,
        });
        setSnackBarMessage({
          success: true,
          message: "New private conversation successfully created.",
        });
      } catch (e) {
        setSnackBarMessage({
          success: false,
          message: "Cannot create new conversation.",
        });
      }
      setOpenSnack(true);
      setMobileOpen(false);
    }
  };
  const handleAddChannel = async (e) => {
    e.preventDefault();
    setOpen(false);
    setOpenBackDrop(true);
    const id = uuid();
    const selectedMembersIds = [...selectedMembers.map((a) => a.id), user.id];
    const channel = {
      admin: user.id,
      name: channelName,
      id: id,
      members: [...selectedMembersIds, user.id],
    };
    const newUser = user;
    newUser.channelsList.push(channel.id);
    //first, we create the channel
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/channels/`, channel);
    } catch (err) {
      setSnackBarMessage({
        success: false,
        message: "Could not create this channel. Try again later.",
      });
      setOpenSnack(true);
      return null;
    }
    //then, we add thee channel to user's channel list
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/users/${user.id}`, {
        user: newUser,
      });
    } catch (e) {
      setSnackBarMessage({
        success: false,
        message: "Cannot add new member.",
      });
      setOpenSnack(true);
      return null;
    }
    for (let i = 0; i < selectedMembers.length; i++) {
      try {
        selectedMembers[i].channelsList.push(channel.id);
        await axios.put(
          `${process.env.REACT_APP_API_URL}/users/${selectedMembers[i].id}`,
          {
            user: selectedMembers[i],
          }
        );
        // setSnackBarMessage({
        //   success: true,
        //   message: `Channel '${channel.name}' was successfully created.`,
        // });
      } catch (err) {
        setSnackBarMessage({
          success: false,
          message: "Could not create this channel. Try again later.",
        });
        setOpenSnack(true);
        return null;
      }
    }
    setChannelName("");
    onUser(newUser);
    setChannelName("");
    setMembers([]);
    //addMembers(selectedMembersIds);
    setSelectedMembers([]);
    setSnackBarMessage({
      success: true,
      message: "Channel was successfully created.",
    });
    setTimeout(() => {
      setMembers([]);
      addChannel(channel);
      setOpenBackDrop(false);
      navigate(`/channels/${id}`);
      setMobileOpen(false);
      setOpenSnack(true);
    }, 500);
  };

  return (
    <>
      <div style={styles.root}>
        <ListItem sx={styles.channels} key="channels">
          <Typography>Channels</Typography>
          <IconButton onClick={handleOpenModal}>
            <AddIcon style={styles.add} />
          </IconButton>
        </ListItem>
        {!channels.length ? (
          <ListItem
            sx={styles.channelsLoading}
            key="channelsLoading"
            secondaryAction={
              <CircularProgress style={{ width: 30, height: 30 }} />
            }
          >
            <Typography>Loading...</Typography>
          </ListItem>
        ) : (
          <List sx={styles.listChannels}>
            {channels?.map((channel, i) => (
              <div key={i}>
                {channel.unread ? (
                  <ChannelItem key={channel.id} channel={channel} unread />
                ) : (
                  <ChannelItem key={channel.id + 1} channel={channel} />
                )}
              </div>
            ))}
          </List>
        )}
      </div>
      <Modal handleClose={handleCloseModal} open={open}>
        <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={value}>
            <Box
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                color: "#fefefe",
              }}
            >
              <TabList onChange={handleChange}>
                <Tab
                  key={1}
                  style={{ color: "#fefefe" }}
                  label="New group chat"
                  value="1"
                />
                <Tab
                  key={2}
                  style={{ color: "#fefefe" }}
                  label="New private conversation"
                  value="2"
                />
              </TabList>
            </Box>
            <TabPanel value="1">
              <form onSubmit={handleAddChannel}>
                <Typography style={styles.label}>
                  Create a new group chat
                </Typography>
                <div>
                  {!users ? (
                    <CircularProgress />
                  ) : (
                    <>
                      <input
                        onChange={handleChangeName}
                        value={channelName}
                        style={styles.input}
                        placeholder="Your channel name..."
                        type="name"
                      />
                      <List
                        dense
                        sx={{
                          maxWidth: 360,
                          overflowX: "hidden",
                          width: "100%",
                          maxHeight: "300px",
                          overflowY: "auto",
                          bgcolor: "transparent",
                        }}
                      >
                        {users.map((user) => {
                          const labelId = `checkbox-list-secondary-label-${user.id}`;
                          return (
                            <ListItem
                              sx={{
                                color: "#fefefe",
                                bgcolor: "#2e3136",
                                margin: "4px",
                                borderRadius: "4px",
                                padding: "4px",
                              }}
                              key={user.id}
                              secondaryAction={
                                <Checkbox
                                  sx={{ color: "#fefefe" }}
                                  edge="end"
                                  onChange={handleToggle(user)}
                                  checked={checked.indexOf(user) !== -1}
                                  inputProps={{
                                    "aria-labelledby": labelId,
                                  }}
                                />
                              }
                            >
                              <ListItemAvatar>
                                <StyledAvatar user={user} />
                              </ListItemAvatar>
                              <ListItemText
                                id={labelId}
                                primary={user.firstname + " " + user.lastname}
                              />
                            </ListItem>
                          );
                        })}
                      </List>
                    </>
                  )}
                </div>
                <Button
                  type="submit"
                  style={styles.button}
                  disabled={
                    channelName === "" || selectedMembers.length < 2
                      ? true
                      : false
                  }
                  variant="contained"
                  onClick={handleAddChannel}
                >
                  Create channel
                </Button>
              </form>
            </TabPanel>
            <TabPanel value="2">
              <List
                dense
                sx={{
                  maxWidth: 360,
                  overflowX: "hidden",
                  width: "100%",
                  maxHeight: "400px",
                  overflowY: "auto",
                  bgcolor: "transparent",
                }}
              >
                {users.map((user) => (
                  <ListItem
                    sx={{
                      color: "#fefefe",
                      bgcolor: "#2e3136",
                      margin: "4px",
                      borderRadius: "4px",
                      padding: "4px",
                    }}
                    key={user.id}
                    secondaryAction={
                      <IconButton
                        sx={{ color: "#fefefe" }}
                        onClick={(e) => {
                          handlePrivateConv(e, user);
                        }}
                      >
                        <CommentIcon />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <StyledAvatar user={user} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={user.firstname + " " + user.lastname}
                    />
                  </ListItem>
                ))}
              </List>
            </TabPanel>
          </TabContext>
        </Box>
      </Modal>
      <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress color="primary" />
          <Typography style={{ marginTop: "10px" }} color="primary">
            Creating channel...
          </Typography>
        </div>
      </Backdrop>
    </>
  );
};

export default Channels;
