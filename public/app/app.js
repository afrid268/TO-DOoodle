angular.module('userApp',['appRoutes','userControllers' , 'userService' , 'ngAnimate' , 'mainLoginController' , 'authServices' , 'TaskController'  ])

.config(function($httpProvider){
    $httpProvider.interceptors.push('Authinterceptors')
});


  