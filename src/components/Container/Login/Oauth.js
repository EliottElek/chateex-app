import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import crypto from "crypto";
import qs from "qs";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// Layout
import { Typography, CircularProgress } from "@mui/material";
import LoginRedirect from "./Login";
import { useContext } from "react";
import { Context } from "../../Context/Context";

const base64URLEncode = (str) => {
  return str
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
};

const sha256 = (buffer) => {
  return crypto.createHash("sha256").update(buffer).digest();
};

const Redirect = ({ codeVerifier, config }) => {
  const redirect = (e) => {
    e.stopPropagation();
    const code_challenge = base64URLEncode(sha256(codeVerifier));
    const url = [
      `${config.authorization_endpoint}?`,
      `client_id=${config.client_id}&`,
      `scope=${config.scope}&`,
      `response_type=code&`,
      `redirect_uri=${config.redirect_uri}&`,
      `code_challenge=${code_challenge}&`,
      `code_verifier=${codeVerifier}&`,
      `code_challenge_method=S256`,
    ].join("");
    window.location = url;
  };
  return (
    <div>
      <LoginRedirect redirect={redirect} />
    </div>
  );
};
const Tokens = ({ oauth }) => {
  const navigate = useNavigate();
  const { setOauth } = useContext(Context);
  setOauth(oauth);
  useEffect(() => {
    navigate("/channels");
  }, [navigate]);
  return null;
};
const LoadToken = ({
  code,
  config,
  codeVerifier,
  removeCookie,
  setCookie,
  setSuccess,
  success,
  setOauth,
}) => {
  const navigate = useNavigate();

  // const headers = { Authorization: `Bearer ${accessToken}` };
  useEffect(() => {
    const fetch = async () => {
      try {
        const { data: oauth } = await axios.post(
          config.token_endpoint,
          qs.stringify({
            grant_type: "authorization_code",
            client_id: `${config.client_id}`,
            code_verifier: `${codeVerifier}`,
            redirect_uri: `${config.redirect_uri}`,
            code: `${code}`,
          })
        );
        removeCookie("code_verifier");
        setCookie("oauth", oauth);
        setOauth(oauth);
        setSuccess(true);
        navigate("/");
      } catch (err) {
        setSuccess(false);
      }
    };
    fetch();
  }, [
    codeVerifier,
    config.client_id,
    navigate,
    removeCookie,
    setCookie,
    setOauth,
    setSuccess,
    code,
    config.redirect_uri,
    config.token_endpoint,
  ]);
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        backgroundColor: "#2f3136",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {success ? (
        <>
          <CircularProgress sx={{ color: "#D9E2EC", marginBottom: "20px" }} />
          <Typography sx={{ color: "#D9E2EC" }}>Loading tokens...</Typography>
        </>
      ) : (
        <Typography sx={{ color: "#D9E2EC" }}>
          {(setTimeout(() => navigate("/")), 1000)}
        </Typography>
      )}
    </div>
  );
};

export default function Login() {
  const { oauth, setOauth, onUser } = useContext(Context);
  const [success, setSuccess] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies([]);
  const config = {
    authorization_endpoint: "http://127.0.0.1:5556/dex/auth",
    token_endpoint: "http://127.0.0.1:5556/dex/token",
    client_id: "webtech-frontend",
    redirect_uri: "http://127.0.0.1:3000/login",
    scope: "openid%20profile%20email%20offline_access",
    jwks_uri: "http://127.0.0.1:5556/dex/keys",
    userinfo_endpoint: "http://127.0.0.1:5556/dex/userinfo",
    device_authorization_endpoint: "http://127.0.0.1:5556/dex/device/code",
  };
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  // Is there a code query parameters in the url
  if (!code) {
    // No: we are no being redirected from an oauth server
    if (!oauth) {
      const codeVerifier = base64URLEncode(crypto.randomBytes(32));
      setCookie("code_verifier", codeVerifier);

      return <Redirect codeVerifier={codeVerifier} config={config} />;
    } else {
      // Yes: user is already logged in, great, it is working
      return <Tokens oauth={oauth} />;
    }
  } else {
    // Yes, we are coming from an oauth server
    return (
      <LoadToken
        code={code}
        codeVerifier={cookies.code_verifier}
        config={config}
        setCookie={setCookie}
        cookies={cookies}
        removeCookie={removeCookie}
        success={success}
        setSuccess={setSuccess}
        setOauth={setOauth}
        onUser={onUser}
      />
    );
  }
}
