/**
 * Created by Miki-Muntain on 15/05/2015.
 */
var bigint = require('bignum');
var big = require('big-integer');
//var browser = require ('browserify-bignum');
var keyLength = 1024;

//var p = 11;  // <- Posible primo valido
//var q = 13; // <- Posible primo valido
var p, q, n, phi, n2;

p = bigint.prime(keyLength/2);
do {
    q = bigint.prime(keyLength/2);
    n= p.mul(q);

    phi = (p.sub(1)).mul(q.sub(1));
} while(p.cmp(q) == 0 || n.bitLength() != keyLength || n.gcd(phi) != 1);
n2 = n.pow(2);

var lcm = function(a,b) {
    return (a.mul(b)).div(a.gcd(b));
};

console.log('p: '+ p);
console.log('q: '+ q);
console.log('n: '+n);
console.log('n^2: '+n2);

var lambda = lcm( p.sub(1) , q.sub(1) );

console.log('lambda: '+ lambda);

var alpha, beta;
//var alpha = bigint.randBetween(0,(n));
//alpha = 110; // <- Posible random generador valido
alpha = bigint.rand(n);
//60; // <- Posible random generador valido
//var beta = bigint.randBetween(0,(n));
//beta = 127; // <- Posible random generador valido
do {
    beta = bigint.rand(n);
} while(alpha == beta);
//49; // <- Posible random generador valido

console.log('alpha: '+alpha.toString());
console.log('beta: '+beta.toString());

var g = (((alpha.mul(n)).add(1)).mul(beta.powm(n,n2))).mod(n2);
console.log('g: '+g.toString());

//var u = (bigint(bigint(g).pow(alpha)).mod(n*n));
var u = g.powm(lambda,n2);
console.log('u: '+ u);

var L = (u.sub(1)).div(n);
console.log('L: '+L);

//var mu = bigint(bigint(1).divide(L)).mod(n);
var mu = L.invertm(n);
console.log('mu: '+mu.toString());

//Encrypt y Decrypt

var m1= 103;
var m2= 34;
var mt = m1+m2;
console.log('m1: '+m1.toString());
console.log('m2: '+m2.toString());
console.log('mt: '+mt.toString());

var r1 = bigint.rand(n);
var r2 = bigint.rand(n);
console.log('r1: '+r1.toString());
console.log('r2: '+r2.toString());

//var c1 = bigint((bigint(g).modPow(m1,n*n))*bigint(r1).modPow(n,n*n));
//var c2 = bigint((bigint(g).modPow(m2,n*n))*bigint(r2).modPow(n,n*n));
var c1 = ((g.powm(m1,n2)).mul(r1.powm(n,n2))).mod(n2);
var c2 = ((g.powm(m2,n2)).mul(r1.powm(n,n2))).mod(n2);
console.log('c1: '+c1.toString());
console.log('c2: '+c2.toString());

//var ctotal = bigint(bigint(c1).multiply(c2)).mod(n*n);
var ctotal = (c1.mul(c2)).mod(n2);
console.log('ctotal: '+ctotal.toString());

//var u1 = bigint(ctotal).modPow(lambda,n*n);
var u1 = ctotal.powm(lambda,n2);
var L1 = (u1.sub(1)).div(n);
console.log('u1: '+u1.toString());
console.log('L1: '+L1.toString());

//var mtotal = bigint(bigint(L1).multiply(mu)).mod(n);
var mtotal =(L1.mul(mu)).mod(n);
console.log('mtotal: '+mtotal.toString());

var mprueba = Math.pow(100, 8); ;
console.log('mprueba: '+mprueba.toString());

