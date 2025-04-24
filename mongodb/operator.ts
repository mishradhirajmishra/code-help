
//Comparison Operators

 $eq		                { age: { $eq: 25 } }                                // Find documents where age is 25
 $ne	                  { status: { $ne: "inactive" } }                     // Find where status is not inactive
 $gt	                  { price: { $gt: 100 } }                             // Price greater than 100
 $gte	                 	{ age: { $gte: 18 } }                               //Adult users
 $lt	                	{ rating: { $lt: 4.5 } }                            // Low - rated items
 $lte		                { quantity: { $lte: 10 } }                          // Low - stock products
 $in	                	{ category: { $in: ["electronics", "books"] } }     // Belongs to any category in the list
 $nin	Not in array	    { userType: { $nin: ["guest", "banned"] } }         // Exclude certain types

// key <=value1 && >=value2
{ "key": { $gte: "value1", $lte: "value2", } }
// key1   <=value1 && >=value2  key2   <=value1 && >=value2
{ "key1" : { $gte: "value1", $lte: "value2" }, "key2" : { $gte: "value1", $lte: "value2"} }
//------------------------------------------------------------------------
 // // Logical Operators

$and		  { $and: [{ age: { $gt: 18 } }, { status: "active" }] }     //Combine multiple conditions
$or	      { $or: [{ role: "admin" }, { role: "moderator" }] }        //Match at least one condition	
$not	    { price: { $not: { $gt: 100 } } }                          //Negates the condition	  
$nor	    { $nor: [{ category: "outdated" }, { stock: 0 }] }         // None of the conditions are true	

{ $and[{}, {}] }  // if comprasion of same fild then  $and not needed only  {{} ,{}} will work same
{ $or[{}, {}] }
{ $and[{}, {}], $or[{}, {}] }

//======================
//Arithmetic Operators
//======================

$add		     { $add: [ "$field1", "$field2","$field3" ]}               //It works for both numbers and dates.
db.sales.aggregate([ {   $project: { total: { $add: ["$price", "$tax"] } }  }])
                         $project: { bonus_salary: { $add: ["$salary", 1000] }}
                         $project: { new_date: {  $add: ["$start_date", 7 * 24 * 60 * 60 * 1000]  } } // Add 7 days
                         $project: { all_scores: { $add: ["$math_scores", "$science_scores"] }}
                         $project: { invoice_total: { $add: ["$items_total", "$shipping_cost", "$tax"]}}
                         $project: { bonus_salary: { $add: ["$salary", 1000] }}

$subtract	   { $subtract: [ "$total", "$discount" ] }     //Subtracts second number from the first	It works for both numbers and dates.
                                                          // same as $add  substract second val from first one
$multiply		 { $multiply: [ "$price", "$quantity" ] }     //Multiplies numbers
$divide		   { $divide: [ "$total", "$count" ] }          //Divides first number by the second
$mod		     { $mod: [ "$value", 2 ] }                    //Returns remainder  of division(for even/odd) like modular operator
                         $project: { is_even: { $eq: [{ $mod: ["$value", 2] }, 0] }}
                                     day_group: { $mod: [{ $dayOfMonth: "$date" }, 5] } //Group events into 5-day buckets based on day of month
                                     bucket_id: { $mod: ["$item_id", 10] } //Group items into 10 buckets
                         $match: {  $expr: { $eq: [{ $mod: ["$day_number", 7] }, 0] } }// Every 7th day

$abs	       { $abs: "$temperatureChange" }               //returns the absolute value of a number—removes the sign, so negative values become positive.
                         $project: {  difference: { $abs: { $subtract: ["$expected_amount", "$actual_amount"] } }}
$ceil		     { $ceil: "$rating" }                         //Rounds a number up to the nearest integer
$floor	     { $floor: "$rating" }                        //Rounds a number down to the nearest integer
$trunc	     { $trunc: "$rating",2 }                        //Truncates a number to its integer part
                         $project: {  truncated_price: { $trunc: ["$price", 2] } //4.6789 → 4.67
}
$round		   { $round: [ "$price", 2 ] }                  //Rounds a number to a specified decimal place e.g. 4.678 → 4.68
$exp		     { $exp: "$value" }                           //Raises e to the specified power
$ln		       { $ln: "$value" }                            //Natural logarithm
$log	       { $log: [ "$value", 10 ] }                   //Logarithm with custom base
$log10		   { $log10: "$value" }                         //Base-10 logarithm
$pow	       { $pow: [ "$base", "$exponent" ] }           //Raises number to a specified exponent
$sqrt		     { $sqrt: "$value" }                          //Square root
$sqrt: {  $add: [ { $pow: ["$x", 2] },   { $pow: ["$y", 2] }  ]}  //  √(x² + y²).
//----------------------------------------------------------------------
 // //Element Operators

$exists	     Checks if a field exists	      { discount: { $exists: true } }
$type        Checks data type             	{ age: { $type: "int" } }  // Ensure type is integer
//--------------------------------------------------------------------
// conditional operators
{ $cond: { if: <condition>, then: <true-case>, else: <false-case> } }    //for long expration
{   $cond: [ <condition>, <true-case>, <false-case> ]  }
{  $project: {   priceCategory: {  $cond: { if: { $gt: ["$price", 100] }, then: "Expensive", else: "Cheap" }   }  }}
{ $ifNull: [ <expression>, <replacement-if-null> ] }
{  $project: {   name: { $ifNull: ["$name", "Unknown"] }  }}
{
  $switch: {
    branches: [
      { case: <condition1>, then: <result1> },
      { case: <condition2>, then: <result2> }
    ],
    default: <default-value>
  }
}
{
//  $project: {
  //  gradeCategory: {
      $switch: {
        branches: [
          { case: { $gte: ["$grade", 90] }, then: "A" },
          { case: { $gte: ["$grade", 80] }, then: "B" }
        ],
        default: "C"
      }
   // }
 // }
}
//--------------------------------------------------------------------
  //Evaluation Operators

$expr { $expr: { $gt: ["$spent", "$budget"] } } 	//Use aggregation expressions in queries
//Comparing two fields: {$expr: {$gt: ["$field1", "$field2"]}}
//Field arithmetic: $add, $subtract, $multiply, etc.
//Conditional logic inside queries using $cond, $ifNull, etc.

$jsonSchema	                                      //Validate documents against JSON schema	Useful for schema validation
$mod		{ score: { $mod: [2, 0] } }               //Even numbers (Modulo operation)
$regex	{ name: { $regex: "^A" } }                // Names starting with A (Regular expression match	)
$text		{ $text: { $search: "mongodb" } }         //Text search (requires text index)
$where	                                         //JavaScript expression (not recommended for performance)	{ $where: "this.age > 25" }

//----------------------------------------------------------------------
//Array Query Operators

$all		{ tags: { $all: ["red", "blue"] } }  //if all values are in array then return
$elemMatch		{ reviews: { $elemMatch: { rating: 5, user: "john" } } } //Match  documents in array using multiple criteria in same element
$size		{ items: { $size: 3 } } //Match array size (length)
//----------------------------------------------------------------------
//Update Operators

$set		{ $set: { status: "active" } }    //Set a field's value
$unset		{ $unset: { temporary: "" } }   //Remove a field
$rename		{ $rename: { "oldName": "newName" } }  //Rename a field
$inc		{ $inc: { views: 1 } }   //Increment a number
$mul		{ $mul: { price: 1.1 } } //Multiply a number— Apply a 10% increase
$min		{ $min: { age: 18 } }   //Set only if value is less
$max		{ $max: { score: 100 } }  //Set only if value is more
$currentDate		{ $currentDate: { lastModified: true } } //Set current date or timestamp
//----------------------------------------------------------------------
//Array Update Operators

$addToSet		   { $addToSet: { tags: "new" } }  //Add value to array if not present
$push		       { $push: { comments: "Nice!" } }   //Add value to array
$pop		       { $pop: { items: -1 } } //Remove first(-1/last element (1)
$pull	         { $pull: { tags: "old" } }  //Remove matching value(s)
$pullAll		   { $pullAll: { tags: ["expired", "used"] } } //Remove multiple specific values
$each		       { $push: { scores: { $each: [90, 85, 88] } } }  //Used with $push to add multiple
$position		   { $push: { scores: { $each: [100], $position: 1 } } }  //Position to insert element in array
$slice		     { $push: { scores: { $each: [99], $slice: -5 } } }  //Limit array size when using $push
$sort		       { $push: { scores: { $each: [70, 80], $sort: 1 } } }  //Sort array when pushing

$merge         {                    // used in write query result into another collection
                  $merge: {
                      into: "<outputCollection>",
                          on: "_id",              // optional; field(s) to match documents
                          whenMatched: "merge",   // options: "merge", "replace", "keepExisting", "fail", "pipeline"
                          whenNotMatched: "insert"// options: "insert", "discard", "fail"
                  }
               }
               db.sales.aggregate([                   // used in write sales query result into item_totals collection
                {
                  $group: {
                    _id: "$item",
                    totalQuantity: { $sum: "$quantity" }
                  }
                },
                {
                  $merge: {
                    into: "item_totals",
                    on: "_id",
                    whenMatched: "merge",
                    whenNotMatched: "insert"
                  }
                }
              ])
 


//----------------------------------------------------------------------
//date operators
$year            year: { $year: "$createdAt" }                  //	Extracts the year from a date
$month	         month: { $month: "$createdAt" }                //Extracts the month (1-12)
$dayOfMonth	     day: { $dayOfMonth: "$createdAt" },            //Extracts the day of the month (1-31)
$dayOfWeek	     weekday: { $dayOfWeek: "$createdAt" },         //Returns the weekday (1=Sunday, 7=Saturday)
$dayOfYear	     yearday: { $dayOfYear: "$createdAt" },         //Day number of the year (1-366)
$week	           weeknumber: { $week: "$createdAt" }            // ISO week number
$hour	           hour: { $hour: "$createdAt" },                 //Extracts the hour (0-23)
$minute	         minute: { $minute: "$createdAt" },             //Extracts the minute
$second          second: { $second: "$createdAt" },             //	Extracts the second
$millisecond	   millisecond: { $millisecond: "$createdAt" },   //  Extracts the milliseconds
$dateToString    formattedDate: { $dateToString: {format: "%Y-%m-%d %H:%M:%S", date: "$createdAt", timezone: "UTC" } } //	Formats a date into a string
$dateFromString		{ $dateFromString: { dateString: "2022-01-01" } }  //Convert string to date
$dateDiff
ageInDays: {
        $dateDiff: {
          startDate: "$joined",
          endDate: "$$NOW",
          unit: "day"
        }
      }
$dateAdd
{
  $dateAdd: {
    startDate: <expression>,  // The starting date
    unit: "<unit>",           // The unit to add (e.g., "day", "hour")
    amount: <number>,         // How much to add
    timezone: "<tz>"          // (Optional) Timezone like "America/New_York"
  }
}
newDueDate: {
        $dateAdd: {
          startDate: "$dueDate",
          unit: "day",
          amount: 3
        }
}
 $dateSubtract	 
{
  $dateSubtract: {
    startDate: <expression>,  // The date you're subtracting from
    unit: "<unit>",           // Unit of time (e.g., "day", "hour")
    amount: <number>,         // How much to subtract
    timezone: "<tz>"          // (Optional) Timezone string
  }
}



//----------------------------------------------------------------------
//System Variables in MongoDB
$$NOW	             {cuurentDate: { endDate: "$$NOW"} }  //The current date/time (at the start of the aggregation pipeline execution)
$$CLUSTER_TIME   {clusterTime: "$$CLUSTER_TIME"}	//The cluster’s logical timestamp (used internally for replication and causally consistent sessions)
$$ROOT	           {fullDoc: "$$ROOT"}//The entire input document to the pipeline stage (top-level document)
$$CURRENT	    {region: "$$CURRENT.region" }  //The current document being processed in the current stage in pipeline (used  Inside expressions like $map, $reduce, or $let, where you need to reference the whole current document.)
$$REMOVE	{ email:"$$REMOVE"}//Special value that tells MongoDB to remove a field (in update pipelines) 
$$DESCEND	//Used in $redact stage to keep processing child documents
$$PRUNE	//Used in $redact to remove a document or field
$$KEEP	//Used in $redact to keep a document or field

//user’s accessLevel = 2, and you want to filter out projects they shouldn’t see
//But to filter nested arrays like projects, you’d check each project’s access:
db.users.aggregate([
  {
    $redact: {
      $cond: {
        if: { $lte: ["$accessLevel", 2] },
        then: "$$DESCEND",
        else: "$$PRUNE"
      }
    }
  },
  {
    $redact: {
      $cond: {
        if: { $lte: ["$$CURRENT.accessLevel", 2] },
        then: "$$KEEP",
        else: "$$PRUNE"
      }
    }
  }
])


$$SEARCH_META	//Contains metadata from Atlas Search (e.g. score) in search-related pipelines
$$USER, $$ROLE	//Used in some security-related contexts (enterprise only)



