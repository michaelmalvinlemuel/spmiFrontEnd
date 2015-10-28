(function () {
	
	angular
		.module('spmiFrontEnd')
		.factory('JobService', ['$http', '$q', '$cacheFactory', JobService])


	function JobService ($http, $q, $cacheFactory) {
		
		function JobService() {
			
			var self = this
			var cacheUniversity = null
			var $httpDefaultCache = $cacheFactory.get('$http');
	
			
			self.get = function () {
				var deferred = $q.defer()
				$http.get('/jobs')
					.then(function(response){
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					})
				return deferred.promise 
			}
	
			self.show = function (request) {
				var deferred = $q.defer()
				$http.get('/jobs/' + request)
					.then(function(response){
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					})
				return deferred.promise 
			}
			
			self.store = function(request) {
				var deferred = $q.defer()
				$http.post('/job/store', request)
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
				$http.post('/job/update', request)
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
				$http.post('/job/destroy', request)
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
				$http.get('/job/department/' + request)
					.then(function(response){
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					})
				return deferred.promise 
			}
			
			self.university = function (request) {
				var deferred = $q.defer()
				$http.get('/job/university/' + request)
					.then(function(response){
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					})
				return deferred.promise 
			}
			
			self.validating = function (request) {
				var deferred = $q.defer()
				$http.get('/job/validating/' + request.name + '/' + request.department_id + '/' + request.id)
					.then(function(response){
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					})
				return deferred.promise 
			}
			
			self.users = function (request) {
				var deferred = $q.defer()
				$http.get('/job/users/' + request)
					.then(function(response){
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					})
				return deferred.promise
	
			}
			
			self.subs = function (request) {
				var deferred = $q.defer()
				$http.get('/job/subs/' + request)
					.then(function(response){
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					})
				return deferred.promise
			}
		}
		
		return new JobService()
	}
})()