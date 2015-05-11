/**
 * Created by andrea on 1/3/15.
 */
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;


var Appschema = new Schema({
    privateKey: {type:String},
    publicKey:{type:String}
});

module.exports = mongoose.model('App', Appschema);