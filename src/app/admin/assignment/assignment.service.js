(function(angular) {
    
    'use strict';
    
    angular
        .module('spmiFrontEnd')
        .factory('AssignmentService', AssignmentService)
        
    function AssignmentService($rootScope, $http, $q, $cacheFactory, ngProgressFactory, API_HOST) {
        
        var assignment = {}
        var $httpDefaultCache = $cacheFactory.get('$http');
				
        assignment.get = function() {
            var deferred = $q.defer();
            var progress = ngProgressFactory.createInstance();
            
            progress.start();
            $http.get(API_HOST + '/assignment')
                .then(function(response) {
                    progress.complete();
                    deferred.resolve(response.data)
                }, function(data) {
                    progress.complete();
                    deferred.reject($rootScope.errorHandler(data));
                })
            return deferred.promise;
        }
        
        assignment.store = function(request) {
            var deferred = $q.defer();
            var progress = ngProgressFactory.createInstance();
            
            progress.start();
            $http.post(API_HOST + '/assignment', request)
                .then(function(response) {
                    progress.complete();
                    $httpDefaultCache.removeAll();
                    deferred.resolve(response.data);
                }, function(data) {
                    progress.complete();
                    deferred.reject($rootScope.errorHandler(data));
                })
            return deferred.promise;
        }
        
        assignment.show = function(request) {
            var deferred = $q.defer();
            var progress = ngProgressFactory.createInstance();
            
            progress.start();
            $http.get(API_HOST + '/assignment/' + request)
                .then(function(response) {
                    progress.complete();
                    deferred.resolve(response.data)
                }, function(data) {
                    progress.complete();
                    deferred.reject($rootScope.errorHandler(data));
                })
            return deferred.promise;
        }
        
        assignment.update = function(request) {
            var deferred = $q.defer();
            var progress = ngProgressFactory.createInstance();
            
            progress.start();
            $http.patch(API_HOST + '/assignment/' + request.id, request)
                .then(function(response) {
                    progress.complete();
                    $httpDefaultCache.removeAll();
                    deferred.resolve(response.data);
                }, function(data) {
                    progress.complete();
                    deferred.reject($rootScope.errorHandler(data));
                })
            return deferred.promise;
        }
        
        assignment.delete = function(request) {
            var deferred = $q.defer();
            var progress = ngProgressFactory.createInstance();
            
            progress.start();
            $http.delete(API_HOST + '/assignment/' + request)
                .then(function(response) {
                    progress.complete();
                    $httpDefaultCache.removeAll();
                    deferred.resolve(response.data);
                }, function(data) {
                    progress.complete();
                    deferred.reject($rootScope.errorHandler(data));
                })
            return deferred.promise;
        }
        
        assignment.detail = function(request) {
            var deferred = $q.defer();
            var progress = ngProgressFactory.createInstance();
            
            progress.start();
            $http.get(API_HOST + '/assignment/' + request + '/detail')
                .then(function(response) {
                    progress.complete();
                    deferred.resolve(response.data);
                }, function(data) {
                    progress.complete();
                    deferred.reject($rootScope.errorHandler(data))
                })
            return deferred.promise;
        }
        
        return assignment;
    }
        
})(angular);