const express = require('express');
const router = express.Router();
const productsControllers = require('../controllers/products');

router.get('/products', productsControllers.getProducts);
router.get('/products/:productId', productsControllers.getProduct);
router.get('/cart', productsControllers.cartPage);
router.post('/add-to-card', productsControllers.postCart);
router.post('/delete-from-cart', productsControllers.deleteFromCart)
router.get('/orders', productsControllers.ordersPage);
router.get('/', productsControllers.indexPage);
router.post('/create-order', productsControllers.createOrder);

module.exports = router;