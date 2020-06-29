if(process.env.NODE_ENV !== 'production') { require('dotenv').config() } // set up env

const express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	// multer is used for form-data
	multer = require('multer');
	upload = multer();
	session = require('express-session');
	cors = require('cors');
	mongoose = require('mongoose'),
	port = process.env.PORT || 3000;
	errorHandler = require('errorhandler'),
  // auth and persistance
  passport = require('passport')
	flash = require('express-flash')
	session = require('express-session');

//Configure mongoose's promise to global promise
mongoose.promise = global.Promise;

// set up folders
app.set('view engine', 'ejs');
app.set('views', './views'); // for render 
app.use(express.static(__dirname + '/public'));

// Configure app
app.use(cors());
app.use(require('morgan')('dev'));
// for parsing json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded (for forms)
app.use(bodyParser.urlencoded({extended: true}));
// for parsing multipart/form-data
app.use(upload.array()); 
app.use(express.urlencoded({ extended: false }))
//auth
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false, // no resaving session vars if nothing changed
  saveUninitialized: false // no empty value on init
}))
app.use(passport.initialize())
app.use(passport.session()) // req.user always set to user that's authenticated at that moment

// passport initilization
const initializePassport = require('./config/passport');
initializePassport(passport);

// configure mongoose
mongoose.connect('mongodb://localhost/qjournal', { useNewUrlParser: true});
var db = mongoose.connection;
mongoose.set('debug', true);

if(!db) console.log("Error connecting db")
else console.log("Db cocnnected successfully")

// routes
const apiRoutes = require("./routes/api-routes");
app.use(apiRoutes);

/*
//Error handlers & middlewares
if(!isProduction) {
  app.use((err, req, res) => {
    res.status(err.status || 500);

    res.json({
      errors: {
        message: err.message,
        error: err,
      },
    });
  });
}

app.use((err, req, res) => {
  res.status(err.status || 500);

  res.json({
    errors: {
      message: err.message,
      error: {},
    },
  });
});*/

//app.get('/', (req, res) => res.send('Hello World (now using nodemon)!'))
// use api routes in app
app.get('*', function(req, res) { res.setHeader('auth-access-token', ''); res.send('oops wrong url');});
app.listen(port, () => console.log(`listening at localhost${port}`))


