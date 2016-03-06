var chai = require('chai'),
    Mastermind = require('../mastermind.min');

var expect = chai.expect,
    assert = chai.assert;

// ----- Basic tests ----- //

exports['Basic solutions'] = {
  'typical 4-number solutions': function(done) {
    this.timeout(20000);

    var startTime = new Date().valueOf();

    var challenges = [
      {places: 4, max: 4, number: 1234},
      {places: 4, max: 4, number: 1122},
      {places: 4, max: 4, number: 1111},
      {places: 4, max: 9, number: 9136}
    ];

    challenges.forEach(function(challenge) {
      var mm = new Mastermind({places: challenge.places, numbers: challenge.max});
      var x, guess, res, status;
      for (x = 0; x < 10; x++) {
        guess = mm.getGuess();
        res = Mastermind.matchPins(challenge.number, guess);
        mm.feedPins(res.green, res.blue);
        status = mm.status();
        if (status.state === 'solved') {
          break;
        }
      }
      expect(status.state).to.eql('solved');
    });

    var timeElapsed = new Date().valueOf() - startTime;
    console.log(timeElapsed + ' ms');
    done();
  }
};
