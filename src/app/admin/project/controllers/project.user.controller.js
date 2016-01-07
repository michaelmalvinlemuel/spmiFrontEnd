(function(angular) {
	
	'use strict';
	
	angular.module('spmiFrontEnd')
		.controller('UserProjectController', UserProjectController)
	
	function UserProjectController($scope, $state, project, isAdmin, $timeout, $modal, CURRENT_USER
		, ProjectService, ProjectConverterService, ProjectPaginationService) {
		
		var vm = this;
		
		
		
		vm.input = project;
		vm.nodes = []
		
		ProjectConverterService.decimalConverter(vm.input.projects);
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
		vm.showUserAction = true;
		
		/**
		 * THIS FUNCTION BLOCK HAS SAME FUNCTIONALITIES WITH ADMIN UPDATE
		 * THIS NEED TO SEPERATE TO FACTORY SOMEHOW
		 * 
		 * BLOCK START
		 */
		
		vm.loadResource = function() {
			vm.data = [];
			vm.label = [];
			vm.dataLabel = ProjectConverterService.calculateResource(vm.input);
			//for resource allocation
			for (var i = 0; i < vm.input.users.length; i++) {
				
				var counter = 0;
				for (var j = 0; j < vm.dataLabel.length; j++ ) {
					
					if (vm.input.users[i].name == vm.dataLabel[j].label) {
						vm.data.push(vm.dataLabel[j].data);
						vm.label.push(vm.dataLabel[j].label);
						break;
					}
					counter++;
				}
			}
		}
		
		vm.loadResource();	
		
		vm.reportUser = function(user) {
			var modalInstance = $modal.open({
				animate:true,
				templateUrl: 'app/admin/project/views/detail.modal.html',
				controller: 'ReportModalUserProjectController',
				size: 'lg',
				resolve: {
					projects: function() {
						return angular.copy(vm.input.projects);
					},
					user: function() {
						return user
					}
				}
			})
			
			modalInstance.result.then(function() {
				
			}, function() {
				
			})
		}
		
		/**
		 * BLOCK END
		 */
		
		
		$scope.$on('projectUserLoadResource', function(event) {
			vm.loadResource();	
		})
		
		
		vm.isAssessor = function() {
			
			for (var i = 0; i < vm.input.assessors.length; i++) {
				if (vm.input.assessors[i].id == CURRENT_USER.id) {
					return true;
					break;
				}
			}
		}
		
		vm.isLeader = function() {
			if (vm.input.user_id == CURRENT_USER.id) {
				vm.nodes = vm.input.projects 
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
		ProjectConverterService.calculateScore(vm.input.projects);
		ProjectConverterService.fixedNumberingConverter(vm.input.projects);
		
		/**
		 * Filter node for delegated user only
		 */
		for (var i = 0; i < vm.input.users.length; i++) {
			if (vm.input.users[i].id == CURRENT_USER.id) {
				vm.nodes = ProjectConverterService.filterDelegationsNode(vm.input.projects);
				break;
			}
		}
		
		/**
		 * Filter node for delegated assessors only
		 */
		
		for (var i = 0; i < vm.input.assessors.length; i++) {
			if (vm.input.assessors[i].id == CURRENT_USER.id) {
				vm.nodes = ProjectConverterService.filterAssessorsNode(vm.input.projects);
				break;
			}
		}
		
		
		
		
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
				
				counter = 0;
				for (var i = 0; i < vm.input.projects.length; i++) {
					if (vm.input.projects[i].unsigned) {
						vm.input.unsigned = true;
						break;
					}
					counter++;
				}
				
				if (vm.input.projects.length == counter) {
					vm.input.unsigned = false;
				}
                
                counter = 0;
                for (var i = 0; i < vm.input.projects.length; i++) {
                    if(vm.input.projects[i].unuploaded) {
                        vm.input.unuploaded = true;
                        break;
                    }
                    counter++;
                }
                
                if (vm.input.projects.length == counter) {
                    vm.input.unuploaded = true;
                }
				
			}
			
			vm.nodes = vm.input.projects;
			
			vm.loadResource();
			
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
	
	
})(angular);