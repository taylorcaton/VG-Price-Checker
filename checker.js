
const https = require('https');
const querystring = require('querystring');

module.exports = (game, CONSOLE_NUMBER, cb) => {

  const url = buildGameURL(game, CONSOLE_NUMBER);
  https.get(url, (resp) => {
    let data = '';

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      cb(JSON.parse(data));
    });

  }).on('error', (err) => {
    console.log('Error: ' + err.message);
  });
};

function buildGameURL(game, consoleNumber) {
  let query = querystring.stringify({
    q: game
  });
  let url = `https://www.pricecharting.com/search-products?type=cart&consoles=${consoleNumber}&${query}`;
  return url;
}