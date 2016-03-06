var Mastermind = require('../mastermind.min');

var mm = new Mastermind();
var solution = 1234, status;

// This is an automated example - you would typically try the guesses and feed the result pins
for (x = 0; x < 10; x++) {
  var guess = mm.getGuess();
  var res = Mastermind.matchPins(solution, guess);
  mm.feedPins(res.green, res.blue);
  status = mm.status();
  if (status.state === 'solved') {
    break;
  }
}
