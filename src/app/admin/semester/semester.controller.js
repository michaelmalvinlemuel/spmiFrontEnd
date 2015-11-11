(function () {

	angular
		.module('spmiFrontEnd')
		.controller('SemesterController', SemesterController)
		.controller('CreateSemesterController', CreateSemesterController)
		.controller('UpdateSemesterController', UpdateSemesterController)



	function SemesterController ($state, semesters, SemesterService) {
		var vm = this;
		
		vm.semesters = semesters;
	
	
	
		vm.update = function(id) {
			$state.go('main.admin.semester.update', {semesterId: id});
		}
	
		vm.destroy = function(id, index) {
			var alert = confirm('Apakah anda yakin ingin menghapus semester ini?');
			(alert == true) ? SemesterService.destroy(id).then(function() {
				semesters.splice(index, 1);			
			}) : null;
		}
		
		return vm;
	
	}
	
	function CreateSemesterController ($scope, $state, $timeout, $filter, SemesterService) {
		var vm = this;
		
		vm.input = {}
		vm.validated = false;
		vm.invalidYear = true;
		vm.status = {};
	
		vm.minDateStart = undefined;
		vm.maxDateStart = undefined;
	
		vm.minDateEnded = undefined;
		vm.maxDateEnded = undefined;
	
		vm.rangeIntersectStart = {status: false, semester: undefined};
		vm.rangeIntersectEnded = {status: false, semester: undefined};
	
		vm.include = {status: false, semester: undefined}
	
		$scope.$watchGroup(['vm.input.year_start', 'vm.input.year_ended'], function () {
	
			if (vm.input.year_ended == vm.input.year_start + 1) {
				vm.invalidYear = false;
	
				vm.minDateStart = new Date('1-1-' + vm.input.year_start);
				vm.maxDateStart = new Date('12-31-' + vm.input.year_ended);
	
				vm.input.date_start = undefined//$scope.minDateStart;
	
				vm.minDateEnded = new Date('1-1-' + vm.input.year_start);
				vm.maxDateEnded = new Date('12-31-' + vm.input.year_ended);
	
				vm.input.date_ended = undefined//$scope.minDateEnded;
			} else {
				vm.invalidYear = true;
			}
		})
	
		vm.pickStart = function() {
			var data = {
				id: null,
				date: $filter('date')(vm.input.date_start, 'yyyy-MM-dd'),
			}
			
			SemesterService.intersect(data).then(function (data) {
				if (data.length > 0) {
					var semester = data[0];
					switch (semester.type) {
						case '1': semester.type = "Ganjil"; break;
						case '2': semester.type = "Genap"; break;
						case '3': semester.type = "Pendek"; break;
					}
					vm.rangeIntersectStart.status = true;
					vm.rangeIntersectStart.semester = 'Semester ' + semester.type + ' ' + semester.year_start + '/' + semester.year_ended;
				} else {
					(vm.input.date_start > vm.input.date_ended) ? vm.input.date_ended = undefined : null;
					vm.minDateEnded = vm.input.date_start;
					vm.rangeIntersectStart.status = false;
				}
				
			})
		}
	
		vm.pickEnded = function(){
			var data = {
				id: null,
				date: $filter('date')(vm.input.date_ended, 'yyyy-MM-dd'),
			}
			
			SemesterService.intersect(data).then(function (data) {
				if (data.length > 0) {
					var semester = data[0];
					switch (semester.type) {
						case '1': semester.type = "Ganjil"; break;
						case '2': semester.type = "Genap"; break;
						case '3': semester.type = "Pendek"; break;
					}
					vm.rangeIntersectEnded.status = true;
					vm.rangeIntersectEnded.semester = 'Semester ' + semester.type + ' ' + semester.year_start + '/' + semester.year_ended;
				} else {
					(vm.input.date_ended < vm.input.date_start) ? vm.input.date_start = undefined : null;
					vm.maxDateStart = vm.input.date_ended;
					vm.rangeIntersectEnded.status = false;
				}
				
			})
		}
	
		$scope.$watchGroup(['vm.input.date_start', 'vm.input.date_ended'], function(){
			var data = {
				id: null,
				date_start: $filter('date')(vm.input.date_start, 'yyyy-MM-dd'),
				date_ended: $filter('date')(vm.input.date_ended, 'yyyy-MM-dd'),
			}
			
			SemesterService.included(data).then(function(data) {
				if (data.length > 0) {
					var semester = data[0]
					switch (semester.type) {
						case '1': semester.type = "Ganjil"; break;
						case '2': semester.type = "Genap"; break;
						case '3': semester.type = "Pendek"; break;
					}
					vm.include.status = true;
					vm.include.semester = 'Semester ' + semester.type + ' ' + semester.year_start + '/' + semester.year_ended;
				} else {
					vm.include = {status: false, semester: undefined}
				}
			})
		})
	
		vm.submit = function () {
			$scope.SemesterForm.year_start.$setDirty();
			$scope.SemesterForm.year_ended.$setDirty();
			$scope.SemesterForm.type.$setDirty();
			$scope.SemesterForm.date_start.$setDirty();
			$scope.SemesterForm.date_ended.$setDirty();
			
			($scope.SemesterForm.$valid && vm.input.type && !vm.include.status && !vm.rangeIntersectStart.status && 
			!vm.rangeIntersectEnded.status) ? SemesterService.store(vm.input).then(function(data) {
				$state.go('main.admin.semester', null, { reload: true });
			}) : vm.validated = true;
		}
	
		vm.today = function() {
			vm.input.start = new Date();
		}
	
		vm.toggleMin = function() {
			vm.minDate = vm.minDate ? null : new Date();
		};
	
		vm.openStart = function($event) {
			vm.status.openedStart = true;
		};
	
		vm.openEnded = function($event) {
			vm.status.openedEnded = true;
		};
	
		vm.dateOptions = {
			formatYear: 'yy',
			startingDay: 1
		};
	
		vm.statusStart = {
			openedStart: false
		};
	
		vm.statusEnded = {
			openedEnded: false
		};
	
		return vm;
	}
	
	function UpdateSemesterController($log, $scope, $state, $timeout, $filter, semester, SemesterService) {
		var vm = this;
		
		vm.input = semester
		vm.validated = false;
		vm.invalidYear = true;
		vm.status = {};
	
		vm.minDateStart = undefined;
		vm.maxDateStart = undefined;
	
		vm.minDateEnded = undefined;
		vm.maxDateEnded = undefined;
	
		vm.rangeIntersectStart = {status: false, semester: undefined};
		vm.rangeIntersectEnded = {status: false, semester: undefined};
	
		vm.include = {status: false, semester: undefined}
		
		vm.updatePristine = true;
	
		vm.input.year_start = Number(vm.input.year_start);
		vm.input.year_ended = Number(vm.input.year_ended);
		vm.input.date_start = new Date(vm.input.date_start);
		vm.input.date_ended = new Date(vm.input.date_ended);
	
		vm.input = vm.input;
	
		vm.input.date_start = new Date(vm.input.date_start);
		vm.input.date_ended = new Date(vm.input.date_ended);
	
		vm.minDateStart = new Date('1-1-' + vm.input.year_start);
		vm.maxDateStart = new Date('12-31-' + vm.input.year_ended);
	
		vm.minDateEnded = new Date(vm.input.date_start);
		vm.maxDateEnded = new Date('12-31-' + vm.input.year_ended);
	
		vm.updatePristine = true
		vm.invalidYear = false;
		/*
		$scope.SemesterForm.year_start.$setDirty();
		$scope.SemesterForm.year_ended.$setDirty();
		$scope.SemesterForm.type.$setDirty();
		$scope.SemesterForm.date_start.$setDirty();
		$scope.SemesterForm.date_ended.$setDirty();
		*/
		
		
				
		
	
		$scope.$watchGroup(['vm.input.year_start', 'vm.input.year_ended'], function () {
			$log.debug('watch group year triggered');
			if (vm.input.year_ended == vm.input.year_start + 1 && vm.updatePristine == true) {
				vm.invalidYear = false;
	
				//$scope.updatePristine = !$scope.updatePristine
			} 
	
			if (vm.input.year_ended == vm.input.year_start + 1 && vm.updatePristine == false) {
				vm.invalidYear = false;
	
				vm.minDateStart = new Date('1-1-' + vm.input.year_start);
				vm.maxDateStart = new Date('12-31-' + vm.input.year_ended);
	
				vm.input.date_start = undefined//$scope.minDateStart;
	
				vm.minDateEnded = new Date('1-1-' + vm.input.year_start);
				vm.maxDateEnded = new Date('12-31-' + vm.input.year_ended);
	
				vm.input.date_ended = undefined//$scope.minDateEnded;
	
			}
	
			if (vm.input.year_ended !== vm.input.year_start + 1) {
				vm.invalidYear = true;
				vm.updatePristine = false
			} 
		})
	
		vm.pickStart = function() {
			$log.debug('pick start triggered');
			var data = {
				id: vm.input.id,
				date: $filter('date')(vm.input.date_start, 'yyyy-MM-dd'),
			}
			
			SemesterService.intersect(data).then(function(data){
				if (data.length > 0) {
					var semester = data[0];
					switch (semester.type) {
						case '1': semester.type = "Ganjil"; break;
						case '2': semester.type = "Genap"; break;
						case '3': semester.type = "Pendek"; break;
					}
					vm.rangeIntersectStart.status = true;
					vm.rangeIntersectStart.semester = 'Semester ' + semester.type + ' ' + semester.year_start + '/' + semester.year_ended;
				} else {
					if (vm.input.date_start > vm.input.date_ended) {
						vm.input.date_ended = undefined;
					} 
					vm.minDateEnded = vm.input.date_start
					vm.rangeIntersectStart.status = false;
	
				}
				
			})
			
		}
	
		vm.pickEnded = function() {
			$log.debug('pick ended triggered');
			var data = {
				id: vm.input.id,
				date: $filter('date')(vm.input.date_ended, 'yyyy-MM-dd'),
			}
			
			SemesterService.intersect(data).then(function(data){
				if (data.length > 0) {
					var semester = data[0];
					switch (semester.type) {
						case '1': semester.type = "Ganjil"; break;
						case '2': semester.type = "Genap"; break;
						case '3': semester.type = "Pendek"; break;
					}
					vm.rangeIntersectEnded.status = true;
					vm.rangeIntersectEnded.semester = 'Semester ' + semester.type + ' ' + semester.year_start + '/' + semester.year_ended;
				} else {
					if(vm.input.date_ended < vm.input.date_start) {
						vm.input.date_start = undefined;
					}
					vm.maxDateStart = vm.input.date_ended
					vm.rangeIntersectEnded.status = false;
				}
			})
		}
	
		$scope.$watchGroup(['vm.input.date_start', 'vm.input.date_ended'], function() {
			$log.debug('watch group date triggered');
			var data = {
				id: vm.input.id,
				date_start: $filter('date')(vm.input.date_start, 'yyyy-MM-dd'),
				date_ended: $filter('date')(vm.input.date_ended, 'yyyy-MM-dd'),
			}
			
			SemesterService.included(data).then(function(data) {
				if (data.length > 0) {
					var semester = data[0];
					switch (semester.type){
						case '1': semester.type = "Ganjil"; break;
						case '2': semester.type = "Genap"; break;
						case '3': semester.type = "Pendek"; break;
					}
					vm.include.status = true;
					vm.include.semester = 'Semester ' + semester.type + ' ' + semester.year_start + '/' + semester.year_ended;
				} else {
					vm.include = {status: false, semester: undefined}
				}
			})
		})
	
		vm.submit = function () {
			$scope.SemesterForm.year_start.$setDirty();
			$scope.SemesterForm.year_ended.$setDirty();
			$scope.SemesterForm.type.$setDirty();
			$scope.SemesterForm.date_start.$setDirty();
			$scope.SemesterForm.date_ended.$setDirty();
			
			($scope.SemesterForm.$valid && vm.input.type && !vm.include.status && !vm.rangeIntersectStart.status && 
				!vm.rangeIntersectEnded.status)
			? SemesterService.update(vm.input).then(function (response) {
				$state.go('main.admin.semester', null, {reload: true})
			}) 
			: vm.validated = true;
		}
	
		vm.pickStart();
		vm.pickEnded();
	
		vm.toggleMin = function() {
			vm.minDate = vm.minDate ? null : new Date();
		};
	
		vm.openStart = function($event) {
			vm.status.openedStart = true;
		};
	
		vm.openEnded = function($event) {
			vm.status.openedEnded = true;
		};
	
		vm.dateOptions = {
			formatYear: 'yy',
			startingDay: 1
		};
	
		vm.statusStart = {
			openedStart: false
		};
	
		vm.statusEnded = {
			openedEnded: false
		};
	
		return vm;
	}


})();



