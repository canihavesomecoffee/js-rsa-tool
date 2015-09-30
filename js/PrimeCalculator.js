/**
 * An object that's used to calculate ranges of primes, with explanations.
 * Copyright © 2013-now Willem Van Iseghem, All rights reserved.
 */
var PrimeCalculator = {
    /**
     * Private member that holds the explanations for each number
     */
    _explanations: [],
    
    /**
     * A function to calculate all primes between start and end. Returns an
     * object with the array of primes, and an array with the explanations, or
     * null if the primes still need to be loaded in.
     */
    calculateRange: function(start,end,primestatusElm){ 
        if(!Prime) throw "Prime is not defined!";
        if(!CommonFunctions) throw "CommonFunctions is not defined!";
        this._explanations = [];
        var i = start;
        if(i<2) i=2; 
        if(!CommonFunctions.checkForPrimes(end,primestatusElm)) return null;
        for(i;i<=end;i++){
            this._isPrime(i);                    
        }
        return {            
            "primes":Prime.getPrimesFromTo(start,end),
            "explanations":this._explanations
        };
    },
    
    /**
     * A private function that checks if the given number is a prime and returns
     * the result.
     * If it's a prime it pushes the prime onto the prime stack and explanations.
     * If it's not a prime it also adds an explanation.
     */
    _isPrime : function(number) {
        if(!Prime) throw "Prime is not defined!";
        for(var i=0;i<Prime.primes.length;i++){
            if(number%Prime.primes[i] == 0 && number != Prime.primes[i]){ 
                this._explanations.push({
                    "number":number,
                    "by":Prime.primes[i]
                    });
                return false;                       
            }
        } 
        Prime.primes.push(number);           
        this._explanations.push({
            "number":number,
            "by":"one and itself, it's a PRIME"
        });
        return true;
    }
};