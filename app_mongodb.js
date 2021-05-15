const express = require('express');
const bodyPraser = require('body-parser');
const handlebars = require('express-handlebars');
const errorController = require('./controllers/error')
const { MongoConnect } = require('./utils/database')
const User = require('./models/user');

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
    User.findById('6061c07e276750f2ad2af910')
        .then((user)=>{
            req.user = new User(user.username,user.email,user.cart,user._id);
            next()
        })
        .catch(err=>{
            console.log(err,'err');
        });
})

app.use('/admin',adminRoutes);
app.use(shopRoutes);
//app.use(errorController.get404Page);

MongoConnect(client =>{
    console.log('innn')
    app.listen(PORT,()=>{
        console.log(`Listioning port ${PORT}`)
    })
})




