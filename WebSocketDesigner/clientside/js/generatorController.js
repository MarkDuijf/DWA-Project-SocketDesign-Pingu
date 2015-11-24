theApp.controller('generatorController', ['$scope', '$location', function ($scope) {

    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/yaml");

    var generated = ace.edit("generated");
    generated.setTheme("ace/theme/monokai");
    generated.getSession().setMode("ace/mode/javascript");

}]);