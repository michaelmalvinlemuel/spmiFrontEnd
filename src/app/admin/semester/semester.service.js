(function () {

	angular
		.module('spmiFrontEnd')
		.factory('SemesterService', ['$http', '$q', '$cacheFactory', SemesterService])


	function SemesterService ($http, $q, $cacheFactory) {
		
		function SemesterService(){
			
			var self = this
			var $httpDefaultCache = $cacheFactory.get('$http');
			
			self.get = function () {
				var deferred = $q.defer()
				$http.get('/semesters')
					.then(function(response){
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise; 
			}
			
			self.show = function (request) {
				var deferred = $q.defer()
				$http.get('/semesters/' + request)
					.then(function(response){
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise; 
			}
			
			self.store = function (request) {
				var deferred = $q.defer()
				$http.post('/semester/store', request)
					.then(function(response){
						$httpDefaultCache.removeAll()
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise; 
			}
			
			self.update = function (request) {
				var deferred = $q.defer()
				$http.post('/semester/update', request)
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
				$http.post('/semester/destroy', request)
					.then(function(response){
						$httpDefaultCache.removeAll()
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise; 
			}
			
			self.intersect = function(request) {
				var deferred = $q.defer()
				$http.get('/semester/intersect/' + request.date + '/' + request.id)
					.then(function(response){
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise; 
			}
			
			self.included = function (request) {
				var deferred = $q.defer()
				$http.get('/semester/included/' + request.date_start + '/' + request.date_ended + '/' + request.id)
					.then(function(response){
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise; 
			}
		}
		
		return new SemesterService()
	}
})();