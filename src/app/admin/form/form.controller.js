(function() {
	
	angular
		.module('spmiFrontEnd')
		.controller('FormController', ['$scope', '$state', 'FormService', FormController])
		.controller('CreateFormController', ['$scope', '$state', '$timeout', 'StandardService', 'StandardDocumentService', 'GuideService', 'InstructionService', 'FormService', CreateFormController])
		.controller('UpdateFormController', ['$scope', '$state', '$stateParams', '$timeout', 'StandardService', 'StandardDocumentService', 'GuideService', 'InstructionService', 'FormService', UpdateFormController])
		.controller('CreateModalFormController', ['$scope', '$state', '$timeout', '$modalInstance', 'forms', 'StandardService', 'StandardDocumentService', 'GuideService', 'InstructionService', 'FormService', CreateModalFormController])
		.controller('UpdateModalFormController', ['$scope', '$state', '$timeout', '$modalInstance', 'forms', 'StandardService', 'StandardDocumentService', 'GuideService', 'InstructionService', 'FormService', UpdateModalFormController])
		
	function findObject(parent, child) {
		var i = 0;
		var counter = 0;
	
		for (i = 0 ; i < parent.length ; i++) {
			if (angular.equals(parent[i], child)) {
				return i
			}
			counter++
		}
	
		if (counter === parent.length) {
			return -1
		}
	}
	
	
	
	function FormController ($scope, $state, FormService) {
		$scope.forms = []
	
		$scope.load = function () {
			FormService
				.get()
				.then(function(response) {
					$scope.forms = response.data;
				})
		}
	
		$scope.update = function (request) {
			$state.go('main.admin.form.update', {formId: request})
		}
	
		$scope.destroy = function (request) {
			var alert = confirm("Apakah Anda yakin ingin menghapus Form ini?");
			if (alert == true) {
				FormService
					.destroy({id: request})
					.then(function (request) {
						$scope.load();
					})
			}
			
		}
	
		$scope.load()
	}
	
	function CreateFormController ($scope, $state, $timeout, StandardService, StandardDocumentService, GuideService, InstructionService, FormService) {
		var timeoutNoPromise, timeoutDescriptionPromise
		$scope.input = {}
		$scope.standards = []
		$scope.standarddocuments = []
		$scope.guides = []
		$scope.instructions = []
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
	
		$scope.selectGuide = function (id) {
			$scope.loadingInstruction = true
	
			InstructionService
				.guide(id)
				.then(function (response) {
					$scope.instructions = response.data;
					$scope.loadingInstruction = false
					if (response.data.length > 0) {
						$scope.hasGuide = true
					} else {
						$scope.hasGuide = false
					}
				})
		}
	
		$scope.$watch('input.no', function () {
			var validInput = $scope.FormForm.no.$invalid
			var dirtyInput = $scope.FormForm.no.$dirty
			
			if (!validInput && dirtyInput) {
				$timeout.cancel(timeoutNoPromise)
				$scope.loadingNo = true;
				timeoutNoPromise = $timeout(function() {
					FormService
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
			var validInput = $scope.FormForm.description.$invalid
			var dirtyInput = $scope.FormForm.description.$dirty
			
			if (!validInput && dirtyInput) {
				$timeout.cancel(timeoutDescriptionPromise)
				$scope.loadingDescription = true;
				timeoutDescriptionPromise = $timeout(function() {
					FormService
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
			$scope.FormForm.standard_id.$setDirty();
			$scope.FormForm.standard_document_id.$setDirty();
			$scope.FormForm.guide_id.$setDirty();
			$scope.FormForm.instruction_id.$setDirty();
			$scope.FormForm.no.$setDirty();
			$scope.FormForm.date.$setDirty();
			$scope.FormForm.description.$setDirty();
			$scope.FormForm.file.$setDirty();
	
			if ($scope.FormForm.$valid) {
				FormService
					.store($scope.input, file) 
					.then(function (response) {
						$state.go('main.admin.form');
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
	
	function UpdateFormController ($scope, $state, $stateParams, $timeout, StandardService, StandardDocumentService, GuideService, InstructionService, FormService) {
		var timeoutNoPromise, timeoutDescriptionPromise
		$scope.input = {}
		$scope.standards = []
		$scope.standarddocuments = []
		$scope.guides = []
		$scope.instructions = []
		$scope.validated = false;
		$scope.requiredUpload = false;
	
		$scope.load = function () {
			$scope.toggleMin()
			$scope.loadingStandard = true;
	
			FormService
				.show($stateParams.formId)
				.then(function (response) {
					$scope.input = response.data;
					$scope.input.date = new Date($scope.input.date)
					$scope.standard_id = $scope.input.instruction.guide.standard_document.standard.id;
	
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
									$scope.standard_document_id = $scope.input.instruction.guide.standard_document.id;
									$scope.loadingStandardDocument = false
									$scope.loadingGuide = true
									$scope.hasStandardDocument = true
	
									GuideService
										.standarddocument($scope.standard_document_id)
										.then(function (response) {
											$scope.guides = response.data;
											$scope.guide_id = $scope.input.instruction.guide.id;
											$scope.loadingGuide = false
											$scope.loadingInstruction = true
											$scope.hasGuide = true
	
											InstructionService
												.guide($scope.guide_id)
												.then(function (response) {
													$scope.instructions = response.data;
													$scope.instruction_id = $scope.input.instruction.id;
													$scope.loadingInstruction = false
													$scope.hasInstruction = true
												})
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
	
		$scope.selectGuide = function (id) {
			$scope.loadingInstruction = true
	
			InstructionService
				.guide(id)
				.then(function (response) {
					$scope.instructions = response.data;
					$scope.loadingInstruction = false
					if (response.data.length > 0) {
						$scope.hasGuide = true
					} else {
						$scope.hasGuide = false
					}
				})
		}
	
		$scope.$watch('input.no', function () {
			var validInput = $scope.FormForm.no.$invalid
			var dirtyInput = $scope.FormForm.no.$dirty
			
			if (!validInput && dirtyInput) {
				$timeout.cancel(timeoutNoPromise)
				$scope.loadingNo = true;
				timeoutNoPromise = $timeout(function() {
					FormService
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
			var validInput = $scope.FormForm.description.$invalid
			var dirtyInput = $scope.FormForm.description.$dirty
			
			if (!validInput && dirtyInput) {
				$timeout.cancel(timeoutDescriptionPromise)
				$scope.loadingDescription = true;
				timeoutDescriptionPromise = $timeout(function() {
					FormService
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
			$scope.FormForm.standard_id.$setDirty();
			$scope.FormForm.standard_document_id.$setDirty();
			$scope.FormForm.guide_id.$setDirty();
			$scope.FormForm.instruction_id.$setDirty();
			$scope.FormForm.no.$setDirty();
			$scope.FormForm.date.$setDirty();
			$scope.FormForm.description.$setDirty();
			$scope.FormForm.file.$setDirty();
	
			if ($scope.FormForm.$valid) {
				FormService
					.update($scope.input, file) 
					.then(function (response) {
						$state.go('main.admin.form');
					})
			} else {
				$scope.validated = true;
			}
		}
	
		$scope.clear = function () {
			$scope.input.date = null;
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
	
	function CreateModalFormController ($scope, $state, $timeout, $modalInstance, forms, StandardService, StandardDocumentService, GuideService, InstructionService, FormService) {
	
		$scope.input = {}
		$scope.standards = {}
		$scope.standarddocuments = {}
		$scope.guides = {}
		$scope.instructions = {}
		$scope.validated = false;
		$scope.requiredUpload = true;
	
		
		$scope.load = function () {
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
	
		$scope.selectGuide = function (id) {
			$scope.loadingInstruction = true
	
			InstructionService
				.guide(id)
				.then(function (response) {
					$scope.instructions = response.data;
					$scope.loadingInstruction = false
					if (response.data.length > 0) {
						$scope.hasGuide = true
					} else {
						$scope.hasGuide = false
					}
				})
		}
	
		$scope.selectInstruction = function (id) {
			$scope.loadingForm = true
			FormService
				.instruction(id)
				.then(function (response) {
					$scope.forms = response.data
					console.log(response.data)
					$scope.loadingForm = false
					if (response.data.length > 0) {
						$scope.hasInstruction = true
					} else {
						$scope.hasInstruction = false
					}
				})
		}
	
		$scope.submit = function (file) {
			$scope.FormForm.standard_id.$setDirty();
			$scope.FormForm.standard_document_id.$setDirty();
			$scope.FormForm.guide_id.$setDirty();
			$scope.FormForm.instruction_id.$setDirty();
			$scope.FormForm.form_id.$setDirty();
	
			if ($scope.FormForm.$valid) {
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
	
	function UpdateModalFormController ($scope, $state, $timeout, $modalInstance, forms, StandardService, StandardDocumentService, GuideService, InstructionService, FormService) {
	
		$scope.input = {}
		$scope.form = forms
		$scope.standards = {}
		$scope.standarddocuments = {}
		$scope.guides = {}
		$scope.instructions = {}
		$scope.validated = false;
		$scope.requiredUpload = true;
	
		$scope.load = function () {
			
			$scope.loadingStandard = true;
			
			StandardService.get()
				.then(function (response) {
					$scope.standards = response.data;
					$scope.standard_id = $scope.form.form.instruction.guide.standard_document.standard_id
					$scope.loadingStandard = false
					$scope.loadingStandardDocument = true
					$scope.hasStandard = true
					return StandardDocumentService.standard($scope.standard_id)
				}, function(response){
					console.log(response)
				}).then(function (response) {
					$scope.standarddocuments = response.data;
					$scope.standard_document_id = $scope.form.form.instruction.guide.standard_document.id;
					$scope.loadingStandardDocument = false
					$scope.loadingGuide = true
					$scope.hasStandardDocument = true
					return GuideService.standarddocument($scope.standard_document_id)
				}, function(response){
					
				}).then(function (response) {
					$scope.guides = response.data;
					$scope.guide_id = $scope.form.form.instruction.guide.id;
					$scope.loadingGuide = false
					$scope.loadingInstruction = true
					$scope.hasGuide = true
					return InstructionService.guide($scope.guide_id)
				}, function(response){
					
				}).then(function (response) {
					$scope.instructions = response.data;
					$scope.instruction_id = $scope.form.form.instruction.id;
					$scope.loadingInstruction = false
					$scope.loadingForm = true
					$scope.hasInstruction = true
					return FormService.instruction($scope.instruction_id)
				}, function(response){
					
				}).then(function(response) {
					$scope.forms = response.data
					console.log($scope.forms)
					console.log($scope.form.form)
					$scope.input.form =  $scope.forms[findObject($scope.forms, $scope.form.form)];
					$scope.loadingForm = false
					$scope.hasForm = true
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
	
		$scope.selectGuide = function (id) {
			$scope.loadingInstruction = true
	
			InstructionService
				.guide(id)
				.then(function (response) {
					$scope.instructions = response.data;
					$scope.loadingInstruction = false
					if (response.data.length > 0) {
						$scope.hasGuide = true
					} else {
						$scope.hasGuide = false
					}
				})
		}
	
		$scope.selectInstruction = function (id) {
			$scope.loadingForm = true
			FormService
				.instruction(id)
				.then(function (response) {
					$scope.forms = response.data
					console.log(response.data)
					$scope.loadingForm = false
					if (response.data.length > 0) {
						$scope.hasInstruction = true
					} else {
						$scope.hasInstruction = false
					}
				})
		}
	
		$scope.submit = function (file) {
			$scope.FormForm.standard_id.$setDirty();
			$scope.FormForm.standard_document_id.$setDirty();
			$scope.FormForm.guide_id.$setDirty();
			$scope.FormForm.instruction_id.$setDirty();
			$scope.FormForm.form_id.$setDirty();
	
			if ($scope.FormForm.$valid) {
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
})();

