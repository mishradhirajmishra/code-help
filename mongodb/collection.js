db.createCollection("products", {
  capped: true,
  size: 5242880,          // 5MB max size
  max: 5000,              // Max number of documents
  storageEngine: {
    wiredTiger: {}
  },
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "price"],
      properties: {
        name: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        price: {
          bsonType: "double",
          minimum: 0,
          description: "must be a positive number and is required"
        }
      }
    }
  },
  validationLevel: "strict",       // "off" | "moderate" | "strict"
  validationAction: "error",       // "warn" | "error"
  collation: {
    locale: "en",
    strength: 2
  },
  timeseries: {                    // for time series collections
    timeField: "timestamp",
    metaField: "metadata",
    granularity: "seconds"
  },
  expireAfterSeconds: 3600,        // for TTL index in time series
  clusteredIndex: {                // for clustered collections (MongoDB 5.3+)
    key: { _id: 1 },
    unique: true
  }
})


//capped table

db.createCollection("products", {
  capped: true,
  size: 5242880,          // 5MB max size
  max: 5000,
})           // Max number of documents

db.user.drop()
db.user.remove({})
db.user.remove()  // remove all
db.user.ensureIndex({"email":1,"":-1}) 
 
---------------------------------------
db.collection.createIndex({ field: 1 }); // 1 for ascending, -1 for descending
db.users.createIndex({ lastName: 1, firstName: 1 });
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ phone: 1 }, { sparse: true }); //Sparse Index (skip documents without the field)
db.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 }); //Auto-delete documents after N seconds:
//Text Index (for text search)
db.articles.createIndex({ title: "text", body: "text" });  
db.articles.find({ $text: { $search: "mongodb indexing" } });

db.users.createIndex({ userId: "hashed" }); //Hashed Index (for sharding/hash distribution)
db.places.createIndex({ location: "2d" }); //2D Index (for geospatial queries)
db.places.createIndex({ location: "2dsphere" });
db.logs.createIndex({ "$**": 1 }); // Index all fields
db.configs.createIndex({ "settings.$**": 1 }); //You can also index specific field patterns:
db.orders.createIndex(
  { status: 1 },
  { partialFilterExpression: { status: { $eq: "pending" } } } //Partial Index (only index documents that match a filter)
);

db.collection.dropIndex("indexName");
db.collection.getIndexes();
