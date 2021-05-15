const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;
let _db;

const MongoConnect = (callback) =>{
    MongoClient.connect('mongodb+srv://admin:admin@cluster0.n0rtz.mongodb.net/shop')
        .then(client =>{
            _db = client.db();
            callback()

        })
        .catch(err =>{
            console.log(err);
            throw error;
        });
}

const getDb = () =>{
    if(_db){
        return _db;
    }
     
    throw 'no database found';
}

exports.MongoConnect = MongoConnect;
exports.getDb = getDb;

