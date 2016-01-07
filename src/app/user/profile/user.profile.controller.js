(function(angular) {
    
    'use strict';
    
    angular.module('spmiFrontEnd')
        .controller('ProfileUserController', ProfileUserController)
        
    function ProfileUserController($modal, $state, $auth, user, CURRENT_USER) {
        
        var vm = this;
        
        vm.user = user;
        
        
        vm.changePassword = function() {
            
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'app/user/profile/views/password.modal.html',
                controller: 'PasswordModalProfileUserController as vm',
                resolve: {
                    user: function() {
                        return user;
                    }
                }
            })
            
            modalInstance.result.then(function(password) {
                
                alert('Password Anda berhasil diubah, anda akan melakukan harus login ulang untuk melanjutkan.');
                $auth.logout().then(function() {
                    CURRENT_USER = {}
                    $state.go('login', {sender: 'system'});
                })
            })
        }
        
        return vm;
    }
    
})(angular);