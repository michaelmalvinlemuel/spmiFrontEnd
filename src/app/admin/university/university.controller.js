(function () {
	
	angular.module('spmiFrontEnd')
		.controller('UniversityController', ['$scope', '$state', 'UniversityService', UniversityController])
		.controller('CreateUniversityController', ['$scope', '$state', '$timeout', 'UniversityService', CreateUniversityController])
		.controller('UpdateUniversityController', ['$scope', '$state', '$stateParams', '$timeout', 'UniversityService', UpdateUniversityController])
})();



function UniversityController ($scope, $state, UniversityService) {
	$scope.universities = []

	$scope.load = function () {
		UniversityService
			.get()
			.then(function (response) {
				console.log(response);
				$scope.universities = response
			})
	}

	$scope.update = function (request) {
		$state.go('main.admin.university.update', {universityId: request})
	}

	$scope.destroy = function (request) {
		var alert = confirm("Apakah Anda yakin ingin menghapus Universitas ini?")
		if (alert == true) {
			UniversityService
				.destroy({id: request})
				.then($scope.load())
		}
	}

	$scope.load()
}

function CreateUniversityController ($scope, $state, $timeout, UniversityService) {
	var timeoutPromise;
	$scope.input = {}
	$scope.validated = false;


	$scope.load = function() {

	}

	$scope.$watch('input.name', function () {
		var validName = $scope.UniversityForm.name.$invalid
		var dirtyName = $scope.UniversityForm.name.$dirty
		
		if (!validName && dirtyName) {
			$timeout.cancel(timeoutPromise)
			$scope.loading = true;
			timeoutPromise = $timeout(function() {
				UniversityService
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
		$scope.UniversityForm.name.$setDirty();
		$scope.UniversityForm.address.$setDirty();
		$scope.UniversityForm.phone.$setDirty();
		$scope.UniversityForm.fax.$setDirty();

		if ($scope.UniversityForm.$valid) {
			UniversityService
				.store($scope.input)
				.then(function () {
					$state.go('main.admin.university')
				})
		} else {
			$scope.validated = true;
		}
	}

	$scope.load();

}

function UpdateUniversityController ($scope, $state, $stateParams, $timeout, UniversityService) {
	var timeoutPromise;
	$scope.input = {}
	$scope.validated = false;

	$scope.load = function() {
		UniversityService
			.show($stateParams.universityId)
			.then(function (response) {
				$scope.input = response.data;
			})
	}

	$scope.$watch('input.name', function () {
		var validName = $scope.UniversityForm.name.$invalid
		var dirtyName = $scope.UniversityForm.name.$dirty
		
		if (!validName && dirtyName) {
			$timeout.cancel(timeoutPromise)
			$scope.loading = true;
			timeoutPromise = $timeout(function() {
				UniversityService
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
		$scope.UniversityForm.name.$setDirty();
		$scope.UniversityForm.address.$setDirty();
		$scope.UniversityForm.phone.$setDirty();
		$scope.UniversityForm.fax.$setDirty();

		if ($scope.UniversityForm.$valid) {
			UniversityService
				.update($scope.input) 
				.then(function (response) {
						$state.go('main.admin.university')
				})
		} else {
			$scope.validated = true;
		}
		
	}

	$scope.load();
}




