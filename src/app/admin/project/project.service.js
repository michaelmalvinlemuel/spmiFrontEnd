(function() {
	'use strict'
	angular.module('spmiFrontEnd')
		.factory('ProjectService', ['$http', '$state', '$q', '$cacheFactory', 'Upload', 'API_HOST', ProjectService])


	function ProjectService ($http, $state, $q, $cacheFactory, Upload, API_HOST) {
	
		var project = {}
		
		
		var $httpDefaultCache = $cacheFactory.get('$http');
		
		project.get = function () {
			var deferred = $q.defer();
			$http.get(API_HOST + '/project')
				.then(function(response) {
					deferred.resolve(response.data)
				}, function(response) {
					deferred.reject(response)
				})
	
			return deferred.promise;
		};
		
		project.showLast = function (request) {
			var deferred = $q.defer();
			$http.get(API_HOST + '/project/last/' + request)
				.then(function(response) {
					deferred.resolve(response.data)
				}, function(response) {
					deferred.reject(response.data)
				})
	
			return deferred.promise;
		};
		
		project.show = function (request) {
			var deferred = $q.defer();
			$http.get(API_HOST + '/project/' + request)
				.then(function(response) {
					deferred.resolve(response.data)
				}, function(response) {
					deferred.reject(response)
				})
	
			return deferred.promise;
		};
	
		project.store = function (request) {
			var deferred = $q.defer();
			$http.post(API_HOST + '/project', request)
				.then(function(response) {
					$httpDefaultCache.removeAll()
					deferred.resolve(response.data)
				}, function(response) {
					deferred.reject(response)
				})
			return deferred.promise;
		};
	
		project.update = function (request) {
			var deferred = $q.defer();
			$http.patch(API_HOST + '/project/' + request.id, request)
				.then(function(response) {
					$httpDefaultCache.removeAll()
					deferred.resolve(response.data)
				}, function(response) {
					deferred.reject(response)
				})
	
			return deferred.promise;
		};
	
		project.destroy = function (request) {
			var deferred = $q.defer();
			$http.delete(API_HOST + '/project/' + request)
				.then(function(response) {
					$httpDefaultCache.removeAll()
					deferred.resolve(response.data)
				}, function(response) {
					deferred.reject(response)
				})
	
			return deferred.promise;
		};
		
		project.user = function () {
			var deferred = $q.defer()
			$http.get(API_HOST + '/project/user')
				.then(function(response) {
					deferred.resolve(response.data)
				}, function(response) {
					deferred.reject(response.data)
				})
			
			return deferred.promise
		};
	
		project.delegate = function (request) {
			var deferred = $q.defer()
			$http.post(API_HOST + '/project/delegate', request)
				.then(function (response) {
					$httpDefaultCache.removeAll()
					deferred.resolve(response.data)
				}, function(response) {
					deferred.reject(response.data)
				})
	
			return deferred.promise
		};
	
		project.form = function (request) {
			var deferred = $q.defer()
			$http.get(API_HOST + '/project/form/' + request)
				.then(function (response) {
					deferred.resolve(response.data)
				}, function(response) {
					deferred.reject(response.data)
				})
			
				return deferred.promise
		};
		
		project.leader = function (request) {
			var deferred = $q.defer()
			$http.get(API_HOST + '/project/leader/' + request)
				.then(function (response) {
					deferred.resolve(response.data)
				}, function(response) {
					deferred.reject(response.data)
				})
				
			return deferred.promise
		};
		
		project.upload = function (request) {
			
			var deferred = $q.defer()
			
			Upload.upload({
				url: API_HOST + '/project/upload',
				data: request,
			}).then(function(response){
				$httpDefaultCache.removeAll();
				deferred.resolve(response.data)
			}, function(response){
				deferred.reject(response.data)
			})
			return deferred.promise
		};
		
		project.score = function (request) {
			var deferred = $q.defer();
			$http.post(API_HOST + '/project/score', request).then(function(response) {
				$httpDefaultCache.removeAll();
				deferred.resolve(response.data);
			}, function(response) {
				deferred.reject(response.data);
			});
			
			return deferred.promise 
		}
		
		project.validatingName = function(request){
			var deferred = $q.defer()
			$http.get(API_HOST + '/project/validating/name/' + request.name + '/' + request.id)
				.then(function(response){
					deferred.resolve(response.data)
				}, function(response){
					deferred.reject(response.data)
				});
			return deferred.promise;
		}
		
		project.mark = function(request) {
			var deferred = $q.defer();
			$http.patch(API_HOST + '/project/mark/' + request.id, request).then(function(response) {
				$httpDefaultCache.removeAll();
				deferred.resolve(response.data)
			}, function(response) {
				deferred.reject(response.data)
			});
			
			return deferred.promise;
		}
	
		return project
	
	}
})();