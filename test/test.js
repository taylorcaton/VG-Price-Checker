const Price_Checker = require('../Price_Checker');
const Server_Checker = require('../checker');
const expect = require('chai').expect;
const sampleGames = ['Super Mario Bros', 'Contra'];
const consoleNumber = 17;

describe('Checker.js module', () => {
  let url = Server_Checker.buildGameURL(sampleGames[0], consoleNumber);
  describe('"buildGameURL"', () => {
    it('should export a function', () => {
      expect(Server_Checker.buildGameURL).to.be.a('function');
    });
    it('should return a string', () => {
      expect(url).to.be.a('string');
    });
  });
  describe('"getPrice"', () => {
    it('should export a function', () => {
      expect(Server_Checker.getPrice).to.be.a('function');
    });
    it('should return an array', () => {
      Server_Checker.getPrice(url).then(data => {
        expect(data).to.be.a('array');
      });
    });
  });
});

describe('Price Checker module', () => {

  let pc;

  beforeEach(() => {
    pc = new Price_Checker(sampleGames, consoleNumber);
  });

  describe('"buildPriceList"', () => {
    it('should export a function', () => {
      expect(pc.buildPriceList).to.be.a('function');
    });

    it('should return an array', () => {
      pc.buildPriceList().then(arr => {
        expect(arr).to.be.a('array');
      });
    });
  });

  describe('"getPriceOfSingleGame"', () => {
    it('should export a function', () => {
      expect(pc.getPriceOfSingleGame).to.be.a('function');
    });

    it('should return an object', () => {
      pc.getPriceOfSingleGame(sampleGames[0]).then(obj => {
        expect(obj).to.be.a('object');
      });
    });
  });
});