angular
  .module("userControllers", ["userService"])

  .controller("regCntrl", function ($http, $location, $timeout, User) {
    var app = this;

    this.registerUserfunction = function () {
      app.loading = true;
      app.succMsg = false;
      app.errMsg = false;

      User.create(app.regFormData).then(function (data) {
        if (data.data.success) {
          app.loading = false;
          app.succMsg = data.data.message;

          $timeout(function () {
            $location.path("/");
          }, 1000);
        } else {
          app.loading = false;
          app.errMsg = data.data.message;
        }
      });
    };

    this.checkEmailUnique = function(){
      app.checking = true;
      app.checkemailMsg = false;
      app.checkemailInvalid = false;
      User.checkEmailUnique(app.regFormData).then(function(data){
        app.checkemailSuccess = data.data.success;
        app.checkemailMsg = data.data.message;
        if(data.data.success){
          app.checking = false;
          app.checkemailInvalid = false;
        }else{
          app.checking = false;
          app.checkemailInvalid = false;
        }
      });
    }

    this.checkUserNameUnique = function(){
      app.checking = true;
      app.checkUsernameMsg = false;
      app.checkUsernameInvalid = false;

      User.checkUserNameUnique(app.regFormData).then(function(data){
        app.checkUsernameSuccess = data.data.success;
        app.checkUsernameMsg = data.data.message;
        if(data.data.success){
          app.checking = false;
          app.checkUsernameInvalid = false;
        }else{
          app.checking = false;
          app.checkUsernameInvalid = false;
        }
      });
    }
    
  });
