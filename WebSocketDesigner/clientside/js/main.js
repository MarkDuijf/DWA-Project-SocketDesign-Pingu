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
    $scope.homeMessage = "No message";
    $scope.showHomeMessage = false;
    $scope.isErrorMessage = false;

    if($routeParams.email !== undefined && $routeParams.confirmation !== undefined) {
        var confirmData = {
            email: $routeParams.email,
            confirmation: $routeParams.confirmation
        };

        $http.post("/confirm", confirmData).
        success( function(data) {
            console.log("Confirmation succes! " + data);
            $scope.showHomeMessage = true;
            $scope.homeMessage = "Your account has been activated.";
            $scope.isErrorMessage = false;
        }).
        error( function(data,status) {
            console.log("Confirmation error:", data, status);
            $scope.showHomeMessage = true;
            $scope.homeMessage = "Couldn't activate this account.";
            $scope.isErrorMessage = true;
        });
    }

    $scope.register= function() {
        var registerData = {
            email: $scope.registerData.email,
            firstName: $scope.registerData.firstName,
            lastName: $scope.registerData.lastName,
            username: $scope.registerData.username,
            password: $scope.registerData.password,
            confirmationLink: Math.random().toString(36).slice(2)
        };

        $http.post("/register", registerData).
        success(function(data) {
            console.log("Succes! " + data);
            $scope.showHomeMessage = true;
            $scope.homeMessage = "Succes, an email with a confirmation link has been sent.";
            $scope.isErrorMessage = false;
        }).
        error( function(data,status) {
            console.log("ERROR:", data, status);
            if(data === "Email already exists") {
                $scope.registerData.email = "";
                $scope.showHomeMessage = true;
                $scope.homeMessage = "This email address already exists.";
                $scope.isErrorMessage = true;
            } else if(data === "Username already exists") {
                $scope.registerData.username = "";
                $scope.showHomeMessage = true;
                $scope.homeMessage = "This username already exists.";
                $scope.isErrorMessage = true;
            } else {
                $scope.showHomeMessage = true;
                $scope.homeMessage = "Error: " + data;
                $scope.isErrorMessage = true;
            }
            $scope.registerData.password = "";
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
            $scope.showHomeMessage = true;
            $scope.homeMessage = "Error: " + data;
            $scope.isErrorMessage = true;
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
        error(function(data,status) {
            console.log("ERROR:", data, status);
            $scope.loginData.password = "";
            $scope.showHomeMessage = true;
            $scope.homeMessage = "Error: " + data;
            $scope.isErrorMessage = true;
        });
    };

    $scope.hideMessage = function() {
        $scope.showHomeMessage = false;
    }
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
