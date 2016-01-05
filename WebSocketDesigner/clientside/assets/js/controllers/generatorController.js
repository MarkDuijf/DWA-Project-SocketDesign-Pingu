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
          //console.log(data);
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
    $http.get("/projects/"+$routeParams.id).
        success(function (data) {
          //console.log("Project succes!");
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
        $http.post("/projects/checkName", data).
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
        $http.post("/projects", data).
            success(function (data) {
              //console.log("Succes! " + data);
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
  $scope.getProjects = function() {
    $http.get('/projects').
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

//Parsing Functions
var parseMainScope = function(input){
  if(input.client == undefined){
    throw new Error('the \'client\' tag has not been defined in the scope.');
  }
  if(input.info == undefined){
    throw new Error('the \'info\' tag has not been defined in the main scope');
  }
  for(var mainScope = 0; mainScope < Object.keys(input).length; mainScope++){
    switch(Object.keys(input)[mainScope]){
      case "client":
        parseClient(input.client);
        break;
      case "server":
        parseServer(input.server);
        break;
      case "info":
        parseInfo(input.info);
        break;
      default:
        throw new Error('The \'' + Object.keys(input)[mainScope] + '\' tag does not exist in the main scope.');
    }
  }
}

var parseInfo = function(input){ 
  for(var infoScope = 0; infoScope < Object.keys(input).length; infoScope++){
    switch(Object.keys(input)[infoScope]){
      case "title":
        parseTitle(input.title);
        break;
      case "port":
        parsePort(input.port);
        break;
      default:
        throw new Error('the \'' + Object.keys(input)[infoScope] + '\' tag in \'info\' does not exist.');
    }
  }
}

var parseTitle = function(input){
  if(input.length <= 25){
    //TODO lengte is goed, return data?
  }
  else{
    throw new Error('the title length is ' + input.length + ', which is longer than the maximum of 25');
  }
}

var parsePort = function(input){
  if(typeof input == "number"){
    if(input <= 65535 && input >= 2000){
      //TODO type is number en is niet te hoog/laag
    }
    else{
      throw new Error('the chosen port, ' + input + ', is not usable. Please use a port between 2000 and 65535');
    }
  }
  else{
    throw new Error('The given port value is not a number. Please choose a value between 2000 and 655355');
  }
}

var parseClient = function(input){
  if(Object.keys(input).length > 10){
    throw new Error('The number of used tags in \'client\' exceeds the maximum of 10 tags.')
  }
  for(var clientScope = 0; clientScope < Object.keys(input).length; clientScope++){
    parseMessage(Object.keys(input)[clientScope]);
    if(Object.keys(input)[clientScope] !== "message" + (clientScope+1)){
      throw new Error('The \'' + Object.keys(input)[clientScope] + '\' tag, that is used in \'client\', is not usable at this point. Please use message' + (clientScope+1));
    }
  }
}

var parseServer = function(input){

}

var parseMessage = function(input){
}

var parseParameters = function(input){

}

var parseMessageName = function(input){

}

var parseData = function(input){

}

var parseDescription = function(input){

}

var parseServerResponse = function(input){

}

var parseDestination = function(input){

}

var parseClientName = function(input){

}

var parseRoomName = function(input){

}


$scope.Generate = function () {
  try {
    var input = editor.getSession().getValue();
    var temp = [];
    var output = '';
    input = jsyaml.safeLoad(input);
    parseMainScope(input);
    input = JSON.stringify(input, null, 4);
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
