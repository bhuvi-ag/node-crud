const mongodb = require('mongodb');
const { getDb } = require('../utils/database');

 class User {
     constructor(username ,email,cart,id){
         this.username = username
         this.email = email
         this.cart = cart;
         this._id = id

     }
     save(){
         const db = getDb();
         return db.collection('users').insertOne(this)
         .then((result)=>{
            console.log(result)
         })
         .catch(err =>{
            console.log(err);
         })

     }

     addToCart(product) {
         const db = getDb();
         const cartProductIndex = this.cart.items.findIndex(prod =>{
             return prod.productId.toString() == product._id.toString()
         })
         let newQuantity = 1;
          const updatedCartItems = [...this.cart.items]
          console.log(cartProductIndex,'cartProductIndex');

          if(cartProductIndex >= 0){
              newQuantity = this.cart.items[cartProductIndex].quantity + 1;
              updatedCartItems[cartProductIndex].quantity = newQuantity;
          }else{
            updatedCartItems.push({productId:new mongodb.ObjectID(product._id),quantity:1})
          }

          let updatedCart = {items:updatedCartItems};
         return db.collection('users')
         .updateOne({_id: new mongodb.ObjectID(this._id)}, {$set:{cart:updatedCart}})
         .then((result)=>{
             console.log(result);
         }).catch(err =>{
             console.log(err);
         });

     }

     getCart() {
        const db = getDb();
        const productIds = this.cart.items.map((i)=>{
            return i.productId;
        })
        return db.collection('products').find({_id:{ $in:productIds}}).toArray()
        .then(products =>{
            return products.map((p) =>{
                return { ...p , quantity:this.cart.items.find(i =>{
                    return i.productId.toString() === p._id.toString()
                }).quantity}
            })
        })
        .catch(err => console.log(err));
    }

    deleteItemfromCart(productId){
        const updatedCartItems  = this.cart.items.filter(i =>{
              return i.productId.toString()  !== productId.toString()
        }) 

        const db = getDb()
         return db.collection('users').updateOne({_id : new mongodb.ObjectID(this._id)},{$set :{cart:{items :updatedCartItems }} })
         .then(result =>{
            console.log('deleted')           
         })
         .catch(err => console.log(err))

    }

      static findById(userId){   
          const db = getDb();
          return db.collection('users').find({_id:new mongodb.ObjectID(userId)}).next()
          .then((result)=>{
              return result;
          })
          .catch(err => console.log(err));

     }
     addOrder(){
        const db = getDb()
        return this.getCart().then(products =>{
            let orders = { 
                items:products,
                user :{
                    _id: new mongodb.ObjectID(this._id),
                    name:this.username
                }
            };
            return db.collection('orders').insertOne(orders)
        })
        .then(orders =>{
            this.cart = { items:[]}
             return db.collection('users')
                   .updateOne({_id : new mongodb.ObjectID(this._id)},{$set :{cart:{items :[] }} })
               }).catch(err =>{
                   console.log(err);
               })
         }

         getOrders() {
             const db = getDb()

             return db.collection('orders').find({'user._id':this._id}).toArray()
                    .then(orders =>{
                         return orders;
                    }).catch(err => console.log(err));
         }


 }




 module.exports = User;