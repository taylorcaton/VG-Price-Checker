const checker = require('./checker.js');
var FuzzyMatching = require('fuzzy-matching');

class Price_Checker {

  constructor(gameList, CONSOLE_NUMBER) {
    this.gameList = gameList;
    this.CONSOLE_NUMBER = CONSOLE_NUMBER;
    this.pricedList = [];
    this.valueTotal = 0;
  }

  async buildPriceList() {
    for (const game of this.gameList) {
      let priceResults = await this.getPriceOfSingleGame(game);
      this.pricedList.push({
        // Game Object
        name: priceResults.label,
        price: priceResults.prices[0]
      });
      // Add price to total
      this.valueTotal += Number(priceResults.prices[0]);
    }
    return this.pricedList;
  }

  async getPriceOfSingleGame(gameName) {
    let priceResults = await checker.getPrice(gameName, this.CONSOLE_NUMBER);
    let index = 0;

    // Is there more than one match?
    if (priceResults.length > 1) {
      // Get the index of the closest match
      index = this.fuzzyMatch(gameName, priceResults.map(a => a.label));

      // Print findings
      console.log(`Multiple Matches Found for search value: ${gameName}`);
      console.log(`Using closest match: ${priceResults[index].label}`);
      console.log('');
    }
    return priceResults[index];
  }

  fuzzyMatch(game, list) {
    var fm = new FuzzyMatching(list);
    return list.indexOf(fm.get(game).value);
  }
}

module.exports = Price_Checker;