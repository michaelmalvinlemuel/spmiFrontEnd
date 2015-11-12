(function () {
	'use strict'
	angular
		.module('spmiFrontEnd')
		.factory('GroupJobService', GroupJobService)
		.factory('GroupJobDetailService', GroupJobDetailService)

	function GroupJobService ($http, $q, $cacheFactory, API_HOST) {

		function GroupJobService() {
			
			var self = this
			var $httpDefaultCache = $cacheFactory.get('$http');
			
			self.get = function () {
				var deferred = $q.defer()
				$http.get(API_HOST + '/groupJob')
					.then(function(response){
						deferred.resolve(response.data)
					}, function(response){
						deferred.reject(response)
					})
				return deferred.promise
			}
			
			self.show = function(request) {
				var deferred = $q.defer()
				$http.get(API_HOST + '/groupJob/' + request)
					.then(function(response){
						deferred.resolve(response.data)
					}, function(response){
						deferred.reject(response)
					})
				return deferred.promise
			}
				
			self.store = function (request) {
				var deferred = $q.defer()
				$http.post(API_HOST + '/groupJob', request)
					.then(function(response){
						$httpDefaultCache.removeAll()
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					})
				return deferred.promise
			}
				
			self.update = function (request) {
				var deferred = $q.defer()
				$http.patch(API_HOST + '/groupJob/' + request.id, request)
					.then(function(response){
						$httpDefaultCache.removeAll()
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					})
				return deferred.promise
			}
			
			self.destroy = function (request){
				var deferred = $q.defer()
				$http.delete(API_HOST + '/groupJob/' + request)
					.then(function(response){
						$httpDefaultCache.removeAll()
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					})
				return deferred.promise
			}
				
			self.validatingName = function (request){
				var deferred = $q.defer()
				$http.get(API_HOST + '/groupJob/validating/name/' + request.name + '/' + request.id)
					.then(function(response){
						deferred.resolve(response.data)
					}, function(response){
						deferred.reject(response)
					})		
				return deferred.promise
			}
		}
	
		return new GroupJobService()
	}
	
	function GroupJobDetailService ($http, $q, $cacheFactory, API_HOST) {
		
		function GroupJobDetailService(){
			var self = this;
			var $httpDefaultCache = $cacheFactory.get('$http');
	
			
			self.store = function(request) {
				var deferred = $q.defer()
				$http.post(API_HOST + '/groupJob/' + request.groupJob_id + '/job', request).then(function(response){
					$httpDefaultCache.removeAll();
					deferred.resolve(response.data);
				}, function(response){
					deferred.reject(response.data)
				})
				
				return deferred.promise
			}
			
			self.update = function (request) {
				var deferred = $q.defer()
				$http.patch(API_HOST + '/groupJob/' + request.groupJob_id + '/job/' + request.job_id, request).then(function(response){
					$httpDefaultCache.removeAll();
					deferred.resolve(response.data);
				}, function(response){
					deferred.reject(response.data)
				})
				
				return deferred.promise
			}
			
			self.destroy = function (request) {
				var deferred = $q.defer()
				$http.delete(API_HOST + '/groupJob/' + request.groupJob_id + '/job/' + request.job_id).then(function(response){
					$httpDefaultCache.removeAll();
					deferred.resolve(response.data);
				}, function(response){
					deferred.reject(response.data)
				})
				
				return deferred.promise
			}
		}
		return new GroupJobDetailService();
	}
})();