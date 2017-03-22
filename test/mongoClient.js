/**
 * Created by tony on 3/22/17.
 */
'use strict'
const mongodb = require('mongodb');
mongodb.connect("mongodb://localhost:27017/hanbao",(err,db)=>{
  db.collection("person").find({name:"kk"}).next((err,data)=>{
    console.log(err,data);
  })
})