//Common Keywords in $jsonSchema
 
bsonType	//"string", "int", "object", etc.
required	//List of fields that must be present
properties	//Define each field's type, min, max, etc.
minLength, maxLength	//For strings
minimum, maximum	//For numbers
enum	//Restrict to specific values
pattern	//Regex pattern (for strings)

// document structure
{
    "name": "Alice",
    "email": "alice@example.com",
    "age": 29,
    "role": "admin",
    "isActive": true,
    "createdAt": ISODate("2024-01-01T00:00:00Z"),
    "profile": {
      "bio": "Hello!",
      "website": "https://alice.dev"
    },
    "tags": ["developer", "mongodb"]
  }
  
  // full  $jsonSchema

  db.createCollection("users", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["name", "email", "age", "role", "isActive", "createdAt"],
        additionalProperties: false,                    // No extra fields allowedß

        properties: {
          name: {
            bsonType: "string",
            minLength: 2,
            maxLength: 100,
            description: "User's name must be a string"
          },
          email: {
            bsonType: "string",
            pattern: "^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
            description: "Must be a valid email address"
          },
          age: {
            bsonType: "int",
            minimum: 18,
            maximum: 100,
            description: "Age must be between 18 and 100"
          },
          role: {
            enum: ["admin", "user", "guest"],
            description: "Role must be one of: admin, user, guest"
          },
          isActive: {
            bsonType: "bool",
            description: "Indicates whether the user is active"
          },
          createdAt: {
            bsonType: "date",
            description: "Account creation date"
          },
          profile: {
            bsonType: "object",
            required: ["bio"],
            properties: {
              bio: {
                bsonType: "string",
                maxLength: 500,
                description: "Short biography"
              },
              website: {
                bsonType: "string",
                pattern: "^(https?:\\/\\/)?([\\w.-]+)+(:\\d+)?(\\/.*)?$",
                description: "Optional personal website"
              }
            }
          },
          tags: {
            bsonType: "array",
            items: {
              bsonType: "string",
              maxLength: 30
            },
            minItems: 0,
            maxItems: 10,
            description: "List of user tags"
          }
        }
      }
    },
    validationLevel: "strict",
    validationAction: "error"
  })
  //Update Validation Schema in MongoDB
  db.runCommand({
    collMod: "users",
    validator: {   // all new validation requirment
       
    },
    validationLevel: "strict",   // or "moderate"
    validationAction: "error"    // or "warn"
  });
  
  //Delete Validation Schema in MongoDB
  db.runCommand({
    collMod: "users",
    validator: null,
    validationLevel: "off"
  });



  // read validation schema
  db.users.validate()   