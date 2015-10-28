(function () {

	angular
		.module('spmiFrontEnd')
		.controller('StandardController', ['$scope', '$state', 'StandardService', StandardController])
		.controller('CreateStandardController', ['$scope', '$state', '$timeout', 'StandardService', CreateStandardController])
		.controller('UpdateStandardController', ['$scope', '$state', '$stateParams', '$timeout', 'StandardService', UpdateStandardController])

})();


function StandardController ($scope, $state, StandardService) {
	$scope.standards = []

	$scope.load = function () {
		StandardService
			.get()
			.then(function (response) {
				$scope.standards = response.data;
			})
	}

	$scope.update = function (request) {
		$state.go('main.admin.standard.update', {standardId: request})
	}

	$scope.destroy = function (request) {
		var alert = confirm("apakah anda yakin ingin menghapus standard ini?");
		if (alert == true) {
			StandardService
				.destroy({id: request})
				.then(function () {
					$scope.load();
				})
		}
	}

	$scope.search = function () {

	}


	$scope.load();
}

function CreateStandardController ($scope, $state, $timeout, StandardService) {
	var timeoutPromise
	$scope.input = {}
	$scope.validated = false;

	$scope.load = function () {
		$scope.today();
		$scope.toggleMin();
	}

	$scope.$watch('input.description', function () {
		var validName = $scope.StandardForm.description.$invalid
		var dirtyName = $scope.StandardForm.description.$dirty
		
		if (!validName && dirtyName) {
			$timeout.cancel(timeoutPromise)
			$scope.loading = true;
			timeoutPromise = $timeout(function() {
				StandardService
					.validating($scope.input)
					.then(function (response) {
						console.log(response.data);
						if (response.data.length > 0) {
							$scope.exist = true
						} else {
							$scope.exist = false
						}
						$scope.loading = false;
					})
			}, 1000)
		}		
	})


	$scope.submit = function () {

		$scope.StandardForm.date.$setDirty();
		$scope.StandardForm.description.$setDirty();

		if ($scope.StandardForm.$valid) {
			StandardService
				.store($scope.input)
				.then(function (response) {
					$state.go('main.admin.standard')
				})
		} else {
			$scope.validated = true;
		}

		
	}

	$scope.today = function() {
    	$scope.input.date = new Date();
  	};

  	$scope.toggleMin = function() {
    	$scope.minDate = $scope.minDate ? null : new Date();
  	};

  	$scope.open = function($event) {
    	$scope.status.opened = true;
  	};

  	$scope.dateOptions = {
    	formatYear: 'yy',
    	startingDay: 1
  	};

  	$scope.status = {
    	opened: false
  	};


	$scope.load();
}

function UpdateStandardController ($scope, $state, $stateParams, $timeout, StandardService) {
	var timeoutPromise
	$scope.input = {}
	$scope.validated = false;

	$scope.load = function () {
		$scope.loading = true
		StandardService
			.show($stateParams.standardId)
			.then(function (response) {
				console.log(response);
				$scope.input = response.data;
				$scope.input.date = new Date(response.data.date);
				$scope.loading = false;
			})
	}

	$scope.$watch('input.description', function () {
		var validName = $scope.StandardForm.description.$invalid
		var dirtyName = $scope.StandardForm.description.$dirty
		
		if (!validName && dirtyName) {
			$timeout.cancel(timeoutPromise)
			$scope.loading = true;
			timeoutPromise = $timeout(function() {
				StandardService
					.validating($scope.input)
					.then(function (response) {
						console.log(response.data);
						if (response.data.length > 0) {
							$scope.exist = true
						} else {
							$scope.exist = false
						}
						$scope.loading = false;
					})
			}, 1000)
		}		
	})

	$scope.submit = function () {
		$scope.StandardForm.date.$setDirty();
		$scope.StandardForm.description.$setDirty();

		if ($scope.StandardForm.$valid) {
			StandardService
				.update($scope.input)
				.then(function () {
					$state.go('main.admin.standard');
				})
		} else {
			$scope.validated = true;
		}

	}

	$scope.today = function() {
    	$scope.input.date = new Date();
  	}

  	$scope.toggleMin = function() {
    	$scope.minDate = $scope.minDate ? null : new Date();
  	};

  	$scope.open = function($event) {
    	$scope.status.opened = true;
  	};

  	$scope.dateOptions = {
    	formatYear: 'yy',
    	startingDay: 1
  	};

  	$scope.status = {
    	opened: false
  	};

	$scope.load();
}
