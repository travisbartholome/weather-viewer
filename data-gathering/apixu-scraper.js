const http = require('http');
const fs = require('fs');
const config = require('../config.js');

const API_KEY = config.APIXU_API_KEY;
const BASE_URL = 'http://api.apixu.com/v1/current.json?key=' + API_KEY + '&q=';

function callAPI(lat, lon) {
  http.get(BASE_URL + lat + ',' + lon, function(response) {
    response.setEncoding('utf8');
    response.on('error', function(error) {
      console.error(error);
    });
    response.on('data', function(data) {
      let json = JSON.parse(data);
      if (json.error) return console.error(json.error.message);
      if (json.current.condition && json.current.condition.text) {
        fs.appendFile('./data.txt', json.current.condition.text + '\n', 'utf8', function(args) {
          console.log(json.current.condition.text);
        });
      } else {
        fs.appendFile('./errors.txt', JSON.stringify(json) + ',\n', function(args) {
          console.error('Error logged in errors.txt');
        });
      }
    });
  });
}

for (let i = -60; i <= 60; i += 20) {
  for (let j = -180; j <= 180; j += 10) {
    callAPI(i, j);
  }
}
