(function () {
	
	angular.module('spmiFrontEnd')
		.controller('UniversityController', UniversityController)
		.controller('CreateUniversityController', CreateUniversityController)
		.controller('UpdateUniversityController', UpdateUniversityController)
		
	function UniversityController ($state, universities, UniversityService) {
		var vm = this
		
		vm.universities = universities
	
		vm.update = function (id) {
			$state.go('main.admin.university.update', {universityId: id})
		}
	
		vm.destroy = function(id, index) {
			var alert = confirm("Apakah Anda yakin ingin menghapus Universitas ini?")
			if (alert == true) {
				UniversityService.destroy(id).then(function(){
					vm.universities.splice(index, 1);
				})
			}
		}
		
		return vm
	}
	
	function CreateUniversityController ($scope, $state, $timeout, UniversityService) {
		var vm = this
		
		var timeoutPromise;
		vm.input = {}
		vm.validated = false;
	
		$scope.$watch('vm.input.name', function () {
			var validName = $scope.UniversityForm.name.$invalid
			var dirtyName = $scope.UniversityForm.name.$dirty
			
			if (!validName && dirtyName) {
				$timeout.cancel(timeoutPromise)
				vm.loading = true;
				timeoutPromise = $timeout(function() {
					UniversityService.validating(vm.input)
						.then(function (data) {
							console.log(data);
							if (data.length > 0) {
								vm.exist = true
							} else {
								vm.exist = false
							}
							vm.loading = false;
						})
				}, 1000)
				
			}
			
		})
	
		vm.submit = function () {
			$scope.UniversityForm.name.$setDirty();
			$scope.UniversityForm.address.$setDirty();
			$scope.UniversityForm.phone.$setDirty();
			$scope.UniversityForm.fax.$setDirty();
	
			if ($scope.UniversityForm.$valid) {
				UniversityService.store(vm.input).then(function(){
					$state.go('main.admin.university', null, { reload: true })
				})
			} else vm.validated = true;
		}
	
		return vm
	
	}
	
	function UpdateUniversityController ($scope, $state, $timeout, university, UniversityService) {
		var vm = this
		
		var timeoutPromise;
		vm.input = university
		vm.validated = false;
	
		$scope.$watch('vm.input.name', function () {
			var validName = $scope.UniversityForm.name.$invalid
			var dirtyName = $scope.UniversityForm.name.$dirty
			
			if (!validName && dirtyName) {
				$timeout.cancel(timeoutPromise)
				vm.loading = true;
				timeoutPromise = $timeout(function() {
					UniversityService.validating(vm.input).then(function(data) {
						(data.length > 0) ? vm.exist = true : vm.exist = false;
						vm.loading = false;
					})
				}, 1000)
			}
			
		})
	
		vm.submit = function () {
			$scope.UniversityForm.name.$setDirty();
			$scope.UniversityForm.address.$setDirty();
			$scope.UniversityForm.phone.$setDirty();
			$scope.UniversityForm.fax.$setDirty();
	
			if ($scope.UniversityForm.$valid) {
				UniversityService.update(vm.input).then(function() {
					return $state.go('main.admin.university', null, { reload: true })
				})
			} else vm.validated = true;
		}
	
		return vm;
	}
})();






