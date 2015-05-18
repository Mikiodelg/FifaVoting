/**
 * Created by Miki-Muntain on 15/05/2015.
 */
var bigint = require('big-integer');
var browser = require ('browserify-bignum');


var p = 11;  // <- Posible primo valido
var q = 13; // <- Posible primo valido
var n = q*p;

console.log('n: '+n + ' n^2: '+(n*n));

var lambda = bigint.lcm((p-1),(q-1));

console.log('lambda: '+ lambda.toString());

var alpha = bigint.randBetween(0,(n));
alpha = 110; // <- Posible random generador valido
//60; // <- Posible random generador valido
var beta = bigint.randBetween(0,(n));
beta = 127; // <- Posible random generador valido
//49; // <- Posible random generador valido

console.log('alpha: '+alpha.toString()+' beta: '+beta.toString());

var g = bigint(((alpha*n)+1)*(bigint(beta).pow(n))).mod((n*n));
console.log('g: '+g.toString());

var u = (bigint(bigint(g).pow(alpha)).mod(n*n));
var L = (u-1)/n;

var mu = bigint(bigint(1).divide(L)).mod(n);
console.log('u: '+u.toString()+' L: '+L.toString()+' mu: '+mu.toString());

//Encrypt y Decrypt

var r1 = bigint.randBetween(0,(n));
var r2 = bigint.randBetween(0,(n));
console.log('r1: '+r1.toString()+' r2: '+r2.toString());

var m1 = 103;
var m2 = 34;
var m3 = m1+m2;
console.log('m1: '+m1.toString()+' m22: '+m2.toString()+ ' suma = '+m3.toString());

var c1 = bigint((bigint(g).modPow(m1,n*n))*bigint(r1).modPow(n,n*n));
var c2 = bigint((bigint(g).modPow(m2,n*n))*bigint(r2).modPow(n,n*n));
console.log('c1: '+c1.toString()+' c2: '+c2.toString());

var ctotal = bigint(bigint(c1).multiply(c2)).mod(n*n);
console.log('ctotal: '+ctotal.toString());

var u1 = bigint(ctotal).modPow(lambda,n*n);
var L1 = (u1-1)/n;
console.log('u1: '+u1.toString()+' L1: '+L1.toString());

var mtotal = bigint(bigint(L1).multiply(mu)).mod(n);
console.log('mtotal: '+mtotal.toString());
