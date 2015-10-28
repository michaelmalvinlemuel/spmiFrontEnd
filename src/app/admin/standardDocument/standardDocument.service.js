(function() {

	angular.module('spmiFrontEnd')
		.factory('StandardDocumentService', ['$http', '$q', '$cacheFactory', 'Upload', StandardDocumentService])

	function StandardDocumentService ($http, $q, $cacheFactory, Upload) {
		
		function StandardDocumentService(){
			
			var self = this
			var $httpDefaultCache = $cacheFactory.get('$http');
			
			self.get = function () {
				var deferred = $q.defer()
				$http.get('/standarddocuments')
					.then(function(response){
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise;
			}
			
			self.show = function (request) {
				var deferred = $q.defer()
				$http.get('/standarddocuments/' + request)
					.then(function(response){
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise;   
			}
			
			self.store = function (request, file) {
				var deferred = $q.defer()
				Upload.upload({
					url: '/standarddocument/store',
					method: 'POST',
					fields: request,
					file: file,
					fileFormDataName: 'document'
				})
				.then(function(response){
					$httpDefaultCache.removeAll()
					deferred.resolve(response)
				}, function(response){
					deferred.reject(response)
				});
				return deferred.promise;   
			}
			
			self.update = function (request, file) {
				var deferred = $q.defer()
				Upload.upload({
					url: '/standarddocument/update',
					method: 'POST',
					fields: request,
					file: file,
					fileFormDataName: 'document'
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
				$http.post('/standarddocument/destroy', request)
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
				$http.get('/standarddocument/standard/' + request)
					.then(function(response){
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise;   
			}
			
			self.validatingNo = function(request) {
				var deferred = $q.defer()
				$http.get('/standarddocument/validating/no/' + request.no + '/' + request.id)
					.then(function(response){
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise;   
			}
			
			self.validatingDescription = function(request) {
				var deferred = $q.defer()
				$http.get('/standarddocument/validating/description/' + request.description + '/' + request.id)
					.then(function(response){
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise;   
			}
		}
		
		return new StandardDocumentService()
	}
})()