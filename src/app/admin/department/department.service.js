(function () {
	'use strict'
	angular
		.module('spmiFrontEnd')
		.factory('DepartmentService', DepartmentService)


		function DepartmentService ($rootScope, $http, $q, $cacheFactory, ngProgressFactory, API_HOST) {
			function DepartmentService() {
				var cacheUniversity = null;
				
				var self = this
				var $httpDefaultCache = $cacheFactory.get('$http');
				
				self.get = function () {
					var deferred = $q.defer();
					var progress = ngProgressFactory.createInstance();
					progress.start();
					
					$http.get(API_HOST + '/department')
						.then(function(response) {
							progress.complete();
							deferred.resolve(response.data)
						}, function(data) {
							progress.complete();
							deferred.reject($rootScope.errorHandler(data));
						})
					return deferred.promise
				}
				
				self.show = function (request) {
					var deferred = $q.defer();
					var progress = ngProgressFactory.createInstance();
					progress.start();
					$http.get(API_HOST + '/department/' + request)
						.then(function(response){
							progress.complete();
							deferred.resolve(response.data)
						}, function(data) {
							progress.complete();
							deferred.reject($rootScope.errorHandler(data));
						})
					return deferred.promise;
				}
					
				self.store = function(request) {
					var deferred = $q.defer();
					var progress = ngProgressFactory.createInstance();
					progress.start();
					$http.post(API_HOST + '/department', request)
						.then(function(response){
							progress.complete();
							$httpDefaultCache.removeAll()
							deferred.resolve(response)
						},  function(data) {
							progress.complete();
							deferred.reject($rootScope.errorHandler(data));
						})
					return deferred.promise
				}
					
				self.update = function (request) {
					var deferred = $q.defer();
					var progress = ngProgressFactory.createInstance();
					progress.start();
					$http.patch(API_HOST + '/department/' + request.id, request)
						.then(function(response){
							progress.complete();
							$httpDefaultCache.removeAll()
							deferred.resolve(response)
						}, function(data) {
							progress.complete();
							deferred.reject($rootScope.errorHandler(data));
						})
					return deferred.promise
				}
					
				self.destroy = function (request) {
					var deferred = $q.defer();
					var progress = ngProgressFactory.createInstance();
					progress.start();
					$http.delete(API_HOST + '/department/' + request)
						.then(function(response){
							progress.complete();
							$httpDefaultCache.removeAll()
							deferred.resolve(response)
						},  function(data) {
							progress.complete();
							deferred.reject($rootScope.errorHandler(data));
						})
					return deferred.promise
				}
				
				
				
				self.university = function (request) {
					var deferred = $q.defer();
					var progress = ngProgressFactory.createInstance();
					progress.start();
					$http.get(API_HOST + '/department/university/' + request)
						.then(function(response){
							progress.complete();
							deferred.resolve(response.data)
						},  function(data) {
							progress.complete();
							deferred.reject($rootScope.errorHandler(data));
						})
					return deferred.promise
						
				}
					
				self.validating = function (request) {
					var deferred = $q.defer();
					var progress = ngProgressFactory.createInstance();
					progress.start();
					$http.get(API_HOST + '/department/validating/' + encodeURI(request.name) + '/' + request.id + '/' + request.university_id)
						.then(function(response){
							progress.complete();
							deferred.resolve(response.data)
						},  function(data) {
							progress.complete();
							deferred.reject($rootScope.errorHandler(data));
						})
					return deferred.promise
				}
				
			}
			return new DepartmentService()
		}
})();