const Product = require('../models/products');
const Cart = require('../models/cart');
const CartItem = require('../models/cart-item');

exports.indexPage = (req, res, next) => {
    Product.findAll()
    .then(products => {
        res.render('shop/index', {
            products: products, 
            pageTitle: "Main Page",
            hasProducts: products.length > 0,
            path: 'shop'});
    })
    .catch(err => {
        console.log(err);
    });
}

exports.cartPage = (req, res, next) => {
    req.user.getCart()
    .then(cart => {
        return cart.getProducts()
        .then(products => {
            res.render('shop/cart',
             { pageTitle: 'My Cart',
               path: 'cart',
               products: products,
               hasProducts: products.length > 0,
            });
        })
        .catch(err => {
            console.log(err);
        });
    })
    .catch(err => {
        console.log(err);
    });
}

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    let fetchedCart;
    req.user.getCart()
    .then(cart => {
        fetchedCart = cart;
        return fetchedCart.getProducts({where: {id: prodId}});
    })
    .then(products => {
        let product;
        if(products.length > 0) {
            product = products[0];
        }
        let newQuantity = 1;
        if (product) {
            const oldQuantity = product.cartItem.quantity;
            newQuantity = oldQuantity +1;
        }
        return Product.findByPk(prodId)
        .then(product => {
            return fetchedCart.addProduct(product, {through: {quantity: newQuantity}});
        })
        .then(()=> {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        });
    })
    .catch(err => {
        console.log(err);
    });
}

exports.ordersPage = (req, res, next) => {
    req.user.getOrders({include: ['products']})
    .then(orders => {
        res.render('shop/orders', {
            pageTitle: 'My Orders',
            path: 'orders',
            orders: orders,
            hasOrders: orders.length > 0});
    })
    .catch(err => {
        console.log(err);
    })
}

exports.getProducts = (req, res, next) => {
    Product.findAll()
    .then(products => {
        res.render('shop/products-list', {
            products: products, 
            pageTitle: "My shop",
            hasProducts: products.length > 0,
            path: 'products'});
    })
    .catch(err => {
        console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findAll({ where: {id: prodId}})
    .then(products => {
        res.render('shop/product-details',{
            product: products[0],
            pageTitle: products[0].title,
            path: 'products' });
    })
    .catch(err => {
        console.log(err);
    });
}

exports.deleteFromCart = (req, res, next) => {
    const prodId = req.body.productId;
    req.user.getCart()
    .then(cart => {
       return cart.getProducts({where: {id: prodId}})
    })
    .then(products => {
        const product = products[0];
        return product.cartItem.destroy();
    })
    .then(results => {
        res.redirect('/cart');
    })
    .catch(err => {
        console.log(err);
    });
}


exports.createOrder = (req, res, next) => {
    let fetchedCart;
    req.user
      .getCart()
      .then(cart => {
        fetchedCart = cart;
        return cart.getProducts();
      })
      .then(products => {
        return req.user
          .createOrder()
          .then(order => {
            return order.addProducts(
              products.map(product => {
                product.orderItem = { quantity: product.cartItem.quantity };
                return product;
              })
            );
          })
          .catch(err => console.log(err));
      })
      .then(result => {
        return fetchedCart.setProducts(null);
      })
      .then(result => {
        res.redirect('/orders');
      })
      .catch(err => console.log(err));
  };