const express = require("express");
const https = require("https"); //native node module i.e, no nees to npm install
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));



app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});


app.post("/", function(req, res) {
  const query = req.body.yourCity;
  const apiKey = "08ecdfca47c1fe14e820d6209f88f5f1";
  const units = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=" + units + "&appid=" + apiKey;
  https.get(url, function(response) {
    response.on("data", function(data) {
      const weatherData = JSON.parse(data);

      const temp = weatherData.main.temp;
      const weatherDesc = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const iconUrl = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
      res.write("<h1>The temperature in " + query + " is currently: " + temp + " degree celsius</h1>");
      res.write("<p>Weather is like " + weatherDesc + "</p>");
      res.write("<img src=" + iconUrl + ">");
      res.send();
      console.log(res.statusCode);

    });
  });



});









app.listen(3000, function() {
  console.log("server up on port 3000");
});
