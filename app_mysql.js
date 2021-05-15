const express = require('express');
const bodyPraser = require('body-parser');
const handlebars = require('express-handlebars');
const errorController = require('./controllers/error')
const sequelize = require('./utils/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cartItem');
const Order =  require('./models/order');
const OrderItem =  require('./models/orderItem');
const path  = require('path');
const app = express();
const PORT = 3000;

//app.engine('hbs',handlebars({layoutsDir:'views/layouts',defaultLayout:'main-layout',extname:'hbs'}));
//app.set('view engine', 'hbs');
app.set('view engine','ejs');
//app.set('view engine', 'pug');
app.set('views', 'views');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');



app.use(bodyPraser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));

app.use((req,res,next)=>{
    User.findByPk(1)
        .then((user)=>{
            req.user = user;
            next()
        })
        .catch(err=>{
            console.log(err,'err');
        });
})

app.use('/admin',adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404Page);
 Product.belongsTo(User, {constriants: true, onDelete:'CASCADE'});
 User.hasMany(Product);
 Cart.belongsTo(User);
 User.hasOne(Cart);
 Cart.belongsToMany(Product ,{ through: CartItem });
 Product.belongsToMany(Cart, { through: CartItem});
 Order.belongsTo(User);
 User.hasMany(Order);
 Order.belongsToMany(Product , { through : OrderItem});

sequelize
//.sync({force:true})
.sync()
.then((result)=>{
    return User.findByPk(1);
}).then((user)=>{
    if(!user){
        return User.create({name:'bhuvi',email:'bhuvitest@test.com'});
    }
    return user;
}).then(user=>{
    return user.createCart();
})
.then((result)=>{
    console.log(result,'result');
    app.listen(PORT,()=>{
        console.log(`listioning port is ${PORT}`)
    });
})
.catch(err=>{
    console.log(err,'err');
})

