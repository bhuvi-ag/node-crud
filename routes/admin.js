const express = require('express');
const path =require('path');
const router = express.Router();
const adminController = require('../controllers/admin');



router.get('/add-product',adminController.addProduct)

 router.get('/products', adminController.getProducts);

router.post('/add-product',adminController.postAddProduct);

 router.get('/edit-product/:productId',adminController.editProduct);
 router.post('/edit-product', adminController.postEditProduct);

 router.post('/delete-product',adminController.postDeleteProduct);
 router.post('/add-user' ,adminController.postUser );
module.exports = router;


