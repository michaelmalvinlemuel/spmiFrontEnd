(function(angular) {
	'use strict'
	angular
		.module('spmiFrontEnd')
		.controller('FormController', FormController)
		.controller('CreateFormController', CreateFormController)
		.controller('UpdateFormController', UpdateFormController)
		.controller('CreateModalFormController', CreateModalFormController)
		.controller('UpdateModalFormController', UpdateModalFormController)
		

	
	
	
	function FormController ($state, forms, FormService) {
		var vm = this;
		vm.forms = forms;
	
		vm.update = function(id){
			$state.go('main.admin.form.update', {formId: id})
		}
	
		vm.destroy = function (id, index) {
			var alert = confirm("Apakah Anda yakin ingin menghapus Form ini?");
			(alert == true) ? FormService.destroy(id).then(function(){
				vm.forms.splice(index, 1);
			}) : null;
		}
		return vm;
	}
	
	function CreateFormController ($scope, $state, $timeout, standards, StandardDocumentService, GuideService, InstructionService, FormService) {
		var vm = this;
		var timeoutNoPromise, timeoutDescriptionPromise;
		vm.input = {};
		vm.standards = standards;
		vm.standardDocuments = [];
		vm.guides = [];
		vm.instructions = [];
		vm.validated = false;
		vm.requiredUpload = true;
	

		vm.selectStandard = function(id){
			vm.loadingStandardDocument = true
			StandardDocumentService.standard(id).then(function(data){
				vm.standardDocuments = data;
				vm.loadingStandardDocument = false;
				(data.length > 0) ? vm.hasStandard = true : vm.hasStandard = false;
			})
		}
	
		vm.selectStandardDocument = function(id){
			vm.loadingGuide = true;
			GuideService.standardDocument(id).then(function (data) {
				vm.guides = data;
				vm.loadingGuide = false;
				(data.length > 0) ? vm.hasStandardDocument = true : vm.hasStandardDocument = false;
			})
		}
	
		vm.selectGuide = function (id) {
			vm.loadingInstruction = true
			InstructionService.guide(id).then(function(data){
				vm.instructions = data;
				vm.loadingInstruction = false;
				(data.length > 0) ? vm.hasGuide = true : vm.hasGuide = false;
			})
		}
	
		$scope.$watch('vm.input.no', function () {
			var validInput = $scope.FormForm.no.$invalid;
			var dirtyInput = $scope.FormForm.no.$dirty;
			if (!validInput && dirtyInput){
				$timeout.cancel(timeoutNoPromise)
				vm.loadingNo = true;
				timeoutNoPromise = $timeout(function(){
					FormService.validatingNo(vm.input).then(function(data){
						(data.length > 0) ? vm.existNo = true : vm.existNo = false;
						vm.loadingNo = false;
					})
				}, 1000)
			}		
		});
	
		$scope.$watch('vm.input.description', function () {
			var validInput = $scope.FormForm.description.$invalid;
			var dirtyInput = $scope.FormForm.description.$dirty;
			if (!validInput && dirtyInput){
				$timeout.cancel(timeoutDescriptionPromise)
				vm.loadingDescription = true;
				timeoutDescriptionPromise = $timeout(function(){
					FormService.validatingDescription(vm.input).then(function(data){
						(data.length > 0) ? vm.existDescription = true : vm.existDescription = false;
						vm.loadingDescription = false;
					})
				}, 1000);
			}		
		});
	
		vm.submit = function(){
			$scope.FormForm.standard_id.$setDirty();
			$scope.FormForm.standard_document_id.$setDirty();
			$scope.FormForm.guide_id.$setDirty();
			$scope.FormForm.instruction_id.$setDirty();
			$scope.FormForm.no.$setDirty();
			$scope.FormForm.date.$setDirty();
			$scope.FormForm.description.$setDirty();
			$scope.FormForm.file.$setDirty();
	
			($scope.FormForm.$valid) ? FormService.store(vm.input).then(function(){
				$state.go('main.admin.form', null, { reload: true });
			}) : vm.validated = true;
		}
	
		vm.vm = function() {
			vm.input.date = new Date();
		};
	
		vm.toggleMin = function() {
			vm.minDate = vm.minDate ? null : new Date();
		};
	
		vm.open = function($event) {
			vm.status.opened = true;
		};
	
		vm.dateOptions = {
			formatYear: 'yy',
			startingDay: 1
		};
	
		vm.status = {
			opened: false
		};
		vm.toggleMin();
		
		return vm;
	}
	
	function UpdateFormController ($scope, $state, $stateParams, $timeout, form, standards, StandardDocumentService, GuideService, InstructionService, FormService) {
		var vm = this;
		var timeoutNoPromise, timeoutDescriptionPromise;
		vm.input = form;
		vm.standards = standards;
		vm.standardDocuments = [];
		vm.guides = [];
		vm.instructions = [];
		vm.validated = false;
		vm.requiredUpload = false;
		
		vm.hasStandard = vm.hasStandardDocument = vm.hasGuide = vm.hasInstruction = true;
		vm.input.date = new Date(vm.input.date)
		vm.standard_id = vm.input.instruction.guide.standard_document.standard.id;


		StandardDocumentService.standard(vm.standard_id).then(function(data){
			vm.standardDocuments = data;
			vm.standard_document_id = vm.input.instruction.guide.standard_document.id;
			vm.loadingStandardDocument = false;
			vm.loadingGuide = true;
			vm.hasStandardDocument = true;
			return GuideService.standardDocument(vm.standard_document_id);
		}).then(function(data){
			vm.guides = data;
			vm.guide_id = vm.input.instruction.guide.id;
			vm.loadingGuide = false;
			vm.loadingInstruction = true;
			vm.hasGuide = true;
			return InstructionService.guide(vm.guide_id);
		}).then(function(data){
			vm.instructions = data;
			vm.instruction_id = vm.input.instruction.id;
			vm.loadingInstruction = false
			vm.hasInstruction = true
		});
				
		vm.selectStandard = function(id){
			vm.loadingStandardDocument = true
			StandardDocumentService.standard(id).then(function(data){
				vm.standardDocuments = data;
				vm.loadingStandardDocument = false;
				(data.length > 0) ? vm.hasStandard = true : vm.hasStandard = false;
			})
		}
	
		vm.selectStandardDocument = function(id){
			vm.loadingGuide = true;
			GuideService.standardDocument(id).then(function (data) {
				vm.guides = data;
				vm.loadingGuide = false;
				(data.length > 0) ? vm.hasStandardDocument = true : vm.hasStandardDocument = false;
			})
		}
	
		vm.selectGuide = function(id){
			vm.loadingInstruction = true
			InstructionService.guide(id).then(function(data){
				vm.instructions = data;
				vm.loadingInstruction = false;
				(data.length > 0) ? vm.hasGuide = true : vm.hasGuide = false;
			})
		}
	
		$scope.$watch('vm.input.no', function () {
			var validInput = $scope.FormForm.no.$invalid;
			var dirtyInput = $scope.FormForm.no.$dirty;
			if (!validInput && dirtyInput){
				$timeout.cancel(timeoutNoPromise)
				vm.loadingNo = true;
				timeoutNoPromise = $timeout(function(){
					FormService.validatingNo(vm.input).then(function(data){
						(data.length > 0) ? vm.existNo = true : vm.existNo = false;
						vm.loadingNo = false;
					})
				}, 1000)
			}		
		});
	
		$scope.$watch('vm.input.description', function () {
			var validInput = $scope.FormForm.description.$invalid;
			var dirtyInput = $scope.FormForm.description.$dirty;
			if (!validInput && dirtyInput){
				$timeout.cancel(timeoutDescriptionPromise)
				vm.loadingDescription = true;
				timeoutDescriptionPromise = $timeout(function(){
					FormService.validatingDescription(vm.input).then(function(data){
						(data.length > 0) ? vm.existDescription = true : vm.existDescription = false;
						vm.loadingDescription = false;
					})
				}, 1000);
			}		
		});
	
		vm.submit = function(){
			$scope.FormForm.standard_id.$setDirty();
			$scope.FormForm.standard_document_id.$setDirty();
			$scope.FormForm.guide_id.$setDirty();
			$scope.FormForm.instruction_id.$setDirty();
			$scope.FormForm.no.$setDirty();
			$scope.FormForm.date.$setDirty();
			$scope.FormForm.description.$setDirty();
			$scope.FormForm.file.$setDirty();
	
			($scope.FormForm.$valid) ? FormService.update(vm.input).then(function(){
				$state.go('main.admin.form', null, { reload: true });
			}) : vm.validated = true;
		}
	
		vm.vm = function() {
			vm.input.date = new Date();
		};
	
		vm.toggleMin = function() {
			vm.minDate = vm.minDate ? null : new Date();
		};
	
		vm.open = function($event) {
			vm.status.opened = true;
		};
	
		vm.dateOptions = {
			formatYear: 'yy',
			startingDay: 1
		};
	
		vm.status = {
			opened: false
		};
	
		vm.toggleMin();
		
		return vm;
	}
	
	function CreateModalFormController($scope, $modalInstance, StandardService, StandardDocumentService, GuideService, InstructionService, FormService){
		var vm = this;
		vm.input = {}
		vm.standards = {}
		vm.standardDocuments = {}
		vm.guides = {}
		vm.instructions = {}
		vm.validated = false;
		
		
		vm.loadingStandard = true;
		StandardService.get().then(function(data){
			vm.standards = data;
			vm.hasStandard = true;
			vm.loadingStandard = false;
		});
	
		vm.selectStandard = function(id){
			vm.loadingStandardDocument = true
			StandardDocumentService.standard(id).then(function(data){
				vm.loadingStandardDocument = false;
				(data.length > 0) ? vm.hasStandard = true : vm.hasStandard = false;
				vm.standardDocuments = data;
			})
		}
	
		vm.selectStandardDocument = function(id){
			vm.loadingGuide = true;
			GuideService.standardDocument(id).then(function (data) {
				vm.guides = data;
				vm.loadingGuide = false;
				(data.length > 0) ? vm.hasStandardDocument = true : vm.hasStandardDocument = false;
			})
		}
	
		vm.selectGuide = function(id){
			vm.loadingInstruction = true
			InstructionService.guide(id).then(function(data){
				vm.instructions = data;
				vm.loadingInstruction = false;
				(data.length > 0) ? vm.hasGuide = true : vm.hasGuide = false;
			});
		}
		
		vm.selectInstruction = function(id){
			vm.loadingForm = true;
			FormService.instruction(id).then(function(data){
				vm.forms = data;
				vm.loadingForm = false;
				(data.length > 0) ? vm.hasInstruction = true : vm.hasInstruction = false;
			});
		}
	
		vm.submit = function(file){
			$scope.FormForm.standard.$setDirty();
			$scope.FormForm.standard_document.$setDirty();
			$scope.FormForm.guide.$setDirty();
			$scope.FormForm.instruction.$setDirty();
			$scope.FormForm.form.$setDirty();
			
			($scope.FormForm.$valid) ? $modalInstance.close(vm.input) : vm.validated = true;
		}
	
		vm.close = function(){
			$modalInstance.dismiss('cancel');
		}
		return vm;
	}
	
	function UpdateModalFormController ($log, $rootScope, $scope, $modalInstance, form, StandardService, StandardDocumentService, GuideService, InstructionService, FormService){
		var vm = this;
		vm.input = form;
		vm.standards = {}
		vm.standardDocuments = {}
		vm.guides = {}
		vm.instructions = {}
		vm.validated = false;
	

		vm.loadingStandard = true;
		StandardService.get().then(function(data){
			vm.standards = data;
			vm.standard = vm.standards[$rootScope.findObject(vm.standards, vm.input.instruction.guide.standard_document.standard)]
			vm.loadingStandard = false;
			vm.loadingStandardDocument = true;
			vm.hasStandard = true;
			return StandardDocumentService.standard(vm.standard.id)
		}).then(function(data){
			vm.standardDocuments = data;
			vm.standard_document = vm.standardDocuments[$rootScope.findObject(vm.standardDocuments, vm.input.instruction.guide.standard_document)];
			vm.loadingStandardDocument = false;
			vm.loadingGuide = true;
			vm.hasStandardDocument = true;
			return GuideService.standardDocument(vm.standard_document.id);
		}).then(function(data){
			vm.guides = data;
			console.log(data);
			vm.guide = vm.guides[$rootScope.findObject(vm.guides, vm.input.instruction.guide)];
			console.log(vm.guide);
			vm.loadingGuide = false;
			vm.loadingInstruction = true;
			vm.hasGuide = true;
			$log.info('guide.id:' + vm.guide.id)
			return InstructionService.guide(vm.guide.id)
		}).then(function(data){
			vm.instructions = data;
			vm.instruction = vm.instructions[$rootScope.findObject(vm.instructions, vm.input.instruction)];
			vm.loadingInstruction = false;
			vm.loadingForm = true;
			vm.hasInstruction = true;
			$log.info('instruction.id:' + vm.instruction.id)
			return FormService.instruction(vm.instruction.id)
		}).then(function(data){
			vm.forms = data;
			vm.input = vm.forms[$rootScope.findObject(vm.forms, vm.input)];
			vm.loadingForm = false;
			vm.hasForm = true;
		})
						
		vm.selectStandard = function(id){
			vm.loadingStandardDocument = true
			StandardDocumentService.standard(id).then(function(data){
				vm.standardDocuments = data;
				vm.loadingStandardDocument = false;
				(data.length > 0) ? vm.hasStandard = true : vm.hasStandard = false;
			})
		}
	
		vm.selectStandardDocument = function(id){
			vm.loadingGuide = true;
			GuideService.standardDocument(id).then(function (data) {
				vm.guides = data;
				vm.loadingGuide = false;
				(data.length > 0) ? vm.hasStandardDocument = true : vm.hasStandardDocument = false;
			})
		}
	
		vm.selectGuide = function(id){
			vm.loadingInstruction = true
			InstructionService.guide(id).then(function(data){
				vm.instructions = data;
				vm.loadingInstruction = false;
				(data.length > 0) ? vm.hasGuide = true : vm.hasGuide = false;
			})
		}
	
		vm.selectInstruction = function(id){
			vm.loadingForm = true;
			FormService.instruction(id).then(function(data){
				vm.forms = data;
				vm.loadingForm = false;
				(data.length > 0) ? vm.hasInstruction = true : vm.hasInstruction = false;
			});
		}
	
		vm.submit = function(file){
			$scope.FormForm.standard.$setDirty();
			$scope.FormForm.standard_document.$setDirty();
			$scope.FormForm.guide.$setDirty();
			$scope.FormForm.instruction.$setDirty();
			$scope.FormForm.form.$setDirty();
	
			($scope.FormForm.$valid) ? $modalInstance.close(vm.input) : vm.validated = true;
		}
	
		vm.close = function(){
			$modalInstance.dismiss('cancel');
		}
	
		return vm;
	}
})(angular);

