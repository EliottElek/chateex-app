import * as React from "react";
import Card from "@mui/material/Card";
import axios from "axios";
import {
  ListItemText,
  List,
  ListItem,
  Modal,
  Box,
  Button,
  Alert,
  Avatar,
  ListItemAvatar,
  ListItemIcon,
  Divider,
  InputBase,
  IconButton,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import avatars from "../../../../../data/avatars";
import Typography from "@mui/material/Typography";
import StyledAvatar from "../../../../StyledAvatar/StyledAvatar";
import { Context } from "../../../../Context/Context";
import DragnDrop from "../../../Channel/MessageForm/DragnDrop";
import getBase64 from "../../../../../functions/dist/base64";
import { HexColorPicker } from "react-colorful";
import SettingsIcon from "@mui/icons-material/Settings";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import gravatar from "gravatar";
import themes from "../../../../../data/themes";
const styles = {
  modal: {
    color: "#fefefe",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: 350,
    minWidth: 300,
    minHeight: "70%",
    maxHeight: "80%",
    bgcolor: "rgba(0,0,0, 0.6)",
    borderRadius: "8px",
    boxShadow: 24,
    p: 4,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  modalSettings: {
    color: "#fefefe",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "350px",
    width: "97%",
    maxHeight: "80%",
    overflowX: "hidden",
    overflowY: "auto!important",
    background: "rgba(0,0,0, 0.6)",
    borderRadius: "8px",
    boxShadow: 24,
    gap: "20px",
    display: "grid",
    gridTemplateColumns: "100%",
  },
  input: {
    backgroundColor: "#36393e",
    color: "#f5f5f5",
    padding: "8px",
    width: "100%",
    borderRadius: "6px",
  },
};
export default function ProfileCard() {
  const {
    handleLogOut,
    user,
    onUser,
    setSnackBarMessage,
    setOpenSnack,
    setMembers,
    removeCookie,
    members,
    color,
    image,
    setOauth,
    setImage,
    setColor,
  } = React.useContext(Context);
  const onFileChange = (file) => {
    setFile(file);
  };
  const [openAvatarModal, setOpenAvatarModal] = React.useState(false);
  const [openInfosModal, setOpenInfosModal] = React.useState(false);
  const [openSettingsModal, setOpenSettingsModal] = React.useState(false);
  const [deleteWant, setDeleteWant] = React.useState(false);
  const [file, setFile] = React.useState();
  const [firstname, setFirstname] = React.useState(user.firstname);
  const [lastname, setLastname] = React.useState(user.lastname);

  const handleDeleteAccount = async () => {
    try {
      removeCookie("oauth");
      removeCookie("visited");
      setOauth(null);
      onUser(null);
      await axios.delete(`${process.env.REACT_APP_API_URL}/users/${user.id}`);
      setSnackBarMessage({
        success: true,
        message: "Your account has been deleted successfully.",
      });
      setOpenSnack(true);
    } catch (err) {
      console.log(err);
      setSnackBarMessage({
        success: false,
        message: "Could not delete this account. Try again later.",
      });
      setOpenSnack(true);
    }
  };
  const onFileSubmit = () => {
    console.log(file[0]);
    try {
      getBase64(file[0])
        .then(async (result) => {
          try {
            user.avatarUrl = result;
            await axios.put(`${process.env.REACT_APP_API_URL}/users/${user.id}`, {
              user: user,
            });
            onUser(user);
            const membs = members;
            membs[membs.findIndex((x) => x.id === user.id)] = user;
            setMembers(membs);
            setSnackBarMessage({
              success: true,
              message: "Avatar was successfully modified.",
            });
          } catch {
            setSnackBarMessage({
              success: false,
              message: "Could not modify avatar. Try again later.",
            });
          }
          setOpenSnack(true);
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
  const handleChangeAvatar = async (avatar) => {
    try {
      user.avatarUrl = avatar.url;
      await axios.put(`${process.env.REACT_APP_API_URL}/users/${user.id}`, {
        user: user,
      });
      onUser(user);
      const membs = members;
      membs[membs.findIndex((x) => x.id === user.id)] = user;
      setMembers(membs);
      setSnackBarMessage({
        success: true,
        message: "Avatar was successfully modified.",
      });
    } catch {
      setSnackBarMessage({
        success: false,
        message: "Could not modify avatar. Try again later.",
      });
    }
    setOpenSnack(true);
  };
  const handleChangeInfos = async () => {
    try {
      user.firstname = firstname;
      user.lastname = lastname;
      await axios.put(`${process.env.REACT_APP_API_URL}/users/${user.id}`, {
        user: user,
      });
      onUser(user);
      const membs = members;
      membs[membs.findIndex((x) => x.id === user.id)] = user;
      setMembers(membs);
      setSnackBarMessage({
        success: true,
        message: "User was successfully modified.",
      });
    } catch {
      setSnackBarMessage({
        success: false,
        message: "Could not modify user. Try again later.",
      });
    }
    setOpenSnack(true);
  };
  const handleChangeTheme = async () => {
    try {
      user.color = color;
      user.theme = image;
      await axios.put(`${process.env.REACT_APP_API_URL}/users/${user.id}`, {
        user: user,
      });
      onUser(user);
      const membs = members;
      membs[membs.findIndex((x) => x.id === user.id)] = user;
      setMembers(membs);
      setSnackBarMessage({
        success: true,
        message: image
          ? `Theme was successfully changed to '${image.name}''`
          : `Theme was successfully changed to ${color}.`,
      });
    } catch {
      setSnackBarMessage({
        success: false,
        message: "Could not modify theme. Try again later.",
      });
    }
    setOpenSnack(true);
  };
  return (
    <>
      <Card
        elevation={3}
        sx={{
          minWidth: 265,
          minHeight: 405,
          borderRadius: "8px",
          bgcolor: "rgba(0,0,0, 0.7)",
          color: "#d4d6d7",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "15px",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <StyledAvatar size={100} user={user}></StyledAvatar>
          <Typography gutterBottom variant="h5" component="div">
            {user?.firstname} {user?.lastname}
          </Typography>
          <Typography variant="body2">{user.email}</Typography>
        </div>
        <List sx={{ width: "100%" }}>
          <ListItem
            button
            onClick={() => setOpenAvatarModal(true)}
            key={"avatar"}
            style={{
              backgroundColor: "#2e3136",
              borderRadius: "5px",
              marginTop: "4px",
            }}
          >
            <ListItemText align="center">Change avatar</ListItemText>
          </ListItem>
          <ListItem
            button
            onClick={() => setOpenInfosModal(true)}
            key={"infos"}
            style={{
              backgroundColor: "#2e3136",
              borderRadius: "5px",
              marginTop: "4px",
            }}
          >
            <ListItemText align="center">Modify infos</ListItemText>
          </ListItem>
          <ListItem
            button
            onClick={() => setOpenSettingsModal(true)}
            key={"more"}
            style={{
              backgroundColor: "#2e3136",
              borderRadius: "5px",
              marginTop: "4px",
            }}
          >
            <ListItemText align="center">More settings</ListItemText>
          </ListItem>
          <ListItem
            button
            onClick={handleLogOut}
            key={"out"}
            style={{
              color: "red",
              backgroundColor: "#2e3136",
              borderRadius: "5px",
              marginTop: "4px",
            }}
          >
            <ListItemText align="center">Log out</ListItemText>
          </ListItem>
        </List>
      </Card>
      <Modal open={openAvatarModal} onClose={() => setOpenAvatarModal(false)}>
        <Box sx={styles.modal}>
          <Avatar style={{ width: 100, height: 100 }} src={user.avatarUrl} />
          <Button
            onClick={() =>
              handleChangeAvatar({
                url: gravatar.url(
                  user.email,
                  { s: "100", r: "x", d: "retro" },
                  true
                ),
              })
            }
          >
            Revert to gravatar
          </Button>
          <DragnDrop
            avatar={true}
            onFileChange={(file) => onFileChange(file)}
            onFileSubmit={onFileSubmit}
            setOpenModal={setOpenAvatarModal}
          />
          <List
            style={{
              width: "100%",
              height: "100%",
              overflowY: "auto",
              marginTop: "10px",
            }}
          >
            {avatars.map((avatar) => (
              <ListItem
                key={avatar.name}
                button
                onClick={() => handleChangeAvatar(avatar)}
              >
                <ListItemAvatar>
                  <Avatar
                    style={{ width: 60, height: 60, marginRight: "10px" }}
                    src={avatar.url}
                  />
                </ListItemAvatar>
                <Typography variant="body1">{avatar.name}</Typography>
              </ListItem>
            ))}
          </List>
        </Box>
      </Modal>
      <Modal open={openInfosModal} onClose={() => setOpenInfosModal(false)}>
        <Box sx={styles.modal}>
          <Avatar style={{ width: 100, height: 100 }} src={user.avatarUrl} />
          <List
            style={{
              width: "100%",
              height: "100%",
              overflowY: "auto",
              marginTop: "10px",
              color: "#f5f5f5",
            }}
          >
            <Typography
              variant="caption"
              style={{ color: "#f5f5f5", marginTop: "12px" }}
            >
              Firstname
            </Typography>
            <ListItem
              key={"firstname"}
              style={{ width: "100%", padding: 0, paddingBottom: "5px" }}
            >
              <InputBase
                style={styles.input}
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
              />
            </ListItem>
            <Typography
              variant="caption"
              style={{ color: "#f5f5f5", marginTop: "12px" }}
            >
              Lastname
            </Typography>
            <ListItem
              key={"lastname"}
              style={{ width: "100%", padding: 0, paddingBottom: "5px" }}
            >
              <InputBase
                style={styles.input}
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
              />
            </ListItem>
            <Typography
              variant="caption"
              style={{ color: "#f5f5f5", marginTop: "12px" }}
            >
              Email
            </Typography>
            <ListItem
              key={"email"}
              style={{ width: "100%", padding: 0, paddingBottom: "5px" }}
            >
              <InputBase style={styles.input} value={user.email} disabled />
            </ListItem>
            <ListItem alignItems="center" sx={{ padding: 0 }}>
              <Button
                sx={{ width: "100%", marginTop: "20px" }}
                variant={"contained"}
                disabled={firstname !== "" && lastname !== "" ? false : true}
                onClick={handleChangeInfos}
              >
                save changes
              </Button>
            </ListItem>
          </List>
        </Box>
      </Modal>
      <Modal
        open={openSettingsModal}
        onClose={() => {
          setOpenSettingsModal(false);
          handleChangeTheme();
        }}
      >
        {!deleteWant ? (
          <div style={styles.modalSettings}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant={"h5"}
                style={{ display: "flex", alignItems: "center" }}
              >
                <SettingsIcon /> Settings
              </Typography>
              <Button
                onClick={() => {
                  setColor("#414549");
                  setImage(null);
                }}
              >
                <RestartAltIcon /> reset
              </Button>
            </div>
            <Alert severity="info">
              Make sure you pick a theme on which the typography will show
              correctly. Do not choose a theme that's too bright{" "}
              <span
                aria-labelledby="icons"
                role="img"
                style={{ fontStyle: "normal" }}
              >
                😉
              </span>
            </Alert>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <HexColorPicker color={color} onChange={setColor} />
            </div>
            {image ? (
              <>
                <Typography>Current theme : </Typography>
                <div style={{ display: "flex" }}>
                  <IconButton
                    onClick={() => setImage(null)}
                    style={{ position: "absolute" }}
                  >
                    <ClearIcon sx={{ color: "#fefefe" }} />
                  </IconButton>
                  <img
                    src={image.url}
                    alt="current theme"
                    style={{
                      width: "90%",
                      margin: "auto",
                      height: "200px",
                      objectFit: "contain",
                    }}
                  />
                </div>
              </>
            ) : (
              <div
                style={{
                  width: "90%",
                  overflowX: "scroll",
                  overflowY: "hidden",
                  height: "auto",
                  margin: "auto",
                  display: "flex",
                  gap: "5px",
                }}
              >
                {themes.map((theme) => (
                  <img
                    key={theme.name}
                    onClick={() => setImage(theme)}
                    src={theme.url}
                    alt={theme.name}
                    style={{
                      width: "auto",
                      height: "200px",
                      objectFit: "cover",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>
            )}
            <Divider style={{ color: "red" }} variant="middle">
              DANGER ZONE
            </Divider>
            <List sx={{ width: "100%", color: "red" }}>
              <ListItem key="typo">
                <Typography variant="caption">
                  If you delete your account, you'll loose every conversation
                  you've had in the past.
                </Typography>
              </ListItem>
              <ListItem
                onClick={() => setDeleteWant(true)}
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
                <ListItemText primary={"Delete this account"} />
              </ListItem>
            </List>
          </div>
        ) : (
          <div style={styles.modalSettings}>
            <Typography
              variant={"h5"}
              style={{ display: "flex", alignItems: "center" }}
            >
              <SettingsIcon /> Settings
            </Typography>
            <Typography style={{ margin: "12px" }}>
              Are you sure you want to delete your account ? The delete is
              definitive.
            </Typography>
            <Button
              variant="contained"
              sx={{ bgcolor: "#f60803", width: "100%" }}
              onClick={() => handleDeleteAccount()}
            >
              Yes, I'm sure
            </Button>
            <Button
              sx={{ color: "#f60803", width: "100%" }}
              onClick={() => setDeleteWant(false)}
            >
              cancel
            </Button>
          </div>
        )}
      </Modal>
    </>
  );
}
