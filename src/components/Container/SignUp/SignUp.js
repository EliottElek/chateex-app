import React, { useState } from "react";
import {
  Card,
  Button,
  Typography,
  Modal,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  Box,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { Context } from "../../Context/Context";
import { useNavigate } from "react-router-dom";
import avatars from "../../../data/avatars";
import gravatar from "gravatar";
const { v4: uuid } = require("uuid");
const bcrypt = require("bcryptjs");

const styles = {
  root: {
    width: "100%",
    height: "100vh",
    background: "transparent",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "auto",
  },
  modal: {
    color: "#fefefe",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: 350,
    minWidth: 300,
    height: "70%",
    bgcolor: "rgb(0,0,0,0.6)",
    borderRadius: "8px",
    boxShadow: 24,
    p: 4,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    borderRadius: "8px",
    display: "flex",
    width: "100%",
    maxWidth: "400px",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "40px",
    marginBottom: "40px",
    padding: "30px 30px 30px 30px",
  },
  input: {
    height: "30px",
    marginBottom: "10px",
    marginTop: "5px",
    border: "solid 0.5px black",
    width: "95%",
    borderRadius: "5px",
    padding: "8px",
    color: "#d6d8d9",
    background: "rgb(0,0,0,0.2)",
    fontSize: "1rem",
  },
  label: {
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
  errorMessage: {
    color: "#DB4437",
    fontSize: "0.7rem",
    textTransform: "none",
  },
  form: {
    color: "white",
    width: "100%",
  },
  link: {
    fontSize: " 0.9rem",
    textAlign: "center",
    marginTop: "15px",
    display: "flex",
    alignItems: "center",
  },
  sign: {
    margin: 0,
    padding: 0,
    marginLeft: "2px",
  },
  iconGithub: {
    marginLeft: "10px",
  },
  googleLog: {
    transition: "0.1 ease-in",
    bgcolor: "#0F9D58",
    "&:hover": {
      bgcolor: "#0F9D58",
      opacity: "0.8",
      transition: "0.1s ease-in",
    },
  },
  githubLog: {
    transition: "0.1 ease-in",
    bgcolor: "#6e5494",
    "&:hover": {
      bgcolor: "#6e5494",
      opacity: "0.8",
      transition: "0.1s ease-in",
    },
  },
  iconGoogle: {
    marginLeft: "7px",
  },
};
//Login Form
const SignUp = () => {
  const {
    onUser,
    setCookie,
    setOpenSnack,
    setSnackBarMessage,
    setChannel,
    image,
  } = useContext(Context);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [emptyFirsrtnameMessage, setEmptyFirstnameMessage] = useState("");
  const [emptyLastnameMessage, setEmptyLastnameMessage] = useState("");
  const [emptyEmailMessage, setEmptyEmailMessage] = useState("");
  const [emptyPassMessage, setEmptyPassMessage] = useState("");
  const [emptyPassCheckMessage, setEmptyPassCheckMessage] = useState("");

  const [openAvatarModal, setOpenAvatarModal] = useState(false);

  const handleChangeFirstname = (event) => {
    setFirstname(event.target.value);
  };
  const handleChangeLastname = (event) => {
    setLastname(event.target.value);
  };
  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };
  const handleChangePasswordCheck = (event) => {
    setPasswordCheck(event.target.value);
  };
  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (firstname === "") {
      setEmptyFirstnameMessage("- Please enter your firstname.");
    } else {
      setEmptyFirstnameMessage("");
    }
    if (lastname === "") {
      setEmptyLastnameMessage("- Please enter your lastname.");
    } else {
      setEmptyLastnameMessage("");
    }
    if (email === "") {
      setEmptyEmailMessage("- Please enter your email.");
    } else {
      setEmptyEmailMessage("");
    }
    if (password === "") {
      setEmptyPassMessage("- Please enter your password.");
    } else {
      setEmptyPassMessage();
    }
    if (passwordCheck === "") {
      setEmptyPassCheckMessage("- Please verify your password.");
    } else {
      setEmptyPassCheckMessage("");
    }
    if (passwordCheck !== password) {
      setEmptyPassCheckMessage("- Passwords don't match.");
    } else {
      setEmptyPassCheckMessage("");
    }
    if (
      password !== "" &&
      email !== "" &&
      lastname !== "" &&
      firstname !== "" &&
      password === passwordCheck
    ) {
      const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync());
      const userToAdd = {
        id: uuid(),
        avatarUrl:
          avatar || gravatar.url(email, { s: "100", r: "x", d: "retro" }, true),
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: hashedPassword,
        channelsList: [],
      };
      try {
        const res = await axios.post(`http://localhost:3001/users`, userToAdd);
        console.log(res);
        if (res.data.create === false) {
          setEmptyEmailMessage(res.data.message);
        } else {
          setEmptyEmailMessage("all good");
          console.log(res.data.user.email)
          setCookie("oauth", {
            openid: false,
            id_token: res.data.token,
            access_token: res.data.token,
            email: res.data.user.email,
          });
          setChannel({});
          onUser(userToAdd);
          setSnackBarMessage({
            success: true,
            message: `Welcome ${userToAdd.firstname} !`,
          });
          navigate("/channels");
          setOpenSnack(true);
        }
      } catch (err) {
        setSnackBarMessage({
          success: false,
          message: "Could not connect to server. Try again later.",
        });
        setOpenSnack(true);
      }
    }
  };

  return (
    <div style={styles.root}>
      <Card
        sx={{
          ...styles.card,
          background: image ? "rgb(0,0,0,0.6)" : "rgb(0,0,0,0.3)",
        }}
        elevation={5}
      >
        <Avatar style={{ width: 130, height: 130 }} src={avatar} />
        <IconButton
          onClick={() => setOpenAvatarModal(true)}
          style={{
            marginTop: "-40px",
            marginRight: "-80px",
            backgroundColor: "#36393e",
            border: "solid 1px #f5f5f5",
          }}
        >
          <EditIcon sx={{ color: "#bdbdbd" }} />
        </IconButton>
        <form style={styles.form} onSubmit={handleSubmit}>
          <label style={styles.label}>
            Firstname
            <span style={styles.errorMessage}>{emptyFirsrtnameMessage}</span>
          </label>
          <input
            autoComplete="on"
            onChange={handleChangeFirstname}
            value={firstname}
            style={styles.input}
            placeholder="Your firstname..."
            type="name"
          />
          <br />
          <label style={styles.label}>
            Lastname
            <span style={styles.errorMessage}>{emptyLastnameMessage}</span>
          </label>
          <input
            autoComplete="on"
            onChange={handleChangeLastname}
            value={lastname}
            style={styles.input}
            placeholder="Your lastname..."
            type="name"
          />
          <label style={styles.label}>
            Email <span style={styles.errorMessage}>{emptyEmailMessage}</span>
          </label>
          <input
            autoComplete="on"
            onChange={handleChangeEmail}
            value={email}
            style={styles.input}
            placeholder="Your email..."
            type="email"
          />
          <label style={styles.label}>
            Password <span style={styles.errorMessage}>{emptyPassMessage}</span>
          </label>
          <input
            onChange={handleChangePassword}
            value={password}
            style={styles.input}
            placeholder="Your password..."
            type="password"
          />
          <label style={styles.label}>
            Confirm password
            <span style={styles.errorMessage}>{emptyPassCheckMessage}</span>
          </label>
          <input
            onChange={handleChangePasswordCheck}
            value={passwordCheck}
            style={styles.input}
            placeholder="Confirm your password..."
            type="password"
          />
          <Button
            type="submit"
            variant="contained"
            onClick={handleSubmit}
            style={styles.button}
          >
            Create Account
          </Button>
          <Typography style={styles.link}>
            Already have an account ?
            <Button style={styles.sign} component={Link} to={"/login"}>
              Log in.
            </Button>
          </Typography>
        </form>
      </Card>
      <Modal open={openAvatarModal} onClose={() => setOpenAvatarModal(false)}>
        <Box sx={styles.modal}>
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
                onClick={(e) => {
                  setAvatar(avatar.url);
                  if (avatar !== "") {
                    setOpenAvatarModal(false);
                  }
                }}
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
    </div>
  );
};
export default SignUp;