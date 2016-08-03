(function(angular) {
	
    'use strict';
    
	angular.module('spmiFrontEnd')
		.controller('AdjustmentProjectController', AdjustmentProjectController)
		
	function AdjustmentProjectController($scope, $state, project, $timeout, $modal, ProjectService, ProjectConverterService) {
		//console.log(project);
	
		var vm = this;
		
		
		
		vm.input = project;
		vm.users = vm.input.users;
		vm.assessors = vm.input.assessors;
		vm.projects = vm.input.projects;
		vm.nodes = vm.projects;
        
		vm.setting = {
			isAdmin: true,
			readOnly: true,
            adjustment: true,
            initiate: false,
			start: vm.input.start,
			ended: vm.input.ended,
			status: vm.input.status,
			type: vm.input.type,
		}
		
		vm.canModifyProject = true;
		vm.canAddMember = true;
        vm.canAddAssessors = true;
		vm.canChangeLeader = true;
		vm.hasSubmit = false;
		vm.hasCheckpoint = false;
		vm.showStatus = true;
		vm.showAllocation = true;
        
        
        
        ProjectConverterService.decimalConverter(project.projects);
		ProjectConverterService.dateConverter(vm.input);
		
		vm.status = ProjectConverterService.statusConverter(vm.input)
		
        ProjectConverterService.userConverter(vm.input);
        
        
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
		
		
		vm.setting.showGrade = true;
        ProjectConverterService.calculateScore(vm.projects);
		
		
	
		var recursiveChecking = function(node) {
			for (var i = 0 ; i < node.length ; i++) {
				
				if(angular.isArray(node[i].children)) {
					if (node[i].children.length > 0) {
						recursiveChecking(node[i].children)
					} else {
						
						//handling if this node had form;
						if (node[i].forms) {
							//convert to javascript date
							for(var j = 0 ; j < node[i].forms.length ; j++) {
								if(node[i].forms[j].uploads) {
									var time = new Date(node[i].forms[j].uploads.created_at)
									time.addHours(7)
									
									node[i].forms[j].uploads.created_at = time
								}
							}
							
							
							for(var j = 0 ; j < node[i].delegations.length ; j++) {
								if(node[i].delegations[j].id == ProjectService.userId) {
									node[i].isDelegate = true
									break;
								}
							}
						}
							
						
						
					}
				}
				
			}
		}
		
		recursiveChecking(vm.input.projects)
		
        vm.setLeader = function(object) {
            var cnf = confirm('Apakah Anda yakin memilih ' + object.name + ' sebagai project leader?');
            if (cnf == true) {
                
                object.project_id = vm.input.id;
                ProjectService.enrollLeader(object)
                    .then(function(data) {
                        
                        for (var i = 0; i < vm.input.users.length; i++) {
                            if (vm.input.users[i].id == object.id) {
                                vm.input.users[i].leader = true;
                            } else {
                                vm.input.users[i].leader = false;
                            }
                        }
                        
                        ProjectConverterService.changeLeader(vm.input.user_id, object, vm.nodes);
                        //vm.loadResource();
                        alert('Project manager berhasil dipilih');        
                    })

            }
			
		}
   
        vm.addProjectMember = function() {
            
			var modalInstance = $modal.open({
				animate: true,
				templateUrl: 'app/admin/user/views/modal.html',
				controller: 'ModalUserController as vm',
				size: 'lg',
				resolve: {
					users: function () { return vm.input.users },
				}
			})
	
			modalInstance.result.then(function (users) {
				
                
                ProjectService.enrollMember({id: vm.input.id, users: users})
                    .then(function() {
                        alert('Member untuk project ini berhasil ditambahkan');
                        
                        var leader = {};
                        for (var i = 0; i < vm.input.users.length; i++) {
                            if (vm.input.users[i].leader == true) {
                                leader = vm.input.users[i];
                                break;
                            }
                        }
        
                        vm.input.users = users;
                        console.log(leader.id);
                        
                        for (var i = 0; i < vm.input.users.length; i++) {
                            
                            console.log(vm.input.users[i])
                            if (vm.input.users[i].id == leader.id) {
                                vm.input.users[i].leader == true;
                                break;
                            }
                        }    
                    })
                
			}, function(){});
		}
        
        vm.addProjectAssessor = function () {
			var modalInstance = $modal.open({
				animate: true,
				templateUrl: 'app/admin/user/views/modal.html',
				controller: 'ModalUserController as vm',
				size: 'lg',
				resolve: {
					users: function() { 
						return vm.input.assessors 
					},
				}
			})
			
			modalInstance.result.then(function (users) {
				
				
                ProjectService.enrollAssessor({id: vm.input.id, assessors: users})
                    .then(function() {
                        alert('Assessor untuk project ini berhasil ditambahkan');
                        vm.input.assessors = users;        
                    })
                
			}, function(){});
		}
        
        vm.pickStart = function() {
			if (vm.input.start > vm.input.ended) {
				vm.minDateEnded = vm.input.start;
				(vm.limit) ? vm.input.ended = vm.input.start : vm.input.ended = undefined;
			}
		}
        
		
		$scope.$watch('vm.input', function() {
			
			if (vm.input.projects && vm.input.projects.length > 0) {
				
				if (vm.input.status == 1) {
					
					var counter = 0;
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
					
				}
					
				
			}
			
			vm.loadResource();
			
		}, true);
		
		
		
		vm.back = function() {
			$state.go('main.admin.project');
		}
        
        
        
        
		vm.toggleMin = function() {
			vm.minDate = vm.minDate ? null : new Date();
		};
	
		vm.openStart = function($event) {
			vm.datePickerStatus.openedStart = true;
		};
	
		vm.openEnded = function($event) {
			vm.datePickerStatus.openedEnded = true;
		};
	
		vm.dateOptions = {
			formatYear: 'yy',
			startingDay: 1
		};
	
		vm.statusStart = {
			openedStart: false
		};
	
		vm.statusEnded = {
			openedEnded: false
		};
		
		return vm;
	}

})(angular);