var express = require('express');
var fs = require('fs');
var path = require('path');
var cors = require('cors');
var logger = require("morgan");
var session = require('express-session');

// Parse env variables
require('dotenv').config()

// Connect to database
var mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
mongoose.connect(process.env.DB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;

var app = express();
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
  origin: [`http://${process.env.HOST}:${process.env.FRONTEND_PORT}`],
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
  credentials: true // enable set cookie
}));

app.use(session({ secret: "cnl4finalproject", resave: false, saveUninitialized: false}));
app.use(express.static(path.resolve(__dirname, '../build')));

// API routes
require('./routes')(app);

var formRouter = require('./routes/form')
app.use('/api/forms', formRouter)

// app.get('*', function (req, res) {
//   res.sendFile(path.resolve(__dirname, '../build/index.html'));
//   res.end();
// });


app.listen(process.env.PORT, process.env.HOST, (err) => {
  if (err) {
    console.log(err);
  }
  console.info(`Open http://${process.env.HOST}:${process.env.PORT}/ in your browser`);
});

module.exports = app;
