angular
  .module("authServices", [])
  .factory("UserAuth", function ($http,authTokenSession,$q) {
    authFactory = {};

    authFactory.login = function (loginData) {
      return $http
        .post("/apis/userauthentication", loginData)
        .then(function (data) {
          authTokenSession.setToken(data.data.token);
          return data;
        });
    };

    //custom function that tells if user logged in

    //UserAuth.isloggedIn();
    authFactory.isLoggedIn = function () {
      if (authTokenSession.getToken()) {
        return true;
      } else return false;
    };

    //session logout
    //UserAuth.logoutSession();
    authFactory.logoutSession = function(){
      authTokenSession.setToken();
    };

    //get user for current login stat
      //UserAuth.getUserCurrentLogin();
      authFactory.getUserCurrentLogin = function () {
        if(authTokenSession.getToken()){
          return $http.post('/apis/me');
        }else{
         return $q.reject({message : 'User has no token'});
        }
      };

    return authFactory;
  })

  .factory("authTokenSession", function ($window) {
    var authTokenFactory = {};

    //settoken
    authTokenFactory.setToken = function (token) {
      if(token){
      // authTokenSession.setToken(token);
      $window.localStorage.setItem('token', token);
  
   }else{
      $window.localStorage.removeItem('token');
   }
  };

    //gettoken
    authTokenFactory.getToken = function () {
      //authTokenSession.getToken();
     return $window.localStorage.getItem('token');
    };

    return authTokenFactory;
  })

  .factory('Authinterceptors',function(authTokenSession){
 var authInterceptorsFactory = {};
 authInterceptorsFactory.request = function(config){
  var token = authTokenSession.getToken();
if(token) config.headers['x-access-token'] = token;
  return config;
 }
 return authInterceptorsFactory
  });
