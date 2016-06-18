(function (angular) {
    'use strict';
    
    angular.module('spmiFrontEnd')
        .factory('DocumentService', DocumentService)
        
    function DocumentService($rootScope, $http, $q, $cacheFactory, ngProgressFactory, API_HOST) {
        
        var document = {}
        
        document.combination = function(display, show, request, page) {
            var deferred = $q.defer();
            var progress = ngProgressFactory.createInstance();
            progress.start();
            $http.post(API_HOST + '/standard/combination/' 
                + display + '/'
                + show.standardDocument + '/'
                + show.guide + '/'
                + show.instruction + '/'
                + show.form + '?page='
                + page, request)
                .then(function(response) {
                    progress.complete();
                    deferred.resolve(response.data);
                }, function(data) {
                    progress.complete();
                    deferred.reject($rootScope.errorHander(data));
                });
                
            return deferred.promise;
        }
        
        document.download = function(request) {
            var deferred = $q.defer();
            var progress = ngProgressFactory.createInstance();
            progress.start();
            $http.post(API_HOST + '/history/download', request)
                .then(function(response) {
                    progress.complete();
                    deferred.resolve(response.data);
                }, function(data) {
                    progress.complete();
                    deferred.reject($rootScope.errorHandler(data));
                })
            
            return deferred.promise;
        }
        
        return document;
        
    }
    
})(angular);