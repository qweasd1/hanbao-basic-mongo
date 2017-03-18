;
/**
 * Created by tony on 3/17/17.
 * this file contains factories to create basic methods(CRUD) for given model
 */
'use strict'
let helper = require("hanbao-basic-utils")
let splitCriteria = helper.splitCriteria

module.exports = {
  makeRead,
  makeCreate,
  makeUpdate,
  makeDelete,
  makeSoftDelete,
  makeReadWithSoftDelete,
  makeCreateWithSoftDelete
}


function _getDeleteField(options){
    return options && options.field || "is_delete"
}



function makeRead(db, options){
  let defaultSelector = options && options.defaultSelector || null
  
  return function (collection, creteria){
    return new Promise((resolve, reject) => {
      creteria = splitCriteria(creteria)
      let cursor = db.collection(collection).find(creteria.query)
      let options = creteria.options
      
      if("$sort" in options){
        cursor = cursor.sort(options["$sort"])
      }
      
      if("$skip" in options){
        cursor = cursor.skip(options["$skip"])
      }
      
      if("$limit" in options){
        cursor = cursor.limit(options["$limit"])
      }
      
      if("$select" in options){
        cursor = cursor.project(options["$select"])
      }
      else if(defaultSelector) {
        cursor = cursor.project(defaultSelector)
      }
      
      cursor.toArray((err,data)=>{
        if(err){
          reject(err)
        }
        else {
          resolve(data)
        }
      })
      
    })
  }
}

function makeCreate(db, options){
  return function (collection, data) {
    return new Promise((resolve, reject) => {
      if(Array.isArray(data)){
        db.collection(collection).insertMany(data,function (err,data){
          if(err){
            reject(err)
          }
          else {
            resolve(data.ops)
          }
        })
      }else {
        db.collection(collection).insertOne(data,function (err,data){
          if(err){
            reject(err)
          }
          else {
            resolve(data.ops)
          }
        })
      }
    })
  }
}

function makeUpdate(db, options) {
  return function (collection, creteria, data) {
    return new Promise((resolve, reject) => {
      db.collection(collection).updateMany(creteria,{
        $set:data
      },function (err,data){
        if(err){
          reject(err)
        }
        else {
          resolve(data.result)
        }
      })
    })
  }
}

function makeDelete(db, options){
  return function (collection, creteria){
    return new Promise((resolve, reject) => {
      db.collection(collection).deleteMany(creteria,(err,data)=>{
        if(err){
          reject(err)
        }
        else {
          resolve(data.result)
        }
      })
    })
  }
}

/**
 * create a global soft delete method for given collection
 * @param db
 * @param options
 * @returns {Function}
 */
function makeSoftDelete(db, options) {
  let deleteKey = _getDeleteField(options)
  let data = {}
  data[deleteKey] = true
  return function (collection, creteria){
    return new Promise((resolve, reject) => {
      db.collection(collection).updateMany(creteria,{
        $set:data
      },function (err,data){
        if(err){
          reject(err)
        }
        else {
          resolve(data.result)
        }
      })
    })
  }
}

function makeReadWithSoftDelete(db, options){
  let deleteField = _getDeleteField(options)
  let defaultSelector = options && options.defaultSelector || null
  
  return function (collection, creteria){
    return new Promise((resolve, reject) => {
      creteria = splitCriteria(creteria)
      
      let query = creteria.query
      if(!(deleteField in query)){
        query[deleteField] = false
      }
      
      let cursor = db.collection(collection).find(query)
      let options = creteria.options
      
      if("$sort" in options){
        cursor = cursor.sort(options["$sort"])
      }
      
      if("$skip" in options){
        cursor = cursor.skip(options["$skip"])
      }
      
      if("$limit" in options){
        cursor = cursor.limit(options["$limit"])
      }
      
      if("$select" in options){
        cursor = cursor.project(options["$select"])
        
      }
      else if(defaultSelector) {
        cursor = cursor.project(defaultSelector)
      }
      
      cursor.toArray((err,data)=>{
        if(err){
          reject(err)
        }
        else {
          resolve(data)
        }
      })
      
    })
  }
}

function makeCreateWithSoftDelete(db, options){
  let deleteField = _getDeleteField(options)
  return function (collection, data) {
    return new Promise((resolve, reject) => {
      if(Array.isArray(data)){
        data.forEach(x=>{
          // add the deleteField
          if(!(deleteField in x)){
              x[deleteField] = false
          }
        })
        db.collection(collection).insertMany(data,function (err,data){
          if(err){
            reject(err)
          }
          else {
            resolve(data.ops)
          }
        })
      }else {
        // add the deleteField
        if(!(deleteField in data)){
          data[deleteField] = false
        }
        
        db.collection(collection).insertOne(data,function (err,data){
          if(err){
            reject(err)
          }
          else {
            resolve(data.ops)
          }
        })
      }
    })
  }
}