const consoleCodes = [
  {
    code: 49,
    name: 'GB',
  },
  {
    code: 1,
    name: 'GBA',
  },
  {
    code: 2,
    name: 'GBC',
  },
  {
    code: 3,
    name: 'GameCube',
  },
  {
    code: 17,
    name: 'NES',
  },
  {
    code: 39,
    name: '3DS',
  },
  {
    code: 4,
    name: 'N64',
  },
  {
    code: 5,
    name: 'NDS',
  },
  {
    code: 59,
    name: 'Switch',
  },
  {
    code: 13,
    name: 'SNES',
  },
  {
    code: 22,
    name: 'Virtual_Boy',
  },
  {
    code: 11,
    name: 'Wii',
  },
  {
    code: 47,
    name: 'WiiU',
  },
  {
    code: 50,
    name: '32X',
  },
  {
    code: 23,
    name: 'SCD',
  },
  {
    code: 16,
    name: 'Dreamcast',
  },
  {
    code: 20,
    name: 'GameGear',
  },
  {
    code: 15,
    name: 'Genesis',
  },
  {
    code: 29,
    name: 'SMS',
  },
  {
    code: 14,
    name: 'Saturn',
  },
];

function getConsoleNumber(consoleName) {
  let match = 0;
  consoleCodes.forEach((obj) => {
    if (obj.name.toUpperCase() === consoleName.toUpperCase()) {
      match = obj.code;
    }
  });
  return match;
}

module.exports.getConsoleNumber = getConsoleNumber;
