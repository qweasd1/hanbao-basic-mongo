;
/**
 * Created by tony on 3/17/17.
 * this file contains factories to create basic methods(CRUD) for given model
 */
'use strict'
module.exports = function (options){
    options = options || {}
    return {
      // default sourceType mongo
      name:options.name || "mongo",
      default:options.default || false,
      basicMethodFactory:require('./factory'),
      createDb:require('./createdb'),
      info:require("../package.json")
    }
}