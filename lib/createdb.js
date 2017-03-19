/**
 * Created by tony on 3/18/17.
 */
'use strict'
const mongodb = require('mongodb');

module.exports = function (options,cb){
  mongodb.connect(options.url,cb)
}