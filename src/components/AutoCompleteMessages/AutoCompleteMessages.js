import React, { useContext, useState } from "react";
import "./AutoCompleteMessages.css";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { Context } from "../Context/Context";
import List from "@mui/material/List";
import { ListItem, Typography } from "@mui/material";
import { Link } from "react-router-dom";
const AutoCompleteMessages = ({ placeholder }) => {
  const { messages } = useContext(Context);
  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");

  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);
    const newFilter = messages.filter((value) => {
      return value?.content?.toLowerCase()?.includes(searchWord.toLowerCase());
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
            <SearchIcon sx={{ color: "#8e9297" }} />
          ) : (
            <CloseIcon
              id="clearBtn"
              sx={{ color: "#8e9297" }}
              onClick={clearInput}
            />
          )}
        </div>
      </div>
      {filteredData.length !== 0 && (
        <div className="dataResultMessages">
          {filteredData?.slice(0, 15).map((value, index) => {
            return (
              <List key={index}>
                <ListItem
                  key={index}
                  component={Link}
                  to={"#" + value.id}
                  alignItems="flex-start"
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#b8bbbd",
                      marginTop: "2px",
                      textDecoration: "underline",
                    }}
                  >
                    {new Date(value.creation).getDay() +
                      "/" +
                      new Date(value.creation).getMonth() +
                      "/" +
                      new Date(value.creation).getFullYear()}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#b8bbbd" }}>
                    {value?.content}
                  </Typography>
                </ListItem>
              </List>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AutoCompleteMessages;
