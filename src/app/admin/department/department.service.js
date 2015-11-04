(function () {

	angular
		.module('spmiFrontEnd')
		.factory('DepartmentService', ['$http', '$q', '$cacheFactory', 'API_HOST', DepartmentService])


		function DepartmentService ($http, $q, $cacheFactory, API_HOST) {
			function DepartmentService() {
				var cacheUniversity = null;
				
				var self = this
				var $httpDefaultCache = $cacheFactory.get('$http');
				
				self.get = function () {
					var deferred = $q.defer()
					$http.get(API_HOST + '/department')
						.then(function(response){
							deferred.resolve(response.data)
						}, function(response){
							deferred.reject(response)
						})
					return deferred.promise
				}
				
				self.show = function (request) {
					var deferred = $q.defer()
					$http.get(API_HOST + '/department/' + request)
						.then(function(response){
							deferred.resolve(response.data)
						}, function(response) {
							deferred.reject(response)
						})
					return deferred.promise
				}
					
				self.store = function(request) {
					var deferred = $q.defer()
					$http.post(API_HOST + '/department', request)
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
					$http.patch(API_HOST + '/department/' + request.id, request)
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
					$http.delete(API_HOST + '/department/' + request)
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
					$http.get(API_HOST + '/department/university/' + request)
						.then(function(response){
							deferred.resolve(response.data)
						}, function(response){
							deferred.reject(response)
						})
					return deferred.promise
						
				}
					
				self.validating = function (request) {
					var deferred = $q.defer()
					$http.get(API_HOST + '/department/validating/' + request.name + '/' + request.id + '/' + request.university_id)
						.then(function(response){
							deferred.resolve(response.data)
						}, function(response){
							deferred.reject(response)
						})
					return deferred.promise
				}
				
			}
			return new DepartmentService()
		}
})();