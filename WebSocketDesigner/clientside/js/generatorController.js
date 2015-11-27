theApp.controller('generatorController', ['$scope', '$http', '$location', function ($scope, $http) {

  var editor = ace.edit("editor");
  editor.setTheme("ace/theme/monokai");
  editor.getSession().setMode("ace/mode/yaml");
  editor.$blockScrolling = Infinity;

  var generated = ace.edit("generated");
  generated.setTheme("ace/theme/monokai");
  generated.getSession().setMode("ace/mode/javascript");
  generated.$blockScrolling = Infinity;

  $scope.savedData = {};
  $scope.error = null;

  $scope.saveInput = function(){
    //Code uit generator opslaan, als account systeem er is bij het goede account opslaan
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

  //Code van ID 4 opvragen
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

  $scope.Generate = function () {
    try {

      var input = editor.getSession().getValue();

      input = jsyaml.safeLoad(input);

      if (input.paths != undefined) {
        var pathArray = Object.keys(input.paths);
        for (var i = 0; i < Object.keys(input.paths).length; i++) {
          var actionArray = [input.paths[pathArray[i]].POST, input.paths[pathArray[i]].GET, input.paths[pathArray[i]].PUT];
          $scope.savedData[pathArray[i]] = {};
          for (var x = 0; x < Object.keys(input.paths[pathArray[i]]).length; x++) {
            $scope.savedData[pathArray[i]][Object.keys(input.paths[pathArray[i]])[x]] = {};
            for (var z = 0; z < Object.keys(actionArray[x]).length; z++) {
              var actionData = input.paths[pathArray[i]][Object.keys(input.paths[pathArray[i]])[x]][Object.keys(actionArray[x])[z]];
                $scope.savedData[pathArray[i]][Object.keys(input.paths[pathArray[i]])[x]][Object.keys(actionArray[x])[z]] = actionData;
            }
          }
        }
        input = JSON.stringify(input, null, 4);
        generated.setValue(input, 1);
        alert($scope.savedData);
        $scope.error = null;
      }
      input = JSON.stringify(input, null, 4);
      generated.setValue(input, 1);
      console.log($scope.savedData);
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

}])
;
