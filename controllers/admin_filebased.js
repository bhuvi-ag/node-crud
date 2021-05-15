const Cart = require('../models/cart');
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
     Product.fetchById(productId,(product)=>{
        res.render('admin/add-product',{
            pageTitle:"Edit Product",
            path:'/admin/edit-product',
            editMode:edit_mode,
            product:product
        
     })
});
}

exports.getProducts = (req,res,next)=>{
    let products = Product.fetchAll()
                    .then(([rows,fieldData]) =>{
                        res.render('admin/products',{prods:rows,
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
    console.log(req.body);
    let product = new Product(null,title,imageUrl,price,description)
    product.save().then(()=>{
        res.redirect('/');
    }).catch((err)=>{
        console.log(err);
    });
}

exports.postEditProduct = (req,res,next)=>{
    const productId = req.body.productId
    const updatedTitle = req.body.title;
    const updatedImageUrl= req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDesc = req.body.description
    let product = new Product(productId,updatedTitle,updatedImageUrl,updatedPrice,updatedDesc);
    product.save();
    res.redirect('/admin/products');
}
exports.postDeleteProduct =(req,res,next) =>{
    const productId = req.body.productId;
    Product.deleteById(productId);
    res.redirect('/admin/products');


}