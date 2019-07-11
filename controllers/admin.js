const Product = require('../models/products');

exports.getAddProduct = (req, res, next) => {
    const editMode = false;
    res.render('admin/edit-product', { pageTitle: 'Add product', path: 'admin/add-product', editing: editMode});
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    req.user.createProduct({
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description
    })
    .then(results => {
        res.redirect('/admin/products');
    })
    .catch(err => {
        console.log(err);
    });
};

exports.adminEditProducts = (req, res, next) => {
    const editMode = true;
    const productId = req.params.prodId;
    req.user.getProducts({where: {id: productId}})
    .then(products => {
        const myProduct = products[0];
        const pageTitleContent = 'Edit Product | ' + myProduct.title; 
        res.render('admin/edit-product', { pageTitle: pageTitleContent,editing: editMode, path: 'admin/edit-product', product: myProduct});
    })
    .catch(err => {
        console.log(err);
    });
}

exports.editProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const id = req.body.prodId;
    req.user.getProducts({ where: {id: id}})
    .then(products => {
        const myProduct = products[0];
        myProduct.title = title;
        myProduct.imageUrl = imageUrl;
        myProduct.price = price;
        myProduct.description = description;
        return myProduct.save();
    })
    .then(result => {
        res.redirect('/admin/products');
    })
    .catch(err => {
        console.log(err);
    });
}

exports.adminProducts = (req, res, next) => {
    req.user.getProducts()
    .then(products => {
        res.render('admin/products', {products: products, 
            pageTitle: "Admin Edit Product",
            hasProducts: products.length > 0,
            path: 'admin/products'});
    })
    .catch(err => {
        console.log(err);
    });
};

exports.deleteProduct = (req, res, next) => {
    const productId = req.body.prodId;
    Product.destroy({ where: {id: productId}})
    .then(result => {
        res.redirect('/admin/products');
    })
    .catch(err => {
        console.log(err);
    });
}

