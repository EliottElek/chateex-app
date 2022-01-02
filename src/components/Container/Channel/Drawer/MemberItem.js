import * as React from "react";
import {
  ListItem,
  IconButton,
  ListItemAvatar,
  ListItemText,
  Modal,
  Box,
  Typography,
  Button,
} from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
import { Context } from "../../../Context/Context";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import StyledAvatar from "../../../StyledAvatar/StyledAvatar";
import axios from "axios";
const styles = {
  modal: {
    color: "#fefefe",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    maxHeight: "70%",
    overflowY: "auto",
    bgcolor: "#54575c",
    borderRadius: "8px",
    boxShadow: 24,
    p: 4,
  },
};

export default function MemberItem({ member, index, setOpenDrawer }) {
  const {
    channel,
    user,
    setSnackBarMessage,
    setOpenSnack,
    setChannel,
    members,
    setMembers,
  } = React.useContext(Context);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openRemoveUserModal, setOpenRemoveUserModal] = React.useState(false);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRemoveUser = async (use) => {
    const chId = channel.id;
    const newUser = use;
    //remove channel for user
    try {
      var newList = newUser.channelsList.filter(function (u) {
        return u !== chId;
      });
      newUser.channelsList = newList;
      await axios.put(`http://localhost:3001/users/${newUser.id}`, {
        user: newUser,
      });
    } catch (e) {
      console.error(e);
      setSnackBarMessage({
        success: false,
        message: `Could not remove this channel from ${newUser.firstname}'s list. Try again later.`,
      });
      setOpenSnack(true);
    }
    //remove member from channel
    try {
      var newUsersList = channel.members.filter(function (u) {
        return u !== newUser.id;
      });
      channel.members = newUsersList;
      await axios.put(`http://localhost:3001/channels/${chId}`, {
        channel: channel,
      });
      setChannel(channel);
      const newMembers = members.filter((member) => member.id !== use.id);
      setMembers(newMembers);
      setSnackBarMessage({
        success: true,
        message: `You successfully removed ${newUser.firstname} from "${channel.name}".`,
      });
      setOpenSnack(true);
    } catch (err) {
      setSnackBarMessage({
        success: false,
        message: `Could not remove this channel from ${newUser.firstname}'s list. Try again later.`,
      });
      setOpenSnack(true);
    }
    handleClose();
    setOpenRemoveUserModal(false);
    setOpenDrawer(false);
  };

  return (
    <div>
      <ListItem
        key={index}
        disableGutters
        secondaryAction={
          member.id !== channel.admin &&
          user.id === channel.admin &&
          !channel.private && (
            <IconButton onClick={handleClick}>
              <MoreHorizIcon />
            </IconButton>
          )
        }
        style={{
          backgroundColor: "whitesmoke",
          borderRadius: "5px",
          padding: "5px",
          margin: "4px",
        }}
      >
        <ListItemAvatar>
          <StyledAvatar user={member} />
        </ListItemAvatar>
        <ListItemText>
          {member.firstname}{" "}
          {member.id === channel.admin && !channel.private && "(admin)"}
        </ListItemText>
      </ListItem>
      <Menu
        id="fade-menu"
        MenuListProps={{
          "aria-labelledby": "fade-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <MenuItem
          onClick={() => setOpenRemoveUserModal(true)}
          sx={{ color: "red" }}
        >
          Remove {member.firstname}
        </MenuItem>
      </Menu>
      <Modal
        open={openRemoveUserModal}
        onClose={() => setOpenRemoveUserModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styles.modal}>
          <Typography>
            Are you sure yo want to remove {member.firstname} from "
            {channel.name}" ?
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
            <Button
              onClick={() => handleRemoveUser(member)}
              variant="contained"
            >
              remove {member.firstname}
            </Button>
            <Button onClick={() => setOpenRemoveUserModal(false)}>
              Cancel
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
