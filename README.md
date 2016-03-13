# numeric-mastermind-solver-js

[![Build Status](https://secure.travis-ci.org/claudiorodriguez/numeric-mastermind-solver-js.png)](http://travis-ci.org/claudiorodriguez/numeric-mastermind-solver-js)

A better implementation for a step-by-step numeric mastermind solver than what I've found around

## Features

* Works in node.js and in the browser.
* Included test suite and benchmark.
* Takes places and numbers as options
* Small: <1 KB minified and gzipped

## Installation

### node.js

Install using [npm](http://npmjs.org/):

```bash
$ npm install numeric-mastermind-solver-js
```

### Browser

Using bower:

```bash
$ bower install numeric-mastermind-solver-js
```

If you are not using any module loader system then the API will then be accessible via the `window.Mastermind` object.

## Examples

**Node.JS**

```javascript
var Mastermind = require('numeric-mastermind-solver-js');

var mm = new Mastermind();
var solution = 1234;

// This is an automated example - you would typically try the guesses and feed the result pins
for (x = 0; x < 10; x++) {
  var guess = mm.getGuess();
  var res = Mastermind.matchPins(solution, guess);
  mm.feedPins(res.green, res.blue);
  status = mm.status();
  if (status.state === 'solved') {
    // solved state
    break;
  }
}
```

**Browser**

See [examples/browser.html](https://github.com/claudiorodriguez/numeric-mastermind-solver-js/blob/master/examples/browser.html)

## Building and Testing

To build the code and run the tests:

```bash
$ npm install -g grunt-cli
$ npm install
$ npm run build
```

## Performance

You can run the benchmark yourself:

```bash
$ npm install -g grunt-cli
$ npm install
$ npm run build
$ npm run benchmark
```

## Contributing

If you wish to submit a pull request please update and/or create new tests for any changes you make and ensure the grunt build passes.

## License

MIT - see [LICENSE](https://github.com/claudiorodriguez/numeric-mastermind-solver-js/blob/master/LICENSE)
