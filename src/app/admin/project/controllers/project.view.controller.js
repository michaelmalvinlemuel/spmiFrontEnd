(function() {
	'use strict'
	angular.module('spmiFrontEnd')
		.controller('ViewProjectController', ViewProjectController)
		
	function ViewProjectController($state, project, $timeout, $modal, ProjectService, ProjectConverterService) {
		//console.log(project);
	
		var vm = this;
		
		vm.input = project;
		vm.users = vm.input.users;
		vm.assessors = vm.input.assessors;
		vm.projects = vm.input.projects;
		
		ProjectConverterService.decimalConverter(project.projects);
		ProjectConverterService.dateConverter(vm.input);
		
		
		vm.setting = {
			isAdmin: true,
			readOnly: true,
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
		vm.label = []
		
		
		
		
		
		for(var i = 0; i < vm.users.length; i++) {
			vm.data.push(vm.users[i].nik);
			vm.label.push(vm.users[i].name);
		}
		
		if (vm.input.status == '0') {
			vm.setting.showGrade = false
		} else {
			vm.setting.showGrade = true;
			ProjectConverterService.calculateScore(vm.projects);
		}
		
		
	
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
		
		
		
		vm.back = function() {
			$state.go('main.admin.project');
		}
		
		return vm;
	}

})();