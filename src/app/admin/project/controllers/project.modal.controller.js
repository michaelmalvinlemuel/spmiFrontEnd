(function() {
	'use strict'
	
	angular.module('spmiFrontEnd')
		.controller('ModalProjectController',  ModalProjectController)

	function ModalProjectController($scope, $timeout, $modalInstance, project, ProjectService) {
	
		$scope.input = project

		$scope.submit = function () {
			
			$scope.ModalProjectForm.header.$setDirty()
			$scope.ModalProjectForm.description.$setDirty()

			if ($scope.ModalProjectForm.$valid) {
				if ($scope.input.children) {
					$modalInstance.close($scope.input)
				} else {
					$scope.input.open = false,
					$scope.input.children = []
					$scope.input.delegations = []
					$modalInstance.close($scope.input)
				}
				
			} else {
				$scope.validated = true;
			}
		};
	
		$scope.close = function () {
			$modalInstance.dismiss('cancel');
		}
	}

})();


