(function(angular) {
    
    'use strict';
    
    angular.module('spmiFrontEnd')
        .factory('UserAssignmentAttachmentService', UserAssignmentAttachmentService)
        
    function UserAssignmentAttachmentService($rootScope, $http, $q, Upload, $cacheFactory, ngProgressFactory, API_HOST, FILE_HOST) {
        
        var userAssignmentAttachment = {};
        var $httpDefaultCache = $cacheFactory.get('$http');
			
        userAssignmentAttachment.store = function(request) {
            request.directory = 'assignment';
            var deferred = $q.defer();
            var progress = ngProgressFactory.createInstance();
            progress.start();
            
            Upload.upload({
                url: FILE_HOST + '/upload.php',
                data: request,
            }).then(function(response) {
                request.filename = response.data;
                return $http.post(API_HOST + '/assignment-user-attachment', request)
            }).then(function(response) {
                progress.complete();
                $httpDefaultCache.removeAll();
                deferred.resolve(response.data);
            }, function(data) {
                progress.complete();
                deferred.reject($rootScope.errorHandler(data));
            });
            
            return deferred.promise;
        } 
        
        userAssignmentAttachment.delegate = function(request) {
            var deferred = $q.defer();
            var progress = ngProgressFactory.createInstance();
            progress.start();
            
            $http.post(API_HOST + '/assignment-user-attachment/delegate', request)
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
        
        return userAssignmentAttachment;
    }
    
})(angular);