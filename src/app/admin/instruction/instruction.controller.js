(function () {

	angular
		.module('spmiFrontEnd')
		.controller('InstructionController', ['$scope', '$state', 'InstructionService', InstructionController])
		.controller('CreateInstructionController', ['$scope', '$state', '$timeout', 'StandardService', 'StandardDocumentService', 'GuideService', 'InstructionService', CreateInstructionController])
		.controller('UpdateInstructionController', ['$scope', '$state', '$stateParams', '$timeout', 'StandardService', 'StandardDocumentService', 'GuideService', 'InstructionService', UpdateInstructionController])

})()



function InstructionController ($scope, $state, InstructionService) {
	$scope.instructions = []

	$scope.load = function () {

		InstructionService
			.get()
			.then(function (response) {
				$scope.instructions = response.data;
			})
	}

	$scope.update = function (request) {
		$state.go('main.admin.instruction.update', {instructionId: request});
	}

	$scope.destroy = function (request) {
		var alert = confirm("Apakah Anda yakin ingin menghapus Instruksi ini?");
		if (alert == true) {
			InstructionService
				.destroy({ id: request})
				.then(function () {
					$scope.load();
				})
		}
	}

	$scope.load()
}

function CreateInstructionController ($scope, $state, $timeout, StandardService, StandardDocumentService, GuideService, InstructionService) {
	var timeoutNoPromise, timeoutDescriptionPromise
	$scope.input = {}
	$scope.standards = {}
	$scope.standarddocuments = {}
	$scope.guides = {}
	$scope.validated = false;
	$scope.requiredUpload = true;

	$scope.load = function () {
		$scope.today();
		$scope.toggleMin();
		$scope.loadingStandard = true;

		StandardService
			.get()
			.then(function (response) {
				$scope.standards = response.data;
				$scope.hasStandard = true;
				$scope.loadingStandard = false
			})
	}

	$scope.selectStandard = function (id) {
		$scope.loadingStandardDocument = true

		StandardDocumentService
			.standard(id)
			.then(function (response) {
				console.log(response.data)
				$scope.standarddocuments = response.data;
				$scope.loadingStandardDocument = false
				if (response.data.length > 0) {
					$scope.hasStandard = true
				} else {
					$scope.hasStandard = false
				}
			})
	}

	$scope.selectStandardDocument = function (id) {
		$scope.loadingGuide = true

		GuideService
			.standarddocument(id)
			.then(function (response) {
				$scope.guides = response.data;
				$scope.loadingGuide = false
				if (response.data.length > 0) {
					$scope.hasStandardDocument = true
				} else {
					$scope.hasStandardDocument = false
				}
			})
	}

	$scope.$watch('input.no', function () {
		var validInput = $scope.InstructionForm.no.$invalid
		var dirtyInput = $scope.InstructionForm.no.$dirty
		
		if (!validInput && dirtyInput) {
			$timeout.cancel(timeoutNoPromise)
			$scope.loadingNo = true;
			timeoutNoPromise = $timeout(function() {
				InstructionService
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
		var validInput = $scope.InstructionForm.description.$invalid
		var dirtyInput = $scope.InstructionForm.description.$dirty
		
		if (!validInput && dirtyInput) {
			$timeout.cancel(timeoutDescriptionPromise)
			$scope.loadingDescription = true;
			timeoutDescriptionPromise = $timeout(function() {
				InstructionService
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
		$scope.InstructionForm.standard_id.$setDirty();
		$scope.InstructionForm.standard_document_id.$setDirty();
		$scope.InstructionForm.guide_id.$setDirty();
		$scope.InstructionForm.no.$setDirty();
		$scope.InstructionForm.date.$setDirty();
		$scope.InstructionForm.description.$setDirty();
		$scope.InstructionForm.file.$setDirty();

		if ($scope.InstructionForm.$valid) {
			InstructionService
				.store($scope.input, file)
				.then(function() {
					$state.go('main.admin.instruction')
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

function UpdateInstructionController ($scope, $state, $stateParams, $timeout, StandardService, StandardDocumentService, GuideService, InstructionService) {
	var timeoutNoPromise, timeoutDescriptionPromise
	$scope.input = {}
	$scope.standards = {}
	$scope.standarddocuments = {}
	$scope.guides = {}
	$scope.validated = false;
	$scope.requiredUpload = false;

	$scope.load = function () {
		$scope.today();
		$scope.toggleMin();
		$scope.loadingStandard = true;

		InstructionService
			.show($stateParams.instructionId)
			.then(function (response) {
				$scope.input = response.data;
				$scope.input.date = new Date($scope.input.date)
				$scope.standard_id = $scope.input.guide.standard_document.standard.id;

				StandardService
					.get()
					.then(function (response) {
						$scope.standards = response.data;
						$scope.loadingStandard = false
						$scope.loadingStandardDocument = true
						$scope.hasStandard = true

						StandardDocumentService
							.standard($scope.standard_id)
							.then(function (response) {
								$scope.standarddocuments = response.data;
								$scope.standard_document_id = $scope.input.guide.standard_document.id;
								$scope.loadingStandardDocument = false
								$scope.loadingGuide = true
								$scope.hasStandardDocument = true

								GuideService
									.standarddocument($scope.standard_document_id)
									.then(function (response) {
										$scope.guides = response.data;
										$scope.loadingGuide = false
										$scope.hasGuide = true

								})
						})
				})
		})
	}


	$scope.selectStandard = function (id) {
		$scope.loadingStandardDocument = true

		StandardDocumentService
			.standard(id)
			.then(function (response) {
				console.log(response.data)
				$scope.standarddocuments = response.data;
				$scope.loadingStandardDocument = false
				if (response.data.length > 0) {
					$scope.hasStandard = true
				} else {
					$scope.hasStandard = false
				}
			})
	}

	$scope.selectStandardDocument = function (id) {
		$scope.loadingGuide = true

		GuideService
			.standarddocument(id)
			.then(function (response) {
				$scope.guides = response.data;
				$scope.loadingGuide = false
				if (response.data.length > 0) {
					$scope.hasStandardDocument = true
				} else {
					$scope.hasStandardDocument = false
				}
			})
	}

	$scope.$watch('input.no', function () {
		var validInput = $scope.InstructionForm.no.$invalid
		var dirtyInput = $scope.InstructionForm.no.$dirty
		
		if (!validInput && dirtyInput) {
			$timeout.cancel(timeoutNoPromise)
			$scope.loadingNo = true;
			timeoutNoPromise = $timeout(function() {
				InstructionService
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
		var validInput = $scope.InstructionForm.description.$invalid
		var dirtyInput = $scope.InstructionForm.description.$dirty
		
		if (!validInput && dirtyInput) {
			$timeout.cancel(timeoutDescriptionPromise)
			$scope.loadingDescription = true;
			timeoutDescriptionPromise = $timeout(function() {
				InstructionService
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
		$scope.InstructionForm.standard_id.$setDirty();
		$scope.InstructionForm.standard_document_id.$setDirty();
		$scope.InstructionForm.guide_id.$setDirty();
		$scope.InstructionForm.no.$setDirty();
		$scope.InstructionForm.date.$setDirty();
		$scope.InstructionForm.description.$setDirty();
		$scope.InstructionForm.file.$setDirty();

		if ($scope.InstructionForm.$valid) {
			InstructionService
				.update($scope.input, file)
				.then(function() {
					$state.go('main.admin.instruction')
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