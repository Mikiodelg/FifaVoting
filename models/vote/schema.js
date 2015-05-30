/**
 * Created by andrea on 1/3/15.
 */
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;


var Voteschema = new Schema({
    PID: {type:String},
    sign: {type:String},
    vote: {type:String},
    digest: {type:String}
});

module.exports = mongoose.model('Vote', Voteschema);