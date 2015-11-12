(function () {
	'use strict'
	angular
		.module('spmiFrontEnd')
		.factory('StandardService', ['$http', '$q', '$cacheFactory', 'API_HOST', StandardService])

	function StandardService ($http, $q, $cacheFactory, API_HOST) {
		
		function StandardService(){
			var self = this
			var $httpDefaultCache = $cacheFactory.get('$http');
			
			self.get = function() {
				var deferred = $q.defer()
				$http.get(API_HOST + '/standard')
					.then(function(response){
						deferred.resolve(response.data)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise;  
			}
			
			self.getAll = function() {
				var deferred = $q.defer()
				$http.get(API_HOST + '/standard/all')
					.then(function(response){
						deferred.resolve(response.data)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise;  
			}
			
			self.show = function(request) {
				var deferred = $q.defer()
				$http.get(API_HOST + '/standard/' + request)
					.then(function(response){
						deferred.resolve(response.data)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise;  
			}
			
			self.store = function(request) {
				var deferred = $q.defer()
				$http.post(API_HOST + '/standard', request)
					.then(function(response){
						$httpDefaultCache.removeAll()
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise;  
			}
			
			self.update = function(request) {
				var deferred = $q.defer()
				$http.patch(API_HOST + '/standard/' + request.id, request)
					.then(function(response){
						$httpDefaultCache.removeAll()
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise;  
			}
			
			self.destroy = function(request) {
				var deferred = $q.defer()
				$http.delete(API_HOST + '/standard/' + request)
					.then(function(response){
						$httpDefaultCache.removeAll()
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise;  
			}
			
			self.validating = function(request) {
				var deferred = $q.defer()
				$http.get(API_HOST + '/standard/validating/' + request.description + '/' + request.id)
					.then(function(response){
						deferred.resolve(response.data)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise;  
			}
		}
		
		return new StandardService()
	}
})();