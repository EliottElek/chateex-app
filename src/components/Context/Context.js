import axios from "axios";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import gravatar from "gravatar";
const { v4: uuid } = require("uuid");
export const Context = React.createContext();
export const ContextProvider = ({ children }) => {
  const [channel, setChannel] = useState({});
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [cookies, setCookie, removeCookie] = useCookies([]);
  const [channels, setChannels] = useState([]);
  const [oauth, setOauth] = useState(cookies.oauth);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [user, onUser] = useState(null);
  const [color, setColor] = useState(
    user && user.color ? user.color : "#414549"
  );
  const [image, setImage] = useState(null);
  //for snackBar
  const [snackbarMessage, setSnackBarMessage] = useState({});
  const [openSnack, setOpenSnack] = useState(false);
  return (
    <Context.Provider
      value={{
        color: color,
        image: image,
        setImage: setImage,
        setColor: setColor,
        cookies: cookies,
        setCookie: setCookie,
        removeCookie: removeCookie,
        snackbarMessage: snackbarMessage,
        setSnackBarMessage: setSnackBarMessage,
        openSnack: openSnack,
        setOpenSnack: setOpenSnack,
        handleCloseSnack: (event, reason) => {
          if (reason === "clickaway") {
            return;
          }
          setOpenSnack(false);
        },
        mobileOpen: mobileOpen,
        setMobileOpen: setMobileOpen,
        user: user,
        onUser: onUser,
        oauth: oauth,
        setOauth: async (oauth) => {
          if (oauth) {
            if (oauth.openid !== false) {
              const payload = JSON.parse(
                Buffer.from(oauth.id_token.split(".")[1], "base64").toString(
                  "utf-8"
                )
              );
              oauth.email = payload.email;
              oauth.name = payload.name;
            }
            const data = await axios.post(
              `${process.env.REACT_APP_API_URL}/users/email/${oauth.email}`,
              {
                user: {
                  id: uuid(),
                  avatarUrl: gravatar.url(
                    oauth.email,
                    { s: "100", r: "x", d: "retro" },
                    true
                  ),
                  firstname: oauth.name,
                  lastname: "",
                  email: oauth.email,
                  password: "",
                  channelsList: [],
                },
              }
            );
            onUser(data.data);
            setColor(data.data.color ? data.data.color : "#414549");
            setImage(data.data?.theme);
            setCookie("oauth", oauth);
          } else {
            setChannel({});
            setChannels([]);
            removeCookie("oauth");
          }
          setOauth(oauth);
        },
        handleLogOut: (e) => {
          e.stopPropagation();
          setChannel({});
          setChannels([]);
          removeCookie("oauth");
          setOauth(null);
          onUser(null);
        },
        messages: messages,
        setMessages: setMessages,
        addMessage: (message) => {
          setMessages([...messages, message]);
        },
        channels: channels,
        setChannels: setChannels,
        addChannel: (channel) => {
          setChannels([...channels, channel]);
        },
        removeChannel: (channelToRemove) => {
          const arr = channels.filter(function (item) {
            return item.id !== channelToRemove.id;
          });
          setChannels(arr);
          setChannel({});
        },
        channel: channel,
        setChannel: setChannel,
        handleChangeChannel: (newChannel) => {
          setChannel(newChannel);
        },
        addMembers: (membersToAdd) => {
          var newChannel = channel;
          newChannel.members = membersToAdd;
          setChannel(newChannel);
        },
        members: members,
        setMembers: setMembers,
      }}
    >
      {children}
    </Context.Provider>
  );
};
