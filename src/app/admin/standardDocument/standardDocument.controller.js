(function() {

	angular.module('spmiFrontEnd')
		.controller('StandardDocumentController', ['$scope', '$state', 'StandardDocumentService', StandardDocumentController])
		.controller('CreateStandardDocumentController', ['$scope', '$state', '$timeout', 'StandardService', 'StandardDocumentService', CreateStandardDocumentController])
		.controller('UpdateStandardDocumentController', ['$scope', '$state', '$stateParams', '$timeout', 'StandardService', 'StandardDocumentService', UpdateStandardDocumentController])

})()


function StandardDocumentController ($scope, $state, StandardDocumentService) {
	$scope.documents = []
	$scope.requiredUpload = true;

	$scope.load = function () {
		StandardDocumentService
			.get()
			.then(function (response) {
				$scope.documents = response.data;
			})
	}

	$scope.update = function (request) {
		$state.go('main.admin.standarddocument.update', {standarddocumentId: request})
	}

	$scope.destroy = function (request) {
		var alert = confirm("apakah anda yankin ingin menghapus Standard Dokumen ini?")
		if (alert == true) {
			StandardDocumentService
				.destroy({id: request})
				.then(function () {
					$scope.load();
				})
		}
	}

	$scope.load()
}

function CreateStandardDocumentController ($scope, $state, $timeout, StandardService, StandardDocumentService) {
	var timeoutNoPromise, timeoutDescriptionPromise
	$scope.input = {}
	$scope.standards = {}
	$scope.validated = false;

	$scope.load = function () {
		$scope.requiredUpload = true;

		$scope.today();
		$scope.toggleMin();

		StandardService
			.get()
			.then(function (response) {
				$scope.standards = response.data;
			})
	}

	$scope.$watch('input.no', function () {
		var validInput = $scope.StandardDocumentForm.no.$invalid
		var dirtyInput = $scope.StandardDocumentForm.no.$dirty
		
		if (!validInput && dirtyInput) {
			$timeout.cancel(timeoutNoPromise)
			$scope.loadingNo = true;
			timeoutNoPromise = $timeout(function() {
				StandardDocumentService
					.validatingNo($scope.input)
					.then(function (response) {
						console.log(response.data);
						if (response.data.length > 0) {
							$scope.existNo = true
						} else {
							$scope.existNo = false
						}
						$scope.loadingNo = false;
					})
			}, 1000)
		}		
	})

	$scope.$watch('input.description', function () {
		var validInput = $scope.StandardDocumentForm.description.$invalid
		var dirtyInput = $scope.StandardDocumentForm.description.$dirty
		
		if (!validInput && dirtyInput) {
			$timeout.cancel(timeoutDescriptionPromise)
			$scope.loadingDescription = true;
			timeoutDescriptionPromise = $timeout(function() {
				StandardDocumentService
					.validatingDescription($scope.input)
					.then(function (response) {
						console.log(response.data);
						if (response.data.length > 0) {
							$scope.existDescription = true
						} else {
							$scope.existDescription = false
						}
						$scope.loadingDescription = false;
					})
			}, 1000)
		}		
	})

	$scope.submit = function (file) {
		$scope.StandardDocumentForm.standard_id.$setDirty();
		$scope.StandardDocumentForm.no.$setDirty();
		$scope.StandardDocumentForm.date.$setDirty();
		$scope.StandardDocumentForm.description.$setDirty();
		$scope.StandardDocumentForm.file.$setDirty();

		if ($scope.StandardDocumentForm.$valid) {
			StandardDocumentService
				.store($scope.input, file)
				.then(function () {
					$state.go('main.admin.standarddocument')
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

function UpdateStandardDocumentController ($scope, $state, $stateParams, $timeout, StandardService, StandardDocumentService) {
	var timeoutNoPromise, timeoutDescriptionPromise
	$scope.input = {}
	$scope.standards = {}
	$scope.validated = false;

	$scope.load = function () {
		$scope.toggleMin();
		$scope.requiredUpload = false;
		$scope.loadingStandard = true
		StandardService
			.get()
			.then(function (response) {
				$scope.standards = response.data;
				$scope.loadingStandard = false

				StandardDocumentService
					.show($stateParams.standarddocumentId)
					.then(function (response) {
						$scope.input = response.data;
						$scope.input.date = new Date($scope.input.date);
					})
			})

	}

	$scope.$watch('input.no', function () {
		var validInput = $scope.StandardDocumentForm.no.$invalid
		var dirtyInput = $scope.StandardDocumentForm.no.$dirty
		
		if (!validInput && dirtyInput) {
			$timeout.cancel(timeoutNoPromise)
			$scope.loadingNo = true;
			timeoutNoPromise = $timeout(function() {
				StandardDocumentService
					.validatingNo($scope.input)
					.then(function (response) {
						console.log(response.data);
						if (response.data.length > 0) {
							$scope.existNo = true
						} else {
							$scope.existNo = false
						}
						$scope.loadingNo = false;
					})
			}, 1000)
		}		
	})

	$scope.$watch('input.description', function () {
		var validInput = $scope.StandardDocumentForm.description.$invalid
		var dirtyInput = $scope.StandardDocumentForm.description.$dirty
		
		if (!validInput && dirtyInput) {
			$timeout.cancel(timeoutDescriptionPromise)
			$scope.loadingDescription = true;
			timeoutDescriptionPromise = $timeout(function() {
				StandardDocumentService
					.validatingDescription($scope.input)
					.then(function (response) {
						console.log(response.data);
						if (response.data.length > 0) {
							$scope.existDescription = true
						} else {
							$scope.existDescription = false
						}
						$scope.loadingDescription = false;
					})
			}, 1000)
		}		
	})

	$scope.submit = function (file) {
		$scope.StandardDocumentForm.standard_id.$setDirty();
		$scope.StandardDocumentForm.no.$setDirty();
		$scope.StandardDocumentForm.date.$setDirty();
		$scope.StandardDocumentForm.description.$setDirty();
		$scope.StandardDocumentForm.file.$setDirty();

		if ($scope.StandardDocumentForm.$valid) {
			StandardDocumentService
				.update($scope.input, file)
				.then(function () {
					$state.go('main.admin.standarddocument');
				})
		} else {
			$scope.validated = true;
		}
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