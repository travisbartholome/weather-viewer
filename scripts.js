// TODO: Store response to API so that the user can't make multiple erroneous requests without changing some parameter.
// That seems like a really great way to burn up API calls and/or flood the API with requests.
// Include property checks, since object could either be:
//  1. an error, or
//  2. a valid response that just doesn't have weather data.

// Many thanks to APIXU for having an easy-to-use API.
// Custom backgrounds made with Method Draw.

// Global variables
var temp_f, temp_c; // Storing API temperature data here.
var resultsShown = false; // To prevent multiple submissions being shown.
var errorShown = false; // To avoid having a ton of errors showing at once.

// Global constants
const BACKGROUND_NAMES = [
  'clear-day.png',
  'clear-night.png',
  'cloudy-day.png',
  'cloudy-night.png',
  'rainy-day.png',
  'rainy-night.png',
  'snowy-day.png',
  'snowy-night.png'
];
const BACKGROUND_PATH = './backgrounds/';


function parseTime(timeString) {
  // Input should be a string in the format "yyyy-mm-dd hh:mm".
  let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  let halfSplit = timeString.split(' ');
  let date = halfSplit[0].split('-');
  let time = halfSplit[1];

  let dateString = date[2] + ' ' + months[+date[1] - 1] + ' ' + date[0];
  return '<p>' + time + '</p><p>' + dateString + '</p>';
}


function chooseTemp(response) {
  // Chooses Fahrenhiet or Celsius for initial display.
  // The following countries use Fahrenheit.
  let fahrenheit = ['Bahamas', 'Belize', 'Cayman Islands', 'Palau', 'United States of America', 'USA'];
  let localTemp;
  temp_f = response.current.temp_f;
  temp_c = response.current.temp_c;

  let useFahrenheit = (fahrenheit.indexOf(response.location.country) !== -1);

  if (useFahrenheit) {
    localTemp = temp_f + '&deg;F';
    tempShowing = 'Fahrenheit';
    $('#temp-select-f').addClass('selected-button');
  } else {
    localTemp = temp_c + '&deg;C';
    tempShowing = 'Celsius';
    $('#temp-select-c').addClass('selected-button');
  }

  return '<p id="temperature">' + localTemp + '</p>'
}


function setBackground(response) {
  // Chooses the appropriate weather background.
  // Boils down to "clear, cloudy, rainy, or snowy."
  const keywords = {
    'clear': ['clear', 'sunny'],
    'cloudy': ['fog', 'overcast', 'cloudy', 'mist', 'fog'],
    'rainy': ['rain', 'shower', 'drizzle'],
    'snowy': ['snow', 'blizzard', 'sleet']
  }

  let isDay = response.current.is_day;
  let condition = response.current.condition.text.toLowerCase();

  // Setting font color to contrast with a light or dark background.
  // Backgrounds are intended to be light during the day and dark at night.
  $('body').css('color', isDay ? '#000' : '#fff');

  for (let i in keywords) {
    for (let j = 0; j < keywords[i].length; j++) {
      if (condition.includes(keywords[i][j])) {
        let fileName = i + '-';
        fileName += isDay ? 'day' : 'night';
        fileName += '.png';
        $('body').css('background', 'url(' + BACKGROUND_PATH + fileName + ') no-repeat center 0px');
        return;
      }
    }
  }

  // If we don't find a match, set the background to 'clear'
  let fileName = 'clear-';
  fileName += isDay ? 'day' : 'night';
  fileName += '.png';
  console.log('Didn\'t find a matching background: condition is "' + condition + '"');
  $('body').css('background', 'url(' + BACKGROUND_PATH + fileName + ') no-repeat center 0px');
}


function selectTempButton(eventData) {
  // Switches the displayed temperature units.
  let tempChoice = eventData.target.innerHTML; // Either 'F' or 'C'
  if (tempChoice === 'C') {
    $('#temperature').html(temp_c + '&deg;C');
    $('#temp-select-f').removeClass('selected-button');
    $('#temp-select-c').addClass('selected-button');
  } else {
    $('#temperature').html(temp_f + '&deg;F');
    $('#temp-select-c').removeClass('selected-button');
    $('#temp-select-f').addClass('selected-button');
  }
}


function displayWeather(response) {
  if (response.error) {
    $('#location-form').prepend('<p class="api-error-notice">Sorry, your request caused an error.</p>');
    $('.api-error-notice').fadeIn(200).delay(800).fadeOut(600, function() {
      $('.api-error-notice').remove();
    });
    return console.error('API returned an error:', response.error.message);
  } else if (!response.current || !response.current.condition || !response.current.condition.text) {
    $('#location-form').prepend('<p class="api-no-data-notice">Sorry, there is no weather data for your location.</p>');
    $('.api-no-data-notice').fadeIn(200).delay(800).fadeOut(600, function() {
      $('.api-no-data-notice').remove();
    });
    return console.error('No weather data. Response:', response);
  }

  // To prevent multiple submissions being shown.
  if (!resultsShown) {
    resultsShown = true;
  } else {
    return;
  }

  setBackground(response);

  let display = $('#display');
  $('#location-form').fadeOut(function() {
    display.append(chooseTemp(response));
    display.append('<p>' + response.current.condition.text + '</p>');
    display.append(parseTime(response.location.localtime));
    display.append('<p>' + response.location.name + '</p>');
    display.fadeIn();
  });
}


function makeAPIRequest(locationString) {
  $.ajax({
    dataType: 'json',
    error: function(xhrObject, status, error) {
      if (status) console.log('XHR error. Status: ' + status);
      if (error) console.log('XHR error. Error: ' + error);
      console.log(xhrObject);
    },
    method: 'GET',
    // I'd rather not leave this key open, but oh well.
    url: 'https://api.apixu.com/v1/current.json?key=d42170ae9dd448319fd220640162212&q=' + locationString,
    success: displayWeather
  });
}

function showLocationFormError(errorType) {
  // Don't show an error if one is already showing.
  if (errorShown) return;
  errorShown = true;
  // errorType should equal 'zipcode' or 'coordinates'
  let errorString = (errorType === 'zipcode') ? 'an invalid zipcode.' : 'invalid coordinates.';
  $('#location-form').prepend('<p class="location-form-error-notice">Sorry, your input contains ' + errorString + '</p>');
  $('.location-form-error-notice').fadeIn(200).delay(800).fadeOut(600, function() {
    $('.location-form-error-notice').remove();
    errorShown = false;
  });
}

$(function() {
  // Ideally, allow geolocation to use latitude and longitude for the API call.
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(function(position) {
      let lat = position.coords.latitude;
      let lon = position.coords.longitude;
      makeAPIRequest(lat + ',' + lon);
    });
  }

  // Otherwise, you can manually input a US zip code to get weather data.
  // Also supports manually submitting latitude and longitude.
  $('#location-form').submit(function(e) {
    e.preventDefault();
    var zip = $('#zip-input').val();

    if (zip === '') {
      let lat = $('#latitude').val();
      let long = $('#longitude').val();
      let floatRegex = /^-?\d+\.?\d*/;
      let matchedLat = lat.match(floatRegex);
      let matchedLong = long.match(floatRegex);
      if (!matchedLat || !matchedLong ||
          matchedLat[0] !== lat || matchedLong[0] !== long) {
        showLocationFormError('coordinates');
        return console.error('Invalid coordinates: ' + lat + ',' + long);
      } else {
        let parseLat = parseFloat(lat);
        let parseLong = parseFloat(long);
        if (!isNaN(parseLat) && !isNaN(parseLong) &&
            (Math.abs(parseLat) <= 90) && Math.abs(parseLong) <= 180) {
          makeAPIRequest('' + parseFloat(lat) + ',' + parseFloat(long));
        } else {
          showLocationFormError('coordinates');
          return console.error('Invalid coordinates: ' + lat + ',' + long);
        }
      }
    } else {
      if (zip.length !== 5 || /\D/.test(zip)) {
        showLocationFormError('zipcode');
        return console.error('Invalid zipcode: ' + zip);
      }
      makeAPIRequest(zip.toString());
    }
  });

  $('#temp-select-f').on('click', selectTempButton);
  $('#temp-select-c').on('click', selectTempButton);
});
