import React, { useEffect } from "react";
import axios from "axios";
import { CircularProgress, List, Typography } from "@mui/material";
import MessageForm from "./MessageForm/MessageForm";
import Message from "./Message/Message";
import AppBar from "./AppBar/AppBar";
import Divider from "@mui/material/Divider";
import { useContext } from "react";
import { Context } from "../../Context/Context";
import image from "../../../assets/emptychat.svg";
import { useParams } from "react-router";
const styles = {
  grid: {
    height: "100%",
    wwidth: "100%",
    background: "transparent",
    display: "grid",
    gridTemplateRows: "55px auto 55px",
  },
  middleContainer: {
    flexGrow: 1,
    overflowY: "auto",
    width: "100%",
  },
  header: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-around",
    color: "#D9E2EC",
  },
  message: {
    background: "transparentf",
    padding: "5px",
  },
  item: {
    background: "transparent",
  },
  info: {
    color: "#D9E2EC",
    margin: "12px",
  },
};

const Channel = ({ handleDrawerToggle }) => {
  const { id } = useParams();
  const { messages, channel, user, channels, setChannel, setMembers, members } =
    useContext(Context);
  useEffect(() => {
    const fetch = async () => {
      const chann = channels.find((c) => c.id === id);
      if (chann) {
        setChannel(chann);
      }
    };
    fetch();
  }, [channels, id, setChannel]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const { data: usrs } = await axios.get(
          `${process.env.REACT_APP_API_URL}/users/getmembers/${id}`
        );
        setMembers(usrs);
      } catch (err) {
        console.error();
      }
    };
    if (members.length === 0 && id && id !== "undefined") fetchMembers();
  }, [id, setMembers, members]);
  return (
    <div style={styles.grid}>
      <div style={styles.header}>
        <AppBar handleDrawerToggle={handleDrawerToggle} />
      </div>
      {!messages ? (
        <CircularProgress />
      ) : (
        <>
          <div id="middleContainer" style={styles.middleContainer}>
            {!channel.name && (
              <div
                style={{
                  width: "60%",
                  height: "60%",
                  display: "flex",
                  flexGrow: 1,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "auto",
                  marginTop: "90px",
                  color: "#edf1f3",
                }}
              >
                <img width="100%" height="100%" src={image} alt="chat" />
                <Typography variant="h6">Looks pretty empty here...</Typography>
                <Typography variant="caption">
                  Select a channel on the left pannel or create a new one.
                </Typography>
              </div>
            )}
            {channel?.name !== undefined && messages?.length === 0 && (
              <Typography style={styles.info}>
                No message yet in this channel.
              </Typography>
            )}
            {messages.length !== 0 && (
              <List
                key={user.id}
                sx={{ width: "100%", bgcolor: "transparent" }}
              >
                {messages?.map((message, index) => (
                  <div key={message.id}>
                    {index > 0 &&
                      Math.abs(
                        new Date(message.creation) -
                          new Date(messages[index - 1].creation)
                      ) >= 600000 && (
                        <Divider>
                          <Typography variant="caption" color="#f5f5f5">
                            {new Date(message.creation).getDate() +
                              "/" +
                              (new Date(message.creation).getMonth() + 1) +
                              "/" +
                              new Date(message.creation).getFullYear()}
                          </Typography>
                        </Divider>
                      )}
                    {index === 0 && (
                      <Divider>
                        <Typography variant="caption" color="#f5f5f5">
                          {new Date(message.creation).getDate() +
                            "/" +
                            (new Date(message.creation).getMonth() + 1) +
                            "/" +
                            new Date(message.creation).getFullYear()}
                        </Typography>
                      </Divider>
                    )}
                    {index === 0 && (
                      <Message message={message} newUser={true} />
                    )}
                    {index > 0 &&
                      messages[index - 1].author !== message.author && (
                        <Message
                          key={message.id}
                          message={message}
                          newUser={true}
                        />
                      )}
                    {index > 0 &&
                      messages[index - 1].author === message.author && (
                        <Message
                          key={message.id}
                          message={message}
                          newUser={false}
                        />
                      )}
                  </div>
                ))}
              </List>
            )}
          </div>
          <div style={{ width: "100%" }} >
            <MessageForm />
          </div>
        </>
      )}
    </div>
  );
};

export default Channel;
