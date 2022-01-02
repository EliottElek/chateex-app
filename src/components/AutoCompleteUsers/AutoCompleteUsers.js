import React, { useState } from "react";
import "./AutoCompleteUsers.css";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import List from "@mui/material/List";
import { ListItem, Checkbox, ListItemAvatar, ListItemText } from "@mui/material";
import StyledAvatar from "../StyledAvatar/StyledAvatar";
const AutoCompleteUsers = ({ placeholder, members, handleToggle, checked }) => {
  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");

  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);
    const newFilter = members.filter((value) => {
      return (
        value?.firstname?.toLowerCase().includes(searchWord.toLowerCase()) ||
        value?.lastname?.toLowerCase().includes(searchWord.toLowerCase())
      );
    });

    if (searchWord === "") {
      setFilteredData([]);
    } else {
      setFilteredData(newFilter);
    }
  };

  const clearInput = () => {
    setFilteredData([]);
    setWordEntered("");
  };

  return (
    <div className="search">
      <div className="searchInputs">
        <input
          type="text"
          placeholder={placeholder}
          value={wordEntered}
          onChange={handleFilter}
        />
        <div className="searchIcon">
          {filteredData.length === 0 ? (
            <SearchIcon sx={{ color: "#fefefe" }} />
          ) : (
            <CloseIcon
              id="clearBtn"
              sx={{ color: "#fefefe" }}
              onClick={clearInput}
            />
          )}
        </div>
      </div>
      {filteredData.length !== 0 && (
        <div className="dataResultUsers">
          {filteredData.slice(0, 15).map((user, index) => {
            return (
              <List key={index}>
                <ListItem
                  sx={{
                    color: "#fefefe",
                    bgcolor: "#2e3136",
                    margin: "4px",
                    borderRadius: "4px",
                    padding: "4px",
                  }}
                  key={user.id}
                  secondaryAction={
                    <Checkbox
                      sx={{ color: "#fefefe" }}
                      edge="end"
                      onChange={handleToggle(user)}
                      checked={checked.indexOf(user) !== -1}
                    />
                  }
                >
                  <ListItemAvatar>
                    <StyledAvatar user={user} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={user.firstname + " " + user.lastname}
                  />
                </ListItem>{" "}
              </List>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AutoCompleteUsers;
