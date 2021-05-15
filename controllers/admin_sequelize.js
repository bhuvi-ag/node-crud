const { response } = require('express');
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
     req.user.getProducts({where:{id :productId}})
     //Product.findByPk(productId)
     //.then((product)=>{
       .then((products)=>{
        let product = products[0];
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
    let products = //Product.findAll()
                    req.user.getProducts()
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
    req.user
        .createProduct({
    //Product.create({
        title:title,
        imageUrl:imageUrl,
        price:price,
        description:description,
       // userId:req.user.id
    }).then((result)=>{
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
    Product.findByPk(productId)
    .then((product)=>{
        product.title = updatedTitle
        product.price = updatedPrice
        product.imageUrl = updatedImageUrl
        product.description = updatedDesc
        return product.save()
    }).then((result)=>{
        console.log('product updated')
        res.redirect('/admin/products');
    }).catch(err =>{
        console.log(err)
    })

}
exports.postDeleteProduct =(req,res,next) =>{
    const productId = req.body.productId;
    Product.destroy({where:{id:productId}})
    .then((result)=>{
        res.redirect('/admin/products');
    }).catch(err=>{
        console.log(err,'err');
    })


}