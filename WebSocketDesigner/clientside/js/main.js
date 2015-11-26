var theApp = angular.module("generatorApp", ['ngRoute']);


theApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/home', {
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

theApp.controller('homeController', function($scope, $http) {
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
