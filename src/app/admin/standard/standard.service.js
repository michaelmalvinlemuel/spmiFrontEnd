(function () {

	angular
		.module('spmiFrontEnd')
		.factory('StandardService', ['$http', '$q', '$cacheFactory', StandardService])

	function StandardService ($http, $q, $cacheFactory) {
		
		function StandardService(){
			var self = this
			var $httpDefaultCache = $cacheFactory.get('$http');
			
			self.get = function() {
				var deferred = $q.defer()
				$http.get('/standards')
					.then(function(response){
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise;  
			}
			
			self.getAll = function() {
				var deferred = $q.defer()
				$http.get('/standardsAll')
					.then(function(response){
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise;  
			}
			
			self.show = function(request) {
				var deferred = $q.defer()
				$http.get('/standards/' + request)
					.then(function(response){
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise;  
			}
			
			self.store = function(request) {
				var deferred = $q.defer()
				$http.post('/standard/store', request)
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
				$http.post('/standard/update', request)
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
				$http.post('/standard/destroy', request)
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
				$http.get('/standard/validating/' + request.description + '/' + request.id)
					.then(function(response){
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise;  
			}
		}
		
		return new StandardService()
	}
})();