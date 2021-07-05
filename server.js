
/* MATBASE PROGRAMME SERVER EXPRESS + NODEJS + MONGODB
 APP DEPENDENCY
------------------------------------------------------*/
var express = require('express');
var app = express();
var path = require('path');
// var favicon = require('serve-favicon');
// var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index.js');
var users  = require('./routes/users.js');
var session = require('express-session');
var passport = require('passport');
var expressValidator = require('express-validator');
var LocalStrategy = require('passport-local').Strategy;
var passportLocalMongoose = require('passport-local-mongoose');
var multer = require('multer');
var upload = multer({ dest: './uploads' })
var flash = require('connect-flash');
var mongo = require('mongodb');
var mongoose = require('mongoose');
// var MONGODB_URI = 
var connection = 'mongodb://localhost/Data_app' || 'mongodb+srv://Yadessa:117022@cluster0.nb5sg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
mongoose.connect(connection, function(err){
        if(err){
              console.log('Error, connection failed to',connection);
           }
    else{
              console.log('Success: connection made to', connection );
        }
    });

//     const MongoClient = require('mongodb').MongoClient;

// // replace the uri string with your connection string.
// const uri = "mongodb+srv://shahid:<PASSWORD>@cluster0-1q7ty.mongodb.net/test"
// MongoClient.connect(uri, function(err, client) {
//    if(err) {
//         console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
//    }
//    console.log('Connected...');
//    const collection = client.db("test").collection("devices");
//    // perform actions on the collection object
//    client.close();
// });

const PORT = process.env.PORT || 8080
/* VIEW ENGINE SETUP
-------------------------------------*/
app.set('views',path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// uncomment afer placing your favicon in /;
app.use(express.static(path.join(__dirname, 'public')));
// app.use(logger,'dev');
// app.use(bodyParser.jason());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('secret'));
app.use(express.static(__dirname + "/public"));
/* SESSION HANDLER
---------------------------------------*/
app.use(require('express-session')({
    secret: 'secret',
    saveUninitialized: false,
    resave: false
}));
// app.use(session({ cookieParser:{  maxAge: 60000}})); 

// Passport middleware

app.use(passport.initialize());
app.use(passport.session());
app.use(expressValidator({
    errFormatter: function (param, msg, value) {
        var namespace = param.split('.')
            , root = namespace.shift()
            , formparam = root;

        while (namespace.length) {
            formparam += '[' + namespace.shift()
        }
        return {
            param: formpram,
            msg: msg,
            value: value
        };
    }
}));
app.use(flash());
 app.use(function(req,res,next){
   res.locals.succes_messages = req.flash('succes_messages');
   res.locals.error_messages = req.flash('error_messages');
   next();
 });
 app.use('/', routes);
 app.use('/users', users);
 app.use(users);
 app.get('*', function( req, res, next){
    res.locals.user = req.user || null;
    next();
});

app.listen(PORT, function (err) {
    if (err) {
        console.log("The server is not lisenining, Error!!!");
        console.log(err);
    } else
        console.log("The server is runnining successfuly!!")
})
