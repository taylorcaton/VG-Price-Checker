
const querystring = require('querystring');
const fetch = require('node-fetch');

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
  let url = `https://www.pricecharting.com/search-products?type=cart&consoles=${consoleNumber}&${query}`;
  return url;
}

module.exports.buildGameURL = buildGameURL;
module.exports.getPrice = getPrice;
