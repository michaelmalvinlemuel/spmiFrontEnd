(function(angular) {
    'use strict';

    angular.module('spmiFrontEnd')
        .factory('SettingService', SettingService)

    function SettingService($rootScope, $http, $q, $cacheFactory, ngProgressFactory, API_HOST, FILE_HOST) 
    {
        var settingService = {};
        var $httpDefaultCache = $cacheFactory.get('$http');

        settingService.clean = function() {
            $httpDefaultCache.removeAll();
            var deferred = $q.defer();
            var progress = ngProgressFactory.createInstance();
            progress.start();
            $http.get(API_HOST + '/setting/clean')
                .then(function(response){
                    progress.complete();
                    deferred.resolve(response.data);
                }, function(data) {
                    progress.complete();
                    deferred.reject($rootScope.errorHandler(data));
                })
            return deferred.promise;
        }

        settingService.export = function() {
            $httpDefaultCache.removeAll();
            var deferred = $q.defer();
            var progress = ngProgressFactory.createInstance();
            progress.start();
            $http.get(FILE_HOST + '/export.php?path=' + $rootScope.encodeURI(API_HOST + '/setting/project/export'))
                .then(function(response){
                    progress.complete();
                    deferred.resolve(response.data);
                }, function(data) {
                    progress.complete();
                    deferred.reject($rootScope.errorHandler(data));
                })
            return deferred.promise;
        }


        return settingService;
    }
    
})(angular);