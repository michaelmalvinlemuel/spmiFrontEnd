(function () {
	
	angular
		.module('spmiFrontEnd')
		.factory('JobService', ['$http', '$q', '$cacheFactory', 'API_HOST', JobService])


	function JobService ($http, $q, $cacheFactory, API_HOST) {
		
		function JobService() {
			
			var self = this
			var $httpDefaultCache = $cacheFactory.get('$http');
	
			
			self.get = function () {
				var deferred = $q.defer()
				$http.get(API_HOST + '/job')
					.then(function(response){
						deferred.resolve(response.data)
					}, function(response){
						deferred.reject(response)
					})
				return deferred.promise 
			}
	
			self.show = function (request) {
				var deferred = $q.defer()
				$http.get(API_HOST + '/job/' + request)
					.then(function(response){
						deferred.resolve(response.data)
					}, function(response){
						deferred.reject(response)
					})
				return deferred.promise 
			}
			
			self.store = function(request) {
				var deferred = $q.defer()
				$http.post(API_HOST + '/job', request)
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
				$http.patch(API_HOST + '/job/' + request.id, request)
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
				$http.delete(API_HOST + '/job/' + request)
					.then(function(response){
						$httpDefaultCache.removeAll()
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					})
				return deferred.promise 
			}
			
			self.department = function (request) {
				var deferred = $q.defer()
				$http.get(API_HOST + '/job/department/' + request)
					.then(function(response){
						deferred.resolve(response.data)
					}, function(response){
						deferred.reject(response)
					})
				return deferred.promise 
			}
			
			self.university = function (request) {
				var deferred = $q.defer()
				$http.get(API_HOST + '/job/university/' + request)
					.then(function(response){
						deferred.resolve(response.data)
					}, function(response){
						deferred.reject(response)
					})
				return deferred.promise 
			}
			
			self.validating = function (request) {
				var deferred = $q.defer()
				$http.get(API_HOST + '/job/validating/' + request.name + '/' + request.department_id + '/' + request.id)
					.then(function(response){
						deferred.resolve(response.data)
					}, function(response){
						deferred.reject(response)
					})
				return deferred.promise 
			}
			
			self.users = function (request) {
				var deferred = $q.defer()
				$http.get(API_HOST + '/job/users/' + request)
					.then(function(response){
						deferred.resolve(response.data)
					}, function(response){
						deferred.reject(response)
					})
				return deferred.promise
	
			}
			
			self.subs = function (request) {
				var deferred = $q.defer()
				$http.get(API_HOST + '/job/subs/' + request)
					.then(function(response){
						deferred.resolve(response.data)
					}, function(response){
						deferred.reject(response)
					})
				return deferred.promise
			}
		}
		
		return new JobService()
	}
})()