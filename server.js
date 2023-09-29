//dependencies
var express = require('express');
var app = express();
var morgan  =require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');
var chalk = require("chalk");

var port = process.env.PORT || 9000 ;
var router = express.Router();
var routerObj = require("./app/routes/apis")(router);

//middlewares
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(__dirname + "/public"));
app.use("/apis" , routerObj);

//mongoDb connection
mongoose.connect("mongodb://localhost:27017/todoAppDB", function (err) {
  if (err) {
    console.log(chalk.red("Coudnt connect to db:") + err);
  } else {
    console.log(chalk.green("Connection to database successfull!!"));
  }
});

//common landing page
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname + "/public/app/views/landingpage.html"));
});

app.listen(port, function () {
  console.log("------------------------------------------------------------------------");
  console.log(chalk.green("listening to port : ") + port);
  console.log("------------------------------------------------------------------------");
});