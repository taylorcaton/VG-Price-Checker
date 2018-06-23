// Make sure we got a filename on the command line.
if (process.argv.length < 3) {
  console.log('Usage: node ' + process.argv[1] + ' FILENAME [CONSOLE_NUMBER]');
  process.exit(1);
}

const LineByLineReader = require('line-by-line'),
  lr = new LineByLineReader(process.argv[2]);
const https = require('https');
const querystring = require('querystring');
var FuzzyMatching = require('fuzzy-matching');
const storage = require('node-persist');
const csv = require('./csv.js');

let gamesObj = [];
let valueTotal = 0;
let previousPrices = getPreviousPrices();

lr.on('error', function (err) {
  // 'err' contains error object
  console.log(err);
});

// Reads each line
lr.on('line', function (line) {
  lr.pause(); //Pause until data comes back.

  getPrice(line, (priceObj) => {

    let index = 0;

    // Is there more than one match?
    if (priceObj.length > 1) {
      // Get the index of the closest match
      index = fuzzyMatch(line, priceObj.map(a => a.label));

      // Print findings
      console.log('Multiple Matches Found!');
      console.log(priceObj.map(a => a.label));
      console.log(`Search value: ${line}`);
      console.log(`Match found at index #${index}`);
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

function getPrice(game, cb) {

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
}

function buildGameURL(game, consoleNumber = 17) {
  let query = querystring.stringify({
    q: game
  });
  return `https://www.pricecharting.com/search-products?type=cart&consoles=${consoleNumber}&${query}`;
}

function fuzzyMatch(game, list) {
  var fm = new FuzzyMatching(list);
  return list.indexOf(fm.get(game).value);
}

async function getPreviousPrices() {
  await storage.init({
    dir: './storage'
  });

  let arr = await storage.getItem(`previousPricesArray${process.argv[3]}`);
  if(arr){
    return arr;
  }else{
    return [];
  }
}

async function saveStorage() {
  let today = new Date();
  previousPrices.then(arr => {
    arr.push({
      date: today.toLocaleDateString('en-US'),
      total: Math.round(valueTotal)
    });
    console.log(arr);
    storeIt(arr);
  });
}

async function storeIt(arr) {
  await storage.setItem(`previousPricesArray${process.argv[3]}`, arr);
}
