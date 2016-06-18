(function(angular) {
    
    'use strict';
    
    angular.module('spmiFrontEnd')
        .config(UserAssignmentRouter)
        
    function UserAssignmentRouter($stateProvider) {
        
        $stateProvider
            .state('main.user.assignment', {
                url: '/assignment',
                views: {
                    'content': {
                        templateUrl: 'app/user/assignment/views/list.html',
                        controller: 'UserAssignmentController as vm',
                    }
                },
                resolve: {
                    assignments: function(UserAssignmentService) {
                        return UserAssignmentService.get();
                    },
                },
            })
            
            .state('main.user.assignment.update', {
                url: '/:assignmentId',
                views: {
                    'content@main.user': {
                        templateUrl: 'app/user/assignment/views/form.html',
                        controller: 'UpdateUserAssignmentController as vm',
                    }
                },
                resolve: {
                    assignment: function($stateParams, UserAssignmentService) {
                        return UserAssignmentService.show($stateParams.assignmentId);
                    },
                },
            })
    }
    
})(angular);