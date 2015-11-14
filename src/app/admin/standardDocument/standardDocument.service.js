(function() {
	'use strict'
	angular.module('spmiFrontEnd')
		.factory('StandardDocumentService', StandardDocumentService)

	function StandardDocumentService ($http, $q, $cacheFactory, Upload, API_HOST, FILE_HOST) {
		
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
				request.directory = 'standardDocument';
				var deferred = $q.defer();
				Upload.upload({
					url: FILE_HOST + '/upload.php', 
					data: request,
				}).then(function(response) {
					delete request.file;
					delete request.directory;
					request.filename = response.data;
					return $http.post(API_HOST + '/standardDocument', request)
				}, function(response){
					deferred.reject(response.data);
				}).then(function(response){
					$httpDefaultCache.removeAll()
					deferred.resolve(response.data);
				}, function(response) {
					deferred.reject(response.data);
				});
				
				return deferred.promise;   
			}
			
			self.update = function(request){
				request.directory = 'standardDocument';
				var deferred = $q.defer();
				if (request.file) {
					Upload.upload({
						url: FILE_HOST + '/upload.php', 
						data: request,
					}).then(function(response) {
						delete request.file;
						delete request.directory;
						request.filename = response.data;
						return $http.patch(API_HOST + '/standardDocument/' + request.id, request);
					}, function(response) {
						deferred.reject(response.data);
					}).then(function(response){
						$httpDefaultCache.removeAll()
						deferred.resolve(response.data);
					}, function(response) {
						deferred.reject(response.data);
					});
				} else {
					$http.patch(API_HOST + '/standardDocument/' + request.id, request).then(function(response) {
						$httpDefaultCache.removeAll()
						deferred.resolve(response.data);
					}, function(response) {
						deferred.reject(response.data);
					})
				}
				
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