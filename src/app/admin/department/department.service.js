(function () {

	angular
		.module('spmiFrontEnd')
		.factory('DepartmentService', ['$http', '$q', '$cacheFactory', DepartmentService])


		function DepartmentService ($http, $q, $cacheFactory) {
			function DepartmentService() {
				var cacheUniversity = null;
				
				var self = this
				var $httpDefaultCache = $cacheFactory.get('$http');
				
				self.get = function () {
					var deferred = $q.defer()
					$http.get('/departments')
						.then(function(response){
							deferred.resolve(response)
						}, function(response){
							deferred.reject(response)
						})
					return deferred.promise
				}
				
				self.show = function (request) {
					var deferred = $q.defer()
					$http.get('/departments/' + request)
						.then(function(response){
							deferred.resolve(response)
						}, function(response) {
							deferred.reject(response)
						})
					return deferred.promise
				}
					
				self.store = function(request) {
					var deferred = $q.defer()
					$http.post('/department/store', request)
						.then(function(response){
							$httpDefaultCache.removeAll()
							deferred.resolve(response)
						}, function(response){
							deferred.reject(response)
						})
					return deferred.promise
				}
					
				self.update = function (request) {
					var deferred = $q.defer()
					$http.post('/department/update', request)
						.then(function(response){
							$httpDefaultCache.removeAll()
							deferred.resolve(response)
						}, function(response){
							deferred.reject(response)
						})
					return deferred.promise
				}
					
				self.destroy = function (request) {
					var deferred = $q.defer()
					$http.post('/department/destroy', request)
						.then(function(response){
							$httpDefaultCache.removeAll()
							deferred.resolve(response)
						}, function(response){
							deferred.reject(response)
						})
					return deferred.promise
				}
				
				
				
				self.university = function (request) {
					var deferred = $q.defer()
					$http.get('/department/university/' + request)
						.then(function(response){
							deferred.resolve(response, response.data)
						}, function(response){
							deferred.reject(response)
						})
					return deferred.promise
						
				}
					
				self.validating = function (request) {
					var deferred = $q.defer()
					$http.get('/department/validating/' + request.name + '/' + request.id + '/' + request.university_id)
						.then(function(response){
							deferred.resolve(response)
						}, function(response){
							deferred.reject(response)
						})
					return deferred.promise
				}
				
			}
			return new DepartmentService()
		}
})();