theApp.controller('generatorController', ['$scope', '$location', function ($scope) {

    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/yaml");
    editor.$blockScrolling = Infinity;

    var generated = ace.edit("generated");
    generated.setTheme("ace/theme/monokai");
    generated.getSession().setMode("ace/mode/javascript");
    generated.$blockScrolling = Infinity;


    $scope.error = null;
    $scope.Generate = function(){
      try {
        //var actionArray = [];
        var input = editor.getSession().getValue();
        var output = jsyaml.safeLoad(input);
        var pathArray = Object.keys(output.paths);
        for(var i = 0; i < Object.keys(output.paths).length; i++)
        {
          console.log(pathArray);
          console.log(output.paths[pathArray[i]]);
          for(var x = 0; x < Object.keys(output.paths[pathArray[i]]).length; x++) {
          }
        }
        output = JSON.stringify(output, null, 4);
        generated.setValue(output, 1);
        $scope.error = null;
      }
      catch(e){
        scroll(0,0);
        generated.setValue('',1);
        $scope.error = e.message;
      }
    }
}]);
