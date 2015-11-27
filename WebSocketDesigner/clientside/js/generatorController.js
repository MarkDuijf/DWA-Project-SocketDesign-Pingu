theApp.controller('generatorController', ['$scope', '$http', '$location', function ($scope, $http) {

  var editor = ace.edit("editor");
  editor.setTheme("ace/theme/monokai");
  editor.getSession().setMode("ace/mode/yaml");
  editor.$blockScrolling = Infinity;

  var generated = ace.edit("generated");
  generated.setTheme("ace/theme/monokai");
  generated.getSession().setMode("ace/mode/javascript");
  generated.$blockScrolling = Infinity;

  $scope.savedData = [];
  $scope.error = null;

  $scope.saveInput = function(){
      alert('Work in Progress');
  };

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
      var output = [];
      var input = editor.getSession().getValue();

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

      input = jsyaml.safeLoad(input);
      if (input.paths != undefined) {
        var pathArray = Object.keys(input.paths); //duwt de paths in de variable( /messages, /user bijvoorbeeld)
        for (var i = 0; i < Object.keys(input.paths).length; i++) {
          var actionArray = [input.paths[pathArray[i]].POST, input.paths[pathArray[i]].GET, input.paths[pathArray[i]].PUT];
          for (var x = 0; x < Object.keys(input.paths[pathArray[i]]).length; x++) {
            if (actionArray[x] != undefined) {
                $scope.savedData.push(actionArray[x]);
            }
          }
        }
        output = JSON.stringify(output, null, 4);
        generated.setValue(output, 1);
        $scope.error = null;
      }
      input = JSON.stringify(input, null, 4);
      generated.setValue(input, 1);
      $scope.error = null;
    }
    catch (e) {
      console.log(e);
      scroll(0, 0);
      generated.setValue('', 1);
      $scope.error = e.message;
    }
    console.log($scope.savedData);
  }
}]);
