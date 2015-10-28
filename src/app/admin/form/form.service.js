(function() {
	
	angular
		.module('spmiFrontEnd')
		.factory('FormService', ['$http', '$q', '$cacheFactory', 'Upload', FormService])
	
	function FormService ($http, $q, $cacheFactory, Upload) {
		function FormService() {
			var self = this
			var $httpDefaultCache = $cacheFactory.get('$http');
			
			self.get = function () {
				var deferred = $q.defer()
				$http.get('/forms')
					.then(function(response){
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					})
				return deferred.promise
			}
			
			self.show = function (request) {
				var deferred = $q.defer()
				$http.get('/forms/' + request)
					.then(function(response){
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					})
				return deferred.promise 
			}
				
			self.store = function (request, file) {
				var deferred = $q.defer()
				
				Upload.upload({
					url: '/form/store',
					method: 'POST',
					fields: request,
					file: file,
					fileFormDataName: 'document'
				}).then(function(response){
					$httpDefaultCache.removeAll()
					deferred.resolve(response)
				}, function(response){
					deferred.reject(response)
				})
				return deferred.promise
			}
				
			self.update = function (request, file) {
				var deferred = $q.defer()
				Upload.upload({
					url: '/form/update',
					method: 'POST',
					fields: request,
					file: file,
					fileFormDataName: 'document'
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
				$http.post('/form/destroy', request)
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
				$http.get('/form/instruction/' + request)
					.then(function(response){
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					})
				return deferred.promise 
			}
				
			self.validatingNo = function(request) {
				var deferred = $q.defer()
				$http.get('/form/validating/no/' + request.no + '/' + request.id)
					.then(function(response){
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					})
				return deferred.promise 
			}
				
			self.validatingDescription = function(request) {
				var deferred = $q.defer()
				$http.get('/form/validating/description/' + request.no + '/' + request.id)
					.then(function(response){
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					})
				return deferred.promise
			}
		}
		
		return new FormService()
	}
})();