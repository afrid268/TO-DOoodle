var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt-nodejs");
var titleCase = require("mongoose-title-case");
var validate = require('mongoose-validator');

//validations
var nameValidator = [
  validate({
    validator: 'matches',
    arguments: /^(([a-zA-Z]{3,20})+[ ]+([a-zA-z]{3,20})+)+$/,
    message:"Username must be min 3, max 30, no special charecters or numbers, should have space between first and last name......eg : Felix Kjelberg"
  }),
  validate({
    validator: 'isLength',
    arguments: [3, 20],
    message: 'User Name should be between {ARGS[0]} and {ARGS[1]} characters'
  })
];
var emailValidator = [
  validate({
    validator: 'matches',
    arguments: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    message:"Please provide a valid email "
  }),
  validate({
    validator: 'isLength',
    arguments: [3, 25],
    message: 'Email should be between {ARGS[0]} and {ARGS[1]} characters'
  })
];
var passwordValidator = [
  validate({
    validator: 'matches',
    arguments: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/,
    message:"Password Needs to have atleast 1 lower case , 1 upper case, 1 number and  one special symbol , it should be of minimum 8 and maximum 35 charecters"
  }),
  validate({
    validator: 'isLength',
    arguments: [8, 35],
    message: 'Password should be between {ARGS[0]} and {ARGS[1]} characters'
  })
];

var UserSchema = new Schema({
  user_name: {
    type: String,
    required: true,
    unique: true,
    message: "please fill the username",
    validate: nameValidator
  },
  user_password: {
    type: String,
    required: true,
    validate: passwordValidator,
    message: "please fill the user password",
  },
  user_email: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
    validate: emailValidator,
    message: "please fill the user email",
  },
  tasks: [{
    user_task: {
      type: String,
    },
    task_created_date: {
      type: String,
    },
    task_created_time: {
      type: String, 
    },
  }],
});

//password encryption
UserSchema.pre("save", function (next) {
  var userp = this;
  bcrypt.hash(userp.user_password, null, null, function (err, hash) {
    if (err) return next(err);
    userp.user_password = hash;
    next();
  });
});

//validations
UserSchema.plugin(titleCase,{
paths : ['user_name']
});

//password authentication using bcrypt
UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.user_password);
};

module.exports = mongoose.model("User", UserSchema);
