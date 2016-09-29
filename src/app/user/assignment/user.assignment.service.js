(function(angular) {

    'use strict';

    angular.module('spmiFrontEnd')
        .factory('UserAssignmentService', UserAssignmentService)

    function UserAssignmentService($rootScope, $http, $q, $cacheFactory, ngProgressFactory, API_HOST) {

        var userAssignment = {};

        userAssignment.get = function() {
            var deferred = $q.defer();
            var progress = ngProgressFactory.createInstance();
            progress.start();
            $http.get(API_HOST + '/assignment-user')
                .then(function(response) {
                    progress.complete();
                    deferred.resolve(response.data);
                }, function(data) {
                    progress.complete();
                    deferred.reject($rootScope.errorHandler(data));
                });
            return deferred.promise;

        }

        userAssignment.show = function(request) {
            var deferred = $q.defer();
            var progress = ngProgressFactory.createInstance();
            progress.start();
            $http.get(API_HOST + '/assignment-user' + '/' + request)
                .then(function(response) {
                    progress.complete();
                    deferred.resolve(response.data);
                }, function(data) {
                    progress.complete();
                    deferred.reject($rootScope.errorHandler(data));
                });

            return deferred.promise;
        }

        return userAssignment;

    }
})(angular);
