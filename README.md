## Note about API keys
API keys should go in a file named "config.js" in the main project directory.
config.js has the following structure:

```javascript
module.exports = {
  'APIXU_API_KEY': '(apixu api key)',
  'PLOTLY_API_KEY': '(plotly key)',
  'PLOTLY_USERNAME': '(username)'
};
```

To keep this hidden from Git, add config.js to .gitignore.
