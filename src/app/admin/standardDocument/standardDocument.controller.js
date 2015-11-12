(function() {
	'use strict'
	angular.module('spmiFrontEnd')
		.controller('StandardDocumentController', StandardDocumentController)
		.controller('CreateStandardDocumentController', CreateStandardDocumentController)
		.controller('UpdateStandardDocumentController', UpdateStandardDocumentController)

	function StandardDocumentController($state, standardDocuments, StandardDocumentService){
		var vm = this;
		
		vm.standardDocuments = standardDocuments;
		
		vm.update = function(id){
			$state.go('main.admin.standardDocument.update', {standardDocumentId: id})
		}
	
		vm.destroy = function(id, index) {
			var alert = confirm("apakah anda yankin ingin menghapus Standard Dokumen ini?")
			if (alert == true) StandardDocumentService.destroy(id).then(function(){
				vm.standardDocuments.splice(index, 1);
			})
		}
	
		return vm;
	}
	
	function CreateStandardDocumentController($scope, $state, $timeout, standards, StandardDocumentService) {
		var vm = this;
		var timeoutNoPromise, timeoutDescriptionPromise;
		
		vm.input = {}
		vm.standards = standards;
		vm.validated = false;
		vm.requiredUpload = true;
	
		$scope.$watch('vm.input.no', function(){
			var validInput = $scope.StandardDocumentForm.no.$invalid
			var dirtyInput = $scope.StandardDocumentForm.no.$dirty
			
			if (!validInput && dirtyInput) {
				$timeout.cancel(timeoutNoPromise)
				vm.loadingNo = true;
				timeoutNoPromise = $timeout(function(){
					StandardDocumentService.validatingNo(vm.input).then(function(data){
						(data.length > 0) ? vm.existNo = true : vm.existNo = false;
						vm.loadingNo = false;
					})
				}, 1000)
			}		
		});
	
		$scope.$watch('vm.input.description', function () {
			var validInput = $scope.StandardDocumentForm.description.$invalid
			var dirtyInput = $scope.StandardDocumentForm.description.$dirty
			
			if (!validInput && dirtyInput) {
				$timeout.cancel(timeoutDescriptionPromise)
				vm.loadingDescription = true;
				timeoutDescriptionPromise = $timeout(function(){
					StandardDocumentService.validatingDescription(vm.input).then(function(data){
						(data.length > 0) ? vm.existDescription = true : vm.existDescription = false;
						vm.loadingDescription = false;
					})
				}, 1000)
			}		
		})
	
		vm.submit = function() {
			$scope.StandardDocumentForm.standard_id.$setDirty();
			$scope.StandardDocumentForm.no.$setDirty();
			$scope.StandardDocumentForm.date.$setDirty();
			$scope.StandardDocumentForm.description.$setDirty();
			$scope.StandardDocumentForm.file.$setDirty();
	
			($scope.StandardDocumentForm.$valid) ? StandardDocumentService.store(vm.input).then(function(){
				$state.go('main.admin.standardDocument', null, { reload: true });
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
	
	function UpdateStandardDocumentController($scope, $state, $timeout, standardDocument, standards, StandardDocumentService) {
		var vm = this;
		var timeoutNoPromise, timeoutDescriptionPromise;
		vm.input = standardDocument;
		vm.standards = standards;
		vm.validated = false;
	
		vm.input.date = new Date(vm.input.date);
	
		$scope.$watch('vm.input.no', function () {
			var validInput = $scope.StandardDocumentForm.no.$invalid;
			var dirtyInput = $scope.StandardDocumentForm.no.$dirty;
			
			if (!validInput && dirtyInput) {
				$timeout.cancel(timeoutNoPromise)
				vm.loadingNo = true;
				timeoutNoPromise = $timeout(function(){
					StandardDocumentService.validatingNo(vm.input).then(function(data){
						(data.length > 0) ? vm.existNo = true : vm.existNo = false;
						vm.loadingNo = false;
					})
				}, 1000)
			}		
		})
	
		$scope.$watch('vm.input.description', function () {
			var validInput = $scope.StandardDocumentForm.description.$invalid;
			var dirtyInput = $scope.StandardDocumentForm.description.$dirty;
			
			if (!validInput && dirtyInput) {
				$timeout.cancel(timeoutDescriptionPromise)
				vm.loadingDescription = true;
				timeoutDescriptionPromise = $timeout(function(){
					StandardDocumentService.validatingDescription(vm.input).then(function(data){
						(data.length > 0) ? vm.existDescription = true : vm.existDescription = false;
						vm.loadingDescription = false;
					})
				}, 1000)
			}		
		})
	
		vm.submit = function(){
			$scope.StandardDocumentForm.standard_id.$setDirty();
			$scope.StandardDocumentForm.no.$setDirty();
			$scope.StandardDocumentForm.date.$setDirty();
			$scope.StandardDocumentForm.description.$setDirty();
			$scope.StandardDocumentForm.file.$setDirty();
	
			($scope.StandardDocumentForm.$valid) ? StandardDocumentService.update(vm.input).then(function(){
				$state.go('main.admin.standardDocument', null, { reload: true });
			}) : vm.validated = true;
		}
	
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
})();


