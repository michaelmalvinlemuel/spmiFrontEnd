(function () {

	angular
		.module('spmiFrontEnd')
		.factory('GroupJobService', ['$http', '$q', '$cacheFactory', GroupJobService])
		.factory('GroupJobDetailService', ['$http', GroupJobDetailService])

	function GroupJobService ($http, $q, $cacheFactory) {

		function GroupJobService() {
			
			var self = this
			var $httpDefaultCache = $cacheFactory.get('$http');
			
			self.get = function () {
				var deferred = $q.defer()
				$http.get('/groupjobs')
					.then(function(response){
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					})
				return deferred.promise
			}
			
			self.show = function (request) {
				var deferred = $q.defer()
				$http.get('/groupjobs/' + request)
					.then(function(response){
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					})
				return deferred.promise
			}
				
			self.store = function (request) {
				var deferred = $q.defer()
				$http.post('/groupjob/store', request)
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
				$http.post('/groupjob/update', request)
					.then(function(response){
						$httpDefaultCache.removeAll()
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					})
				return deferred.promise
			}
			
			self.destroy = function (request){
				var deferred = $q.defer()
				$http.post('/groupjob/destroy', request)
					.then(function(response){
						$httpDefaultCache.removeAll()
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					})
				return deferred.promise
			}
				
			self.validatingName = function (request){
				var deferred = $q.defer()
				$http.get('/groupjob/validating/name/' + request.name + '/' + request.id)
					.then(function(response){
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					})		
				return deferred.promise
			}
		}
	
		return new GroupJobService()
	}
	
	function GroupJobDetailService ($http) {
		return {
			get: function (request) {
				return $http.get('/groupjobdetails/get/' + request)
			},
			show: function (request) {
				return $http.get('/groupjobdetails/' + request)
			},
			store: function (request) {
				return $http.post('/groupjobdetail/store', request)
			},
			update: function (request) {
				return $http.post('/groupjobdetail/update', request)
			},
			destroy: function (request) {
				return $http.post('/groupjobdetail/destroy', request)
			}
		}
	}
})()