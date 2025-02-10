const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config()

const request = require('request');
const app = express()

const apiKey = process.env.API_KEY;
const units = process.env.UNITS;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  res.render('index', {weather: null, error: null});
})

let lat = '';
let lon = '';

app.post('/', function (req, res) {
  let zipcode = req.body.zipcode;
  let geoURL = `http://api.openweathermap.org/geo/1.0/zip?zip=${zipcode},US&appid=${apiKey}`;


  request(geoURL, function (err, response, body) {
    if(err){
      res.render('index', {location: null, error: 'Error, please try again'});
    } else {
      let location = JSON.parse(body);

      lon = location.lon;
      lat = location.lat;
      if (location == undefined){
        res.render('index', {location: null, error: 'Error, please try again'});
      }
    }

    getWeather(lon, lat);
  });

  function getWeather(lon, lat) {
    let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`

    request(url, function (err, response, body) {
      if(err){
        res.render('index', {weather: null, error: 'Error, please try again'});
      } else {
        let weather = JSON.parse(body)
        if(weather.city == undefined){
          res.render('index', {weather: null, error: 'Error, please try again'});
        } else {
          let weatherText = `It's ${weather.list[0].main.temp} degrees in ${weather.city.name}!`;
          res.render('index', {weather: weatherText, error: null});
        }
      }
    });
  }


})

app.listen(process.env.PORT || 8000, function () {
  console.log(`Example app listening on port ${process.env.PORT}!`)
})