const Product = require('../models/product')

exports.addProduct = (req,res,next)=>{
    res.render('admin/add-product',{pageTitle:"Add Product",
    path:'/admin/add-product',
    editMode:false
});
}

exports.editProduct = (req,res,next)=>{
    const edit_mode = req.query.edit;
    const productId = req.params.productId;    
     if(!edit_mode){
         return res.redirect('/');
     }
     
     Product.fetchById(productId)
     //.then((product)=>{
       .then((products)=>{
        let product = products;
        res.render('admin/add-product',{
            pageTitle:"Edit Product",
            path:'/admin/edit-product',
            editMode:edit_mode,
            product:product
        
     })
     })
     .catch(err=>{
         console.log(err,'err');
     });

}

exports.getProducts = (req,res,next)=>{
    let products = Product.fetchAll()
                    .then((products) =>{
                        res.render('admin/products',{
                            prods:products,
                            pageTitle:'Admin Products',   
                            path:'/admin/products'
                        
                        });
                    })
                    .catch((err)=>{
                        console.log(err);
                    })
}


exports.postAddProduct = (req,res)=>{
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
     const product = new Product(title,imageUrl,price,description,null,req.user._id);
     product.save()
    .then((result)=>{
        console.log(result,'result');
        res.redirect('/admin/products');

    }).catch(err=>{
        console.log(err,'err');
    })
}

exports.postEditProduct = (req,res,next)=>{
    const productId = req.body.productId
    const updatedTitle = req.body.title;
    const updatedImageUrl= req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDesc = req.body.description
    let product = new Product(updatedTitle,updatedImageUrl,updatedPrice,updatedDesc,productId);
    product.save().then((result)=>{
        console.log('product updated')
        res.redirect('/admin/products');
    }).catch(err =>{
        console.log(err)
    })

}
exports.postDeleteProduct =(req,res,next) =>{
    const productId = req.body.productId;
    Product.deleteById(productId)
    .then((result)=>{
        res.redirect('/admin/products');
    }).catch(err=>{
        console.log(err,'err');
    })


}