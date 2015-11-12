(function() {
	'use strict'
	angular
		.module('spmiFrontEnd')
		.factory('FormService', ['$http', '$q', '$cacheFactory', 'Upload', 'API_HOST', FormService])
	
	function FormService ($http, $q, $cacheFactory, Upload, API_HOST) {
		function FormService() {
			var self = this
			var $httpDefaultCache = $cacheFactory.get('$http');
			
			self.get = function () {
				var deferred = $q.defer()
				$http.get(API_HOST + '/form')
					.then(function(response){
						deferred.resolve(response.data)
					}, function(response){
						deferred.reject(response)
					})
				return deferred.promise
			}
			
			self.show = function (request) {
				var deferred = $q.defer()
				$http.get(API_HOST + '/form/' + request)
					.then(function(response){
						deferred.resolve(response.data)
					}, function(response){
						deferred.reject(response)
					})
				return deferred.promise 
			}
				
			self.store = function (request) {
				//console.log(request);
				var deferred = $q.defer()
				
				Upload.upload({
					url: API_HOST + '/form',
					data: request,
				}).then(function(response){
					$httpDefaultCache.removeAll()
					deferred.resolve(response)
				}, function(response){
					deferred.reject(response)
				})
				return deferred.promise
			}
				
			self.update = function (request) {
				var deferred = $q.defer()
				Upload.upload({
					url: API_HOST + '/form/' + request.id,
					data: request,
					transformRequest: function(request){
						request._method = 'PUT';
						return request;
					},
				}).then(function(response){
					$httpDefaultCache.removeAll()
					deferred.resolve(response)
				}, function(response){
					deferred.reject(response)
				})
				return deferred.promise
			}
				
			self.destroy = function (request) {
				var deferred = $q.defer()
				$http.delete(API_HOST + '/form/' + request)
					.then(function(response){
						$httpDefaultCache.removeAll()
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					})
				return deferred.promise 
			}
				
			self.instruction = function(request) {
				var deferred = $q.defer()
				$http.get(API_HOST + '/form/instruction/' + request)
					.then(function(response){
						deferred.resolve(response.data)
					}, function(response){
						deferred.reject(response)
					})
				return deferred.promise 
			}
				
			self.validatingNo = function(request) {
				var deferred = $q.defer()
				$http.get(API_HOST + '/form/validating/no/' + request.no + '/' + request.id)
					.then(function(response){
						deferred.resolve(response.data)
					}, function(response){
						deferred.reject(response)
					})
				return deferred.promise 
			}
				
			self.validatingDescription = function(request) {
				var deferred = $q.defer()
				$http.get(API_HOST + '/form/validating/description/' + request.no + '/' + request.id)
					.then(function(response){
						deferred.resolve(response.data)
					}, function(response){
						deferred.reject(response)
					})
				return deferred.promise
			}
		}
		
		return new FormService()
	}
})();