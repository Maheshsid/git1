var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID; 
var url = "mongodb://127.0.0.1:27017/";

/*let err, db = await MongoClient.connect(url);

if(err){
    console.log("Unable to connect to db")
    throw err
}

console.log(db)

function getDB
*/

async function insertAccount(account){
    return MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        return dbo.collection("accounts").insertOne(account, function(err, res) {
          if (err) throw err;
          console.log("1 document inserted");
          db.close();
        });
      });
}

async function getAllAccounts(){
  try{
    let db = await MongoClient.connect(url)

    var dbo = db.db("mydb");
    let result = await dbo.collection("accounts").find({}).toArray()
    console.log(result);
    db.close();

    return result
  }catch(ex){
    return {}
  }
}

async function updateAccount(account){
  try{
    let db = await MongoClient.connect(url)

    var dbo = db.db("mydb");

    console.log("id: " + account["_id"])
    var query = { '_id': ObjectID(account["_id"]) };

    delete account["_id"]
    var update = { $set: account };
    let result = await dbo.collection("accounts").updateOne(query, update)
    console.log(result);
    db.close();

    return result
  }catch(ex){
    console.log(ex)
    return ex
  }
}

async function clearAccounts(){
  try{
    let db = await MongoClient.connect(url)
    var dbo = db.db("mydb");
    await dbo.collection("accounts").drop()
    db.close()

    return "Success"
  }catch(ex){
    return ex
  }
}

module.exports = {
    insertAccount: insertAccount,
    getAllAccounts: getAllAccounts,
    clearAccounts: clearAccounts,
    updateAccount: updateAccount
}