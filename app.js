// Make sure we got a filename on the command line.
if (process.argv.length < 3) {
  console.log(`Usage: node ${process.argv[1]} FILENAME -c [CONSOLE_NUMBER]`);
  process.exit(1);
}

const FuzzyMatching = require('fuzzy-matching');
const storage = require('node-persist');
const LineByLineReader = require('line-by-line');
const commandLineArgs = require('command-line-args');
const csv = require('./csv.js');
const checker = require('./checker.js');
const systems = require('./systems.js');

// Command Line Options Def
const commandLineDefinitions = [
  {
    name: 'verbose',
    alias: 'v',
    type: Boolean,
  },
  {
    name: 'src',
    type: String,
    defaultOption: true,
  },
  {
    name: 'console',
    alias: 'c',
    type: String,
  },
];
const options = commandLineArgs(commandLineDefinitions);

if (!options.console) {
  console.log('Missing console option!');
  console.log(`Usage: node ${process.argv[1]} FILENAME -c [CONSOLE_NUMBER]`);
}

const CONSOLE_NAME = options.console;
const CONSOLE_NUMBER = systems.getConsoleNumber(CONSOLE_NAME);
const textFileToRead = options.src;
const verbose = options ? options.verbose : false;
const lr = new LineByLineReader(textFileToRead);

const gamesObj = [];
let valueTotal = 0;
const previousPrices = getPreviousPrices();

lr.on('error', (err) => {
  // 'err' contains error object
  console.log('Line Reader Error', err);
});

// Reads each line
lr.on('line', (gameName) => {
  lr.pause(); // Pause until data comes back.

  checker
    .getPrice(gameName, CONSOLE_NUMBER)
    .then((priceObj) => {
      let index = 0;

      // Is there more than one match?
      if (priceObj.length > 1) {
        // Get the index of the closest match
        index = fuzzyMatch(gameName, priceObj.map((a) => a.label));

        // Print findings
        if (verbose) {
          console.log(`Multiple Matches Found for search value: ${gameName}`);
          console.log(`Using closest match: ${priceObj[index].label}`);
          console.log('');
        }
      } else if (verbose) {
        console.log(`Found match: ${priceObj[index].label}`);
        console.log('');
      }

      // Add game name and price to array of objects
      if (priceObj[index] !== undefined) {
        gamesObj.push({
          name: priceObj[index].label,
          price: priceObj[index].prices[0],
        });

        // Add price to total
        valueTotal += Number(priceObj[index].prices[0]);
      } else {
        console.error(`Could not not find anything matching ${gameName}`);
      }

      // Read the next line
      lr.resume();
    })
    .catch((err) => console.log(err));
});

lr.on('end', () => {
  if (verbose) console.log('All lines are read, file is closed now.');
  saveStorage();
  compareIndividualPrices();
  csv(gamesObj, CONSOLE_NAME);
});

function fuzzyMatch(game, list) {
  const fm = new FuzzyMatching(list);
  return list.indexOf(fm.get(game).value);
}

async function getPreviousPrices() {
  await storage.init({
    dir: './storage',
  });

  const arr = await storage.getItem(`previousPricesArray${CONSOLE_NUMBER}`);
  if (arr) {
    return arr;
  }
  return [];
}

async function saveStorage() {
  const today = new Date();
  const total = Number.parseFloat(valueTotal).toFixed(2);
  previousPrices.then((arr) => {
    arr.push({
      date: today.toLocaleDateString('en-US'),
      total,
    });
    storeIt(arr);
  });
}

async function storeIt(arr) {
  await storage.setItem(`previousPricesArray${CONSOLE_NUMBER}`, arr);

  // Display Reults
  if (verbose) {
    console.log(`Totals History for the ${CONSOLE_NAME}`);
    console.table(arr);
  }
}

async function compareIndividualPrices() {
  // Get stored individual prices
  const oldPrices = await storage.getItem(`oldPrices${CONSOLE_NUMBER}`);
  const priceChanges = [];

  // If there are no individual prices, create the entry
  if (!oldPrices) {
    await storage.setItem(`oldPrices${CONSOLE_NUMBER}`, gamesObj);
    return;
  }

  // Check to see if there are any price differences between current and stored games
  gamesObj.forEach((game, index) => {
    oldPrices.forEach((oldGame, oldIndex) => {
      if (game.name === oldGame.name) {
        // If the game price is not the same
        if (game.price !== oldGame.price) {
          // The price has changed, keep track in a separate array and update database
          oldPrices[oldIndex] = gamesObj[index];
          const changeObj = {
            name: game.name,
            oldPrice: oldGame.price,
            newPrice: game.price,
            change: Number.parseFloat(game.price - oldGame.price).toFixed(2),
            percentChange: `%${((Number.parseFloat(game.price - oldGame.price).toFixed(2) / oldGame.price) * 100).toFixed(2)}`, // this.change isn't working... hmmm
          };
          priceChanges.push(changeObj);
        }
      }
    });
  });

  // Update the database
  await storage.setItem(`oldPrices${CONSOLE_NUMBER}`, oldPrices);
  if (priceChanges.length && verbose) {
    console.table(priceChanges);
  } else if (verbose) {
    console.log('No price changes since this tool was last run');
  }
}
