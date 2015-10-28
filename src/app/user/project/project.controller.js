(function () {

	angular
		.module('spmiFrontEnd')
		.controller('UserProjectController', ['$scope', '$state', '$timeout', 'ProjectService', UserProjectController])
		.controller('DetailUserProjectController', ['$scope', '$state', '$stateParams', '$timeout', '$modal', 'ProjectService', DetailUserProjectController])
		.controller('ModalDetailUserProjectController', ['$scope', '$timeout', '$modalInstance', 'member', 'user', ModalDetailUserProjectController])
		.controller('FormDetailUserProjectController', ['$scope', '$state', '$stateParams', '$timeout', 'ProjectService', FormDetailUserProjectController])

	function UserProjectController($scope, $state, $timeout, ProjectService) {
		$scope.listprojects = []
	
		$scope.load = function() {
			//ProjectService.flushNode
	
			$scope.listprojects = []
	
			ProjectService
				.user($scope.user.id)
				.then(function(response) {
					console.log(response)
					$scope.listprojects = response;
				})
		}
	
		$scope.detail = function (request) {
			$state.go('main.user.project.detail', {projectId: request})
		}
	
		$scope.load();
	}
	
	function DetailUserProjectController($scope, $state, $stateParams, $timeout, $modal, ProjectService) {
	
		$scope.input = {}
		$scope.input.projects = []
		$scope.input.users = []
	
		$scope.status = {}
	
		$scope.projects = []
	
		$scope.users = []
	
		$scope.project_id = {}
	
		$scope.load = function() {
			
			if ($scope.user) {
				ProjectService.setUserId($scope.user.id)
			}
			
			ProjectService.flushNode()
	
			ProjectService.setDelegateNode(function(node) {
	
				$scope.project_id = node.id
	
				var modalInstance = $modal.open({
					animate: true,
					templateUrl: 'app/admin/user/views/modal.html',
					controller: 'ModalDetailUserProjectController',
					size: 'lg',
					resolve: {
						member: function() {
							return $scope.users
						},
						user: function () {
							return node.delegations
						}
					}
				})
	
				modalInstance.result.then(function (user) {
					node.delegations = user
	
					$scope.userMember = {}
					$scope.userMember.project_id = $scope.project_id
					$scope.userMember.delegations = user
					//console.log($scope.user);
	
					
					ProjectService
						.delegate($scope.userMember)
						.then(function() {
							alert('Project Ini berhasil didelegasikan')
						}, function() {
	
						})
					
				}, function () {
	
				})
			})
	
			ProjectService.setDetailForm(function (formId) {
				$state.go('main.user.project.detail.form', {formId: formId})
			})
	
			ProjectService
				.showLast($stateParams.projectId)
				.then(function(response) {
					$scope.input = response
					
					//$scope.input.user_id = $scope.user.id
					
					$scope.input.start = new Date(response.date_start)
					$scope.input.ended = new Date(response.date_ended)
	
					$scope.projects = $scope.input.projects
					
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
					
					recursiveChecking($scope.projects)
					
					$scope.users = $scope.input.users
					
					$scope.isLeader = false
					
					for (var i = 0 ; i < $scope.users.length ; i++) {
						$scope.users[i].check = false
						
						if ($scope.users[i].id == ProjectService.userId && $scope.users[i].leader == true) {
							$scope.isLeader = true
							$scope.leaderId = $scope.users[i].id
						}
					}
	
				})
		}
	
	
		$scope.$watch('projects', function() {
			$scope.input.projects = $scope.projects
		})
	
		$scope.delegateNode = function(node) {
			ProjectService.delegateNode(node)
		}
	
		$scope.detailForm = function(projectId, formId) {
			ProjectService.detailForm(projectId, formId)
		} 
	
	
		$scope.submit = function() {
			$scope.input.projects = $scope.projects 
			$scope.input.users = $scope.users 
			$scope.msg = []
			$scope.weight = 0
	
			ProjectService
				.update($scope.input)
				.then(function() {
					$state.go('main.admin.project')
				}, function () {
	
				})
		}
	
		$scope.load();
	}
	
	function ModalDetailUserProjectController($scope, $timeout, $modalInstance, member, user) {
		
		$scope.users = []
		$scope.input = []
		$scope.members = member 
		$scope.delegations = user
		$scope.leader = {}
	
		$scope.load = function() {
			//console.log($scope.delegations)
			for (var i = 0 ; i < $scope.members.length ; i++) {
				if ($scope.members[i].leader == false) {
	
					var counter = 0
					for (var j = 0 ; j < $scope.delegations.length ; j++) {
						if ($scope.members[i].id == $scope.delegations[j].id) {
							$scope.members[i].check = true
							break;
						}
						counter++
						
					}
	
					if (counter == $scope.delegations.length) {
						$scope.members[i].check = false
					}
	
					$scope.users.push($scope.members[i])
	
				} else {
					$scope.leader = $scope.members[i]
				}
			}
			
			$scope.selected = counter-1 + ' user selected from ' + $scope.users.length
	
				
		}
	
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
		}
	
		$scope.checkCustom = function() {
			$scope.checked = false;
			var counter = 0
			$scope.input = []
	
			for (var i = 0 ; i < $scope.users.length ; i ++) {
				//$scope.users[i].leader = false
				if ($scope.users[i].check == true) {
					$scope.input.push($scope.users[i])
					counter++
				}
			}
	
			$scope.selected = counter + ' user selected from ' + $scope.users.length
		}
	
		$scope.submit = function () {
			$scope.checkCustom();
			
			$scope.temp = $scope.input
			$scope.input = []
			$scope.input.push($scope.leader)
			
			for (var i = 0 ; i < $scope.temp.length ; i++) {
				$scope.input.push($scope.temp[i]);
			}
	
			$modalInstance.close($scope.input)
		}
	
		$scope.close = function () {
			$modalInstance.dismiss('cancel');
		}
	
		$scope.load();
	}
	
	function FormDetailUserProjectController($scope, $state, $stateParams, $timeout, ProjectService) {
		$scope.form = {}
		$scope.input = {}
		
		$scope.load = function() {
			$scope.file = {}
			
			ProjectService
				.form($stateParams.formId)
				.then(function(response) {
					$scope.form = response
					$scope.input = response.form
					
					//console.log($scope.form.uploads)
					
					for (var i = 0 ; i < $scope.form.uploads.length ; i++) {
						console.log($scope.form.uploads[i])
						
						var time = new Date($scope.form.uploads[i].created_at)
						time.addHours(7)
						$scope.form.uploads[i].created_at = time
					}
					
					$scope.sortField = 'created_at'
					$scope.reverse = true
					
				}, function() {
					
				})
			
			ProjectService
				.leader($stateParams.projectId)
				.then(function(response) {
					$scope.project = response
					$scope.leader = response.leader
				}, function() {})
		}
		
		$scope.upload = function(file) {
			$scope.input.user_id = $scope.user.id
			$scope.input.project_form_item_id = $stateParams.formId
			
			ProjectService
				.upload($scope.input, file)
				.then(function(response) {
					alert('Upload Success');
					$scope.load()
				}, function() {
					
				})
		}
		
		$scope.load()
	}
})()



