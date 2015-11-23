(function () {
	
	'use strict'
	
	angular.module('spmiFrontEnd')
		.controller('SubordinatController', SubordinatController)
		.controller('SubordinatTaskController', SubordinatTaskController)
	
	
	function SubordinatController ($scope, $filter, $modal, hierarchy, TaskService) {
		var vm = this;
		
		vm.tree = []
		vm.hierarchy = hierarchy
		
		console.log(vm.hierarchy)
		
		vm.tasks = []
	
		vm.now = new Date();
	
		vm.showLimit = 10
		vm.currentPage = 1;
	
		vm.show = {}
		vm.show.complete = true;
		vm.show.progress = true;
		vm.show.overdue = true;
		
		vm.selectedNode = {}
		
		function performance (userId) {
			
		}
		
		//var counter = 0;
		vm.convert = function(parent, branch){
			//console.log(counter++);
			//console.log(vm.tree);
			for (var i = 0; i < branch.length; i++) {
				var children = branch[i].jobs || branch[i].users || branch[i].subs 
				if ( children ) {
					parent.children = []
					vm.convert(parent.children, children)
					
					var data = {
						id: branch[i].id,
						label: branch[i].name,
						type: branch[i].node,
						expanded: false,
						children: parent.children,
					}
					
					if ( branch[i].pivot ) {
						data.parent = branch[i].pivot.job_id
					}
					
					data.onSelect = function(branch) {
						if (branch.type == 'user') {
							vm.showed = true;
							console.log(branch.id + ', ' + branch.parent);
							vm.selectedNode.userId = branch.id;
							vm.selectedNode.jobId = branch.parent;
							//vm.showLimit = 10;
							//vm.show.complete = true;
							//vm.show.progress = true;
							//vm.show.overdue = true;
									
							TaskService.retrive(branch.id
								, branch.parent
								, vm.showLimit
								, vm.show.progress
								, vm.show.complete
								, vm.show.overdue
								, vm.currentPage).then(function(data) {
									vm.total = data.total;
									vm.currentPage = data.current_page;
									
									for (var i = 0; i < data.data.length; i++) {
										data.data[i].created_at = new Date(data.data[i].created_at);
										data.data[i].expired_at = new Date(data.data[i].expired_at); 
										var expired = data.data[i].expired_at;
										var timeDiff = Math.abs(vm.now.getTime() - expired.getTime());
										var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
										data.data[i].remaining = diffDays;
									}
									
									vm.tasks = data.data;
									
								})
						} else {
							vm.showed = false;
						}
					}
					
					parent.push(data)
				} 
			}	
		}
		
		vm.convert(vm.tree, vm.hierarchy);
		
		vm.onShowChange = function() {
			TaskService.retrive(vm.selectedNode.userId
				, vm.selectedNode.jobId
				, vm.showLimit
				, vm.show.progress
				, vm.show.complete
				, vm.show.overdue
				, vm.currentPage).then(function(data) {
					vm.total = data.total;
					vm.currentPage = data.current_page;
					
					for (var i = 0; i < data.data.length; i++) {
						data.data[i].created_at = new Date(data.data[i].created_at);
						data.data[i].expired_at = new Date(data.data[i].expired_at); 
						var expired = data.data[i].expired_at;
						var timeDiff = Math.abs(vm.now.getTime() - expired.getTime());
						var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
						data.data[i].remaining = diffDays;
					}
									
					vm.tasks = data.data;
					
					
				})
		}
		
		vm.pagging = function() {
			TaskService.retrive(vm.selectedNode.userId
				, vm.selectedNode.jobId
				, vm.showLimit
				, vm.show.progress
				, vm.show.complete
				, vm.show.overdue
				, vm.currentPage).then(function(data) {
					vm.total = data.total;
					vm.currentPage = data.current_page;
					
					for (var i = 0; i < data.data.length; i++) {
						data.data[i].created_at = new Date(data.data[i].created_at);
						data.data[i].expired_at = new Date(data.data[i].expired_at);
						var expired = data.data[i].expired_at;
						var timeDiff = Math.abs(vm.now.getTime() - expired.getTime());
						var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
						data.data[i].remaining = diffDays;
					}
									
					vm.tasks = data.data;
				})
		}
		
		vm.detail = function (work) {
			
			var modalInstance = $modal.open({
				animation: true,
				templateUrl: 'app/user/task/views/modal.html',
				controller: 'SubordinatTaskController',
				size: 'lg',
				resolve: {
					task: function () {
						return work;
					}
				}
			})
	
			modalInstance.result.then(function (groupJobs) {
				//$rootScope.pushIfUnique(vm.input.groupJobs, groupJobs)
				
			}, function () {
				//$log.info('Modal dismissed at: ' + new Date());
			})
	
		}
	
		return vm;
	}
	
	function SubordinatTaskController ($scope, $modalInstance, task, TaskService, UserService, JobService, WorkService) {
		$scope.tasks = task;
		$scope.users = {}
		$scope.jobs = {}
		$scope.Works = {}
	
		
		UserService.lite($scope.tasks.user_id).then(function (data) {
			$scope.tasks.users = data;
			return JobService.lite($scope.tasks.job_id);
		}).then(function (data) {
			$scope.tasks.jobs = data;
			return WorkService.lite($scope.tasks.work_id)
		}).then(function (data) {
			$scope.tasks.works = data;
		})	
	
		$scope.close = function () {
			$modalInstance.dismiss('cancel');
		}
	
		
	}

})();
