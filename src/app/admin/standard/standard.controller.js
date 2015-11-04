(function () {

	angular
		.module('spmiFrontEnd')
		.controller('StandardController', StandardController)
		.controller('CreateStandardController', CreateStandardController)
		.controller('UpdateStandardController', UpdateStandardController)

})();


function StandardController ($state, standards, StandardService) {
	var vm = this;
	
	vm.standards = standards;

	vm.update = function(id){
		$state.go('main.admin.standard.update', {standardId: id})
	}

	vm.destroy = function (id, index) {
		var alert = confirm("Apakah Anda yakin ingin menghapus standard ini?");
		(alert == true) ? StandardService.destroy(id).then(function(){
			vm.standards.splice(index, 1);
		}) : null ;
	}

	return vm;
}

function CreateStandardController($scope, $state, $timeout, StandardService) {
	var vm = this;
	var timeoutPromise;
	
	vm.input = {}
	vm.validated = false;

	

	$scope.$watch('vm.input.description', function(){
		var validName = $scope.StandardForm.description.$invalid
		var dirtyName = $scope.StandardForm.description.$dirty
		
		if (!validName && dirtyName) {
			$timeout.cancel(timeoutPromise)
			vm.loading = true;
			timeoutPromise = $timeout(function(){
				StandardService.validating(vm.input).then(function(data){
					(data.length > 0) ? vm.exist = true : vm.exist = false;
					vm.loading = false;
				})
			}, 1000)
		}		
	})


	vm.submit = function () {

		$scope.StandardForm.date.$setDirty();
		$scope.StandardForm.description.$setDirty();

		($scope.StandardForm.$valid) ? StandardService.store(vm.input).then(function(response){
			$state.go('main.admin.standard', null, { reload: true });
		}) : vm.validated = true;
	}

	vm.today = function(){
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

function UpdateStandardController ($scope, $state, $timeout, standard, StandardService) {
	var vm = this;
	var timeoutPromise;
	vm.input = standard;
	vm.validated = false;

	vm.input.date = new Date(vm.input.date);

	$scope.$watch('vm.input.description', function(){
		var validName = $scope.StandardForm.description.$invalid
		var dirtyName = $scope.StandardForm.description.$dirty
		
		if (!validName && dirtyName){
			$timeout.cancel(timeoutPromise)
			vm.loading = true;
			timeoutPromise = $timeout(function(){
				StandardService.validating(vm.input).then(function(data) {
					(data.length > 0) ? vm.exist = true : vm.exist = false;
					vm.loading = false;
				})
			}, 1000)
		}		
	})

	vm.submit = function () {
		$scope.StandardForm.date.$setDirty();
		$scope.StandardForm.description.$setDirty();

		($scope.StandardForm.$valid) ? StandardService.update(vm.input).then(function(){
			$state.go('main.admin.standard', null, { reload: true });
		}) : vm.validated = true;
	}

	vm.today = function() {
    	vm.input.date = new Date();
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

	return vm;
}
