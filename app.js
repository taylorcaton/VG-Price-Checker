// Make sure we got a filename on the command line.
if (process.argv.length < 3) {
  console.log('Usage: node ' + process.argv[1] + ' FILENAME [CONSOLE_NUMBER]');
  process.exit(1);
}

const CONSOLE_NUMBER = process.argv[3] ? process.argv[3] : 17;
const textFileToRead = process.argv[2];
const LineByLineReader = require('line-by-line'),
  lr = new LineByLineReader(textFileToRead);
var FuzzyMatching = require('fuzzy-matching');
const storage = require('node-persist');
const csv = require('./csv.js');
const getPrice = require('./checker.js');

let gamesObj = [];
let valueTotal = 0;
let previousPrices = getPreviousPrices();

lr.on('error', function (err) {
  // 'err' contains error object
  console.log(err);
});

// Reads each line
lr.on('line', function (gameName) {
  lr.pause(); //Pause until data comes back.

  getPrice(gameName, (priceObj) => {

    let index = 0;

    // Is there more than one match?
    if (priceObj.length > 1) {
      // Get the index of the closest match
      index = fuzzyMatch(gameName, priceObj.map(a => a.label));

      // Print findings
      console.log(`Multiple Matches Found for ${gameName}`);
      // console.log(priceObj.map(a => a.label));
      console.log(`Search value: ${gameName}`);
      // console.log(`Match found at index #${index}`);
      console.log(`Using closest match: ${priceObj[index].label}`);
      console.log('');
    }

    // Add game name and price to array of objects
    gamesObj.push({
      game: priceObj[index].label,
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
  if(arr){
    return arr;
  }else{
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
}
