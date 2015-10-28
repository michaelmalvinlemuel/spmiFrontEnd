(function () {

	angular
		.module('spmiFrontEnd')
		.controller('SemesterController', ['$scope', '$state', 'SemesterService', SemesterController])
		.controller('CreateSemesterController', ['$scope', '$state', '$timeout', 'SemesterService', CreateSemesterController])
		.controller('UpdateSemesterController', ['$scope', '$state', '$stateParams', '$timeout', 'SemesterService', UpdateSemesterController])

})();




function SemesterController ($scope, $state, SemesterService) {
	$scope.semesters = [];

	$scope.load = function() {
		SemesterService
			.get()
			.then(function (response) {
				$scope.semesters = response.data;

				for (var i = 0 ; i < $scope.semesters.length ; i++) {
					$scope.semesters[i].date_start = moment($scope.semesters[i].date_start).format('DD-MM-YYYY');
					$scope.semesters[i].date_ended = moment($scope.semesters[i].date_ended).format('DD-MM-YYYY');
				}
			})
	}

	$scope.update = function (request) {
		$state.go('main.admin.semester.update', {semesterId: request});
	}

	$scope.destroy = function (request) {
		var alert = confirm('Apakah anda yakin ingin menghapus semester ini?');
		if (alert == true) {
			SemesterService
				.destroy({id: request})
				.then(function() {
					$scope.load();
				})
		}
	}

	$scope.load();
}

function CreateSemesterController ($scope, $state, $timeout, SemesterService) {
	$scope.input = {}
	$scope.validated = false;
	$scope.invalidYear = true;
	$scope.status = {};

	$scope.minDateStart = undefined;
	$scope.maxDateStart = undefined;

	$scope.minDateEnded = undefined;
	$scope.maxDateEnded = undefined;

	$scope.rangeIntersectStart = {status: false, semester: undefined};
	$scope.rangeIntersectEnded = {status: false, semester: undefined};

	$scope.include = {status: false, semester: undefined}

	$scope.load = function() {

	}

	$scope.$watchGroup(['input.year_start', 'input.year_ended'], function () {

		if ($scope.input.year_ended == $scope.input.year_start + 1) {
			$scope.invalidYear = false;

			$scope.minDateStart = new Date('1-1-' + $scope.input.year_start);
			$scope.maxDateStart = new Date('12-31-' + $scope.input.year_ended);

			$scope.input.date_start = undefined//$scope.minDateStart;

			$scope.minDateEnded = new Date('1-1-' + $scope.input.year_start);
			$scope.maxDateEnded = new Date('12-31-' + $scope.input.year_ended);

			$scope.input.date_ended = undefined//$scope.minDateEnded;
		} else {
			$scope.invalidYear = true;
		}
	})

	$scope.pickStart = function() {
		SemesterService
			.intersect({id: undefined, date: $scope.input.date_start})
			.then(function (response) {
				if (response.data.length > 0) {
					var semester = response.data[0];
					switch (semester.type) {
						case '1':
							semester.type = "Ganjil"
						break;

						case '2': 
							semester.type = "Genap"
						break;
						
						case '3':
							semester.type = "Pendek"
						break;
					}
					$scope.rangeIntersectStart.status = true;
					$scope.rangeIntersectStart.semester = 'Semester ' + semester.type + ' ' + semester.year_start + '/' + semester.year_ended;
				} else {
					if ($scope.input.date_start > $scope.input.date_ended) {
						$scope.input.date_ended = undefined;
					} 
					$scope.minDateEnded = $scope.input.date_start
					$scope.rangeIntersectStart.status = false;

				}
				
			})
		
	}

	$scope.pickEnded = function() {
		SemesterService
			.intersect({id: undefined, date: $scope.input.date_ended})
			.then(function (response) {
				if (response.data.length > 0) {
					var semester = response.data[0];
					switch (semester.type) {
						case '1':
							semester.type = "Ganjil"
						break;

						case '2': 
							semester.type = "Genap"
						break;
						
						case '3':
							semester.type = "Pendek"
						break;
					}
					$scope.rangeIntersectEnded.status = true;
					$scope.rangeIntersectEnded.semester = 'Semester ' + semester.type + ' ' + semester.year_start + '/' + semester.year_ended;
				} else {
					if($scope.input.date_ended < $scope.input.date_start) {
						$scope.input.date_start = undefined;
					}
					$scope.maxDateStart = $scope.input.date_ended
					$scope.rangeIntersectEnded.status = false;
				}
				
			})
	}

	$scope.$watchGroup(['input.date_start', 'input.date_ended'], function() {
		SemesterService
			.included($scope.input)
			.then(function(response) {
				if (response.data.length > 0) {
					var semester = response.data[0]
					switch (semester.type) {
						case '1':
							semester.type = "Ganjil"
						break;

						case '2': 
							semester.type = "Genap"
						break;
						
						case '3':
							semester.type = "Pendek"
						break;
					}
					$scope.include.status = true;
					$scope.include.semester = 'Semester ' + semester.type + ' ' + semester.year_start + '/' + semester.year_ended;
				} else {
					$scope.include = {status: false, semester: undefined}
				}
			})
	})

	$scope.submit = function () {
		$scope.SemesterForm.year_start.$setDirty();
		$scope.SemesterForm.year_ended.$setDirty();
		$scope.SemesterForm.type.$setDirty();
		$scope.SemesterForm.date_start.$setDirty();
		$scope.SemesterForm.date_ended.$setDirty();
		
		if ($scope.SemesterForm.$valid && $scope.input.type && !$scope.include.status && !$scope.rangeIntersectStart.status && 
			!$scope.rangeIntersectEnded.status) {

			SemesterService
				.store($scope.input)
				.then(function (response) {
					console.log(response)
					$state.go('main.admin.semester')
				})
			
		} else {
			$scope.validated = true;
		}
	}

	$scope.today = function() {
		$scope.input.start = new Date();
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

	$scope.load();
}

function UpdateSemesterController ($scope, $state, $stateParams, $timeout, SemesterService) {
	$scope.input = {}
	$scope.validated = false;
	$scope.invalidYear = true;
	$scope.status = {};

	$scope.minDateStart = undefined;
	$scope.maxDateStart = undefined;

	$scope.minDateEnded = undefined;
	$scope.maxDateEnded = undefined;

	$scope.rangeIntersectStart = {status: false, semester: undefined};
	$scope.rangeIntersectEnded = {status: false, semester: undefined};

	$scope.include = {status: false, semester: undefined}
	

	$scope.load = function() {
		
		$scope.updatePristine = true;

		SemesterService
			.show($stateParams.semesterId)
			.then(function (response) {
				response.data.year_start = Number(response.data.year_start);
				response.data.year_ended = Number(response.data.year_ended);
				response.data.date_start = new Date(response.data.date_start);
				response.data.date_ended = new Date(response.data.date_ended);

				$scope.input = response.data;

				$scope.input.date_start = new Date(response.data.date_start);
				$scope.input.date_ended = new Date(response.data.date_ended);

				$scope.minDateStart = new Date('1-1-' + $scope.input.year_start);
				$scope.maxDateStart = new Date('12-31-' + $scope.input.year_ended);

				$scope.minDateEnded = new Date($scope.input.date_start);
				$scope.maxDateEnded = new Date('12-31-' + $scope.input.year_ended);

				$scope.updatePristine = true
				$scope.invalidYear = false;

				$scope.SemesterForm.year_start.$setDirty();
				$scope.SemesterForm.year_ended.$setDirty();
				$scope.SemesterForm.type.$setDirty();
				$scope.SemesterForm.date_start.$setDirty();
				$scope.SemesterForm.date_ended.$setDirty();

				$scope.pickStart();
				$scope.pickEnded();
			})
	}

	$scope.$watchGroup(['input.year_start', 'input.year_ended'], function () {

		if ($scope.input.year_ended == $scope.input.year_start + 1 && $scope.updatePristine == true) {
			$scope.invalidYear = false;

			//$scope.updatePristine = !$scope.updatePristine
		} 

		if ($scope.input.year_ended == $scope.input.year_start + 1 && $scope.updatePristine == false) {
			$scope.invalidYear = false;

			$scope.minDateStart = new Date('1-1-' + $scope.input.year_start);
			$scope.maxDateStart = new Date('12-31-' + $scope.input.year_ended);

			$scope.input.date_start = undefined//$scope.minDateStart;

			$scope.minDateEnded = new Date('1-1-' + $scope.input.year_start);
			$scope.maxDateEnded = new Date('12-31-' + $scope.input.year_ended);

			$scope.input.date_ended = undefined//$scope.minDateEnded;

		}

		if ($scope.input.year_ended !== $scope.input.year_start + 1) {
			$scope.invalidYear = true;
			$scope.updatePristine = false
		} 
	})

	$scope.pickStart = function() {
		SemesterService
			.intersect({id: $stateParams.semesterId , date: $scope.input.date_start})
			.then(function (response) {
				if (response.data.length > 0) {
					var semester = response.data[0];
					switch (semester.type) {
						case '1':
							semester.type = "Ganjil"
						break;

						case '2': 
							semester.type = "Genap"
						break;
						
						case '3':
							semester.type = "Pendek"
						break;
					}
					$scope.rangeIntersectStart.status = true;
					$scope.rangeIntersectStart.semester = 'Semester ' + semester.type + ' ' + semester.year_start + '/' + semester.year_ended;
				} else {
					if ($scope.input.date_start > $scope.input.date_ended) {
						$scope.input.date_ended = undefined;
					} 
					$scope.minDateEnded = $scope.input.date_start
					$scope.rangeIntersectStart.status = false;

				}
				
			})
		
	}

	$scope.pickEnded = function() {
		SemesterService
			.intersect({id: $stateParams.semesterId , date: $scope.input.date_ended})
			.then(function (response) {
				if (response.data.length > 0) {
					var semester = response.data[0];
					switch (semester.type) {
						case '1':
							semester.type = "Ganjil"
						break;

						case '2': 
							semester.type = "Genap"
						break;
						
						case '3':
							semester.type = "Pendek"
						break;
					}
					$scope.rangeIntersectEnded.status = true;
					$scope.rangeIntersectEnded.semester = 'Semester ' + semester.type + ' ' + semester.year_start + '/' + semester.year_ended;
				} else {
					if($scope.input.date_ended < $scope.input.date_start) {
						$scope.input.date_start = undefined;
					}
					$scope.maxDateStart = $scope.input.date_ended
					$scope.rangeIntersectEnded.status = false;
				}
				
			})
	}

	$scope.$watchGroup(['input.date_start', 'input.date_ended'], function() {
		SemesterService
			.included($scope.input)
			.then(function(response) {
				if (response.data.length > 0) {
					var semester = response.data[0]
					switch (semester.type) {
						case '1':
							semester.type = "Ganjil"
						break;

						case '2': 
							semester.type = "Genap"
						break;
						
						case '3':
							semester.type = "Pendek"
						break;
					}
					$scope.include.status = true;
					$scope.include.semester = 'Semester ' + semester.type + ' ' + semester.year_start + '/' + semester.year_ended;
				} else {
					$scope.include = {status: false, semester: undefined}
				}
			})
	})

	$scope.submit = function () {
		$scope.SemesterForm.year_start.$setDirty();
		$scope.SemesterForm.year_ended.$setDirty();
		$scope.SemesterForm.type.$setDirty();
		$scope.SemesterForm.date_start.$setDirty();
		$scope.SemesterForm.date_ended.$setDirty();
		
		if ($scope.SemesterForm.$valid && $scope.input.type && !$scope.include.status && !$scope.rangeIntersectStart.status && 
			!$scope.rangeIntersectEnded.status) {

			SemesterService
				.update($scope.input)
				.then(function (response) {
					console.log(response)
					$state.go('main.admin.semester')
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

	$scope.load();
}

