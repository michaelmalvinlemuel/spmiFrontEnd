(function() {
	'use strict'
	angular.module('spmiFrontEnd')
	
		.controller('ProjectController', ProjectController)
		.controller('CreateProjectController', CreateProjectController)
		.controller('UpdateProjectController', UpdateProjectController)
		.controller('NodeProjectController', NodeProjectController)
		.controller('ModalProjectController',  ModalProjectController)
	
	function Node(name, children) {
		this.name = name;
		this.open = false;
		this.children = children || [];
	}
	
	
	
	function ProjectController ($state, $timeout, projects, ProjectService) {
		var vm = this;
		vm.projects = projects;
	
		vm.detail = function (id) {
			$state.go('main.admin.project.update', {projectId: id})
		};
	
		vm.destroy = function(id, index) {
			var alert = confirm('Apakah anda yakin ingin menghapus project ini?');
			(alert == true) ? ProjectService.destroy(id).then(function(){
				vm.projects.splice(index, 1);
			}) : null;
		};
	
		return vm;
	}
	
	
	
	function CreateProjectController ($rootScope, $scope, $state, $modal, ProjectService) {
		var vm = this;
		
		vm.input = {}
		vm.input.projects = []
		vm.input.users = []
		vm.status = {}
		vm.projects = []
		vm.ctrl = 'create'
	
		vm.addProjectMember = function(){
			var modalInstance = $modal.open({
				animate: true,
				templateUrl: 'app/admin/user/views/modal.html',
				controller: 'ModalUserController as vm',
				size: 'lg',
				resolve: {
					users: function(){ return vm.input.users },
				}
			})
	
			modalInstance.result.then(function (user) {
				vm.users = user
				vm.input.users = vm.users
			}, function(){});
		}
	
		vm.setLeader = function(object) {
			for (var i = 0 ; i < vm.users.length ; i++) {
				if (vm.users[i].id == object.id) {
					vm.users[i].leader = true;
				} else {
					vm.users[i].leader = false;
				}
			}
			vm.input.users = vm.users;
		}
	
	
		vm.pickStart = function() {
			if (vm.input.start > vm.input.ended) {
				vm.minDateEnded = vm.input.start;
				(vm.limit) ? vm.input.ended = vm.input.start : vm.input.ended = undefined;
			}
		}
	
		$scope.$watch('vm.projects', function() {
			vm.input.projects = vm.projects;
		})
	
	
		vm.submit = function() {
			vm.input.projects = vm.projects 
			vm.input.users = vm.users 
			vm.msg = []
			vm.weight = 0
			vm.leader = {}
	
			if (vm.input.users.length == 0) {
				vm.msg.push('Project ini harus terdiri dari user')
				return 0
			} else {
				var counter = 0
				for(var i = 0 ; i < vm.input.users.length ; i++) {
					if (vm.input.users[i].leader == true) {
						vm.leader = vm.input.users[i]
						break;
					}
					counter++
				}
	
				if (counter == vm.input.users.length) {
					vm.msg.push('Project ini harus memiliki Pimpro');
					return 0
				}
			}
	
			if (vm.projects.length == 0) {
				vm.msg.push('Project ini harus memiliki pekerjaan')
				return 0
			}
	
			var recursiveNode = function recursiveNode(nodes) {
				for (var i = 0 ; i < nodes.length ; i++) {
					if (nodes[i].children.length > 0) {
						nodes[i].delegations = []
						nodes[i].delegations.push(vm.leader)
						recursiveNode(nodes[i].children)
	
					} else {
						if (nodes[i].forms) {
							if (nodes[i].forms.length == 0) {
								vm.msg.push('Project ' + nodes[i].header + ' harus memiliki minimal satu form')
								return 0;
							} else {
								if (nodes[i].weight) {
									nodes[i].delegations = []
									nodes[i].delegations.push(vm.leader)
									vm.weight += nodes[i].weight
								} else {
									vm.msg.push('Project ' + nodes[i].header + ' harus ditentukan bobot pekerjaan')
									return 0;
								}
							}
						} else {
							vm.msg.push('Project ' + nodes[i].header + ' harus memiliki child atau form')
							return 0;
						}
					}
				}
			}
	
			if(recursiveNode(vm.projects) == 0) {
				return 0;
			};
	
			if (vm.weight !== 100) {
				vm.msg.push('Bobot project ini tidak sama dengan 100 (' + vm.weight + ')')
				return 0;
			}
	
	
			ProjectService.store(vm.input).then(function() {
				$state.go('main.admin.project', null, {reload: true});
			}, function(){});
			
		}
		
		vm.today = function() {
			vm.input.start = new Date();
		}
	
		vm.toggleMin = function() {
			vm.minDate = vm.minDate ? null : new Date();
		};
	
		vm.openStart = function($event) {
			vm.status.openedStart = true;
		};
	
		vm.openEnded = function($event) {
			vm.status.openedEnded = true;
		};
	
		vm.dateOptions = {
			formatYear: 'yy',
			startingDay: 1
		};
	
		vm.statusStart = {
			openedStart: false
		};
	
		vm.statusEnded = {
			openedEnded: false
		};
		
		
		return vm;
		
	}
	
	function NodeProjectController($rootScope, $scope, $modal){
			
		$scope.create = function(nodes){
			var modalInstance = $modal.open({
					animation: true,
					templateUrl: 'app/admin/project/views/modal.html',
					controller: 'ModalProjectController',
					resolve: {
						project: null,
					}
				})
	
				modalInstance.result.then(function (project) {
					$rootScope.pushIfUnique(nodes, project)
				}, function(){})
		};
	
		$scope.update = function(index, nodes){
			var modalInstance = $modal.open({
					animation: true,
					templateUrl: 'app/admin/project/views/modal.html',
					controller: 'ModalProjectController',
					resolve: {
						project: nodes[index-1],
					}
				})
				
				modalInstance.result.then(function(project){
					nodes[index-1].header = project.header;
					nodes[index-1].description = project.description
				}, function(){})
		};
	
		$scope.delete = function(index, nodes){
			var alert = confirm('Apakah Anda yakin ingin menghapus butir ini?');
			(alert == true) ? nodes.splice(index - 1, 1) : null;
		};
	
		$scope.createNodeForm = function(node) {
			node.forms = []
		};
	
		$scope.deleteNodeForm = function(node) {
			var alert = confirm('Apakah anda yakin ingin meghapus Formulir ini?')
			if (alert == true) {
				delete node.forms
				delete node.weight
			}
		}
	

		$scope.createNodeFormItem = function (node) {
			var modalInstance = $modal.open({
				animation: true,
				templateUrl: 'app/admin/form/views/modal.html',
				controller: 'CreateModalFormController as vm',
			})

			modalInstance.result.then(function(form){
				$rootScope.pushIfUnique(node.forms, form)
			}, function(){})
		};
	
		$scope.updateNodeFormItem = function(index, forms, node) {

			var modalInstance = $modal.open({
				animation: true,
				templateUrl: 'app/admin/form/views/modal.html',
				controller: 'UpdateModalFormController as vm',
				resolve: {
					form: forms[index],
				}
			})

			modalInstance.result.then(function(form){
				if ($rootScope.findObject(node.forms, form) == -1) {
					node.forms[index] = form
				} else {
					alert('Formulir ini sudah bagian dari pekerjaan')
				}
			}, function(){})
		}
	
		$scope.deleteNodeFormItem = function(index, forms) {
			var alert = confirm('Apakah anda yakin ingin menghapus form ini?');
			if (alert == true) {
				forms.splice(index, 1)
			}
		}
	}
	
	function UpdateProjectController ($rootScope, $scope, $state, $modal, $timeout, projects, ProjectService) {
		var vm = this;
		
		vm.input = projects
		vm.status = {}
		vm.projects = vm.input.projects
		vm.users = vm.input.users;	
		
		vm.input.start = new Date(vm.input.date_start);
		vm.input.ended = new Date(vm.input.date_ended);
		
		for (var i = 0 ; i < vm.input.users.length ; i++){
			delete vm.input.users[i].pivot;
			vm.input.users[i].check = true;	
		}
		
		vm.addProjectMember = function(){
			var modalInstance = $modal.open({
				animate: true,
				templateUrl: 'app/admin/user/views/modal.html',
				controller: 'ModalUserController as vm',
				size: 'lg',
				resolve: {
					users: function(){ return vm.input.users },
				}
			})
	
			modalInstance.result.then(function (user) {
				vm.users = user
				vm.input.users = vm.users
			}, function(){});
		}
	
		vm.setLeader = function(object) {
			for (var i = 0 ; i < vm.users.length ; i++) {
				if (vm.users[i].id == object.id) {
					vm.users[i].leader = true;
				} else {
					vm.users[i].leader = false;
				}
			}
			vm.input.users = vm.users;
		}
	
	
		vm.pickStart = function() {
			if (vm.input.start > vm.input.ended) {
				vm.minDateEnded = vm.input.start;
				(vm.limit) ? vm.input.ended = vm.input.start : vm.input.ended = undefined;
			}
		}
	
		$scope.$watch('vm.projects', function() {
			vm.input.projects = vm.projects;
		})
		
	
	
		vm.submit = function() {
			vm.input.projects = vm.projects 
			vm.input.users = vm.users 
			vm.msg = []
			vm.weight = 0
			vm.leader = {}
	
			if (vm.input.users.length == 0) {
				vm.msg.push('Project ini harus terdiri dari user')
				return 0
			} else {
				var counter = 0
				for(var i = 0 ; i < vm.input.users.length ; i++) {
					if (vm.input.users[i].leader == true) {
						vm.leader = vm.input.users[i]
						break;
					}
					counter++
				}
	
				if (counter == vm.input.users.length) {
					vm.msg.push('Project ini harus memiliki Pimpro');
					return 0
				}
			}
	
			if (vm.projects.length == 0) {
				vm.msg.push('Project ini harus memiliki pekerjaan');
				return 0;
			};
	
			var recursiveNode = function recursiveNode(nodes) {
				for (var i = 0 ; i < nodes.length ; i++) {
	
					
					if (nodes[i].children.length > 0) {
						var counter = 0;
						for(var j = 0 ; j < nodes[i].delegations.length ; j++) {
							if (nodes[i].delegations[j].id == vm.leader.id) {
								break;
							}
							counter++;
						}
						if (counter == nodes[i].delegations.length) {
							nodes[i].delegations.push(vm.leader);
						}
	
						recursiveNode(nodes[i].children);
	
					} else {
						if (nodes[i].forms) {
							if (nodes[i].forms.length == 0) {
								vm.msg.push('Project ' + nodes[i].header + ' harus memiliki minimal satu form');
								return 0;
							} else {
								if (nodes[i].weight) {
									vm.weight += nodes[i].weight
									var counter = 0
									for(var j = 0 ; j < nodes[i].delegations.length ; j++) {
										if (nodes[i].delegations[j].id == vm.leader.id) {
											break;
										}
										counter++
									}
									if (counter == nodes[i].delegations.length) {
										nodes[i].delegations.push(vm.leader)
									}
	
								} else {
									vm.msg.push('Project ' + nodes[i].header + ' harus ditentukan bobot pekerjaan')
									return 0;
								}
							}
						} else {
							vm.msg.push('Project ' + nodes[i].header + ' harus memiliki child atau form')
							return 0
						}
					}
				}
			};
	
			if(recursiveNode(vm.projects) == 0) {
				return 0;
			};
	
			if (vm.weight !== 100) {
				vm.msg.push('Bobot project ini tidak sama dengan 100 (' + vm.weight + ')')
				return 0
			}
	
			ProjectService.update(vm.input).then(function(){
				$state.go('main.admin.project', null, {reload: true})
			}, function(){})
		};
	
		vm.today = function() {
			vm.input.start = new Date();
		}
	
		vm.toggleMin = function() {
			vm.minDate = vm.minDate ? null : new Date();
		};
	
		vm.openStart = function($event) {
			vm.status.openedStart = true;
		};
	
		vm.openEnded = function($event) {
			vm.status.openedEnded = true;
		};
	
		vm.dateOptions = {
			formatYear: 'yy',
			startingDay: 1
		};
	
		vm.statusStart = {
			openedStart: false
		};
	
		vm.statusEnded = {
			openedEnded: false
		};
		
		return vm;
	}
	
	
	
	
	function ModalProjectController($scope, $timeout, $modalInstance, project, ProjectService) {
	
		$scope.input = project

		$scope.submit = function () {
			
			$scope.ModalProjectForm.header.$setDirty()
			$scope.ModalProjectForm.description.$setDirty()

			if ($scope.ModalProjectForm.$valid) {
				if ($scope.input.children) {
					$modalInstance.close($scope.input)
				} else {
					$scope.input.open = false,
					$scope.input.children = []
					$scope.input.delegations = []
					$modalInstance.close($scope.input)
				}
				
			} else {
				$scope.validated = true;
			}
		};
	
		$scope.close = function () {
			$modalInstance.dismiss('cancel');
		}
	}

})();


