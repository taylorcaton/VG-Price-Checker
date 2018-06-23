
const https = require('https');
const querystring = require('querystring');

module.exports = (game, cb) => {

  const url = buildGameURL(game, process.argv[3]);
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

function buildGameURL(game, consoleNumber = 17) {
  let query = querystring.stringify({
    q: game
  });
  return `https://www.pricecharting.com/search-products?type=cart&consoles=${consoleNumber}&${query}`;
}