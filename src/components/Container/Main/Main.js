import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import LeftContainer from "../LeftContainer/LeftContainer";
import Channel from "../Channel/Channel";
import { Context } from "../../Context/Context";

const drawerWidth = 270;

const Main = (props) => {
  const { window } = props;
  const { mobileOpen, setMobileOpen, image } = React.useContext(Context);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box
      style={{ background: "transparent!important" }}
      sx={{
        bgcolor:'transparent!important',
        height: "100%",
        width: "100%",
        display: "flex",
      }}
    >
      <Box
        style={{ background: "transparent!important" }}
        sx={{
          bgcolor:'transparent!important',
          maxHeight: "100%",
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
        }}
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          style={{ background: "transparent!important" }}
          sx={{
            bgcolor:'transparent!important',
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              border: "none",
              width: { xs: "100%", sm: 350 },
              bgcolor: { xs: "rgba(0,0,0,1)",  sm: image ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.3)" },
            },
          }}
        >
          <LeftContainer />
        </Drawer>
        <Drawer
          variant="permanent"
          open
          style={{ background: "transparent!important" }}
          sx={{
            bgcolor:'transparent!important',
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              border: "none",
              width: drawerWidth,
              bgcolor: { xs: "rgba(0,0,0,1)",  sm: image ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.3)" },
            },
          }}
        >
          <LeftContainer />
        </Drawer>
      </Box>
      <Box sx={{ width: "100%" }}>
        <Channel handleDrawerToggle={handleDrawerToggle} />
      </Box>
    </Box>
  );
};
export default Main;
