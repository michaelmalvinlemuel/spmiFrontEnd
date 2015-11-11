(function () {

	angular
		.module('spmiFrontEnd')
		.controller('GroupJobController', GroupJobController)
		.controller('CreateGroupJobController', CreateGroupJobController)
		.controller('UpdateGroupJobController', UpdateGroupJobController)

	function GroupJobController ($state, groupJobs, GroupJobService) {
		var vm = this;
		vm.groupJobs = groupJobs;
	
		vm.update = function(id){
			$state.go('main.admin.groupJob.update', {groupJobId: id})
		}
	
		vm.destroy = function(id, index){
			var alert = confirm("Apakah Anda yakin ingin menghapus Group Job ini?");
			(alert == true) ? GroupJobService.destroy(id).then(function(){
				groupJobs.splice(index, 1);
			}) : null;
		}
		
		return vm;
	}
	
	function CreateGroupJobController ($rootScope, $scope, $state, $timeout, $modal, GroupJobService) {
		var vm = this;
		var timeoutNamePromise;
		vm.input = {}
		vm.input.jobs = []
		vm.validated = false
	
	
	
		$scope.$watch('vm.input.name', function () {
			var validInput = $scope.GroupJobForm.name.$invalid
			var dirtyInput = $scope.GroupJobForm.name.$dirty
			
			if (!validInput && dirtyInput) {
				$timeout.cancel(timeoutNamePromise)
				vm.loadingName = true;
				timeoutNamePromise = $timeout(function(){
					GroupJobService.validatingName(vm.input).then(function(data){
						(data.length > 0) ? vm.existName = true : vm.existName = false;
						vm.loadingName = false;
					})
				}, 1000);
			}		
		})
	
		vm.addJob = function(){
			var modalInstance = $modal.open({
				animation: true,
				templateUrl: 'app/admin/job/views/modal.html',
				controller: 'CreateModalJobController as vm',
				resolve: {
					withOccupied: false,
				}
			})
	
			modalInstance.result.then(function(job){
				$rootScope.pushIfUnique(vm.input.jobs, job)
			}, function () {
				//$log.info('Modal dismissed at: ' + new Date());
			})
		}
	
		vm.update = function (object, index) {
			var modalInstance = $modal.open({
				animation: true,
				templateUrl: 'app/admin/job/views/modal.html',
				controller: 'UpdateModalJobController as vm',
				resolve: {
					job: object,
					withOccupied: false,
				}
			})
	
			modalInstance.result.then(function(job) {
				($rootScope.findObject(vm.input.jobs, job) == -1) 
				? vm.input.jobs[index] = job  
				: alert('Pekerjaan ini sudah bagian dari group');
			}, function () {
				//$log.info('Modal dismissed at: ' + new Date());
			})
		}
	
		vm.destroy = function (object, index) {
			var alert = confirm("Apakah Anda yakin ingin menghapus Job ini dari GroupJob?")
			if (alert == true) {
				vm.input.jobs.splice(index, 1);
			}
		}
	
		vm.submit = function(){
			$scope.GroupJobForm.name.$setDirty();
			$scope.GroupJobForm.description.$setDirty();
			($scope.GroupJobForm.$valid) ? GroupJobService.store(vm.input).then(function(){
				$state.go('main.admin.groupJob', null, {reload: true});
			}) : vm.validated = true;
		}
		
		return vm;
	}
	
	function UpdateGroupJobController ($rootScope, $scope, $state, $timeout, $modal, groupJob, GroupJobService, GroupJobDetailService) {
		var vm = this;
		var timeoutNamePromise;
		vm.input = groupJob;
		vm.validated = false
	
		$scope.$watch('vm.input.name', function () {
			var validInput = $scope.GroupJobForm.name.$invalid
			var dirtyInput = $scope.GroupJobForm.name.$dirty
			
			if (!validInput && dirtyInput) {
				$timeout.cancel(timeoutNamePromise)
				vm.loadingName = true;
				timeoutNamePromise = $timeout(function(){
					GroupJobService.validatingName(vm.input).then(function(data){
						(data.length > 0) ? vm.existName = true : vm.existName = false;
						vm.loadingName = false;
					})
				}, 1000);
			}		
		})
	
		vm.addJob = function(){
			var modalInstance = $modal.open({
				animation: true,
				templateUrl: 'app/admin/job/views/modal.html',
				controller: 'CreateModalJobController as vm',
				resolve: {
					withOccupied: false,
				}
			})
	
			modalInstance.result.then(function(job){
				var data = {
					groupJob_id: vm.input.id,
					id: job.id,
				}
				
				GroupJobDetailService.store(data).then(function(data){
					vm.input.jobs.push(data);
				}, function(data){
					alert(data.body);
				})
			}, function(){});
		}
	
		vm.update = function (object, index) {
			var modalInstance = $modal.open({
				animation: true,
				templateUrl: 'app/admin/job/views/modal.html',
				controller: 'UpdateModalJobController as vm',
				resolve: {
					job: function(){
						delete object.pivot;
						return object;
					},
					withOccupied: false,
				}
			})
	
			modalInstance.result.then(function(job) {
				var data = {
					groupJob_id: vm.input.id,
					job_id: object.id,
					id: job.id,
				}
				
				GroupJobDetailService.update(data).then(function(data){
					vm.input.jobs[index] = data;
				}, function(data){
					alert(data.body);
				})
			}, function () {
				//$log.info('Modal dismissed at: ' + new Date());
			})
		}
	
		vm.destroy = function (object, index) {
			var data = {
				groupJob_id: vm.input.id,
				job_id: object.id,
			}
			var alert = confirm("Apakah Anda yakin ingin menghapus Job ini dari GroupJob?")
			if (alert == true) {
				GroupJobDetailService.destroy(data).then(function(data){
					vm.input.jobs.splice(index, 1);
				}, function(data){})
			}
		}
	
		vm.submit = function(){
			$scope.GroupJobForm.name.$setDirty();
			$scope.GroupJobForm.description.$setDirty();
			($scope.GroupJobForm.$valid) ? GroupJobService.store(vm.input).then(function(){
				$state.go('main.admin.groupJob', null, {reload: true});
			}) : vm.validated = true;
		}
		
		return vm;
	}
	

	
	

})();



