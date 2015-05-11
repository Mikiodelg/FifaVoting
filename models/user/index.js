/**
 * Created by andrea on 1/3/15.
 */
var mongoose = require('mongoose');
var schema = require('.models/user/schema').getSchema();
var model = mongoose.model('User', schema);
module.exports.Model = model;