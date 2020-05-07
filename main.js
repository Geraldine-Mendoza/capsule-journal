var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	// multer is used for form-data
	multer = require('multer');
	upload = multer();
	session = require('express-session');
	cors = require('cors');
	mongoose = require('mongoose'),
	port = process.env.PORT || 3000;
	errorHandler = require('errorhandler');
	// routes
	apiRoutes = require("./routes/api-routes")

//Configure mongoose's promise to global promise
mongoose.promise = global.Promise;

//Configure isProduction variable
const isProduction = process.env.NODE_ENV === 'production';

// set up folders
app.set('view engine', 'ejs');
app.set('views', './views');
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

if(!isProduction) {
  app.use(errorHandler());
}

// configure mongoose
mongoose.connect('mongodb://localhost/qjournal', { useNewUrlParser: true});
var db = mongoose.connection;
mongoose.set('debug', true);

if(!db) console.log("Error connecting db")
else console.log("Db cocnnected successfully")

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

app.get('/', (req, res) => res.send('Hello World (now using nodemon)!'))
// use api routes in app
app.use('/api', apiRoutes)
app.get('*', function(req, res) {  res.send('oops wrong url');});
app.listen(port, () => console.log(`listening at localhost${port}`))


