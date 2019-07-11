const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');

// admin/add-product => get
router.get('/add-product', adminController.getAddProduct);

// admin/edit-product => get
router.get('/products', adminController.adminProducts);

// admin/add-product => POST
router.post('/add-product', adminController.postAddProduct);

// get edit products
router.get('/edit-product/:prodId', adminController.adminEditProducts);

// post edit product
router.post('/edit-product', adminController.editProduct);

// Delete product
router.post('/delete-product', adminController.deleteProduct);
module.exports = router;