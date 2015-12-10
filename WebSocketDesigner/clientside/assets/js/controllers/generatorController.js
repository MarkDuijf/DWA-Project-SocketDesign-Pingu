theApp.controller('generatorController', ['$scope', '$http', '$location', function ($scope, $http) {

  var editor = ace.edit("editor");
  editor.setTheme("ace/theme/monokai");
  editor.getSession().setMode("ace/mode/yaml");
  editor.$blockScrolling = Infinity;

  var generated = ace.edit("generated");
  generated.setTheme("ace/theme/monokai");
  generated.getSession().setMode("ace/mode/javascript");
  generated.$blockScrolling = Infinity;

  $scope.beschikbareCode = [];

  $scope.error = null;

  $scope.saveInput = function(){
    //TODO Code uit generator opslaan, als account systeem er is bij het goede account opslaan
    function myFunction() {
      var name = prompt("Enter a project name", "My Project");
      if (name != null) {
        var data = {
          code: editor.getSession().getValue(),
          name: name
        };
        $http.post("/projectTest", data).
            success( function(data) {
              console.log("Succes! " + data);
            }).
            error( function(data,status) {
              console.log("ERROR:", data, status);
            });
      }
    }
    myFunction();
  };

  //Code van ID 4 opvragen voor test doeleinden
  $scope.getTest = function() {
    $http.get('/projectTest').
    success(function(data) {
      console.log("Succes! " + data);
          console.log(data);
          $scope.beschikbareCode = data;
          $(function () {
            $('#codeModal').modal('show');
          });
    }).
    error(function(data, status) {
      console.log("ERROR:", data, status);
    })
  };

  $scope.setCode = function(code) {
    editor.getSession().setValue(code);
    $(function () {
      $('#codeModal').modal('hide');
    });
  };

  var generateServer = function(port){
      return'//This is the server code, it creates a basic server(using expressJS) on the given port \n' +
      'var express = require(\'express\');\n' +
      'var app = express();\n' +
      'var server = require(\'http\').createServer(app);\n' +
      'var io = require(\'socket.io\').listen(server);\n' +
      'var path = require(\'path\');\n\n' +
      'app.use(express.static(path.join(__dirname)));\n' +
      'server.listen(' + port + ');\n\n';

        // 'var app = require(\'http\').createServer(handler); \n' +
        // 'var io = require(\'socket.io\')(app);\n' +
        // 'var fs = require(\'fs\');\n' +
        // 'var port = ' + port + '; \n\n' +
        // 'app.listen(port, function(){\n  console.log(\'server listening on port: \' + port);\n' +
        // '}); \n\n' +
        // 'function handler(req, res){\n' +
        // '  fs.readFile(__dirname + \'/index.html\',' +
        // '  function(err, data){\n' +
        // '    if(err){\n' +
        // '      res.writeHead(500);\n' +
        // '      return res.end(\'Error loading index.html\');\n' +
        // '    }\n' +
        // '    res.writeHead(200);\n' +
        // '    res.end(data);\n' +
        // '  });\n' +
        // '}\n\n';
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

  };

  $scope.Generate = function () {
    try {
      var input = editor.getSession().getValue();
      var temp = [];
      var output = '';
      var basePaths = [];  //Worden de basepaths in opgeslagen, zoals de client, server en info
      var scopePaths = []; //Worden de scopes in opgeslagen, zoals de chat in de demo
      var info = {};       //Wordt de info in opgeslagen
      input = jsyaml.safeLoad(input);
      errorHandling(input);
      for(var base = 0; base < Object.keys(input).length; base++){
        basePaths.push(Object.keys(input)[base]);
        for(var scope = 0; scope < Object.keys(input[basePaths[base]]).length; scope++){
          if(Object.keys(input)[base] == "info"){
            temp.push(Object.keys(input[basePaths[base]])[scope]);
            info[temp[scope]] = input[basePaths[base]][temp[scope]];
          }
        }
        temp = [];
      }
      //temp.push(JSON.stringify(input, null, 4));
      temp.push(generateServer(info.port));
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
}]);
