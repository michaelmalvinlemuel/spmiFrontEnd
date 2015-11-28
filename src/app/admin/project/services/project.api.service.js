(function() {
	
	'use strict'
	
	angular.module('spmiFrontEnd')
		.factory('ProjectService', ProjectService)


	function ProjectService ($rootScope, $http, $state, $q, $cacheFactory, ngProgressFactory, Upload, API_HOST, FILE_HOST) {
	
		var project = {}
		
		
		var $httpDefaultCache = $cacheFactory.get('$http');
		
		project.get = function (display, initiation, preparation, progress, grading
		, complete, terminated, page) {
			var deferred = $q.defer();
			var progress1 = ngProgressFactory.createInstance();
			progress1.start();
			$http.get(API_HOST + '/project/' + display + '/' + initiation + '/' 
				+ preparation + '/' + progress + '/' + grading + '/' + complete + '/' 
				+ terminated + '?page=' + page)
			.then(function(response) {
				progress1.complete();
				deferred.resolve(response.data);
			}, function(data) {
				progress1.complete();
				deferred.reject($rootScope.errorHandler(data));
			})
	
			return deferred.promise;
		};
		
		project.showLast = function (request) {
			var deferred = $q.defer();
			var progress = ngProgressFactory.createInstance();
			progress.start();
			$http.get(API_HOST + '/project/last/' + request)
				.then(function(response) {
					progress.complete();
					deferred.resolve(response.data)
				}, function(data) {
					progress.complete();
					deferred.reject($rootScope.errorHandler(data));
				})

			return deferred.promise;
		};
		
		project.show = function (request) {
			var deferred = $q.defer();
			var progress = ngProgressFactory.createInstance();
			progress.start();
			$http.get(API_HOST + '/project/' + request)
				.then(function(response) {
					progress.complete();
					deferred.resolve(response.data)
				}, function(data) {
					progress.complete();
					deferred.reject($rootScope.errorHandler(data));
				})
	
			return deferred.promise;
		};
	
		project.store = function (request) {
			var deferred = $q.defer();
			var progress = ngProgressFactory.createInstance();
			progress.start();
			$http.post(API_HOST + '/project', request)
				.then(function(response) {
					progress.complete();
					$httpDefaultCache.removeAll()
					deferred.resolve(response.data)
				}, function(data) {
					progress.complete();
					deferred.reject($rootScope.errorHandler(data));
				})
			return deferred.promise;
		};
	
		project.update = function (request) {
			var deferred = $q.defer();
			var progress = ngProgressFactory.createInstance();
			console.log('start me now');
			progress.start();
			$http.patch(API_HOST + '/project/' + request.id, request)
				.then(function(response) {
					console.log('dont stop me now');
					progress.complete();
					$httpDefaultCache.removeAll()
					deferred.resolve(response.data)
				}, function(data) {
					progress.complete();
					deferred.reject($rootScope.errorHandler(data));
				})
	
			return deferred.promise;
		};
	
		project.destroy = function (request) {
			var deferred = $q.defer();
			var progress = ngProgressFactory.createInstance();
			progress.start();
			$http.delete(API_HOST + '/project/' + request)
				.then(function(response) {
					progress.complete();
					$httpDefaultCache.removeAll()
					deferred.resolve(response.data)
				}, function(data) {
					progress.complete();
					deferred.reject($rootScope.errorHandler(data));
				})
	
			return deferred.promise;
		};
		
		project.user = function (display, initiation, preparation, progress
			, grading, complete, terminated, page) {
			var deferred = $q.defer();
			var progress1 = ngProgressFactory.createInstance();
			progress1.start();
			$http.get(API_HOST + '/project/user/' + display + '/' + initiation + '/' 
			+ preparation + '/' + progress + '/' + grading + '/' + complete + '/' 
			+ terminated + '?page=' + page)
				.then(function(response) {
					progress1.complete();
					deferred.resolve(response.data)
				}, function(data) {
					progress1.complete();
					deferred.reject($rootScope.errorHandler(data));
				})
			
			return deferred.promise
		};
	
		
	
		project.form = function (request) {
			var deferred = $q.defer();
			var progress = ngProgressFactory.createInstance();
			progress.start();
			$http.get(API_HOST + '/project/form/' + request)
				.then(function (response) {
					progress.complete();
					deferred.resolve(response.data)
				}, function(data) {
					progress.complete();
					deferred.reject($rootScope.errorHandler(data));
				})
			
			return deferred.promise
		};
		
		project.leader = function (request) {
			var deferred = $q.defer();
			var progress = ngProgressFactory.createInstance();
			progress.start();
			$http.get(API_HOST + '/project/leader/' + request)
				.then(function (response) {
					progress.complete();
					deferred.resolve(response.data)
				}, function(data) {
					progress.complete();
					deferred.reject($rootScope.errorHandler(data));
				})
				
			return deferred.promise
		};

		project.upload = function (request) {
			console.log(request);
			request.directory = 'project';
			var deferred = $q.defer();
			var progress = ngProgressFactory.createInstance();
			progress.start();
			$http.get(API_HOST + '/authenticate').then(function(response) {
				request.nik = response.data.user.nik;
				request.name = response.data.user.name;
				console.log(response);
				return Upload.upload({
					url: FILE_HOST + '/upload.php',
					data: request,
				})
			}, function(data) {
				progress.complete();
				deferred.reject($rootScope.errorHandler(data));
			}).then(function(response) {
				delete request.nik;
				delete request.name;
				delete request.file;
				delete request.directory;
				request.filename = response.data;
				return $http.post(API_HOST + '/project/upload', request);
			}, function(data) {
				progress.complete();
				deferred.reject($rootScope.errorHandler(data));
			}).then(function(response){
				progress.complete();
				$httpDefaultCache.removeAll();
				deferred.resolve(response.data)
			}, function(data) {
				progress.complete();
				deferred.reject($rootScope.errorHandler(data));
			});
			
			return deferred.promise
		};
		
		
		
		project.validatingName = function(request){
			var deferred = $q.defer();
			var progress = ngProgressFactory.createInstance();
			progress.start();
			$http.get(API_HOST + '/project/validating/name/' + request.name + '/' + request.id)
				.then(function(response){
					progress.complete();
					deferred.resolve(response.data)
				}, function(data) {
					progress.complete();
					deferred.reject($rootScope.errorHandler(data));
				});
				
			return deferred.promise;
		}	
		
		project.mark = function(request) {
			var deferred = $q.defer();
			var progress = ngProgressFactory.createInstance();
			progress.start();
			$http.patch(API_HOST + '/project/mark/' + request.id, request)
				.then(function(response) {
					progress.complete();
					$httpDefaultCache.removeAll();
					deferred.resolve(response.data)
				}, function(response) {
					progress.complete();
					deferred.reject($rootScope.errorHandler(response));
				});
			
			return deferred.promise;
		}
		
		
		project.delegate = function (request) {
			var deferred = $q.defer();
			var progress = ngProgressFactory.createInstance();
			progress.start();
			$http.post(API_HOST + '/project/node/delegate', request)
				.then(function (response) {
					progress.complete();
					$httpDefaultCache.removeAll()
					deferred.resolve(response.data)
				}, function(data) {
					progress.complete();
					deferred.reject($rootScope.errorHandler(data));
				})
	
			return deferred.promise
		};
		
		
		project.lock = function(request, lockStatus) {
			var deferred = $q.defer();
			var progress = ngProgressFactory.createInstance();
			progress.start();
			$http.get(API_HOST + '/project/node/lock/' + request + '/' + lockStatus).then(function(response) {
				progress.complete();
				$httpDefaultCache.removeAll();
				deferred.resolve(response.data);
			}, function(data) {
				progress.complete();
				deferred.reject($rootScope.errorHandler(data));
			});
			
			return deferred.promise;
		}
		
		project.lockAll = function(id, lockStatus) {
			var deferred = $q.defer();
			var progress = ngProgressFactory.createInstance();
			progress.start();
			$http.get(API_HOST + '/project/lock/' + id + '/' + lockStatus)
				.then(function(response) {
					progress.complete();
					$httpDefaultCache.removeAll();
					deferred.resolve(response.data);
				}, function(data) {
					progress.complete();
					deferred.reject($rootScope.errorHandler(data));
				});
			
			return deferred.promise;
		}
		
		project.assess = function(request) {
			var deferred = $q.defer();
			var progress = ngProgressFactory.createInstance();
			progress.start();
			$http.get(API_HOST + '/project/node/assess/' + request).then(function(response){
				progress.complete();
				deferred.resolve(response.data);
			}, function(data) {
				progress.complete();
				deferred.reject($rootScope.errorHandler(data));
			});
			
			return deferred.promise;
		}
		
		project.score = function (request) {
			var deferred = $q.defer();
			var progress = ngProgressFactory.createInstance();
			progress.start();
			$http.post(API_HOST + '/project/node/score', request).then(function(response) {
				progress.complete();
				$httpDefaultCache.removeAll();
				deferred.resolve(response.data);
			}, function(data) {
				progress.complete();
				deferred.reject($rootScope.errorHandler(data));
			});
			
			return deferred.promise 
		}
	
		return project
	
	}
})();