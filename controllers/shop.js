const Product = require('../models/product')


exports.getProducts = (req,res,next)=>{ 
    let products = Product.find()
            .then((products)=>{
                res.render('shop/product-list',{
                    prods:products,
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
    Product.findById(productId)
                .then((product)=>{
                    res.render('shop/product-details',{
                        product:product,
                        pageTitle:product.pageTitle,
                        path:'/products'})
                })
                .catch(err=>console.log(err));
    
   
}
exports.getIndex = (req,res,next)=>{
    let products = Product.find()
                          .then((products)=>{
                            res.render('shop/index',{
                                prods:products,
                                pageTitle:'My Shop',
                                path:'/'
                            });
                          })
                          .catch(err=>{
                              console.log(err);
                          });
        }

        exports.postCart = (req,res,next) =>{
            let productId = req.body.productId;
            Product.fetchById(productId)
            .then((products)=>{
                return req.user.addToCart(products);
            }).then(result =>{
                console.log(result);
                 res.redirect('/cart');

            })
            .catch(err => console.log(err));
        }

exports.getCart = (req,res,next)=>{
            req.user
               .getCart()
                   .then(products=>{
                       res.render('shop/cart',{
                           path:'/cart',
                           pageTitle:'Your Cart',
                           products:products
                       })
                   })
                   .catch(err =>{
                       console.log(err);
                   })
}

exports.deletePostCart=(req,res,next)=>{
    const productId = req.body.productId;
    req.user
    .deleteItemfromCart(productId)
        .then(product =>{
            res.redirect('/cart');
        })
        .catch(err => console.log(err));


}

exports.postOrder = (req, res, next) => {
    let fetchedCart;
    req.user
      .addOrder()
      .then(result => {
        res.redirect('/orders');
      })
      .catch(err => console.log(err));
  };

  exports.getOrders = (req,res,next)=>{
    req.user.getOrders()
    .then(orders => {
        res.render('shop/orders',{
            path:'/orders',
            pageTitle:'Your Orders',
            orders:orders
        })

    })
    .catch(err =>{
        console.log(err);
    })
   
}

