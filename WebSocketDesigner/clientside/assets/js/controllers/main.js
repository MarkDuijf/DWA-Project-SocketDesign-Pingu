var theApp = angular.module("generatorApp", ['ngRoute']);

theApp.factory('usernameFactory', function () {
    return username;
});

theApp.config(['$routeProvider',
    function ($routeProvider) {
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
        when('/helloworld', {
            templateUrl: 'partials/helloworld.html',
            controller: ''
        }).
        otherwise({
            redirectTo: '/home'
        });
    }]);

theApp.controller('homeController', function ($scope, $http, $routeParams, $timeout, usernameFactory) {
        $scope.registerData = {};
        $scope.registerData.firstName = "";
        $scope.registerData.lastName = "";
        $scope.registerData.username = "";
        $scope.registerData.password = "";
        $scope.registerData.email = "";

        $scope.loginData = {};
        $scope.loginData.username = "";
        $scope.loginData.password = "";

        $scope.contact = {};
        $scope.contact.name = "";
        $scope.contact.email = "";
        $scope.contact.message = "";

        $scope.loggedIn = false;
        $scope.homeMessage = "No message";
        $scope.showHomeMessage = false;
        $scope.isErrorMessage = false;

        //Gebruikt voor het activeren van een account, kijkt of de benodigde gegevens in de adresbalk staan en voert het daarna uit
        if ($routeParams.email !== undefined && $routeParams.confirmation !== undefined) {
            var confirmData = {
                email: $routeParams.email,
                confirmation: $routeParams.confirmation
            };

            $http.post("/confirm", confirmData).
            success(function (data) {
                console.log("Confirmation succes! " + data);
                $scope.showHomeMessage = true;
                $scope.homeMessage = "Your account has been activated.";
                $scope.isErrorMessage = false;
            }).
            error(function (data, status) {
                console.log("Confirmation error:", data, status);
                $scope.showHomeMessage = true;
                $scope.homeMessage = "Couldn't activate this account.";
                $scope.isErrorMessage = true;
            });
        }

        //Gebruikt voor het registreren met de ingevoerde gegevens
        $scope.register = function () {
            var registerData = {
                email: $scope.registerData.email,
                firstName: $scope.registerData.firstName,
                lastName: $scope.registerData.lastName,
                username: $scope.registerData.username,
                password: $scope.registerData.password,
                confirmationLink: Math.random().toString(36).slice(2)
            };

            $http.post("/register", registerData).
            success(function (data) {
                console.log("Succes! " + data);
                $scope.showHomeMessage = true;
                $scope.homeMessage = "Succes, an email with a confirmation link has been sent.";
                $scope.isErrorMessage = false;
                $scope.registerData = {};
            }).
            error(function (data, status) {
                console.log("ERROR:", data, status);
                if (data === "Email already exists") {
                    $scope.registerData.email = "";
                } else if (data === "Username already exists") {
                    $scope.registerData.username = "";
                }
                $scope.registerData.password = "";
                $scope.registererror = "Error: " + data;
                $timeout(function () {
                    $('#registerModal').modal('show')
                }, 800);
            });
        };
        $scope.sendConfirmationMail = function () {
            var emailData = {
                email: $scope.registerData.email,
                firstName: $scope.registerData.firstName,
                lastName: $scope.registerData.lastName,
                username: $scope.registerData.username,
                password: $scope.registerData.password
            };

            $http.post("/email", emailData).
            success(function (data) {
                console.log("Succes! " + data);
            }).
            error(function (data, status) {
                console.log("ERROR:", data, status);
                $scope.showHomeMessage = true;
                $scope.homeMessage = "Error: " + data;
                $scope.isErrorMessage = true;
            });
        };

        //Gebruikt om een gebruiker in te loggen, kijkt via de server of de ingevoerde gegevens bestaan/kloppen
        $scope.login = function () {
            var loginData = {
                username: $scope.loginData.username,
                password: $scope.loginData.password
            };
            $http.post("/login", loginData).
            success(function (data) {
                console.log("Succes! " + data);
                $scope.loggedIn = true;
                $scope.showHomeMessage = true;
                $scope.homeMessage = "You have been logged in (this is a placeholder)";
                $scope.isErrorMessage = false;
                usernameFactory = $scope.loginData.username;
                console.log("logged in user is: " + usernameFactory);
            }).
            error(function (data, status) {
                console.log("ERROR:", data, status);
                $scope.loginData.password = "";
                $scope.loginData.username = "";
                //$scope.showHomeMessage = true;
                //$scope.homeMessage = "Error: " + data;
                //$scope.isErrorMessage = true;
                $scope.loginerror = "Error: " + data;
                $timeout(function () {
                    $('#loginModal').modal('show')
                }, 800);

            });
        };

        //Gebruikt door het contactformulier
        $scope.sendMessage = function () {
            var messageData = {
                name: $scope.contact.name,
                email: $scope.contact.email,
                message: $scope.contact.message
            };
            $http.post("/contact", messageData).
            success(function (data) {
                console.log("Succes! " + data);
                $scope.loggedIn = true;
                $scope.showHomeMessage = true;
                $scope.homeMessage = "Message has been sent!";
                $scope.isErrorMessage = false;

                $scope.contact.name = "";
                $scope.contact.email = "";
                $scope.contact.message = "";
            }).
            error(function (data, status) {
                console.log("ERROR:", data, status);
                $scope.loginData.password = "";
                $scope.showHomeMessage = true;
                $scope.homeMessage = "Message failed to send";
                $scope.isErrorMessage = true;
            });
        };

        $scope.openLoginModal = function () {
            $(function () {
                $('#loginModal').modal('show');
                console.log(usernameFactory);

            })
        };

        $scope.openRegisterModal = function () {
            $(function () {
                $('#registerModal').modal('show')
            })
        };

        //Verbergt de balk die onder de navigatiebalk verschijnen kan
        $scope.hideMessage = function () {
            $scope.showHomeMessage = false;
        }
    }
);

theApp.controller('menuControl', ['$scope', '$location', function ($scope) {

    $scope.menuItems = [{
        Title: 'HOME',
        LinkText: '#intro',
        ID: 'home'
    }, {
        Title: 'ABOUT US',
        LinkText: '#aboutus',
        ID: 'about-us'
    }, {
        Title: 'GITHUB',
        LinkText: '#GitHub',
        ID: 'github'

    }, {
        Title: 'HELLO WORLD',
        LinkText: '#helloworld',
        ID: 'hello-world'
    }, {
        Title: 'CONTACT',
        LinkText: '#contact',
        ID: 'Contact'
    }, {
        Title: 'CODE GENERATOR',
        LinkText: '/#/codeGenerator',
        ID: 'code-generator'
    }, {
        Title: 'COMMUNITY CHAT',
        LinkText: '/#/chatPage',
        ID: 'community-chat'
    }];
}]);