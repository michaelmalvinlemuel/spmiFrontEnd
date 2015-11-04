(function() {
	
	angular
		.module('spmiFrontEnd')
		
		.controller('UserController', UserController)
		.controller('CreateUserController', CreateUserController)
		.controller('UpdateUserController', UpdateUserController)
		.controller('ModalUserController', ModalUserController)

	function generateYear () {
		var today = new Date().getFullYear();
		console.log(today);
		var object = []
		for (var i = 10; i < 100; i++) {
			object.push({year: today-i})
		}
		return object//[{no: 1, year:'2015'}, {no: 2, year:'2014'}, {no: 3, year:'2013'}]
	}
	
	function generateMonth () {
		return [
			{id: 1, month: 'Januari'},
			{id: 2, month: 'Febuari'},
			{id: 3, month: 'Maret'},
			{id: 4, month: 'April'},
			{id: 5, month: 'Mei'},
			{id: 6, month: 'Juni'},
			{id: 7, month: 'Juli'},
			{id: 8, month: 'Agustus'},
			{id: 9, month: 'September'},
			{id: 10, month: 'Oktober'},
			{id: 11, month: 'November'},
			{id: 12, month: 'Desember'},
		]
	}
	
	function generateDay (year, month) {
		var tanggal = []
		var j = 0;
		
		if (year.year % 4 == 0 && month == 2) {
			j = 29
		} else if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
			j = 31
		} else if (month == 2) {
			j = 28
		} else {
			j = 30
		}
	
		for (var i = 1 ; i <= j ; i++) {
			tanggal.push({day: i})
		}
	
		return tanggal
	}
	
	
	function UserController ($state, users, UserService) {
		
		var vm = this;
		
		vm.users = users
	
		vm.detail = function (id) {
			$state.go('main.admin.user.detail', {userId: id})
		}
	
		vm.update = function (request) {
			$state.go('main.admin.user.update', {userId: request})
		}
	
		vm.destroy = function (id, index){
			var alert = confirm("Apakah Anda yakin ingin menghapus User ini?");
			(alert == true) ? UserService.destroy(id).then(function(){
				users.splice(index, 1);	
			}) : null;
		}
			
		return vm;
	}
	
	function CreateUserController ($rootScope, $scope, $state, $timeout, $modal, UserService) {
		var vm = this;
		
		var timeoutNikPromise, timeoutEmailPromise
		vm.input = {}
		vm.input.jobs = []
		vm.years = {}
		vm.months = {}
		vm.days = {}
		vm.validated = false
		
		vm.years =  generateYear()
		
	
	
		$scope.$watch('vm.input.nik', function () {
			var validInput = $scope.UserForm.nik.$invalid
			var dirtyInput = $scope.UserForm.nik.$dirty
			
			if (!validInput && dirtyInput) {
				$timeout.cancel(timeoutNikPromise)
				vm.loadingNik = true;
				timeoutNikPromise = $timeout(function() {
					UserService.validatingNik(vm.input).then(function (data) {
						(data.length > 0) ? vm.existNik = true : vm.existNik = false;
						vm.loadingNik = false;
					})
				}, 1000)
			}		
		})
	
		$scope.$watch('vm.input.email', function () {
			var validInput = $scope.UserForm.email.$invalid
			var dirtyInput = $scope.UserForm.email.$dirty
			
			if (!validInput && dirtyInput) {
				$timeout.cancel(timeoutEmailPromise)
				vm.loadingEmail = true;
				timeoutEmailPromise = $timeout(function() {
					UserService.validatingEmail(vm.input).then(function (data) {
						(data.length > 0) ? vm.existEmail = true : vm.existEmail = false;
						vm.loadingEmail = false;
					})
				}, 1000)
			}		
		})
	
		vm.selectYear = function () {
			console.log('1')
			vm.month = undefined;
			vm.day = undefined;
			vm.months = generateMonth()
			vm.input.born = undefined
		}
	
		vm.selectMonth = function () {
			console.log('2')
			vm.day = undefined;
			vm.days = generateDay(vm.year, vm.month)
			vm.input.born = undefined
		}
	
		vm.selectDay = function () {
			vm.input.born = new Date(vm.year.year, vm.month - 1, vm.day.day + 1)
		}
	
		vm.addJob = function() {
	
			var modalInstance = $modal.open({
				animation: true,
				templateUrl: 'app/admin/job/views/modal.html',
				controller: 'CreateModalJobController as vm',
				resolve: {
					withOccupied: true,
				},
			})
	
			modalInstance.result.then(function(job){
				$rootScope.pushIfUnique(vm.input.jobs, job);
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
					job: function () {
						return object;
					},
					withOccupied: true,
				}
			})
	
			modalInstance.result.then(function(job) {
				($rootScope.findObject(vm.input.jobs, job) == -1) ? vm.input.jobs[index] = job : alert('Pekerjaan ini sudah bagian dari user');
			}, function(){})
		}
	
		vm.destroy = function (object, index) {
			var alert = confirm("Apakah Anda yakin ingin menghapus Job ini dari User?");
			(alert == true) ? vm.input.jobs.splice(index, 1) : null;
		}
	
		vm.submit = function () {
			$scope.UserForm.nik.$setDirty();
			$scope.UserForm.name.$setDirty();
			$scope.UserForm.day.$setDirty();
			$scope.UserForm.address.$setDirty();
			$scope.UserForm.type.$setDirty();
			$scope.UserForm.email.$setDirty();
			//$scope.UserForm.password.$setDirty();
			//$scope.UserForm.confirmation.$setDirty();
	
			($scope.UserForm.$valid) ? UserService.store(vm.input).then(function () {
				$state.go('main.admin.user', null, {reload: true});
			}) : vm.validated = true;
		}
		
		return vm;
	}
	
	function UpdateUserController ($scope, $state, $timeout, $modal, user, UserService, UserJobService) {
		
		var vm = this;
		var timeoutNikPromise, timeoutEmailPromise
		
		vm.input = user
		
		vm.days = {}
		vm.month = {}
		vm.tanggal = NaN
		vm.years =  generateYear()
		vm.months = generateMonth()
	
		
		vm.input = user
		vm.input.born = new Date(vm.input.born)
		vm.year = {year: vm.input.born.getFullYear()}
		
		vm.month = vm.input.born.getMonth() + 1
		vm.days = generateDay(vm.year.year, vm.month)
	
		var dt = vm.input.born;
		vm.tanggal = dt.getDate()
		vm.day = {day: vm.tanggal}
	
		$scope.$watch('vm.input.nik', function () {
			var validInput = $scope.UserForm.nik.$invalid
			var dirtyInput = $scope.UserForm.nik.$dirty
			
			if (!validInput && dirtyInput) {
				$timeout.cancel(timeoutNikPromise)
				vm.loadingNik = true;
				timeoutNikPromise = $timeout(function(){
					UserService.validatingNik(vm.input).then(function(data){
						(data.length > 0) ? vm.existNik = true : vm.existNik = false;
						vm.loadingNik = false;
					})
				}, 1000)
			}		
		})
	
		$scope.$watch('vm.input.email', function () {
			var validInput = $scope.UserForm.email.$invalid
			var dirtyInput = $scope.UserForm.email.$dirty
			
			if (!validInput && dirtyInput) {
				$timeout.cancel(timeoutEmailPromise)
				vm.loadingEmail = true;
				timeoutEmailPromise = $timeout(function(){
					UserService.validatingEmail(vm.input).then(function(data){
						(data.length > 0) ? vm.existEmail = true : vm.existEmail = false;
						vm.loadingEmail = false;
					})
				}, 1000)
			}		
		})
	
		vm.selectYear = function () {
			console.log('1')
			vm.month = undefined;
			vm.day = undefined;
			vm.months = generateMonth()
			vm.input.born = undefined
		}
	
		vm.selectMonth = function(){
			console.log('2')
			vm.day = undefined;
			vm.days = generateDay(vm.year, vm.month)
			vm.input.born = undefined
		}
	
		vm.selectDay = function () {
			vm.input.born = new Date(vm.year.year, vm.month - 1, vm.day.day + 1)
		}
	
		vm.addJob = function(){
			var modalInstance = $modal.open({
				animation: true,
				templateUrl: 'app/admin/job/views/modal.html',
				controller: 'CreateModalJobController as vm',
				resolve: {
					withOccupied: true,
				}
			})
	
			modalInstance.result.then(function(job){
				var data = {
					user_id: vm.input.id,
					id: job.id
				}
				
				UserJobService.store(data).then(function(data){
					vm.input.jobs.push(data);
				}, function(data) {
					alert(data.body);
				})
				
			}, function () {
				//$log.info('Modal dismissed at: ' + new Date());
			})
		}
	
		vm.update = function(object, index) {
			var modalInstance = $modal.open({
				animation: true,
				templateUrl: 'app/admin/job/views/modal.html',
				controller: 'UpdateModalJobController as vm',
				resolve: {
					job: function(){
						delete object.pivot;
						return object;
					},
					withOccupied: true,
				}
			})
	
			modalInstance.result.then(function(job) {
				console.log(object.id);
				var data = {
					user_id: vm.input.id, 
					job_id: object.id,
					id: job.id
				}
				
				UserJobService.update(data).then(function(data){
					vm.input.jobs[index] = data
				}, function(data) {
					alert(data.body);
				})
	
				
			}, function () {
				//$log.info('Modal dismissed at: ' + new Date());
			})
		}
	
		vm.destroy = function(object, index){
			var alert = confirm("Apakah Anda yakin ingin menghapus Job ini dari User?");
			var data = {
				user_id: vm.input.id,
				job_id: object.id
			};
			
			(alert == true) ? UserJobService.destroy(data).then(function(){
				vm.input.jobs.splice(index, 1);
			}) : null;
		}
	
		vm.submit = function () {
			$scope.UserForm.nik.$setDirty();
			$scope.UserForm.name.$setDirty();
			$scope.UserForm.day.$setDirty();
			$scope.UserForm.address.$setDirty();
			$scope.UserForm.type.$setDirty();
			$scope.UserForm.email.$setDirty();
	
			($scope.UserForm.$valid) ? UserService.update(vm.input).then(function(){
				$state.go('main.admin.user', null, {reload: true});
			}) : vm.validated = true;
		}
	
		return vm;
	}
	
	function ModalUserController($timeout, $modalInstance, users, UserService) {
		var vm = this;
		
		vm.users = []
		vm.input = users
	
		UserService.get().then(function(data){
			vm.users = data
			for (var i = 0 ; i < vm.users.length ; i++) {
				for (var j = 0 ; j < vm.input.length ; j++) {
					if (vm.users[i].id == vm.input[j].id) {
						vm.users[i].leader = vm.input[j].leader
						vm.users[i].check = vm.input[j].check
					}
				}
			}
		})
		
	
		vm.checkAll = function() {
			vm.input = []
			var counter = 0
	
			for (var i = 0 ; i < vm.users.length ; i++) {
				vm.users[i].leader = false
				if (vm.checked) {
					vm.users[i].check = true
					vm.input.push(vm.users[i])
					counter++
				} else {
					vm.users[i].check = false
				}
			}
	
			vm.selected = counter + ' user selected from ' + vm.users.length
		};
	
		vm.checkCustom = function() {
			vm.checked = false;
			var counter = 0
			vm.input = []
	
			for (var i = 0 ; i < vm.users.length ; i ++) {
				vm.users[i].leader = false
				if (vm.users[i].check == true) {
					vm.input.push(vm.users[i])
					counter++
				}
			}
	
			vm.selected = counter + ' user selected from ' + vm.users.length
		};
	
		vm.submit = function () {
			$modalInstance.close(vm.input)
		};
	
		vm.close = function () {
			$modalInstance.dismiss('cancel');
		}
	
		return vm;
	};
		
})();



