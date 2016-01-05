theApp.controller('generatorController', function ($scope, $http, $location, $routeParams, FileSaver, Blob, LoginFactory) {
  var editor = ace.edit("editor");
  editor.setTheme("ace/theme/monokai");
  editor.getSession().setMode("ace/mode/yaml");
  editor.$blockScrolling = Infinity;

  var generated = ace.edit("generated");
  generated.setTheme("ace/theme/monokai");
  generated.getSession().setMode("ace/mode/json");
  generated.$blockScrolling = Infinity;

  $scope.loggedIn = LoginFactory.loggedIn;

  if($scope.loggedIn !== true) {
    $http.get("/getLoggedIn").
        success(function (data) {
          console.log(data);
          if (data === "Logged in") {
            LoginFactory.setLogin(true);
            $scope.loggedIn = true;
          } else if (data === "Not logged in") {
            LoginFactory.setLogin(false);
            $scope.loggedIn = false;
          }
        }).
        error(function (data, status) {
          console.log("Account error:", data, status);
        });
  }

  $scope.beschikbareCode = [];
  $scope.projectName = "My Project";

  $scope.error = null;

  $scope.homeMessage = "No message";
  $scope.showHomeMessage = false;
  $scope.isErrorMessage = false;

  $scope.client = {};
  $scope.server = {};
  $scope.info = {};

  if ($routeParams.id !== undefined) {
    //Request server en check de username van het project met de session username, stuur project met code terug als ze hetzelfde zijn
    editor.getSession().setValue("Trying to fetch the project!");
    $http.get("/projectTest/"+$routeParams.id).
        success(function (data) {
          console.log("Project succes!");
          $scope.setCode(data.code, data.name);

          $scope.showHomeMessage = true;
          $scope.homeMessage = "Your project has been loaded!";
          $scope.isErrorMessage = false;
        }).
        error(function (data, status) {
          console.log("Project error:", data, status);
          editor.getSession().setValue("No project found with this id and username combination.");
        });
  }
  
  $scope.saveInput = function(){
    //TODO Code uit generator opslaan, als account systeem er is bij het goede account opslaan=
    $(function () {
      $('#saveModal').modal('show');
    });
  };

  $scope.saveProject = function(askForConfirmation) {
    if($scope.projectName !== "") {
      var data = {
        code: editor.getSession().getValue(),
        projectName: $scope.projectName
      };


      if(askForConfirmation===false) {
        saveIt();
      } else {
        $http.post("/projectTest/checkName", data).
            success(function (data) {
              if (data === "Exists") {
                $(function () {
                  $('#saveConfirmation').modal('show');
                });
              } else {
                saveIt();
              }
            }).
            error(function (data, status) {
              console.log("ERROR:", data, status);
            });
      }

      function saveIt() {
        $http.post("/projectTest", data).
            success(function (data) {
              console.log("Succes! " + data);
              $scope.showHomeMessage = true;
              $scope.homeMessage = "Your project has been saved.";
              $scope.isErrorMessage = false;
            }).
            error(function (data, status) {
              console.log("ERROR:", data, status);
              $scope.showHomeMessage = true;
              $scope.homeMessage = "There was an error saving your project.";
              $scope.isErrorMessage = true;
            });
      }
    } else {
      $scope.showHomeMessage = true;
      $scope.homeMessage = "You didn't enter a project name.";
      $scope.isErrorMessage = true;
    }

  };
  $scope.hideMessage = function () {
    $scope.showHomeMessage = false;
  };

  //Test functie, moet later weg
  $scope.getDownload = function() {
        $http({
          url: '/downloadTest',
          method: "GET",
          headers: {
            'Content-type': 'application/zip'
          },
          responseType: 'arraybuffer'
        }).
        success(function (data) {
          var blob = new Blob([data], {type: "application/zip"});
          FileSaver.saveAs(blob, "Project.zip");
        }).
        error(function (data, status) {
          console.log("ERROR:", data, status);
        });
  };

  //Code van ID 4 opvragen voor test doeleinden
  $scope.getTest = function() {
    $http.get('/projectTest').
    success(function(data) {
          $scope.beschikbareCode = data;
          $(function () {
            $('#codeModal').modal('show');
          });
    }).
    error(function(data, status) {
      console.log("ERROR:", data, status);
          $scope.showHomeMessage = true;
          $scope.homeMessage = "Error retrieving projects.";
          $scope.isErrorMessage = true;
    })
  };

  $scope.setCode = function(code, name) {
    editor.getSession().setValue(code);
    $scope.projectName = name;
    $(function () {
      $('#codeModal').modal('hide');
    });
  };

  var generateServerCode = function(info){
    var description = 'Basic server made with ExpressJS';
    if(info.description != null || info.description != undefined){
        description = info.description;
    }
      return '//' + description + '\n' +
      'var express = require(\'express\');\n' +
      'var app = express();\n' +
      'var server = require(\'http\').createServer(app);\n' +
      'var io = require(\'socket.io\').listen(server);\n' +
      'var path = require(\'path\');\n\n' +
      'app.use(express.static(path.join(__dirname)));\n' +
      'server.listen(' + info.port + ');\n\n';
  };

  //Meerdere socketberichten = for-loop + 2 variablen(zie try)
  var generateServerSocket = function(messageArray){
    return '//This is the socket.io code for the server\n' +
      'io.on(\'connection\', function(socket){\n' +
      '  socket.emit(\'news\', {hello: \'world\'});\n' +
      '  socket.on(\'my other event\', function(data){\n' +
      '    console.log(data);\n' +
      '  });\n' +
      '});\n\n';
  };
  var generateClientSocket = function(messageArray){
    return '//This is the socket.io code for the client\n' +
      'var socket = io();\n' +
      'socket.on(\'news\', function(data){\n' +
      '  console.log(data);\n' +
      '  socket.emit(\'my other event\', {my: \'data\'});\n' +
      '});\n'
  };

   var errorHandling = function(input){
//     if(input.info.port == null || input.info.port == undefined){
//       throw new Error('Port is not specified in the Info');
//     }
//     if(typeof input.info.port != 'number' || input.info.port > 65535){
//       throw new Error('please put in a port number between 1 and 65535');
//     }
 };

var traverse = function(input){
  for (i in input) {
      if (typeof(input[i])=="object") {
          if(i == 'client'){
            $scope.client = input[i];
          }
          if(i == 'server'){
            $scope.server = input[i];
          }
          if(i == 'info'){
            $scope.info = input[i];
          }
          traverse(input[i] );
        }
    }
};



$scope.Generate = function () {
  try {
    var input = editor.getSession().getValue();
    var temp = [];
    var output = '';
    //var parser = PEG.buildParser("");
    input = jsyaml.safeLoad(input);
    input = JSON.stringify(input, null, 4);
    console.log(input);
    errorHandling(input);
    traverse(input);
    console.log(input);
    //temp.push(generateServerCode($scope.info));
    //temp.push(generateServerSocket(output));
    //temp.push(generateClientSocket(output));
    for(var i = 0; i < temp.length; i++){
      output += temp[i];
    }
    generated.setValue(input, 1);
    $scope.error = null;
    }
    catch
        (e) {
      console.log(e);
      scroll(0, 0);
      generated.setValue('', 1);
      $scope.error = e.message;
    }
  };
});
