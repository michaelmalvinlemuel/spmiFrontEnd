(function(angular) {
    
    'use strict';
    
    angular
        .module('spmiFrontEnd')
        .config(AssignmentRouter)
    
    function AssignmentRouter($stateProvider) {
        
        $stateProvider
            
            .state('main.admin.assignment', {
                url: '/assignment',
                views: {
                    'content': {
                        templateUrl: 'app/admin/assignment/views/list.html',
                        controller: 'AssignmentController as vm',
                    }
                },
                resolve: {
                    assignments: function(AssignmentService) {
                        return AssignmentService.get();
                    }
                }
            })
            
            .state('main.admin.assignment.create', {
                url: '/create',
                views: {
                    'content@main.admin': {
                        templateUrl: 'app/admin/assignment/views/form.html',
                        controller: 'CreateAssignmentController as vm',
                    }
                },
                resolve: {
                    users: function(UserService) {
                        return UserService.get();
                    },
                    groupJobs: function(GroupJobService) {
                        return GroupJobService.users();
                    }
                }
            })
            
            .state('main.admin.assignment.update', {
                url: '/:assignmentId',
                views: {
                    'content@main.admin': {
                        templateUrl: 'app/admin/assignment/views/form.html',
                        controller: 'UpdateAssignmentController as vm',
                    }
                },
                resolve: {
                    assignment: function($stateParams,AssignmentService) {
                        return AssignmentService.show($stateParams.assignmentId)
                    }
                }
            })
            
            .state('main.admin.assignment.detail', {
                url: '/:assignmentId/detail',
                views: {
                    'content@main.admin': {
                        templateUrl: 'app/admin/assignment/views/detail.html',
                        controller: 'DetailAssignmentController as vm',
                    }
                },
                resolve: {
                    assignment: function($stateParams, AssignmentService) {
                        return AssignmentService.detail($stateParams.assignmentId)
                    }
                }
            })
    }
    
})(angular);