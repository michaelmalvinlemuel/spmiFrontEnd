(function(angular) {
	
	'use strict';
	
	angular.module('spmiFrontEnd')
		.controller('UserUpdateProjectController', UserUpdateProjectController)
		
	function UserUpdateProjectController($scope, $controller, $state, $modal, $window, projects, ProjectService, ProjectConverterService, CURRENT_USER) {
		
		var vm = this;
		vm.input = projects;

		angular.extend(vm, $controller('UpdateProjectController', {$scope: $scope, projects: projects}))
		
		
		
		vm.addProjectMember = function() {

			var modalInstance = $modal.open({
				animate: true,
				templateUrl: 'app/admin/user/views/modal.html',
				controller: 'ModalUserController as vm',
				size: 'lg',
				resolve: {
					users: function(){ 
						return vm.input.users 
					},
				}
			})
	
			modalInstance.result.then(function (users) {
				vm.input.users = []
				var counter = 0
				for(var i = 0; i < users.length; i++) {
					if (users[i].id == CURRENT_USER.id) {
						users[i].check = true;
						users[i].leader = true;
					} else {
						counter++;
					}
					vm.input.users.push(users[i])
				}
				
				if (counter == users.length) {
					var user
					user = CURRENT_USER;
					user.check = true;
					user.leader = true;
					vm.input.users.push(user);
				}
				
			}, function() {
			
			});
		}
		
		return vm;
	}
	
})(angular);