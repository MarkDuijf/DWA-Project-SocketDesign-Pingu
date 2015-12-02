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

  var generateHost = function(varname, location, port, base){
    if(port == undefined){
      return "var " + varname + " = new WebSocket(\'ws://" + location + base + "\');";
    }
    else {
      return "var " + varname + " = new WebSocket(\'ws://" + location + ":" + port + base + "\');";
    }
  };

  var errorHandling = function(input){
    //Throw an error if the host or basepath doesn't exist
    if(input.host == undefined || input.basepath == undefined){
      throw new Error('You didn\'t specify a basepath and/or host');
    }

    //Throw an error if the location or socket variable doesn't exist
    if(input.host.location == undefined || input.host.socketvar == undefined){
      throw new Error('You didn\'t specify a location and/or websocket variable')
    }

    if(input.host.port == undefined && input.host.location == 'localhost' || input.host.location == 'Localhost'){
      throw new Error('If localhost is used a port should be specified in the host');
    }
  };

  $scope.Generate = function () {
    try {
      var input = editor.getSession().getValue();
      input = jsyaml.safeLoad(input);
      errorHandling(input);
      if (input.paths != undefined) {
      }
      var socketCon = generateHost(input.host.socketvar, input.host.location, input.host.port, input.basepath);
      input = socketCon;
      //input = JSON.stringify(input, null, 4);
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
}]);
