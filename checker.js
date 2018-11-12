const querystring = require('querystring');
const fetch = require('node-fetch');

// This is pricecharting.com's official endpoint for looking up console game prices 
const priceChartingURL = 'https://www.pricecharting.com/search-products?type=cart&consoles='

async function getPrice(game, CONSOLE_NUMBER) {
  try {
    const response = await fetch(buildGameURL(game, CONSOLE_NUMBER));
    const json = await response.json();
    return json;
  } catch (error) {
    console.log(error);
  }
}

function buildGameURL(game, consoleNumber) {
  let query = querystring.stringify({
    q: game
  });
  let url = `${priceChartingURL}${consoleNumber}&${query}`;
  return url;
}

module.exports.buildGameURL = buildGameURL;
module.exports.getPrice = getPrice;