import { Card, Button, Modal, Box, Typography } from "@mui/material";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import React, { useState } from "react";
import { Divider } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { Context } from "../../Context/Context";
import { useNavigate } from "react-router-dom";

const styles = {
  root: {
    width: "100%",
    height: "100vh",
    background: "transparent",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    margin: "20px",
    bgcolor: "background.paper",
    borderRadius: "8px",
    border: "none",
    boxShadow: 24,
    p: 4,
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
  forgotPassword: {
    fontSize: "0.8rem",
  },
  sign: {
    margin: 0,
    padding: 0,
    marginLeft: "5px",
  },
  link: {
    fontSize: " 0.9rem",
    textAlign: "center",
    marginTop: "15px",
    display: "flex",
    alignItems: "center",
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
const Login = ({ redirect }) => {
  const navigate = useNavigate();
  const {
    onUser,
    setCookie,
    setSnackBarMessage,
    setOpenSnack,
    setChannel,
    image,
    setImage,
    setColor,
  } = useContext(Context);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emptyEmailMessage, setEmptyEmailMessage] = useState("");
  const [emptyPassMessage, setEmptyPassMessage] = useState("");
  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };
  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };
  const handleOpenModal = () => {
    setOpen(true);
  };
  const handleCloseModal = () => {
    setOpen(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (email === "") {
        setEmptyEmailMessage("- Please enter your email.");
      }
      if (password === "") {
        setEmptyPassMessage("- Please enter your password.");
      }
      if (password !== "" && email !== "") {
        const { data: resp } = await axios.post(`${process.env.REACT_APP_API_URL}/login`, {
          email: email,
          password: password,
        });
        if (resp.auth && resp.user) {
          setCookie("oauth", {
            openid : false,
            id_token: resp.token,
            access_token: resp.token,
            email: resp.user.email,
          });
          setEmptyEmailMessage("");
          setEmptyPassMessage("");
          setChannel({});
          setColor(resp.user.color ? resp.user.color : "#414549");
          setImage(resp.user?.theme);
          onUser(resp.user);
          navigate(`/channels/${resp.user.channelsList[0]}`);
        } else {
          setEmptyEmailMessage(resp.message);
          setEmptyPassMessage("");
        }
      }
    } catch (err) {
      setSnackBarMessage({
        success: false,
        message: "Could not connect to server. Try again later.",
      });
      setOpenSnack(true);
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
        <form style={styles.form} onSubmit={handleSubmit}>
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
          <Button
            style={styles.forgotPassword}
            onClick={handleOpenModal}
            variant="text"
          >
            Forgot password ?
          </Button>
          <Button
            type="submit"
            variant="contained"
            onClick={handleSubmit}
            style={styles.button}
          >
            Log in
          </Button>
          <Divider light={true}>or</Divider>
          <Button
            sx={styles.googleLog}
            variant="contained"
            style={styles.button}
            onClick={redirect}
          >
            Login with another application
          </Button>
          <Typography style={styles.link}>
            Don't have an account ?
            <Button style={styles.sign} component={Link} to={"/signup"}>
              Sign up !
            </Button>
          </Typography>
        </form>
      </Card>
      <Modal
        open={open}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styles.modal}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            This option is not available yet
          </Typography>
          <SentimentVeryDissatisfiedIcon />
        </Box>
      </Modal>
    </div>
  );
};
export default Login;
