(function() {
	
	angular
		.module('spmiFrontEnd')
		
		.controller('UserController', ['$scope', '$state', 'Session', 'UserService', UserController])
		.controller('CreateUserController', ['$rootScope', '$scope', '$state', '$timeout', '$modal', 'UserService', CreateUserController])
		.controller('UpdateUserController', ['$scope', '$state', '$stateParams', '$timeout', '$modal', 'UserService', 'UserJobService', UpdateUserController])

		.controller('CreateUserJobController', ['$scope', '$state', '$modalInstance', 'userJobs', 'UniversityService', 'DepartmentService', 'JobService', CreateUserJobController])
		.controller('UpdateUserJobController', ['$scope', '$state', '$modalInstance', 'userJob', 'UniversityService', 'DepartmentService', 'JobService', UpdateUserJobController])
})()

function generateYear () {
	var today = new Date().getFullYear();
	console.log(today);
	var object = []
	for (var i = 10; i < 100; i++) {
		object.push({year: today-i})
	}
	return object//[{no: 1, year:'2015'}, {no: 2, year:'2014'}, {no: 3, year:'2013'}]
}

function generateMonth () {
	return [
		{id: 1, month: 'Januari'},
		{id: 2, month: 'Febuari'},
		{id: 3, month: 'Maret'},
		{id: 4, month: 'April'},
		{id: 5, month: 'Mei'},
		{id: 6, month: 'Juni'},
		{id: 7, month: 'Juli'},
		{id: 8, month: 'Agustus'},
		{id: 9, month: 'September'},
		{id: 10, month: 'Oktober'},
		{id: 11, month: 'November'},
		{id: 12, month: 'Desember'},
	]
}

function generateDay (year, month) {
	var tanggal = []
	if (year.year % 4 == 0 && month == 2) {
		j = 29
	} else if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
		j = 31
	} else if (month == 2) {
		j = 28
	} else {
		j = 30
	}

	for (var i = 1 ; i <= j ; i++) {
		tanggal.push({day: i})
	}

	return tanggal
}


function UserController ($scope, $state, Session, UserService) {
	$scope.users = []
	
	$scope.load = function () {
		UserService
			.get()
			.then(function (request) {
				$scope.users = request.data;
				
			})
	}

	$scope.detail = function (request) {
		$state.go('main.admin.user.detail', {userId: request})
	}

	$scope.update = function (request) {
		$state.go('main.admin.user.update', {userId: request})
	}

	$scope.destroy = function (request) {
		var alert = confirm("Apakah Anda yakin ingin menghapus User ini?")
		if (alert == true) {
			UserService
				.destroy({id: request})
				.then(function () {
					$scope.load();
				})
		}
	}

	$scope.load();
}

function CreateUserController ($rootScope, $scope, $state, $timeout, $modal, UserService) {
	var timeoutNikPromise, timeoutEmailPromise
	$scope.input = {}
	$scope.input.userJobs = []
	$scope.years = {}
	$scope.months = {}
	$scope.days = {}
	$scope.validated = false

	$scope.load = function () {
		$scope.hidePassword = true
		$scope.years =  generateYear()
	}

	$scope.$watch('input.nik', function () {
		var validInput = $scope.UserForm.nik.$invalid
		var dirtyInput = $scope.UserForm.nik.$dirty
		
		if (!validInput && dirtyInput) {
			$timeout.cancel(timeoutNikPromise)
			$scope.loadingNik = true;
			timeoutNikPromise = $timeout(function() {
				UserService
					.validatingNik($scope.input)
					.then(function (response) {
						console.log(response.data);
						if (response.data.length > 0) {
							$scope.existNik = true
						} else {
							$scope.existNik = false
						}
						$scope.loadingNik = false;
					})
			}, 1000)
		}		
	})

	$scope.$watch('input.email', function () {
		var validInput = $scope.UserForm.email.$invalid
		var dirtyInput = $scope.UserForm.email.$dirty
		
		if (!validInput && dirtyInput) {
			$timeout.cancel(timeoutEmailPromise)
			$scope.loadingEmail = true;
			timeoutEmailPromise = $timeout(function() {
				UserService
					.validatingEmail($scope.input)
					.then(function (response) {
						console.log(response.data);
						if (response.data.length > 0) {
							$scope.existEmail = true
						} else {
							$scope.existEmail = false
						}
						$scope.loadingEmail = false;
					})
			}, 1000)
		}		
	})

	$scope.selectYear = function () {
		console.log('1')
		$scope.month = undefined;
		$scope.day = undefined;
		$scope.months = generateMonth()
		$scope.input.born = undefined
	}

	$scope.selectMonth = function () {
		console.log('2')
		$scope.day = undefined;
		$scope.days = generateDay($scope.year, $scope.month)
		$scope.input.born = undefined
	}

	$scope.selectDay = function () {
		$scope.input.born = new Date($scope.year.year, $scope.month - 1, $scope.day.day + 1)
	}

	$scope.addJob = function() {

    	var modalInstance = $modal.open({
      		animation: true,
      		templateUrl: 'app/admin/job/views/modal.html',
      		controller: 'CreateUserJobController',
      		resolve: {
        		userJobs: function () {
          			return $scope.input.userJobs;
        		}
      		}
    	})

    	modalInstance.result.then(function (userJobs) {
    		$rootScope.pushIfUnique($scope.input.userJobs, userJobs)
      		
    	}, function () {
      		//$log.info('Modal dismissed at: ' + new Date());
    	})
	}

	$scope.update = function (object, index) {
		var modalInstance = $modal.open({
      		animation: true,
      		templateUrl: 'app/admin/job/views/modal.html',
      		controller: 'UpdateUserJobController',
      		resolve: {
        		userJob: function () {
          			return object;
        		}
      		}
    	})

    	modalInstance.result.then(function (userJobs) {
    		if ($rootScope.findObject($scope.input.userJobs, userJobs) == -1) {
    			$scope.input.userJobs[index] = userJobs
    			
    		} else {
    			alert('Pekerjaan ini sudah bagian dari group')
    		}

    		
      		
    	}, function () {
      		//$log.info('Modal dismissed at: ' + new Date());
    	})
	}

	$scope.destroy = function (object, index) {
		var alert = confirm("Apakah Anda yakin ingin menghapus Job ini dari User?")
		if (alert == true) {
			$scope.input.userJobs.splice(index, 1);
		}
	}

	$scope.submit = function () {
		$scope.UserForm.nik.$setDirty();
		$scope.UserForm.name.$setDirty();
		$scope.UserForm.day.$setDirty();
		$scope.UserForm.address.$setDirty();
		$scope.UserForm.type.$setDirty();
		$scope.UserForm.email.$setDirty();
		$scope.UserForm.password.$setDirty();
		$scope.UserForm.confirmation.$setDirty();

		if ($scope.UserForm.$valid) {
			UserService
				.store($scope.input)
				.then(function () {
					$state.go('main.admin.user')
				})
		} else {
			$scope.validated = true;
		}
	}

	$scope.load();
}

function UpdateUserController ($scope, $state, $stateParams, $timeout, $modal, UserService, UserJobService) {

	$scope.input = {}
	$scope.input.userJobs = []
	$scope.input.userJobs.department = {}
	$scope.input.userJobs.university = {}
	$scope.years = {}//[{no: 1, year:'2015'}, {no: 2, year:'2014'}, {no: 3, year:'2013'}]
	$scope.months = {}
	$scope.days = {}

	$scope.month = {}

	$scope.tanggal = NaN

	$scope.loadJob = function () {
		UserJobService
			.get($stateParams.userId)
			.then(function (response) {
				$scope.input.userJobs = response.data
			})
	}

	$scope.load = function () {
		$scope.hidePassword = false

		$scope.years =  generateYear()
		$scope.months = generateMonth()

		UserService
			.show($stateParams.userId)
			.then(function (response) {
				$scope.input = response.data;
			 	$scope.input.born = new Date($scope.input.born)
			 	$scope.year = {year: $scope.input.born.getFullYear()}
			 	
			 	$scope.month = $scope.input.born.getMonth() + 1
			 	$scope.days = generateDay($scope.year.year, $scope.month)

			 	var dt = $scope.input.born;
			 	tanggal = dt.getDate()
			 	$scope.day = {day: tanggal}

			 	$scope.loadJob();
			})

		
		
	}

	$scope.$watch('input.nik', function () {
		var validInput = $scope.UserForm.nik.$invalid
		var dirtyInput = $scope.UserForm.nik.$dirty
		
		if (!validInput && dirtyInput) {
			$timeout.cancel(timeoutNikPromise)
			$scope.loadingNik = true;
			timeoutNikPromise = $timeout(function() {
				UserService
					.validatingNik($scope.input)
					.then(function (response) {
						console.log(response.data);
						if (response.data.length > 0) {
							$scope.existNik = true
						} else {
							$scope.existNik = false
						}
						$scope.loadingNik = false;
					})
			}, 1000)
		}		
	})

	$scope.$watch('input.email', function () {
		var validInput = $scope.UserForm.email.$invalid
		var dirtyInput = $scope.UserForm.email.$dirty
		
		if (!validInput && dirtyInput) {
			$timeout.cancel(timeoutEmailPromise)
			$scope.loadingEmail = true;
			timeoutEmailPromise = $timeout(function() {
				UserService
					.validatingEmail($scope.input)
					.then(function (response) {
						console.log(response.data);
						if (response.data.length > 0) {
							$scope.existEmail = true
						} else {
							$scope.existEmail = false
						}
						$scope.loadingEmail = false;
					})
			}, 1000)
		}		
	})

	$scope.selectYear = function () {
		console.log('1')
		$scope.month = undefined;
		$scope.day = undefined;
		$scope.months = generateMonth()
		$scope.input.born = undefined
	}

	$scope.selectMonth = function () {
		console.log('2')
		$scope.day = undefined;
		$scope.days = generateDay($scope.year, $scope.month)
		$scope.input.born = undefined
	}

	$scope.selectDay = function () {
		$scope.input.born = new Date($scope.year.year, $scope.month - 1, $scope.day.day + 1)
	}

	$scope.addJob = function() {

    	var modalInstance = $modal.open({
      		animation: true,
      		templateUrl: 'app/admin/job/views/modal.html',
      		controller: 'CreateUserJobController',
      		resolve: {
        		userJobs: function () {
          			return $scope.input.userJobs;
        		}
      		}
    	})

    	modalInstance.result.then(function (userJobs) {

			UserJobService
				.store({user_id: $stateParams.userId, job_id: userJobs.job.id})
				.then(function () {
					$scope.loadJob();
				}, function() {
					alert('User ini telah memiliki Job yang dimaksud');
				})
    		
      		
    	}, function () {
      		//$log.info('Modal dismissed at: ' + new Date());
    	})
	}

	$scope.update = function (object, index) {
		var modalInstance = $modal.open({
      		animation: true,
      		templateUrl: 'app/admin/job/views/modal.html',
      		controller: 'UpdateUserJobController',
      		resolve: {
        		userJob: function () {
          			return object;
        		}
      		}
    	})

    	modalInstance.result.then(function (userJobs) {

			UserJobService
				.update({id: object.id, user_id: $stateParams.userId, job_id: userJobs.job.id})
				.then(function () {
					$scope.loadJob();
				}, function() {
					alert('User ini telah memiliki Job yang dimaksud');
				})

      		
    	}, function () {
      		//$log.info('Modal dismissed at: ' + new Date());
    	})
	}

	$scope.destroy = function (object, index) {
		var alert = confirm("Apakah Anda yakin ingin menghapus Job ini dari User?")
		if (alert == true) {
			UserJobService
				.destroy({id: object.id})
				.then(function() {
					$scope.loadJob();
				})
		}
	}

	$scope.submit = function () {
		$scope.UserForm.nik.$setDirty();
		$scope.UserForm.name.$setDirty();
		$scope.UserForm.day.$setDirty();
		$scope.UserForm.address.$setDirty();
		$scope.UserForm.type.$setDirty();
		$scope.UserForm.email.$setDirty();

		if ($scope.UserForm.$valid) {
			UserService
				.update($scope.input)
				.then(function () {
					$state.go('main.admin.user')
				})
		} else {
			$scope.validated = true;
		}
	}

	$scope.load();
}

function CreateUserJobController ($scope, $state, $modalInstance, userJobs, UniversityService, DepartmentService, JobService) {
	$scope.input = {}
	$scope.universities = []
	$scope.departments = []
	$scope.jobs = []
	$scope.validated = false
	$scope.exsistJob = false;

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

	$scope.selectJob = function (request) {
		if ($scope.input.job.id) {
			$scope.loadingJob = true
				JobService
				.users(request.id)
				.then(function (response) {

					if (response.data.multiple == 0 && response.data.users.length > 0) {
						$scope.occupied = response.data.users[0].name;
					} else {
						$scope.occupied = undefined;
					}
					$scope.loadingJob = false;
				})
		}
			
	}

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

function UpdateUserJobController($scope, $state, $modalInstance, userJob, UniversityService, DepartmentService, JobService) {
	
	$scope.input = {}
	$scope.universities = []
	$scope.departments = []
	$scope.jobs = []
	$scope.userJob = userJob
	$scope.validated = false
	$scope.exsistJob = false;

	$scope.load = function () {
		$scope.loadingUniversity = true

			UniversityService
				.get()
				.then(function (response) {
					$scope.universities = response;
					$scope.university = $scope.universities[findObject($scope.universities, $scope.userJob.job.department.university)];
					$scope.hasUniversity = true
					$scope.loadingUniversity = false
					$scope.loadingDepartment = true

					DepartmentService
						.university($scope.university.id)
						.then(function (response) {
							$scope.departments = response.data
							$scope.department = $scope.departments[findObject($scope.departments, $scope.userJob.job.department)];
							$scope.hasDepartment = true
							$scope.loadingDepartment = false
							$scope.loadingJob = true

							JobService
								.department($scope.department.id)
								.then(function (response) {
									$scope.jobs = response.data;
									$scope.input.job =  $scope.jobs[findObject($scope.jobs, $scope.userJob.job)];
									console.log($scope.userJob.job)
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

	$scope.selectJob = function (request) {
		if ($scope.input.job.id) {
			$scope.loadingJob = true
				JobService
				.users(request.id)
				.then(function (response) {

					if (response.data.multiple == 0 && response.data.users.length > 0) {
						$scope.occupied = response.data.users[0].name;
					} else {
						$scope.occupied = undefined;
					}
					$scope.loadingJob = false;
				})
		}
			
	}

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