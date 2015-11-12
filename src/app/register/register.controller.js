(function() {
	'use strict'
	angular
		.module('spmiFrontEnd')
		.controller('RegisterController', ['$rootScope', '$scope', '$state', '$timeout', '$modal', 'UserService', RegisterController])
		
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
						.then(function (response) {
							if (response.data.length > 0) {
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
						.then(function (response) {
							console.log(response.data);
							if (response.data.length > 0) {
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
			console.log('1')
			$scope.month = undefined;
			$scope.day = undefined;
			$scope.months = generateMonth()
			$scope.input.born = undefined
		}
	
		$scope.selectMonth = function () {
			console.log('2')
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
				UserService
					.register($scope.input)
					.then(function () {
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