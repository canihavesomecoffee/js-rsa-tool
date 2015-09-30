function load(){                
    selectCorrectTab();
    var bounds = Prime.getBoundaries();
    document.getElementById("supportStart").innerHTML = bounds.from;
    document.getElementById("supportEnd").innerHTML = bounds.to; 
}

function selectCorrectTab(){
    var lis = document.getElementById("panel").children;
    var divs = document.getElementById("panels").children;
    for(var i=0;i<divs.length;i++){
        divs[i].className = "";
        lis[i].className = "";
    }
    switch(window.location.hash){
        case "#calculate":
            divs[1].className = "active";
            lis[1].className = "active";
            break;
        case "#encrypt":
            divs[2].className = "active";
            lis[2].className = "active";
            break;
        case "#decrypt":
            divs[3].className = "active";
            lis[3].className = "active";
            break;
        case "#examples":
            divs[4].className = "active";
            lis[4].className = "active";
            break;
        default:
            lis[0].className = "active";
            divs[0].className = "active";
            break;                            
    }
}
            
function toggle(elem){
    var lis = document.getElementById("panel").children;
    var divs = document.getElementById("panels").children;
    for(var i=0;i<lis.length;i++){
        if(lis[i] == elem.parentNode){
            lis[i].className = "active";
            divs[i].className = "active";
        } else {
            lis[i].className = "";
            divs[i].className = "";
        }
    }
}

function calc(){
    clearcalc();
    var from=parseInt(document.getElementById("startwith").value,10);
    var to = parseInt(document.getElementById("endwith").value,10);
    var shouldExplain = document.getElementById("shouldExplain").checked;
    var result = PrimeCalculator.calculateRange(from,to,document.getElementById("primestatusspan"));
    if(result == null){        
        return;
    }
    document.getElementById("resultCalc").value = result.primes;
    if(shouldExplain){
        var explain = document.getElementById("explain"); 
        for(var i=0;i<result.explanations.length;i++){
            explain.innerHTML += result.explanations[i].number+" can be divided by "+result.explanations[i].by+"<br />";
        }
    }
}

function clearcalc(){
    document.getElementById("explain").innerHTML = "";
    document.getElementById("resultCalc").value = "";
} 

function handleDecryption(){
    var n = document.getElementById('n').value;    
    if(!CommonFunctions.checkForPrimes(n,document.getElementById("primestatusspan"))) return;
    var e = document.getElementById('e').value;
    var message = document.getElementById('message').value;
    var status = document.getElementById('status');
    var result = Decryptor.tryDecrypt(n,e,message,status);
    if(result.completed){
        status.textContent = "Creating elements";
        if(!fillResult()){
            status.textContent = "Aborted decryption";
            return;        
        }
        document.getElementById('prime1').textContent = result.prime1;
        document.getElementById('prime2').textContent = result.prime2;
        document.getElementById('k').textContent = result.k;
        document.getElementById('bits').textContent = result.bits;
        document.getElementById("d").textContent = result.d;
        document.getElementById('decryptedText').textContent = result.text;
        var table = document.getElementById('messageD');
        for(var i=0;i<result.groups.length;i++){
            var row = document.createElement("tr");
            var bitgroup = document.createElement("td");
            bitgroup.textContent = result.groups[i];
            row.appendChild(bitgroup);
            var decimal = document.createElement("td");
            decimal.textContent = result.decimals[i];
            row.appendChild(decimal);
            var decryptedDecimals = document.createElement("td");
            decryptedDecimals.textContent = result.decryptedDecimals[i];
            row.appendChild(decryptedDecimals);
            var decryptedBits = document.createElement("td");
            decryptedBits.textContent = result.decryptedBits[i].join(" ");
            row.appendChild(decryptedBits);
            var decryptedBitDecimals = document.createElement("td");
            decryptedBitDecimals.textContent = result.decryptedBitDecimals[i].join(" ");
            row.appendChild(decryptedBitDecimals);
            var decryptedLetters = document.createElement("td");
            decryptedLetters.textContent = result.decryptedLetters[i].join(" ");
            row.appendChild(decryptedLetters);
            table.appendChild(row);
        }  
        status.textContent = "Finished decryption";
    } else {
        alert("Could not decrypt: "+result.error);
        console.log(result);
    }
}
            
function fillResult(){
    var result = document.getElementById('result');
    if(result.innerHTML != ""){
        if(!confirm("There appears to be a result from a previous decryption, are you sure you want to overwrite it?")) return false;
        result.innerHTML = "";
    }
    var p = document.createElement("p");
    p.appendChild(document.createTextNode("Prime factors for N: "));
    var prime1 = document.createElement("span");
    prime1.setAttribute("id", "prime1");
    p.appendChild(prime1);
    p.appendChild(document.createTextNode(" and "));
    var prime2 = document.createElement("span");
    prime2.setAttribute("id", "prime2");
    p.appendChild(prime2); 
    p.appendChild(document.createElement("br"));
    p.appendChild(document.createTextNode("K: "));
    var k = document.createElement("span");
    k.setAttribute("id","k");
    p.appendChild(k); 
    p.appendChild(document.createElement("br"));
    p.appendChild(document.createTextNode("Bits per group: "));
    var bits = document.createElement("span");
    bits.setAttribute("id", "bits");
    p.appendChild(bits); 
    p.appendChild(document.createElement("br"));
    p.appendChild(document.createTextNode("D: "));
    var d = document.createElement("span");
    d.setAttribute("id","d");
    p.appendChild(d); 
    result.appendChild(p);
    var messageD = document.createElement("table");
    messageD.setAttribute("id","messageD");
    var messageDrow = document.createElement("tr");
    messageDrow.innerHTML = "<th>Bit group</th>";
    messageDrow.innerHTML += "<th>Decimal</th>";
    messageDrow.innerHTML += "<th>Decrypted decimal</th>";
    messageDrow.innerHTML += "<th>Bit group(s)</th>";
    messageDrow.innerHTML += "<th>Decimal(s)</th>";
    messageDrow.innerHTML += "<th>Text</th>";
    messageD.appendChild(messageDrow);
    var decryptedText = document.createElement("p");
    decryptedText.setAttribute("id", "decryptedText");
    result.appendChild(decryptedText);
    result.appendChild(messageD);
    return true;
} 

function generateRandom(){    
    if(!Prime) throw "Prime is not defined!";
    var number = Prime.getBoundaries().to;
    var res = Prime.checkIfPrimesAreLoaded(number,function(){
        generateRandom();
    }); 
    document.getElementById("primestatusspan").textContent = res.status;
    if(!res.check){        
        alert(res.status);
        return;
    }
    document.getElementById("p").value = Prime.getRandomPrime();
    document.getElementById("q").value = Prime.getRandomPrime();
}

// TODO: move all functions below AWAY to objects.
function handleEncryption(){
    startEncryption();
}


function startEncryption(){
    var p = parseInt(document.getElementById('p').value,10);
    var q = parseInt(document.getElementById('q').value,10);
    if(!CommonFunctions.checkForPrimes(Math.max(p,q),document.getElementById("primestatusspan"))) return;
    var status = document.getElementById('statusEn');
    status.textContent = "Creating elements";
    fillEncryptionResult();
    status.textContent = "Checking if P is prime";
    var pRes = document.getElementById('pprime');
    if(Prime.isPrime(p)){
        pRes.textContent = "Yes";
    } else {
        pRes.textContent = "No";
        return;
    }
    status.textContent = "Checking if Q is prime";				
    var qRes = document.getElementById('qprime');
    if(Prime.isPrime(q)){
        qRes.textContent = "Yes";
    } else {
        qRes.textContent = "No";
        return;
    }
    status.textContent = "Calculate N";
    var n = p*q;
    document.getElementById("nEnc").textContent = n;
    status.textContent = "Checking if E is entered";
    var e = parseInt(document.getElementById('publice').value,10);    
    if(e == "NaN"){
        alert("E is not entered!");
        return;
    }    
    status.textContent = "Calculate k";
    var kRes = CommonFunctions.calculateK(p,q,e);
    var k = kRes.k;
    if(k != -1){
        document.getElementById("kEnc").textContent = k;
        document.getElementById("gcdCheck").innerHTML = kRes.reason;
    } else {
        document.getElementById("gcdCheck").innerHTML = kRes.reason;
        return;
    }
    status.textContent = "Determining bits per group";
    var bits = CommonFunctions.calculateBitsPerGroupAndSplit(n,null).bits;
            
    document.getElementById('bpl').textContent = bits;
    status.textContent = "Encrypting message";
    if(bits<8){
        alert("Too few bytes per group! Please choose larger primes");
        return;
    }
    var perGroup = (bits-(bits%8))/8;
    var orMess = document.getElementById('toEncrypt').value;
    var convertGroup = function(chars){
        var table = document.getElementById('messageE');
        var row = document.createElement("tr");
        var group = document.createElement("td");
        group.textContent = chars;
        row.appendChild(group);
        var decimalgroup = document.createElement("td");
        var bitgroup = document.createElement("td");
        for(var i=0;i<chars.length;i++){
            var decimalS = chars[i].charCodeAt();
            decimalgroup.textContent += decimalS + " ";
            var binary = CommonFunctions.convertToBinary(decimalS,8);
            bitgroup.textContent += binary + " ";
        }
        row.appendChild(decimalgroup);
        row.appendChild(bitgroup);
        var decimalBit = parseInt(bitgroup.textContent.replace(" ","","g"),2);
        var decimal = document.createElement("td");
        decimal.textContent = decimalBit;
        row.appendChild(decimal);
        var big = BigInteger(decimalBit);
        var enDecimal = big.modPow(BigInteger(document.getElementById('publice').value),BigInteger(document.getElementById("nEnc").textContent));
        var decimalE = document.createElement("td");
        decimalE.textContent = enDecimal;
        row.appendChild(decimalE);
        var bitE = document.createElement("td");
        var enBit = CommonFunctions.convertToBinary(enDecimal,bits);
        document.getElementById("encryptedText").value = enBit + document.getElementById("encryptedText").value;
        bitE.textContent = enBit;
        row.appendChild(bitE);
        if(table.childNodes.length>1){
            table.insertBefore(row, table.childNodes[1]);
        } else {
            table.appendChild(row);
        }                
    };
    var chars;
    for(var i=orMess.length-perGroup;i>0;i-=perGroup){                
        chars = orMess.substr(i,perGroup);                
        convertGroup(chars);
    }
    chars = orMess.substr(0,perGroup+i);
    convertGroup(chars);
    status.textContent = "Done";
}
			
function fillEncryptionResult(){
    var result = document.getElementById('resultEn');
    if(result.innerHTML != ""){ 
        alert("You need to clear the previous results first!");
        return;                
    }
    var p = document.createElement("p");
    p.appendChild(document.createTextNode("P is prime? "));
    var pspan = document.createElement("span");
    pspan.setAttribute("id","pprime");
    p.appendChild(pspan);
    p.appendChild(document.createElement("br"));
    p.appendChild(document.createTextNode("Q is prime? "));
    var qspan = document.createElement("span");
    qspan.setAttribute("id","qprime");
    p.appendChild(qspan);
    p.appendChild(document.createElement("br"));
    p.appendChild(document.createTextNode("N: "));
    var n = document.createElement("span");
    n.setAttribute("id","nEnc");
    p.appendChild(n);
    p.appendChild(document.createElement("br"));
    p.appendChild(document.createTextNode("K: "));
    var k = document.createElement("span");
    k.setAttribute("id","kEnc");
    p.appendChild(k);
    p.appendChild(document.createElement("br"));
    p.appendChild(document.createTextNode("GCD(E,K): "));
    var ggd = document.createElement("span");
    ggd.setAttribute("id","gcdCheck");
    p.appendChild(ggd);
    p.appendChild(document.createElement("br"));
    p.appendChild(document.createTextNode("Number of bits per group: "));
    var bpl = document.createElement("span");
    bpl.setAttribute("id","bpl");
    p.appendChild(bpl);
    result.appendChild(p);
    var messageE = document.createElement("table");
    var messageErow = document.createElement("tr");
    messageErow.innerHTML = "<th>Character(s)</th>";
    messageErow.innerHTML += "<th>Decimal(s)</th>";
    messageErow.innerHTML += "<th>Bit group(s)</th>";
    messageErow.innerHTML += "<th>Decimal</th>";
    messageErow.innerHTML += "<th>Decimal encrypted</th>";
    messageErow.innerHTML += "<th>Bit group encrypted</th>";            
    messageE.appendChild(messageErow);
    messageE.setAttribute("id","messageE");
    result.appendChild(messageE);
    var encryptedText = document.createElement("textarea");
    encryptedText.setAttribute("id", "encryptedText");
    result.appendChild(encryptedText);				
}

var Encryptor = {};