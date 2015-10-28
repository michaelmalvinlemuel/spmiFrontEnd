(function () {
	
	angular.module('spmiFrontEnd')
		.controller('TaskController', ['$scope', '$state', 'TaskService', TaskController])
		.controller('TaskFormController', ['$scope', '$state', '$stateParams', 'TaskService', TaskFormController])
		
		
	function TaskController ($scope, $state, TaskService) {
		$scope.ongoing = []
		$scope.overdue = []
		$scope.complete = []
	
		$scope.load = function () {
			TaskService
				.get($scope.user.id)
				.then(function (response) {
					$scope.ongoing = response.data.ongoing[0]
					console.log($scope.ongoing)
	
					$scope.toDo = 0;
					$scope.homeWork = 0;
					$scope.done = 0;
	
					for (var i = 0 ; i < $scope.ongoing.jobs.length ; i++) {
						$scope.toDo += $scope.ongoing.jobs[i].works.length
						for (var j = 0 ; j < $scope.ongoing.jobs[i].works.length ; j++) {
							$scope.ongoing.jobs[i].works[j].created_at = Date.parse($scope.ongoing.jobs[i].works[j].created_at);
							$scope.ongoing.jobs[i].works[j].expired_at = Date.parse($scope.ongoing.jobs[i].works[j].expired_at);
							var now = new Date();
							var expired = new Date($scope.ongoing.jobs[i].works[j].expired_at);
							var timeDiff = Math.abs(now.getTime() - expired.getTime());
							var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
							$scope.ongoing.jobs[i].works[j].remaining = diffDays;
	
							var jobsDone = 0;
							for (var k = 0 ; k < $scope.ongoing.jobs[i].works[j].tasks.length ; k++) {
								if ($scope.ongoing.jobs[i].works[j].tasks[k].status == 2) {
									jobsDone++
								}
							}
	
							$scope.ongoing.jobs[i].works[j].progress = '(' + jobsDone + '/' +$scope.ongoing.jobs[i].works[j].tasks.length + ')'
	
						}
					}
	
					$scope.overdue = response.data.overdue[0]
					//console.log($scope.overdue)
					
					for (var i = 0 ; i < $scope.overdue.jobs.length ; i++) {
						$scope.homeWork += $scope.overdue.jobs[i].works.length
						for (var j = 0 ; j < $scope.overdue.jobs[i].works.length ; j++) {
							$scope.overdue.jobs[i].works[j].created_at = Date.parse($scope.overdue.jobs[i].works[j].created_at);
							$scope.overdue.jobs[i].works[j].expired_at = Date.parse($scope.overdue.jobs[i].works[j].expired_at);
							var now = new Date();
							var expired = new Date($scope.overdue.jobs[i].works[j].expired_at);
							var timeDiff = Math.abs(now.getTime() - expired.getTime());
							var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
							$scope.overdue.jobs[i].works[j].remaining = diffDays;
	
							var jobsDone = 0;
							for (var k = 0 ; k < $scope.overdue.jobs[i].works[j].tasks.length ; k++) {
								if ($scope.overdue.jobs[i].works[j].tasks[k].status == 2) {
									jobsDone++
								}
							}
	
							$scope.overdue.jobs[i].works[j].progress = '(' + jobsDone + '/' +$scope.overdue.jobs[i].works[j].tasks.length + ')'
	
						}
					}
	
					$scope.complete = response.data.complete[0]
					//console.log($scope.complete)
					
					for (var i = 0 ; i < $scope.complete.jobs.length ; i++) {
						$scope.done += $scope.complete.jobs[i].works.length
						for (var j = 0 ; j < $scope.complete.jobs[i].works.length ; j++) {
							$scope.complete.jobs[i].works[j].created_at = Date.parse($scope.complete.jobs[i].works[j].created_at);
							$scope.complete.jobs[i].works[j].expired_at = Date.parse($scope.complete.jobs[i].works[j].expired_at);
							var now = new Date();
							var expired = new Date($scope.complete.jobs[i].works[j].expired_at);
							var timeDiff = Math.abs(now.getTime() - expired.getTime());
							var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
							$scope.complete.jobs[i].works[j].remaining = diffDays;
	
							var jobsDone = 0;
							for (var k = 0 ; k < $scope.complete.jobs[i].works[j].tasks.length ; k++) {
								if ($scope.complete.jobs[i].works[j].tasks[k].status == 2) {
									jobsDone++
								}
							}
	
							$scope.complete.jobs[i].works[j].progress = '(' + jobsDone + '/' +$scope.complete.jobs[i].works[j].tasks.length + ')'
	
						}
					}
				})
		}
	
		$scope.detail = function (work) {
			console.log(work);
			console.log({ userId: $scope.user.id, jobId: work.job_id, batchId: work.batch_id});
			$state.go('main.user.task.form', { jobId: work.job_id, batchId: work.batch_id});
		}
	
		$scope.load()
	}
	
	function TaskFormController ($scope, $state, $stateParams, TaskService) {
		$scope.tasks = {}
		$scope.tasks.uploads = []
		$scope.files = [];
		$scope.load = function () {
			//$scope.tasks = $stateParams.work;
			
			TaskService
				.show($scope.user.id, $stateParams.batchId)
				.then(function (response) {
					$scope.tasks = response.data[0];
					console.log($scope.tasks);
				})
			
		}
	
		$scope.submit = function (files) {
			
			TaskService
				.update($scope.tasks, files)
				.then(function (response) {
					$state.go('main.user.task');
				});
			
			
		}
	
		$scope.load();
	}

})()

