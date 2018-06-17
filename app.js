// Make sure we got a filename on the command line.
if (process.argv.length < 3) {
    console.log('Usage: node ' + process.argv[1] + ' FILENAME [CONSOLE_NUMBER]');
    process.exit(1);
}

const LineByLineReader = require('line-by-line'), lr = new LineByLineReader(process.argv[2]);
const https = require('https');
const querystring = require("querystring");
const Json2csvParser = require('json2csv').Parser;
var fs = require('fs');
var FuzzyMatching = require('fuzzy-matching');

let gamesObj = [];


lr.on('error', function (err) {
    // 'err' contains error object
    console.log(err)
});

lr.on('line', function (line) {
    lr.pause();
    
    getPrice(line, (priceObj) => {

        let index = 0;
        if(priceObj.length > 1){
            index = fuzzyMatch(line, priceObj.map(a => a.label));
            console.log('Match found at', index)
            console.log('in list', priceObj.map(a => a.label))
            console.log('Search value', line);
            console.log('Returned closest match', priceObj[index].label)
            console.log('');
        }

        gamesObj.push({
            game: priceObj[index].label,
            price: priceObj[index].prices[0]
        });
        lr.resume();
    });
});

lr.on('end', function () {
    // All lines are read, file is closed now.
    console.log('Ready!')
    jsonToCsv()
});



function getPrice(game, cb){

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

    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });
}

function buildGameURL(game, consoleNumber = 17) {
    let query = querystring.stringify({q: game});
    return `https://www.pricecharting.com/search-products?type=cart&consoles=${consoleNumber}&${query}`;
}

function jsonToCsv() {
    const fields = ['game', 'price'];  
    const json2csvParser = new Json2csvParser({ fields });
    const csv = json2csvParser.parse(gamesObj);

    fs.writeFile('gameList.csv', csv, 'utf8', function (err) {
        if (err) {
            console.log('Some error occured - file either not saved or corrupted file saved.', err);
        } else {
            console.log('It\'s saved!');
        }
    });
}

function fuzzyMatch(game, list) {
    var fm = new FuzzyMatching(list);
    return list.indexOf(fm.get(game).value);
}
