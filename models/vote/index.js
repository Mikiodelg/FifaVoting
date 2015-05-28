/**
 * Created by andrea on 1/3/15.
 */
var mongoose = require('mongoose');
var schema = require('.models/vote/schema').getSchema();
var model = mongoose.model('vote', schema);
module.exports.Model = model;