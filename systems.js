module.exports = (consoleName) => {

  if(consoleName){
    console_codes.forEach(obj => {
      if(obj.name.toUpperCase() === consoleName.toUpperCase()){
        return obj.code;
      }
    });
  }
  return 17; // NES Default
};

const console_codes =
  [
    {
      code: 49,
      name: 'GB'
    },
    {
      code: 1,
      name: 'GBA'
    },
    {
      code: 2,
      name: 'GBC'
    },
    {
      code: 3,
      name: 'GameCube'
    },
    {
      code: 17,
      name: 'NES'
    },
    {
      code: 39,
      name: '3DS'
    },
    {
      code: 4,
      name: 'N64'
    },
    {
      code: 5,
      name: 'NDS'
    },
    {
      code: 59,
      name: 'Switch'
    },
    {
      code: 13,
      name: 'SNES'
    },
    {
      code: 22,
      name: 'Virtual_Boy'
    },
    {
      code: 11,
      name: 'Wii'
    },
    {
      code: 47,
      name: 'WiiU'
    }
  ];
