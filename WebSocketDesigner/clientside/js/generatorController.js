theApp.controller('generatorController', ['$scope', '$location', function ($scope) {

    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/yaml");
    editor.$blockScrolling = Infinity;

    var generated = ace.edit("generated");
    generated.setTheme("ace/theme/monokai");
    generated.getSession().setMode("ace/mode/javascript");
    generated.$blockScrolling = Infinity;

    $scope.Generate = function(){
      var input = editor.getSession().getValue();
      var output = jsyaml.safeLoad(input);
      output = JSON.stringify(output, null, 4);
      generated.setValue(output, 1);
    }
}]);

