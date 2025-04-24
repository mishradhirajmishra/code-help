db.collection.insertOne(document, { writeConcern: { w: "majority", j: true, wtimeout: 5000 } })

db.collection.insertMany([document1, document2, ...], { writeConcern: { w: "majority", j: true, wtimeout: 5000 } }, { ordered: false }) // default true
// { ordered: false}  ignore errored document and insert remaining document
// { ordered: true} stop when  errored document  occur  (default)

// { writeConcern: { w: "majority",j: true, wtimeout: 5000 } }   work with both query
// Write Concern	Description
// w: 0	No acknowledgment (fire-and-forget)
// w: 1	Acknowledged by primary only (default)
// w: "majority"	Acknowledged by majority of replica set members
// w: n	Acknowledged by n replica set members
// j: true	Wait until write is committed to journal
// wtimeout: ms	Time to wait before timing out

//  When to Use What?
//Use Case	Recommended Write Concern
//Speed, logging, analytics         	            w: 0 or w: 1
//Most apps	                                       w: 1 or w: "majority"
//Critical financial/transactional data	         w: "majority", j: true

//both query are not  compatible with db.collection.explain().
//===============================================
//Additional Methods for Inserts
db.collection.updateOne()            //when used with the upsert: true option.

db.collection.updateMany()           //when used with the upsert: true option.

db.collection.findAndModify()       //when used with the upsert: true option.

db.collection.findOneAndUpdate()    //when used with the upsert: true option.

db.collection.findOneAndReplace()   //when used with the upsert: true option.

db.collection.bulkWrite() 

