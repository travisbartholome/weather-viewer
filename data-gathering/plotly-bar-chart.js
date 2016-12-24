const config = require('../config.js');
const plotly = require('plotly')(config.PLOTLY_USERNAME, config.PLOTLY_API_KEY);
const fs = require('fs');

fs.readFile('./data.txt', 'utf8', function(err, data) {
  if (err) return console.error(err);
  const dataArray = data.split('\n');
  let counts = {};

  // Building two arrays for the graph axes.
  for (let i = 0; i < dataArray.length; i++) {
    if (!counts[dataArray[i]]) {
      counts[dataArray[i]] = 1;
    } else {
      counts[dataArray[i]]++;
    }
  }

  // x - The values for weather condition
  // y - The number of occurences of each x-value.
  let x = Object.keys(counts);
  let y = [];

  console.log(x);

  for (let j = 0; j < x.length; j++) {
    y.push(counts[x[j]]);
  }

  // The plotly API stuff.
  let plotData = [{
    x: x,
    y: y,
    type: 'bar'
  }];

  let plotOptions = {
    filename: 'apixu-weather-conditions',
    fileopt: 'overwrite'
  };

  plotly.plot(plotData, plotOptions, function(error, message) {
    if (error) return console.error(error);
    console.log(message);
  });
});
