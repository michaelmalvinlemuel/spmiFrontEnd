(function () {

	angular
		.module('spmiFrontEnd')
		.controller('UserProjectController', UserProjectController)
		.controller('DetailUserProjectController', ['$state', 'project', '$timeout', '$modal', 'CURRENT_USER', 'ProjectService', DetailUserProjectController])
		.controller('NodeUserProjectController', NodeUserProjectController)
		.controller('ModalDetailUserProjectController', ModalDetailUserProjectController)
		.controller('FormDetailUserProjectController', FormDetailUserProjectController)

	
	function UserProjectController($state, projects, ProjectService) {
		var vm = this;
		vm.projects = projects;
	
		vm.detail = function (request) {
			$state.go('main.user.project.detail', {projectId: request})
		}
		
		return vm;
	
	}
	
	function DetailUserProjectController($state, project, $timeout, $modal, CURRENT_USER, ProjectService) {
		//console.log(project);
	
		var vm = this;
		vm.input = project;
	
		vm.status = {}
		vm.project_id = {}
		
		vm.input.start = new Date(vm.input.date_start);
		vm.input.ended = new Date(vm.input.date_ended);
		
		
		
		var recursiveChecking = function(node) {
			for (var i = 0 ; i < node.length ; i++) {
				if (node[i].children.length > 0) {
					recursiveChecking(node[i].children)
				} else {
					for(var j = 0 ; j < node[i].forms.length ; j++) {
						if(node[i].forms[j].uploads) {
							var time = new Date(node[i].forms[j].uploads.created_at)
							time.addHours(7)
							
							node[i].forms[j].uploads.created_at = time
						}
					}
					
					for(var j = 0 ; j < node[i].delegations.length ; j++) {
						if(node[i].delegations[j].id == ProjectService.userId) {
							node[i].isDelegate = true
							break
						}
					}
				}
			}
		}
		
		recursiveChecking(vm.input.projects)
		
		
		
		
	
	
		vm.submit = function() {

			ProjectService.update(vm.input).then(function() {
				$state.go('main.user.project', null, {reload: true})
			}, function () {})
		}
	
		return vm;
	}
	
	
	function NodeUserProjectController($scope, $state, $modal, ProjectService, CURRENT_USER) {
		
		if ( typeof $scope.users !== "undefined" ) {
			for ( var i = 0; i < $scope.users.length; i++ ) {
				if ( $scope.users[i].leader === true ) {
					$scope.isLeader = $scope.users[i].id;
					break;
				}
			}
		}

		
		if ($scope.isLeader === CURRENT_USER.id) {
			$scope.isLeaderLocal = true ;
		} else {
			 $scope.isLeaderLocal = false;
		}
	
		
		if(typeof $scope.node !== "undefined") {
			if (typeof $scope.node.delegations !== "undefined") {
				var counter = 0;
				for ( var i = 0; i < $scope.node.delegations.length; i++ ){
					if( CURRENT_USER.id === $scope.node.delegations[i].id ) {
						$scope.isDelegate = true;
						break;
					}
					counter++;
				}
				
				if ( counter === $scope.node.delegations.length ) {
					$scope.isDelegate = false;
				}
			}
		}
		
	
	
		$scope.delegateNode = function(node) {
			var projectId = node.id; //get project node id to send after delegations
			
			var modalInstance = $modal.open({
				animate: true,
				templateUrl: 'app/admin/user/views/modal.html',
				controller: 'ModalDetailUserProjectController as vm',
				size: 'lg',
				resolve: {
					users: function() {
						return $scope.users;
					},
					delegations: function () {
						return node.delegations
					}
				}
			});

			modalInstance.result.then(function (result) {
				var data = {
					project_id: projectId,
					delegations: result.users,
					inherit: result.inherit,
				}
				
				console.log(result.inherit);
				
				ProjectService.delegate(data).then(function(data) {
					node.delegations = result.users;
					alert('Project Ini berhasil didelegasikan')
				}, function() {})
				
			}, function () {})
		
		}
		
		$scope.detailForm = function(formId){
			$state.go('main.user.project.detail.form', {formId: formId})
		}
	}
	
	
	
	function ModalDetailUserProjectController($timeout, $modalInstance, users, delegations) {
		
		var vm = this;
		vm.useInherit = true	//configuration for allows inherit delegation
		vm.leader = {}			//leader for this project
		vm.users = [] 			//all users that colaborate on this project
		vm.delegations = [] 	//users that already delegate before on this project node
		vm.input = {}			//variable for return from this modal
		
		//check inheritance configuration is undefined or defined
		if (vm.inherit) {
			vm.inherit = true;
		} else {
			vm.inherit = false;
		}
		
		//remove leader form users and delegations so he/she cannot be undelegetae
		for (var i = 0; i < users.length; i++ ) {
			if ( users[i].leader == true ) {
				vm.leader = users[i];		
			} else {
				vm.users.push(users[i]);
			}
		}
		
		for (var i = 0; i < delegations.length; i++ ) {
			if ( delegations[i].id !== vm.leader.id ) {
				vm.delegations.push(delegations[i]);	
			}
		}
		
		
		//check users if already delegate
		for (var i = 0 ; i < vm.users.length; i++ ) {
			for ( var j = 0; j < vm.delegations.length; j++ ) {
				if ( vm.users[i].id == vm.delegations[j].id ) {
					vm.users[i].check = true;
				}
			}
		}
		
		
		
		//set default message when popup shows
		vm.selected = vm.delegations.length + ' user selected from ' + vm.users.length
		
	
		vm.checkAll = function() {
			if (vm.checked) {
				for ( var i = 0 ; i < vm.users.length; i++ ) {
					vm.users[i].check = true;
				}
				vm.selected = vm.users.length + ' user selected from ' + vm.users.length
			} else {
				for ( var i = 0 ; i < vm.users.length; i++ ) {
					vm.users[i].check = false;
				}
				vm.selected = 0 + ' user selected from ' + vm.users.length
			}
			
	
			
		}
	
		vm.checkCustom = function() {
			//if all users is selected global check turn true
			var counter = 0;
			for ( var i = 0; i < vm.users.length; i++ ) {
				if ( vm.users[i].check == true ) {
					counter++;
				}
			}
			
			if ( counter == vm.users.length ) {
				vm.checked = true;
			} else {
				vm.checked = false;
			}
			
			vm.selected = counter + ' user selected from ' + vm.users.length
		}
	
		vm.submit = function () {
			vm.input = {}
			vm.input.users = []
			
			vm.input.inherit = vm.inherit;	//return inheritance configuration
			vm.input.users.push(vm.leader); //push leader back to project
			
			//push all checked users on list;
			for ( var i = 0; i < vm.users.length; i++ ) {
				if ( vm.users[i].check == true ) {
					vm.input.users.push(vm.users[i]);
				}
			}
			
			//refresh modal variable
			vm.leader = {}			
			vm.users = [] 			
			vm.delegations = [] 	
			//vm.input = {}			
		
			$modalInstance.close(vm.input)
		}
	
		vm.close = function () {
			$modalInstance.dismiss('cancel');
		}
		
		vm.checkCustom(); //check if all users is delegate for set global check
	
		return vm;
	}
	
	function FormDetailUserProjectController($scope, $state, $timeout, form, project, CURRENT_USER, ProjectService) {
		console.log(form)
		console.log(project)
		
		var vm = this;
		
		
		vm.form = form;
		vm.project = project
		vm.leader = project.leader
		
		for (var i = 0 ; i < vm.form.uploads.length ; i++) {
			console.log(vm.form.uploads[i])
			
			var time = new Date(vm.form.uploads[i].created_at)
			time.addHours(7)
			vm.form.uploads[i].created_at = time
		}
		
		vm.sortField = 'created_at';
		vm.reverse = true;
		
		
	
		
		vm.upload = function() {
			
			vm.input.user_id = CURRENT_USER.id;
			vm.input.project_form_item_id = vm.form.form_id
			
			
			
			ProjectService.upload(vm.input).then(function(data) {
					alert('Upload Success');
					vm.form.uploads.push(data);
				}, function() {
					
				})
			
		}
		

		return vm;
	}
})()



