var theApp = angular.module("generatorApp", ['ngRoute']);


theApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/home', {
                templateUrl: 'partials/homePage.html'
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
