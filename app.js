var express = require('express');
var path = require('path');
var http = require('http');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var Sequelize = require('sequelize');

//Connection string
var sequelize = new Sequelize('sequelize_test', 'root', 'root', {
  host: '127.0.0.1',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});


//Define table/schemas (Combination of mongoose.Schema and mongoose.model)
var User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  firstName: {
    type: Sequelize.STRING,
    unique: true,
    field: 'first_name' //field name in the database
  },
  lastName: {
    type: Sequelize.STRING,
    field: 'last_name'  
  },
  address: Sequelize.TEXT
}, {
  freezeTableName: true //Will set model name as table name. If this option is not set, sequelize create table 
  //with name as plural form of model name specified
});

//Add record to a table
User.create({ 
  firstName: 'Raeesaa'
, lastName: 'Metkari'
, address: 'Somewhere in Pune, Maharashtra, India' 
}).then(function(user) {
  console.log(user.get());
}).catch(function(err) {
  console.log("Error: ");
  console.log(err);
});

//Query table
/*User.findAll({
  
}).then(function(users) {
  console.log(users[0].toJSON());
})*/

//SYNC
sequelize.sync();

var app = express();

//Port
app.set('port', (process.env.PORT || '3000'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', function (req, res, next) {
  res.render('index', { title: "Express" });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


var server = http.createServer(app).listen(app.get('port'));
server.on('listening', function (err) {
  console.log("Express Server Listening on Port: " + app.get('port'));
});
