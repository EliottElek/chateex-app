import React, { useState } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Drawer from "../Drawer/Drawer";
import {
  List,
  ListItemButton,
  Checkbox,
  Typography,
  Button,
  IconButton,
  CircularProgress,
  ListItem,
  Popover,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import Modal from "../../../Modal/Modal";
import StyledAvatar from "../../../StyledAvatar/StyledAvatar";
import { useContext } from "react";
import { Context } from "../../../Context/Context";
import axios from "axios";
import shortString from "../../../../functions/string";
// import AutoCompleteMessages from "../../../AutoCompleteMessages/AutoCompleteMessages";
import logo from "../../../../assets/icon.png";
import { Link } from "react-router-dom";

const styles = {
  appbar: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0px 15px 0px 15px",
  },
  at: {
    color: "#8e9297",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  icon: {
    color: "#f5f5f5",
  },
  name: { color: "whitesmoke", marginLeft: "6px", fontWeight: "bold" },
  addPerson: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
};
const AppBar = ({ handleDrawerToggle }) => {
  const { user, channel, addMembers, members, setMembers, setChannel, image } =
    useContext(Context);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [users, setUsers] = useState();
  const [loading, setLoading] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [openAddPersonModal, setOpenAddPersonModal] = useState(false);
  const handleOpenAddPersonModal = () => {
    setOpenAddPersonModal(true);
    fetchUsers();
  };
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
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
  function objectsEqual(o1, o2) {
    return o1.id === o2.id;
  }

  function subtractArrays(a1, a2) {
    var arr = [];
    a1.forEach((o1) => {
      var found = false;
      a2.forEach((o2) => {
        if (objectsEqual(o1, o2)) {
          found = true;
        }
      });
      if (!found) {
        arr.push(o1);
      }
    });
    return arr;
  }
  const fetchUsers = async () => {
    try {
      const { data: usrs } = await axios.get("http://localhost:3001/users");
      var usersFiltered = usrs.filter(function (u) {
        return u.id !== user.id;
      });
      var difference = subtractArrays(usersFiltered, members);
      setUsers(difference);
    } catch (err) {
      console.error();
    }
  };
  const handleAddMembers = async () => {
    setLoading(true);
    try {
      const selectedMembersIds = selectedMembers.map((a) => a.id);
      addMembers([...channel.members, selectedMembersIds]);
      setMembers([...members, selectedMembers]);
      await axios.put(`http://localhost:3001/channels/${channel.id}`, {
        channel: channel,
      });
    } catch (err) {
      console.error(err);
    }
    for (let i = 0; i < selectedMembers.length; i++) {
      try {
        selectedMembers[i].channelsList.push(channel.id);
        await axios.put(
          `http://localhost:3001/users/${selectedMembers[i].id}`,
          {
            user: selectedMembers[i],
          }
        );
      } catch (err) {
        console.error(err);
      }
    }
    setLoading(false);
    setChannel(channel);
    handleCloseAddPersonModal();
  };
  const handleCloseAddPersonModal = () => {
    setOpenAddPersonModal(false);
  };
  return (
    <>
      <div
        style={{
          ...styles.appbar,
          background: image ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.3)",
        }}
      >
        <div style={styles.at}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <ChevronLeftIcon fontSize="large" />
          </IconButton>
          <Link to="/landing">
            <img style={{ width: "40px" }} src={logo} alt={"logo"} />
          </Link>
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: "0.7rem", sm: "1.2rem" },
            }}
            style={styles.name}
          >
            {shortString(channel.name, 25)}{" "}
          </Typography>
        </div>
        <div style={styles.at}>
          {user?.id === channel?.admin && !channel.private && (
            <IconButton onClick={handleOpenAddPersonModal}>
              <PersonAddIcon style={styles.icon} />
            </IconButton>
          )}
          {/* <AutoCompleteMessages placeholder={"Search.."} /> */}
          <IconButton
            onClick={handleClick}
            sx={{
              display: { xs: "none", sm: "flex" },
            }}
          >
            <HelpOutlineIcon style={styles.icon} />
          </IconButton>
          {channel.name && (
            <IconButton
              onClick={() => {
                setOpenDrawer(true);
              }}
            >
              <MoreHorizIcon style={styles.icon} />
            </IconButton>
          )}
        </div>
      </div>
      <Modal open={openAddPersonModal} handleClose={handleCloseAddPersonModal}>
        <div style={styles.addPerson}>
          {!users ? (
            <CircularProgress />
          ) : (
            <>
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
                {users.length === 0 && (
                  <Typography align="center" sx={{ color: "#d5d8d9" }}>
                    Everybody is already in the group.
                  </Typography>
                )}
                {users.length > 0 &&
                  users.map((user) => {
                    const labelId = `checkbox-list-secondary-label-${user.id}`;
                    return (
                      <ListItem
                        sx={{
                          color: "#d5d8d9",
                          bgcolor: "#2e3136",
                          margin: "4px",
                          borderRadius: "4px",
                          padding: "4px",
                        }}
                        key={user.id}
                        secondaryAction={
                          <Checkbox
                            sx={{
                              color: "#d5d8d9",
                            }}
                            edge="end"
                            onChange={handleToggle(user)}
                            checked={checked.indexOf(user) !== -1}
                            inputProps={{ "aria-labelledby": labelId }}
                          />
                        }
                        disablePadding
                      >
                        <ListItemButton>
                          <ListItemAvatar>
                            <StyledAvatar user={user} />
                          </ListItemAvatar>
                          <ListItemText
                            id={labelId}
                            primary={user.firstname + " " + user.lastname}
                          />
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
              </List>
              <Button
                disabled={users.length === 0 && true}
                onClick={handleAddMembers}
                sx={{ width: 300, m: 2 }}
                variant="contained"
              >
                {loading ? <CircularProgress /> : "Add member(s)"}
              </Button>
            </>
          )}
        </div>
      </Modal>
      <Drawer
        openDrawer={openDrawer}
        setOpenDrawer={setOpenDrawer}
        handleOpenAddPersonModal={handleOpenAddPersonModal}
      />
      <Popover
        id={id}
        open={open}
        style={{ maxWidth: "500px", minWidth: "400px" }}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Typography
          style={{ maxWidth: "500px", minWidth: "400px" }}
          sx={{
            color: "#fefefe",
            p: 3,
          }}
          component={"p"}
        >
          Welcome to our humble application. Feel free to create a new channel
          or start a new conversation with a user. You can add reactions to
          messages, add GIFs, emojis, you can also delete and edit your
          messages. When you create a chat group or a conversation, you become
          the administrator. You can add and remove users, or delete the
          channel. If you've been added to a group chat, you can feel free to
          leave the channel.
        </Typography>
      </Popover>
    </>
  );
};

export default AppBar;
