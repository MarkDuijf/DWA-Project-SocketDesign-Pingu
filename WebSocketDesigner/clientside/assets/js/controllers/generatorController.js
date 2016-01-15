theApp.controller('generatorController', function ($scope, $http, $location, $routeParams, FileSaver, Blob, LoginFactory) {
  var editor = ace.edit("editor");
  editor.setTheme("ace/theme/monokai");
  editor.getSession().setMode("ace/mode/yaml");
  editor.$blockScrolling = Infinity;
  //$scope.loggedIn = LoginFactory.loggedIn;
  $scope.loggedIn = true;
  $scope.clientCode = "";
  $scope.serverCode = "";

    //Checks when the page loads if the user has a session on the server
    if ($scope.loggedIn !== true) {
      $http.get("/getLoggedIn").
      success(function (data) {
            LoginFactory.setLogin(true);
            $scope.loggedIn = true;
          }).
      error(function (data, status) {
        console.log("Account error:", data, status);
            LoginFactory.setLogin(false);
            $scope.loggedIn = false;
      });
    }

    $scope.beschikbareCode = [];
    $scope.projectName = "My Project";

    $scope.homeMessage = "No message";
    $scope.showHomeMessage = false;
    $scope.isErrorMessage = false;

  $scope.codeTest = "";

    $scope.client = {};
    $scope.server = {};
    $scope.info = {};

    //Tries to open a project when there's an ID in the URL
    if ($routeParams.id !== undefined) {
        //Request server en check de username van het project met de session username, stuur project met code terug als ze hetzelfde zijn
        editor.getSession().setValue("Trying to fetch the project!");
        $http.get("/projects/" + $routeParams.id).
        success(function (data) {
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

  //When a user changes something in the code editor this will activate the validation warning when saving
  editor.on('input', function() {
    if($scope.validated) {
      $scope.validated = false;
      $scope.validateclass = "disabled";
      $scope.temperror = false;
    }
    $scope.$apply();
  });

      //Opens modal for saving the code
      $scope.saveInput = function () {
        $(function () {
          $('#saveModal').modal('show');
        });
      };

      //Saves the project
      $scope.saveProject = function (askForConfirmation) {
        if ($scope.projectName !== "") {
          var data = {
            code: editor.getSession().getValue(),
            projectName: $scope.projectName
          };


          if (askForConfirmation === false) {
            saveIt();
          } else {
            $http.post("/projects/checkName", data).
            success(function (data) {
              saveIt();
            }).
            error(function (data, status) {
              $(function () {
                $('#saveConfirmation').modal('show');
              });
              console.log("ERROR:", data, status);
            });
          }

          function saveIt() {
            $http.post("/projects", data).
            success(function (data) {
                    $scope.showHomeMessage = true;
                    $scope.homeMessage = "Your project has been saved.";
                    $scope.isErrorMessage = false;
                  }).
            error(function (data, status) {
              console.log("ERROR:", data, status);
              $scope.showHomeMessage = true;
              $scope.homeMessage = data;
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

    //Downloads the generated code
    $scope.getDownload = function () {
      $http({
        url: '/download',
        method: "GET",
        headers: {
          'Content-type': 'application/zip'
        },
        responseType: 'arraybuffer'
      }).
      success(function (data) {
        var blob = new Blob([data], {type: "application/zip"});
        FileSaver.saveAs(blob, $scope.projectName+".zip");
      }).
      error(function (data, status) {
        console.log("ERROR:", data, status);
      });
    };

    //Gets the projects from the database
    $scope.getProjects = function () {
      $http.get('/projects').
      success(function (data) {
        $scope.beschikbareCode = data;
        $(function () {
          $('#codeModal').modal('show');
        });
      }).
      error(function (data, status) {
        console.log("ERROR:", data, status);
        $scope.showHomeMessage = true;
        $scope.homeMessage = "Error retrieving projects.";
        $scope.isErrorMessage = true;
      })
    };
    $scope.validated = false;
    $scope.validateclass = "disabled";
    $scope.validatetext = "Er is geen error oid dus de download knop wordt enabled";
    $scope.temperror = false;

    $scope.validateCode = function() {
      try{
        var testing = [];
        testing.push({data: {}});
        var input = jsyaml.safeLoad(editor.getSession().getValue());
        parseMainScope(input, testing);
        
        //Server code
        var serverTemp = [];
        var serverCode = '';
        serverTemp.push(generateServerCode(testing[0].data.info));
        serverTemp.push(generateCodeServer(testing));
        for(var i = 0; i < serverTemp.length; i++){
          serverCode += serverTemp[i];
        }
        $scope.serverCode = serverCode;

        //Client code
        var clientTemp = [];
        var clientCode = '';
        $scope.clientCode = generateCodeClient(testing);
      }
      catch(e){
        $scope.temperror = true;
        $scope.validatetext = e.message;
        console.log(e);
      }

      if ($scope.temperror === true){
        $scope.validateclass = "disabled";
        $scope.validated = false;
      }
      else {
        var data = {
          name: $scope.projectName,
          clientCode: $scope.clientCode,
          serverCode: $scope.serverCode
        };
        $http.post("/download", data).
            success(function (data) {
              $scope.validated = true;
              $scope.validateclass = "";
              $scope.validatetext = "Er is geen error gevonden dus t is prima atm!"
            }).
            error(function (data, status) {
              console.log("ERROR:", data, status);
            });
      }
    };

    $scope.setCode = function (code, name) {
      editor.getSession().setValue(code);
      $scope.projectName = name;
      $(function () {
        $('#codeModal').modal('hide');
      });
    };

    //Used to generate server code.
    //input is used for the data which the user has given
    var generateServerCode = function(input){
      return '//' + input.title + '\n' +
      'var express = require(\'express\');\n' +
      'var app = express();\n' +
      'var server = require(\'http\').createServer(app);\n' +
      'var io = require(\'socket.io\').listen(server);\n' +
      'var path = require(\'path\');\n\n' +
      'app.use(express.static(path.join(__dirname)));\n' +
      'server.listen(' + input.port + ');\n\n' +
      'io.on(\'connection\', function(socket){\n\n';
    };

//used to generate the client side socket.io code
//input is used for the data which the user has given
//scope refers to whether the client or serverside is generated(on/emit) 
var generateClientSocketCode = function(input, scope){
  var returndata;
  if(scope == "client"){
  if(input.parameters.data == undefined && input.serverresponse == undefined){
    returndata = '//' + input.parameters.description + '\n'+
    'socket.emit(\'' + input.parameters.messagename + '\');\n\n';
  }
  else if(input.parameters.data == undefined && input.serverresponse !== undefined && input.serverresponse.parameters.data == undefined){
    returndata = '//' + input.parameters.description + '\n'+
    'socket.emit(\'' + input.parameters.messagename + '\');\n\n' +
    '//' + input.serverresponse.parameters.description + '\n' +
    'socket.on(\'' + input.serverresponse.parameters.messagename + '\', function(){\n    '+
      '//placeholder text\n});\n\n';
}
  else if(input.parameters.data == undefined && input.serverresponse !== undefined && input.serverresponse.parameters.data !== undefined){
        returndata = '//' + input.parameters.description + '\n'+
    'socket.emit(\'' + input.parameters.messagename + '\');\n\n' +
    '//' + input.serverresponse.parameters.description + '\n' +
    'socket.on(\'' + input.serverresponse.parameters.messagename + '\', function(data){\n    '+
      '//placeholder text\n});\n\n';
  }
else if(input.parameters.data !== undefined && input.serverresponse == undefined){
  returndata = '//' + input.parameters.description + '\n'+
  'socket.emit(\'' + input.parameters.messagename + '\', {data: \'' + input.parameters.data + '\'});\n\n';
}
else if(input.parameters.data !== undefined && input.serverresponse !== undefined && input.serverresponse.parameters.data == undefined){
  returndata = '//' + input.parameters.description + '\n'+
  'socket.emit(\'' + input.parameters.messagename + '\', {data: \'' + input.parameters.data + '\'});\n\n' +
  '//' + input.serverresponse.parameters.description + '\n' +
  'socket.on(\'' + input.serverresponse.parameters.messagename + '\', function(){\n    '+
    '//placeholder text\n});\n\n';
}
else if(input.parameters.data !== undefined && input.serverresponse !== undefined && input.serverresponse.parameters.data !== undefined){
  returndata = '//' + input.parameters.description + '\n'+
  'socket.emit(\'' + input.parameters.messagename + '\', {data: \'' + input.parameters.data + '\'});\n\n' +
  '//' + input.serverresponse.parameters.description + '\n' +
  'socket.on(\'' + input.serverresponse.parameters.messagename + '\', function(data){\n    '+
    '//placeholder text\n});\n\n';
}
else{
  returndata = '\n';
} 
}
if(scope == "server"){
  if(input.parameters.data == undefined){
    returndata = '//' + input.parameters.description + '\n' +
    'socket.on(\'' + input.parameters.messagename + '\', function(){\n    ' +
    '//placeholder text\n});\n\n';
  }
  else if(input.parameters.data !== undefined){
    returndata = '//' + input.parameters.description + '\n' +
    'socket.on(\'' + input.parameters.messagename + '\', function(data){\n    ' +
    '//placeholder text\n});\n\n';    
  }
  else{
  returndata = '\n';
} 
}
return returndata;
}

//used to generate the server side socket.io code
//input is used for the data which the user has given
//scope refers to whether the client or serverside is generated(on/emit) 
var generateServerSocketCode = function(input, scope){
  var returndata;
  if(input.serverresponse !== undefined){
    if(input.parameters.data !== undefined && input.serverresponse.parameters.data !== undefined && input.serverresponse.clientname !== undefined && input.serverresponse.roomname == undefined){
      returndata = '//' + input.serverresponse.parameters.description + '\n' +
      'socket.on(\'' + input.parameters.messagename + '\', function(data){\n    ' +
        'io.to(\''+ input.serverresponse.clientname +'\').emit(\'' + input.serverresponse.parameters.messagename + '\', {data: \'' + input.serverresponse.parameters.data + '\'});\n});\n\n';
}
else if(input.parameters.data !== undefined && input.serverresponse.parameters.data !== undefined && input.serverresponse.clientname == undefined && input.serverresponse.roomname == undefined){
  returndata = '//' + input.serverresponse.parameters.description + '\n' +
  'socket.on(\'' + input.parameters.messagename + '\', function(data){\n    ' +
    'io.emit(\'' + input.serverresponse.parameters.messagename + '\', {data: \'' + input.serverresponse.parameters.data + '\'});\n});\n\n';
}
else if(input.parameters.data !== undefined && input.serverresponse.parameters.data !== undefined && input.serverresponse.clientname == undefined && input.serverresponse.roomname !== undefined){
  returndata = '//' + input.serverresponse.parameters.description + '\n' +
  'socket.on(\'' + input.parameters.messagename + '\', function(data){\n    ' +
    'io.to(\''+input.serverresponse.roomname+'\').emit(\'' + input.serverresponse.parameters.messagename + '\', {data: \'' + input.serverresponse.parameters.data + '\'});\n});\n\n';
    }
else if(input.parameters.data !== undefined && input.serverresponse.parameters.data == undefined && input.serverresponse.clientname !== undefined && input.serverresponse.roomname == undefined){
  returndata = '//' + input.serverresponse.parameters.description + '\n' +
  'socket.on(\'' + input.parameters.messagename + '\', function(data){\n    ' +
    'io.to(\''+ input.serverresponse.clientname +'\').emit(\'' + input.serverresponse.parameters.messagename + '\');\n});\n\n';
  }
  else if(input.parameters.data !== undefined && input.serverresponse.parameters.data == undefined && input.serverresponse.clientname == undefined && input.serverresponse.roomname == undefined){
    returndata = '//' + input.serverresponse.parameters.description + '\n' +
    'socket.on(\'' + input.parameters.messagename + '\', function(data){\n    ' +
      'io.emit(\'' + input.serverresponse.parameters.messagename + '\');\n});\n\n';
    }

  else if(input.parameters.data !== undefined && input.serverresponse.parameters.data == undefined && input.serverresponse.clientname == undefined && input.serverresponse.roomname !== undefined){
    returndata = '//' + input.serverresponse.parameters.description + '\n' +
    'socket.on(\'' + input.parameters.messagename + '\', function(data){\n    ' +
      'io.to(\''+input.serverresponse.roomname+'\').emit(\'' + input.serverresponse.parameters.messagename + '\');\n});\n\n';
    }
    else if(input.parameters.data !== undefined && input.serverresponse.parameters.data == undefined && input.serverresponse.clientname !== undefined && input.serverresponse.roomname == undefined){
  returndata = '//' + input.serverresponse.parameters.description + '\n' +
  'socket.on(\'' + input.parameters.messagename + '\', function(data){\n    ' +
    'io.to(\''+ input.serverresponse.clientname +'\').emit(\'' + input.serverresponse.parameters.messagename + '\');\n});\n\n';
  }
    else if(input.parameters.data == undefined && input.serverresponse.parameters.data !== undefined && input.serverresponse.clientname !== undefined && input.serverresponse.roomname == undefined){
      returndata = '//' + input.serverresponse.parameters.description + '\n' +
      'socket.on(\'' + input.parameters.messagename + '\', function(){\n    ' +
        'io.to(\''+input.serverresponse.clientname+'\').emit(\'' + input.serverresponse.parameters.messagename + '\', {data: \'' + input.serverresponse.parameters.data + '\'});\n});\n\n';
      }

    else if(input.parameters.data == undefined && input.serverresponse.parameters.data !== undefined && input.serverresponse.clientname == undefined && input.serverresponse.roomname == undefined){
      returndata = '//' + input.serverresponse.parameters.description + '\n' +
      'socket.on(\'' + input.parameters.messagename + '\', function(){\n    ' +
        'io.emit(\'' + input.serverresponse.parameters.messagename + '\', {data: \'' + input.serverresponse.parameters.data + '\'});\n});\n\n';
      }
      else if(input.parameters.data == undefined && input.serverresponse.parameters.data !== undefined && input.serverresponse.clientname == undefined && input.serverresponse.roomname !== undefined){
      returndata = '//' + input.serverresponse.parameters.description + '\n' +
      'socket.on(\'' + input.parameters.messagename + '\', function(){\n    ' +
        'io.to(\''+input.serverresponse.roomname+'\').emit(\'' + input.serverresponse.parameters.messagename + '\', {data: \'' + input.serverresponse.parameters.data + '\'});\n});\n\n';
      }
      else if(input.parameters.data == undefined && input.serverresponse.parameters.data !== undefined && input.serverresponse.clientname == undefined && input.serverresponse.roomname == undefined){
      returndata = '//' + input.serverresponse.parameters.description + '\n' +  
        'socket.on(\'' + input.parameters.messagename + '\', function(){\n    ' +
          'io.emit(\'' + input.serverresponse.parameters.messagename + '\', {data: \'' + input.serverresponse.parameters.data + '\'});\n});\n\n';
        }
        else if(input.parameters.data == undefined && input.serverresponse.parameters.data == undefined && input.serverresponse.clientname !== undefined && input.serverresponse.roomname == undefined){
          returndata = '//' + input.serverresponse.parameters.description + '\n' +  
          'socket.on(\'' + input.parameters.messagename + '\', function(){\n    ' +
            'io.to(\''+input.serverresponse.clientname+'\').emit(\'' + input.serverresponse.parameters.messagename + '\');\n});\n\n';
          }
        else if(input.parameters.data == undefined && input.serverresponse.parameters.data == undefined && input.serverresponse.clientname == undefined && input.serverresponse.roomname !== undefined){
          returndata = '//' + input.serverresponse.parameters.description + '\n' +  
          'socket.on(\'' + input.parameters.messagename + '\', function(){\n    ' +
            'io.to(\''+input.serverresponse.roomname+'\').emit(\'' + input.serverresponse.parameters.messagename + '\');\n});\n\n';
          }
          else if(input.parameters.data == undefined && input.serverresponse.parameters.data == undefined && input.serverresponse.clientname == undefined && input.serverresponse.roomname == undefined){
            returndata = '//' + input.serverresponse.parameters.description + '\n' +  
            'socket.on(\'' + input.parameters.messagename + '\', function(){\n    ' +
              'io.emit(\'' + input.serverresponse.parameters.messagename + '\');\n});\n\n';
            }
          }
          else if(input.serverresponse == undefined && scope !== 'server'){
            if(input.parameters.data == undefined){
              returndata = '//' + input.parameters.description + '\n'+
              'io.on(\'' + input.parameters.messagename + '\');\n\n';
            }
            else if(input.parameters.data !== undefined){
              returndata = '//' + input.parameters.description + '\n'+
              'io.on(\'' + input.parameters.messagename + '\', {data: \'' + input.parameters.data + '\'});\n\n';
            }
          }
          else if(input.serverresponse == undefined && scope == 'server'){
            if(input.parameters.data == undefined){
              returndata = '//' + data.parameters.description + '\n' +
              'io.emit(\''+input.parameters.messagename + '\');\n\n';
            }
            else if(input.parameters.data !== undefined){
              returndata = '//' + input.parameters.description + '\n' +
              'io.emit(\'' + input.parameters.messagename + '\', {data: \'' + input.parameters.data + '\'});\n\n';
            }
          }
          return returndata;
        }

//Parsing Functions
var parseMainScope = function (input, tempData) {
  tempData[0].data.usedMessageNames = [];
  if (input.client == undefined) {
    throw new Error('the \'client\' tag has not been defined in the scope.');
  }
  if (input.info == undefined) {
    throw new Error('the \'info\' tag has not been defined in the main scope');
  }
  if (input.server == undefined) {
    tempData[0].data.server = false;
  }
  for (var mainScope = 0; mainScope < Object.keys(input).length; mainScope++) {
    switch (Object.keys(input)[mainScope]) {
      case "client":
      tempData[0].data.client = {};
      parseClient(input.client, tempData);
      break;
      case "server":
      tempData[0].data.server = {};
      parseServer(input.server, tempData);
      break;
      case "info":
      tempData[0].data.info = {};
      parseInfo(input.info, tempData);
      break;
      default:
      throw new Error('The \'' + Object.keys(input)[mainScope] + '\' tag does not exist in the main scope.');
    }
  }
}
//parser for the info tag
//input is the user data, tempData is an array to save the data in
var parseInfo = function (input, tempData) {
  var temptags = [];
  for (var infoScope = 0; infoScope < Object.keys(input).length; infoScope++) {
    temptags.push(Object.keys(input)[infoScope]);
    switch (Object.keys(input)[infoScope]) {
      case "title":
      parseTitle(input.title, tempData);
      break;
      case "port":
      parsePort(input.port, tempData);
      break;
      default:
      throw new Error('the \'' + Object.keys(input)[infoScope] + '\' tag in \'info\' does not exist.');
    }
  }
  if(temptags.indexOf('title') == -1){
    parseTitle(null);
  }
  if(temptags.indexOf('port') == -1){
    throw new Error('The \'port\' tag in \'info\' has not been defined. Please refer to the userguide for more information.');
  }
}

//parser for the title tag in info
//input is the user data, tempData is an array to save the data in
var parseTitle = function (input, tempData) {
  if (input == null) {
    tempData[0].data.info.title = 'Basic server made with ExpressJS';
  }
  else if (input.length <= 50) {
    tempData[0].data.info.title = input;
  }
  else {
    throw new Error('the title length is ' + input.length + ', which is longer than the maximum of 50');
  }
}

//parser for the port tag in info
//input is the user data, tempData is an array to save the data in
var parsePort = function(input, tempData){
  if(typeof input == "number"){
    if(input <= 65535 && input >= 2000){
      tempData[0].data.info.port = input;
    }
    else{
      throw new Error('the chosen port, ' + input + ', is not usable. Please use a port between 2000 and 65535');
    }
  }
  else{
    throw new Error('The given port value is not a number. Please choose a value between 2000 and 65535');
  }
}

//parser for the client tag
//input is the user data, tempData is an array to save the data in
var parseClient = function (input, tempData) {
  if (Object.keys(input).length > 10) {
    throw new Error('The number of used tags in \'client\' exceeds the maximum of 10 tags.');
  }
  for (var clientScope = 0; clientScope < Object.keys(input).length; clientScope++) {
    tempData[0].data.client['message' + (clientScope + 1)] = {};
    parseMessage(input[Object.keys(input)[clientScope]], 'client', (clientScope + 1), tempData);
    if (Object.keys(input)[clientScope] !== "message" + (clientScope + 1)) {
      throw new Error('The \'' + Object.keys(input)[clientScope] + '\' tag, that is used in \'client\', is not usable at this point. Please use message\'' + (clientScope + 1) + '\'');
    }
  }
}
//parser for the server tag
//input is the user data, tempData is an array to save the data in
var parseServer = function (input, tempData) {
  if (Object.keys(input).length > 10) {
    throw new Error('The number of used tags in \'server\' exceeds the maximum of 10 tags.');
  }
  for (var serverScope = 0; serverScope < Object.keys(input).length; serverScope++) {
    tempData[0].data.server['message' + (serverScope + 1)] = {};
    parseMessage(input[Object.keys(input)[serverScope]], 'server', (serverScope + 1), tempData);
    if (Object.keys(input)[serverScope] !== "message" + (serverScope + 1)) {
      throw new Error('The \'' + Object.keys(input)[serverScope] + '\' tag, that is used in \'server\', is not usable at this point. Please use \'message' + (serverScope + 1) + '\'.');
    }
  }
}

//parser for the message tag
//input is the user data, tempData is an array to save the data in, scope is either client or server(determines path) and number is the message number
var parseMessage = function(input, scope, number, tempData){
  var tempTags = [];
  for(var messageScope = 0; messageScope < Object.keys(input).length; messageScope++){
    tempTags.push(Object.keys(input)[messageScope]);
    switch(Object.keys(input)[messageScope]){
      case "parameters":
      if(input.parameters == null){
        throw new Error('The \'parameters\' tag used in \'' + scope + '/message' + number + '\' is empty. Please refer to the userguide for more information.');
      }
      tempData[0].data[scope]['message' + number].parameters = {};
      parseParameters(input.parameters, scope, number, false, tempData);
      break;
      case "serverresponse":
      if(scope == "server"){
        throw new Error('The \'serverresponse\' tag is not usable in \'server\'. Please remove this tag.');
      }
      else{ 
        if(input.serverresponse == null){
          throw new Error('The \'serverresponse\' tag used in \'' + scope + '/message' + number + '\' is empty. Please refer to the userguide for more information.')
        }
        tempData[0].data.client['message' + number].serverresponse = {};
        parseServerResponse(input.serverresponse, scope, number, tempData);
      }
      break;
      default: 
      if(scope == "server"){
        throw new Error('The \'' + Object.keys(input)[messageScope] + '\' tag, which is used in \''+scope+'\', is not usable at this point. Please use \'parameters\'.');
      }   
      else{
        throw new Error('The \'' + Object.keys(input)[messageScope] + '\' tag, which is used in \''+scope+'\', is not usable at this point. Please use \'parameters\' or \'serverresponse\'.');
      }
    }
  }
  if(tempTags.indexOf('parameters') == -1){
    throw new Error('The tag \'parameters\' is not used in \'' + scope + '/message' + number + '\'.');
  }
}


//parser for the parameter tag
//input is the user data, tempData is an array to save the data in, scope is either client or server(determines path)
//number is the message number, serverresponse determines whether the function is called from a serverresponse or not
var parseParameters = function(input, scope, number, serverresponse, tempData){
  var temptags = [];
  if(serverresponse == false){
    tempData[0].data[scope]['message'+number].parameters = {};
  }
  if(input == null){
    throw new Error('The used \'parameter\' tag in \'' + scope + '/message' + number + '\' is empty. Please refer to the guidebook for more information.')
  }
  for(var parameterScope = 0; parameterScope < Object.keys(input).length; parameterScope++){
    temptags.push(Object.keys(input)[parameterScope]);
    switch(Object.keys(input)[parameterScope]){
      case "messagename":
      parseMessageName(input.messagename, scope, number, serverresponse, tempData);
      break;
      case "data":
      parseData(input.data, scope, number, serverresponse, tempData);
      break;
      case "description":
      parseDescription(input.description, scope, number, serverresponse, tempData);
      break;
      default: throw new Error('The \''+Object.keys(input)[parameterScope]+ '\' tag, which is used in \'' + scope + '/message' + number + '\', is not usable at this point. Please refer to the userguide for more information.');
    }
  }
  if(temptags.indexOf('description') == -1){
    parseDescription(null, scope, number, serverresponse);
  }
  if(temptags.indexOf('messagename') == -1){
    parseMessageName(null, scope, number, serverresponse);
  }
}


//parser for the messagename tag
//input is the user data, tempData is an array to save the data in, scope is either client or server(determines path)
//number is the message number, serverresponse determines whether the function is called from a serverresponse or not
var parseMessageName = function (input, scope, number, serverresponse, tempData) {
  if(tempData[0].data.usedMessageNames.indexOf(input) !== -1 && serverresponse == false){
    throw new Error('The given name for the \'messagename\' used in \''+ scope + '/message' + number + '/parameters\' already exists. Please use a different name.');
  }
  else if(tempData[0].data.usedMessageNames.indexOf(input) !== -1 && serverresponse !== false){
    throw new Error('The given name for the \'messagename\' used in \''+ scope + '/message' + number + '/serverresponse/parameters\' already exists. Please use a different name.');
  }
  else{
  tempData[0].data.usedMessageNames.push(input);
}
  if (input == null && serverresponse == false) {
    input = 'message' + number;
    tempData[0].data[scope]['message' + number].parameters.messagename = input;
    alert('There was no name assigned to \'' + scope + '/message' + number + '\', the used name will be set to \'' + input + '\'.')
  }
  else if (input == null && serverresponse == true) {
    input = 'message' + number;
    tempData[0].data[scope]['message' + number].serverresponse.parameters.messagename = input;
    alert('There was no name assigned to \'' + scope + '/message' + number + '/serverresponse/parameters/messagename\', so the used name will be set to \'' + input + '\'. It is highly recommended to give it the same name as \'' + scope + '/message' + number + '/parameters/messagename\'.')
  }
  else if (input.length > 25) {
    throw new Error('The messageName used in \'' + scope + '/message' + number + '\' is ' + input.length + ' characters long, which exceeds the maximum of 25 characters.');
  }

  if (serverresponse == true && input !== null) {
    tempData[0].data.client['message' + number].serverresponse.parameters.messagename = input;
  }
  else if (serverresponse == false && input !== null) {
    tempData[0].data[scope]['message' + number].parameters.messagename = input;
  }

}


//parser for the data tag
//input is the user data, tempData is an array to save the data in, scope is either client or server(determines path)
//number is the message number, serverresponse determines whether the function is called from a serverresponse or not
var parseData = function (input, scope, number, serverresponse, tempData) {
  if (input !== null) {
    if (serverresponse == true) {
      tempData[0].data[scope]['message' + number].serverresponse.parameters.data = input;
    }
    else {
      tempData[0].data[scope]['message' + number].parameters.data = input;
    }
  }
}


//parser for the description tag
//input is the user data, tempData is an array to save the data in, scope is either client or server(determines path)
//number is the message number, serverresponse determines whether the function is called from a serverresponse or not
var parseDescription = function (input, scope, number, serverresponse, tempData) {
  var description = 'Description of ' + scope + '/message' + number;
  if (input !== null) {
    if (serverresponse == true) {
      tempData[0].data[scope]['message' + number].serverresponse.parameters.description = input;
    }
    else {
      tempData[0].data[scope]['message' + number].parameters.description = input;
    }
  }
  else {
    if (serverresponse == true) {
      tempData[0].data[scope]['message' + number].serverresponse.parameters.description = description;
    }
    else {
      tempData[0].data[scope]['message' + number].parameters.description = description;
    }
  }
}


//parser for the serverresponse tag
//input is the user data, tempData is an array to save the data in, scope is either client or server(determines path)
//number is the message number
var parseServerResponse = function(input, scope, number, tempData){
  var tempTags = [];
  var tempTo = '';

  if(input == null){
    throw new Error('The used \'serverresponse\' tag in \'' + scope + '/message' + number + '/serverresponse\' is empty. Please refer to the userguide for more information.');
  }
  for(var serverRScope = 0; serverRScope < Object.keys(input).length; serverRScope++){
    tempTags.push(Object.keys(input)[serverRScope]);
    if(Object.keys(input)[serverRScope] !== "to" && serverRScope == 0){
      throw new Error('The first used tag in \''+scope + '/message'+ number + '/serverresponse' + '\' should be \'to\', instead of \''+ Object.keys(input)[serverRScope] + '\'.');
    }
    switch(Object.keys(input)[serverRScope]){
      case "to":
      tempTo = input.to;
      parseDestination(input.to, scope, number, tempData);
      break;
      case "clientname":
      parseClientName(input.clientname, tempTo, scope, number, tempData);
      break;
      case "roomname":
      parseRoomName(input.roomname, tempTo, scope, number, tempData);
      break;
      case "parameters":
      tempData[0].data[scope]['message'+number].serverresponse.parameters = {};
      parseParameters(input.parameters, scope, number, true, tempData);
      break;
      default: throw new Error('The \''+Object.keys(input)[serverRScope]+'\' tag, which is used in \''+ scope+'/message'+ number + '/serverresponse\', is not usable here. Please refer to the userguide for more information.');
    }
  }
  if(tempTags.indexOf('parameters') == -1){
    throw new Error('The tag \'parameters\' is not used in \'' + scope + '/message' + number + '/serverresponse\'.');
  }
  if(tempTags.indexOf('clientname') == -1 && tempTo !== 'all' && tempTo !== 'room'){
    throw new Error('The used \'to\' tag in \'' + scope + '/message' + number + '/serverresponse\' requires you to use \'clientname\'. Please refer to the guidebook for more information,');
  }
  if(tempTags.indexOf('roomname') == -1 && tempTo == 'room'){
    throw new Error('The used \'to\' tag in \'' + scope + '/message' + number + '/serverresponse\' requires you to use \'roomname\'. Please refer to the guidebook for more information.');
  }
}


//parser for the destination(to) tag
//input is the user data, tempData is an array to save the data in, scope is either client or server(determines path)
//number is the message number
var parseDestination = function (input, scope, number, tempData) {
  if (input == "all") {
    tempData[0].data[scope]['message' + number].serverresponse.to = input;
  }
  else if (input == "client") {
    tempData[0].data[scope]['message' + number].serverresponse.to = input;
  }
  else if(input == "room"){
    tempData[0].data[scope]['message' + number].serverresponse.to = input;
  }
  else {
    throw new Error('The given value for \'to\' in \'' + scope + '/message' + number + '/serverresponse' + '\' is not usable here. Please refer to the userguide for more information.');
  }
}


//parser for the clientname tag
//input is the user data, tempData is an array to save the data in, scope is either client or server(determines path)
//number is the message number, to is used to check where the message gets send
var parseClientName = function (input, to, scope, number, tempData) {
  if (to == "all") {
    throw new Error('The \'clientname\' tag can not be used here since the \'to\' tag in \'' + scope + '/message' + number + '/serverresponse' + '\' has been set to \'' + to + '\'.');
  }
  if (input == "all") {
    throw new Error('The used name \'all\' in \'' + scope + '/message' + number + '/serverresponse/clientname' + '\' is not usable. Please refer to the userguide for more information.');
  }
  else {
    tempData[0].data[scope]['message' + number].serverresponse.clientname = input;
  }
}


//parser for the roomname tag
//input is the user data, tempData is an array to save the data in, scope is either client or server(determines path)
//number is the message number, to is used to check where the message gets send
var parseRoomName = function(input, to, scope, number, tempData){
  if(input == "all"){
    throw new Error('The used roomname \'' + input + '\' in \'' + scope + '/message' + number + '/serverresponse\' is not a valid room name. Please use a different name');
  }
  else{
    tempData[0].data[scope]['message'+number].serverresponse.roomname = input;
  }
}

//Function where the generate functions(clientside) are called(used to group the client socket code)
var generateCodeClient = function(tempData){
  var temp = [];
  var output = '';
  for(var client = 1; client < Object.keys(tempData[0].data.client).length+1; client++)
  {
    temp.push(generateClientSocketCode(tempData[0].data.client['message'+client], 'client'));
  }
  if(tempData[0].data.server !== false){
  for(var server = 1; server < Object.keys(tempData[0].data.server).length+1; server++)
  {
    temp.push(generateClientSocketCode(tempData[0].data.server['message'+server], 'server'));
  }
}
  for(var x = 0; x < temp.length; x++){
    output += temp[x];
  }
  return output;
}

//Function where the generate functions(serverside) are called(used to group the server socket code together)
var generateCodeServer = function(tempData){
  var temp = [];
  var output = '';
  for(var client = 1; client < Object.keys(tempData[0].data.client).length+1; client++){
    temp.push(generateServerSocketCode(tempData[0].data.client['message'+client], 'client'));
  }
  if(tempData[0].data.server !== false){
  for(var server = 1; server < Object.keys(tempData[0].data.server).length+1; server++){
    temp.push(generateServerSocketCode(tempData[0].data.server['message'+server], 'server'));
  }
}
  for(var x = 0; x < temp.length; x++){
    output += temp[x];
  }
  output += '});';
  return output
}
});
