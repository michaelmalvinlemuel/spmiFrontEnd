(function(angular) {
	
	'use strict';
	
	angular.module('spmiFrontEnd')
		.factory('ProjectTemplateService', ProjectTemplateService)
	
	function ProjectTemplateService($rootScope, $http, $state, $q, $cacheFactory, ngProgressFactory, Upload, API_HOST, FILE_HOST) {
		
		var projectTemplate = {},
			$httpDefaultCache = $cacheFactory.get('$http');
		
		
		projectTemplate.get = function() {
			var deferred = $q.defer(),
				progress = ngProgressFactory.createInstance();
			
			progress.start();
			$http.get(API_HOST + '/template/project')
			.then(function(response) {
				progress.complete();
				deferred.resolve(response.data);
			}, function(response) {
				progress.complete();
				deferred.reject($rootScope.errorHandler(response));
			})
			
			return deferred.promise;
		}
			
		projectTemplate.paginate = function(display, page) {
			var deferred = $q.defer(),
				progress = ngProgressFactory.createInstance();
			
			progress.start();
			$http.get(API_HOST + '/template/project/paginate/' + display + '?page=' + page)
			.then(function(response) {
				progress.complete();
				deferred.resolve(response.data);
			}, function(response) {
				progress.complete();
				deferred.reject($rootScope.errorHandler(response));
			})
			
			return deferred.promise;
		}
		
		projectTemplate.show = function(request) {
			var deferred = $q.defer(),
				progress = ngProgressFactory.createInstance();
			
			progress.start();
			$http.get(API_HOST + '/template/project/' + request)
			.then(function(response) {
				progress.complete();
				deferred.resolve(response.data);
			}, function(response) {
				progress.complete();
				deferred.reject($rootScope.errorHandler(response));
			})
			
			return deferred.promise;
		}
		
		projectTemplate.store = function(request) {
			var deferred = $q.defer(),
				progress = ngProgressFactory.createInstance();
			
			progress.start();
			$http.post(API_HOST + '/template/project', request)
			.then(function(response) {
				progress.complete();
				$httpDefaultCache.removeAll();
				deferred.resolve(response.data);
			}, function(response) {
				progress.complete();
				deferred.reject($rootScope.errorHandler(response));
			})
			
			return deferred.promise;
		}
		
		projectTemplate.update = function(request) {
			var deferred = $q.defer(),
				progress = ngProgressFactory.createInstance();
			
			progress.start();
			$http.patch(API_HOST + '/template/project/' + request.id, request)
				.then(function(response) {
					progress.complete();
					$httpDefaultCache.removeAll();
					deferred.resolve(response.data);
				}, function(response) {
					progress.complete();
					deferred.reject($rootScope.errorHandler(response))
				});
			
			return deferred.promise;
		}
		
		projectTemplate.destroy = function(request) {
			var deferred = $q.defer(),
				progress = ngProgressFactory.createInstance();
				
			progress.start();
			$http.delete(API_HOST + '/template/project/' + request)
			.then(function(response) {
				progress.complete();
				$httpDefaultCache.removeAll();
				deferred.resolve(response.data);
			}, function(response) {
				progress.complete();
				deferred.reject($rootScope.errorHandler(response))
			})
			
			return deferred.promise;
		}
		
		return projectTemplate;
	}
	
})(angular);