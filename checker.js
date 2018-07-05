
const querystring = require('querystring');
const fetch = require('node-fetch');

async function getPrice(game, CONSOLE_NUMBER) {
  return getData( buildGameURL(game, CONSOLE_NUMBER) );
}

async function getData(url) {
  try {
    const response = await fetch(url);
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
module.exports.getData = getData;
module.exports.getPrice = getPrice;
