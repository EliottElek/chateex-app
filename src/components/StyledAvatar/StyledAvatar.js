import * as React from "react";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import logo from "../../assets/icon.png";
const StyledBadgeActive = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    border: "none!important",
    backgroundColor: "#44b700",
  },
}));
const StyledBadgeInactive = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    border: "none!important",
    backgroundColor: "#EF3E2D",
  },
}));
export default function StyledAvatar({ size, group, font, user }) {
  if (group) user.active = true;
  return user?.active ? (
    <StyledBadgeActive
      overlap="circular"
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      variant="dot"
    >
      {group ? (
        <Avatar
          sx={{ height: size, width: size, fontSize: font }}
          alt="avatar"
          src={user.avatarUrl || logo}
        >
          #
        </Avatar>
      ) : (
        <Avatar
          sx={{ height: size, width: size }}
          alt="avatar"
          src={user?.avatarUrl}
        />
      )}
    </StyledBadgeActive>
  ) : (
    <StyledBadgeInactive
      overlap="circular"
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      variant="dot"
    >
      {group ? (
        <Avatar
          sx={{ height: size, width: size, fontSize: font }}
          alt="avatar"
          src={user.avatarUrl || logo}
        />
      ) : (
        <Avatar
          sx={{ height: size, width: size }}
          alt="avatar"
          src={user?.avatarUrl}
        />
      )}
    </StyledBadgeInactive>
  );
}
