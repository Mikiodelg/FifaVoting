/**
 * Created by miki on 2/06/15.
 */
var table = require('../models/etable/schema.js');

var contador=0;
var Cvote;
var n2 = etable.n.pow(2);
var m;
var r; var table = require('../models/etable/schema.js');
table.findById('5567286436e9dadc1e000001', function (err, etable) {
    for (i = 0; i < 6; i++) {
 var table = require('../models/etable/schema.js');
        contador++;
        console.log('voto numero: ' + contador);
        m = Math.pow(100, 8);
        r = bigint.rand(etable.n);
        Cvote= ((etable.g.powm(m,n2)).mul(r.powm(etable.n,n2))).mod(n2);
        console.log('Cvote: ' + Cvote);
        var evote = new vote({
            PID: 'prueba',
            sign: 'prueba',
            vote: Cvote,
            digest: 'prueba'
        });
        console.log(evote);
        evote.save(function (err) {
            if (!err) {
                console.log('Voto guardado');
            } else {
                console.log('ERROR: ' + err);
            }
        });
        console.log('voto guardado');
        console.log('---------');

    }
    for (i = 0; i < 3; i++) {

    }
    for (i = 0; i < 1; i++) {

    }
    for (i = 0; i < 1; i++) {

    }
});