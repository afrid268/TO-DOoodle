angular.module("userService", []).factory("User",function ($http) {
  userFactory = {};

  // User.create
  userFactory.create = function (regFormData) {
    return $http.post("/apis/users", regFormData);
  };

  // User.checkEmailUnique(regData);
  userFactory.checkEmailUnique = function (regFormData) {
    return $http.post("/apis/checkemailalreadyEX", regFormData);
  };
  // User.checkUserNameUnique(regData);
  userFactory.checkUserNameUnique = function (regFormData) {
    return $http.post("/apis/usernamealreadyEX", regFormData);
  };

  //User.renewUserSession(username)
  userFactory.renewUserSession = function (username){
    return $http.get("/apis/renewToken/" + username);
  };

   // User.createTask()
   userFactory.createTask = function(TaskFormData){
    return $http.post("/apis/userAddsTask",TaskFormData);
  }

  // User.readTask()
  userFactory.readTask = function(){
    return $http.get("/apis/getUserTasks");
  }
  // User.deleteTask()
  userFactory.deleteTask = function(passedTaskIdtoDelete){
    return $http.delete("/apis/deleteTask/" + passedTaskIdtoDelete);
  }

  // User.editTask()
  userFactory.editTask = function(passedTaskIdtoEdit){
    return $http.get("/apis/editTask/" + passedTaskIdtoEdit);
  }

  //User.updateTask()
  userFactory.updateTask = function(updatedTaskFormData){
    return $http.put("/apis/userUpdatesTask" ,updatedTaskFormData);
  }

  return userFactory;
});
