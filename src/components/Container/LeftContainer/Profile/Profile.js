import React from "react";
import StyledAvatar from "../../../StyledAvatar/StyledAvatar";
import SettingsIcon from "@mui/icons-material/Settings";
import ProfileCard from "./ProfileCard/ProfileCard";
import './profile.css'
import {
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Popover,
} from "@mui/material";
import { Context } from "../../../Context/Context";
import { useContext } from "react";
const styles = {
  title: {
    color: "#6588DE",
    fontWeight: "bold",
    fontSize: "14px!important",
  },
  content: {
    padding: 0,
    margin: 0,
    color: "#d6d8d9",
    fontWeight: "200",
    fontSize: "14px",
    width: "100%",
    display: "flex",
  },
};
const Profile = () => {
  const { user } = useContext(Context);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  return (
    <div>
      <ListItem>
        <ListItemAvatar sx={{ height: "100%" }}>
          <StyledAvatar user={user}></StyledAvatar>
        </ListItemAvatar>
        <ListItemText
          style={{ height: "auto", padding: 0, margin: 0 }}
          primary={
            <Typography sx={styles.title} className = "name">
              {user.firstname}
            </Typography>
          }
          secondary={
              <Typography variant="body1" style={styles.content}>
                #{user?.id?.toString().substring(0, 5)}
              </Typography>
          }
        />
        <IconButton onClick={handleClick}>
          <SettingsIcon style={{ color: "#b9bbbe" }} />
        </IconButton>
      </ListItem>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <ProfileCard />
      </Popover>
    </div>
  );
};

export default Profile;
