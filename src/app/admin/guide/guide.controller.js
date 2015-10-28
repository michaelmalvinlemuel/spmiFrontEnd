(function () {

	angular
		.module('spmiFrontEnd')
		.controller('GuideController', ['$scope', '$state', 'GuideService', GuideController])
		.controller('CreateGuideController', ['$scope', '$state', '$timeout', 'StandardService', 'StandardDocumentService', 'GuideService', CreateGuideController])
		.controller('UpdateGuideController', ['$scope', '$state', '$stateParams', '$timeout', 'StandardService', 'StandardDocumentService', 'GuideService', UpdateGuideController])

})()



function GuideController ($scope, $state, GuideService) {
	$scope.guides = []

	$scope.load = function () {
		GuideService
			.get()
			.then(function (response) {
				$scope.guides = response.data;
			})
	}

	$scope.update = function (request) {
		$state.go('main.admin.guide.update', {guideId: request});
	}

	$scope.destroy = function (request) {
		var alert = confirm("Apakah anda yakin ingin menghapus Dokumen Pedoman ini?")
		if (alert == true) {
			GuideService
				.destroy({id: request})
				.then(function () {
					$scope.load();
				})
		}
	}

	$scope.load()
}

function CreateGuideController ($scope, $state, $timeout, StandardService, StandardDocumentService, GuideService) {
	var timeoutNoPromise, timeoutDescriptionPromise
	$scope.input = {}
	$scope.standards = {}
	$scope.standarddocuments = {}
	$scope.standards = {}
	$scope.validated = false;
	$scope.requiredUpload = true


	$scope.load = function () {
		$scope.today();
		$scope.loadingStandard = true;

		StandardService
			.get()
			.then(function (response) {
				$scope.standards = response.data;
				$scope.hasStandard = true;
				$scope.loadingStandard = false
			})
	}

	$scope.select = function (id) {
		$scope.loadingStandardDocument = true
		StandardDocumentService
			.standard(id)
			.then(function (response) {
				$scope.standarddocuments = response.data;
				$scope.loadingStandardDocument = false
				if (response.data.length > 0) {
					$scope.hasStandard = true
				} else {
					$scope.hasStandard = false
				}
			})
	}


	$scope.$watch('input.no', function () {
		var validInput = $scope.GuideForm.no.$invalid
		var dirtyInput = $scope.GuideForm.no.$dirty
		
		if (!validInput && dirtyInput) {
			$timeout.cancel(timeoutNoPromise)
			$scope.loadingNo = true;
			timeoutNoPromise = $timeout(function() {
				GuideService
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
		var validInput = $scope.GuideForm.description.$invalid
		var dirtyInput = $scope.GuideForm.description.$dirty
		
		if (!validInput && dirtyInput) {
			$timeout.cancel(timeoutDescriptionPromise)
			$scope.loadingDescription = true;
			timeoutDescriptionPromise = $timeout(function() {
				GuideService
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
		$scope.GuideForm.standard_id.$setDirty();
		$scope.GuideForm.standard_document_id.$setDirty();
		$scope.GuideForm.no.$setDirty();
		$scope.GuideForm.date.$setDirty();
		$scope.GuideForm.description.$setDirty();
		$scope.GuideForm.file.$setDirty();

		if ($scope.GuideForm.$valid) {
			GuideService
				.store($scope.input, file)
				.then(function() {
					$state.go('main.admin.guide');
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

function UpdateGuideController ($scope, $state, $stateParams, $timeout, StandardService, StandardDocumentService, GuideService) {
	var timeoutNoPromise, timeoutDescriptionPromise
	$scope.input = {}
	$scope.standards = {}
	$scope.standarddocuments = {}
	$scope.validated = false;
	$scope.requiredUpload = false

	$scope.load = function () {
		$scope.toggleMin();


		GuideService
			.show($stateParams.guideId)
			.then(function (response) {
				$scope.input = response.data;
				$scope.input.date = new Date($scope.input.date);

				$scope.standard_id = response.data.standard_document.standard.id;
				$scope.loadingStandard = true

				StandardService
					.get()
					.then(function (response) {
						$scope.standards = response.data;
						$scope.loadingStandard = false
						$scope.loadingStandardDocument = true

						StandardDocumentService
							.standard($scope.standard_id)
							.then(function (response) {
								$scope.standarddocuments = response.data;
								$scope.loadingStandardDocument = false
								$scope.hasStandard = true
						})

							
				})
		})
	}

	$scope.$watch('input.no', function () {
		var validInput = $scope.GuideForm.no.$invalid
		var dirtyInput = $scope.GuideForm.no.$dirty
		
		if (!validInput && dirtyInput) {
			$timeout.cancel(timeoutNoPromise)
			$scope.loadingNo = true;
			timeoutNoPromise = $timeout(function() {
				GuideService
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
		var validInput = $scope.GuideForm.description.$invalid
		var dirtyInput = $scope.GuideForm.description.$dirty
		
		if (!validInput && dirtyInput) {
			$timeout.cancel(timeoutDescriptionPromise)
			$scope.loadingDescription = true;
			timeoutDescriptionPromise = $timeout(function() {
				GuideService
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
		$scope.GuideForm.standard_id.$setDirty();
		$scope.GuideForm.no.$setDirty();
		$scope.GuideForm.date.$setDirty();
		$scope.GuideForm.description.$setDirty();
		$scope.GuideForm.file.$setDirty();

		if ($scope.GuideForm.$valid) {
			GuideService
				.update($scope.input, file)
				.then(function () {
					$state.go('main.admin.guide');
				})
		} else {
			$scope.validated = true;
		}
	}

	$scope.select = function (id) {
		$scope.loadingStandardDocument = true
		StandardDocumentService
			.standard(id)
			.then(function (response) {
				$scope.standarddocuments = response.data;
				$scope.loadingStandardDocument = false
				if (response.data.length > 0) {
					$scope.hasStandard = true
				} else {
					$scope.hasStandard = false
				}
			})
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