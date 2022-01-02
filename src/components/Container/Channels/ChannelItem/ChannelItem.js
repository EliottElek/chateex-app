import React, { useContext } from "react";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import Typography from "@mui/material/Typography";
import "./style.css";
// import axios from "axios";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import { Context } from "../../../Context/Context";
import StyledAvatar from "../../../StyledAvatar/StyledAvatar";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import icon from "../../../../assets/icon.png";
import shortString from "../../../../functions/string";
const styles = {
  root: {
    background: "transparent",
    width: "95%",
    padding: 0,
    margin: "1px auto 1px auto",
    borderRadius: "4px",
  },
  rootActive: {
    backgroundColor: "rgba(0,0,0,0.4)",
    width: "95%",
    padding: 0,
    margin: "1px auto 1px auto",
    borderRadius: "4px",
  },
  text: {
    color: "#fefefe",
  },
  item: {
    padding: 3,
  },
  deleteIcon: {
    color: "#fefefe",
    padding: 0,
    margin: 0,
  },
  unread: {
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
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
    bgcolor: "#54575c",
    borderRadius: "8px",
    boxShadow: 24,
    p: 4,
  },
  avatar: { marginLeft: 3, width: 30, height: 30 },
};
const ChannelItem = ({ channel, clearInput, search, unread }) => {
  const { id } = useParams();
  const { setMembers, setMobileOpen, channels, setChannels } =
    useContext(Context);
  const setOpen = async () => {
    channels.find((channel) => channel.id === id).unread = false;
    // const channelToPut = channels.find((channel) => channel.id === id);
    // await axios.put(`http://localhost:3001/channels/${channelToPut.id}`, {
    //   channel: channelToPut,
    // });
    setChannels(channels);
    const favicon = document.getElementById("favicon");
    favicon.href = icon;
    const title = document.getElementById("title");
    title.innerHTML = "Chateex";
  };
  id === channel.id && setOpen();
  return (
    <ListItemButton
      className="hover"
      style={id === channel.id ? styles.rootActive : styles.root}
      key={channel.id}
      component={Link}
      onClick={() => {
        setMembers([]);
        setMobileOpen(false);
        search && clearInput();
      }}
      to={`/channels/${channel.id}`}
    >
      <ListItem
        style={styles.item}
        secondaryAction={
          unread && <FiberManualRecordIcon sx={{ color: "#972ad6" }} />
        }
      >
        <ListItemAvatar>
          {channel.private ? (
            <StyledAvatar style={styles.avatar} user={channel} />
          ) : (
            <StyledAvatar user={channel} style={styles.avatar} group={true} />
          )}
        </ListItemAvatar>
        <ListItemText style={styles.text}>
          <Typography
            variant="body1"
            style={unread ? styles.unread : { fontWeight: "normal" }}
          >
            {shortString(channel.name, 20)}
          </Typography>
        </ListItemText>
        <Box sx={{ flexGrow: 1 }} />
      </ListItem>
    </ListItemButton>
  );
};

export default ChannelItem;
