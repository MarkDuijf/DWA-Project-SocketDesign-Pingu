theApp.controller('generatorController', function ($scope, $http, $location, $routeParams, FileSaver, Blob, LoginFactory) {
  var editor = ace.edit("editor");
  editor.setTheme("ace/theme/monokai");
  editor.getSession().setMode("ace/mode/yaml");
  editor.$blockScrolling = Infinity;

  //var generated = ace.edit("generated");
  //generated.setTheme("ace/theme/monokai");
  //generated.getSession().setMode("ace/mode/javascript");
  //generated.$blockScrolling = Infinity;

  //TODO uitcommenten
  //$scope.loggedIn = LoginFactory.loggedIn;
  $scope.loggedIn = true;

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

  var generateServerCode = function(input){
      return '//' + input.title + '\n' +
      'var express = require(\'express\');\n' +
      'var app = express();\n' +
      'var server = require(\'http\').createServer(app);\n' +
      'var io = require(\'socket.io\').listen(server);\n' +
      'var path = require(\'path\');\n\n' +
      'app.use(express.static(path.join(__dirname)));\n' +
      'server.listen(' + input.port + ');\n\n//client sockets\n\n' +
      'io.on(\'connection\', function(socket){';
  };

  var closeServerCode = function(){
    return '});';
  }

  var generateClientSocketCode = function(input){
    var retundata;
    if(input.parameters.data == undefined && input.serverResponse == undefined){
      returndata = '//' + input.parameters.description + '\n'+
      'io.emit(\'' + input.parameters.messagename + '\');\n\n';
    }
    else if(input.parameters.data == undefined && input.serverResponse !== undefined){
      returndata = '//' + input.parameters.description + '\n'+
      'io.emit(\'' + input.parameters.messagename + '\');\n\n' +
      '//' + input.serverResponse.parameters.description + '\n' +
      'io.on(\'' + input.serverResponse.parameters.messagename + '\', function(){\n    '+
      '//placeholder text\n});\n\n';
    }
    else if(input.parameters.data !== undefined && input.serverResponse == undefined){
        returndata = '//' + input.parameters.description + '\n'+
        'io.emit(\'' + input.parameters.messagename + '\', {data: \'' + input.parameters.data + '\'});\n\n';
      }
    else{
      returndata = '//' + input.parameters.description + '\n'+
      'io.emit(\'' + input.parameters.messagename + '\');\n\n' +
      '//' + input.serverResponse.parameters.description + '\n' +
      'io.on(\'' + input.serverResponse.parameters.messagename + '\', function(data){\n    '+
      '//placeholder text\n});\n\n';
    }
    return returndata;
  }

  var generateServerSocketCode = function(input, scope){
    var returndata;
    if(input.serverResponse !== undefined){
      if(input.parameters.data !== undefined && input.serverResponse.parameters.data !== undefined && input.serverResponse.clientname !== undefined){
      returndata = '//' + input.serverResponse.parameters.description + '\n' +
      'io.on(\'' + input.parameters.messagename + '\', function(data){\n    ' +
      'io.to('+ input.serverResponse.clientname +').emit(\'' + input.serverResponse.parameters.messagename + '\', {data: \'' + input.serverResponse.parameters.data + '\'});\n});\n\n';
    }
    else if(input.parameters.data !== undefined && input.serverResponse.parameters.data !== undefined && input.serverResponse.clientname == undefined){
      returndata = '//' + input.serverResponse.parameters.description + '\n' +
      'io.on(\'' + input.parameters.messagename + '\', function(data){\n    ' +
      'io.broadcast.emit(\'' + input.serverResponse.parameters.messagename + '\', {data: \'' + input.serverResponse.parameters.data + '\'});\n});\n\n';
    }
    else if(input.parameters.data !== undefined && input.serverResponse.parameters.data == undefined && input.serverResponse.clientname !== undefined){
      returndata = '//' + input.serverResponse.parameters.description + '\n' +
      'io.on(\'' + input.parameters.messagename + '\', function(data){\n    ' +
      'io.to('+ input.serverResponse.clientname +').emit(\'' + input.serverResponse.parameters.messagename + '\'});\n\n';
      
    }
    else if(input.parameters.data !== undefined && input.serverResponse.parameters.data == undefined && input.serverResponse.clientname == undefined){
      returndata = '//' + input.serverResponse.parameters.description + '\n' +
      'io.on(\'' + input.parameters.messagename + '\', function(data){\n    ' +
      'io.broadcast.emit(\'' + input.serverResponse.parameters.messagename + '\'});\n\n';
    }
    else if(input.parameters.data == undefined && input.serverResponse.parameters.data !== undefined && input.serverResponse.clientname !== undefined){
      returndata = '//' + input.serverResponse.parameters.description + '\n' +
      'io.on(\'' + input.parameters.messagename + '\', function(){\n    ' +
      'io.to('+input.serverResponse.clientname+').emit(\'' + input.serverResponse.parameters.messagename + '\', {data: \'' + input.serverResponse.parameters.data + '\'}\n});\n\n';
    }
    else if(input.parameters.data == undefined && input.serverResponse.parameters.data !== undefined && input.serverResponse.clientname == undefined){
      'io.on(\'' + input.parameters.messagename + '\', function(){\n    ' +
      'io.broadcast.emit(\'' + input.serverResponse.parameters.messagename + '\', {data: \'' + input.serverResponse.parameters.data + '\'}\n});\n\n';
    }
    else if(input.parameters.data == undefined && input.serverResponse.parameters.data == undefined && input.serverResponse.clientname !== undefined){
      'io.on(\'' + input.parameters.messagename + '\', function(){\n    ' +
      'io.to('+input.serverResponse.clientname+').emit(\'' + input.serverResponse.parameters.messagename + '\'});\n\n';
    }
    else if(input.parameters.data == undefined && input.serverResponse.parameters.data == undefined && input.serverResponse.clientname == undefined){
      'io.on(\'' + input.parameters.messagename + '\', function(){\n    ' +
      'io.broadcast.emit(\'' + input.serverResponse.parameters.messagename + '\'});\n\n';
    }
  } 
    else if(input.serverResponse == undefined && scope == "server"){
      if(input.parameters.data == undefined){
      returndata = '//' + input.parameters.description + '\n'+
      'io.broadcast.emit(\'' + input.parameters.messagename + '\');\n\n';
    }
      else if(input.parameters.data !== undefined){
        returndata = '//' + input.parameters.description + '\n'+
        'io.broadcast.emit(\'' + input.parameters.messagename + '\', {data: \'' + input.parameters.data + '\'});\n\n';
      }
    }
    return returndata;
  }


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
        tempData[0].data.client = {};
        parseClient(input.client);
        break;
      case "server":
        tempData[0].data.server = {};
        parseServer(input.server);
        break;
      case "info":
        tempData[0].data.info = {};
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
  if(input == null){
    tempData[0].data.info.title = 'Basic server made with ExpressJS';
  }
  else if(input.length <= 50){
    tempData[0].data.info.title = input;
  }
  else{
    throw new Error('the title length is ' + input.length + ', which is longer than the maximum of 50');
  }
}

var parsePort = function(input){
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

var parseClient = function(input){
  if(Object.keys(input).length > 10){
    throw new Error('The number of used tags in \'client\' exceeds the maximum of 10 tags.');
  }
  for(var clientScope = 0; clientScope < Object.keys(input).length; clientScope++){
    tempData[0].data.client['message' + (clientScope+1)] = {};
    parseMessage(input[Object.keys(input)[clientScope]], 'client', (clientScope+1));
    if(Object.keys(input)[clientScope] !== "message" + (clientScope+1)){
      throw new Error('The \'' + Object.keys(input)[clientScope] + '\' tag, that is used in \'client\', is not usable at this point. Please use message\'' + (clientScope+1) + '\'');
    }
  }
}

var parseServer = function(input){
  if(Object.keys(input).length > 10){
    throw new Error('The number of used tags in \'server\' exceeds the maximum of 10 tags.');
  }
  for(var serverScope = 0; serverScope < Object.keys(input).length; serverScope++){
    tempData[0].data.server['message' + (serverScope+1)] = {};
    parseMessage(input[Object.keys(input)[serverScope]], 'server', (serverScope+1));
    if(Object.keys(input)[serverScope] !== "message" + (serverScope+1)){
      throw new Error('The \'' + Object.keys(input)[serverScope] + '\' tag, that is used in \'server\', is not usable at this point. Please use \'message' + (serverScope+1) + '\'.');
    }
  }
}

var parseMessage = function(input, scope, number){
  for(var messageScope = 0; messageScope < Object.keys(input).length; messageScope++){
    switch(Object.keys(input)[messageScope]){
      case "parameters":
        tempData[0].data[scope]['message' + number].parameters = {};
        parseParameters(input.parameters, scope, number, false);
        break;
      case "serverResponse":
        if(scope == "server"){
          throw new Error('The \'serverResponse\' tag is not usable in \'server\'. Please remove this tag.');
        }
        else{ 
          tempData[0].data.client['message' + number].serverResponse = {};
          parseServerResponse(input.serverResponse, scope, number);
        }
        break;
      default: 
      if(scope == "server"){
      throw new Error('The \'' + Object.keys(input)[messageScope] + '\' tag, which is used in \''+scope+'\', is not usable at this point. Please use \'parameters\'.');
      }   
      else{
        throw new Error('The \'' + Object.keys(input)[messageScope] + '\' tag, which is used in \''+scope+'\', is not usable at this point. Please use \'parameters\' or \'serverResponse\'.');
      }
    }
  }
}

var parseParameters = function(input, scope, number, serverResponse){
  if(serverResponse == false){
        tempData[0].data[scope]['message'+number].parameters = {};
      }
  for(var parameterScope = 0; parameterScope < Object.keys(input).length; parameterScope++){
    switch(Object.keys(input)[parameterScope]){
      case "messageName":
        parseMessageName(input.messageName, scope, number, serverResponse);
        break;
      case "data":
        parseData(input.data, scope, number, serverResponse);
        break;
      case "description":
        parseDescription(input.description, scope, number, serverResponse);
        break;
      default: throw new Error('The \''+Object.keys(input)[parameterScope]+ '\' tag, which is used in \'' + scope + '/message' + number + '\', is not usable at this point. Please refer to the userguide for more information.');
    }
  }
}

var parseMessageName = function(input, scope, number, serverResponse){
    if(input == null && serverResponse == false){
    input = 'message' + number;
    tempData[0].data[scope]['message'+number].parameters.messagename = input;
    alert('There was no name assigned to \'' + scope +  '/message' + number +'\', the used name will be set to \'' + input + '\'.')
  }
  else if(input == null && serverResponse == true){
    console.log(tempData);
    input = 'message' + number;
    tempData[0].data[scope]['message'+number].serverResponse.parameters.messagename = input;
    alert('There was no name assigned to \'' + scope +  '/message' + number +'/serverResponse/parameters/messagename\', so the used name will be set to \'' + input + '\'. It is highly recommended to give it the same name as \''+ scope + '/message' + number + '/parameters/messagename\'.')
  }
  else if(input.length > 25){
    throw new Error('The messageName used in \''+scope+'/message' + number +'\' is ' + input.length + ' characters long, which exceeds the maximum of 25 characters.');
  }

  if(serverResponse == true && input !== null){
    tempData[0].data.client['message'+number].serverResponse.parameters.messagename = input;
  }
  else if(serverResponse == false && input !== null){
    tempData[0].data[scope]['message'+number].parameters.messagename = input;
  }

}

var parseData = function(input, scope, number, serverResponse){
  if(input !== null){
    if(serverResponse == true){
      tempData[0].data[scope]['message'+number].serverResponse.parameters.data = input;  
    }
    else{
      tempData[0].data[scope]['message'+number].parameters.data = input;
    }
  }
}

var parseDescription = function(input, scope, number, serverResponse){
  var description = 'Description of ' + scope + '/message' + number;
  if(input !== null){
    if(serverResponse == true){
      tempData[0].data[scope]['message'+number].serverResponse.parameters.description = input;
    }
    else{
      tempData[0].data[scope]['message'+number].parameters.description = input;
    }
  }
    else{
    if(serverResponse == true){
      tempData[0].data[scope]['message'+number].serverResponse.parameters.description = description;
    }
    else{
      tempData[0].data[scope]['message'+number].parameters.description = description;
    }
  }
}

var parseServerResponse = function(input, scope, number){
  var tempTo = '';
  for(var serverRScope = 0; serverRScope < Object.keys(input).length; serverRScope++){
    if(Object.keys(input)[serverRScope] !== "to" && serverRScope == 0){
      throw new Error('The first used tag in \''+scope + '/message'+ number + '/serverResponse' + '\' should be \'to\', instead of \''+ Object.keys(input)[serverRScope] + '\'.');
    }
    switch(Object.keys(input)[serverRScope]){
      case "to":
        tempTo = input.to;
        parseDestination(input.to, scope, number);
        break;
      case "clientname":
        parseClientName(input.clientname, tempTo, scope, number);
        break;
      case "parameters":
        tempData[0].data[scope]['message'+number].serverResponse.parameters = {};
        parseParameters(input.parameters, scope, number, true);
        break;
      default: throw new Error('The \''+Object.keys(input)[serverRScope]+'\' tag, which is used in \''+ scope+'/message'+ number + '/serverResponse\', is not usable here. Please refer to the userguide for more information.');
    }
  }
}

var parseDestination = function(input, scope, number){
  if(input == "all"){
    tempData[0].data[scope]['message'+number].serverResponse.to = input;
  }
  else if(input == "client"){
    tempData[0].data[scope]['message'+number].serverResponse.to = input;
  }
  else{
    throw new Error('The given value for \'to\' in \''+ scope + '/message' + number + '/serverResponse' + '\' is not usable here. Please refer to the userguide for more information.');
  }
}

var parseClientName = function(input, to, scope, number){
  if(to == "all"){
    throw new Error('The \'clientname\' tag can not be used here since the \'to\' tag in \''+ scope + '/message' + number + '/serverResponse' + '\' has been set to \'' + to + '\'.');
  }
  if(input == "all"){
    throw new Error('The used name \'all\' in \''+ scope + '/message' + number + '/serverResponse/clientname' +'\' is not usable. Please refer to the userguide for more information.');
  }
  else{
    tempData[0].data[scope]['message'+number].serverResponse.clientname = input;
  }
}

var tempData = [];

$scope.Generate = function () {
  try {
    tempData = [];
    var username = "petertje";
    tempData.push({username: username, data: {}});
    var input = editor.getSession().getValue();
    var temp = [];
    var output = '';
    input = jsyaml.safeLoad(input);
    parseMainScope(input);
    temp.push(generateServerCode(tempData[0].data.info));
    for(var clientsocket = 1; clientsocket < Object.keys(tempData[0].data.client).length+1;clientsocket++ )
    {
      temp.push(generateClientSocketCode(tempData[0].data.client['message'+clientsocket]));
      temp.push(generateServerSocketCode(tempData[0].data.client['message'+clientsocket], 'client'));
    }
    for(var serversocket = 1; serversocket < Object.keys(tempData[0].data.server).length+1; serversocket ++){
      temp.push(generateServerSocketCode(tempData[0].data.server['message'+serversocket], 'server'));
    }
    temp.push(closeServerCode());
    for(var i = 0; i < temp.length; i++){
      output += temp[i];
    }
    console.log(output);
    //generated.setValue(output, 1);
    $scope.error = null;
    }
    catch
        (e) {
      console.log(e);
      scroll(0, 0);
      //generated.setValue('', 1);
      $scope.error = e.message;
    }
  };
});
