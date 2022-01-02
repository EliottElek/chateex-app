import { Grid, Typography, Link } from "@mui/material";
import React from "react";
import logo from "../../assets/icon.png";
const Footer = () => {
  return (
    <>
      <div
        style={{
          marginTop: "60px",
          padding: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
      </div>
      <div
        style={{
          padding: "2px 60px 20px 60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Grid container>
          <Grid xs={12} md={6} lg={3} xl={3} item>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <img
                src={logo}
                alt={logo}
                width="75px"
                style={{ marginBottom: "10px" }}
              />
              <Typography variant="caption">23 rue du Général JEECE</Typography>
              <Typography variant="caption">75015 Paris</Typography>
              <Typography variant="body1">tel : 06 12 23 34 45</Typography>
            </div>
          </Grid>
          <Grid xs={12} md={6} lg={3} xl={3} item>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <Link
                style={{ marginTop: "12px", marginBottom: "8px" }}
                to="/"
                variant="body1"
              >
                Who are we ?
              </Link>
              <Link style={{ marginBottom: "8px" }} to="/" variant="body1">
                News
              </Link>
              <Link to="/" variant="body1">
                FAQ
              </Link>
            </div>
          </Grid>
          <Grid xs={12} md={6} lg={3} xl={3} item>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <Link
                style={{ marginTop: "12px", marginBottom: "8px" }}
                to="/"
                variant="body1"
              >
                Contact us
              </Link>
              <Link style={{ marginBottom: "8px" }} to="/" variant="body1">
                Legals
              </Link>
              <Link to="/" variant="body1">
                CGV
              </Link>
            </div>{" "}
          </Grid>{" "}
          <Grid xs={12} md={6} lg={3} xl={3} item>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <Link
                style={{ marginTop: "12px", marginBottom: "8px" }}
                to="/"
                variant="body1"
              >
                CGU
              </Link>
              <Link style={{ marginBottom: "8px" }} to="/" variant="body1">
                Cookies
              </Link>
              <Link to="/" variant="body1">
                Personnal data
              </Link>
            </div>{" "}
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default Footer;
