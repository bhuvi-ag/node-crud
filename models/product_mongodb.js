const { getDb }  = require('../utils/database');
const mongodb = require('mongodb');

class Product {

    constructor(title,imageUrl,price,description,id,userId){
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
        this._id = id ? new mongodb.ObjectID(id): null;
        this.userId = userId
        
    }

    save(){
        const db = getDb();
        let dbOp;
            if(this._id){
                //update
                dbOp = db.collection('products').updateOne({_id:this._id}, {$set : this});
            }else{
                //insert
                dbOp = db.collection('products').insertOne(this);
            }
            return dbOp.then((result)=>{
                    console.log(result);
                })
                .catch(err =>{
                    console.log(err);
                })

    }

    static fetchAll(){
        const db = getDb();

         return db.collection('products').find().toArray()
                .then(products =>{
                    return products
                })
                .catch(err =>{
                    console.log(err);
                });

    }

    static fetchById(productId){
        const db = getDb();

        return db.collection('products').find({_id:new mongodb.ObjectID(productId)}).next()
                .then((product)=>{
                    return product;
                })
                .catch(err =>{
                    console.log(err,'err');
                })
    }

    static deleteById(productId){
        const db = getDb();
        return db.collection('products').deleteOne({_id: new mongodb.ObjectID(productId)})
        .then((result)=>{
            console.log('deleted');

        })
        .catch(err =>{
            console.log(err);
        })
    }
    


}

module.exports = Product;