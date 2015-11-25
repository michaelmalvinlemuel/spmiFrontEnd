(function() {
	'use strict'
	
	angular.module('spmiFrontEnd')
		.controller('UserProjectController', UserProjectController)
	
	function UserProjectController($rootScope, $scope, $state, project, isAdmin, $timeout, $modal, CURRENT_USER
		, ProjectService, ProjectConverterService, ProjectPaginationService) {
		
		var vm = this;
		
		console.log(project);
		
		vm.input = project;
		vm.users = vm.input.users;
		vm.assessors = vm.input.assessors;
		vm.projects = vm.input.projects;
		
		
		ProjectConverterService.decimalConverter(vm.projects);
		ProjectConverterService.dateConverter(vm.input);
		vm.status = ProjectConverterService.statusConverter(vm.input)
		
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
		vm.showAllocation = true;
		
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
			vm.childChange(object.node);
			$scope.$broadcast('load', {});
			vm.input.type_status = '0';
		});
		
		
		vm.isAssessor = function() {
			
			for (var i = 0; i < vm.assessors.length; i++) {
				if (vm.assessors[i].id == CURRENT_USER.id) {
					return true;
					break;
				}
			}
		}
		
		vm.isLeader = function() {
			if (vm.input.user_id == CURRENT_USER.id) {
				return true;
			} else {
				return false;
			}
		}
		
		
		/**
		 * this locking system has common functionality with lock method in project.node.controller
		 * if there any changes, please looking forward for project.node.controller as well
		 */
		
		vm.lock = function() {
			
			if (vm.input.type_status == '0') {
				
				if (isAdmin) {
					
					alert('Hanya Project Leader yang dapat mengunci pekerjaan untuk siap dinilai');
				
				} else if (vm.isAssessor()) {
					
					alert('Hanya Project Leader yang dapat mengunci pekerjaan untuk siap dinilai');
				
				} else if (vm.isLeader()) {
					
					var cnf = confirm('Apakah anda yakin ingin mengunci butir project ini? Dengan melakukan ini, seluruh project member tidak dapat me-upload seluruh butir project ini beserta anggota butir dari project. Selain itu, assessor dapat memberikan penilaian untuk project ini. PERHATIAN: anda tidak dapat membuka kembali pekerjaan yang telah terlunci. Hanya administrator dan assessor yang dapat membuka pekerjaan yang sudah terkunci');
						
					if (cnf == true) {
						
						ProjectService.fullLock(vm.input.id).then(function(data) {
							vm.input.type_status = '1';
							$scope.$broadcast('fullLock', {node: vm.projects, status: 1});
							alert('Pekerjaan project ini berhasil dikunci dan siap dinilai oleh assessor');
							$scope.$broadcast('load', {});
						});
						
					}
					
				} else {
					
					alert('Hanya admin yang dapat mengunci pekerjaan untuk siap dinilai');
				
				}
				
			} else {
				
				if (isAdmin) {
					
					cnf = confirm('Apakah anda yakin ingin membuka pekerjaan yang terkunci ini? Dengan begitu induk dari perkerjaan ini menjadi dapat diedit oleh project member.');
					if (cnf == true) {
						
						ProjectService.fullLock(vm.input.id).then(function(data) {
							vm.input.type_status = '0';
							$scope.$broadcast('fullLock', {node: vm.projects, status: 0});
							alert('Pekerjaan berhasil dibuka dan siap dilanjutkan oleh project member');
							$scope.$broadcast('load', {});
						});
					}
				
				} else if (vm.isAssessor()) {
					
					cnf = confirm('Apakah anda yakin ingin membuka pekerjaan yang terkunci ini?');
					if (cnf == true) {
						
						ProjectService.fullLock(vm.input.id).then(function(data) {
							vm.input.type_status = '0';
							$scope.$broadcast('fullLock', {node: vm.projects, status: 0});
							alert('Pekerjaan berhasil dibuka dan siap dilanjutkan oleh project member');
							$scope.$broadcast('load', {});
						});
					}
					
				} else if (vm.isLeader()) {
					
					alert('Project ini sudah terkunci, harap hubungi administrator atau assessor untuk membuka pekerjaan yang terkunci');
					
				} else  {
					
					alert('Project ini sudah terkunci, harap hubungi administrator atau assessor untuk membuka pekerjaan yang terkunci');

				}
			}
			
		}
		
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