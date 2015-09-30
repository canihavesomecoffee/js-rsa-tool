/**
 * The object that contains common things, like the prototype functions that
 * can be registered.
 * Copyright © 2013-now Willem Van Iseghem, All rights reserved.
 */
var CommonFunctions = {
    /**
     * Registers the has function to the Array prototype
     */
    registerArrayHas : function(){
        if(!Array.prototype.indexOf){
            this.registerArrayIndexOf();
        }
        Array.prototype.has = function(obj) {
            return this.indexOf(obj) >= 0;
        }
    },
    
    /**
     * Registers the indexOf function to the Array prototype
     */
    registerArrayIndexOf: function(){
        Array.prototype.indexOf = function(obj) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] == obj)
                    return i;
            }
            return -1;
        }
    },
    
    /**
     * Registers the prepend function to the String prototype.
     */
    registerStringPrepend: function(){
        String.prototype.prepend = function(character,minLength){
            var copy = this;
            while(copy.length<minLength){
                copy = character + copy;
            }
            return copy;
        }
    },
    
    /**
     * Checks if primes are loaded up to the given number, if not, it asks the 
     * Prime object to load and return the status of it.
     */
    checkForPrimes: function(number,statusElm){        
        if(!Prime) throw "Prime is not defined!";
        var res = Prime.checkIfPrimesAreLoaded(number,function(){
            CommonFunctions.checkForPrimes(number,statusElm);
        });    
        if(!res.check){        
            alert(res.status);        
        }
        statusElm.textContent = res.status;
        return res.check;
    },
    
    /**
    * Determine the amount of bits per group and split the message into groups with
    * the found length (or simply return the bits).
    */
    calculateBitsPerGroupAndSplit: function(n,message){
        var bits = -1;
        var groups = new Array();
        for(i=1;i<2048;i++){
            if(n>Math.pow(2,i) && n<Math.pow(2,i+1)){
                bits = i+1;
                break;
            }
        }
        if(bits == -1){ 
            return {
                'error':'could not calculate amount of bits',
                'bits':bits,
                'groups':groups
            };
        }
        if(message == null) 
            return {
                'error':'',
                'bits':bits,                
                'groups':groups
            };            
        if(message.length%bits!=0) 
            return {
                'error':'message length is not a x-fold of the calculated bits',
                'bits':bits,
                'groups':groups                
            };            
        for(var l=0;l<message.length/bits;l++){
            var subs = message.substr(l*bits,bits);
            groups.push(subs);
        }
        return {
            'error':'',
            'bits':bits,
            'groups':groups            
        };
    },
    
    /**
     * Converts a given number to a binary number.
     */
    convertToBinarySimple: function(number){
        var pow = 1;
        while(number-Math.pow(2, pow)>0){
            pow++;
        }
        if(number-Math.pow(2, pow)<0){
            pow--;
        }
        var res = "";
        var rem = number;
        while(pow > 0){
            if(rem-Math.pow(2,pow)>=0){
                res += "1";
                rem -= Math.pow(2,pow);
            } else {
                res += "0";
            }
            pow--;
        }
        res += rem;
        return res;
    },
    
    /**
     * Converts a given number to a binary number with a minimum bit length.
     * If the converter number is not long enough, it prepends 0's untill the
     * minimum length;
     */
    convertToBinary: function(number,minLength){
        var convert = this.convertToBinarySimple(number);
        if(!String.prepend)
            this.registerStringPrepend();
        return convert.prepend("0",minLength);
    },
    
    /**
     * Calculates K from two primes, and checks that the calculated K and the given
     * e have a GCD of 1. This is required for RSA.
     */
    calculateK: function(prime1,prime2,e){
        if(prime1 != null && prime2 != null && prime1 != -1 && prime2 != -1){
            var k = (prime1-1)*(prime2-1);
            var gcdR = this.gcd(e,k);
            if(gcdR != 1){                    
                return {"k":-1,"reason":"GCD("+e+","+k+") is "+gcdR+" ,not 1"};
            }
            return {"k":k,"reason":"GCD("+e+","+k+") is 1"};
        } else {
            return {"k":-1,"reason":"Primes missing"};
        }
    },
    
    /**
     * Returns the greatest common denominator of two numbers
     */
    gcd: function(number1,number2){
        var gcd=1;
        if(number1>number2){
            var t = number1;
            number1 = number2;
            number2 = t;
        }
        if(number2%number1 == 0){
            gcd = number1;
        } else {
            for (var i = Math.round(number1/2) ; i > 1; i=i-1) {
                if ((number1==(Math.round(number1/i))*i) &&(number2==(Math.round(number2/i))*i)){
                    gcd=i;
                    i=-1;
                }
            }
        }
        return gcd;
    }
};