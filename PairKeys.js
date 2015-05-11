    console.log('Pair Key Creation');

   /*
    var crypto = require("crypto");
    var prime_length = 60;
    var diffHell = crypto.createDiffieHellman(prime_length) ;


    diffHell.generateKeys('base64');
    console.log("Public Key : " ,diffHell.getP.getPublicKey('base64'));
    console.log("Private Key : " ,diffHell.getPrivateKey('base64'));
*/
    var keys = require('node-rsa');
    var pair = new keys({b: 2048});
    console.log(pair);
    //console.log('pair: '+pair);
    console.log('modulus: '+pair.keyPair.n);
    console.log('exponent: '+ pair.keyPair.e);



