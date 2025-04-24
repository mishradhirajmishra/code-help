db.collection.bulkWrite(            // takes an array of write operations and executes each of them. By default operations are executed in order.
    // all option of each type of operation can be used with eahc operation just like stage of pipeline.
[
{ insertOne : <document> },
{ updateOne : <document> },
{ updateMany : <document> },
{ replaceOne : <document> },
{ deleteOne : <document> },
{ deleteMany : <document> }
],
{ ordered : false }
)
// query
await db.collection('users').bulkWrite([
// 1. Insert a new user
{
insertOne: {
document: { name: "Alice", age: 25 }
}
},
// 2. Update age of user named Bob
{
updateOne: {
filter: { name: "Bob" },
update: { $set: { age: 30 } }
}
},
// 3. Delete user named Charlie
{
deleteOne: {
filter: { name: "Charlie" }
}
},
// 4. Replace user named Dave with a new document
{
replaceOne: {
filter: { name: "Dave" },
replacement: { name: "Dave", age: 40, status: "active" }
}
}
]);
// output
{
insertedCount: 1,
matchedCount: 2,
modifiedCount: 1,
deletedCount: 1,
upsertedCount: 0,
acknowledged: true
}