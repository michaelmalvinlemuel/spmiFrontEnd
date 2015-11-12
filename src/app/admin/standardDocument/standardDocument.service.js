(function() {
	'use strict'
	angular.module('spmiFrontEnd')
		.factory('StandardDocumentService', ['$http', '$q', '$cacheFactory', 'Upload', 'API_HOST', StandardDocumentService])

	function StandardDocumentService ($http, $q, $cacheFactory, Upload, API_HOST) {
		
		function StandardDocumentService(){
			
			var self = this
			var $httpDefaultCache = $cacheFactory.get('$http');
			
			self.get = function () {
				var deferred = $q.defer()
				$http.get(API_HOST + '/standardDocument')
					.then(function(response){
						deferred.resolve(response.data)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise;
			}
			
			self.show = function(request) {
				var deferred = $q.defer()
				$http.get(API_HOST + '/standardDocument/' + request)
					.then(function(response){
						deferred.resolve(response.data)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise;   
			}
			
			self.store = function(request){
				var deferred = $q.defer();
				Upload.upload({
					url: API_HOST + '/standardDocument', 
					data: request,
				}).then(function(response){
					$httpDefaultCache.removeAll();
					deferred.resolve(response);
				}, function(response){
					deferred.reject(response);
				});
				return deferred.promise;   
			}
			
			self.update = function(request){
				var deferred = $q.defer()
				console.log(request);
				Upload.upload({
					url: API_HOST + '/standardDocument/' + request.id, 
					data: request,
					transformRequest: function(request){
						request._method = 'PUT';
						return request;
					},
				})
				.then(function(response){
					$httpDefaultCache.removeAll()
					deferred.resolve(response)
				}, function(response){
					deferred.reject(response)
				});
				return deferred.promise;   
			}
			
			self.destroy = function (request) {
				var deferred = $q.defer()
				$http.delete(API_HOST + '/standardDocument/' + request)
					.then(function(response){
						$httpDefaultCache.removeAll()
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise;   
			}
			
			self.standard = function (request) {
				var deferred = $q.defer()
				$http.get(API_HOST + '/standardDocument/standard/' + request)
					.then(function(response){
						deferred.resolve(response.data)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise;   
			}
			
			self.validatingNo = function(request) {
				var deferred = $q.defer()
				$http.get(API_HOST + '/standardDocument/validating/no/' + request.no + '/' + request.id)
					.then(function(response){
						deferred.resolve(response.data)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise;   
			}
			
			self.validatingDescription = function(request) {
				var deferred = $q.defer()
				$http.get(API_HOST + '/standardDocument/validating/description/' + request.description + '/' + request.id)
					.then(function(response){
						deferred.resolve(response.data)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise;   
			}
		}
		
		return new StandardDocumentService()
	}
})();