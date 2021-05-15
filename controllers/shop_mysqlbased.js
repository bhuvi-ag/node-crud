const Product = require('../models/product')
const Cart = require('../models/cart');

exports.getProducts = (req,res,next)=>{ 
    let products = Product.fetchAll()
            .then(([rows,fieldData])=>{
                console.log(rows,'rows')
                res.render('shop/product-list',{prods:rows,
                    pageTitle:'All products',   
                    path:'/products'
                });
            })
            .catch(err=>{
                console.log(err)
            });
        
}
exports.getProduct = (req,res,next)=>{
    let productId = req.params.productId;
    Product.fetchById(productId)
                .then(([product])=>{
                    res.render('shop/product-details',{
                        product:product[0],
                        pageTitle:product.pageTitle,
                        path:'/products'})
                })
                .catch(err=>console.log(err));
    
   
}
exports.getIndex = (req,res,next)=>{
    let products = Product.fetchAll()
                    .then(([rows,fieldData])=>{
                        res.render('shop/index',{prods:rows,
                            pageTitle:'My Shop',
                            path:'/'
                        });
                    })
                    .catch(err => { console.log(err)});
        }

exports.getCart = (req,res,next)=>{
    Cart.getCart((cart)=>{
        Product.fetchAll((products)=>{
            const cartProducts = [];
            if(cart !== null){
                for(product of products){
                    const cartProductData = cart.products.find(p=>p.id === product.id);
                    if(cartProductData){
                        cartProducts.push({productData:product,qty:cartProductData.qty});
                    }
                }
            }
            res.render('shop/cart',{
                path:'/cart',
                pageTitle:'Your Cart',
                products:cartProducts
            })

        })

    })
    
}
exports.postCart = (req,res,next) =>{
    let productId = req.body.productId;
    Product.fetchById(productId,(product)=>{
        Cart.addProduct(productId,product.price);
    })
    console.log(productId,'productId')
    res.redirect('/cart');
}
exports.deletePostCart=(req,res,next)=>{
    const productId = req.body.productId;
    Product.fetchById(productId,(product)=>{
        Cart.deleteProduct(productId,product.price);
        res.redirect('/cart');


    });

}
exports.getOrders = (req,res,next)=>{
    res.render('shop/orders',{
        path:'/orders',
        pageTitle:'Your Orders'
    })
}
exports.getCheckout = (req,res,next)=>{
    res.render('shop/checkout',{
        path:'/checkout',
        pageTitle:'Checkout'
    })

}