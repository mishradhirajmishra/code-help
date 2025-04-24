//It's used to process data in stages (like a data pipeline), and it's incredibly powerful for querying,  transforming, and analyzing documents.
//Aggregation pipelines run with the db.collection.aggregate() method do not modify documents in a collection, unless the pipeline contains a $merge or $out stage.

db.collection.aggregate([{ stage1 }, { stage2 }, { stage3 }, ...  ])

/* ================ SCQUENCE ============================== */
$match ➝ $project ➝ $addFields ➝ $unwind ➝ $group ➝ $sort ➝ $limit ➝ $facet / $lookup  //Optimal Sequence Guidelines (Size limit :16 mb BSON Document, stage limit :1000)

/* ================== STAGES ======================== */

/*--- $count ---*/
{ $count: "documents" } // act like count command. same as   { $group: { _id:null , cout:{$sum:1}}} output {documents: 10}
/*--- $limit ---*/
{ $limit: 10 } // act like limit command
/*--- $sort ---*/
{ $sort: { totalSales: -1 } } // act like sort command  
/*--- $skip --- */
{ $skip: 10 } // act like skip command
/*--- $sortByCount --- */
{ $sortByCount: "$item" } // count tem and sort also sorthand of the below group and  count query
/*---  $unwind --- */
{ $unwind: "$items" }    // if it has two item it will return two copy of document with distinuct one item with each. used before when group by array field 
{ $unwind: {
    path: "$lessons",
    includeArrayIndex: "lessonIndex", //Keep Array Index
    preserveNullAndEmptyArrays: true //Keep Documents Even if Array is Empty
  }}
/*--- $facet --- */
{ $facet: { output1: [<pipeline1> ], output2: [<pipeline2> ], ... } } //$facet – Multi Stats in One Query
$facet: { byStatus: [{ $group: { _id: "$status", count: { $sum: 1 } } }], byCountry: [{ $group: { _id: "$shippingAddress.country", count: { $sum: 1 } } }]}
/*--- $bucket --- */
{
  $bucket: {        // used in range based grouping, groups documents into buckets (ranges) based on a field's value
    groupBy: "$price", // required
      boundaries: [0, 100, 200, 300], // required    [0, 50] [50, 100] [100, 200] [200, 500]  "Other" 
      default: "Other", // optional fallback bucket
      output: { count: { $sum: 1 }, avgPrice: { $avg: "$price" } }
  }
}
//Use $bucket with $facet to Bucket by Multiple Fields
{ $facet: { "price": [$bucket: { ...}], "year": [$bucket: { ...}] } } //with two output field "price" and "year"
/*---  $bucketAuto --- */
{ $bucketAuto: {                 //chose bucket boundaries automatically.
    groupBy: <expression>,      // the field to group by (e.g. "$price")
      buckets: <number>,          // how many buckets to create
        output: {                   // optional: what to include in each bucket
      <outputField1>: { <accumulator1> },
      <outputField2>: { <accumulator2> }
    }
  }}
db.products.aggregate([
  {    $bucketAuto: {
      groupBy: "$price",
      buckets: 3,                   // define 3 bounderies with min & max range automatically
      output: {
        count: { $sum: 1 },
        items: { $push: "$name" }
      }
    }  }
])
//output
[ { _id: { min: 2.5, max: 25 }, count: 3, items: ["Pen", "Notebook", "Mouse"] }, { _id: { min: 25, max: 300 }, count: 2, items: ["Keyboard", "Bag"] },{ _id: { min: 300, max: 900 }, count: 2, items: ["Monitor", "Laptop"] }]

/*--- $set ---*/
// $addFields  alternative
{ $set: { fullName: { $concat: ["$first", " ", "$last"] } } } // used after project stage and add new field with result in output result stage
 
/*---  $addFields --- */
// It's used to add new fields to documents or modify existing fields in a pipeline
// To compute and append values in the middle of an aggregation pipeline.
// When creating derived fields (e.g., calculated scores, statuses, flags).
// used after project stage and add new field with result in output result stage
{ $addFields: { newField: <expression>, existingField: <expression>,... } }
{
  $addFields: {
    { fullName: { $concat: ["$first", " ", "$last"] } },
    { score: { $multiply: ["$marks", 10] } },
    { passed: { $gte: ["$marks", 50] } },
    { isAdult: { $gte: ["$age", 18] } },
    { "address.city": "New York" },
    { age: { $add: ["$age", 1] } }  // increase age by 1}
  }
}
/*---$group --- */
{ $group: { _id: "$category", totalSales: { $sum: "$sales" } } } // act like group command
/* common accumulator  for $group */
$sum       //Total sum of values
$avg	     //Average of values
$min	     //Minimum value
$max	     //Maximum value
$first	   //First document in group
$last	     //Last document in group
$push	     //Push values into an array
$addToSet	 //Push only unique values into an array

/*---   $match --- */
{ $match: { "status":"active" ,"shippingAddress.country": "USA"} }  // act like find command
/*--- $replaceWith --- */
$replaceWith: { newRoot: <expression> } //It replaces the entire document with a specified embedded document
//Most commonly used to "flatten" nested structures or restructure data mid-pipeline. new verson of  $replaceRoot
{ _id: 1,  "user": { name: "Alice", "email": "alice@example.com" }, "status": "active"}
db.users.aggregate([{ $replaceWith: { newRoot: "$user" } }])
// output { name: "Alice", "email": "alice@example.com" }

/*--- $objectToArray ---*/
$objectToArray: <expression>
 //transforms a document (object) into an array of key-value pairs.
  //k = the key (field name)   // v = the value
  { _id: 1, "scores": { "math": 85, "science": 92, "history": 78 } }
db.collection.aggregate([{ $project: { scoreArray: { $objectToArray: "$scores" } } }])
{ _id: 1, "scoreArray": [{ "k": "math", "v": 85 }, { "k": "science", "v": 92 }, { "k": "history", "v": 78 }] }
/*--- $merge --- */
 // used in write query result into another collection
//Multiple behaviors (merge, replace, fail, keepExisting, whenMatched, whenNotMatched)
//upsert/merge/update documents in an existing collection
{ $merge: {
  into: <collection> -or- { db: <db>, coll: <collection> },
  on: <identifier field> -or- [ <identifier field1>, ...],  // Optional
  let: <variables>,                                         // Optional
  whenMatched: <replace|keepExisting|merge|fail|pipeline>,  // Optional
  whenNotMatched: <insert|discard|fail>                     // Optional
} }
{ $merge: { into: "myOutput", on: "_id", whenMatched: "replace", whenNotMatched: "insert" } }
/*--- $out  --- */
//$out        // used in write query result into another collection  (replace a collection with new data)
{ $out: { db: <database>coll: <collection>} }
/*---  $project  --- */
{
  $project: {        // act like projection
    email: 1, _id: 0
    fullName: { $concat: ["$firstName", "$lastName"] },
    initials: {  $concat: [   { $substrCP: ["$firstName", 1, 1] }, { $substrCP: ["$lastName", 0, 1] } ] },
    lowerEmail: { $toLower: "$email" },
    bioLength: { $strLenCP: "$bio" },
    hasLaptopEmoji: { $indexOfCP: ["$bio", "💻"] },
    trimmedName: { $trim: { input: "$firstName" } }
  }
}

// 1- Nested Fields
{ qty: { min: null, max: null, mean: -197.2 } }
$project: { nested_field: "$qty.mean" }  //   { _id: ..., nested_field: -197.2 }

// 2- Array of Nested Fields 
{ instock: [{ warehouse: "A" }, { warehouse: "C" }] }
$project: { warehouses: "$instock.warehouse" }      // { warehouses : ["A","B"] }
// 3- Array of Nested Arrays 
{
  inventory: [
    { apples: ["macintosh", "golden delicious",] },
    { oranges: ["mandarin",] },
    { apples: ["braeburn", "honeycrisp",] }
  ]
}
{ $project: { all_apples: "$inventory.apples" } }    //  all_apples: [ [ "macintosh", "golden delicious" ], [ "braeburn", "honeycrisp" ]]

/*-- $redact --- */
$redact //lets you conditionally include or exclude fields or entire branches of a document
{
  $redact: {
    $cond: {
      if: <expression>,   // condition to test
        then: <action>,     // $$KEEP, $$PRUNE, or $$DESCEND
    else: <action>
  }
  }
}
$$DESCEND //returns the fields at the current document level, excluding embedded documents.
$$PRUNE //exclude all
$$$KEEP //keep all

/*---  $setWindowFields --- */
//is used to add calculated fields to documents based on a window of related documents within a partition.
{
  $setWindowFields: {
     partitionBy: <expression>or<Field>,   // any field or expression ( calculated field ) eg  year feom date field 
     sortBy: {"field": 1}                  // single or multiple field
     output: {
        <output field 1>: {
           <window operator>: <window operator parameters>,     // calculate field based on partition
           window: {                                            // determind  rule for the calculated field
              documents: [ <lower boundary>, <upper boundary> ],
              range: [ <lower boundary>, <upper boundary> ],
              unit: <time unit>
           }
        },
        <output field 2>: { ... },
        ...      
     }
  }
}
/* --------------------------------------------- */
window: { documents: ["unbounded", "current"] }   // Running total up to current doc
window: { documents: [-1, 1] }                   // Previous and next doc only
window: { documents: [0, 0] }                   // Only current document (default)
/* --------------------------------------------- */

window: {
  documents: ["unbounded", "current"] // Cumulative sum from the beginning of the year to the current document
}
// document 
[
  { orderDate: "2019-01-01", quantity: 5 },
  { orderDate: "2019-02-01", quantity: 10 },
  { orderDate: "2020-01-01", quantity: 8 },
  { orderDate: "2020-03-01", quantity: 12 },
  { orderDate: "2021-01-01", quantity: 6 },
  { orderDate: "2021-02-01", quantity: 15 }
]
// objective  calculate cumulativeQuantityForYear and  maximumQuantityForYear till current document
db.cakeSales.aggregate([
  {
    $setWindowFields: {
      partitionBy: { $year: { $toDate: "$orderDate"  } }, // Partition by year
      sortBy: { orderDate: 1 },          // Sort by orderDate within each year
      output: {
        cumulativeQuantityForYear: {
          $sum: "$quantity",           // Sum the quantity
          window: {
            documents: ["unbounded", "current"] // Cumulative sum from the beginning of the year to the current document
          }
        },
        maximumQuantityForYear: {
          $max: "$quantity",          // Find the maximum quantity
          window: {
            documents: ["unbounded", "unbounded"] // Maximum quantity within the entire year
          }
        }
      }
    }
  }
]);
//  output
[
  { _id: "2019", orderDate: "2019-01-01", quantity: 5, cumulativeQuantityForYear: 5, maximumQuantityForYear: 5 },
  { _id: "2019", orderDate: "2019-02-01", quantity: 10, cumulativeQuantityForYear: 15, maximumQuantityForYear: 10 },
  { _id: "2020", orderDate: "2020-01-01", quantity: 8, cumulativeQuantityForYear: 8, maximumQuantityForYear: 8 },
  { _id: "2020", orderDate: "2020-03-01", quantity: 12, cumulativeQuantityForYear: 20, maximumQuantityForYear: 12 },
  { _id: "2021", orderDate: "2021-01-01", quantity: 6, cumulativeQuantityForYear: 6, maximumQuantityForYear: 6 },
  { _id: "2021", orderDate: "2021-02-01", quantity: 15, cumulativeQuantityForYear: 21, maximumQuantityForYear: 15 }
]

/*---  $unionWith --- */
//combine the results of multiple collections or pipelines into a single result set
{
  $unionWith: {
    coll: "<otherCollectionName>",
    pipeline: [ <stages> ]
  }
}
db.firstCollection.aggregate([
  { $unionWith: "secondCollection" },
  { $unionWith: "thirdCollection" }
])
db.orders2024.aggregate([
  {
    $unionWith: {
      coll: "orders2025",
      pipeline: [
        { $match: { status: "confirmed" } },
        { $project: { _id: 0, orderId: 1, amount: 1 } }
      ]
    }
  }
]) 
/*--- $graphLookup ---*/
$graphLookup  //performs a recursive join within the same collection (or another one),
              //  walking through documents based on a field relationship — 
              // like parent-child, manager-employee, category-subcategory, or followers/following.
              {
                $graphLookup: {
                  from: "collection_name",
                  startWith: "$<startField>",
                  connectFromField: "<field_in_current_doc>",
                  connectToField: "<field_in_target_doc>",
                  as: "resultField",
                  maxDepth: <number>, // optional
                  depthField: "depth", // optional
                  restrictSearchWithMatch: { <filter> } // optional
                }
              }
   // doc 
{ _id: 1, name: "Alice", manager_id: null }
{ _id: 2, name: "Bob", manager_id: 1 }
{ _id: 3, name: "Charlie", manager_id: 2 }
{ _id: 4, name: "David", manager_id: 2 }
// find all subordinates of Alice (i.e., recursively get employees under her).     
db.employees.aggregate([
  {    $match: { name: "Alice" }  },
  {    $graphLookup: {
      from: "employees",
      startWith: "$_id",
      connectFromField: "_id",
      connectToField: "manager_id",
      as: "subordinates"
    }  }
])
// result 
{ "name": "Alice", "subordinates": [ { "_id": 2, "name": "Bob" },{ "_id": 3, "name": "Charlie" }, { "_id": 4, "name": "David" }  ]}

/*--- $lookup --- */
{
  $lookup:
    {
      from: <collection to join>,
      localField: <field from the input documents>,
      foreignField: <field from the documents of the "from" collection>,
      let: { <var_1>: <expression>, …, <var_n>: <expression> },
      pipeline: [ <pipeline to run> ],
      as: <output array field>
    }
}
{ $lookup: { from: "users", localField: "userId", foreignField: _id, as: "user" } } // act like lookup command
//Nested Lookups with Pipeline 
//using pipeline-based $lookup, which is great when you need filtering, projecting, or sorting inside the join.
{
  $lookup: {
    from: "orders",
      let: { user_id: "$_id" },
    pipeline: [
      { $match: { $expr: { $eq: ["$userId", "$$user_id"] } } },
      { $sort: { createdAt: -1 } },
      { $limit: 5 }
    ],
      as: "recent_orders"
  }
}
db.orders.aggregate([    {
  $lookup: {
    from: "customers",
    let: { customer_id: "$customerId" },
    pipeline: [
      {
        $match: {
          $expr: {
            $and: [
              { $eq: ["$_id", "$$customer_id"] },
              { $eq: ["$status", "active"] }
            ]
          }
        }
      },
      {
        $project: { _id: 1, name: 1, status: 1 } // optional
      }
    ],
    as: "customerDetails"
  }
}
])

//Query with Nested $lookup
📦 orders
{ _id: 1, customerId: 101, productId: 501, total: 250 }
👤 customers
{ _id: 101, name: "Alice", regionId: 301 }
🌍 regions
{ _id: 301, name: "North America" }

db.orders.aggregate([
{
$lookup: {
  from: "customers",
  let: { customer_id: "$customerId" },
  pipeline: [
    {
      $match: {
        $expr: { $eq: ["$_id", "$$customer_id"] }
      }
    },
    {
      $lookup: {
        from: "regions",
        let: { region_id: "$regionId" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$region_id"] }
            }
          },
          {
            $project: { _id: 0, name: 1 }  // Just show region name
          }
        ],
        as: "region"
      }
    },
    {
      $unwind: { path: "$region", preserveNullAndEmptyArrays: true }
    },
    {
      $project: { _id: 1, name: 1, region: 1 }
    }
  ],
  as: "customerDetails"
}
},
{
$unwind: "$customerDetails"
}
])
//You can nest lookups as deep as you need (though too many levels might affect performance).
//Use $unwind if you want single object instead of array for nested documents.  
/* ===================================== */  
// Aggregation String Operators
$concat	                        { $concat: [<string1>, <string2>, ... ] }                    //Concatenates strings
$substrCP 	                    { $substrCP: [<string>, <start>, <length> ] }                //Substring extraction  
$toLower / $toUpper             { $toLower: "$name" }          	                              //Case conversion
$strLenBytes / $strLenCP	      { $strLenCP: <string> }                                      //String length (bytes or code points)
$indexOfBytes / $indexOfCP	    { $indexOfCP: [<string>, <substring>, <start>, <end> ] }     //Find position of substring
$split	                        { $split: ["$fullName", " "] }                                //Splits a string into an array
$trim, $ltrim, $rtrim	          { $trim: { input: "$firstName" } }                           //Trim characters from string
 
// Other Operators
$regexMatch                    { isCoder: { $regexMatch: {  input: "$username",   regex: "coder",  options: "i"  } //  "i" forcase-insensitive 
$let                          // create variable based on calculation and reuse in other stage
{  $let: {
      vars: {  base: "$price",  taxAmount: "$tax"}    //to calculate total = price + tax, and reuse the result
      in: { $add: ["$$base", "$$taxAmount"] }     // reused variable by $$
    }
  }

$map                              //allows you to loop through an array and apply a function to each element
$map: {                       // {"numbers": [1, 2, 3]} multiply by 10
  input: "$numbers",  as: "num",  in: { $multiply: ["$$num", 10] }
}

$reduce //allows you to loop through an array and accumulate a single result, step by step.
{
  $reduce: {
    input: "$numbers",
    initialValue: 0,
    in: { $add: ["$$value", "$$this"] }  // "$$value" → the current accumulator value and  "$$this" → the current array element during the loop
  }
}
// ============ Less used stages============ 
$documents
// synthetic stage used to supply inline documents directly into an aggregation pipeline — without querying a collection.
//It’s like defining your own mini dataset on the fly inside a pipeline.
//For testing or prototyping pipelines without creating real collections.

db.aggregate([
  { $documents: [{ name: "Alice", score: 80 }, { name: "Bob", score: 95 }] },
  { $project: { name: 1, passed: { $gte: ["$score", 90] } } }
])

$planCacheStats
//Returns plan cache information for a collection. The stage returns a document for each plan cache entry.
//$planCacheStats is a diagnostic aggregation stage that shows information about query plans stored in the plan cache of a collection.

//Which query shapes are being cached
//What indexes are being used
//Whether multiple plans were considered
//How efficient the chosen plan is
//This is especially useful when:
//You're tuning indexes
//Diagnosing slow queries
//Understanding how MongoDB chooses query plans
{ $sample: { size: 10 } } // act like sample command  // retern 10 random sample document at atime, used in load testing
