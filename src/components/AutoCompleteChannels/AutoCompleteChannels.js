import React, { useContext, useState } from "react";
import "./AutoCompleteChannels.css";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { Context } from "../Context/Context";
import List from "@mui/material/List";
import ChannelItem from "../Container/Channels/ChannelItem/ChannelItem";
const AutoCompleteChannels = ({ placeholder }) => {
  const { channels } = useContext(Context);
  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");

  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);
    const newFilter = channels.filter((value) => {
      return value?.name?.toLowerCase().includes(searchWord.toLowerCase());
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
        <div className="dataResult">
          {filteredData.slice(0, 15).map((value, index) => {
            return (
              <List key={index}>
                <ChannelItem channel={value} clearInput ={clearInput} search />
              </List>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AutoCompleteChannels;
