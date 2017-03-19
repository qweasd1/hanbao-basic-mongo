/**
 * Created by tony on 3/17/17.
 */
'use strict'
const factory = require('../lib/factory');
const mongodb = require('mongodb');

mongodb.connect("mongodb://localhost:27017/hanbao",null,(err,db)=>{
  
  let read = factory.makeReadWithSoftDelete(db,{defaultSelector:{name:1,age:1}})
  read("person",{$limit:1,$select:{name:1}}).then((data)=>{
    console.log(data);
  }).catch((err)=>{
    console.log(err);
  })
  
  // let create = factory.makeCreateWithSoftDelete(db)
  // create("person",{name:"jane",age:23}).then((data)=>{
  //   console.log(data);
  // })
  //
  
  // let del = factory.makeDelete(db)
  // del("person",{age:23}).then((data)=>{
  //   console.log(data);
  // })
  
  // let del = factory.makeSoftDelete(db)
  // del("person",{name:"tony"}).then((data)=>{
  //   console.log(data);
  // })
  //
  
  // let del = factory.makeUpdate(db)
  // del("person",{name:"tony"},{age:27}).then((data)=>{
  //   console.log(data);
  // })

  
  
})

