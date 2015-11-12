(function () {
	'use strict'
	angular.module('spmiFrontEnd')
		.factory('UniversityService', UniversityService)

	function UniversityService ($log, $http, $q, $state, $cacheFactory, API_HOST) {
	
			var university = {}
			var $httpDefaultCache = $cacheFactory.get('$http');
	
			university.get = function () {
				var deferred = $q.defer();
				$http.get(API_HOST + '/university')
					.then(function(response) {
						deferred.resolve(response.data)
					}, function(response) {
						deferred.reject(response)
					})
				return deferred.promise;
			}
		
			university.show = function (request) {
				var deferred = $q.defer()
				$http.get(API_HOST + '/university/' + request)
					.then(function(response) {
						deferred.resolve(response.data)
					}, function (response) {
						deferred.reject(response)
					})
				return deferred.promise
			}
		
			university.store = function(request) {
				var deferred = $q.defer()
				$http.post(API_HOST + '/university', request)
					.then(function(response) {
						$httpDefaultCache.removeAll();
						deferred.resolve(response)
					}, function(response) {
						deferred.reject(response)
					})
				return deferred.promise
			}
		
			university.update = function (request) {
				var deferred = $q.defer()
				$http.put(API_HOST + '/university/' + request.id, request)
					.then(function(response){
						$httpDefaultCache.removeAll();
						deferred.resolve(response)
					}, function(response) {
						deferred.reject(response)
					})
				return deferred.promise
			}
		
			university.destroy = function (request) {
				var deferred = $q.defer()
				$http.delete(API_HOST + '/university/' + request)
					.then(function(response) {
						$httpDefaultCache.removeAll();
						deferred.resolve(response.data)
					}, function(response) {
						deferred.reject(response)
					})
				return deferred.promise
			}
		
			university.validating = function (request) {
				var deferred = $q.defer()
				$http.get(API_HOST + '/university/validating/' + request.name + '/' + request.id)
					.then(function(response) {
						deferred.resolve(response.data)
					}, function(response) {
						deferred.reject(response)
					})
				return deferred.promise
			}
		
		
		return university;
	}
})();
