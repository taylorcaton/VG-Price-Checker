const Json2csvParser = require('json2csv').Parser;
var fs = require('fs');

module.exports = function (gamesObj) {
  const fields = ['name', 'price'];
  const json2csvParser = new Json2csvParser({
    fields
  });
  const csv = json2csvParser.parse(gamesObj);

  fs.writeFile('gameList.csv', csv, 'utf8', function (err) {
    if (err) {
      console.log('Some error occured - file either not saved or corrupted file saved.', err);
    } else {
      console.log('CSV saved to gameList.csv!');
    }
  });
};