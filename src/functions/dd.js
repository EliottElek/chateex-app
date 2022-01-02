import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import { Typography } from "@material-ui/core";
import "../style/Weather.css";

const Weather = () => {
  const [city, setCity] = useState("Type a city");
  const [weather, setWeather] = useState("");
  const [url] = useState(
    `https://api.openweathermap.org/data/2.5/find?lat=0&lon=0&appid=c7ea113ee92a11241afd8c154e148226`
  );

  const fetchData = async () => {
    try {
      if (
        url !==
        `https://api.openweathermap.org/data/2.5/weather?q=&appid=c7ea113ee92a11241afd8c154e148226`
      ) {
        const response = await fetch(url);
        const json = await response.json();
        console.log(json);
        setWeather(json);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div>
      <TextField
        value={city}
        onChange={(e) => {
          setCity(e.target.value);
        }}
      />
      <Button onClick={fetchData}>Search</Button>
      <p>{JSON.stringify(weather)}</p>
    </div>
  );
};

export default Weather;
