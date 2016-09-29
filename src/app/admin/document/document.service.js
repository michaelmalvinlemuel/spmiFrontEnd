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
            $http.get(API_HOST + '/standard/combination?display=' + display + 
                '&standardDocument=' + show.standardDocument + 
                '&guide=' + show.guide + 
                '&instruction=' + show.instruction + 
                '&form=' + show.form + 
                '&page=' + page + 
                '&keyword=' + $rootScope.encodeURI(request.keyword))
                    .then(function(response) {
                        progress.complete();
                        deferred.resolve(response.data);
                    }, function(data) {
                        progress.complete();
                        deferred.reject($rootScope.errorHander(data));
                    }
            );
                
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