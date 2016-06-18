(function(angular) {
	
    'use strict';
    
	angular.module('spmiFrontEnd')
		.controller('ScoringProjectController', ScoringProjectController)
	
	function ScoringProjectController ($rootScope, $scope, $state, $modal, $timeout, node, isAdmin, CURRENT_USER, ProjectService, ProjectConverterService) {
		var vm = this;
		
		vm.validated = false;
		vm.node = node; 
		
		ProjectConverterService.dateScoreConverter(vm.node);
		
        vm.attachments = [];
        vm.uploadDescription = '';
        vm.selectedNode = function(object) {
            if (object.upload) {
                vm.attachments = object.upload.attachments;
                vm.uploadDescription = object.upload.description;   
            } else {
                vm.attachments = [];
                vm.uploadDescription = null;
            }
            
        }
        
		vm.submit = function() {
			
			$scope.ScoringForm.score.$setDirty();
			$scope.ScoringForm.description.$setDirty();
			
			if ($scope.ScoringForm.$valid) {
				
				var data = {
					score: vm.score,
					description: vm.description,
					project_form_id: vm.node.forms.id,
				}
				
				ProjectService.score(data).then(function(data) {
					vm.node.forms.scores.push(data);
					alert('Pekerjaan project ini berhasil diberikan assessment');
				})
			
			} else {
				vm.validated = true;
			}
			
		}
		
        vm.unlock = function() {
            
            var cnf = confirm('Apakah Anda ingin me-unlock butir untuk project ini?');
            if (cnf == true) {
                
                ProjectService.lock(vm.node.id, 0).then(function(data) {
                    
                    alert('Butir untuk project ini berhasil di unlock');
                    if (isAdmin) {
                        $state.go('main.admin.project.scoring', { projectId: node.root.id }, { reload: true });
                    } else {
                        $state.go('main.user.projectAssess.detail', { projectId: node.root.id }, { reload: true });
                    }
                }) 
            }
            
            
        }
        
		vm.back = function() {
			
			
			if (isAdmin) {
				$state.go('main.admin.project.scoring', { projectId: node.root.id }, { reload: true });
			} else {
				$state.go('main.user.projectAssess.detail', { projectId: node.root.id }, { reload: true });
			}
			
			
			
		}
		
		
		return vm;
	}

})(angular);