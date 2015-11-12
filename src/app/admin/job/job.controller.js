(function () {
	'use strict'
	angular
		.module('spmiFrontEnd')

		.controller('JobController', JobController)
		.controller('CreateJobController',  CreateJobController)
		.controller('UpdateJobController', UpdateJobController)
		
		.controller('CreateModalJobController', CreateModalJobController)
		.controller('UpdateModalJobController', UpdateModalJobController)
		
	function JobController ($state, universities, JobService) {
		var vm = this
		
		vm.jobs = []
		vm.universities = universities
		
		vm.select = function () {
			JobService.university(vm.university_id).then(function(data){
				vm.jobs = data;
			})
		}
	
		vm.update = function (id) {
			$state.go('main.admin.job.update', {jobId: id})
		}
	
		vm.destroy = function (id, index) {
			var alert = confirm("Apakah Anda yakin ingin menghapus Job ini?")
			if (alert == true) {
				JobService.destroy(id).then(function() {
					vm.jobs.splice(index, 1);
				})
			}
		}
	
		return vm
	}
	
	function CreateJobController ($scope, $state, $timeout, universities, DepartmentService, JobService) {
		
		var vm = this;
		var timeoutPromise;
		
		vm.input = {}
		vm.universities = universities
		vm.departments = {}
		vm.jobs = {}
		vm.validated = false;
		
		vm.selectUniversity = function (id) {
			vm.loadingDepartment = true
			DepartmentService.university(id).then(function(data){
				vm.departments = data;
				vm.loadingDepartment = false;
				vm.loadingJob = true;
				(data.length > 0) ? vm.hasDepartment = true : vm.hasDepartment = false;
				return JobService.university(id)
			}).then(function(data){
				vm.jobs = data;
				vm.loadingJob = false
			})
		}
		
		$scope.$watch('vm.input.name', function () {
			var validName = $scope.JobForm.name.$invalid
			var dirtyName = $scope.JobForm.name.$dirty
			
			if (!validName && dirtyName) {
				$timeout.cancel(timeoutPromise)
				vm.loading = true;
				timeoutPromise = $timeout(function() {
					JobService.validating(vm.input).then(function(data) {
						(data.length > 0) ? vm.exist = true : vm.exist = false
						vm.loading = false;
					})
				}, 1000)
			}		
		})
	
	
		vm.submit = function () {
			$scope.JobForm.university_id.$setDirty();
			$scope.JobForm.department_id.$setDirty();
			$scope.JobForm.name.$setDirty();
	
			if ($scope.JobForm.$valid) {
				JobService.store(vm.input).then(function(){
					$state.go('main.admin.job', null, { reload: true });
				})
			} else vm.validated = true;
		}
		
		return vm;
	}
	
	function UpdateJobController ($scope, $state, $timeout, job, universities, DepartmentService, JobService) {
		var vm = this
		var timeoutPromise;
		vm.input = job
		vm.universities = universities
		vm.departments = {}
		vm.jobs = {}
		vm.validated = false;
	
		
		vm.input.multiple = (vm.input.multiple == 1) ? true : false;
		vm.university_id = vm.input.department.university.id;
		
		DepartmentService.university(vm.university_id)
			.then(function(data) {
				vm.departments = data;
				vm.loadingDepartment = false;
				(data.length > 0) ? vm.hasDepartment = true : vm.hasDepartment = false
				return JobService.university(vm.university_id)
			})
			.then(function (data) {
				vm.jobs = data;
			})
	
		vm.selectUniversity = function (id) {
			vm.loadingDepartment = true
			DepartmentService
				.university(id)
				.then(function (data) {
					vm.departments = data;
					vm.loadingDepartment = false;
					vm.loadingJob = true;
					(data.length > 0) ? vm.hasDepartment = true : vm.hasDepartment = false;
					return JobService.university(id);
			})
			.then(function(data) {
				vm.jobs = data;
				vm.loadingJob = false
			})
		}
		
		$scope.$watch('vm.input.name', function () {
			var validName = $scope.JobForm.name.$invalid
			var dirtyName = $scope.JobForm.name.$dirty
			
			if (!validName && dirtyName) {
				$timeout.cancel(timeoutPromise)
				vm.loading = true;
				timeoutPromise = $timeout(function(){
					JobService.validating(vm.input).then(function(data){
						(data.length > 0) ? vm.exist = true : vm.exist = false;
						vm.loading = false;
					})
				}, 1000)
			}		
		})
	
	
		vm.submit = function () {
			$scope.JobForm.university_id.$setDirty();
			$scope.JobForm.department_id.$setDirty();
			$scope.JobForm.name.$setDirty();
	
			if ($scope.JobForm.$valid) {
				JobService.update(vm.input).then(function(){
					$state.go('main.admin.job', null, { reload: true });
				})
			} else vm.validated = true;
		}
	}
	
	function CreateModalJobController ($scope, $modalInstance, withOccupied, UniversityService, DepartmentService, JobService) {
		var vm = this;
		
		vm.input = {}
		vm.universities = []
		vm.departments = []
		vm.jobs = []
		vm.validated = false
		vm.exsistJob = false;
		
		
		UniversityService.get().then(function(data){
			vm.universities = data;
			vm.loadingUniversity = false;
		});
		
		
		vm.selectUniversity = function(id){
			vm.loadingDepartment = true
			DepartmentService.university(id).then(function(data){
				vm.departments = data;
				vm.loadingDepartment = false;
				(data.length > 0) ? vm.hasDepartment = true : vm.hasDepartment = false;
			})
		}
	
		vm.selectDepartment = function (id) {
			vm.loadingJob = true;
			JobService.department(id).then(function(data){
				vm.jobs = data;
				vm.loadingJob = false;
				(data.length > 0) ? vm.hasJob = true : vm.hasJob = false;
			})
		}
	
		vm.selectJob = function(data) {
			if (vm.input.id) {
				vm.loadingJob = true;
				JobService.users(data.id).then(function(data) {
					if(withOccupied)
					(data.multiple == 0 && data.users.length > 0) ? vm.occupied = data.users[0].name : vm.occupied = undefined;
					vm.loadingJob = false;
				})
			}
				
		}
	
		vm.submit = function(){
			$scope.UserJobForm.university.$setDirty();
			$scope.UserJobForm.department.$setDirty();
			$scope.UserJobForm.job.$setDirty();
	
			if ($scope.UserJobForm.$valid) {
				vm.input.department = vm.department
				$modalInstance.close(vm.input);
			} else {
				vm.validated = true;
			}
		}
	
		vm.close = function () {
			$modalInstance.dismiss('cancel');
		}
		
		return vm;
	}
	
	function UpdateModalJobController($rootScope, $scope, $modalInstance, job, withOccupied, UniversityService, DepartmentService, JobService) {
		
		var vm = this;
		
		vm.input = job
		vm.universities = []
		vm.departments = []
		vm.jobs = []
		vm.validated = false
		vm.exsistJob = false;
	
		vm.loadingUniversity = true
		UniversityService.get().then(function(data){
			vm.universities = data;
			vm.university = vm.universities[$rootScope.findObject(vm.universities, vm.input.department.university)];
			vm.hasUniversity = true;
			vm.loadingUniversity = false;
			vm.loadingDepartment = true;
			return DepartmentService.university(vm.university.id)
		}).then(function(data) {
			vm.departments = data
			vm.department = vm.departments[$rootScope.findObject(vm.departments, vm.input.department)];
			vm.hasDepartment = true
			vm.loadingDepartment = false
			vm.loadingJob = true
			return JobService.department(vm.department.id)
		}).then(function(data) {
			vm.jobs = data;
			vm.input = vm.jobs[$rootScope.findObject(vm.jobs, vm.input)];
			vm.hasJob = true
			vm.loadingJob = false
		})

	
		vm.selectUniversity = function(id){
			vm.loadingDepartment = true
			DepartmentService.university(id).then(function(data){
				vm.departments = data;
				vm.loadingDepartment = false;
				(data.length > 0) ? vm.hasDepartment = true : vm.hasDepartment = false;
			})
		}
	
		vm.selectDepartment = function (id) {
			vm.loadingJob = true;
			JobService.department(id).then(function(data){
				vm.jobs = data;
				vm.loadingJob = false;
				(data.length > 0) ? vm.hasJob = true : vm.hasJob = false;
			})
		}
	
		vm.selectJob = function(data) {
			if (vm.input.id) {
				vm.loadingJob = true;
				JobService.users(data.id).then(function(data) {
					if(withOccupied)
					(data.multiple == 0 && data.users.length > 0) ? vm.occupied = data.users[0].name : vm.occupied = undefined;
					vm.loadingJob = false;
				})
			}
				
		}
	
		vm.submit = function(){
			$scope.UserJobForm.university.$setDirty();
			$scope.UserJobForm.department.$setDirty();
			$scope.UserJobForm.job.$setDirty();
	
			if ($scope.UserJobForm.$valid) {
				vm.input.department = vm.department
				$modalInstance.close(vm.input);
			} else {
				vm.validated = true;
			}
		}
	
		vm.close = function () {
			$modalInstance.dismiss('cancel');
		}
		
		return vm;
	}
	
})();





