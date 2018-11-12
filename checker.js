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
  try {
    const response = await fetch(buildGameURL(game, CONSOLE_NUMBER));
    const json = await response.json();
    return json;
  } catch (error) {
    console.log(error);
  }
}

module.exports.buildGameURL = buildGameURL;
module.exports.getPrice = getPrice;
