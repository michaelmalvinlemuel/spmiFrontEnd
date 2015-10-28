(function () {

	angular
		.module('spmiFrontEnd')

		.controller('GroupJobController', ['$scope', '$state', 'GroupJobService', GroupJobController])
		.controller('CreateGroupJobController', ['$rootScope', '$scope', '$state', '$timeout', '$modal', 'GroupJobService', CreateGroupJobController])
		.controller('UpdateGroupJobController', ['$scope', '$state', '$stateParams', '$timeout', '$modal', 'GroupJobService', 'GroupJobDetailService', UpdateGroupJobController])

		.controller('GroupJobDetailController', ['$scope', '$state', '$stateParams', 'UniversityService', 'GroupJobService', 'GroupJobDetailService', GroupJobDetailController])
		.controller('CreateGroupJobDetailController', ['$scope', '$state', '$modalInstance', 'UniversityService', 'DepartmentService', 'JobService', CreateGroupJobDetailController])
		.controller('UpdateGroupJobDetailController', ['$scope', '$state', '$modalInstance', 'detailJob', 'UniversityService', 'DepartmentService', 'JobService', UpdateGroupJobDetailController])
		
	function GroupJobController ($scope, $state, GroupJobService) {
		$scope.groupJobs = []
	
		$scope.load = function () {
			GroupJobService
				.get()
				.then(function (request) {
					$scope.groupJobs = request.data;
				})
		}
	
		$scope.detail = function (request) {
			$state.go('main.admin.groupJob.detail', {groupJobId: request})
		}
	
		$scope.update = function (request) {
			$state.go('main.admin.groupJob.update', {groupJobId: request})
		}
	
		$scope.destroy = function (request) {
			var alert = confirm("Apakah Anda yakin ingin menghapus Group Job ini?")
			if (alert == true) {
				GroupJobService
					.destroy({id: request})
					.then(function () {
						$scope.load();
					})
			}
		}
	
	
		$scope.load()
	}
	
	function CreateGroupJobController ($rootScope, $scope, $state, $timeout, $modal, GroupJobService) {
		var timeoutNamePromise
		$scope.input = {}
		$scope.input.groupJobs = []
		$scope.validated = false
	
		$scope.load = function () {
	
		}
	
		$scope.$watch('input.name', function () {
			var validInput = $scope.GroupJobForm.name.$invalid
			var dirtyInput = $scope.GroupJobForm.name.$dirty
			
			if (!validInput && dirtyInput) {
				$timeout.cancel(timeoutNamePromise)
				$scope.loadingName = true;
				timeoutNamePromise = $timeout(function() {
					GroupJobService
						.validatingName($scope.input)
						.then(function (response) {
							console.log(response.data);
							if (response.data.length > 0) {
								$scope.existName = true
							} else {
								$scope.existName = false
							}
							$scope.loadingName = false;
						})
				}, 1000)
			}		
		})
	
		$scope.addJob = function() {
			var modalInstance = $modal.open({
				animation: true,
				templateUrl: 'app/admin/job/views/modal.html',
				controller: 'CreateGroupJobDetailController',
				resolve: {
					detailJob: function () {
						return $scope.input.groupJobs;
					}
				}
			})
	
			modalInstance.result.then(function (groupJobs) {
				$rootScope.pushIfUnique($scope.input.groupJobs, groupJobs)
				
			}, function () {
				//$log.info('Modal dismissed at: ' + new Date());
			})
		}
	
		$scope.update = function (object, index) {
			var modalInstance = $modal.open({
				animation: true,
				templateUrl: 'app/admin/job/views/modal.html',
				controller: 'UpdateGroupJobDetailController',
				resolve: {
					detailJob: function () {
						return object;
					}
				}
			})
	
			modalInstance.result.then(function (groupJobs) {
				if ($rootScope.findObject($scope.input.groupJobs, groupJobs) == -1) {
					$scope.input.groupJobs[index] = groupJobs
					
				} else {
					alert('Pekerjaan ini sudah bagian dari group')
				}
	
				
				
			}, function () {
				//$log.info('Modal dismissed at: ' + new Date());
			})
		}
	
		$scope.destroy = function (object, index) {
			var alert = confirm("Apakah Anda yakin ingin menghapus Job ini dari GroupJob?")
			if (alert == true) {
				$scope.input.groupJobs.splice(index, 1);
			}
		}
	
		$scope.submit = function () {
			$scope.GroupJobForm.name.$setDirty();
			$scope.GroupJobForm.description.$setDirty();
	
			if ($scope.GroupJobForm.$valid) {
				GroupJobService
					.store($scope.input)
					.then(function () {
						$state.go('main.admin.groupJob')
					})
			} else {
				$scope.validated = true;
			}
		}
	
		$scope.load();
	}
	
	function UpdateGroupJobController ($scope, $state, $stateParams, $timeout, $modal, GroupJobService, GroupJobDetailService) {
		var timeoutNamePromise
		$scope.input = {}
		$scope.input.groupJobs = []
		$scope.validated = false
	
	
	
		$scope.loadJob = function () {
			GroupJobDetailService
				.get($stateParams.groupJobId)
				.then(function (response) {
					$scope.input.groupJobs = response.data
	
					$scope.data = $scope.input;
				})
		}
	
		$scope.load = function () {
			GroupJobService
				.show($stateParams.groupJobId)
				.then(function (response) {
					$scope.input = response.data
					$scope.loadJob();
				})
		}
	
		$scope.$watch('input.name', function () {
			var validInput = $scope.GroupJobForm.name.$invalid
			var dirtyInput = $scope.GroupJobForm.name.$dirty
			
			if (!validInput && dirtyInput) {
				$timeout.cancel(timeoutNamePromise)
				$scope.loadingName = true;
				timeoutNamePromise = $timeout(function() {
					GroupJobService
						.validatingName($scope.input)
						.then(function (response) {
							console.log(response.data);
							if (response.data.length > 0) {
								$scope.existName = true
							} else {
								$scope.existName = false
							}
							$scope.loadingName = false;
						})
				}, 1000)
			}		
		})
	
		$scope.addJob = function() {
			var modalInstance = $modal.open({
				animation: true,
				templateUrl: 'app/admin/job/views/modal.html',
				controller: 'CreateGroupJobDetailController',
				resolve: {
					detailJob: function () {
						return $scope.input.groupJobs;
					}
				}
			})
	
			modalInstance.result.then(function (groupJobs) {
				GroupJobDetailService
					.store({group_job_id: $stateParams.groupJobId, job_id: groupJobs.job.id})
					.then(function() {
						$scope.loadJob();
					}, function() {
						alert('Group Job ini telah memiliki Job yang dimaksud');
					})
				
			}, function () {
				//$log.info('Modal dismissed at: ' + new Date());
			})
		}
	
		$scope.update = function (object, index) {
			var modalInstance = $modal.open({
				animation: true,
				templateUrl: 'app/admin/job/views/modal.html',
				controller: 'UpdateGroupJobDetailController',
				resolve: {
					detailJob: function () {
						return object;
					}
				}
			})
	
			modalInstance.result.then(function (groupJobs) {
				GroupJobDetailService
					.update({id: object.id, group_job_id: $stateParams.groupJobId, job_id: groupJobs.job.id})
					.then(function () {
						$scope.loadJob();
					}, function() {
						alert('Group Job ini telah memiliki Job yang dimaksud');
					})
				
			}, function () {
				//$log.info('Modal dismissed at: ' + new Date());
			})
		}
	
		$scope.destroy = function (object, index) {
			var alert = confirm("Apakah Anda yakin ingin menghapus Job ini dari GroupJob?")
			if (alert == true) {
				GroupJobDetailService
					.destroy({id: object.id})
					.then(function() {
						$scope.loadJob();
					})
			}
		}
	
	
		$scope.submit = function () {
			$scope.GroupJobForm.name.$setDirty();
			$scope.GroupJobForm.description.$setDirty();
	
			if ($scope.GroupJobForm.$valid) {
				GroupJobService
					.update($scope.input)
					.then(function () {
						$state.go('main.admin.groupJob')
					})
			} else {
				$scope.validated = true;
			}
	
			
		}
	
		$scope.load();
	}
	
	
	function GroupJobDetailService ($http) {
		return {
			get: function (request) {
				return $http.get('/groupjobdetails/get/' + request)
			},
			show: function (request) {
				return $http.get('/groupjobdetails/' + request)
			},
			store: function (request) {
				return $http.post('/groupjobdetail/store', request)
			},
			update: function (request) {
				return $http.post('/groupjobdetail/update', request)
			},
			destroy: function (request) {
				return $http.post('/groupjobdetail/destroy', request)
			},
			university: function (request) {
				return $http.get('/groupjobdetail/university/' + request.groupJobId + '/' + request.universityId)
			}
		}
	}
	
	function GroupJobDetailController ($scope, $state, $stateParams, UniversityService, GroupJobService, GroupJobDetailService) {
		$scope.groupJobs = {}
		$scope.groupJobDetails = {}
		$scope.universities = {}
	
		$scope.load = function () {
			GroupJobService
				.show($stateParams.groupJobId)
				.then(function (response) {
					$scope.groupJobs = response.data;
	
					UniversityService
						.get()
						.then(function (response) {
							$scope.universities = response;
							$scope.university_id = response[0].id;	
	
							GroupJobDetailService
								.university({groupJobId: $stateParams.groupJobId, universityId: $scope.university_id})
								.then(function (response) {
									$scope.groupJobDetails = response.data
								})
					})
	
	
				})
		}
	
		$scope.select = function () {
			GroupJobDetailService
				.university({groupJobId: $stateParams.groupJobId, universityId: $scope.university_id})
				.then(function (response) {
					$scope.groupJobDetails = response.data
				})
		}
	
		$scope.destroy = function (request) {
			var alert = confirm("Apakah anda ingin menghapus Job ini dari group?")
			if (alert == true) {
				GroupJobDetailService
					.destroy({id: request})
					.then(function (request) {
						$scope.load();
					})
			}
		}
	
		$scope.load()
	}
	
	function CreateGroupJobDetailController ($scope, $state, $modalInstance, UniversityService, DepartmentService, JobService) {
		$scope.input = {}
		$scope.universities = []
		$scope.departments = []
		$scope.jobs = []
		$scope.validated = false
		$scope.occupied = false;
	
		$scope.load = function () {
			UniversityService
				.get()
				.then(function (response) {
					$scope.universities = response;
				})
		}
	
		$scope.selectUniversity = function (request) {
			$scope.loadingDepartment = true
			DepartmentService
				.university(request) 
				.then(function (response) {
					$scope.departments = response.data;
					$scope.loadingDepartment = false
					if (response.data.length > 0) {
						$scope.hasDepartment = true
					} else {
						$scope.hasDepartment = false
					}
				})
		}
	
		$scope.selectDepartment = function (request) {
			$scope.loadingJob = true
			JobService
				.department (request)
				.then(function (response) {
					$scope.jobs = response.data;
					$scope.loadingJob = false
					if (response.data.length > 0) {
						$scope.hasJob = true
					} else {
						$scope.hasJob = false
					}
				})
		}
	
		$scope.selectJob = function (request) {}
	
		$scope.submit = function () {
	
			$scope.UserJobForm.university.$setDirty();
			$scope.UserJobForm.department.$setDirty();
			$scope.UserJobForm.job.$setDirty();
	
			if ($scope.UserJobForm.$valid) {
				$scope.input.job.department = $scope.department
				$modalInstance.close($scope.input)
			} else {
				$scope.validated = true;
			}
	
		}
	
		$scope.close = function () {
			$modalInstance.dismiss('cancel');
		}
	
		$scope.load();
	}
	
	function UpdateGroupJobDetailController ($scope, $state, $modalInstance, detailJob, UniversityService, DepartmentService, JobService) {
		
		$scope.input = {}
		$scope.universities = []
		$scope.departments = []
		$scope.jobs = []
		$scope.detailJob = detailJob
		$scope.validated = false
		$scope.occupied = false;
	
		$scope.load = function () {
			$scope.loadingUniversity = true
	
				UniversityService
					.get()
					.then(function (response) {
						$scope.universities = response;
						$scope.university = $scope.universities[findObject($scope.universities, $scope.detailJob.job.department.university)];
						$scope.hasUniversity = true
						$scope.loadingUniversity = false
						$scope.loadingDepartment = true
	
						DepartmentService
							.university($scope.university.id)
							.then(function (response) {
								$scope.departments = response.data
								$scope.department = $scope.departments[findObject($scope.departments, $scope.detailJob.job.department)];
								$scope.hasDepartment = true
								$scope.loadingDepartment = false
								$scope.loadingJob = true
	
								JobService
									.department($scope.department.id)
									.then(function (response) {
										$scope.jobs = response.data;
										var a = $scope.detailJob.job
										$scope.input.job =  $scope.jobs[findObject($scope.jobs, a)];
										//console.log($scope.userJob.job)
										$scope.hasJob = true
										$scope.loadingJob = false
								})
						})
						
				})
		}
	
		$scope.selectUniversity = function (request) {
			$scope.loadingDepartment = true
			DepartmentService
				.university(request) 
				.then(function (response) {
					$scope.departments = response.data;
					$scope.loadingDepartment = false
					if (response.data.length > 0) {
						$scope.hasDepartment = true
					} else {
						$scope.hasDepartment = false
					}
				})
		}
	
		$scope.selectDepartment = function (request) {
			$scope.loadingJob = true
			JobService
				.department (request)
				.then(function (response) {
					$scope.jobs = response.data;
					$scope.loadingJob = false
					if (response.data.length > 0) {
						$scope.hasJob = true
					} else {
						$scope.hasJob = false
					}
				})
		}
	
		$scope.selectJob = function (request) {}
	
		$scope.submit = function () {
	
			$scope.UserJobForm.university.$setDirty();
			$scope.UserJobForm.department.$setDirty();
			$scope.UserJobForm.job.$setDirty();
	
			if ($scope.UserJobForm.$valid) {
				$scope.input.job.department = $scope.department
				$modalInstance.close($scope.input)
			} else {
				$scope.validated = true;
			}
		}
	
		$scope.close = function () {
			$modalInstance.dismiss('cancel');
		}
	
		$scope.load();
		
	}

})()



