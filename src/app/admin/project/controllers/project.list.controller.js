(function() {
	'use strict'
	angular.module('spmiFrontEnd')
		.controller('ProjectController', ProjectController)
	
	function ProjectController ($state, $timeout, projects, isAdmin, ProjectService, ProjectConverterService, ProjectPaginationService) {
		var vm = this;
		vm.isAdmin = isAdmin;
		vm.projects = projects.data;
		vm.total = projects.total;
		
		//vm.service = new Object();
		if (isAdmin == true) {
			vm.service = ProjectService.get;
		} else {
			vm.service = ProjectService.user;
		}
		
		ProjectPaginationService.listCtrl(vm);
		
		vm.detail = function (id) {
			$state.go('main.admin.project.detail', {projectId: id});
		}
		
		vm.update = function (id) {
			$state.go('main.admin.project.update', {projectId: id})
		};
		
		vm.scoring = function (id) {
			$state.go('main.admin.project.scoring', {projectId: id})
		}
		
		vm.mark = function(projectId, index, status) {
			var alert;
			if (status == 2) {
				alert = confirm('Apakah anda yakin untuk menandai project ini sudah selesai? \n Dengan begitu sistem akan melakukan kalkulasi untuk setiap penilaian yang telah diberikan untuk projecti ini. Penilaian yang telah dikalkulasi tidak dapat diubah');
			} else {
				alert = confirm('Apakan Anda yakin untuk menghentikan project ini? Dengan begitu sistem tidak ada melakukan kalkulasi penilaian dan seluruh kontent yang terdapat dialam project ini tidak dapat diubah');
			}
			
			if (alert == true) {
				var data = {
					id: projectId,
					status: status
				}
				
				ProjectService.mark(data).then(function(data) {
					vm.projects[index].status = status;
				}, function(data) {
					
				})
			}
				
		}
	
		vm.destroy = function(id, index) {
			var alert = confirm('Apakah anda yakin ingin menghapus project ini?');
			(alert == true) ? ProjectService.destroy(id).then(function(){
				vm.projects.splice(index, 1);
			}) : null;
		};
		
		vm.showStatus = function(start, ended, status) {
			var now = new Date();
			
			start = new Date(start);
			ended = new Date(ended);
			
			if (status == 0) {
				return {
					code: 0,
					text : 'Initiation',
				}
			}
			
			if (start > now && status == 1) {
				return {
					code: 1,
					text : 'Preparation',
				}
			}
			
			if (start <= now && ended >= now && status == 1) {
				return { 
					code: 2,
					text: 'On Progress',
				}
			}
			
			if (ended < now && status == 1) {
				return {
					code: 3,
					text: 'Waiting for Scoring',
				};
			}
			
			if (status == 2) {
				return {
					code: 4,
					text: 'Completed',
				};
			}
			
			if (status == 3) {
				return {
					code:5,
					text: 'Terminated',
				};
			}
		}
		
		vm.disabledModify = function(code) {
			if (code == 0 || code == 1) {
				return false;
			} else {
				return true;
			}
		}
		
		vm.disabledScoring = function(code) {
			if (code == 2 || code == 3) {
				return false;
			} else {
				return true;
			}
		}
		
		vm.disabledComplete = function (code) {
			if (code == 3) {
				return false;
			} else {
				return true;
			}
		}
		
		vm.disabledTerminate = function (code) {
			if (code !== 4 && code !== 5) {
				return false;
			} else {
				return true;
			}
		}
		
		
		
		return vm;
	}
	
})();