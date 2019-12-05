const querystring = require('querystring');
const fetch = require('node-fetch');

// This is pricecharting.com's official endpoint for looking up console game prices
const priceChartingURL = 'https://www.pricecharting.com/search-products?type=cart&consoles=';

function buildGameURL(game, consoleNumber) {
  const query = querystring.stringify({
    q: game,
  });
  const url = `${priceChartingURL}${consoleNumber}&${query}`;
  return url;
}

async function getPrice(game, CONSOLE_NUMBER) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(buildGameURL(game, CONSOLE_NUMBER));
      const json = await response.json();
      resolve(json);
    } catch (error) {
      reject(error);
    }
  })
}

module.exports.buildGameURL = buildGameURL;
module.exports.getPrice = getPrice;
