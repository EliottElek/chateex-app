import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { Button, Grid, Typography, Paper, Modal } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "../../assets/icon.png";
import Toolbar from "@mui/material/Toolbar";
import "./landing.css";
import { Link } from "react-router-dom";
import simple from "../../assets/simple.svg";
import safe from "../../assets/safe.svg";
import reliable from "../../assets/reliable.svg";
import Footer from "./Footer";
import { Context } from "../Context/Context";
const styles = {
  button: {
    borderRadius: "40px",
    boxShadow: " 0 2px 4px 0 rgba(0,0,0,.1)",
    width: "100%",
    minWidth: "120px",
    border: "solid 1px #a437cb",
    margin: "5px 10px 5px 10px",
  },
};
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  color: "#ccd9e5",
  bgcolor: "rgba(0,0,0,0.8)",
  boxShadow: 24,
  borderRadius: "12px",
  p: 4,
};
const drawerWidth = 240;

const ResponsiveDrawer = (props) => {
  const { setCookie, cookies } = React.useContext(Context);
  const [openCookieModal, setOpenCookieModal] = React.useState(
    !cookies.cookiesConsent
  );
  const { wind } = props;
  setCookie("visited", true);
  !cookies.visited && window.location.reload();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  // const [readMe, setReadMe] = React.useState("");
  // React.useEffect(() => {
  //   fetch(readme)
  //     .then((res) => res.text())
  //     .then((text) => setReadMe(text));
  // });
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const handleConsent = () => {
    setCookie("cookiesConsent", true);
    setOpenCookieModal(false);
  };
  const drawer = (
    <div style={{ background: "rgba(0,0,0,0.8)", flexGrow: 1 }}>
      <Toolbar>
        <a href="/landing" className="logo">
          <img style={{ width: "40px" }} src={logo} alt={"logo"} />
          <h3 className="title2">Chateex</h3>
        </a>
      </Toolbar>
      <Divider />
      <List style={{ background: "transparent" }}>
        <ListItem key="login">
          <Button sx={styles.button} component={Link} to="/channels">
            log in
          </Button>
        </ListItem>
        <ListItem key="signup">
          <Button
            color="primary"
            style={{
              background: "linear-gradient(to right, #a239c9, #6600ff)",
              border: "none",
            }}
            variant="contained"
            sx={styles.button}
            component={Link}
            to="/signup"
          >
            Sign up
          </Button>
        </ListItem>
      </List>
    </div>
  );

  const container = wind !== undefined ? () => wind().document.body : undefined;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        bgcolor: "#414549",
        color: "#ffffff",
      }}
    >
      <AppBar
        position="fixed"
        sx={{
          bgcolor: "#2d3033",
          width: { sm: `100%` },
          boxShadow: " 0 2px 4px 0 rgba(0,0,0,.4)",
        }}
      >
        <Toolbar
          sx={{
            width: { sm: `80%`, xs: "90%" },
            display: "flex",
            justifyContent: "space-between",
            margin: "auto",
            padding: "14px",
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ mr: 2, display: { md: "none" } }} />
          <a href="/landing" className="logo">
            <img style={{ width: "70px" }} src={logo} alt={"logo"} />
            <h3 className="title">Chateex</h3>
          </a>
          <Box style={{ flexGrow: 1 }} />
          <Box sx={{ mr: 2, display: { md: "flex", sm: "none", xs: "none" } }}>
            <a href="#application" className="menuItem">
              application
            </a>
            <a href="#features" className="menuItem">
              features
            </a>
            <Button sx={styles.button} component={Link} to="/channels">
              log in
            </Button>
            <Button
              color="primary"
              style={{
                background: "linear-gradient(to right, #a239c9, #6600ff)",
                border: "none",
              }}
              variant="contained"
              sx={styles.button}
              component={Link}
              to="/signup"
            >
              Sign up
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{
          display: { xs: "block", sm: "none" },
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
        }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: `100%` }}
        style={{ height: "100vh", overflowY: "auto" }}
      >
        <Toolbar />
        <div className="headerContainer">
          <div className="textContainer">
            <Typography variant="h4">Simple, safe, reliable.</Typography>
            <Typography
              component="div"
              style={{ display: "flex", marginTop: "25px", fontWeight: "bold" }}
              variant="h6"
            >
              With{" "}
              <a href="/landing" className="logo">
                <img
                  style={{ width: "30px", marginLeft: "5px" }}
                  src={logo}
                  alt={"logo"}
                />
                <p className="titleMini">Chateex</p>
              </a>
              ,
            </Typography>
            <Typography variant="h6">
              you'll get fast, simple secure messaging for free. Instant chat
              with the ones you love, add reactions, GIfs, upload pictures and
              much more...
            </Typography>
            <Button
              sx={styles.button}
              component={Link}
              to="/channels"
              style={{ marginTop: "70px", width: "80%", height: "50px" }}
            >
              log in
            </Button>
            <Button
              id="application"
              color="primary"
              style={{
                width: "80%",
                height: "50px",
                background: "linear-gradient(to right, #a239c9, #6600ff)",
                border: "none",
              }}
              variant="contained"
              sx={styles.button}
              component={Link}
              to="/signup"
            >
              Sign up
            </Button>
          </div>
          <img
            src={
              "https://user-images.githubusercontent.com/64375473/146656879-228af201-9d0a-49af-838b-a8d02e62fa48.gif"
            }
            alt="chat"
            className="chatPic"
          />
        </div>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12} lg={4} xl={4}>
            <div className="paper">
              <Typography variant="h4" align="center">
                Simple
              </Typography>
              <img src={simple} alt="simple" />
              <Typography paragraph align="left" sx={{ p: 3 }}>
                Chateex is the simplest chat application you'll ever get. Create
                group chats with your friends, have private conversations with
                them, send GIFs, emojis, medias, add reactions, add others
                friends to already existing chat groups, modify and delete group
                chats.
              </Typography>
              <div id="features" />
            </div>
          </Grid>
          <Grid item xs={12} md={12} lg={4} xl={4}>
            <div className="paper">
              <Typography variant="h4" align="center">
                Safe
              </Typography>
              <img src={safe} alt="safe" />
              <Typography paragraph align="left" sx={{ p: 3 }}>
                Your connection to Chateex is fully secured and all password are
                encrypted. You'll only have access to conversations you created
                or the one you've been added to. None-admin members of a group
                chat do not have rights to modify settings of a group chat, or
                manage its access.
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12} md={12} lg={4} xl={4}>
            <div className="paper">
              <Typography variant="h4" align="center">
                Reliable
              </Typography>
              <img src={reliable} alt="reliable" />
              <Typography paragraph align="left" sx={{ p: 3 }}>
                Chateex was developped with very reliable frameworks and tools.
                The application is very stable and every error is handled with a
                proper message. You won't have to worry about not knowing if the
                server is responding or not; you'll be alerted.
              </Typography>
            </div>
          </Grid>
        </Grid>
        <Paper elevation={0} className="featuresPaper">
          <Typography variant="h4" style={{ fontWeight: "bold" }}>
            Latest features{" "}
            <Typography component="span">Version : 0.1.0</Typography>
          </Typography>
          <Divider />
          <Typography
            style={{ marginTop: "25px", fontWeight: "bold" }}
            variant="h5"
          >
            Private conversations
          </Typography>
          <Divider />
          <Typography style={{ marginTop: "10px" }}>
            Possibility to create private conversations in one click, without
            having to create a group chat only composed of two people. When One
            user deletes the conversation, it's deleted for both persons. The
            conversation is fully private. If you're tempted to create a new
            conversation with a user you alredy have a conversation with, it
            will automatically redirect you to it. If it's the first time you
            ever communicate with this person, or if the conversation was
            previously deleted, it will create a new one.
          </Typography>
          <Divider />
          <Typography
            style={{ marginTop: "25px", fontWeight: "bold" }}
            variant="h5"
          >
            Chat groups as an{" "}
            <span style={{ fontWeight: "bold" }}>administrator</span>
          </Typography>
          <Divider />
          <Typography style={{ marginTop: "10px" }}>
            You can create chat groups with the people you like. Feel free to
            give it a name and choose a picture for the group. If you don't feel
            like uploading a picture for it yet, don't worry; this is the kind
            of changes you can make later. If you're the one who created the
            group, you're the administrator, meaning that you have all the
            rights. You can add or remove people, change the picture and the
            name of the group chat, and even delete the channel. If you delete
            the channel, it will be deleted for every body else. You cannot
            leave the channel.
          </Typography>
          <Divider />
          <Typography
            style={{ marginTop: "25px", fontWeight: "bold" }}
            variant="h5"
          >
            Chat groups as a <span style={{ fontWeight: "bold" }}>guest</span>
          </Typography>
          <Divider />
          <Typography style={{ marginTop: "10px" }}>
            Congratulations, you've just been added to a group chat, as you can
            see on your left pannel. As a guest, you can view and write
            messages. You are also free to leave the channel anytime you want.
            Unfortunatly, you don't have the same rights as an administrator.
          </Typography>
          <Divider />
          <Typography
            style={{ marginTop: "25px", fontWeight: "bold" }}
            variant="h5"
          >
            Reactions & Emojis{" "}
            <span aria-labelledby="icons" role="img">
              👍 🤩 🥳
            </span>
          </Typography>
          <Divider />
          <Typography style={{ marginTop: "10px" }}>
            What would be a decent chat application without the ability to add
            reactions to messages and add emojis in your messages ? With
            Chateex, we made all that easy for you. Feel free to react to any
            comment (including yours, because, why not ?) by clicking on a
            message, then clicking on the emoji icon. If you've already reacted
            to the comment you want to add a reaction to, it will simply
            override the previous one. When wanting to add an emoji in your
            messages, simply click on the emoji icon on the right side of the
            input field.
            <br />
            If you are on <span style={{ fontWeight: "bold" }}>MacOS</span>, you
            can simply type{" "}
            <span style={{ fontWeight: "bold" }}>
              Control + Command + space{" "}
            </span>
            to open the emoji modal.
          </Typography>
          <Divider />
          <Typography
            style={{ marginTop: "25px", fontWeight: "bold" }}
            variant="h5"
          >
            GIF picker
          </Typography>
          <Divider />
          <Typography style={{ marginTop: "10px" }}>
            Bored of using plain text to express yourself ? The GIF picker was
            made for you ! Simply click on the gif icon on the right side of
            your input field to add a gif. There's also a search field for you
            to let your imagination fly.
          </Typography>
          <Divider />
          <Typography
            style={{ marginTop: "25px", fontWeight: "bold" }}
            variant="h5"
          >
            Markdown support
          </Typography>
          <Divider />
          <Typography style={{ marginTop: "10px" }}>
            Our application supports markdown. feel free to add italic, bold,
            title sized text. Read the{" "}
            <a
              style={{ color: "#9d34cd" }}
              href="https://www.markdownguide.org/basic-syntax/"
              target="blank"
            >
              Markdown documentation{" "}
            </a>
            to learn more.
          </Typography>
          <Divider />
          <Typography
            style={{ marginTop: "25px", fontWeight: "bold" }}
            variant="h5"
          >
            Modify a message
          </Typography>
          <Divider />
          <Typography style={{ marginTop: "10px" }}>
            What's more upsetting than to have misstyped a message and have to
            write it again, risking to look clumsy ? Well, you should'nt worry
            about it anymore. You can edit the messages you sent (and only the
            ones you sent{" "}
            <span aria-labelledby="icons" role="img">
              🙄
            </span>
            ) as much as you desire. A simple "modified" will be added at the
            end of the message to notify the other users that the message has
            been modified.
          </Typography>
          <Divider />
          <Typography
            style={{ marginTop: "25px", fontWeight: "bold" }}
            variant="h5"
          >
            Delete a message
          </Typography>
          <Divider />
          <Typography style={{ marginTop: "10px" }}>
            You can delete any message you sent. When doing so, the other users
            will be notified that you deleted the message, but its content will
            not appear anymore.
          </Typography>
          <Divider />
          <Typography
            style={{ marginTop: "25px", fontWeight: "bold" }}
            variant="h5"
          >
            Autocomplete search bars
          </Typography>
          <Divider />
          <Typography style={{ marginTop: "10px" }}>
            Having trouble finding a conversation in your list of hundreds of
            channels ? The autocomplete search bar is here to help you save time
            when wanting to get in contact someone.
          </Typography>
          <Divider />
          <Typography
            style={{ marginTop: "25px", fontWeight: "bold" }}
            variant="h5"
          >
            Ultra-responsive design
          </Typography>
          <Divider />
          <Typography style={{ marginTop: "10px" }}>
            Our app was tought to be used on every screen sizes, on mobile,
            tablets and others.
          </Typography>
          <Divider />
          <Typography
            style={{ marginTop: "25px", fontWeight: "bold" }}
            variant="h5"
          >
            Statistics
          </Typography>
          <Divider />
          <Typography style={{ marginTop: "10px" }}>
            You'll have access to certain statistics such as the number of sent
            messages, the number of deleted messages or the number of modified
            messages.
          </Typography>
        </Paper>
        <Footer />
      </Box>
      <Modal
        open={openCookieModal}
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Our application uses cookies.
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Cookies are usefull to help us provide you with the best user
            experience as possible.
          </Typography>
          <Button
            variant={"contained"}
            style={{ width: "100%", marginTop:"18px"}}
            onClick={handleConsent}
          >
            Got it !
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default ResponsiveDrawer;
