# Hey there!

This is just a small project that shows the weather at your location.

It primarily relies on the [Navigator geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/geolocation) to determine location, but it also supports direct input of coordinates or a ZIP code.

Once the app receives weather data, it displays that data along with a background to suit the weather conditions.

APIs and services I used for this project:

- [APIXU](https://www.apixu.com) as the weather API
- [Method Draw](http://editor.method.ac) to create the custom vector backgrounds
- [Plotly](https://plot.ly) for some minor data visualization (mostly just for fun)

Built largely for the curriculum at [Free Code Camp](https://www.freecodecamp.com).

## Note about API keys

To run any of the scripts in the data-gathering directory, you'll need to set up a file for the API keys. The keys should go in a file named "config.js" in the main project directory.

config.js has the following structure:

```javascript
module.exports = {
  'APIXU_API_KEY': '(apixu api key)',
  'PLOTLY_API_KEY': '(plotly key)',
  'PLOTLY_USERNAME': '(username)'
};
```

To keep this hidden from Git, add config.js to .gitignore.
