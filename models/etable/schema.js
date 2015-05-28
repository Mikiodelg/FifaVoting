/**
 * Created by andrea on 1/3/15.
 */
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;


var eTableschema = new Schema({
    n: {type:String},
    g:{type:String},
    lambda: {type:String},
    mu:{type:String},
    open:{type:Boolean},
    result:{type:String}
});

module.exports = mongoose.model('Etable', eTableschema);