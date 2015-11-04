(function () {

	angular
		.module('spmiFrontEnd')
		.factory('SemesterService', ['$http', '$q', '$cacheFactory', 'API_HOST', SemesterService])


	function SemesterService ($http, $q, $cacheFactory, API_HOST) {
		
		function SemesterService(){
			
			var self = this
			var $httpDefaultCache = $cacheFactory.get('$http');
			
			self.get = function () {
				var deferred = $q.defer()
				$http.get(API_HOST + '/semester')
					.then(function(response){
						deferred.resolve(response.data)
					}, function(response){
						deferred.reject(response.data)
					});
				return deferred.promise; 
			}
			
			self.show = function (request) {
				var deferred = $q.defer()
				$http.get(API_HOST + '/semester/' + request)
					.then(function(response){
						deferred.resolve(response.data)
					}, function(response){
						deferred.reject(response.data)
					});
				return deferred.promise; 
			}
			
			self.store = function (request) {
				var deferred = $q.defer()
				$http.post(API_HOST + '/semester', request)
					.then(function(response){
						$httpDefaultCache.removeAll()
						deferred.resolve(response.data)
					}, function(response){
						deferred.reject(response.data)
					});
				return deferred.promise; 
			}
			
			self.update = function (request) {
				var deferred = $q.defer()
				$http.patch(API_HOST + '/semester/' + request.id, request)
					.then(function(response){
						$httpDefaultCache.removeAll()
						deferred.resolve(response.data)
					}, function(response){
						deferred.reject(response.data)
					});
				return deferred.promise; 
			}
			
			self.destroy = function (request) {
				var deferred = $q.defer()
				$http.delete(API_HOST + '/semester/' + request)
					.then(function(response){
						$httpDefaultCache.removeAll()
						deferred.resolve(response.data)
					}, function(response){
						deferred.reject(response.data)
					});
				return deferred.promise; 
			}
			
			self.intersect = function(request) {
				var deferred = $q.defer()
				$http.get(API_HOST + '/semester/intersect/' + request.date + '/' + request.id)
					.then(function(response){
						deferred.resolve(response.data)
					}, function(response){
						deferred.reject(response.data)
					});
				return deferred.promise; 
			}
			
			self.included = function (request) {
				var deferred = $q.defer()
				$http.get(API_HOST + '/semester/included/' + request.date_start + '/' + request.date_ended + '/' + request.id)
					.then(function(response){
						deferred.resolve(response.data)
					}, function(response){
						deferred.reject(response.data)
					});
				return deferred.promise; 
			}
		}
		
		return new SemesterService()
	}
})();