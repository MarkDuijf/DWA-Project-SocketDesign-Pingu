theApp.controller('generatorController', ['$scope', '$http', '$location', function ($scope, $http) {

  var editor = ace.edit("editor");
  editor.setTheme("ace/theme/monokai");
  editor.getSession().setMode("ace/mode/yaml");
  editor.$blockScrolling = Infinity;

  var generated = ace.edit("generated");
  generated.setTheme("ace/theme/monokai");
  generated.getSession().setMode("ace/mode/javascript");
  generated.$blockScrolling = Infinity;

  $scope.error = null;

  //Testcode voor het oplsaan van YAML in de database, wordt verwijderd
  $scope.saveInput = function(){
    //TODO Code uit generator opslaan, als account systeem er is bij het goede account opslaan
    var data = {
      code: editor.getSession().getValue()
    };
    $http.post("/projectTest", data).
    success( function(data) {
      console.log("Succes! " + data);
    }).
    error( function(data,status) {
      console.log("ERROR:", data, status);
    });
  };

  //Testcode voor het ophalen van YAML uit de database, wordt verwijderd
  //Code van ID 4 opvragen voor test doeleinden
  $scope.getTest = function() {
    $http.get('/projectTest').
    success(function(data) {
      console.log("Succes! " + data);
      editor.getSession().setValue(data);
    }).
    error(function(data, status) {
      console.log("ERROR:", data, status);
    })
  };

  var generateServer = function(port){
      return'//This is the server code, it creates a basic server on the given port \n' +
        'var app = require(\'http\').createServer(handler); \n' +
        'var io = require(\'socket.io\')(app);\n' +
        'var fs = require(\'fs\');\n' +
        'var port = ' + port + '; \n\n' +
        'app.listen(port, function(){\n  console.log(\'server listening on port: \' + port);\n' +
        '}); \n\n' +
        'function handler(req, res){\n' +
        '  fs.readFile(__dirname + \'/index.html\',' +
        '  function(err, data){\n' +
        '    if(err){\n' +
        '      res.writeHead(500);\n' +
        '      return res.end(\'Error loading index.html\');\n' +
        '    }\n' +
        '    res.writeHead(200);\n' +
        '    res.end(data);\n' +
        '  });\n' +
        '}\n\n';
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
    //Throw an error if the host or basepath doesn't exist
    if(input.host == undefined || input.basepath == undefined){
      throw new Error('You didn\'t specify a basepath and/or host');
    }

    //Throw an error if the location or socket variable doesn't exist
    if(input.host.location == undefined){
      throw new Error('You didn\'t specify a location in the host');
    }

    //Throw an error if the location is equal to localhost and port has not been set
    if(input.host.port == undefined && input.host.location == 'localhost' || input.host.location == 'Localhost'){
      throw new Error('If localhost is used a port should be specified in the host');
    }
  };

  $scope.Generate = function () {
    try {
      var input = editor.getSession().getValue();
      var temp = [];
      var output = '';
      input = jsyaml.safeLoad(input);
      errorHandling(input);
      console.log(input.on.message);
      temp.push(JSON.stringify(input, null, 4));
      //temp.push(generateServer(input.host.port));
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


