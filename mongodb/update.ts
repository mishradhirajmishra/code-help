db.collection.findAndModify(document)  //depricated


replaceOne(filter,{document})     // replaces the first matching document in the collection that matches the filter, using the replacement document.
db.collection.findOneAndReplace(  // same option  findOneAndUpdate(). both function return either "before" or "after" modified document as per option
  <filter>,
  <replacement>,
  {
    // writeConcern: <document>,
    // projection: <document>,
    // sort: <document>,
    // maxTimeMS: <number>,
    // upsert: <boolean>,
    returnDocument: <string>,  // either "before" or "after"
    returnNewDocument: <boolean>, // default true
    // collation: <document>
  }
)

// ================================================
db.collection.updateOne(    //replaceOne() ,updateMany()  also same in all aspect except work on multiple document match
  <filter>,
  <update>,
  {
    upsert: <boolean>,                             // create new one if does not exist  
    writeConcern: <document>,                      // default { w: "majority", j: true, wtimeout: 5000 }
    collation: <document>,                         // default { locale: "en", strength: 2 } makes string matching case-insensitive.
    arrayFilters: [ <filterdocument1>, ... ],  
    hint:  <document|string>,                     //Suggests which index to use for the query.
    let: <document>,
    sort: <document> 
  }
)
db.users.updateOne(
  // FILTER
  { name: "john" },

  // UPDATE OPERATORS
  {
    $set: { age: 30 },
    $set: { location: "San Francisco" },
    $set: { "scores.$[lowScore]": 50 }
  },

  // OPTIONS
  {
    upsert: true,
    collation: { locale: "en", strength: 2 },       //{ locale: "en", strength: 2 } makes string matching case-insensitive.
    arrayFilters: [ { "lowScore": { $lt: 50 } } ],  //Applies only to elements in scores that are < 50.
    hint: { name: 1 },                              //Forces MongoDB to use an index on the name field.
    sort: { age: 1 },                               // sort to pick the youngest "john"
    let: { targetCity: "San Francisco" }             // pass variables for use in update
                                                      //Declares a variable targetCity that can be referenced as $$targetCity in the update stage.
  }
)


db.users.updateOne(
 { username: "johndoe" },
 { $set: { fullName: { $concat: ["$firstName", " ", "$lastName"] } } } ,
 { upsert: true ,  // create new document if does not exist
  bypassDocumentValidation: true}//skip validation during update (in write-heavy ops)
);

updateOne(
  { username: "johndoe" },
  {
    $set: { lastLogin: new Date(), "grades.$[elem].score": 100 }
  },
  {
    upsert: true,
    arrayFilters: [{ "elem.score": { $lt: 60 } }],
    collation: { locale: "en", strength: 2 },
    hint: { username: 1 },
    bypassDocumentValidation: true
  }
);
//Update with Aggregation Pipeline
// db.collection.updateOne() can use an aggregation pipeline for the update. The pipeline can consist of the following stages:
//$addFields and its alias $set
//$project and its alias $unset
//$replaceRoot and its alias $replaceWith

// The $set and $unset used in the pipeline refers to the aggregation stages $set and $unset respectively, and not the update operators $set and $unset.
db.students.updateOne(
  { _id: 1 },
  [
     { $set: { status: "Modified", comments: [ "$commentsSemester1", "$commentsSemester2" ], lastUpdate: "$$NOW" } },
     { $unset: [ "commentsSemester1", "commentsSemester2" ] }
  ]
)


db.students.updateOne(
  { name: "John" },
  { $set: { "grades.$[elem]": 95 } },
  { arrayFilters: [ { "elem": { $lt: 60 } } ] }
)
 

//================
// if verified is false then remove email
db.users.updateOne(
  {},
  [
    {
      $set: {
        email: {
          $cond: {
            if: { $eq: ["$verified", false] },   
            then: "$$REMOVE",
            else: "$email"
          }
        }
      }
    }
  ]
)


db.user.update({"city":"lko"},{ $set :{ "salary":"20000"}},{multi:true})  // older verson now updateOne and updateMany seprated


//===============================================
// update part of query
{ $set: { city: "New York" } }
{ $unset: { city: "" } }     // remove field
{ $inc: { age: 1 } }
{ $mul: { salary: 1.1 } }
{ $rename: { "oldField": "newField" } }

{ $push: { tags: "mongodb" } }  //Add a value to an array.
 {
  $push: {
    tags: {
      $each: ["database", "nosql"] //add multiple value to an array.
    }
  }
}
 { $addToSet: { tags: "database" } }  //Add to array only if it doesn't already exist.(unique)
 { $pull: { tags: "nosql" } }  //Remove value(s) from an array.
{ $pop: { tags: 1 } } // 1 = last, -1 = first Remove first or last element of array.
//==================================================
[
  { "_id" : 1, "grades" : [ 95, 92, 90 ] },
  { "_id" : 2, "grades" : [ 98, 100, 102 ] },
  { "_id" : 3, "grades" : [ 95, 110, 100 ] }
]
db.students.updateOne(
  { grades: { $gte: 100 } },
  { $set: { "grades.$[element]" : 100 } },
  { arrayFilters: [ { "element": { $gte: 100 } } ] }
)

[
  {
     "_id" : 1,
     "grades" : [
        { "grade" : 80, "mean" : 75, "std" : 6 },
        { "grade" : 85, "mean" : 90, "std" : 4 },
        { "grade" : 85, "mean" : 85, "std" : 6 }
     ]
  },
  {
     "_id" : 2,
     "grades" : [
        { "grade" : 90, "mean" : 75, "std" : 6 },
        { "grade" : 87, "mean" : 90, "std" : 3 },
        { "grade" : 85, "mean" : 85, "std" : 4 }
     ]
  }
]
db.students2.updateOne(
  { },
  { $set: { "grades.$[elem].mean" : 100 } },
  { arrayFilters: [ { "elem.grade": { $gte: 85 } } ] }
)
//====================================================
