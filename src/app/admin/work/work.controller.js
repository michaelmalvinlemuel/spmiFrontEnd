(function () {

	angular
		.module('spmiFrontEnd')
		.controller('WorkController', WorkController)
		.controller('CreateWorkController', CreateWorkController)
		.controller('UpdateWorkController', UpdateWorkController)
		.filter('periode', [PeriodFilter])
		
	Date.prototype.addHours = function(h) {
    	this.setHours(this.getHours()+h);
    	return this;
	}
	
	function PeriodFilter(){
	
		return function(type) {
			switch (type) {
				case "1":
					return "Harian"
				break;

				case "2":
					return "Mingguan"
				break;

				case "3":
					return "Bulanan"
				break;

				case "4":
					return "Semesteran"
				break;

				case "5":
					return "Tahunan"
				break;
			}
		}
		
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
	
	function generateDay (month) {
		var tanggal = []
		if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
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
	
	
	
	function WorkController ($state, works, WorkService) {
		var vm = this;
		vm.works = works;
	
	
		vm.update = function (id) {
			$state.go('main.admin.work.update', {workId: id})
		}
	
		vm.destroy = function (id, index) {
			var alert = confirm("Apakah Anda yakin ingin menghapus Tugas ini?");
			(alert == true) ? WorkService.destroy(id).then(function(){
				vm.works.splice(index, 1);
			}) : null;
		}
	
		vm.eventToggle = function(request, index){
			WorkService.eventToggle(request).then(function(){
				console.log(vm.works[index].schedule_status);
				(vm.works[index].schedule_status == 'ENABLED') 
				? vm.works[index].schedule_status = 'DISABLED' 
				: vm.works[index].schedule_status = 'ENABLED';
				console.log(vm.works[index].schedule_status);
			})
		}
	
		vm.execute = function(id, index){
			WorkService.execute(id).then(function(data){
				vm.works[index] = data
			})
		}
	
		vm.startAllEvent = function(){
			WorkService.startAllEvent().then(function(){
				for(var i = 0 ; i < vm.works.length ; i++)
				vm.works[i].schedule_status = 'ENABLED';
			})
		}
	
		vm.pauseAllEvent = function(){
			WorkService.pauseAllEvent().then(function(){
				for(var i = 0 ; i < vm.works.length ; i++)
				vm.works[i].schedule_status = 'DISABLED';
			})
		}
	
		vm.executeAllWork = function(){
			WorkService.executeAllWork().then(function(){
				return WorkService.get();
			}).then(function(data){
				vm.works = data;
			})
		}
	
		return vm;
	}
	
	function CreateWorkController ($rootScope, $scope, $state, $timeout, $modal, groupJobs, WorkService) {
		var vm = this;
		var timeoutNamePromise
		vm.input = {}
		vm.input.forms = []
		vm.status = {}
		
		vm.days = {}
		vm.dirtyDay = false
		vm.dirtyWeek = false;
		vm.validated = false;
	
		vm.groupJobs = groupJobs
		vm.dates = []
	
		vm.minDateStart = new Date()
		vm.minDateEnded = vm.minDateStart
		vm.startDay = "Senin"	
		vm.input.time_start = new Date()
		vm.months = generateMonth();
		for (var i = 0 ; i < 28 ; i++) {
			vm.dates.push({key: i, value: i + 1})
		}
			
		$scope.$watch('vm.input.name', function () {
			var validName = $scope.WorkForm.name.$invalid
			var dirtyName = $scope.WorkForm.name.$dirty
			
			if (!validName && dirtyName) {
				$timeout.cancel(timeoutNamePromise)
				vm.loadingName = true;
				timeoutNamePromise = $timeout(function(){
					WorkService.validatingName(vm.input).then(function(data){
						(data.length > 0) ? vm.existName = true : vm.existName = false;
						vm.loadingName = false;
					})
				}, 1000)
			}		
		})
	
		vm.pickStart = function() {
			if (vm.input.start > vm.input.ended) {
				vm.minDateEnded = vm.input.start;
				(vm.limit) ? vm.input.ended = vm.input.start : vm.input.ended = undefined;
			}
		}
	
		vm.checkLimit = function() {
			(vm.limit) ? vm.input.ended = vm.input.start : vm.input.ended = undefined;
		}
	
		$scope.$watch('vm.input.type', function (newValue, oldValue, scope) {
			(vm.validated && newValue) ?
				$timeout(function() {
					switch (newValue) {
						case "1": $scope.dirtyDay = true; break;
						case "2": $scope.WorkForm.day_start.$setDirty(); break;
						case "3": $scope.WorkForm.date.$setDirty(); break;
						case "4": break;
						case "5":
							$scope.WorkForm.month.$setDirty();
							$scope.WorkForm.dateMonth.$setDirty();
						break;
					}
				}, 0) : null;
		})
	
		$scope.$watchCollection('vm.days', function(){
			vm.dirtyDay = true
			vm.input.days = [];
			for(property in vm.days) {
				(vm.days[property]) ? vm.input.days.push(property) : null; ; 
			}
			(vm.input.days.length > 0) ? vm.hasDays = true : vm.hasDays = false;
		})
	
		vm.selectMonth = function () {
			vm.datesMonth = generateDay(vm.input.month)
		}
	
		vm.addForm = function(){
			var modalInstance = $modal.open({
				animation: true,
				templateUrl: 'app/admin/form/views/modal.html',
				controller: 'CreateModalFormController as vm',
			})
			modalInstance.result.then(function(form){
				console.log(form);
				$rootScope.pushIfUnique(vm.input.forms, form)
			}, function(){})
		}
	
		vm.update = function (object, index) {
			var modalInstance = $modal.open({
				animation: true,
				templateUrl: 'app/admin/form/views/modal.html',
				controller: 'UpdateModalFormController as vm',
				resolve: {
					form: object,
				}
			})
	
			modalInstance.result.then(function(form) {
				($rootScope.findObject(vm.input.forms, form) == -1) 
				? vm.input.forms[index] = form
				: alert('Formulir ini sudah bagian dari pekerjaan');
			}, function(){})
		}
	
		vm.destroy = function (object, index) {
			var alert = confirm("Apakah Anda yakin ingin menghapus Formulir ini dari Pekerjaan?");
			(alert == true) ? vm.input.forms.splice(index, 1) : null;
		}
	
		vm.submit = function () {
			$scope.WorkForm.name.$setDirty();
			$scope.WorkForm.description.$setDirty();
			$scope.WorkForm.group_job_id.$setDirty();
			$scope.WorkForm.start.$setDirty();
			if (vm.limit) $scope.WorkForm.ended.$setDirty();
			$scope.WorkForm.type.$setDirty();
	
			switch (vm.input.type) {
				case "1": vm.dirtyDay = true; break;
				case "2": $scope.WorkForm.day_start.$setDirty(); break;
				case "3": $scope.WorkForm.date.$setDirty(); break;
				case "4": break;
				case "5":
					$scope.WorkForm.month.$setDirty();
					$scope.WorkForm.dateMonth.$setDirty();
				break;
			}
	
			if ($scope.WorkForm.$valid && 
					((vm.input.type == '1') && vm.hasDays) || 
					((vm.input.type == '2') && vm.input.day_start) ||
					((vm.input.type == '3') && vm.input.date) ||
					((vm.input.type == '4')) ||
					((vm.input.type == '5') && vm.input.month && vm.input.dateMonth)) 
			{
	
				var dateStart = new Date(vm.input.start)
				var timeStart = new Date(vm.input.time_start)
	
				dateStart.setHours(timeStart.getHours())
				dateStart.setMinutes(timeStart.getMinutes())
				dateStart.addHours(7)
				dateStart.setSeconds(0);
	
				vm.input.start = dateStart
	
				if (vm.input.ended) {
					var dateEnded = new Date(vm.input.ended)
					dateEnded.setHours(timeStart.getHours())
					dateEnded.setMinutes(timeStart.getMinutes())
					dateEnded.addHours(7)
					dateEnded.setSeconds(0);
	
					vm.input.ended = dateEnded
				}
	
				WorkService.store(vm.input).then(function(data) {
					$state.go('main.admin.work', null, {reload: true })
				})
	
			} else vm.validated = true;
		}
	
		vm.today = function() {
			vm.input.start = new Date();
			//$scope.input.ended = new Date();
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
	
		vm.today();
		return vm;
	}
	
	function UpdateWorkController ($rootScope, $scope, $state, $timeout, $modal, work, groupJobs, GroupJobService, WorkService, WorkFormService) {
		var vm = this;
		var timeoutNamePromise
		
		vm.input = work
		vm.status = {}
	
		vm.days = {}
		vm.dirtyDay = false
		vm.dirtyWeek = false;
		vm.validated = false;
	
		vm.groupJobs = groupJobs
		vm.dates = []
		vm.months = {}
	
		vm.months = generateMonth();
	
		for (var i = 0 ; i < 28 ; i++) {
			vm.dates.push({key: i, value: i + 1})
		}
	
			
		vm.input.start = new Date(vm.input.start)
		if (vm.input.ended) {
			vm.limit = true
			vm.input.ended = new Date(vm.input.ended)
		}
	
		//console.log(response.data.schedule.time_start)
		vm.input.time_start = new Date(vm.input.start);
		vm.datesMonth = generateDay(vm.input.month)
	
		$timeout(function() {
			switch (vm.input.type) {
				case "1":
					vm.input.days = []
					for (var i = 0 ; i <vm.input.schedule[0].days.length ; i++) {
						vm.input.days.push(vm.input.schedule[0].days[i].day);
					}
					angular.forEach(vm.input.days, function (key, value) {
						vm.days[key] = true; 
					})
				break;

				case "2": vm.input.day_start = vm.input.schedule.day_start.toString(); break;

				case "3":
					$scope.WorkForm.date.$setDirty();
					vm.input.date = vm.input.schedule.date_start
				break;

				case "4": break;

				case "5":
					$scope.WorkForm.month.$setDirty();
					$scope.WorkForm.dateMonth.$setDirty();
					vm.input.month = vm.input.schedule.month_start
					vm.datesMonth = generateDay(vm.input.month)
					vm.input.dateMonth = vm.input.schedule.date_start

				break;
			}
		}, 0)		
			
		vm.input.time_start = new Date()
		
	
		$scope.$watch('vm.input.name', function () {
			var validName = $scope.WorkForm.name.$invalid
			var dirtyName = $scope.WorkForm.name.$dirty
			
			if (!validName && dirtyName) {
				$timeout.cancel(timeoutNamePromise)
				vm.loadingName = true;
				timeoutNamePromise = $timeout(function() {
					WorkService.validatingName(vm.input).then(function(data){
						(data.length > 0) ? vm.existName = true : vm.existName = false
						vm.loadingName = false;
					})
				}, 1000)
			}		
		})
	
		vm.pickStart = function() {
			if (vm.input.start > vm.input.ended) {
				vm.minDateEnded = vm.input.start;
				(vm.limit) ? vm.input.ended = vm.input.start : vm.input.ended = undefined;
			}
		}
	
		vm.checkLimit = function() {
			(vm.limit) ? vm.input.ended = vm.input.start : vm.input.ended = undefined;
		}
	
		$scope.$watch('vm.input.type', function (newValue, oldValue, scope) {
	
			vm.input.date_start = new Date();
	
			if (vm.validated && newValue) {

				$timeout(function() {
					switch (newValue) {
						case "1": vm.dirtyDay = true; break;
						case "2": $scope.WorkForm.day_start.$setDirty(); break;
						case "3": $scope.WorkForm.date.$setDirty(); break;
						case "4": break;
						case "5":
							$scope.WorkForm.month.$setDirty();
							$scope.WorkForm.dateMonth.$setDirty();
						break;
					}
				}, 0)
			}
		})
	
		$scope.$watchCollection('vm.days', function () {
			vm.dirtyDay = true
			vm.input.days = [];
			angular.forEach(vm.days, function (key, value) {
				if (key) vm.input.days.push(value);
			})
	
			if (vm.input.days.length > 0) vm.hasDays = true;
			else vm.hasDays = false;
		})
	
		vm.selectMonth = function () {
			vm.datesMonth = generateDay(vm.input.month)
		}
	
		vm.addForm = function () {
			var modalInstance = $modal.open({
				animation: true,
				templateUrl: 'app/admin/form/views/modal.html',
				controller: 'CreateModalFormController as vm',
			})
	
			modalInstance.result.then(function(form){
				var data = {
					work_id: vm.input.id, 
					id: form.id,
				}
				
				WorkFormService.store(data).then(function(data){
					vm.input.forms.push(data);
				}, function(data) {
					alert(data.body);
				})
				
			}, function(){})
		}
	
		vm.update = function(object, index){
			var modalInstance = $modal.open({
				animation: true,
				templateUrl: 'app/admin/form/views/modal.html',
				controller: 'UpdateModalFormController as vm',
				resolve: {
					form: function () {
						delete object.pivot;
						return object;
					}
				}
			})
	
			modalInstance.result.then(function(form){
				var data = {
					work_id: vm.input.id, 
					form_id: object.id,
					id: form.id, 
				}
				
				WorkFormService.update(data).then(function(data){
					vm.input.forms[index] = data;
				}, function() {
					alert('Pekerjaan ini sudah memilki formulir yang dimaksud');
				})
				
				
			}, function () {
				//$log.info('Modal dismissed at: ' + new Date());
			})
		}
	
		vm.destroy = function(object, index){
			var data = {
				work_id: vm.input.id,
				form_id: object.id,
			}
			
			var alert = confirm("Apakah Anda yakin ingin menghapus Formulir ini dari Pekerjaan?")
			if (alert == true) 
			WorkFormService.destroy(data).then(function() {
				vm.input.forms.splice(index, 1);
			})
		}
	
		vm.submit = function () {
			$scope.WorkForm.name.$setDirty();
			$scope.WorkForm.description.$setDirty();
			$scope.WorkForm.group_job_id.$setDirty();
			$scope.WorkForm.start.$setDirty();
			if (vm.limit) $scope.WorkForm.ended.$setDirty();
			$scope.WorkForm.type.$setDirty();
	
			//$scope.WorkForm.date.$setDirty();
	
			switch (vm.input.type) {
				case "1": vm.dirtyDay = true; break;
	
				case "2": $scope.WorkForm.day_start.$setDirty(); break;
	
				case "3": $scope.WorkForm.date.$setDirty(); break;
	
				case "4": break;
	
				case "5":
					$scope.WorkForm.month.$setDirty();
					$scope.WorkForm.dateMonth.$setDirty();
				break;
			}
	
			if ($scope.WorkForm.$valid && 
					((vm.input.type == '1') && vm.hasDays) || 
					((vm.input.type == '2') && vm.input.day_start) ||
					((vm.input.type == '3') && vm.input.date) ||
					((vm.input.type == '4')) ||
					((vm.input.type == '5') && vm.input.month && vm.input.dateMonth)) 
			{
	
				var dateStart = new Date(vm.input.start)
				var timeStart = new Date(vm.input.time_start)
	
				dateStart.setHours(timeStart.getHours())
				dateStart.setMinutes(timeStart.getMinutes())
				dateStart.addHours(7)
				dateStart.setSeconds(0);
	
				vm.input.start = dateStart
	
				if (vm.input.ended) {
					var dateEnded = new Date(vm.input.ended)
					dateEnded.setHours(timeStart.getHours())
					dateEnded.setMinutes(timeStart.getMinutes())
					dateEnded.addHours(7)
					dateEnded.setSeconds(0);
	
					vm.input.ended = dateEnded
				}
	
				WorkService.update(vm.input).then(function(){
					$state.go('main.admin.work', null, { reload: true });
				})
	
			} else {
				vm.validated = true;
			}
		}
	
		vm.today = function() {
			vm.input.start = new Date();
			//$scope.input.ended = new Date();
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
})();




