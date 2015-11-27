var theApp = angular.module("generatorApp", ['ngRoute']);


theApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/home', {
                templateUrl: 'partials/homePage.html',
                controller: 'homeController'
            }).
            when('/home/:email/:confirmation', {
                templateUrl: 'partials/homePage.html',
                controller: 'homeController'
            }).
            when('/codeGenerator', {
                templateUrl: 'partials/codeGenerator.html',
                controller: 'generatorController'
            }).
            when('/chatPage', {
                templateUrl: 'partials/chatPage.html',
                controller: 'chatController'
            }).
            otherwise({
                redirectTo: '/home'
            });
    }]);

theApp.controller('homeController', function($scope, $http, $routeParams) {
    $scope.registerData = {};
    $scope.registerData.firstName = "";
    $scope.registerData.lastName = "";
    $scope.registerData.username = "";
    $scope.registerData.password = "";
    $scope.registerData.email = "";

    $scope.loginData = {};
    $scope.loginData.username = "";
    $scope.loginData.password = "";

    $scope.loggedIn = false;

    if($routeParams.email !== undefined && $routeParams.confirmation !== undefined) {
        console.log($routeParams.email + " " + $routeParams.confirmation);

        var confirmData = {
            email: $routeParams.email,
            confirmation: $routeParams.confirmation
        };

        $http.post("/confirm", confirmData).
        success( function(data) {
            console.log("Confirmation succes! " + data);
        }).
        error( function(data,status) {
            console.log("Confirmation error:", data, status);
        });
    }

    $scope.register= function() {
        var registerData = {
            email: $scope.registerData.email,
            firstName: $scope.registerData.firstName,
            lastName: $scope.registerData.lastName,
            username: $scope.registerData.username,
            password: $scope.registerData.password
        };

        $http.post("/register", emailData).
        success( function(data) {
            console.log("Succes! " + data);
        }).
        error( function(data,status) {
            console.log("ERROR:", data, status);
        });
    };

    $scope.sendConfirmationMail = function() {
        var emailData = {
            email: $scope.registerData.email,
            firstName: $scope.registerData.firstName,
            lastName: $scope.registerData.lastName,
            username: $scope.registerData.username,
            password: $scope.registerData.password
        };

        $http.post("/email", emailData).
        success( function(data) {
            console.log("Succes! " + data);
        }).
        error( function(data,status) {
            console.log("ERROR:", data, status);
        });
    };

    $scope.login = function() {
        var loginData = {
            username: $scope.loginData.username,
            password: $scope.loginData.password
        };
        console.log("login");
        $http.post("/login", loginData).
        success( function(data) {
            console.log("Succes! " + data);
            $scope.loggedIn = true;
        }).
        error( function(data,status) {
            console.log("ERROR:", data, status);
        });
    };
});

theApp.controller('menuControl', ['$scope', '$location', function ($scope) {

    $scope.menuItems = [{
        Title: 'HOME',
        LinkText: ''
    }, {
        Title: 'ABOUT US',
        LinkText: 'aboutUs'

    }, {
        Title: 'GITHUB',
        LinkText: 'gitHub'

    }, {
        Title: 'HELLO WORLD',
        LinkText: 'helloWorld'
    }, {
        Title: 'CODE GENERATOR',
        LinkText: '/codeGenerator'
    }, {
        Title: 'CHAT',
        LinkText: '/chatPage'

    }];


}]);
