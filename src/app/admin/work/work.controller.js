(function () {

	angular
		.module('spmiFrontEnd')
		.controller('WorkController', ['$scope', '$state', 'WorkService', WorkController])
		.controller('CreateWorkController', ['$rootScope', '$scope', '$state', '$timeout', '$modal', 'GroupJobService', 'WorkService', CreateWorkController])
		.controller('UpdateWorkController', ['$rootScope', '$scope', '$state', '$stateParams', '$timeout', '$modal', 'GroupJobService', 'WorkService', 'WorkFormService', UpdateWorkController])
	
	Date.prototype.addHours = function(h) {
    	this.setHours(this.getHours()+h);
    	return this;
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
	
	function generateDay (month) {
		var tanggal = []
		if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
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
	
	
	
	function WorkController ($scope, $state, WorkService) {
		$scope.works = []
	
		$scope.load = function () {
			WorkService
				.get()
				.then(function (request) {
					$scope.works = request.data
				})
		}
	
		$scope.update = function (request) {
			$state.go('main.admin.work.update', {workId: request})
		}
	
		$scope.destroy = function (request) {
			var alert = confirm("Apakah Anda yakin ingin menghapus Tugas ini?");
			if (alert == true) {
				WorkService
					.destroy({id: request})
					.then(function () {
						$scope.load()
					})
			}
		}
	
		$scope.eventToggle = function (request) {
			WorkService
				.eventToggle(request)
				.then(function() {
					$scope.load();
				})
		}
	
		$scope.execute = function (request) {
			WorkService
				.execute(request)
				.then(function () {
					$scope.load()
				})
		}
	
		$scope.startAllEvent = function () {
			WorkService
				.startAllEvent()
				.then(function () {
					$scope.load();
				})
		}
	
		$scope.pauseAllEvent = function () {
			WorkService
				.pauseAllEvent()
				.then(function () {
					$scope.load();
				})
		}
	
		$scope.executeAllWork = function () {
			WorkService
				.executeAllWork()
				.then(function () {
					$scope.load();
				})
		}
	
		$scope.load()
	}
	
	function CreateWorkController ($rootScope, $scope, $state, $timeout, $modal, GroupJobService, WorkService) {
		
	
		var timeoutNamePromise
		$scope.input = {}
		$scope.input.workForms = []
		$scope.status = {}
		//$scope.days = []
		$scope.days = {}
		$scope.dirtyDay = false
		$scope.dirtyWeek = false;
		$scope.validated = false;
	
		$scope.groupJobs = []
		$scope.dates = []
		$scope.months = {}
	
		$scope.load = function () {
	
			$scope.minDateStart = new Date()
			$scope.minDateEnded = $scope.minDateStart
			$scope.today();
			$scope.startDay = "Senin"	
			
			$scope.input.time_start = new Date()
	
			$scope.months = generateMonth();
	
			for (var i = 0 ; i < 28 ; i++) {
				$scope.dates.push({key: i, value: i + 1})
			}
			
			$scope.loadingGroupJob = true
			GroupJobService
				.get()
				.then(function (request) {
					$scope.groupJobs = request.data
					$scope.loadingGroupJob = false;
				})
	
		}
	
		$scope.$watch('input.name', function () {
			var validName = $scope.WorkForm.name.$invalid
			var dirtyName = $scope.WorkForm.name.$dirty
			
			if (!validName && dirtyName) {
				$timeout.cancel(timeoutNamePromise)
				$scope.loadingName = true;
				timeoutNamePromise = $timeout(function() {
					WorkService
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
	
		$scope.pickStart = function() {
			if ($scope.input.start > $scope.input.ended) {
				$scope.minDateEnded = $scope.input.start
				if ($scope.limit) {
					$scope.input.ended = $scope.input.start
				} else {
					$scope.input.ended = undefined
				}
				
			}
		}
	
		$scope.checkLimit = function() {
			if ($scope.limit) {
					$scope.input.ended = $scope.input.start
				} else {
					$scope.input.ended = undefined
				}
		}
	
		$scope.changeTime = function() {
		}
	
		$scope.$watch('input.type', function (newValue, oldValue, scope) {
			if ($scope.validated && newValue) {
	
				console.log(newValue)
				
				$timeout(function() {
					switch (newValue) {
						case "1":
							$scope.dirtyDay = true;
						break;
	
						case "2":
							$scope.WorkForm.day_start.$setDirty();
						break;
	
						case "3":
							$scope.WorkForm.date.$setDirty();
						break;
	
						case "4":
						break;
	
						case "5":
							$scope.WorkForm.month.$setDirty();
							$scope.WorkForm.dateMonth.$setDirty();
						break;
					}
				}, 0)
				
				
				
				
			}
		})
	
		$scope.$watchCollection('days', function () {
			$scope.dirtyDay = true
			$scope.input.days = [];
			angular.forEach($scope.days, function (key, value) {
				if (key) {
					$scope.input.days.push(value);
				}
			})
			if ($scope.input.days.length > 0) {
				$scope.hasDays = true
			} else {
				$scope.hasDays = false
			}
		})
	
		$scope.selectMonth = function () {
			$scope.datesMonth = generateDay($scope.input.month)
		}
	
		$scope.addForm = function () {
			var modalInstance = $modal.open({
				animation: true,
				templateUrl: 'app/admin/form/views/modal.html',
				controller: 'CreateModalFormController',
				resolve: {
					forms: function () {
						return $scope.input.workForms;
					}
				}
			})
	
			modalInstance.result.then(function (workForms) {
				$rootScope.pushIfUnique($scope.input.workForms, workForms)
				
			}, function () {
				//$log.info('Modal dismissed at: ' + new Date());
			})
		}
	
		$scope.update = function (object, index) {
			var modalInstance = $modal.open({
				animation: true,
				templateUrl: 'app/admin/form/views/modal.html',
				controller: 'UpdateModalFormController',
				resolve: {
					forms: function () {
						return object;
					}
				}
			})
	
			modalInstance.result.then(function (workForms) {
				if ($rootScope.findObject($scope.input.workForms, workForms) == -1) {
					$scope.input.workForms[index] = workForms
					
				} else {
					alert('Formulir ini sudah bagian dari pekerjaan')
				}
				
				
			}, function () {
				//$log.info('Modal dismissed at: ' + new Date());
			})
		}
	
		$scope.destroy = function (object, index) {
			var alert = confirm("Apakah Anda yakin ingin menghapus Formulir ini dari Pekerjaan?")
			if (alert == true) {
				$scope.input.workForms.splice(index, 1);
			}
		}
	
		$scope.submit = function () {
			$scope.WorkForm.name.$setDirty();
			$scope.WorkForm.description.$setDirty();
			$scope.WorkForm.group_job_id.$setDirty();
			$scope.WorkForm.start.$setDirty();
			if ($scope.limit) $scope.WorkForm.ended.$setDirty();
			$scope.WorkForm.type.$setDirty();
	
			//$scope.WorkForm.date.$setDirty();
	
			switch ($scope.input.type) {
				case "1":
					$scope.dirtyDay = true;
				break;
	
				case "2":
					$scope.WorkForm.day_start.$setDirty();
				break;
	
				case "3":
					$scope.WorkForm.date.$setDirty();
				break;
	
				case "4":
				break;
	
				case "5":
					$scope.WorkForm.month.$setDirty();
					$scope.WorkForm.dateMonth.$setDirty();
				break;
			}
	
			if ($scope.WorkForm.$valid && 
					(($scope.input.type == '1') && $scope.hasDays) || 
					(($scope.input.type == '2') && $scope.input.day_start) ||
					(($scope.input.type == '3') && $scope.input.date) ||
					(($scope.input.type == '4')) ||
					(($scope.input.type == '5') && $scope.input.month && $scope.input.dateMonth)) 
			{
	
				var dateStart = new Date($scope.input.start)
				var timeStart = new Date($scope.input.time_start)
	
				dateStart.setHours(timeStart.getHours())
				dateStart.setMinutes(timeStart.getMinutes())
				dateStart.addHours(7)
				dateStart.setSeconds(0);
	
				$scope.input.start = dateStart
	
				if ($scope.input.ended) {
					var dateEnded = new Date($scope.input.ended)
					dateEnded.setHours(timeStart.getHours())
					dateEnded.setMinutes(timeStart.getMinutes())
					dateEnded.addHours(7)
					dateEnded.setSeconds(0);
	
					$scope.input.ended = dateEnded
				}
	
				WorkService
					.store($scope.input)
					.then(function (response) {
						console.log(response)
						$state.go('main.admin.work')
					})
	
			} else {
				$scope.validated = true;
			}
		}
	
		$scope.today = function() {
			$scope.input.start = new Date();
			//$scope.input.ended = new Date();
		}
	
		$scope.toggleMin = function() {
			$scope.minDate = $scope.minDate ? null : new Date();
		};
	
		$scope.openStart = function($event) {
			$scope.status.openedStart = true;
		};
	
		$scope.openEnded = function($event) {
			$scope.status.openedEnded = true;
		};
	
		$scope.dateOptions = {
			formatYear: 'yy',
			startingDay: 1
		};
	
		$scope.statusStart = {
			openedStart: false
		};
	
		$scope.statusEnded = {
			openedEnded: false
		};
	
		$scope.load()
	}
	
	function UpdateWorkController ($rootScope, $scope, $state, $stateParams, $timeout, $modal, GroupJobService, WorkService, WorkFormService) {
	
		var timeoutNamePromise
		$scope.input = {}
		$scope.input.workForms = []
		$scope.status = {}
	
		$scope.days = {}
		$scope.dirtyDay = false
		$scope.dirtyWeek = false;
		$scope.validated = false;
	
		$scope.groupJobs = []
		$scope.dates = []
		$scope.months = {}
	
		$scope.loadForm = function () {
			WorkFormService
				.get($stateParams.workId)
				.then(function(response) {
					console.log(response.data)
					$scope.input.workForms = response.data
				})
		}
	
		$scope.load = function () {
			
			$scope.months = generateMonth();
	
			for (var i = 0 ; i < 28 ; i++) {
				$scope.dates.push({key: i, value: i + 1})
			}
	
			WorkService
				.show($stateParams.workId)
				.then(function (response) {
					$scope.input = response.data
					$scope.input.start = new Date($scope.input.start)
					if ($scope.input.ended) {
						$scope.limit = true
						$scope.input.ended = new Date($scope.input.ended)
					}
	
					//console.log(response.data.schedule.time_start)
					$scope.input.time_start = new Date(response.data.start);
					$scope.datesMonth = generateDay($scope.input.month)
	
					$timeout(function() {
						switch ($scope.input.type) {
							case "1":
								//console.log(response.data.schedule.time_start)
								$scope.input.days = []
								for (var i = 0 ; i < response.data.schedule[0].days.length ; i++) {
									console.log(response.data.schedule[0].days[i].day)
									$scope.input.days.push(response.data.schedule[0].days[i].day);
								}
								angular.forEach($scope.input.days, function (key, value) {
									$scope.days[key] = true; 
								})
							break;
	
							case "2":
								//$scope.WorkForm.day_start.$setDirty();
								$scope.input.day_start = response.data.schedule.day_start.toString()
	
							break;
	
							case "3":
								$scope.WorkForm.date.$setDirty();
								$scope.input.date = response.data.schedule.date_start
							break;
	
							case "4":
							break;
	
							case "5":
								$scope.WorkForm.month.$setDirty();
								$scope.WorkForm.dateMonth.$setDirty();
								$scope.input.month = response.data.schedule.month_start
								$scope.datesMonth = generateDay($scope.input.month)
								$scope.input.dateMonth = response.data.schedule.date_start
	
							break;
						}
					}, 0)
	
	
					GroupJobService
						.get()
						.then(function (response) {
							$scope.groupJobs = response.data
	
							//$scope.input.day_start = '2';
						})
					$scope.loadForm()
				})
			
			$scope.input.time_start = new Date()
		}
	
		$scope.$watch('input.name', function () {
			var validName = $scope.WorkForm.name.$invalid
			var dirtyName = $scope.WorkForm.name.$dirty
			
			if (!validName && dirtyName) {
				$timeout.cancel(timeoutNamePromise)
				$scope.loadingName = true;
				timeoutNamePromise = $timeout(function() {
					WorkService
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
	
		$scope.pickStart = function() {
			if ($scope.input.start > $scope.input.ended) {
				$scope.minDateEnded = $scope.input.start
				if ($scope.limit) {
					$scope.input.ended = $scope.input.start
				} else {
					$scope.input.ended = undefined
				}
				
			}
		}
	
		$scope.checkLimit = function() {
			if ($scope.limit) {
					$scope.input.ended = $scope.input.start
				} else {
					$scope.input.ended = undefined
				}
		}
	
		$scope.$watch('input.type', function (newValue, oldValue, scope) {
	
			$scope.input.date_start = new Date();
	
			if ($scope.validated && newValue) {
				console.log(newValue)
				
				$timeout(function() {
					switch (newValue) {
						case "1":
							$scope.dirtyDay = true;
						break;
	
						case "2":
							$scope.WorkForm.day_start.$setDirty();
						break;
	
						case "3":
							$scope.WorkForm.date.$setDirty();
						break;
	
						case "4":
						break;
	
						case "5":
							$scope.WorkForm.month.$setDirty();
							$scope.WorkForm.dateMonth.$setDirty();
						break;
					}
				}, 0)
				
				
				
				
			}
		})
	
		$scope.$watchCollection('days', function () {
			$scope.dirtyDay = true
			$scope.input.days = [];
			angular.forEach($scope.days, function (key, value) {
				if (key) {
					$scope.input.days.push(value);
				}
			})
	
			if ($scope.input.days.length > 0) {
				$scope.hasDays = true
			} else {
				$scope.hasDays = false
			}
		})
	
		$scope.selectMonth = function () {
			$scope.datesMonth = generateDay($scope.input.month)
		}
	
		$scope.addForm = function () {
			var modalInstance = $modal.open({
				animation: true,
				templateUrl: 'app/admin/form/views/modal.html',
				controller: 'CreateModalFormController',
				resolve: {
					forms: function () {
						return $scope.input.workForms;
					}
				}
			})
	
			modalInstance.result.then(function (workForms) {
				WorkFormService
					.store({work_id: $stateParams.workId, form_id: workForms.form.id})
					.then(function() {
						$scope.loadForm()
					}, function() {
						alert('Pekerjaan ini sudah memilki formulir yang dimaksud');
					})
				
			}, function () {
				//$log.info('Modal dismissed at: ' + new Date());
			})
		}
	
		$scope.update = function (object, index) {
			var modalInstance = $modal.open({
				animation: true,
				templateUrl: 'app/admin/form/views/modal.html',
				controller: 'UpdateModalFormController',
				resolve: {
					forms: function () {
						return object;
					}
				}
			})
	
			modalInstance.result.then(function (workForms) {
				console.log(workForms);
				WorkFormService
					.update({id: object.id, work_id: $stateParams.workId, form_id: workForms.form.id})
					.then(function() {
						$scope.loadForm()
					}, function() {
						alert('Pekerjaan ini sudah memilki formulir yang dimaksud');
					})
				
				
			}, function () {
				//$log.info('Modal dismissed at: ' + new Date());
			})
		}
	
		$scope.destroy = function (object, index) {
			var alert = confirm("Apakah Anda yakin ingin menghapus Formulir ini dari Pekerjaan?")
			if (alert == true) {
				WorkFormService
					.destroy({id: object.id})
					.then(function() {
						$scope.loadForm();
					})
			}
		}
	
		$scope.submit = function () {
			$scope.WorkForm.name.$setDirty();
			$scope.WorkForm.description.$setDirty();
			$scope.WorkForm.group_job_id.$setDirty();
			$scope.WorkForm.start.$setDirty();
			if ($scope.limit) $scope.WorkForm.ended.$setDirty();
			$scope.WorkForm.type.$setDirty();
	
			//$scope.WorkForm.date.$setDirty();
	
			switch ($scope.input.type) {
				case "1":
					$scope.dirtyDay = true;
				break;
	
				case "2":
					$scope.WorkForm.day_start.$setDirty();
				break;
	
				case "3":
					$scope.WorkForm.date.$setDirty();
				break;
	
				case "4":
				break;
	
				case "5":
					$scope.WorkForm.month.$setDirty();
					$scope.WorkForm.dateMonth.$setDirty();
				break;
			}
	
			if ($scope.WorkForm.$valid && 
					(($scope.input.type == '1') && $scope.hasDays) || 
					(($scope.input.type == '2') && $scope.input.day_start) ||
					(($scope.input.type == '3') && $scope.input.date) ||
					(($scope.input.type == '4')) ||
					(($scope.input.type == '5') && $scope.input.month && $scope.input.dateMonth)) 
			{
	
				var dateStart = new Date($scope.input.start)
				var timeStart = new Date($scope.input.time_start)
	
				dateStart.setHours(timeStart.getHours())
				dateStart.setMinutes(timeStart.getMinutes())
				dateStart.addHours(7)
				dateStart.setSeconds(0);
	
				$scope.input.start = dateStart
	
				if ($scope.input.ended) {
					var dateEnded = new Date($scope.input.ended)
					dateEnded.setHours(timeStart.getHours())
					dateEnded.setMinutes(timeStart.getMinutes())
					dateEnded.addHours(7)
					dateEnded.setSeconds(0);
	
					$scope.input.ended = dateEnded
				}
	
				WorkService
					.update($scope.input)
					.then(function () {
						$state.go('main.admin.work')
					})
	
			} else {
				$scope.validated = true;
			}
		}
	
		$scope.today = function() {
			$scope.input.start = new Date();
			//$scope.input.ended = new Date();
		}
	
		$scope.toggleMin = function() {
			$scope.minDate = $scope.minDate ? null : new Date();
		};
	
		$scope.openStart = function($event) {
			$scope.status.openedStart = true;
		};
	
		$scope.openEnded = function($event) {
			$scope.status.openedEnded = true;
		};
	
		$scope.dateOptions = {
			formatYear: 'yy',
			startingDay: 1
		};
	
		$scope.statusStart = {
			openedStart: false
		};
	
		$scope.statusEnded = {
			openedEnded: false
		};
	
		$scope.load()
	}
})()




