(function () {
	'use strict'
	angular
		.module('spmiFrontEnd')
		.factory('StandardService', StandardService)

	function StandardService ($rootScope, $http, $q, $cacheFactory, ngProgressFactory, API_HOST) {
		
		function StandardService(){
			var self = this
			var $httpDefaultCache = $cacheFactory.get('$http');
			
			self.get = function() {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.get(API_HOST + '/standard')
					.then(function(response){
						progress.complete();
						deferred.resolve(response.data)
					}, function(data) {
						progress.complete();
						deferred.reject($rootScope.errorHandler(data));
					});
				return deferred.promise;  
			}
			
			self.getAll = function() {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.get(API_HOST + '/standard/all')
					.then(function(response){
						progress.complete();
						deferred.resolve(response.data)
					}, function(data) {
						progress.complete();
						deferred.reject($rootScope.errorHandler(data));
					});
				return deferred.promise;  
			}
			
			self.show = function(request) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.get(API_HOST + '/standard/' + request)
					.then(function(response){
						progress.complete();
						deferred.resolve(response.data)
					}, function(data) {
						progress.complete();
						deferred.reject($rootScope.errorHandler(data));
					});
				return deferred.promise;  
			}
			
			self.store = function(request) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.post(API_HOST + '/standard', request)
					.then(function(response){
						progress.complete();
						$httpDefaultCache.removeAll()
						deferred.resolve(response)
					}, function(data) {
						progress.complete();
						deferred.reject($rootScope.errorHandler(data));
					});
				return deferred.promise;  
			}
			
			self.update = function(request) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.patch(API_HOST + '/standard/' + request.id, request)
					.then(function(response){
						progress.complete();
						$httpDefaultCache.removeAll()
						deferred.resolve(response)
					}, function(data) {
						progress.complete();
						deferred.reject($rootScope.errorHandler(data));
					});
				return deferred.promise;  
			}
			
			self.destroy = function(request) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.delete(API_HOST + '/standard/' + request)
					.then(function(response){
						progress.complete();
						$httpDefaultCache.removeAll()
						deferred.resolve(response)
					}, function(data) {
						progress.complete();
						deferred.reject($rootScope.errorHandler(data));
					});
				return deferred.promise;  
			}
			
			self.validating = function(request) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.get(API_HOST + '/standard/validating/' + encodeURI(request.description) + '/' + request.id)
					.then(function(response){
						progress.complete();
						deferred.resolve(response.data)
					}, function(data) {
						progress.complete();
						deferred.reject($rootScope.errorHandler(data));
					});
				return deferred.promise;  
			}
		}
		
		return new StandardService()
	}
})();