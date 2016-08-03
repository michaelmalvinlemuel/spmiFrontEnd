(function(angular) {
    
    'use strict';
    
    angular.module('spmiFrontEnd')
        .controller('UserAssignmentController', UserAssignmentController)
        .controller('UpdateUserAssignmentController', UpdateUserAssignmentController)
        
    function UserAssignmentController($scope, $state, assignments, PaginationService, UserAssignmentService) {
        
        var vm = this;
        
        vm.assignments = assignments.data;
        PaginationService.paginate(vm, vm.assignments, UserAssignmentService.get);
        
        return vm;
        
    }
    
    function UpdateUserAssignmentController($rootScope, $state, $modal, assignment, UserAssignmentService, UserAssignmentAttachmentService) {
        
        var vm = this;
        
        vm.assignment = assignment;
        
        vm.delegate = function(attachment) {
            
            var tempDelegation = [];
            
            for (var i = 0; i < attachment.delegations.length; i++) {
                if ($rootScope.id !== attachment.delegations[i].user_id) {
                    tempDelegation.push(attachment.delegations[i])
                }
                console.log($rootScope.id);
            }
            
            attachment.delegations = tempDelegation;
            
            var modalInstance = $modal.open({
                animate: true,
                templateUrl: 'app/admin/user/views/modal.html',
                controller: 'ModalUserAssignmentController as vm',
                size: 'lg',
                resolve: {
                    users: function(UserService) {
                        return UserService.subordinate();
                    },
                    preSelectedUsers: function() {
                        return attachment.delegations;
                    },
                }
            });
            
            modalInstance.result.then(function(postSelectedUsers) {
                
                var request = {
                    assignment_attachment_template_id: attachment.id,
                    assignment_recipient_id: attachment.delegations[0].assignment_recipient_id,
                    delegations: postSelectedUsers, 
                }
                
                console.log(request);
                
                UserAssignmentAttachmentService.delegate(request)
                    .then(function(data) {
                        alert('Delegasi berhasil');
                        console.log(postSelectedUsers);

                        attachment.delegations = data;
                })
            }, function() {
                
            })
        }
        
        vm.upload = function(file, object) {
            if (file) {
                var request = {
                    assignment_recipient_id: object.delegations[0].assignment_recipient_id,
                    assignment_attachment_template_id: object.id,
                    file: file,    
                }
                
                UserAssignmentAttachmentService.store(request)
                    .then(function(data) {
                        alert('upload berhasil');
                        console.log(data);
                        object.uploads.unshift(data);
                    })
            }
        }
        
        return vm;
    }
    
})(angular);