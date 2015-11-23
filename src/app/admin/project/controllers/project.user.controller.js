(function() {
	'use strict'
	
	angular.module('spmiFrontEnd')
		.controller('UserProjectController', UserProjectController)
	
	function UserProjectController($rootScope, $scope, $state, project, isAdmin, $timeout, $modal, CURRENT_USER
		, ProjectService, ProjectConverterService, ProjectPaginationService) {
		
		var vm = this;

		vm.input = project;
		vm.users = vm.input.users;
		vm.assessors = vm.input.assessors;
		vm.projects = vm.input.projects;
		
		
		ProjectConverterService.decimalConverter(vm.projects);
		ProjectConverterService.dateConverter(vm.input);
		
		
		vm.setting = {
			isAdmin: isAdmin,
			start: vm.input.start,
			ended: vm.input.ended,
			status: vm.input.status,
			type: vm.input.type,
		}
		
		vm.canModifyProject = false;
		vm.canAddMember = false;
		vm.canChangeLeader = false;
		vm.hasSubmit = false;
		vm.hasCheckpoint = false;
		
		vm.data = [];
		vm.label = [];
		
		//for resource allocation
		for(var i = 0; i < vm.users.length; i++) {
			vm.data.push(vm.users[i].nik);
			vm.label.push(vm.users[i].name);
		}
		
		vm.searchNodeById = function(nodes, nodeId) {
			
			for (var i = 0; i < nodes.length; i++) {
				if (nodes[i].id == nodeId) {
					return nodes[i];
				} else {
					if (nodes[i].children.length > 0) {
						vm.searchNodeById(nodes[i].children, nodeId);
					}
				}
			}
			
		}
		
		
		vm.childChange = function(node) {
			
			var parent = vm.searchNodeById(vm.projects, node.project_id);
			if (parent) {
				parent.status = '0';
				vm.childChange(parent);
			}
			

		}
		
		$scope.$on('globalLoad', function(event, object) {
			console.log('trigger globalLoad');
			vm.childChange(object.node);
			$scope.$broadcast('load', {});
		})
		
		ProjectConverterService.calculateScore(vm.projects);
		
		
		vm.back = function() {
			if(isAdmin) {
				$state.go('main.admin.project');
			} else {
				$state.go('main.user.project');
			}
			
		}
		
		return vm;
	}
	
	
})();