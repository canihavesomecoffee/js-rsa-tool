/**
 * The object that contains all primes and all related functions.
 * Copyright © 2013-now Willem Van Iseghem, All rights reserved.
 */
var Prime = {
    /**
     * The array that holds all loaded primes.
     */
    primes: new Array(),
    /**
     * Two variables that hold the boundaries (in hundred thousands)
     * where between in I got all the primes stored for.
     */
    _start: 0,
    _end: 15,
    /**
     * An array for callback uses. This stores a list of variable names, which
     * when the load function is called, are appended to the primes array like this:
     * primes = primes.concat(window[variablename]);
     */
    _primesToLoad: new Array(),
    /**
     * This boolean tells whether or not the mamxium amount of available primes
     * have been loaded into the array.
     */
    canLoadMore: true,
    /**
     * This boolean tells if the asynchronous javascript loading script has finished
     * loading the primes that were requested, and if they have been added to the
     * list of primes.
     */
    finishedToLoad: false,

    /**
     * Returns the boundaries for the primes that can be loaded.
     */
    getBoundaries: function () {
        return {"from": this._start, "to": this._end * 100000};
    },

    /**
     * Returns the number of loaded primes (the length of the primes array).
     */
    loadedNumberOfPrimes: function () {
        return this.primes.length;
    },

    /**
     * Returns the biggest prime that is available (provided the array is sorted)
     */
    lastPrime: function () {
        this.sortPrimes();
        return this.primes[this.loadedNumberOfPrimes() - 1];
    },

    /**
     * Sorts the primes according to the numeric value, from small to big.
     */
    sortPrimes: function () {
        this.primes = this.primes.sort(function (a, b) {
            return a - b;
        });
    },

    /**
     * Checks if the given number is inside the list of loaded primes.
     */
    isPrime: function (number) {
        if (!Array.prototype.has) {
            if (!CommonFunctions) throw "CommonFunctions is not defined!";
            CommonFunctions.registerArrayHas();
        }
        return this.primes.has(number);
    },

    /**
     * Returns an array of all loaded primes up to the given number.
     */
    getPrimesTo: function (number) {
        if (number >= (this.end * 100000)) return this.primes;
        var part = new Array();
        for (var i = 0; i < this.primes.length; i++) {
            if (this.primes[i] <= number)
                part.push(this.primes[i]);
            else
                break;
        }
        return part;
    },

    /**
     * Returns an array with all primes starting from a given number up to the
     * other given boundary.
     */
    getPrimesFromTo: function (start, end) {
        var primesTo = this.getPrimesTo(end);
        return primesTo.slice(this.indexOfFirstUpwardMatch(start));
    },

    /**
     * Returns a random prime available from the loaded ones.
     */
    getRandomPrime: function () {
        return this.primes[Math.floor(Math.random() * this.loadedNumberOfPrimes())];
    },

    /**
     * Actual function that loads all primes to a given 100K, at least when the
     * number isn't bigger than the maximum boundary (this.end*100000). The callback
     * will be executed when the primes have been loaded.
     */
    loadPrimesTo: function (number, callback) {
        if (!$LAB) throw "JSLAB is not defined!";
        var to = (number / 100000);
        to = Math.min(to, this._end);
        if (to == this._end) {
            this.canLoadMore = false;
        }
        if (!String.prototype.prepend) {
            if (!CommonFunctions) throw "CommonFunctions is not defined!";
            CommonFunctions.registerStringPrepend();
        }

        this.finishedToLoad = false;
        for (var i = 0; i < to; i++) {
            $LAB.queueScript("primes/" + (i + "").prepend("0", 12) + "_primes.js");
            this._primesToLoad.push("PRIME_" + i);
        }
        $LAB.queueWait(function () {
            Prime.loadPrimesToCallback(callback);
        });
        $LAB.runQueue();
    },

    /**
     * The callback function that is executed by this.loadPrimesTo. It processes
     * the list of this.primesToLoad and adds them to the primes list. If there's
     * a callback function, it calls it.
     */
    loadPrimesToCallback: function (callback) {
        while (this._primesToLoad.length > 0) {
            var varName = this._primesToLoad.shift();
            if (window[varName]) {
                this.primes = this.primes.concat(window[varName]);
            }
        }
        this.finishedToLoad = true;
        if (callback)
            callback();
    },

    /**
     * Checks if primes are loades to a given number, and makes sure they're
     * loaded if it's not the case. Passes the callback function to the loading
     * function.
     */
    checkIfPrimesAreLoaded: function (number, callback) {
        var status = "Loaded primes up to " + this.lastPrime() + " (" + this.loadedNumberOfPrimes() + " primes).";
        var check = true;
        if ((!this.finishedToLoad) || (this.lastPrime() < number && this.canLoadMore)) {
            this.loadPrimesTo((number - number % 100000) + 100000, callback);
            status = "Loading primes... Please wait...";
            check = false;
        }
        return {"check": check, "status": status};
    },

    /**
     * Returns the index of the first element that is equal to the given number,
     * or bigger.
     */
    indexOfFirstUpwardMatch: function (number) {
        if (!Array.prototype.has) {
            if (!CommonFunctions) throw "CommonFunctions is not defined!";
            CommonFunctions.registerArrayHas();
        }
        if (this.primes.has(number)) {
            return this.primes.indexOf(number);
        } else {
            var elm = number;
            while (!this.primes.has(elm) && elm < this.primes[this.primes.length - 1]) {
                elm++;
            }
            return this.primes.indexOf(elm);
        }
    }
};