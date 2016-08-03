(function(angular) {
    
    'use strict';
    
    angular.module('spmiFrontEnd')
        .controller('ModalUserAssignmentController', ModalUserAssignmentController)
        
    function ModalUserAssignmentController($modalInstance, users, preSelectedUsers) {
        
        var vm = this;
        
        vm.users = users;
        

        if (preSelectedUsers && users) {
            for(var i = 0; i < preSelectedUsers.length; i++) {
                for(var j = 0; j < vm.users.length; j++) {
                    if (preSelectedUsers[i].user.id == vm.users[j].id) {
                        vm.users[j].check = true;
                    }
                }
            }
            
            if (vm.users.length == preSelectedUsers.length) {
                vm.checked = true;
            } else {
                vm.checked = false;
            }

            var postSelectedUsers = [];
            for (var i = 0; i < vm.users.length; i++) {
                if (vm.users[i].check == true) {
                    postSelectedUsers.push(vm.users[i]);
                }
            }

            
            vm.selected = postSelectedUsers.length + ' user selected from ' + vm.users.length;
        }
        
        vm.checkCustom = function() {
            vm.checked = false;
            var counter = 0
			
			for (var i = 0 ; i < vm.users.length ; i ++) {
				if (vm.users[i].check == true) {
					counter++;
				}
			}
            
	
			vm.selected = counter + ' user selected from ' + vm.users.length
        }
        
        vm.checkAll = function() {
            var counter = 0;
            if (vm.checked) {
                for (var i = 0; i < vm.users.length; i++) {
                    vm.users[i].check = true;
                    counter++;
                }
            } else {
                for (var i = 0; i < vm.users.length; i++) {
                    vm.users[i].check = false;
                    //counter++;
                }
            }
            
            
            vm.selected = counter + ' user selected from ' + vm.users.length;
        }
        
        vm.submit = function() {
           
            var postSelectedUsers = [];

            for (var i = 0; i < vm.users.length; i++) {
                if (vm.users[i].check == true) {
                    postSelectedUsers.push(vm.users[i]);
                }
            }
            $modalInstance.close(postSelectedUsers);
        }
        
        vm.close = function() {
            $modalInstance.dismiss('cancel');
        }
        return vm;
    }
    
})(angular);