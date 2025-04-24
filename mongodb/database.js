install mongo db
C:\data\db folder
 set Env variable
C:\Program Files\MongoDB\Server\4.0\bin

open cmd and type mongod
=======================================
> show dbs   // list all dtabase
> use <dbname>  // switch to selected database
> db // pointed to db  ( show which db in use)
db.dropDatabase()  //  delete data base including all collection
db.collection_name.drop()
=============================
create bacup
// create folder & open cmd of that folder
>  mongodump
======================
>mongorestore    // insame folder

===============================
mongoimport --uri "<connection string>" --db <database> --collection <collection> --file <filename> --type <filetype> [options]

mongoimport --db mydb --collection users --file users.json --jsonArray

mongoimport --db mydb --collection products --type csv --file products.csv --headerline
(--fields "name,price,stock") // if headerline is not set 

mongoimport --uri "mongodb+srv://user:pass@cluster.mongodb.net/mydb" --collection users --file users.json --jsonArray

mongoimport --uri "mongodb+srv://user:pass@cluster.mongodb.net/mydb" --collection products --type csv --file products.csv --headerline

⚙️ Common Options
Option	Description
--drop	Drops the collection before importing
--upsert	Updates matching documents (must use --upsertFields)
`--mode merge	upsert
--type	json, csv, or tsv
--fields	Manually specify field names for CSV/TSV
--headerline	Use first row of CSV/TSV as field names
--jsonArray	Required if importing JSON arrays