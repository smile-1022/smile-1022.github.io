import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("images"));

async function fetchWeatherData() {
  const response = await axios.get(
    "http://api.openweathermap.org/data/2.5/forecast?lat=25.7484&lon=84.1194&appid=0b97b932eb82532bbf0a3972b932cc69"
  );

  let data = await response.data.list[0];
  let list = [data];

  const extractedData = list.map((data) => ({
    feelsLike: data.main.feels_like,
    weather: data.weather[0].description,
    windSpeed: data.wind.speed,
    windDegree: data.wind.deg,
    pressure: data.main.pressure,
    humidity: data.main.humidity,
    aqi: "392",
    precipitation: data.pop,
    temperature: data.main.temp,
  }));
  return extractedData[0];
}

app.get("/", async (req, res) => {
  let data = await fetchWeatherData();
  if (data) {
    res.render("home3.ejs", {
      data: data,
    });
  } else {
    res.send("Some Error Occured");
  }
});

app.post("/code", async (req, res) => {
  let lat, lon;
  
  try {
      const zip = req.body.location;
      const location = `http://api.openweathermap.org/geo/1.0/zip?zip=${zip},IN&appid=0b97b932eb82532bbf0a3972b932cc69`;
      const data = await axios.get(location);
      lat = data.data.lat;
      lon = data.data.lon;
  } catch (error) {
      res.render("home3.ejs", {
          info: `We don't have data of your city`,
      });
      return;
  }

  try {
      const API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=0b97b932eb82532bbf0a3972b932cc69`;
      const response = await axios.get(API_URL);
      let data = response.data.list[0];
      let list = [data];

      const extractedData = list.map((data) => ({
          feelsLike: data.main.feels_like,
          weather: data.weather[0].description,
          windSpeed: data.wind.speed,
          windDegree: data.wind.deg,
          pressure: data.main.pressure,
          humidity: data.main.humidity,
          aqi: "392",
          precipitation: data.pop,
          temperature: data.main.temp,
      }));

      res.render("home3.ejs", { data: extractedData[0] });
  } catch (error) {
      res.render("home3.ejs", {
          info: `Failed to fetch weather data`,
      });
  }
});


app.get("/news.html", (req, res) => {
  res.render("news.ejs");
});

app.get("/hourly.ejs", (req, res) => {
  res.render("hourly.ejs");
});


app.listen(port, () => {
  console.log(`server is live at ${port}`);
});
