(function () {
	'use strict'
	angular
		.module('spmiFrontEnd')
		.factory('InstructionService', ['$http', '$q', '$cacheFactory', 'Upload', 'API_HOST', InstructionService])

	function InstructionService ($http, $q, $cacheFactory, Upload, API_HOST) {
		
		function InstructionService(){
			
			var self = this
			var $httpDefaultCache = $cacheFactory.get('$http');
			
			self.get = function () {
				var deferred = $q.defer()
				$http.get(API_HOST + '/instruction')
					.then(function(response){
						deferred.resolve(response.data)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise;  
			}
			
			self.show = function (request) {
				var deferred = $q.defer()
				$http.get(API_HOST + '/instruction/' + request)
					.then(function(response){
						deferred.resolve(response.data)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise;  
			}
				
			self.store = function(request){
				var deferred = $q.defer()
				Upload.upload({
					url: API_HOST + '/instruction',
					data: request,
				}).then(function(response){
					$httpDefaultCache.removeAll()
					deferred.resolve(response)
				});
				
				return deferred.promise;  
			}
				
			self.update = function(request){
				var deferred = $q.defer()
				Upload.upload({
					url: API_HOST + '/instruction/' + request.id,
					data: request,
					transformRequest: function(request){
						request._method = 'PUT';
						return request;
					},
				}).then(function(response){
					$httpDefaultCache.removeAll()
					deferred.resolve(response)
				});
				
				return deferred.promise;  
			}
			
			self.destroy = function (request) {
				var deferred = $q.defer()
				$http.delete(API_HOST + '/instruction/' + request)
					.then(function(response){
						$httpDefaultCache.removeAll()
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise;  
			}
			
			self.guide = function(request) {
				var deferred = $q.defer()
				$http.get(API_HOST + '/instruction/guide/' + request)
					.then(function(response){
						deferred.resolve(response.data)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise;  
			}
			
			self.validatingNo = function(request) {
				var deferred = $q.defer()
				$http.get(API_HOST + '/instruction/validating/no/' + request.no + '/' + request.id)
					.then(function(response){
						deferred.resolve(response.data)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise;  
			}
			
			self.validatingDescription = function(request) {
				var deferred = $q.defer()
				$http.get(API_HOST + '/instruction/validating/description/' + request.description + '/' + request.id)
					.then(function(response){
						deferred.resolve(response.data)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise;  
			}
		}
		
		return new InstructionService()
	}
})();