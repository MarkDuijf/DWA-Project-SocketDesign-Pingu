var theApp = angular.module("generatorApp", ['ngRoute', 'ngFileSaver']);

//Declaratie providers en hun controllers
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
        when('/codeGenerator/:id', {
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
        when('/myAccount', {
            templateUrl: 'partials/myAccount.html',
            controller: 'accountController'
        }).
        otherwise({
            redirectTo: '/home'
        });
    }]);

theApp.factory('LoginFactory', function($http) {
    var object = {};

    object.setLogin = function(bool) {
        object.loggedIn = bool;
    };

    return object;
});

theApp.factory('usernameFactory', function ($http) {
    var object = {};
    object.setUsername = function(userName) {
        object.userName = userName;
    };
    return object;
});

theApp.controller('homeController', function ($scope, $http, $routeParams, $timeout, usernameFactory, LoginFactory) {
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

        $scope.loggedIn = LoginFactory.loggedIn;
        $scope.loggedInUser = usernameFactory.userName;
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

        //Checkt of de user al ingelogd is door te kijken of er een sessie op de server is, voor het geval dat $scope.loggedIn zonder reden false is
        if($scope.loggedIn !== true) {
            $http.get("/getLoggedIn").
            success(function (data) {
                console.log(data.loggedIn);
                if (data.loggedIn === "Logged in") {
                    LoginFactory.setLogin(true);
                    usernameFactory.setUsername(data.username);
                    $scope.loggedInUser = data.username;
                    $scope.loggedIn = true;
                } else if (data.loggedIn === "Not logged in") {
                    LoginFactory.setLogin(false);
                    $scope.loggedIn = false;
                }
            }).
            error(function (data, status) {
                console.log("Account error:", data, status);
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
                usernameFactory.setUsername($scope.loginData.username);  // $scope.loginData.username;
                console.log("logged in user is: " + usernameFactory);
                $scope.loggedInUser = $scope.loginData.username;
                LoginFactory.setLogin(true);
            }).
            error(function (data, status) {
                console.log("ERROR:", data, status);
                $scope.loginData.password = "";
                $scope.loginData.username = "";
                $scope.loginerror = "Error: " + data;
                $timeout(function () {
                    $('#loginModal').modal('show')
                }, 800);

            });
        };

        $scope.logout = function() {
            $http.post("/logout").
            success(function (data) {
                console.log("Succes! " + data);
            }).
            error(function (data, status) {
                console.log("ERROR:", data, status);
            });

            $scope.loggedIn = false;
            LoginFactory.loggedIn = false;
            $scope.loggedInUser = "";
            usernameFactory.userName = "";
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
// genereerd vantevoren een aantal items voor in het menu en geeft daarbij ook de links en ID's.
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

theApp.controller('accountController', function ($scope, $http, $routeParams, $location, LoginFactory) {
    $scope.loggedIn = LoginFactory.loggedIn;
    $scope.userData = {};
    $scope.gotInfo = false;

    $scope.username = "";
    $scope.firstName = "";
    $scope.lastName = "";
    $scope.email = "";
    $scope.projects = [];

    $scope.newEmail = "";
    $scope.confirmationCode = "";
    $scope.emailError = "";

    $scope.passwordError = "";
    $scope.confirmationCodePassword = "";
    $scope.newPassword = "";
    $scope.newPasswordR = "";

    if ($scope.loggedIn === false || $scope.loggedIn === undefined) {
        $location.path("/home");
    } else if ($scope.loggedIn === true) {
        $http.get("/myAccount").
        success(function (data) {
            console.log("Account succes!");
            userData = data;
            $scope.gotInfo = true;
            $scope.username = data.username;
            $scope.firstName = data.firstName;
            $scope.lastName = data.lastName;
            $scope.email = data.email;
            $scope.projects = data.projects;
        }).
        error(function (data, status) {
            console.log("Account error:", data, status);
            $location.path("/home");
        });
    }

    $scope.openProject = function(id) {
        $location.path("/codeGenerator/"+id);
    };

    $scope.emailConfirmation = function() {
        $(function () {
            $('#emailConfirmation').modal('show')
        })
    };

    $scope.changeEmail = function() {
        $scope.emailError = "";
        var data = {
            email: $scope.email,
            newEmail: $scope.newEmail,
            confirmation: Math.random().toString(36).slice(2)
        };
        $http.post("/changeEmail", data).
        success(function (data) {
            console.log("Succes! " + data);
        }).
        error(function (data, status) {
            console.log("ERROR:", data, status);
        });

        $(function () {
            $('#changeEmailModal').modal('show')
        })
    };

    $scope.confirmEmail = function() {
        $scope.emailError = "";
        var data = {
            email: $scope.email,
            newEmail: $scope.newEmail,
            confirmation: $scope.confirmationCode
        };
        $http.post("/confirmEmailChange", data).
        success(function (data) {
            console.log("Succes! " + data);
            $scope.email = data;
            $scope.newEmail = "";
            $scope.confirmationCode = "";
            $(function () {
                $('#changeEmailModal').modal('hide')
            })
        }).
        error(function (data, status) {
            console.log("ERROR:", data, status);
            $scope.emailError = "Something went wrong, please check the email and confirmation code.";
        });

        $(function () {
            $('#changeEmailModal').modal('show')
        })
    };

    $scope.passwordConfirmation = function() {
        $(function () {
            $('#passwordConfirmation').modal('show')
        })
    };

    $scope.changePassword = function() {
        $scope.passwordError = "";
        var data = {
            email: $scope.email,
            confirmation: Math.random().toString(36).slice(2)
        };
        $http.post("/changePassword", data).
        success(function (data) {
            console.log("Succes! " + data);
        }).
        error(function (data, status) {
            console.log("ERROR:", data, status);
        });

        $(function () {
            $('#changePasswordModal').modal('show')
        })
    };

    $scope.confirmPassword = function() {
        $scope.emailError = "";
        var data = {
            newPass: $scope.newPassword,
            newPassR: $scope.newPasswordR,
            confirmation: $scope.confirmationCodePassword
        };
        $http.post("/confirmPasswordChange", data).
        success(function (data) {
            console.log("Succes! " + data);
            $scope.confirmationCodePassword = "";
            $(function () {
                $('#changePasswordModal').modal('hide')
            });
            $scope.loggedIn = false;
            LoginFactory.loggedIn = false;
            $location.path("/home");
        }).
        error(function (data, status) {
            console.log("ERROR:", data, status);
            $scope.passwordError = "Please check your password and confirmation code";
        });

        $(function () {
            $('#changePasswordModal').modal('show')
        })
    };
});