(function () {
	
	angular.module('spmiFrontEnd')
		.factory('UniversityService', ['$http', '$q', '$state', '$cacheFactory', UniversityService])

	function UniversityService ($http, $q, $state, $cacheFactory) {
	
		var university = {}
		var $httpDefaultCache = $cacheFactory.get('$http');
	
		university.get = function () {
			var deferred = $q.defer();
			$http.get('/universities')
				.then(function(response) {
					deferred.resolve(response.data)
				}, function(response) {
					deferred.reject()
					$state.go('login')
				})
				
			return deferred.promise;
		}
	
		university.show = function (request) {
			var deferred = $q.defer()
			$http.get('/universities/' + request)
				.then(function(response) {
					deferred.resolve(response)
				}, function (response) {
					deferred.reject(response)
				})
			return deferred.promise
		}
	
		university.store = function(request) {
			var deferred = $q.defer()
			$http.post('/university/store', request)
				.then(function(response) {
					$httpDefaultCache.removeAll();
					deferred.resolve(response)
				}, function() {
					deferred.reject(response)
				})
			return deferred.promise
		}
	
		university.update = function (request) {
			var deferred = $q.defer()
			$http.post('/university/update', request)
				.then(function(response){
					$httpDefaultCache.removeAll();
					deferred.resolve(response)
				}, function(response) {
					deferred.reject(response)
				})
			return deferred.promise
		}
	
		university.destroy = function (request) {
			var deferred = $q.defer()
			$http.post('/university/destroy', request)
				.then(function(response) {
					$httpDefaultCache.removeAll();
					deferred.resolve(response)
				}, function(response) {
					deferred.reject(response)
				})
			return deferred.promise
		}
	
		university.validating = function (request) {
			var deferred = $q.defer()
			$http.get('/university/validating/' + request.name + '/' + request.id)
				.then(function(response) {
					deferred.resolve(response)
				}, function(response) {
					deferred.reject(response)
				})
			return deferred.promise
		}
	
		return university;
	}
})();
