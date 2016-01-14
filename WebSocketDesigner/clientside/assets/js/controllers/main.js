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
    object.setfirstName = function(name) {
        object.firstName = name;
    };
    return object;
});

theApp.controller('homeController', function ($scope, $http, $routeParams, $timeout, usernameFactory, FileSaver, LoginFactory) {
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
        $scope.loggedInUserfirstName = usernameFactory.firstName;
        $scope.homeMessage = "No message";
        $scope.showHomeMessage = false;
        $scope.isErrorMessage = false;

        //Used for activating an account, checks if the required data is in the URL and then executes the functions
        if ($routeParams.email !== undefined && $routeParams.confirmation !== undefined) {
            var confirmData = {
                email: $routeParams.email,
                confirmation: $routeParams.confirmation
            };

            $http.post("/confirm", confirmData).
            success(function (data) {
                //console.log("Confirmation succes! " + data);
                $scope.showHomeMessage = true;
                $scope.homeMessage = "Your account has been activated.";
                $scope.isErrorMessage = false;
            }).
            error(function (data, status) {
                //console.log("Confirmation error:", data, status);
                $scope.showHomeMessage = true;
                $scope.homeMessage = "Couldn't activate this account.";
                $scope.isErrorMessage = true;
            });
        }

        //Checks if the user is already logged in by looking if there is a session on the server
        if($scope.loggedIn !== true) {
            $http.get("/getLoggedIn").
            success(function (data) {
                console.log(data.loggedIn);
                    LoginFactory.setLogin(true);
                    usernameFactory.setUsername(data.username);
                    usernameFactory.setfirstName(data.firstName);
                    $scope.loggedInUser = data.username;
                    $scope.loggedInUserfirstName = data.firstName;
                    $scope.loggedIn = true;
            }).
            error(function (data, status) {
                console.log("Account error:", data, status);
                    LoginFactory.setLogin(false);
                    $scope.loggedIn = false;
            });
        }

        //Used to register an user with the entered data
        $scope.register = function () {
            var password = CryptoJS.MD5($scope.registerData.password);
            var registerData = {
                email: $scope.registerData.email,
                firstName: $scope.registerData.firstName,
                lastName: $scope.registerData.lastName,
                username: $scope.registerData.username,
                password: password.toString(CryptoJS.enc.Base64),
                confirmationLink: Math.random().toString(36).slice(2)
            };

            $http.post("/register", registerData).
            success(function (data) {
                //console.log("Succes! " + data);
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

        //Used to send the confirmation email
        $scope.sendConfirmationMail = function () {
            var password = CryptoJS.MD5($scope.registerData.password);
            var emailData = {
                email: $scope.registerData.email,
                firstName: $scope.registerData.firstName,
                lastName: $scope.registerData.lastName,
                username: $scope.registerData.username,
                password: password.toString(CryptoJS.enc.Base64)
            };

            $http.post("/email", emailData).
            success(function (data) {
                //console.log("Succes! " + data);
            }).
            error(function (data, status) {
                console.log("ERROR:", data, status);
                $scope.showHomeMessage = true;
                $scope.homeMessage = "Error: " + data;
                $scope.isErrorMessage = true;
            });
        };

        //Used to log in a user, checks via the server if the entered data exists or is correct
        $scope.login = function () {
            var password = CryptoJS.MD5($scope.loginData.password);
            var loginData = {
                username: $scope.loginData.username,
                password: password.toString(CryptoJS.enc.Base64)
            };
            $http.post("/login", loginData).
            success(function (data) {
                //console.log("Succes! " + data);
                $scope.loggedIn = true;
                //$scope.showHomeMessage = true;
                //$scope.homeMessage = "You have been logged in (this is a placeholder)";
                //$scope.isErrorMessage = false;
                usernameFactory.setUsername($scope.loginData.username);  // $scope.loginData.username;
                usernameFactory.setfirstName(data.firstName);
                $scope.loggedInUserfirstName = data.firstName;
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

        //Used for logging out a user
        $scope.logout = function() {
            $http.post("/logout").
                success(function (data) {
                    //console.log("Succes! " + data);
                }).
                error(function (data, status) {
                    console.log("ERROR:", data, status);
                });

            $scope.loggedIn = false;
            LoginFactory.loggedIn = false;
            $scope.loggedInUser = "";
            usernameFactory.userName = "";
            usernameFactory.firstName = "";
        };

        //Used for the contact form
        $scope.sendMessage = function () {
            var messageData = {
                name: $scope.contact.name,
                email: $scope.contact.email,
                message: $scope.contact.message
            };
            $http.post("/contact", messageData).
            success(function (data) {
                //console.log("Succes! " + data);
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

        //Opens the login modal
        $scope.openLoginModal = function () {
            $(function () {
                $('#loginModal').modal('show');
            })
        };

        //Opens the register modal
        $scope.openRegisterModal = function () {
            $(function () {
                $('#registerModal').modal('show')
            })
        };

        //Hides the message that appears beneath the navigation menu
        $scope.hideMessage = function () {
            $scope.showHomeMessage = false;
        }

        $scope.downloadDemo = function() {
            $http({
                url: '/downloadDemo',
                method: "GET",
                headers: {
                    'Content-type': 'application/zip'
                },
                responseType: 'arraybuffer'
            }).
                success(function (data) {
                    var blob = new Blob([data], {type: "application/zip"});
                    FileSaver.saveAs(blob, "demo.zip");
                }).
                error(function (data, status) {
                    console.log("ERROR:", data, status);
                });
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
    },
    //    {
    //    Title: 'COMMUNITY CHAT',
    //    LinkText: '/#/chatPage',
    //    ID: 'community-chat'
    //}
    ];
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

    //Refreshes the account data on the account page
    $scope.refreshAccount = function(){
        $http.get("/myAccount").
            success(function (data) {
                //console.log("Account succes!");
                userData = data;
                $scope.gotInfo = true;
                $scope.username = data.username;
                $scope.firstName = data.firstName;
                $scope.lastName = data.lastName;
                $scope.email = data.email;
                $scope.projects = data.projects;
                for(var i = 0; i < $scope.projects.length; i++) {
                    var date = new Date($scope.projects[i].date);
                    $scope.projects[i].date = date.toDateString();
                    if(date.getDate() < 10) {
                        if(date.getMonth() < 9) {
                            $scope.projects[i].date = "0" + date.getDate() + "-" + "0" + (date.getMonth() + 1) + "-" + date.getFullYear();
                        } else {
                            $scope.projects[i].date = "0" + date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
                        }
                    } else {
                        if(date.getMonth() < 9) {
                            $scope.projects[i].date = date.getDate() + "-" + "0" + (date.getMonth() + 1) + "-" + date.getFullYear();
                        } else {
                            $scope.projects[i].date = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
                        }
                    }
                }
            }).
            error(function (data, status) {
                console.log("Account error:", data, status);
                $location.path("/home");
            });
    };

    //Redirects the user if they aren't logged in
    if ($scope.loggedIn === false || $scope.loggedIn === undefined) {
        $location.path("/home");
    } else if ($scope.loggedIn === true) {
     $scope.refreshAccount();
    }

    //Opens a project
    $scope.openProject = function(id) {
        $location.path("/codeGenerator/"+id);
    };

    //Used when renaming a project
    $scope.renameProject = function(project){
        $scope.projectName = project.projectName;
        $scope.newName = project.projectName;
        $scope.nameChangeError = "";
        $(function () {
            $('#changeProjectNameModal').modal('show')
        })
    };

    //Renames a project when the user accepts
    $scope.confirmNameChange = function(){
        var data = {newProjectName: $scope.newName, oldProjectName: $scope.projectName};
        $http.post("/changeProjectName", data).
            success(function (data) {
                //console.log("Succes! " + data);
                $(function () {
                    $('#changeProjectNameModal').modal('hide')
                });
                $scope.refreshAccount();
            }).
            error(function (data, status) {
                console.log("ERROR:", data, status);
                $scope.nameChangeError = data;
            });
    };

    //Used to open the delete project modal
    $scope.deleteProject = function(project){
        $scope.project = project;
        $(function () {
            $('#deleteProjectModal').modal('show')
        })
    };

    //Deletes a project when the user accepts
    $scope.confirmDeleteProject = function(){
        var data = {project: $scope.project};
        $http.post("/deleteProject", data).
            success(function (data) {
                //console.log("Succes! " + data);
                $(function () {
                    $('#deleteProjectModal').modal('hide');
                });
                $scope.refreshAccount();
            }).
            error(function (data, status) {
                console.log("ERROR:", data, status);
                $scope.nameChangeError = 'Check the length of you projetname';
            });
    };

    //Opens the modal for confirming that a user wants to change their email
    $scope.emailConfirmation = function() {
        $(function () {
            $('#emailConfirmation').modal('show')
        })
    };

    //Changes the email of a user, they need to enter a confirmation code after
    $scope.changeEmail = function() {
        $scope.emailError = "";
        var data = {
            email: $scope.email,
            newEmail: $scope.newEmail,
            confirmation: Math.random().toString(36).slice(2)
        };
        $http.post("/changeEmail", data).
            success(function (data) {
                //console.log("Succes! " + data);
            }).
            error(function (data, status) {
                console.log("ERROR:", data, status);
            });

        $(function () {
            $('#changeEmailModal').modal('show')
        })
    };

    //Confirms the email change if a user enters the correct confirmation code
    $scope.confirmEmail = function() {
        $scope.emailError = "";
        var data = {
            email: $scope.email,
            newEmail: $scope.newEmail,
            confirmation: $scope.confirmationCode
        };
        $http.post("/confirmEmailChange", data).
            success(function (data) {
                //console.log("Succes! " + data);
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

    //Opens the modal that asks for user confirmation to change a password
    $scope.passwordConfirmation = function() {
        $(function () {
            $('#passwordConfirmation').modal('show')
        })
    };

    //Sends a confirmation code to the user's email, then opens the modal to change the password
    $scope.changePassword = function() {
        $scope.passwordError = "";
        var data = {
            email: $scope.email,
            confirmation: Math.random().toString(36).slice(2)
        };
        $http.post("/changePassword", data).
            success(function (data) {
                //console.log("Succes! " + data);
            }).
            error(function (data, status) {
                console.log("ERROR:", data, status);
            });

        $(function () {
            $('#changePasswordModal').modal('show')
        })
    };

    //Confirms the changing of the password when a user enters the confirmation code and their new password twice
    $scope.confirmPassword = function() {
        $scope.emailError = "";
        var password = CryptoJS.MD5($scope.newPassword);
        var passwordR = CryptoJS.MD5($scope.newPasswordR);
        var data = {
            newPass: password.toString(CryptoJS.enc.Base64),
            newPassR: passwordR.toString(CryptoJS.enc.Base64),
            confirmation: $scope.confirmationCodePassword
        };
        console.log(password.toString(CryptoJS.enc.Base64) + " " + passwordR.toString(CryptoJS.enc.Base64));
        $http.post("/confirmPasswordChange", data).
            success(function (data) {
                //console.log("Succes! " + data);
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