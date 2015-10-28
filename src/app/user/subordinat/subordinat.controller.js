(function () {

	angular.module('spmiFrontEnd')
		.controller('SubordinatController', ['$scope', '$filter', '$modal', 'UserService', 'JobService', 'TaskService', SubordinatController])
		.controller('SubordinatTaskController', ['$scope', '$state', '$stateParams', '$modalInstance', 'task', 'TaskService', 'UserService', 'JobService', 'WorkService', SubordinatTaskController])
	
	
	function SubordinatController ($scope, $filter, $modal, UserService, JobService, TaskService) {
	
		$scope.tree = []
		$scope.showed = false
		$scope.tasks = []
		$scope.virtualTasks = []
		$scope.filteredTasks = []
	
		$scope.now = new Date();
	
		$scope.showLimit = 5
		$scope.currentPage = 1;
	
		$scope.show = {}
	
	
		$scope.load = function () {
			$scope.tree = [{	
				label: $scope.user.name,
				classes: ["special", "red"],
				onSelect: function (branch) {
					$scope.showed = true;
				}
			}]
			UserService
				.jobs($scope.user.id)
				.then(function (response) {
	
					$scope.subordinate = response.data
					//console.log($scope.subordinate)
	
					var child = [];
					var id = [];
					
					for (var i = 0 ; i < $scope.subordinate.jobs.length ; i ++) {
						
						child.push({
								label: $scope.subordinate.jobs[i].name,
								type: 'job',
								id: $scope.subordinate.jobs[i].id,
								onSelect: function(branch) {
									$scope.selectedJob(branch);
								}
							})
					}
					$scope.tree[0].children = child;
					
	
				})
		
	
			
		}
	
		$scope.selectedJob = function (branch) {
			$scope.showed = false;
			var child = []
			var id = []
	
			var jobId = branch.id
			JobService
				.subs(jobId)
				.then(function(response) {
					
					//console.log(response)
					for (var i = 0 ; i < response.data.length ; i ++) {
						
						child.push({
								label: response.data[i].name,
								type: 'job',
								id: response.data[i].id,
								onSelect: function(branch) {
									$scope.selectedUser(branch);
								}
							})
					}
	
					
				})
	
			return branch.children = child
		}
	
		$scope.selectedUser = function (branch) {
			$scope.showed = false;
			var child = [];
			var id = [];
	
			JobService
				.users(branch.id)
				.then(function (response) {
	
					
					for (var i = 0 ; i < response.data.users.length ; i ++) {
						
						child.push({
								label: response.data.users[i].name,
								type: 'user',
								user_id: response.data.users[i].id,
								job_id: response.data.id,
								onSelect: function(branch) {
									$scope.selectedSubJob(branch);
								}
							})
					}				
	
				})
			return branch.children = child
		}
	
		$scope.selectedSubJob = function (branch) {
			$scope.showed = true;
			
	
			var child = []
			var id = []
	
			var userId = branch.user_id
			var jobId = branch.job_id
	
			$scope.retrive(userId, jobId)
			JobService
				.subs(jobId)
				.then(function(response) {
					
					//console.log(response)
					for (var i = 0 ; i < response.data.length ; i ++) {
						
						
						child.push({
								label: response.data[i].name,
								type: 'job',
								id: response.data[i].id,
								onSelect: function(branch) {
									$scope.selectedUser(branch);
									;
								}
							})
					}
	
					
				})
	
			return branch.children = child
		}
	
		$scope.retrive = function (userId, jobId) {
	
			TaskService
				.retrive(userId, jobId)
				.then(function (response) {
					$scope.tasks = response.data[0].jobs[0].works
					console.log($scope.tasks)
			
					for (var j = 0 ; j < $scope.tasks.length ; j++) {
						$scope.tasks[j].created_at = new Date($scope.tasks[j].created_at);
						$scope.tasks[j].expired_at = new Date($scope.tasks[j].expired_at);
						var now = new Date();
						var expired = new Date($scope.tasks[j].expired_at);
						var timeDiff = Math.abs(now.getTime() - expired.getTime());
						var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
						$scope.tasks[j].remaining = diffDays;
	
						var jobsDone = 0;
						for (var k = 0 ; k < $scope.tasks[j].tasks.length ; k++) {
							if ($scope.tasks[j].tasks[k].status == 2) {
								jobsDone++
							}
						}
	
						$scope.tasks[j].progress = '(' + jobsDone + '/' +$scope.tasks[j].tasks.length + ')'
	
					}
					$scope.show.complete = true;
					$scope.show.progress = true;
					$scope.show.expired = true;
	
					$scope.virtualTasks = $scope.tasks;
	
					$scope.filteredTasks = []
					$scope.showLimit = 5
					$scope.currentPage = 1
					$scope.pagging();
	
					
				})
		}
	
		$scope.detail = function (work) {
			
			console.log(work);
	
			
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
				//$rootScope.pushIfUnique($scope.input.groupJobs, groupJobs)
				
			}, function () {
				//$log.info('Modal dismissed at: ' + new Date());
			})
	
		}
	
		$scope.onShowChange = function () {
			//alert('kopet')
	
			$scope.virtualTasks = []
			var counter = 0;
			for (var i = 0 ; i < $scope.tasks.length ; i++) {
	
				if ($scope.tasks[i].status == 2) {
					if ($scope.show.complete == true) {
						//alert('complete')
						$scope.virtualTasks[counter] = $scope.tasks[i]
						counter++
					}
				}
	
				if (($scope.tasks[i].status == 1) && ($scope.tasks[i].expired_at >= $scope.now)) {
					if ($scope.show.progress == true) {
						//alert('progress')
						$scope.virtualTasks[counter] = $scope.tasks[i]
						counter++
					}
				}
	
				if (($scope.tasks[i].status == 1) && ($scope.tasks[i].expired_at < $scope.now)) {
					if ($scope.show.expired == true) {
						//alert('expired')
						$scope.virtualTasks[counter] = $scope.tasks[i]
						counter++
					}
				}
				
			}
	
			$scope.filteredTasks = []
			$scope.showLimit = 5
			$scope.currentPage = 1
			$scope.pagging();
	
		}
		
		$scope.$watch('showLimit', function() {
			$scope.currentPage = 1
			$scope.pagging();
		})
	
		$scope.pagging = function() {
	
			var begin = (($scope.currentPage - 1) * $scope.showLimit)
			var end = begin + $scope.showLimit;
		
			$scope.filteredTasks = $scope.virtualTasks.slice(begin, end);
		};
	
		$scope.load();
	}
	
	function SubordinatTaskController ($scope, $state, $stateParams, $modalInstance, task, TaskService, UserService, JobService, WorkService) {
		$scope.tasks = task;
		$scope.users = {}
		$scope.jobs = {}
		$scope.Works = {}
	
		$scope.load = function () {
			UserService
				.show($scope.tasks.user_id)
				.then(function (response) {
					$scope.tasks.users = response.data
				})
	
			JobService
				.show($scope.tasks.job_id)
				.then(function (response) {
					$scope.tasks.jobs = response.data
				})
	
			WorkService
				.show($scope.tasks.work_id)
				.then(function (response) {
					$scope.tasks.works = response.data
				})
	
		}
	
		$scope.close = function () {
			$modalInstance.dismiss('cancel');
		}
	
		$scope.load();
	}

})()
