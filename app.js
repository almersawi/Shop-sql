const path = require('path');
const errorContoller = require('./controllers/error');
const express = require('express');
const bodyParser = require('body-parser');
const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const app = express();
const sequelize = require('./util/database');
const Product = require('./models/products');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: false}));

// user middleware
app.use((req, res, next) => {
    User.findByPk(1)
    .then(user => {
        if(user) {
            req.user = user;
            next();
        }
    })
    .catch(err => {
        console.log(err);
    });
});

// Routes
app.use('/admin', adminRouter);
app.use(shopRouter);
app.use(express.static(path.join(__dirname, 'public')));

// 404 page
app.use(errorContoller.get404);

// Product and user relations
Product.belongsTo(User, {onDelete: 'CASCADE', constrains: true});
User.hasMany(Product);

//For cart relations
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});

// For order relations
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, {through: OrderItem});

sequelize.sync().then(() => {
   return User.findByPk(1);
}).then(user => {
    if (!user) {
        User.create({
            username: 'admin',
            name: 'islam',
            email: 'almersawii@gmail.com',
            password: 'password'
        });
    }
    return user;
})
.then(user => {     
   return user.createCart()
})
.then( ()=> {
    app.listen(3000, () => {
        console.log('Listen to port 3000');
    });
})
.catch(err => { 
    console.log(err);
});
