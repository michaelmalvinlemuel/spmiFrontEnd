(function() {

	angular
		.module('spmiFrontEnd')
		.controller('ProjectController', ['$scope', '$state', '$timeout', 'ProjectService', ProjectController])
		.controller('CreateProjectController', ['$rootScope', '$scope', '$state', '$stateParams', '$modal', '$timeout', 'ProjectService', CreateProjectController])
		.controller('UpdateProjectController', ['$rootScope', '$scope', '$state', '$stateParams', '$modal', '$timeout', 'ProjectService', UpdateProjectController])
		.controller('ModalUserProjectController', ['$scope', '$timeout', '$modalInstance', 'user', 'UserService', ModalUserProjectController])
		.controller('ModalProjectController', ['$scope', '$timeout', '$modalInstance', 'project', 'ProjectService', ModalProjectController])

		
})();

function Node(name, children) {
    this.name = name;
    this.open = false;
    this.children = children || [];
}




function ProjectController ($scope, $state, $timeout, ProjectService) {
	$scope.listprojects = []

	$scope.load = function() {
		ProjectService.flushNode

		$scope.listprojects = []

		ProjectService
			.get()
			.then(function(response) {
				$scope.listprojects = response;
			})
	};

	$scope.detail = function (request) {
		//alert(request)
		$state.go('main.admin.project.update', {projectId: request})
	};

	$scope.destroy = function(request) {
		var alert = confirm('Apakah anda yakin ingin menghapus project ini?');
		if (alert == true) {
			ProjectService
				.destroy({id: request})
				.then(function() {
					$scope.load();
				})
		};
	};

	$scope.load();
}



function CreateProjectController ($rootScope, $scope, $state, $stateParams, $modal, $timeout, ProjectService) {

	$scope.input = {}
	$scope.input.projects = []
	$scope.input.users = []

	$scope.status = {}

	$scope.projects = []

	$scope.users = []

	$scope.ctrl = 'create'

	$scope.load = function() {

		$scope.minDateStart = new Date();

		ProjectService.flushNode()



		ProjectService.setCreateNode(function(nodes) {

			var modalInstance = $modal.open({
	      		animation: true,
	      		templateUrl: 'app/admin/project/views/modal.html',
	      		controller: 'ModalProjectController',
	      		resolve: {
	        		project: function () {
	          			return undefined;
	        		}
	      		}
	    	})

	    	modalInstance.result.then(function (project) {
	    		$rootScope.pushIfUnique(nodes, project)
	    		//nodes.push({name: 'a', open: false, children: []})
	      		
	    	}, function () {
	      		//$log.info('Modal dismissed at: ' + new Date());
	    	})
		})

		ProjectService.setUpdateNode(function(index, nodes) {

			var modalInstance = $modal.open({
				animation: true,
				templateUrl: 'app/admin/project/views/modal.html',
				controller: 'ModalProjectController',
				resolve: {
					project: function () {
						return nodes;
					}
				}
			})

			modalInstance.result.then(function (project) {
				nodes[index].header = project.header;
				nodes[index].description = project.description
			}, function () {

			})
		})

		ProjectService.setDeleteNode(function() {
			var alert = confirm('Apakah Anda yakin ingin menghapus butir ini?')
			return alert
		})



		ProjectService.setCreateNodeForm(function (node) {
			node.forms = []
		})

		ProjectService.setDeleteNodeForm(function (node) {
			var alert = confirm('Apakah anda yakin ingin meghapus Formulir ini?')
			if (alert == true) {
				delete node.forms
				delete node.weight
			}
		})



		ProjectService.setCreateNodeFormItem(function (node) {
			//node.forms.push({form: 'DummyForm', user: 'DummyUser'})
			var modalInstance = $modal.open({
				animation: true,
				templateUrl: 'app/admin/form/views/modal.html',
				controller: 'CreateModalFormController',
				resolve: {
					forms: function() {
						return node
					}
				}
			})

			modalInstance.result.then(function (forms) {
				$rootScope.pushIfUnique(node.forms, forms.form)

			}, function() {

			})
		})

		ProjectService.setUpdateNodeFormItem(function (index, forms, node) {
			$scope.tmp = []
			$scope.tmp.form = forms[index]

			var modalInstance = $modal.open({
				animation: true,
				templateUrl: 'app/admin/form/views/modal.html',
				controller: 'UpdateModalFormController',
				resolve: {
					forms: function() {
						return $scope.tmp
					}
				}
			})

			modalInstance.result.then(function (forms) {
				console.log(forms)
				if ($rootScope.findObject(node.forms, forms.form) == -1) {
	    			node.forms[index] = forms.form
	    		} else {
	    			alert('Formulir ini sudah bagian dari pekerjaan')
	    		}
			}, function() {

			})
		})

		ProjectService.setDeleteNodeFormItem(function(index, forms) {
			var alert = confirm('Apakah anda yakin ingin menghapus form ini?');
			if (alert == true) {
				forms.splice(index, 1)
			}
		});
	}

	$scope.addProjectMember = function() {

		var modalInstance = $modal.open({
			animate: true,
			templateUrl: 'app/admin/user/views/modal.html',
			controller: 'ModalUserProjectController',
			size: 'lg',
			resolve: {
				user: function () {
					return $scope.users
				}
			}
		})

		modalInstance.result.then(function (user) {
			console.log(user)
			$scope.users = user
			$scope.input.users = $scope.users
		}, function () {

		});
	}



	$scope.create = function (nodes) {

		ProjectService.createNode(nodes)
	};

	$scope.update = function (index, nodes) {
		ProjectService.updateNode(index, nodes[index - 1]);
	};

	$scope.delete = function (index, nodes) {
		if(ProjectService.deleteNode()) {
			nodes.splice(index - 1, 1);
		}
	};



	$scope.createNodeForm = function(node) {
		ProjectService.createNodeForm(node)
	};

	$scope.deleteNodeForm = function(node) {
		ProjectService.deleteNodeForm(node);
	}



	$scope.createNodeFormItem = function (node) {
		ProjectService.createNodeFormItem(node)
	};

	$scope.updateNodeFormItem = function(index, forms, node) {
		ProjectService.updateNodeFormItem(index, forms, node);
	}

	$scope.deleteNodeFormItem = function(index, forms) {
		ProjectService.deleteNodeFormItem(index, forms);
	}



	$scope.setLeader = function(object) {
		for (var i = 0 ; i < $scope.users.length ; i++) {
			if ($scope.users[i].id == object.id) {
				$scope.users[i].leader = true;
			} else {
				$scope.users[i].leader = false;
			}
		}
		$scope.input.users = $scope.users;
	}

	$scope.today = function() {
		$scope.input.start = new Date();
		//$scope.input.ended = new Date();
	}

  	$scope.toggleMin = function() {
    	$scope.minDate = $scope.minDate ? null : new Date();
  	};

  	$scope.openStart = function($event) {
    	$scope.status.openedStart = true;
  	};

  	$scope.openEnded = function($event) {
    	$scope.status.openedEnded = true;
  	};

  	$scope.dateOptions = {
    	formatYear: 'yy',
    	startingDay: 1
  	};

  	$scope.statusStart = {
    	openedStart: false
  	};

  	$scope.statusEnded = {
    	openedEnded: false
  	};

  	$scope.pickStart = function() {
		if ($scope.input.start > $scope.input.ended) {
			$scope.minDateEnded = $scope.input.start
			if ($scope.limit) {
				$scope.input.ended = $scope.input.start;
			} else {
				$scope.input.ended = undefined;
			}
			
		}
	}

	$scope.$watch('projects', function() {
		$scope.input.projects = $scope.projects;
	})


	$scope.submit = function() {
		$scope.input.projects = $scope.projects 
		$scope.input.users = $scope.users 
		$scope.msg = []
		$scope.weight = 0
		$scope.leader = {}

		if ($scope.input.users.length == 0) {
			$scope.msg.push('Project ini harus terdiri dari user')
			return 0
		} else {
			var counter = 0
			for(var i = 0 ; i < $scope.input.users.length ; i++) {
				if ($scope.input.users[i].leader == true) {
					$scope.leader = $scope.input.users[i]
					break;
				}
				counter++
			}

			if (counter == $scope.input.users.length) {
				$scope.msg.push('Project ini harus memiliki Pimpro');
				return 0
			}
		}

		if ($scope.projects.length == 0) {
			$scope.msg.push('Project ini harus memiliki pekerjaan')
			return 0
		}

		var recursiveNode = function recursiveNode(nodes) {
			for (var i = 0 ; i < nodes.length ; i++) {
				if (nodes[i].children.length > 0) {
					nodes[i].delegations = []
					nodes[i].delegations.push($scope.leader)
					recursiveNode(nodes[i].children)

				} else {
					if (nodes[i].forms) {
						if (nodes[i].forms.length == 0) {
							$scope.msg.push('Project ' + nodes[i].header + ' harus memiliki minimal satu form')
							return 0;
						} else {
							if (nodes[i].weight) {
								nodes[i].delegations = []
								nodes[i].delegations.push($scope.leader)
								$scope.weight += nodes[i].weight
							} else {
								$scope.msg.push('Project ' + nodes[i].header + ' harus ditentukan bobot pekerjaan')
								return 0;
							}
						}
					} else {
						$scope.msg.push('Project ' + nodes[i].header + ' harus memiliki child atau form')
						return 0;
					}
				}
			}
		}

		if(recursiveNode($scope.projects) == 0) {
			return 0;
		};

		if ($scope.weight !== 100) {
			$scope.msg.push('Bobot project ini tidak sama dengan 100 (' + $scope.weight + ')')
			return 0;
		}

		console.log($scope.input)
		
		ProjectService
			.store($scope.input)
			.then(function() {
				$state.go('main.admin.project');
			}, function () {

			});
		
	}
	
	$scope.load();
}

function UpdateProjectController ($rootScope, $scope, $state, $stateParams, $modal, $timeout, ProjectService) {
	$scope.input = {}
	$scope.input.projects = []
	$scope.input.users = []

	$scope.status = {}

	$scope.projects = []

	$scope.users = []

	$scope.ctrl = 'update'

	$scope.load = function() {

		$scope.minDateStart = new Date();

		ProjectService.flushNode()



		ProjectService.setCreateNode(function(nodes) {

			var modalInstance = $modal.open({
	      		animation: true,
	      		templateUrl: 'app/admin/project/views/modal.html',
	      		controller: 'ModalProjectController',
	      		resolve: {
	        		project: function () {
	          			return undefined;
	        		}
	      		}
	    	})

	    	modalInstance.result.then(function (project) {
	    		$rootScope.pushIfUnique(nodes, project)
	    		//nodes.push({name: 'a', open: false, children: []})
	      		
	    	}, function () {
	      		//$log.info('Modal dismissed at: ' + new Date());
	    	})
		})

		ProjectService.setUpdateNode(function(index, nodes) {

			var modalInstance = $modal.open({
				animation: true,
				templateUrl: 'app/admin/project/views/modal.html',
				controller: 'ModalProjectController',
				resolve: {
					project: function () {
						return nodes;
					}
				}
			})

			modalInstance.result.then(function (project) {
				nodes[index].header = project.header;
				nodes[index].description = project.description
			}, function () {

			})
		})


		ProjectService.setDeleteNode(function() {
			var alert = confirm('Apakah Anda yakin ingin menghapus butir ini?')
			return alert
		})



		ProjectService.setCreateNodeForm(function (node) {
			node.forms = []
		})

		ProjectService.setDeleteNodeForm(function (node) {
			var alert = confirm('Apakah anda yakin ingin meghapus Formulir ini?')
			if (alert == true) {
				//node.children = []
				delete node.forms
				delete node.weight
				
			}
		})

		//console.log(ProjectService.deleteNodeForm(undefined));



		ProjectService.setCreateNodeFormItem(function (node) {
			//node.forms.push({form: 'DummyForm', user: 'DummyUser'})
			var modalInstance = $modal.open({
				animation: true,
				templateUrl: 'app/admin/form/views/modal.html',
				controller: 'CreateModalFormController',
				resolve: {
					forms: function() {
						return node
					}
				}
			})

			modalInstance.result.then(function (forms) {
				$rootScope.pushIfUnique(node.forms, forms.form)

			}, function() {

			})
		})

		ProjectService.setUpdateNodeFormItem(function (index, forms, node) {
			
			$scope.form = {}
			$scope.form.form = node.forms[index]
			
			$scope.tmp = $scope.form.form.project_form_item_id

			delete $scope.form.form.uploads
			delete $scope.form.form.project_form_item_id
			//console.log($scope.form)
			
			var modalInstance = $modal.open({
				animation: true,
				templateUrl: 'app/admin/form/views/modal.html',
				controller: 'UpdateModalFormController',
				resolve: {
					forms: function() {
						return $scope.form
					}
				}
			})

			modalInstance.result.then(function (forms) {
				//console.log(forms)
				forms.form.project_form_item_id = $scope.tmp
				
				var counter = 0
				for (var i = 0 ; i < node.forms.length ; i++) {
					if(node.forms[i].id == forms.form.id) {
						alert('Formulir ini sudah bagian dari pekerjaan')
						break;
					}
					
					counter++;
				}
				
				if (counter == node.forms.length) {
					forms.form.uploads = []
					node.forms[index] = forms.form
				}
			}, function() {

			})
			
		})

		ProjectService.setDeleteNodeFormItem(function(index, forms) {
			var alert = confirm('Apakah anda yakin ingin menghapus form ini?');
			if (alert == true) {
				forms.splice(index, 1)
			}
		})



		ProjectService
			.show($stateParams.projectId)
			.then(function(response) {
				$scope.input = response

				$scope.input.start = new Date(response.date_start)
				$scope.input.ended = new Date(response.date_ended)

				$scope.projects = $scope.input.projects
				$scope.users = $scope.input.users

				for (var i = 0 ; i < $scope.users.length ; i++) {
					$scope.users[i].check = true
				}

			});
	}

	$scope.addProjectMember = function() {

		var modalInstance = $modal.open({
			animate: true,
			templateUrl: 'app/admin/user/views/modal.html',
			controller: 'ModalUserProjectController',
			size: 'lg',
			resolve: {
				user: function () {
					return $scope.users
				}
			}
		})

		modalInstance.result.then(function (user) {
			console.log(user)
			$scope.users = user
			$scope.input.users = $scope.users
		}, function () {

		});
	}

	$scope.create = function (nodes) {
		ProjectService.createNode(nodes);
	}

	$scope.update = function (index, nodes) {
		ProjectService.updateNode(index, nodes[index - 1]);
	}

	$scope.delete = function (index, nodes) {
		if(ProjectService.deleteNode()) {
			nodes.splice(index - 1, 1);
		}
	}



	$scope.createNodeForm = function(node) {
		ProjectService.createNodeForm(node);
	}

	$scope.deleteNodeForm = function(node) {
		ProjectService.deleteNodeForm(node);
	}



	$scope.createNodeFormItem = function (node) {
		ProjectService.createNodeFormItem(node);
	}

	$scope.updateNodeFormItem = function(index, forms, node) {
		ProjectService.updateNodeFormItem(index, forms, node);
	}

	$scope.deleteNodeFormItem = function(index, forms) {
		ProjectService.deleteNodeFormItem(index, forms);
	}



	$scope.setLeader = function(object) {
		for (var i = 0 ; i < $scope.users.length ; i++) {
			if ($scope.users[i].id == object.id) {
				$scope.users[i].leader = true;
			} else {
				$scope.users[i].leader = false;
			}
		}
		$scope.input.users = $scope.users;
	}

	$scope.today = function() {
		$scope.input.start = new Date();
		//$scope.input.ended = new Date();
	}

  	$scope.toggleMin = function() {
    	$scope.minDate = $scope.minDate ? null : new Date();
  	};

  	$scope.openStart = function($event) {
    	$scope.status.openedStart = true;
  	};

  	$scope.openEnded = function($event) {
    	$scope.status.openedEnded = true;
  	};

  	$scope.dateOptions = {
    	formatYear: 'yy',
    	startingDay: 1
  	};

  	$scope.statusStart = {
    	openedStart: false
  	};

  	$scope.statusEnded = {
    	openedEnded: false
  	};

  	$scope.pickStart = function() {
		if ($scope.input.start > $scope.input.ended) {
			$scope.minDateEnded = $scope.input.start;
			if ($scope.limit) {
				$scope.input.ended = $scope.input.start;
			} else {
				$scope.input.ended = undefined;
			}
			
		}
	}

	$scope.$watch('projects', function() {
		$scope.input.projects = $scope.projects
	})


	$scope.submit = function() {
		$scope.input.projects = $scope.projects 
		$scope.input.users = $scope.users 
		$scope.msg = []
		$scope.weight = 0
		$scope.leader = {}

		if ($scope.input.users.length == 0) {
			$scope.msg.push('Project ini harus terdiri dari user')
			return 0
		} else {
			var counter = 0
			for(var i = 0 ; i < $scope.input.users.length ; i++) {
				if ($scope.input.users[i].leader == true) {
					$scope.leader = $scope.input.users[i]
					break;
				}
				counter++
			}

			if (counter == $scope.input.users.length) {
				$scope.msg.push('Project ini harus memiliki Pimpro');
				return 0
			}
		}

		if ($scope.projects.length == 0) {
			$scope.msg.push('Project ini harus memiliki pekerjaan');
			return 0;
		};

		var recursiveNode = function recursiveNode(nodes) {
			for (var i = 0 ; i < nodes.length ; i++) {

				
				if (nodes[i].children.length > 0) {
					var counter = 0;
					for(var j = 0 ; j < nodes[i].delegations.length ; j++) {
						if (nodes[i].delegations[j].id == $scope.leader.id) {
							break;
						}
						counter++;
					}
					if (counter == nodes[i].delegations.length) {
						nodes[i].delegations.push($scope.leader);
					}

					recursiveNode(nodes[i].children);

				} else {
					if (nodes[i].forms) {
						if (nodes[i].forms.length == 0) {
							$scope.msg.push('Project ' + nodes[i].header + ' harus memiliki minimal satu form');
							return 0;
						} else {
							if (nodes[i].weight) {
								$scope.weight += nodes[i].weight
								var counter = 0
								for(var j = 0 ; j < nodes[i].delegations.length ; j++) {
									if (nodes[i].delegations[j].id == $scope.leader.id) {
										break;
									}
									counter++
								}
								if (counter == nodes[i].delegations.length) {
									nodes[i].delegations.push($scope.leader)
								}

							} else {
								$scope.msg.push('Project ' + nodes[i].header + ' harus ditentukan bobot pekerjaan')
								return 0;
							}
						}
					} else {
						$scope.msg.push('Project ' + nodes[i].header + ' harus memiliki child atau form')
						return 0
					}
				}
			}
		};

		if(recursiveNode($scope.projects) == 0) {
			return 0;
		};

		if ($scope.weight !== 100) {
			$scope.msg.push('Bobot project ini tidak sama dengan 100 (' + $scope.weight + ')')
			return 0
		}

		ProjectService
			.update($scope.input)
			.then(function() {
				//$state.go('main.admin.project')
			}, function () {

			})
	};

	$scope.load();
}

function ModalUserProjectController ($scope, $timeout, $modalInstance, user, UserService) {

	$scope.users = []
	$scope.input = []

	$scope.load = function() {
		$scope.userProject = user

		console.log($scope.userProject)

		UserService
			.get()
			.then(function (response) {
				$scope.users = response.data
				for (var i = 0 ; i < $scope.users.length ; i++) {
					for (var j = 0 ; j < $scope.userProject.length ; j++) {
						if ($scope.users[i].id == $scope.userProject[j].id) {
							$scope.users[i].leader = $scope.userProject[j].leader
							$scope.users[i].check = $scope.userProject[j].check
						}
					}
				}
			})
	};

	$scope.checkAll = function() {
		$scope.input = []
		var counter = 0

		for (var i = 0 ; i < $scope.users.length ; i++) {
			$scope.users[i].leader = false
			if ($scope.checked) {
				$scope.users[i].check = true
				$scope.input.push($scope.users[i])
				counter++
			} else {
				$scope.users[i].check = false
			}
		}

		$scope.selected = counter + ' user selected from ' + $scope.users.length
	};

	$scope.checkCustom = function() {
		$scope.checked = false;
		var counter = 0
		$scope.input = []

		for (var i = 0 ; i < $scope.users.length ; i ++) {
			$scope.users[i].leader = false
			if ($scope.users[i].check == true) {
				$scope.input.push($scope.users[i])
				counter++
			}
		}

		$scope.selected = counter + ' user selected from ' + $scope.users.length
	};

	$scope.submit = function () {
		$modalInstance.close($scope.input)
	};

	$scope.close = function () {
		$modalInstance.dismiss('cancel');
	}

	$scope.load();
};


function ModalProjectController($scope, $timeout, $modalInstance, project, ProjectService) {

	$scope.input = project
	//console.log($scope.input)

	$scope.submit = function () {
		
		$scope.ModalProjectForm.header.$setDirty()
		$scope.ModalProjectForm.description.$setDirty()
		//console.log($scope.input)

		if ($scope.ModalProjectForm.$valid) {
			//console.log($scope.input.children)
			if ($scope.input.children) {
				//console.log('update')
				$modalInstance.close($scope.input)

			} else {
				//console.log('insert')
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
