var User = require("../models/user-mongoose.model");
var jwt = require("jsonwebtoken-promisified");
var secretKey = "my-secret-key";

module.exports = function (router) {

  //user registration route
  //http:/localhost:1234/apis/users
  router.post("/users", function (req, res) {
    var user = new User({
      user_name: req.body.username,
      user_password: req.body.password,
      user_email: req.body.email,
    });

    if (!req.body.username || !req.body.email || !req.body.password) {
      res.json({
        success: false,
        message: "Ensure that username, password, and email are provided.",
      });
    } else {
      user.save(function (err) {
        if (err) {
        if(err.errors != null){
            if(err.errors.user_name){
            res.json({success : false,message : err.errors.user_name.message})
          }
          else if(err.errors.user_email){
            res.json({success : false,message : err.errors.user_email.message})
          }
          else if(err.errors.user_password){
            res.json({success : false,message : err.errors.user_password.message})
          }else{
            res.json({success : false , message : err});
          }
        } else if(err) {
          if(err.code == 11000){
            res.json({success : false , message : "User Name or Email already taken"});
          }else{
            res.json({success : false , message : err});
          }
        }
        }
        else {
          res.json({ success: true, message: "Account Registered" });
        }
      });
    }
  });


  router.post("/checkemailalreadyEX", async function (req, res) {
    User.findOne({ user_email: req.body.email })
          .select("user_email")
          .exec(function(err,user){
            if(err) throw err;
            if(user){
              res.json({success : false , message : "That email is taken , please make it a unique one !!"});
            }else{
              res.json({success : true , message : "That email is available !!"});
            }
      });
  });

  router.post("/usernamealreadyEX", async function (req, res) {
    User.findOne({ user_name: req.body.username })
          .select("user_name")
          .exec(function(err,user){
            if(err) throw err;
            if(user){
              res.json({success : false , message : "That username is taken , please make it a unique one !!"});
            }else{
              res.json({success : true , message : "That username is available !!"});
            }
      });
  });

  //user login route
  //http:/localhost:9000/apis/userauthentication
  router.post("/userauthentication", async function (req, res) {
    try {
      if (!req.body.username || !req.body.password) {
        res.json({
          success: false,
          message: "Username or password field can't be left empty.",
        });
      } else {
        var result = await User.findOne({ user_name: req.body.username })
          .select("_id user_name user_password user_email ")
          .exec();
        if (!result) {
          res.json({
            success: false,
            message: "User couldn't be authenticated.",
          });
        } else {
          var validPassword = await result.comparePassword(req.body.password);
          if (!validPassword) {
            res.json({
              success: false,
              message: "The password does not match to the authenticated user.",
            });
          } else {
               var tokenVar = await jwt.sign(
              { id : result._id , username: result.user_name, email: result.user_email },
              secretKey,
              { expiresIn: "12h" }
            );
            res.json({
              success: true,
              message: "User authenticated ",
              token: tokenVar,
            });
          }
        }
      }
    } catch (err) {
      console.error(err);
      res.json({ success: false, message: "User authentication failed , error occured in authenticating User." });
    }
  });

  
//view logged current user stats
//middleware for currentuser login stat
router.use(function(req,res,next){
var token = req.body.token||req.body.query||req.headers['x-access-token'];
if(token){
//verify token
jwt.verify(token,secretKey,function(err,decoded){
if(err){
  res.json({ success: false, message: "Token verfication failed." });
}else{
  req.decoded = decoded;
  next();
}
});
}else{
  res.json({ success: false, message: "No token provided." });
}

});

router.post('/me' , function(req,res){
 res.send(req.decoded);
});

router.get("/renewToken/:username",function(req,res){
  User.findOne({user_name : req.params.username}).select().exec(function(err,user){
    if (err) {
      console.log("some error occured in user token renewal");
      res.json({success : false , message : "error in user token renewal api part"+err});
      throw err
    }
    if(!user){
      res.json({ success: false, message: "No user found for renewing session tokens" });
    }else{
      var newTokenVar = jwt.sign(
        { id : user._id , username: user.user_name, email: user.user_email },
        secretKey,
        { expiresIn: "24h" }
      );
      res.json({
        success: true,
        token: newTokenVar,
      });

    }
  })
})

//task create api
router.post("/userAddsTask" , function(req,res){
  var user_id = req.body._id;
  var taskData =  req.body.user_task;

  let timeStamp = new Date();
  taskCreatedDate = timeStamp.toLocaleDateString();
  taskCreatedTime = timeStamp.toLocaleTimeString();

  var reqQuery = {
    user_task : taskData,
    task_created_date : taskCreatedDate,
    task_created_time : taskCreatedTime
  }

 //validation for logged in user
 User.findOne({_id : req.decoded.id} ,function(err , registeredUser){
  if(err){
    res.json({ success : false , message : "error in authorising the particular user"});
    throw err;
  }else{
    if(!registeredUser){
      res.json({ success : false , message : "You are Unauthorized to access this!!!!"});
    }else{
      //run backen code for saving
      if(!taskData || !user_id){
        res.json({ success : false , message : "Ensure that a task or the users id to save his task has been send from front end to save to the DB"});
      }else{
        User.findOneAndUpdate({_id :user_id } , { $push : {tasks : reqQuery}} ,{new:true} ,
          function(err){
              if(err){
                res.json({success:false , message : "failed api '/userAddsTask' in adding newe tasks to the system" + err})
                    throw err;
              }else{
                res.json({success:true , message : "successfully added a task in the system"});
              }
          });
      }
    }
  }
});

});

//task Read Api
router.get("/getUserTasks" , function(req,res){
 //validation for logged in user
 User.findOne({_id : req.decoded.id} ,function(err , registeredUser){
  if(err){
    res.json({ success : false , message : "error in authorising the particular user"});
    throw err;
  }else{
    if(!registeredUser){
      res.json({ success : false , message : "You are Unauthorized to access this!!!!"});
    }else{
      //run backen code for retrieving data from DB
      User.findOne({_id : req.decoded.id}).select("tasks").exec(function(err , tasksResult){
        if(err){
          res.json({ success : false , message : "error in retriving tasks for Read function from DB"});
        }else{
          res.json({ success : true , message : "successfully retrived tasks for Read function from DB" , data : tasksResult});
        }
    })
    }
  }
});


});

//task delete api
router.delete("/deleteTask/:_id" , function(req,res){
  taskIdForDeletingTask = req.params._id
 //validation for logged in user
 User.findOne({_id : req.decoded.id} ,function(err , registeredUser){
  if(err){
    res.json({ success : false , message : "error in authorising the particular user"});
    throw err;
  }else{
    if(!registeredUser){
      res.json({ success : false , message : "You are Unauthorized to access this!!!!"});
    }else{
      //run backen code for Deleting data
      if(taskIdForDeletingTask){
        User.findOneAndUpdate({_id : req.decoded.id} , 
          { $pull : { tasks : {_id : taskIdForDeletingTask} } } ,
          {new : true } , function(err){
            if(err){
              console.error("Error updating document after deleting activity:", err);
              return res.status(500).json({ success: false, message: 'Error updating document after deleting activity' });
            }else{
              return res.status(200).json({ success: true, message: 'Activity deleted successfully' });
            }
          });
      }else{
        return res.status(500).json({ success: false, message: 'Error in getting Task id for deleting the specific task' });
      }
    }
  }
});
})

//get specific task for edit api
router.get("/editTask/:_id" , function(req,res){
  taskIdForEditTask = req.params._id;
//validation for logged in user
User.findOne({_id : req.decoded.id} ,function(err , registeredUser){
  if(err){
    res.json({ success : false , message : "error in authorising the particular user"});
    throw err;
  }else{
    if(!registeredUser){
      res.json({ success : false , message : "You are Unauthorized to access this!!!!"});
    }else{
      //run backen code for retrieving data for editing
      if(taskIdForEditTask){
        User.findOne({ "tasks._id" : taskIdForEditTask}) .select("tasks.$") . exec(function(err,taskResult){
            const fetchedTask = taskResult.tasks[0].user_task;
            const IdOffetchedTask = taskResult.tasks[0]._id;
            res.json({success : true , message : " fetched the task from specific id for edit api" ,userTaskfroEdit : fetchedTask , _id : IdOffetchedTask})
        });
    }else{
          return res.status(500).json({ success: false, message: 'Error in getting Task id for fetching data to edit' });
      }
    }
  }
});
});

//task update api
router.put("/userUpdatesTask",function(req , res){
  idForSearch = req.body._id; 
  updatedUserTask = req.body.user_task

  User.findOne({_id : req.decoded.id} ,function(err , registeredUser){
    if(err){
      console.log("error occured in task post api for updating task , failed in checking validation of current user",err);
      throw err;
    }else{
          if(!registeredUser)  {
            res.json({success : false , message : "You are Unauthorized to access this!!!!"})
          }else{
              if(!idForSearch || !updatedUserTask){
                res.json({success : false , message : "Ensure sufficient parameters are passed (id or updated task) for updating task in the system"})
              }else{
                User.findOneAndUpdate({"tasks._id" :idForSearch } , { $set : {"tasks.$.user_task" : updatedUserTask}} ,{new:true} ,
                  function(err){
                    if(err){
                      res.json({success:false , message : "failed api '/userUpdatesTask' in updating tasks to the system" + err})
                          throw err;
                    }else{
                      res.json({success:true , message : "successfully updated task in the system"});
                    }
                });
              }
          }
    }
  });
})

  return router;
};