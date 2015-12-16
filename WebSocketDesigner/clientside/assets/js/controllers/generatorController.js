theApp.controller('generatorController', function ($scope, $http, $location, $routeParams, FileSaver, Blob) {

  var editor = ace.edit("editor");
  editor.setTheme("ace/theme/monokai");
  editor.getSession().setMode("ace/mode/yaml");
  editor.$blockScrolling = Infinity;

  var generated = ace.edit("generated");
  generated.setTheme("ace/theme/monokai");
  generated.getSession().setMode("ace/mode/javascript");
  generated.$blockScrolling = Infinity;

  $scope.beschikbareCode = [];
  $scope.projectName = "My Project";

  $scope.error = null;

  $scope.homeMessage = "No message";
  $scope.showHomeMessage = false;
  $scope.isErrorMessage = false;

  $scope.client = {};
  $scope.server = {};
  $scope.info = {};
  
  $scope.saveInput = function(){
    //TODO Code uit generator opslaan, als account systeem er is bij het goede account opslaan=
    $(function () {
      $('#saveModal').modal('show');
    });
  };

  $scope.saveProject = function() {
    if($scope.projectName !== "") {
      var data = {
        code: editor.getSession().getValue(),
        name: $scope.projectName
      };
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
    } else {
      $scope.showHomeMessage = true;
      $scope.homeMessage = "You didn't enter a project name.";
      $scope.isErrorMessage = true;
    }

  };
  $scope.hideMessage = function () {
    $scope.showHomeMessage = false;
  }

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
      console.log("Succes! " + data);
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

  $scope.setCode = function(code) {
    editor.getSession().setValue(code);
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
}



$scope.Generate = function () {
  try {
    var parser = PEG.buildParser("start = ('a' / 'b')+");
    var x = prompt("put in an a or b or combination");
    console.log(parser.parse(x));
    var input = editor.getSession().getValue();
    var temp = [];
    var output = '';
    console.log(esprima.tokenize(input));
    input = jsyaml.safeLoad(input);
    errorHandling(input);
    traverse(input);
    //console.log(JSON.stringify(esprima.parse(test), null, 4));
    temp.push(generateServerCode($scope.info));
    //temp.push(generateServerSocket(output));
    //temp.push(generateClientSocket(output));
    for(var i = 0; i < temp.length; i++){
      output += temp[i];
    }
    generated.setValue(output, 1);
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
