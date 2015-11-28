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
		
		vm.status = ProjectConverterService.statusConverter(vm.input);
		
		
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
		vm.showLock = true;
		vm.showStatus = true;
		
		vm.data = [];
		vm.label = [];
		
		//for resource allocation
		for(var i = 0; i < vm.users.length; i++) {
			vm.data.push(vm.users[i].nik);
			vm.label.push(vm.users[i].name);
		}
		
		
		
		
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
			
			var lockingSystem = function(lockStatus) {
				
				var propagateLock = function(node, lockStatus) {
					
					if (node.forms) {
						
						node.lock = lockStatus;

					} else {
						
						for (var i = 0; i < node.children.length; i++) {
							propagateLock(node.children[i], lockStatus);	
						}
						
					}
				};
				
				for (var i = 0; i < vm.input.projects.length; i++) {
					
					propagateLock(vm.input.projects[i], lockStatus);
						
				}
			};
			
			
			if (vm.input.lock == 0) {
				
				if (isAdmin) {
					
					alert('Hanya Project Leader yang dapat mengunci pekerjaan untuk siap dinilai');
				
				} else if (vm.isAssessor()) {
					
					alert('Hanya Project Leader yang dapat mengunci pekerjaan untuk siap dinilai');
				
				} else if (vm.isLeader()) {
					
					var cnf = confirm('Apakah anda yakin ingin mengunci butir project ini? Dengan melakukan ini, seluruh project member tidak dapat me-upload seluruh butir project ini beserta anggota butir dari project. Selain itu, assessor dapat memberikan penilaian untuk project ini. PERHATIAN: anda tidak dapat membuka kembali pekerjaan yang telah terlunci. Hanya administrator dan assessor yang dapat membuka pekerjaan yang sudah terkunci');
						
					if (cnf == true) {
						
						//vm.input.type_status = '1';
						ProjectService.lockAll(vm.input.id, 1)
							.then(function( data ) {
								lockingSystem(1);
								alert('Project ini berhasil dikunci dan siap dinilai oleh assessor');
							})
						
						
					}
					
				} else {
					
					alert('Hanya admin yang dapat mengunci pekerjaan untuk siap dinilai');
				
				}
				
			} else {
				
				if (isAdmin) {
					
					cnf = confirm('Apakah anda yakin ingin membuka pekerjaan yang terkunci ini? Dengan begitu induk dari perkerjaan ini menjadi dapat diedit oleh project member.');
					if (cnf == true) {
						
						//vm.input.type_status = '0';
						ProjectService.lockAll(vm.input.id, 0)
							.then(function( data ) {
								lockingSystem(0);
								alert('Project ini berhasil dibuka dan siap dilanjutkan oleh project member');
							})
					}
				
				} else if (vm.isAssessor()) {
					
					cnf = confirm('Apakah anda yakin ingin membuka pekerjaan yang terkunci ini?');
					if (cnf == true) {
						
						//vm.input.type_status = '0';
						ProjectService.lockAll(vm.input.id, 0)
							.then(function( data ) {
								lockingSystem(0);
								alert('Project ini berhasil dibuka dan siap dilanjutkan oleh project member');
							})
						
					}
					
				} else if (vm.isLeader()) {
					
					alert('Project ini sudah terkunci, harap hubungi administrator atau assessor untuk membuka pekerjaan yang terkunci');
					
				} else  {
					
					alert('Project ini sudah terkunci, harap hubungi administrator atau assessor untuk membuka pekerjaan yang terkunci');

				}
			}
			
		
			
			
		}
		
		ProjectConverterService.lockConverter(vm.input);
		ProjectConverterService.calculateScore(vm.projects);
		
		$scope.$watch('vm.input', function() {
			
			if (vm.input.projects && vm.input.projects.length > 0) {
				var counter = 0;
				for (var i = 0; i < vm.input.projects.length; i++) {
					if (vm.input.projects[i].lock == 0) {
						vm.input.lock = 0;
						break;
					}
					counter++;
				}
				
				if (vm.input.projects.length == counter) {
					vm.input.lock = 1;
				}
				
			}
			
		}, true);
		
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