(function () {
	'use strict'
	angular
		.module('spmiFrontEnd')
		.controller('DepartmentController', DepartmentController)
		.controller('CreateDepartmentController', CreateDepartmentController)
		.controller('UpdateDepartmentController', UpdateDepartmentController)

	function DepartmentController ($state, departments, DepartmentService) {
		var vm = this
		vm.departments = departments
	
		vm.update = function (id) {
			$state.go('main.admin.department.update', {departmentId: id})
		}
	
		vm.destroy = function(id, index) {
			var alert = confirm("Apakah Anda yakin ingin menghapus Department ini?")
			if (alert == true) {
				DepartmentService.destroy(id).then(function(){
					vm.departments.splice(index, 1);
				})
			}
		}
		
		
		
		return vm;
	}
	
	function CreateDepartmentController ($scope, $state, $timeout, universities, DepartmentService) {
		
		var timeoutPromise;
		var vm = this;
		
		vm.input = {}
		vm.universities = universities
		vm.departments = {}
		vm.validated = false;
		
		vm.select = function() {
			vm.loadingDepartment = true
			DepartmentService.university(vm.input.university_id).then(function(data){
				vm.loadingDepartment = false
				vm.departments = data
				if (vm.input.name) {
					$timeout.cancel(timeoutPromise)
					vm.loading = true;
					timeoutPromise = $timeout(function() {
						return DepartmentService.validating(vm.input)
					}, 1000)
					.then(function (data) {
						(data.length > 0) ? vm.exist = true : vm.exist = false
						vm.loading = false;
					})
				}
			})
		}
		
		$scope.$watch('vm.input.name', function () {
			var validName = $scope.DepartmentForm.name.$invalid
			var dirtyName = $scope.DepartmentForm.name.$dirty
			
			if (!validName && dirtyName) {
				$timeout.cancel(timeoutPromise)
				vm.loading = true;
				timeoutPromise = $timeout(function(){
					DepartmentService.validating(vm.input).then(function (data) {
						(data.length > 0) ? vm.exist = true : vm.exist = false
						vm.loading = false;
					})
				}, 1000)
			}
		})
		
		vm.submit = function () {
			$scope.DepartmentForm.name.$setDirty();
			$scope.DepartmentForm.university_id.$setDirty();
	
			if ($scope.DepartmentForm.$valid){
				DepartmentService.store(vm.input).then(function(){
					$state.go('main.admin.department', null, { reload: true })
				})
			} else vm.validated = true;
		}
	}
	
	function UpdateDepartmentController ($scope, $state, $timeout, department, universities, departments, DepartmentService) {
		var timeoutPromise;
		var vm = this;
		
		vm.input = department
		vm.departments = departments
		vm.universities = universities
		vm.validated = false;
		
		vm.select = function() {
			vm.loadingDepartment = true
			DepartmentService.university(vm.input.university_id).then(function(data){
				vm.loadingDepartment = false
				vm.departments = data
			})
		}
		
		$scope.$watch('vm.input.name', function () {
			var validName = $scope.DepartmentForm.name.$invalid
			var dirtyName = $scope.DepartmentForm.name.$dirty
			
			if (!validName && dirtyName) {
				$timeout.cancel(timeoutPromise)
				vm.loading = true;
				timeoutPromise = $timeout(function(){
					DepartmentService.validating(vm.input).then(function (data) {
						(data.length > 0) ? vm.exist = true : vm.exist = false
						vm.loading = false;
					})
				}, 1000)
			}
		})
	
		vm.submit = function () {
			$scope.DepartmentForm.name.$setDirty();
			$scope.DepartmentForm.university_id.$setDirty();
	
			if ($scope.DepartmentForm.$valid){
				DepartmentService.update(vm.input).then(function (data) {
					$state.go('main.admin.department', null, {reload: true});
				})
			} else vm.validated = true;
		}
		
		return vm;
	}

})();



