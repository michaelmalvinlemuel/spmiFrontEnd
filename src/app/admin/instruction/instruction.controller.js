(function () {

	angular
		.module('spmiFrontEnd')
		.controller('InstructionController', InstructionController)
		.controller('CreateInstructionController', CreateInstructionController)
		.controller('UpdateInstructionController', UpdateInstructionController)


	function InstructionController($state, instructions, InstructionService){
		var vm = this;
		vm.instructions = instructions
	
	
	
		vm.update = function(id){
			$state.go('main.admin.instruction.update', {instructionId: id});
		}
	
		vm.destroy = function(id, index){
			var alert = confirm("Apakah Anda yakin ingin menghapus Instruksi ini?");
			(alert == true) ? InstructionService.destroy(id).then(function(){
				vm.instructions.splice(index, 1);
			}) : null;
		}
		
		return vm;
	}
	
	function CreateInstructionController($scope, $state, $timeout, standards, StandardDocumentService, GuideService, InstructionService) {
		var vm = this;
		var timeoutNoPromise, timeoutDescriptionPromise;
		
		vm.input = {}
		vm.standards = standards;
		vm.standardDocuments = {}
		vm.guides = {}
		vm.validated = false;
		vm.requiredUpload = true;
	
		vm.selectStandard = function(id){
			vm.loadingStandardDocument = true;
			StandardDocumentService.standard(id).then(function(data){
				vm.standardDocuments = data;
				vm.loadingStandardDocument = false;
				(data.length > 0) ? vm.hasStandard = true : vm.hasStandard = false;
			})
		}
	
		vm.selectStandardDocument = function(id){
			vm.loadingGuide = true
			GuideService.standardDocument(id).then(function(data){
				vm.guides = data;
				vm.loadingGuide = false;
				(data.length > 0) ? vm.hasStandardDocument = true: vm.hasStandardDocument = false;
			})
		}
	
		$scope.$watch('vm.input.no', function(){
			var validInput = $scope.InstructionForm.no.$invalid
			var dirtyInput = $scope.InstructionForm.no.$dirty
			
			if (!validInput && dirtyInput) {
				$timeout.cancel(timeoutNoPromise)
				vm.loadingNo = true;
				timeoutNoPromise = $timeout(function(){
					InstructionService.validatingNo(vm.input).then(function(data){
						(data.length > 0) ? vm.existNo = true : vm.existNo = false;
						vm.loadingNo = false;
					})
				}, 1000)
			}		
		})
	
		$scope.$watch('vm.input.description', function(){
			var validInput = $scope.InstructionForm.description.$invalid;
			var dirtyInput = $scope.InstructionForm.description.$dirty;
			if(!validInput && dirtyInput){
				$timeout.cancel(timeoutDescriptionPromise);
				vm.loadingDescription = true;
				timeoutDescriptionPromise = $timeout(function(){
					InstructionService.validatingDescription(vm.input).then(function(data){
						(data.length > 0) ? vm.existDescription = true : vm.existDescription = false;
						vm.loadingDescription = false;
					});
				}, 1000);
			};
		});
	
		vm.submit = function(){
			$scope.InstructionForm.standard_id.$setDirty();
			$scope.InstructionForm.standard_document_id.$setDirty();
			$scope.InstructionForm.guide_id.$setDirty();
			$scope.InstructionForm.no.$setDirty();
			$scope.InstructionForm.date.$setDirty();
			$scope.InstructionForm.description.$setDirty();
			$scope.InstructionForm.file.$setDirty();
	
			($scope.InstructionForm.$valid) ? InstructionService.store(vm.input).then(function(){
				$state.go('main.admin.instruction', null, { reload: true });
			}) : vm.validated = true;
		}
	
		vm.today = function() {
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
	
	function UpdateInstructionController ($scope, $state, $timeout, instruction, standards, StandardDocumentService, GuideService, InstructionService) {
		var vm = this;
		var timeoutNoPromise, timeoutDescriptionPromise;
		vm.input = instruction
		vm.standards = standards;
		vm.standardDocuments = {}
		vm.guides = {}
		vm.validated = false;
		vm.requiredUpload = false;
		vm.hasStandard = vm.hasStandardDocument = vm.hasGuide = vm.hasInstruction = true;
			
		vm.input.date = new Date(vm.input.date)
		vm.standard_id = vm.input.guide.standard_document.standard.id;
		
		vm.loadingStandardDocument = true;
		StandardDocumentService.standard(vm.standard_id).then(function(data){
			vm.standardDocuments = data;
			vm.standard_document_id = vm.input.guide.standard_document.id;
			vm.loadingStandardDocument = false;
			vm.loadingGuide = true;
			return GuideService.standardDocument(vm.standard_document_id);
		}).then(function(data){
			vm.guides = data;
			vm.loadingGuide = false;
		})
	
		vm.selectStandard = function(id){
			vm.loadingStandardDocument = true;
			StandardDocumentService.standard(id).then(function(data){
				vm.standardDocuments = data;
				vm.loadingStandardDocument = false;
				(data.length > 0) ? vm.hasStandard = true : vm.hasStandard = false;
			})
		}
	
		vm.selectStandardDocument = function(id){
			vm.loadingGuide = true;
			GuideService.standardDocument(id).then(function(data){
				vm.guides = data;
				vm.loadingGuide = false;
				(data.length > 0) ? vm.hasStandardDocument = true : vm.hasStandardDocument = false;
			})
		}
	
		$scope.$watch('vm.input.no', function(){
			var validInput = $scope.InstructionForm.no.$invalid;
			var dirtyInput = $scope.InstructionForm.no.$dirty;
			
			if (!validInput && dirtyInput) {
				$timeout.cancel(timeoutNoPromise);
				vm.loadingNo = true;
				timeoutNoPromise = $timeout(function() {
					InstructionService.validatingNo(vm.input).then(function(data){
						(data.length > 0) ? vm.existNo = true : vm.existNo = false;
						vm.loadingNo = false;
					})
				}, 1000)
			}		
		})
	
		$scope.$watch('vm.input.description', function(){
			var validInput = $scope.InstructionForm.description.$invalid;
			var dirtyInput = $scope.InstructionForm.description.$dirty;
			
			if (!validInput && dirtyInput){
				$timeout.cancel(timeoutDescriptionPromise)
				vm.loadingDescription = true;
				timeoutDescriptionPromise = $timeout(function(){
					InstructionService.validatingDescription(vm.input).then(function(data){
						(data.length > 0) ? vm.existDescription = true : vm.existDescription = false;
						vm.loadingDescription = false;
					})
				}, 1000)
			}		
		})
	
		vm.submit = function(){
			$scope.InstructionForm.standard_id.$setDirty();
			$scope.InstructionForm.standard_document_id.$setDirty();
			$scope.InstructionForm.guide_id.$setDirty();
			$scope.InstructionForm.no.$setDirty();
			$scope.InstructionForm.date.$setDirty();
			$scope.InstructionForm.description.$setDirty();
			$scope.InstructionForm.file.$setDirty();
	
			($scope.InstructionForm.$valid) ? InstructionService.update(vm.input).then(function(){
				$state.go('main.admin.instruction', null, { reload: true });
			}) : vm.validated = true;
		}
	
		vm.today = function() {
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
		
		vm.today();
		vm.toggleMin();
		
		return vm;
	}
	
})();

