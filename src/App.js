import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import axios from "axios";
import "./App.css";
import { IconButton } from "@mui/material";
import Main from "./components/Container/Main/Main";
import Login from "./components/Container/Login/Oauth";
import SignUp from "./components/Container/SignUp/SignUp";
import Landing from "./components/Landing/Landing";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import CloseIcon from "@mui/icons-material/Close";
import { useContext } from "react";
import { Context } from "./components/Context/Context";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import icon from "./assets/icon.png";
import io from "socket.io-client";
import { useLocation } from "react-router";
import notificationIcon from "./assets/iconNew.png";

export const sendMessage = (message) => {
  socket.emit("sendMessage", message);
  socket.emit("sendNotification", message);
};

var link = document.querySelector("link[rel~='icon']");
if (!link) {
  link = document.createElement("link");
  link.rel = "icon";
  document.getElementsByTagName("head")[0].appendChild(link);
}
link.href = icon;

let socket;
const ENDPOINT = process.env.REACT_APP_API_URL;

const styles = {
  root: {
    width: "100%",
    height: "100vh",
    padding: 0,
    margin: 0,
  },
};
let theme = createTheme({
  palette: {
    primary: {
      main: "#a437cb",
    },
    secondary: {
      main: "#6700ff",
    },
  },
});
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const App = () => {
  const {
    setMessages,
    setChannels,
    addMessage,
    user,
    color,
    setColor,
    setImage,
    onUser,
    image,
    oauth,
    channel,
    channels,
    setSnackBarMessage,
    setOpenSnack,
    snackbarMessage,
    openSnack,
    handleCloseSnack,
    setChannel,
    removeCookie,
  } = useContext(Context);
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data: msgs } = await axios.get(
          `${process.env.REACT_APP_API_URL}/channels/${channel?.id}/messages`
        );
        var sorted_messages = msgs.sort((a, b) => {
          return (
            new Date(a.creation).getTime() - new Date(b.creation).getTime()
          );
        });
        setMessages(sorted_messages);
      } catch (e) {
        setSnackBarMessage({
          success: false,
          message: "Could not connect to server",
        });
        setOpenSnack(true);
      }
    };
    if (user) fetchMessages();
  }, [channel.id, setMessages, setOpenSnack, setSnackBarMessage, user]);

  useEffect(() => {
    if (user) user.active = true;
    socket = io(ENDPOINT);
    socket.emit("join", { channel, user }, ({ error }) => {
      setSnackBarMessage({
        success: false,
        message: error,
      });
      setOpenSnack(true);
    });
    return () => {
      socket.disconnect();
      socket.off();
    };
  }, [onUser, channel, user, setOpenSnack, setSnackBarMessage]);

  useEffect(() => {
    socket.on("sendMessage", (message) => {
      addMessage(message);
    });
  }, [addMessage]);
  useEffect(() => {
    socket.on("message", (message) => {
      addMessage(message);
    });
  }, [addMessage, channels, setChannels]);
  useEffect(() => {
    socket.on("notification", async (message) => {
      const chann = [...channels];
      if (
        chann.find((channel) => channel.id === message.channelId) &&
        user.id !== message.author
      ) {
        chann.find((channel) => channel.id === message.channelId).unread = true;
        setChannels(chann);
        const favicon = document.getElementById("favicon");
        const title = document.getElementById("title");
        title.innerHTML = "Chateex - New message(s) !";
        favicon.href = notificationIcon;
      }
    });
  });
  useEffect(() => {
    const fetchChannels = async () => {
      var channelTo = [];
      try {
        const { data: chanls } = await axios.post(
          `${process.env.REACT_APP_API_URL}/channels/find`,
          { user: user }
        );
        channelTo = chanls;
      } catch (e) {
        setSnackBarMessage({
          success: false,
          message: "Could not connect to server",
        });
        setOpenSnack(true);
      }
      for (let i = 0; i < channelTo.length; i++) {
        if (channelTo[i].private) {
          const otherUserId = channelTo[i].members?.find(
            (other) => other !== user.id
          );
          try {
            const { data: usr } = await axios.get(
              `${process.env.REACT_APP_API_URL}/users/${otherUserId}`
            );
            channelTo[i].name = usr.firstname + " " + usr.lastname;
            channelTo[i].avatarUrl = usr.avatarUrl;
          } catch (err) {
            setSnackBarMessage({
              success: false,
              message: "Problem loading channels.",
            });
            setOpenSnack(true);
          }
        }
      }
      setChannels(channelTo);
    };
    if (user) fetchChannels();
  }, [setChannels, setOpenSnack, setSnackBarMessage, user]);

  useEffect(() => {
    const fetchUser = async () => {
      const data = await axios.get(
        `${process.env.REACT_APP_API_URL}/users/email/${oauth?.email}`
      );
      if (!data.failed) {
        onUser(data.data);
        setColor(data.data.color ? data.data.color : "#414549");
        setImage(data.data?.theme);
      } else {
        setChannel({});
        setChannels([]);
        removeCookie("oauth");
      }
    };
    if (oauth) fetchUser();
    // eslint-disable-next-line
  }, [oauth?.email, onUser, setColor, setImage, removeCookie]);
  return (
    <div
      style={{
        ...styles.root,
        backgroundColor: color,
        background: image ? `url(${image.url})` : color,
      }}
      className="App"
    >
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            <Route
              exact
              path="/"
              element={
                <RequireAuth>
                  <Main />
                </RequireAuth>
              }
            />
            <Route
              exact
              path="/channels"
              element={
                <RequireAuth>
                  <Main />
                </RequireAuth>
              }
            />
            <Route
              exact
              path="/channels/:id"
              element={
                <RequireAuth>
                  <Main />
                </RequireAuth>
              }
            />
            <Route exact path="/signup" element={<SignUp />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/landing" element={<Landing />} />
          </Routes>
        </Router>
        <Snackbar
          open={openSnack}
          autoHideDuration={6000}
          onClose={handleCloseSnack}
        >
          {!snackbarMessage.success ? (
            <Alert severity="error">
              {snackbarMessage.message}{" "}
              <React.Fragment>
                <IconButton
                  size="small"
                  aria-label="close"
                  color="inherit"
                  onClick={handleCloseSnack}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </React.Fragment>
            </Alert>
          ) : (
            <Alert severity="success">
              {snackbarMessage.message}{" "}
              <React.Fragment>
                <IconButton
                  size="small"
                  aria-label="close"
                  color="inherit"
                  onClick={handleCloseSnack}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </React.Fragment>
            </Alert>
          )}
        </Snackbar>
      </ThemeProvider>
    </div>
  );
};

function RequireAuth({ children }) {
  let { user } = useContext(Context);
  let location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} />;
  }
  return children;
}

export default App;
