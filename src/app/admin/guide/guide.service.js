(function () {

	angular
		.module('spmiFrontEnd')
		.factory('GuideService', ['$http', '$q', '$cacheFactory', 'Upload', GuideService])

	function GuideService ($http, $q, $cacheFactory, Upload) {
		
		function GuideService() {
			var self = this
			var $httpDefaultCache = $cacheFactory.get('$http');
			
			self.get = function (){
				var deferred = $q.defer()
				$http.get('/guides')
					.then(function(response){
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise; 
			}
			
			self.show = function(request){
				var deferred = $q.defer();
				$http.get('/guides/' + request)
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
					url: '/guide/store',
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
					url: '/guide/update',
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
			
			self.destroy = function(request) {
				var deferred = $q.defer();
				$http.post('/guide/destroy', request)
					.then(function(response){
						$httpDefaultCache.removeAll()
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise;
			}
			
			self.standarddocument = function (request) {
				var deferred = $q.defer()
				$http.get('/guide/standarddocument/' + request)
					.then(function(response){
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise; 
			}
			
			self.validatingNo = function(request) {
				var deferred = $q.defer()
				$http.get('/guide/validating/no/' + request.no + '/' + request.id)
					.then(function(response){
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise; 
			}
			
			self.validatingDescription = function(request) {
				var deferred = $q.defer()
				$http.get('/guide/validating/description/' + request.description + '/' + request.id)
					.then(function(response){
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					})
				return deferred.promise 
			}
		}
		
		return new GuideService()
	}
})()