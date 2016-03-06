(function() {
  'use strict';

  /**
   * Extend an Object with another Object's properties.
   *
   * The source objects are specified as additional arguments.
   *
   * @param dst Object the object to extend.
   *
   * @return Object the final object.
   */
  var _extend = function(dst) {
    var sources = Array.prototype.slice.call(arguments, 1);
    for (var i=0; i<sources.length; ++i) {
      var src = sources[i];
      for (var p in src) {
        if (src.hasOwnProperty(p)) dst[p] = src[p];
      }
    }
    return dst;
  };


  /**
   * blah.
   */
  function Mastermind(options) {
    var defaults = {
      places: 4,
      numbers: 4
    };
    this.options = _extend({}, defaults, options);

    this.reset();
  }

  Mastermind.prototype.reset = function() {
    this.currentTry = 0;
    this.combinations = [];
    this.maxCombs = Math.pow(this.options.numbers, this.options.places);
    this.state = 'initial';
    this.possible = 0;

    var numberNames = [], i;
    for (i=0; i < this.options.numbers; i++) {
      numberNames[i] = i + 1;
    }
    this.numberNames = numberNames;
  };

  Mastermind.prototype.getGuess = function() {
    if (this.state === 'solved') {
      throw new Error('Mastermind already solved');
    }
    if (this.state !== 'initial' && this.state !== 'fedpins') {
      throw new Error('Incorrect state, cannot guess at this time');
    }
    var temp, tot, curCombNumber, curComb, output, i;
    var places = this.options.places, numbers = this.options.numbers, maxCombs = this.maxCombs;

    this.state = 'guessing';

    temp = [];
    tot = 0;
    for (i=0; i < maxCombs; i++) {
      if (this.combinations[i] === undefined) {
        tot++;
        temp[tot] = i;
      }
    }

    curCombNumber=temp[Math.floor(Math.random() * tot) + 1];
    temp=null;
    curComb = [];
    for (i=0; i < places; i++) {
      curComb[i] = Math.floor(curCombNumber / Math.pow(numbers,i)) % numbers;
    }
    this.curComb = curComb;

    this.currentTry++;
    output = '';
    for (i=places-1; i >= 0; i--) {
      output += this.numberNames[curComb[i]];
    }

    return parseInt(output, 10);
  };

  Mastermind.prototype.feedPins = function(greenPins, bluePins) {
    if (this.state !== 'guessing') {
      throw new Error('Must be in guessing state to feed guess results');
    }

    var last, examinedCombNumber, examinedComb, examinedGreenPins, examinedBluePins, used, a, b, i;
    var places = this.options.places, numbers = this.options.numbers, maxCombs = this.maxCombs;

    if (greenPins === this.options.places) {
      this.state = 'solved';
      return;
    } else if ((greenPins + bluePins) > this.options.numbers) {
      throw new Error('Invalid number of pins');
    }

    this.possible = 0;
    last = 0;

    for (examinedCombNumber=0; examinedCombNumber < maxCombs; examinedCombNumber++) {
      if (Math.floor(10*examinedCombNumber/(maxCombs-1))>=last) {
        last++;
      }
      if (this.combinations[examinedCombNumber] === undefined) {
        examinedComb=[];
        for (i=0; i < places; i++) {
          examinedComb[i]=Math.floor(examinedCombNumber/Math.pow(numbers,i)) % numbers;
        }
        examinedGreenPins=0;
        examinedBluePins=0;
        used=[];
        for (a=0; a < places; a++) {
          if (this.curComb[a] === examinedComb[a]) {
            examinedGreenPins++;
            examinedComb[a] = -1;
            used[a] = 1;
          }
        }
        for (a=0; a < places; a++) {
          if (used[a] === undefined) {
            for (b=0; b < places; b++) {
              if (this.curComb[a] === examinedComb[b]) {
                examinedBluePins++;
                examinedComb[b]= -1;
                break;
              }
            }
          }
        }
        if (bluePins !== examinedBluePins || greenPins !== examinedGreenPins) {
          this.combinations[examinedCombNumber] = 0;
        }
      }
      if (this.combinations[examinedCombNumber] === undefined) {
        this.possible++;
      }
    }

    this.state = 'fedpins';

    if (this.possible===0) {
      this.state = 'failed';
    }

    return this.status();
  };

  Mastermind.prototype.status = function() {
    var possibilities = (this.state === 'initial' || this.currentTry <= 1) ? this.maxCombs : this.possible;
    var successProbability = Math.floor(10000/possibilities+0.5)/10000;
    var status = {state: this.state};
    if (this.state !== 'solved' && this.state !== 'failed') {
      status.possibilities = possibilities;
      status.successProbability = successProbability;
    }
    return status;
  };

  Mastermind.matchPins = function(solution, guess) {
    solution = parseInt(solution, 10).toString();
    guess = parseInt(guess, 10).toString();

    if (guess.length !== solution.length) {
      throw new Error('Mismatched solution and guess lengths');
    }

    var i, x, greenPins = 0, bluePins = 0, guessGreened = [], solutionBlued = [];
    for (i = 0; i < guess.length; i++) {
      if (solution[i] === guess[i]) {
        greenPins++;
        guessGreened[i] = true;
      }
    }

    for (i = 0; i < guess.length; i++) {
      if (!guessGreened[i]) {
        for (x = 0; x < solution.length; x++) {
          if (!guessGreened[x] && !solutionBlued[x] && guess[i] === solution[x]) {
            solutionBlued[x] = true;
            bluePins++;
            break;
          }
        }
      }
    }

    return {green: greenPins, blue: bluePins};
  };


  // amd
  if (typeof define !== "undefined" && define !== null && define.amd) {
    define(function() {
      return Mastermind;
    });
  }
  // commonjs
  else if (typeof module !== "undefined" && module !== null) {
    module.exports = Mastermind;
  }
  // web worker
  else if (typeof self !== "undefined" && typeof self.postMessage === 'function' && typeof self.importScripts === 'function') {
    self.Mastermind = Mastermind;
  }
  // browser main thread
  else if (typeof window !== "undefined" && window !== null) {
    window.Mastermind = Mastermind;
  }
}());
