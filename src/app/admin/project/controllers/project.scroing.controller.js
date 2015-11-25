(function() {
	'use strict'
	angular.module('spmiFrontEnd')
		.controller('ScoringProjectController', ScoringProjectController)
	
	function ScoringProjectController ($rootScope, $scope, $state, $modal, $timeout, node, isAdmin, CURRENT_USER, ProjectService, ProjectConverterService) {
		var vm = this;
		
		vm.validated = false;
		vm.node = node; 
		
		ProjectConverterService.dateScoreConverter(vm.node);
		
		vm.submit = function() {
			var data = {
				score: vm.score,
				description: vm.description,
				project_form_id: vm.node.forms.id,
			}
			
			ProjectService.score(data).then(function(data) {
				vm.node.forms.scores.push(data);
			})
			
		}
		
		vm.back = function() {
			//console.log(node);
			if (isAdmin) {
				$state.go('main.admin.project.scoring', { projectId: node.root.id }, { reload: true });
			} else {
				$state.go('main.user.project.detail', { projectId: node.root.id }, { reload: true });
			}
			
		}
		
		
		return vm;
	}

})();