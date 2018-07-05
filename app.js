// Make sure we got a filename on the command line.
if (process.argv.length < 3) {
  console.log('Usage: node ' + process.argv[1] + ' FILENAME [CONSOLE_NUMBER]');
  process.exit(1);
}

var FuzzyMatching = require('fuzzy-matching');
const storage = require('node-persist');
const csv = require('./csv.js');
const checker = require('./checker.js');
const systems = require('./systems.js');
const cTable = require('console.table');
const CONSOLE_NUMBER = systems(process.argv[3]);
const textFileToRead = process.argv[2];
const LineByLineReader = require('line-by-line'),
  lr = new LineByLineReader(textFileToRead);

let gamesObj = [];
let valueTotal = 0;
let previousPrices = getPreviousPrices();

lr.on('error', function (err) {
  // 'err' contains error object
  console.log('Line Reader Error', err);
});

// Reads each line
lr.on('line', function (gameName) {
  lr.pause(); //Pause until data comes back.

  checker.getPrice(gameName, CONSOLE_NUMBER).then( priceObj => {

    let index = 0;

    // Is there more than one match?
    if (priceObj.length > 1) {
      // Get the index of the closest match
      index = fuzzyMatch(gameName, priceObj.map(a => a.label));

      // Print findings
      console.log(`Multiple Matches Found for search value: ${gameName}`);
      // console.log(priceObj.map(a => a.label));
      // console.log(`Match found at index #${index}`);
      console.log(`Using closest match: ${priceObj[index].label}`);
      console.log('');
    }

    // Add game name and price to array of objects
    gamesObj.push({
      name: priceObj[index].label,
      price: priceObj[index].prices[0]
    });

    // Add price to total
    valueTotal += Number(priceObj[index].prices[0]);

    // Read the next line
    lr.resume();
  });
});

lr.on('end', function () {
  console.log('All lines are read, file is closed now.');
  saveStorage();
  compareIndividualPrices();
  csv(gamesObj);
});

function fuzzyMatch(game, list) {
  var fm = new FuzzyMatching(list);
  return list.indexOf(fm.get(game).value);
}

async function getPreviousPrices() {
  await storage.init({
    dir: './storage'
  });

  let arr = await storage.getItem(`previousPricesArray${CONSOLE_NUMBER}`);
  if (arr) {
    return arr;
  } else {
    return [];
  }
}

async function saveStorage() {
  let today = new Date();
  let total = Number.parseFloat(valueTotal).toFixed(2);
  previousPrices.then(arr => {
    arr.push({
      date: today.toLocaleDateString('en-US'),
      total: total
    });
    storeIt(arr);
  });
}

async function storeIt(arr) {
  await storage.setItem(`previousPricesArray${CONSOLE_NUMBER}`, arr);

  // Display Reults
  console.log(`Totals History for the ${process.argv[3]}`);
  console.table(arr);
}

async function compareIndividualPrices() {

  // Get stored individual prices
  let oldPrices = await storage.getItem(`oldPrices${CONSOLE_NUMBER}`);
  let priceChanges = [];

  // If there are no individual prices, create the entry
  if (!oldPrices) {
    await storage.setItem(`oldPrices${CONSOLE_NUMBER}`, gamesObj);
    return;
  }

  // Check to see if there are any price differences between current and stored games
  gamesObj.forEach((game, index) => {
    oldPrices.every((oldGame, oldIndex) => {
      if (game.name === oldGame.name) {

        // If the game price is the same, 'break' out of the loop
        if (game.price === oldGame.price) {
          return false;
        }

        // The price has changed, keep track in a separate array and update database
        oldPrices[oldIndex] = gamesObj[index];
        priceChanges.push({
          name: game.name,
          oldPrice: oldGame.price,
          newPrice: game.price,
          change: Number.parseFloat(game.price - oldGame.price).toFixed(2),
          percentChange: `%${Math.round( this.change / oldGame.price * 100 )}`
        });
      }
    });
  });

  // Update the database
  await storage.setItem(`oldPrices${CONSOLE_NUMBER}`, oldPrices);
  if (priceChanges.length) {
    console.table(priceChanges);
  } else {
    console.log('No price changes since this tool was last run');
  }

}