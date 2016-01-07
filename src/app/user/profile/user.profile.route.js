(function(angular) {
    
    'use strict';
    
    angular.module('spmiFrontEnd')
        .config(UserRoute)
        
    function UserRoute ($stateProvider) {
        
        $stateProvider
        
            .state('main.user.profile', {
                parent: 'main.user',
                url: '/profile',
                views: {
                    'content': {
                        templateUrl: 'app/user/profile/views/form.html',
                        controller: 'ProfileUserController as vm'
                    }
                },
                resolve: {
                    user: function(UserService, $q, CURRENT_USER) {
                        
                        var deferred = $q.defer();
                        UserService.identity().then(function(data) {
                            return UserService.lite(data.id);
                        }).then(function(data) {
                            deferred.resolve(data);
                        });
                        
                        return deferred.promise;
                    },
                },
            })    
    }
    
})(angular);