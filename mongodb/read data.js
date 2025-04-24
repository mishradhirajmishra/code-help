db.collection.findOne(query, projection)  // return single record
db.users.findOne(
    {
      $and: [
        { age: { $gte: 25, $lte: 35 } },                     // age between 25 and 35
        { email: { $regex: /@example\.com$/, $options: "i" } }, // email domain match, case-insensitive
        { isActive: { $eq: true } },                         // explicitly check boolean
        { roles: { $in: ["admin", "superadmin"] } },         // match any role in array
        { "profile.city": { $ne: "Los Angeles" } },          // not in LA
        { "profile.joined": { $gt: new Date("2022-12-31") } }, // joined after 2022
        { score: { $exists: true, $type: "double", $gt: 80 } }, // score exists, is a number, and > 80
      ],
      $nor: [ { name: { $in: ["Test", "Dummy"] } }    ]              // name not in these
     
    },
    {
      projection: { name: 1, email: 1, roles: 1, "profile.city": 1, _id: 0 }
    }
  )
  
//======================================
let curser = db.collection.find(query, projection) // return curser amd print 20 dock by default 


while (cursor.hasNext()) {
  print(tojson(cursor.next()));  // or
  printjson(myCursor.next());    //or
  const doc = cursor.next();
  print(doc.name);
  
}

curser.map(user => user.name) // return ["Alice", "Bob", "Charlie"]
curser.forEach(doc => print(doc.name)); // print dock
curser.forEach(printjson);
curser.toArray()   //all results as an array

curser.sort({ age: -1 }).skip(10).limit(5).forEach(doc => print(doc.name));


//curser method
.forEach(fn)	   //Apply function to each doc
.hasNext()	     //Check if more results exist
.next()	         //Get next document
.toArray()	     //Load all docs into array
.map(fn)


// document
{
  _id: ObjectId("661eae44a3f20eec4f9a00d9"),
  name: "Alice",
  age: 30,
  email: "alice@example.com",
  isActive: true,
  roles: ["admin", "editor"],
  tags: ["featured", "beta"],
  score: 87.5,
  profile: {
    city: "New York",
    joined: ISODate("2023-01-15T00:00:00Z"),
    referrer: null
  }
}

//======================================
db.users.find(
    {
      $and: [
        { age: { $gte: 25, $lte: 35 } },                    // age between 25 and 35
        { email: { $regex: /@example\.com$/, $options: "i" } }, // ends with @example.com (case-insensitive)
        { isActive: { $eq: true } },                        // isActive is true
        { roles: { $in: ["admin", "moderator"] } },         // has any of these roles
        { tags: { $all: ["featured", "beta"] } },           // must contain all tags
        { score: { $exists: true, $type: "double", $gt: 80 } }, // score exists, is a number, and > 80
        { "profile.city": { $ne: "Los Angeles" } },         // not based in LA
        { "profile.joined": { $gte: new Date("2023-01-01") } }, // joined in 2023 or later
        { "profile.referrer": { $eq: null } }               // referrer is null
      ],
      $or: [
        { name: { $in: ["Alice", "Bob"] } },
        { "profile.city": { $in: ["New York", "Chicago"] } }
      ],
      $nor: [
        { email: { $regex: /test/i } }                      // exclude test emails
      ]
    },
    { projection: { name: 1,email: 1,age: 1, roles: 1,"profile.city": 1, score: 1,  _id: 0 } }
  ) 

  // elemMatch match all condition in single object of array
  db.users.find({
    scores: {
      $elemMatch: {
        subject: "Science",
        score: { $gt: 85 }
      }
    }
  })

//check if the 5th element matches multiple conditions?
  db.users.find({
    "scores.4.subject": "Art",
    "scores.4.score": { $gt: 90 }
  })

db.users.find().sort({ age: -1 }).limit(5).skip(10) // -1 for decending

//==========================================


const user = await db.collection("users").find().sort({ age: -1 }).limit(1).next();

db.users.find(
    { age: { $gte: 18 }, "address.city": "Berlin" },
    { name: 1, email: 1, _id: 0 }
  ).sort({ name: 1 }).limit(10)
  
//Find documents where tags contains both "red" and "green"  
db.users.find({
  tags: { $all: ["red", "green"] }
})

//Find docs where tasks contain both
db.users.find({
  tasks: {
    $all: [
      { $elemMatch: { title: "Task A", done: true } },
      { $elemMatch: { title: "Task B", done: false } }
    ]
  }
})

db.inventory.find( { "instock": { qty: 5, warehouse: "A" } } )  // order of element matters { qty: 5, warehouse: "A" } != {  warehouse: "A",qty: 5 }
db.inventory.find( { "instock": { $elemMatch: { qty: { $gt: 10, $lte: 20 } } } } ) // order of element not  matters
db.inventory.find( { "instock.qty": 5, "instock.warehouse": "A" } )  // order of element not matters and key may be mattched from diffrent element
//= queries
db.inventory.find( { tags: ["red", "blank"] } )  // exact match of array ["red", "blank"] in the specified order [ "blank","red"] excluded
db.inventory.find( { tags: { $all: ["red", "blank"] } } )  //  ind an array that contains both the elements "red" and "blank", without regard to order  and length of array

//--------------------------------------------------------------
db.inventory.find( { item: null } )  //documents that either contain the item field whose value is null or that do not contain the item field at all
db.inventory.find( { item: { $ne : null } } ) //query matches documents where the item field exists and has a non-null value { item : { $type: 10 } } is also same
db.inventory.find( { item : { $exists: false } } ) //query matches documents that do not contain the item field

Animal.find().where('pets').all(['cat','dog','fox'])  // select matching from array

 