const { json } = require('body-parser');
const fs = require('fs');
const path = require('path');
const p  = path.join(path.dirname(process.mainModule.filename),'data','carts.json')

module.exports = class Cart {

    static addProduct(id, productPrice){
        //Fetch previous product
        console.log(p,'p');
        fs.readFile(p,(err,fileContent)=>{
            console.log(fileContent,'filecontecnt')
            let cart = { products:[],totalPrice:0}
            if(!err){
                cart = JSON.parse(fileContent);
            }
                //Analyze the cart->find existing product
            let existingProductIndex = cart.products.findIndex(prod => prod.id == id);
            let existingProduct = cart.products[existingProductIndex];
            let updateProduct;
            //add a new product/ increase the quantity
            if(existingProduct){
                updateProduct = {...existingProduct}
                updateProduct.qty = updateProduct.qty + 1
                cart.products = [...cart.products];
                cart.products[existingProductIndex] =updateProduct; 
            }else{
                updateProduct = {id: id,qty: 1}
                cart.products = [...cart.products,updateProduct];
            }
            cart.totalPrice = cart.totalPrice + + productPrice;

            fs.writeFile(p,JSON.stringify(cart),(err)=>{
                console.log(err);
            })

        })
        


    }
    static deleteProduct(id,productPrice){
        fs.readFile(p,(err,fileContent)=>{
            if(!err){
                let updatedCart = {...JSON.parse(fileContent)};
                const product = updatedCart.products.find(p=>p.id ===id );
                console.log(product,'product')
                if(!product){
                    return;
                }
                const productQty = product.qty;
                updatedCart.products = updatedCart.products.filter(p=>p.id !== id)
                updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQty;
                
                fs.writeFile(p,JSON.stringify(updatedCart),(err)=>{
                    console.log(err);
                }) 
                
            }
        });

    }
    static getCart(cb){
        fs.readFile(p,(err,fileContent)=>{
            if(err){
                cb(null)
            }else{
                cb(JSON.parse(fileContent));
            }
        });


    }
}