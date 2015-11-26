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
    console.log("Home controller");

    $scope.registerData = {};
    $scope.registerData.firstName = "";
    $scope.registerData.lastName = "";
    $scope.registerData.username = "";
    $scope.registerData.password = "";
    $scope.registerData.email = "";

    $scope.sendConfirmationMail = function() {
        console.log($scope.registerData.email);
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
