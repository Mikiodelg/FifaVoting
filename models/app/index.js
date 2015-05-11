/**
 * Created by andrea on 1/3/15.
 */
var mongoose = require('mongoose');
var schema = require('.models/app/schema').getSchema();
var model = mongoose.model('App', schema);
module.exports.Model = model;