(function(angular) {
	
    'use strict';
    
	angular.module('spmiFrontEnd')
		.controller('ViewProjectController', ViewProjectController)
		
	function ViewProjectController($scope, $state, project, mark, $timeout, $modal, ProjectService, ProjectConverterService) {
		//console.log(project);
	
		var vm = this;
		
		
		
		vm.input = project;
		vm.users = vm.input.users;
		vm.assessors = vm.input.assessors;
		vm.projects = vm.input.projects;
		vm.nodes = vm.projects;
		vm.mark = mark;
	
		
		ProjectConverterService.decimalConverter(project.projects);
		ProjectConverterService.dateConverter(vm.input);
		
		//console.log( 'test');
		vm.status = ProjectConverterService.statusConverter(vm.input)
		
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
		vm.showStatus = true;
		vm.showAllocation = true;
		
		
		
		
		vm.data = [];
		vm.label = [];
		
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
			
			//vm.loadResource();
			
		}, true);
		
		vm.markAs = function() {
			var cnf;
			var message = '';
			if (vm.mark == 2) {
				if (vm.input.unsigned == true) {
					alert('Mohon maaf, terdapat project node yang belum dilakukan assessment. Silahkan lengkapi penilaiannya terlebih dahulu');
				} else {
					cnf = confirm('Apakah anda yakin untuk menandai project ini sudah selesai? \n Dengan begitu sistem akan melakukan kalkulasi untuk setiap penilaian yang telah diberikan untuk projecti ini. Penilaian yang telah dikalkulasi tidak dapat diubah');
					message = 'Project ini berhasil diselesaikan';
				}
					
				
			} else {
				cnf = confirm('Apakan Anda yakin untuk menghentikan project ini? Dengan begitu  kalkulasi penilaian dan seluruh kontent yang terdapat dialam project ini tidak dapat diubah');
				message = 'Project ini telah dihentikan';
			}
			
			if (cnf == true) {
				var data = {
					id: vm.input.id,
					status: mark,
				}
				
				ProjectService.mark(data).then(function(data) {
					alert(message);
					$state.go('main.admin.project', null, { reload: true });
				})
			}
		}
		
		vm.back = function() {
			$state.go('main.admin.project');
		}
		
		return vm;
	}

})(angular);