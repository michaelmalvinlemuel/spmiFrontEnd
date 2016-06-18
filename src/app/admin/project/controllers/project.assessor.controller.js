(function(angular) {
    
    'use strict';
    
    angular.module('spmiFrontEnd')
        .controller('AssessorDetailProjectController', AssessorDetailProjectController)
        
    function AssessorDetailProjectController($scope, $state, $modal, project, ProjectService
        , ProjectConverterService) {
        
        var vm = this;
        
        vm.input = project;
        
        
        
        ProjectConverterService.decimalConverter(vm.input.projects);
		ProjectConverterService.dateConverter(vm.input);
        
        vm.status = ProjectConverterService.statusConverter(vm.input);

        return vm;
    }
    
})(angular);