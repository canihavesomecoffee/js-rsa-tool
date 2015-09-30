/**
 * The object that contains the methods that are solely used for decrypting RSA
 * messages.
 * Copyright © 2013-now Willem Van Iseghem, All rights reserved.
 */
var Decryptor = {
    /**
     * calculates D required for the decryption of a given RSA message.
     */
    _calculateD: function(k,e){
        var start = 1;
        while((k*start+1)%e!=0){
            start++;
        }
        return (k*start+1)/e;
    },
    
    /**
    * We can try to bruteforce the given number into a product of two primes by:
    * - Getting a list of all primes smaller than n
    * - For each prime (starting with the biggest one):
    *   do n mod prime. If the result is 0, we found the primes
    *   
    * - In case someone was as stupid to use 2 as one of the primes, we added one 
    * extra check.
    */
    _bruteForcePrimes: function(n){
        var p1 = -1;
        var p2 = -1;
        if(n%2==0){
            p1 = 2;
            p2 = n/2;
        } else {
            var partPrime = Prime.getPrimesTo(n);
            for(var i=partPrime.length-1;i>0;i--){
                if(n%partPrime[i] == 0){
                    p1 = partPrime[i];
                    p2 = n/p1;
                    break;
                }        
            }
        }
        return {
            'prime1':p1,
            'prime2':p2
        };
    },
   
   /**
    * Tries to decrypt a given message with a given n and e. Status is an 
    * HTMLElement where we can set the textContent to show the progress. It
    * returns an object with all the data from the decryption. If you're only
    * interested in the result, use this.completed and this.text
    */
    tryDecrypt: function(n,e,message,status){
        var result = {};
        result.completed = false;
        result.text = "";
        status.textContent = "Calculating prime numbers from N";
        var primes = this._bruteForcePrimes(n);
        result.prime1 = primes.prime1;
        result.prime2 = primes.prime2;
        status.textContent = "Determine K";    
        var kResult = CommonFunctions.calculateK(primes.prime1,primes.prime2,e);
        var k = kResult.k;
        result.k = k;
        if(k == -1){
            result.error = kResult.reason;
            return result;
        }
        status.textContent = "Find out D";
        var d = this._calculateD(k,e);
        result.d = d;
        status.textContent = "Split off the message in groups";
        var calcBnG = CommonFunctions.calculateBitsPerGroupAndSplit(n,message);    
        var bits = calcBnG.bits;
        result.bits = bits;
        var groups = calcBnG.groups;
        result.groups = groups;
        if(calcBnG.error != ""){
            result.error = calcBnG.error;
            return result;
        }
        status.textContent = "Decipher message";  
        var power = BigInteger(d);
        var mod = BigInteger(n);
        var perGroup = (bits-(bits%8))/8;    
        var decimals = new Array();
        var decryptedDecimals= new Array();
        var decryptedBits = new Array();
        var decryptedBitDecimals = new Array();
        var decryptedLetters = new Array();        
        for(var i=0;i<groups.length;i++){
            var decimal = parseInt(groups[i], 2);
            decimals.push(decimal);
            var big = BigInteger(decimal);
            var decryptedDecimal = big.modPow(power,mod);
            decryptedDecimals.push(decryptedDecimal);
            var decryptedBit = CommonFunctions.convertToBinary(decryptedDecimal,perGroup*8);
            var db = new Array();
            var dbd = new Array();
            var dl= new Array();
            var decSplit;
            var letter;
            while(decryptedBit.length>8){
                var split = decryptedBit.substr(0,8);
                decryptedBit = decryptedBit.substr(8,decryptedBit.length);
                db.push(split);
                decSplit = parseInt(split,2);
                dbd.push(decSplit);
                letter = String.fromCharCode(decSplit);
                dl.push(letter);
                result.text += letter;
            }
            db.push(decryptedBit);
            decSplit = parseInt(decryptedBit,2);
            dbd.push(decSplit);
            letter = String.fromCharCode(decSplit);
            dl.push(letter);
            result.text += letter;
            decryptedBits.push(db);
            decryptedBitDecimals.push(dbd);
            decryptedLetters.push(dl);
        } 
        result.decimals = decimals;
        result.decryptedDecimals = decryptedDecimals;
        result.decryptedBits = decryptedBits;
        result.decryptedBitDecimals = decryptedBitDecimals;
        result.decryptedLetters = decryptedLetters;
        result.completed = true;
        return result;
    }
};