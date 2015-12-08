(function(angular) {
	
	'use strict';
	
	angular.module('spmiFrontEnd')
		.controller('ModalTemplateProjectController', ModalTemplateProjectController)
	
	function ModalTemplateProjectController($modalInstance, ProjectTemplateService) {
		var vm = this;
		
		ProjectTemplateService.get().then(function(data) {
			vm.templates = data;
		})
		
		vm.use = function(template) {
			$modalInstance.close(template);
		}
		
		return vm;
	}
	
})(angular);