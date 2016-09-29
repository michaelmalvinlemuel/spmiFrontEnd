(function() {
	'use strict'
	angular.module('spmiFrontEnd')
		.controller('StandardDocumentController', StandardDocumentController)
		.controller('CreateStandardDocumentController', CreateStandardDocumentController)
		.controller('UpdateStandardDocumentController', UpdateStandardDocumentController)

	function StandardDocumentController($state, standardDocuments, StandardDocumentService, $window, FILE_HOST){
		var vm = this;
		
		vm.standardDocuments = standardDocuments;
		vm.service = StandardDocumentService.get;
		vm.fields = [
			{
				header: 'Standar',
				record: 'standard.description',
				visible: true,
			},
			{
				header: 'No',
				record: 'no',
				visible: true,
			},
			{
				header: 'Standar Dokumen',
				record: 'description',
				visible: true,
			}
		];

		vm.actions = [
			{
				type: 'download',
				color: 'btn-info',
				icon: 'fa-download',
				click: download,
			},
			{
				type: 'update',
				color: 'btn-success',
				icon: 'fa-edit',
				click: update
			},
			{
				type: 'destroy',
				color: 'btn-danger',
				icon: 'fa-close',
				click: destroy,
			}
		]

		function download (object) {
			$window.open(FILE_HOST + '/upload/standardDocument/' + object.document)
		}
		function update (object){
			$state.go('main.admin.standardDocument.update', {standardDocumentId: object.id})
		}
	
		function destroy (object, index) {
			var alert = confirm("apakah anda yankin ingin menghapus Standard Dokumen ini?")
			if (alert == true) StandardDocumentService.destroy(object.id).then(function(){
				vm.standardDocuments.data.splice(index, 1);
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
	
			if ($scope.StandardDocumentForm.$valid) {
				StandardDocumentService.store(vm.input).then(function(data){
					$state.go('main.admin.standardDocument', null, { reload: true });
				}) 
			} else {
				vm.validated = true;
			} 
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


