const fs = require('fs');
const path = require('path');
const p  = path.join(path.dirname(process.mainModule.filename),'data','products.json')
const Cart = require('./cart');
const fetchProdutsFromFile = (cb)=>{    
    fs.readFile(p,(err,fileContent)=>{
        if(err){
            cb([]);
        }else{
            cb(JSON.parse(fileContent))
        }       
    })
}
module.exports = class Product {    
    constructor(id,title,imageUrl,price,description){
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;

    }
    save(){    
        console.log('save' , this)
        fetchProdutsFromFile((products)=>{
            console.log('save' , this)

            if(this.id){
                const existingProductIndex = products.findIndex(prod=>prod.id == this.id);
                const updateProduct = [...products];
                updateProduct[existingProductIndex] = this
                fs.writeFile(p,JSON.stringify(updateProduct),(err)=>{
                    console.log(err,'err');
                })
            }else{

                this.id  = Math.random().toString();
                products.push(this);
                console.log(products,'products');
                fs.writeFile(p,JSON.stringify(products),(err)=>{
                    console.log(err,'err');
                })
            }
        })        
        
    }
    static deleteById(id){
        fetchProdutsFromFile((products)=>{
            let product = products.find((p)=>p.id === id);
            let updatedproduct = products.filter((p)=> p.id !== id);
            console.log(updatedproduct,'updatedProduct');
            fs.writeFile(p,JSON.stringify(updatedproduct),(err)=>{
                console.log(err);
                if(!err){
                    Cart.deleteProduct(id,)
                }
            })
        })
    }
   static fetchAll(cb){
        fetchProdutsFromFile(cb)
    }
  static fetchById(id,cb){
      console.log(id,'id');
      fetchProdutsFromFile((products)=>{
          let product = products.find((p)=> p.id == id)
          cb(product)
      })
  }

}