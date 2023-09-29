var app = angular
  .module("appRoutes", ["ngRoute"])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when("/", {
        templateUrl: "app/views/pages/User-login/login-form.html",
        authenticated : false 
      })
      .when("/todo", {
        templateUrl: "app/views/pages/ToDo-page/todo-list.html",
        authenticated : true
      })
      .when("/register", {
        templateUrl: "app/views/pages/User-login/registration-form.html",
        controller: "regCntrl",
        controllerAs: "registeringUser",
        authenticated : false
      })
      .when("/main", {
        templateUrl: "app/views/pages/main-page/main.view.html",
        authenticated : true
      })
      .when("/todo", {
        templateUrl: "app/views/pages/ToDo-page/todo-list.html",
        controller: "TaskCntrl",
        controllerAs: "TaskCRUD",
        authenticated : true
      })
  
      .otherwise({ redirectTo: "/" });

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false,
    });
  });

//function to check if the user is logged in
    app.run(['$rootScope','UserAuth','$location','User', function($rootScope,UserAuth,$location,User){
      $rootScope.$on('$routeChangeStart',function(event,next,current){
        if(next.$$route !== undefined){
          if(next.$$route.authenticated === true){
            if(!UserAuth.isLoggedIn()){
                    event.preventDefault();
                    $location.path('/home');
                  }
          }else if(next.$$route.authenticated === false){
                if(UserAuth.isLoggedIn()){
                  event.preventDefault();
                  $location.path('/main');
                }
              }
        }
      });
    }]);
