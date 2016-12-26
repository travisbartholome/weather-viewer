const config = require('../config.js');
const fs = require('fs');
const http = require('http');

const API_KEY = config.APIXU_API_KEY;
const BASE_URL = 'http://api.apixu.com/v1/current.json?key=' + API_KEY + '&q=';

// Calls for the weather in London.
http.get(BASE_URL + '51.5074,-0.1278', function(response) {
  response.setEncoding('utf8');
  response.on('error', console.error);
  response.on('data', function(data) {
    fs.appendFile('./sample-api-response.json', data, 'utf8', function(args) {
      console.log('Response received and stored in sample-api-response.json.');
    });
  });
}).on('error', console.error);
