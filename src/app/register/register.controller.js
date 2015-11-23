(function() {
	'use strict'
	angular
		.module('spmiFrontEnd')
		.controller('RegisterController', RegisterController)
	
	function generateYear () {
		var today = new Date().getFullYear();

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
	
	function RegisterController($rootScope, $scope, $state, $timeout, $modal, UserService) {
		var timeoutNikPromise, timeoutEmailPromise
		$scope.input = {}
		$scope.input.userJobs = []
		$scope.years = {}
		$scope.months = {}
		$scope.days = {}
		$scope.validated = false
	
		$scope.load = function () {
			$scope.submitting = false
			$scope.years =  generateYear()
		}
	
		$scope.$watch('input.nik', function () {
			var validInput = $scope.RegistrationForm.nik.$invalid
			var dirtyInput = $scope.RegistrationForm.nik.$dirty
			
			if (!validInput && dirtyInput) {
				$timeout.cancel(timeoutNikPromise)
				$scope.loadingNik = true;
				timeoutNikPromise = $timeout(function() {
					UserService
						.validatingNik($scope.input)
						.then(function (data) {
							if (data.length > 0) {
								$scope.existNik = true
							} else {
								$scope.existNik = false
							}
							$scope.loadingNik = false;
						})
				}, 1000)
			}		
		})
	
		$scope.$watch('input.email', function () {
			var validInput = $scope.RegistrationForm.email.$invalid
			var dirtyInput = $scope.RegistrationForm.email.$dirty
			
			if (!validInput && dirtyInput) {
				$timeout.cancel(timeoutEmailPromise)
				$scope.loadingEmail = true;
				timeoutEmailPromise = $timeout(function() {
					UserService
						.validatingEmail($scope.input)
						.then(function (data) {
							
							if (data.length > 0) {
								$scope.existEmail = true
							} else {
								$scope.existEmail = false
							}
							$scope.loadingEmail = false;
						})
				}, 1000)
			}		
		})
	
		$scope.selectYear = function () {
			
			$scope.month = undefined;
			$scope.day = undefined;
			$scope.months = generateMonth()
			$scope.input.born = undefined
		}
	
		$scope.selectMonth = function () {

			$scope.day = undefined;
			$scope.days = generateDay($scope.year, $scope.month)
			$scope.input.born = undefined
		}
	
		$scope.selectDay = function () {
			$scope.input.born = new Date($scope.year.year, $scope.month - 1, $scope.day.day + 1)
		}
	
		$scope.submit = function () {
			
			$scope.RegistrationForm.nik.$setDirty();
			$scope.RegistrationForm.name.$setDirty();
			$scope.RegistrationForm.day.$setDirty();
			$scope.RegistrationForm.address.$setDirty();
			$scope.RegistrationForm.email.$setDirty();
			$scope.RegistrationForm.password.$setDirty();
			$scope.RegistrationForm.confirmation.$setDirty();
	
			if ($scope.RegistrationForm.$valid) {
				$scope.submitting = true
				UserService.register($scope.input).then(function (data) {
					$scope.submitting = false
					$state.go('register.information', {email: $scope.input.email})
					
				}, function() {
					$state.go('error')
				})
			} else {
				$scope.validated = true;
			}
			
		}
	
		$scope.load();
	}
})();