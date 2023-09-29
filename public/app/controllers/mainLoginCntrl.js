angular
  .module("mainLoginController", ["authServices","userService"])
  .controller("maincntrl", function (UserAuth, $timeout, $location,$window,$rootScope,$interval,$route,User,authTokenSession) {
    var app = this;

    app.loadMe = false;
      //session checking
      app.checkSession = function(){
        if (UserAuth.isLoggedIn()) {
          app.checkingSession = true;
          var interval = $interval(function(){
            var token = $window.localStorage.getItem('token');
            if(token === null){
              $interval.cancel(interval)
            }else{
              //token conversion to time stamps
              self.parseJWT = function(token){
                var base64Url = token.split('.')[1];
                var base64 = base64Url.replace('-','+').replace('_','/');
                return JSON.parse($window.atob(base64));
              }
  
              var expireTime = self.parseJWT(token);
              var timeStamp = Math.floor(Date.now() / 1000)
              var timeCheck = expireTime.exp - timeStamp;

              if(timeCheck <= 25 ){
                showModal(1)
                $interval.cancel(interval)
              }else{
                //token session is active
              }

            }
          },2000);
        }
  
      };
      app.checkSession();

      var showModal = function(options){
          app.hideButtons = true;
          app.modalHeader = undefined;
          app.modalContent = undefined;
          
        if(options === 1){
          app.hideButtons = false;
          app.modalHeader = 'Session Timeout Warning';
          app.modalContent = 'Your session will expire soon,Would you like to renew your session? ';
          $('#modal-secondary').modal({backdrop : "static"});
        }
        else if(options === 2){
          app.hideButtons = true;
          //logout
          app.modalHeader = 'Logging Out';
          app.modalContent = 'Please wait';
          $('#modal-secondary').modal({backdrop : "static"});

          $timeout(function () {
            UserAuth.logoutSession();
            $location.path("/");
            hideModal();
            $route.reload();
          }, 2000);
        }
      };

      app.renewSession = function(){
        app.choiceMade = true;
        User.renewUserSession(app.userName).then(function(data){
          if(data.data.success){
            authTokenSession.setToken(data.data.token);
            app.checkSession();
          }else{
            app.modalContent = data.data.message;
          }
        });
        hideModal();
      };

      app.endSession = function(){
        app.choiceMade = true;
        $timeout(function(){
          showModal(2)
        },1000)
        hideModal();
      };

      var hideModal = function(){
        $('#modal-secondary').modal('hide');
      };

    $rootScope.$on('$routeChangeStart',function(){
      if (UserAuth.isLoggedIn()) {
        UserAuth.getUserCurrentLogin()
          .then(function (data) {
            app.userName = data.data.username;
            app.userEmail = data.data.email;
            app.permission = data.data.permission;
            app.userId = data.data.id
            app.loadMe = true;
          
          })
          .catch(function (error) {
            console.error(error);
          });
      } else {
        app.isLoggedIn = false;
        app.userName = "";
        app.userEmail = "";
        app.loadMe = true;
      }
 
    app.isLoggedIn = function () {
      return UserAuth.isLoggedIn();
    };  
    });

    app.doLogin = function (loginData) {
      app.loading = true;
      app.succMsg = false;
      app.errMsg = false;

      UserAuth.login(app.loginData)
        .then(function (data) {
          if (data.data.success) {
            app.loading = false;
            app.succMsg = data.data.message + " Redirecting...";

            $timeout(function () {
              $location.path("/main");
              app.loginData = {
                username: "",
                password: ""
              };
              app.succMsg = '';

              app.checkSession();
            }, 1000);
          } else {
            app.loading = false;
            app.errMsg = data.data.message;
          }
        });
    };


    //logout
    app.logout = function () {
      showModal(2);
    };
  
  });
