db.collection.findOneAndDelete(filter, options)  // delete single document and return deleted document
db.collection.deleteOne(                        //	  Delete at most a single document that matched , return {  acknowledged: true, deletedCount: 1}
  <filter>,
  {
    writeConcern: <document>,
    collation: <document>,
    hint: <document|string>
  }
)
db.users.deleteOne({ username: "johndoe" });
db.users.deleteOne(
  { name: "john" },
  { collation: { locale: "en", strength: 2 } } // case case-insensitive
); 
//============================================
db.collection.deleteMany(   // Delete all documents that match a specified filter. return { "acknowledged" : true, "deletedCount" : 10 }
   <filter>,
   {
      writeConcern: <document>,
      collation: <document>
   }
)
db.users.deleteMany({ status: "inactive" });
deleteMany({}) // delete all records (empty collection)
//==============================================
db.collection.remove() // Deprecated