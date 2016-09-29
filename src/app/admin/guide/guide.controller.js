(function () {
	'use strict'
	angular
		.module('spmiFrontEnd')
		.controller('GuideController', GuideController)
		.controller('CreateGuideController', CreateGuideController)
		.controller('UpdateGuideController', UpdateGuideController)
	
	function GuideController ($state, guides, GuideService, $window, FILE_HOST){
		var vm = this;

		vm.guides = guides;
		vm.service = GuideService.get;
		vm.fields = [
			{
				header: 'Standar Dokumen',
				record: 'instruction.description',
				visible: true,
			},
			{
				header: 'No',
				record: 'no',
				visible: true,
			},
			{
				header: 'Pedoman',
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
			$window.open(FILE_HOST + '/upload/guide/' + object.document)
		}

		function update (object) {
			$state.go('main.admin.guide.update', {guideId: object.id});
		}
	
		function destroy (object, index){
			var alert = confirm("Apakah Anda yakin ingin menghapus Dokumen Pedoman ini?");
			(alert == true) ? GuideService.destroy(object.id).then(function(){
				vm.guides.data.splice(index, 1);
			}) : null;
		}
	
		return vm;
	}
	
	function CreateGuideController($scope, $state, $timeout, standards, StandardDocumentService, GuideService){
		var vm = this;
		var timeoutNoPromise, timeoutDescriptionPromise
		vm.input = {}
		vm.standards = standards
		vm.standardDocuments = {}
		vm.validated = false;
		vm.requiredUpload = true
	
		vm.select = function (id) {
			vm.loadingStandardDocument = true
			StandardDocumentService.standard(id).then(function(data){
				console.log(data);
				vm.standardDocuments = data;
				vm.loadingStandardDocument = false;
				(data.length > 0) ? vm.hasStandard = true : vm.hasStandard = false;
			})
		}
	
		$scope.$watch('vm.input.no', function(){
			var validInput = $scope.GuideForm.no.$invalid;
			var dirtyInput = $scope.GuideForm.no.$dirty;

			if (!validInput && dirtyInput) {
				$timeout.cancel(timeoutNoPromise)
				vm.loadingNo = true;
				timeoutNoPromise = $timeout(function(){
					GuideService.validatingNo(vm.input).then(function(data){
						(data.length > 0) ? vm.existNo = true : vm.existNo = false;
						vm.loadingNo = false;
					})
				}, 1000)
			}		
		})
	
		$scope.$watch('vm.input.description', function () {
			var validInput = $scope.GuideForm.description.$invalid
			var dirtyInput = $scope.GuideForm.description.$dirty
			
			if (!validInput && dirtyInput) {
				$timeout.cancel(timeoutDescriptionPromise)
				vm.loadingDescription = true;
				timeoutDescriptionPromise = $timeout(function(){
					GuideService.validatingDescription(vm.input).then(function(data){
						(data.length > 0) ? vm.existDescription = true : vm.existDescription = false;
						vm.loadingDescription = false;
					})
				}, 1000)
			}		
		})
	
		vm.submit = function(){
			$scope.GuideForm.standard_id.$setDirty();
			$scope.GuideForm.standard_document_id.$setDirty();
			$scope.GuideForm.no.$setDirty();
			$scope.GuideForm.date.$setDirty();
			$scope.GuideForm.description.$setDirty();
			$scope.GuideForm.file.$setDirty();
	
			($scope.GuideForm.$valid) ? GuideService.store(vm.input).then(function(){
				$state.go('main.admin.guide', null, { reload: true });
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
	
	function UpdateGuideController ($scope, $state, $timeout, guide, standards, StandardDocumentService, GuideService) {
		var vm = this;
		var timeoutNoPromise, timeoutDescriptionPromise;
		vm.input = guide
		vm.standards = standards
		vm.standardDocuments = []
		vm.validated = false;
		vm.requiredUpload = false
		
		vm.input.date = new Date(vm.input.date);
		vm.standard_id = vm.input.standard_document.standard.id;
		vm.hasStandardDocument = true;
		
		vm.select = function(id){
			vm.loadingStandardDocument = true;
			StandardDocumentService.standard(id).then(function(data){
				vm.standardDocuments = data;
				vm.loadingStandardDocument = false;
				(data.length > 0) ? vm.hasStandard = true : vm.hasStandard = false;
			})
		}
		
		vm.select(vm.standard_id);
	
		$scope.$watch('vm.input.no', function () {
			var validInput = $scope.GuideForm.no.$invalid
			var dirtyInput = $scope.GuideForm.no.$dirty
			
			if (!validInput && dirtyInput) {
				$timeout.cancel(timeoutNoPromise)
				vm.loadingNo = true;
				timeoutNoPromise = $timeout(function() {
					GuideService.validatingNo(vm.input).then(function(data){
						(data.length > 0) ? vm.existNo = true : vm.existNo = false;
						vm.loadingNo = false;
					})
				}, 1000)
			}		
		})
	
		$scope.$watch('vm.input.description', function () {
			var validInput = $scope.GuideForm.description.$invalid
			var dirtyInput = $scope.GuideForm.description.$dirty
			
			if (!validInput && dirtyInput) {
				$timeout.cancel(timeoutDescriptionPromise)
				vm.loadingDescription = true;
				timeoutDescriptionPromise = $timeout(function(){
					GuideService.validatingDescription(vm.input).then(function(data){
						(data.length > 0) ? vm.existDescription = true : vm.existDescription = false;
						vm.loadingDescription = false;
					})
				}, 1000)
			}		
		})
	
		vm.submit = function() {
			$scope.GuideForm.standard_id.$setDirty();
			$scope.GuideForm.no.$setDirty();
			$scope.GuideForm.date.$setDirty();
			$scope.GuideForm.description.$setDirty();
			$scope.GuideForm.file.$setDirty();
	
			($scope.GuideForm.$valid) ? GuideService.update(vm.input).then(function(){
				$state.go('main.admin.guide', null, { reload: true });
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


