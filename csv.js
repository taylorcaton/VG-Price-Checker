const Json2csvParser = require('json2csv').Parser;
const fs = require('fs');

module.exports = (gamesObj, CONSOLE_NAME) => {
  const fields = ['name', 'price'];
  const json2csvParser = new Json2csvParser({
    fields,
  });
  const csv = json2csvParser.parse(gamesObj);

  fs.writeFile(`gameList-${CONSOLE_NAME}.csv`, csv, 'utf8', (err) => {
    if (err) {
      console.log('Some error occurred - file either not saved or corrupted file saved.', err);
    } else {
      console.log(`CSV saved to gameList-${CONSOLE_NAME}.csv!`);
    }
  });
};
