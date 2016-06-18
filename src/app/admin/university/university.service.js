(function (angular) {
	'use strict'
	angular.module('spmiFrontEnd')
		.factory('UniversityService', UniversityService)

	function UniversityService ($rootScope, $log, $http, $q, $state, $cacheFactory, ngProgressFactory, API_HOST) {
	
			var university = {}
			var $httpDefaultCache = $cacheFactory.get('$http');
	
			university.get = function () {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.get(API_HOST + '/university')
					.then(function(response) {
						progress.complete();
						deferred.resolve(response.data)
					}, function(data) {
						progress.complete();
						deferred.reject($rootScope.errorHandler(data));
					})
				return deferred.promise;
			}
		
			university.show = function (request) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.get(API_HOST + '/university/' + request)
					.then(function(response) {
						progress.complete();
						deferred.resolve(response.data)
					}, function(data) {
						progress.complete();
						deferred.reject($rootScope.errorHandler(data));
					})
				return deferred.promise
			}
		
			university.store = function(request) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.post(API_HOST + '/university', request)
					.then(function(response) {
						progress.complete();
						$httpDefaultCache.removeAll();
						deferred.resolve(response)
					}, function(data) {
						progress.complete();
						deferred.reject($rootScope.errorHandler(data));
					})
				return deferred.promise
			}
		
			university.update = function (request) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.put(API_HOST + '/university/' + request.id, request)
					.then(function(response){
						progress.complete();
						$httpDefaultCache.removeAll();
						deferred.resolve(response)
					}, function(data) {
						progress.complete();
						deferred.reject($rootScope.errorHandler(data));
					})
				return deferred.promise
			}
		
			university.destroy = function (request) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.delete(API_HOST + '/university/' + request)
					.then(function(response) {
						progress.complete();
						$httpDefaultCache.removeAll();
						deferred.resolve(response.data)
					}, function(data) {
						progress.complete();
						deferred.reject($rootScope.errorHandler(data));
					})
				return deferred.promise
			}
		
			university.validating = function (request) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.post(API_HOST + '/university/validating', request)
					.then(function(response) {
						progress.complete();
						deferred.resolve(response.data)
					}, function(data) {
						progress.complete();
						deferred.reject($rootScope.errorHandler(data));
					})
				return deferred.promise
			}
		
		
		return university;
	}
})(angular);
