
startSession()	     //Initiates a client session
startTransaction()	  //Begins a transaction
commitTransaction()	  //Commits the transaction
abortTransaction()	  //Rolls back if error occurs
session parameter	  //Must be passed in every operation inside transaction




const { MongoClient } = require('mongodb');

async function run() {
  const uri = 'mongodb://localhost:27017/?replicaSet=rs0'; // Must be replica set
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const session = client.startSession();

    const db = client.db('testDB');
    const usersCollection = db.collection('users');
    const ordersCollection = db.collection('orders');

    session.startTransaction();

    try {
      await usersCollection.insertOne(
        { name: 'Alice', balance: 100 },
        { session }
      );

      await ordersCollection.insertOne(
        { item: 'Laptop', price: 1000, user: 'Alice' },
        { session }
      );

      // Commit the transaction
      await session.commitTransaction();
      console.log('Transaction committed.');
    } catch (err) {
      // Abort the transaction on error
      await session.abortTransaction();
      console.error('Transaction aborted. Error:', err);
    } finally {
      await session.endSession();
    }
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
