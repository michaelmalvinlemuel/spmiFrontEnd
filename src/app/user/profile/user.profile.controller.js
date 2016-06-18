(function(angular) {
    
    'use strict';
    
    angular.module('spmiFrontEnd')
        .controller('ProfileUserController', ProfileUserController)
        
    function ProfileUserController($modal, $scope, $timeout, $state, $auth, user, UserService, CURRENT_USER) {
        
        var vm = this;
        
        var tempUser = user;
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
        
        $scope.$watch('vm.user.nik', function () {
            var timeoutNikPromise
            
            if ($scope.ProfileForm.nik) {
                var validInput = $scope.ProfileForm.nik.$invalid
                var dirtyInput = $scope.ProfileForm.nik.$dirty
                
                if (!validInput && dirtyInput) {
                    $timeout.cancel(timeoutNikPromise)
                    vm.loadingNik = true;
                    timeoutNikPromise = $timeout(function() {
                        UserService
                            .validatingNik(vm.user)
                            .then(function (data) {
                                if (data.length > 0) {
                                    vm.existNik = true
                                } else {
                                    vm.existNik = false
                                }
                                vm.loadingNik = false;
                            })
                    }, 1000)
                }		
            }
			
		})
        
        vm.save = function () {
            
            $scope.ProfileForm.nik.$setDirty();
            $scope.ProfileForm.name.$setDirty();
            $scope.ProfileForm.address.$setDirty();
            $scope.ProfileForm.contact.$setDirty();
            $scope.ProfileForm.extension.$setDirty();
            
            if ($scope.ProfileForm.$valid) {
                
                UserService.update(vm.user).then(function() {
                    $scope.isEditing = !$scope.isEditing;
                    alert('Profile Anda berhasil diperbaharui');
                });
            } else {
                
            }
            
            
        }
        
        vm.cancel = function() {
            $scope.isEditing = !$scope.isEditing;
            vm.user = tempUser;
        }
        
        return vm;
    }
    
})(angular);