(function(angular) {
    
    'use strict';
    
    angular.module('spmiFrontEnd')
        .controller('PasswordModalProfileUserController', PasswordModalProfileUserController)
        
    function PasswordModalProfileUserController($scope, $modalInstance, user, UserService) {
        
        var vm = this;    
        
        vm.input = {}
        vm.validated = false;
        
        vm.error = {}
        vm.error.status = false;
        vm.error.message = '';
        
        vm.close = function() {
            $modalInstance.dismiss('cancel');
        }
        
        vm.submit = function() {
            $scope.PasswordForm.old.$setDirty();
            $scope.PasswordForm.new.$setDirty();
            $scope.PasswordForm.confirm.$setDirty();
            
            if ($scope.PasswordForm.$valid) {
                UserService.reset(vm.input)
                    .then(function(data) {
                       
                       if (data.header == true) {
                            
                            $modalInstance.close(vm.input);
                            
                       } else {
                           
                           vm.validated = true;
                           vm.input.new = null;
                           vm.input.confirm = null;
                           vm.error.status = true;
                           vm.error.message = 'Password lama Anda salah';
                           
                       }
                       
                    });
            } else {
                vm.validated = true;
            }
            
            
            
        }
        
        return vm;
        
    }
    
})(angular);