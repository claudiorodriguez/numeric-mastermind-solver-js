var Mastermind = require('../mastermind.min');

/** @type {Object} Test config */
module.exports = {
  name: 'Speed benchmark',
  onComplete: function() {
    console.log('Benchmark done.');
  },
  tests: [
    {
      name: 'speed-1e4',
      fn: function() {
        var i, x, solution = 3124;
        var mm = new Mastermind();
        for (i=0; i < 1e4; i++) {
          mm.reset();
          for (x = 0; x < 10; x++) {
            guess = mm.getGuess();
            res = Mastermind.matchPins(solution, guess);
            mm.feedPins(res.green, res.blue);
            status = mm.status();
            if (status.state === 'solved') {
              break;
            }
          }
        }
      }
    }
  ]
};
