(function () {

	angular
		.module('spmiFrontEnd')
		.factory('InstructionService', ['$http', '$q', '$cacheFactory', 'Upload', InstructionService])

	function InstructionService ($http, $q, $cacheFactory, Upload) {
		
		function InstructionService(){
			
			var self = this
			$httpDefaultCache = $cacheFactory.get('$http');
			
			self.get = function () {
				var deferred = $q.defer()
				$http.get('/instructions')
					.then(function(response){
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise;  
			}
			
			self.show = function (request) {
				var deferred = $q.defer()
				$http.get('/instructions/' + request)
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
					url: '/instruction/store',
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
					url: '/instruction/update',
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
				$http.post('/instruction/destroy', request)
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
				$http.get('/instruction/guide/' + request)
					.then(function(response){
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise;  
			}
			
			self.validatingNo = function(request) {
				var deferred = $q.defer()
				$http.get('/instruction/validating/no/' + request.no + '/' + request.id)
					.then(function(response){
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise;  
			}
			
			self.validatingDescription = function(request) {
				var deferred = $q.defer()
				$http.get('/instruction/validating/description/' + request.description + '/' + request.id)
					.then(function(response){
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise;  
			}
		}
		
		return new InstructionService()
	}
})()