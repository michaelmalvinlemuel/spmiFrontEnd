(function() {
	
	'use strict';
	
	angular.module('spmiFrontEnd')
		.controller('NodeProjectController', NodeProjectController)
	
	function NodeProjectController($rootScope, $scope, $state, $timeout, $modal, $filter,
		CURRENT_USER, ProjectService, ProjectConverterService) {
		
		/**
		 * Scope bridge that connected template and controller
		 * 
		 * $scope.node = current node that want to be manipulated
		 * $scope.nodes = current node with its siblings for manipulating member 
		 * $scope.privilege = configuration privilege gived by controller to directive
		 * $scope.users = list of users member of this project for determine who leader, and prilage given
		 * $scope.assessors = prototype, need to be implement
		 * 
		 */
		
		$scope.privilege = {}
		$scope.privilege.showNode = true;
		$scope.privilege.editableNode = false;
		$scope.privilege.showLockNode = false;
		$scope.privilege.delegatable = false;
		$scope.privilege.showDelegation = false;
		$scope.privilege.editableWeight = false;
		$scope.privilege.showGrade = false;
		$scope.privilege.editableFormUpload = false;
		$scope.privilege.showFormMaster = false;
		$scope.privilege.showFormUpload = false;
		$scope.privilege.showAssess = false;
		$scope.privilege.showAssessorsNode = false;
		$scope.privilege.editableAssessorsNode = false;

		
		/**
		 * Common function for configurating node when initial call
		 * -if leader checking
		 */
		
		$scope.leaderId = (function() {
			for (var i = 0; i < $scope.users.length; i++) {
				if ($scope.users[i].leader == true) {
					return $scope.users[i].id;
					break;
				}
			}
		})();
		
		
		$scope.isAssessor = function() {
			
			for (var i = 0; i < $scope.assessors.length; i++) {
				if ($scope.assessors[i].id == CURRENT_USER.id) {
					return true;
					break;
				}	
			}
			
			return false;
		}
		
		$scope.isLeader = function() {
			
			for (var i = 0; i < $scope.users.length; i++) {
				if ($scope.users[i].leader == true && $scope.users[i].id == CURRENT_USER.id) {
					return true;
				}
			}
			
			return false;
		}
		
		$scope.isDelegate = function() {
			
			if ($scope.node) {
				for (var i = 0; i < $scope.node.delegations.length; i++) {
					if ($scope.node.delegations[i].id == CURRENT_USER.id) {
						return true;
						break;
					}
				}
			}
			
			
			
			return false;
		}
		
		/**
		 * This watch used for checking if node has opended poject then this node is also opended
		 */
		
		$scope.$watch('node', function(newValue, oldValue) {
			
			if ($scope.node && $scope.node.children.length > 0) {
				
				var counter = 0,
					broke = false;
				for(var i = 0; i < $scope.node.children.length; i++) {
					if ($scope.node.children[i].lock == 0) {
						$scope.node.lock = 0;
						break;
					}
					counter++;
				}
				
				if ($scope.node.children.length == counter) {
					$scope.node.lock = 1;
				}
				
				counter = 0;
				for (var i = 0; i < $scope.node.children.length; i++) {
					if ($scope.node.children[i].score == null || $scope.node.children[i].unsigned == true) {
						$scope.node.children[i].unsigned = true;
						$scope.node.unsigned = true;
						broke = true;
					}
				}
				
				if (!broke) {
					$scope.node.unsigned = false;
				}
				
				
			}
			
		}, true);
		
		/**
		 * this function method is for handle where project is on mondify state where
		 * project status is on initiation or preparation
		 * this seperation is needed for exception scoring function if not modified yet
		 */
		
		$scope.modifyState = function() {
			//project initiation
			
			if (
				$scope.setting.status == '0'
			) {
				
				if ($scope.setting.isAdmin == true) {
					
					if ($scope.setting.readOnly == true) {
						
						$scope.privilege.showFormMaster = true;
						
					} else {
						$scope.privilege.showAssessorsNode = true;
						$scope.privilege.editableNode = true;
						$scope.privilege.editableWeight = true;
						$scope.privilege.showFormMaster = true;
						$scope.privilege.editableAssessorsNode = true;
					}
					
				} else if ($scope.isAssessor() == true) {
					
					$scope.privilege.showAssessorsNode = true;
					$scope.privilege.showFormMaster = true;
					
					
				} else if ($scope.isLeader() == true) {
							
					$scope.privilege.showFormMaster = true;
					
					//$scope.privilege.editableNode = true;
					$scope.privilege.showAssessorsNode = true;
					
					
				} else if ($scope.isDelegate() == true) {
					
					$scope.privilege.showAssessorsNode = true;
					$scope.privilege.showFormMaster = true;
					
				} else {
					$scope.privilege.showNode = false;
				} 
				
				return true;
				/**
				* if project status is preparation
				* 
				*/ 
			
			} else if (
				$scope.setting.start > new Date()
				&& $scope.setting.status == '1'
			) {
				
				//check if admin for showing node manipulation function
				if ($scope.setting.isAdmin == true) {
					
					if ($scope.setting.readOnly == true) {
						
						$scope.privilege.showDelegation = true;
						$scope.privilege.showFormMaster = true;
							
					} else {
						$scope.privilege.showAssessorsNode = true;
						$scope.privilege.editableNode = true;
						$scope.privilege.editableWeight = true;
						$scope.privilege.showFormMaster = true;
						$scope.privilege.editableAssessorsNode = true;
					}
					
					
				} else if ($scope.isAssessor() == true) {
						
					$scope.privilege.showFormMaster = true;
					$scope.privilege.showAssessorsNode = true;
						
				} else if ($scope.isLeader() == true) {
					
					//$scope.privilege.editableNode = true;
					$scope.privilege.showFormMaster = true;
					$scope.privilege.showDelegation = true;
					$scope.privilege.delegatable = true;
							
				} else  if ($scope.isDelegate() == true) {
								
					$scope.privilege.showDelegation = true;
					$scope.privilege.showFormMaster = true;
				} else {
					$scope.privilege.showNode = false;
				} 
				
				return true;
				
			} else {
				
				return false; //if project is not on initation and preparatiion, for checking another project status
				
			} 
		}
		
		
		/**
		 * This watch is for check changes for showing/hiding assessment button and upload form button
		 */
		
		
		$scope.$watch('node.lock', function() {
			if ($scope.node) {
				$scope.isLock = ($scope.node.lock == 1) ? true : false;
				$scope.load();
			}
		})
		
		$scope.load = function() {
			
		
			/**
			* This secction only when admin is creating new project
			* 
			*/
			if ($scope.setting.isAdmin == true && $scope.setting.initiate == true) {
				
				$scope.privilege.editableNode = true;
				$scope.privilege.editableWeight = true;
				$scope.privilege.showFormMaster = true;
				$scope.privilege.showAssessorsNode = true;
				$scope.privilege.editableAssessorsNode = true;
				
			}
			
			if ($scope.isLeader() == true && $scope.setting.initiate == true) {
				//$scope.privilege.editableNode = true;
				//$scope.privilege.editableWeight = true;
				$scope.privilege.showFormMaster = true;
				//$scope.privilege.showDelegation = true;
				//$scope.privilege.delegatable = true;
			}
			
			
			
			
			/**
			* Parameter logic when directive callled  this step need to be decouple function
			* 
			* -check if node exists
			* -check status
			* -calculate grade
			* 
			* 
			* -check user who access this node
			* 
			* -give configuration for this node
			*/
			

			
			/**
			 * check node if that node is exist
			 * this is need because pasing node children without children
			 * but somehow we need undefined children for check if we can add its children. DAMN..!!!
			 * 
			 */
			if ($scope.node) {
				$scope.isLock = ($scope.node.lock == 1) ? true : false;
				if ($scope.modifyState() !== true) {
					
					
					/**
					* This secction only when admin is creating new project
					* 
					*/
					if (!$scope.setting.initiate) {
						
						/**
						* statement for filtering score if not assign yet 
						*/
						if ($scope.node.score !== null) {
							
							if ($scope.node.forms) {
								
								$scope.adjustedScore = $filter('number')($scope.node.score.score, 2)
								
							} else {
								
								$scope.node.score.score = ProjectConverterService.calculateNodeScore($scope.node);
								$scope.adjustedScore = $filter('number')($scope.node.score.score, 2)
								
							}
							
						} else {
							$scope.adjustedScore = 'Unsigned'
						}
						
					}
			
			
					
					
					/**
					* project on progress 
					*/
					if (
						$scope.setting.start <= new Date()
						&& $scope.setting.ended >= new Date()
						&& $scope.setting.status == '1'
					) {	
					
						if ($scope.setting.isAdmin == true) {
							
							if ($scope.setting.readOnly == true) {
								
								$scope.privilege.showDelegation = true;
								$scope.privilege.showFormMaster = true;
								$scope.privilege.showGrade = true;
								$scope.privilege.showFormUpload = true;
									
							} else {
								
								$scope.privilege.showFormMaster = true;
								$scope.privilege.showDelegation = true;
								$scope.privilege.showGrade = true;
								$scope.privilege.showFormUpload = true;
								$scope.privilege.showLockNode = ($scope.setting.type == 'p');
								$scope.privilege.showAssess = $scope.isLock;
	
							}
							
							
						} else if ($scope.isAssessor() == true) {
								
							$scope.privilege.showFormMaster = true;
							$scope.privilege.showDelegation = true;
							$scope.privilege.showGrade = true;
							$scope.privilege.showFormUpload = true;
							$scope.privilege.showLockNode = ($scope.setting.type == 'p');
							$scope.privilege.showAssess = $scope.isLock;
								
		
						} else if ($scope.isLeader() == true) {
								
							$scope.privilege.showFormMaster = true;
							$scope.privilege.showDelegation = true;
							$scope.privilege.delegatable = ($scope.node.lock == 0);
							$scope.privilege.showGrade = true;
							$scope.privilege.showFormUpload = true;
							$scope.privilege.showLockNode = ($scope.setting.type == 'p');
							$scope.privilege.editableFormUpload = !$scope.isLock;
							
						} else if ($scope.isDelegate() == true) {
								
							$scope.privilege.showDelegation = true;
							$scope.privilege.showFormMaster = true;
							$scope.privilege.showGrade = true;
							$scope.privilege.showFormUpload = true;
							$scope.privilege.showLockNode = ($scope.setting.type == 'p');
							$scope.privilege.editableFormUpload = !$scope.isLock;
		
						} else {
		
							$scope.privilege.showNode = false;
						}
					
					/**
					* project on gradding and waiting for complete
					* 
					*/
					} else if (
						$scope.setting.ended < new Date()
						&& $scope.setting.status == '1'
					) {

						$scope.privilege.showDelegation = true;
						$scope.privilege.showFormMaster = true;
						$scope.privilege.showFormUpload = true;
						$scope.privilege.showGrade = true;
							
						if ($scope.setting.isAdmin == true) {
							
							$scope.privilege.showDelegation = true;
							$scope.privilege.showFormMaster = true;
							$scope.privilege.showFormUpload = true;
							$scope.privilege.showGrade = true;
							
							if ($scope.setting.readOnly == true) {
								
								$scope.privilege.showAssess = false;
								
							} else {
								
								$scope.privilege.showAssess = true;
							}
							
						} else if ($scope.isAssessor() == true) {
							
							$scope.privilege.showAssess = true;
							
						} else if ($scope.isLeader() == true) {
							
							
						} else if ($scope.isDelegate() == true) {
							
							
						} else {
							
							$scope.privilege.showNode = false;
							$scope.privilege.showDelegation = false;
							$scope.privilege.showFormMaster = false;
							$scope.privilege.showFormUpload = false;
						}
					
					/**
					* project is complete 
					*/
					
					} else if ($scope.setting.status == '2') {
						
						$scope.privilege.showDelegation = true;
						$scope.privilege.showFormMaster = true;
						$scope.privilege.showGrade = true;
						$scope.privilege.showFormUpload = true;
					/**
					* project is terminated
					*/
					} else if ($scope.setting.status == '3') {
						
						$scope.privilege.showDelegation = true;
						$scope.privilege.showFormMaster = true;
						$scope.privilege.showGrade = true;
						$scope.privilege.showFormUpload = true;
						
					}//end of if project terminated
					
				}//end of project is not modified
				
			
			} else { //end of if node exists
			
				$scope.modifyState();
				
			}
			
			
			
			
			
		} // end of load function
		
		$scope.load();
		
		
		
		
		/**
		 * ------------------- BEGIN OF PROJECT LEADER FUNCTION -------------------
		 */
		
		
		
		//private function called by $scope.delegateNode()
		$scope.inheritDelegation = function(nodes, delegations) {
			for (var i = 0; i < nodes.length; i++) {
				nodes[i].delegations = [];
				for (var j = 0; j < delegations.length; j++) {
					nodes[i].delegations.push(delegations[j]);
				}
				$scope.inheritDelegation(nodes[i].children, delegations);
			}
		}
		
		$scope.inheritAssessors = function(nodes, assessors) {
			for (var i = 0; i < nodes.length; i++) {
				nodes[i].assessors = []
				for (var j = 0; j < assessors.length; j++) {
					nodes[i].assessors.push(assessors[j]);
				}
				$scope.inheritAssessors(nodes[i].children, assessors);
			}
		}
	
	
		$scope.delegateNode = function(node) {
			console.log('delegations');
			
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
						return node.delegations;
					}
				}
			});

			modalInstance.result.then(function (result) {
				var data = {
					project_id: projectId,
					delegations: result.users,
					inherit: true,
				}
				
				ProjectService.delegate(data).then(function(data) {
					node.delegations = result.users;
					$scope.inheritDelegation(node.children, result.users);
					$scope.$emit('projectUserLoadResource', {})
					alert('Project Ini berhasil didelegasikan')
				}, function() {})
				
			}, function () {})
		}
		
		$scope.assessorsNode = function(node) {
			console.log($scope.assessors);
			console.log(node.assessors);
			
			var projectId = node.id;
			
			var modalInstance = $modal.open({
				animate: true,
				templateUrl: 'app/admin/user/views/modal.html',
				controller: 'ModalDetailUserProjectController as vm',
				size: 'lg',
				resolve: {
					users: function() {
						return $scope.assessors;
					},
					delegations: function() {
						return node.assessors
					}
				}
			})
			
			modalInstance.result.then(function(result) {
				node.assessors = []
				for (var i = 0; i < result.users.length; i++) {
					if (result.users[i].id) {
						node.assessors.push(result.users[i])
					}
				}
				$scope.inheritAssessors(node.children, node.assessors);
				
			})
		}
		
		/**
		 * this locking system has common functionality with lock method in project.node.controller
		 * if there any changes, please looking forward for project.node.controller as well
		 */
		
		$scope.lock = function(event) {
			if (event) {
				event.preventDefault();
				event.stopPropagation();
			}
			
			
			var lockingSystem = function(lockStatus) {

				
				var propagateLock = function(node, lockStatus) {
					
					if (node.children.length > 0) {
						for (var i = 0; i < node.children.length; i++) {
							node.children[i].lock = lockStatus;
							propagateLock(node.children[i], lockStatus)
						}
					}
				}
				
				for (var i = 0; i < $scope.node.children.length; i++) {
					$scope.node.children[i].lock = lockStatus;
					propagateLock($scope.node.children[i], lockStatus)
				}
			}
			
			//lockingSystem();
			
			
			
			
			//console.log($scope.node.lock);
			
			
			if ($scope.node.lock == 0) {
				if ($scope.setting.isAdmin == true) {
					
					//when admin try to lock the project node
					alert('Hanya Project Leader yang dapat mengunci pekerjaan untuk siap dinilai');
				
				} else if ($scope.isAssessor() == true) {
					
					//when assessors try to lock the project node
					alert('Hanya Project Leader yang dapat mengunci pekerjaan untuk siap dinilai');
				
				} else if ($scope.isLeader() == true) {
					
					//when project leader is allowed to lock the project node
					var cnf = confirm('Apakah anda yakin ingin mengunci butir project ini? Dengan melakukan ini, seluruh project member tidak dapat me-upload seluruh butir project ini beserta anggota butir dari project. Selain itu, assessor dapat memberikan penilaian untuk project ini. PERHATIAN: anda tidak dapat membuka kembali pekerjaan yang telah terlunci. Hanya administrator dan assessor yang dapat membuka pekerjaan yang sudah terkunci');
						
					if (cnf == true) {
						
						ProjectService.lock($scope.node.id, 1).then(function(data) {
							$scope.node.lock = 1;
							
							//$scope.$emit('nodeRefresh', {});
							alert('Pekerjaan project ini berhasil dikunci dan siap dinilai oleh assessor');
							lockingSystem($scope.node.lock);
						});
						
					}
						
				} else if ($scope.isDelegate() == true) {
					
					//when delegated member try to lock the project node
					alert('Hanya admin yang dapat mengunci pekerjaan untuk siap dinilai');
				
				}
				
			//scope.node.lock == '1'
			} else {
				
				
				if ($scope.setting.isAdmin == true) {
					
					//when admin is allowed to unlock project node
					cnf = confirm('Apakah anda yakin ingin membuka pekerjaan yang terkunci ini? Dengan begitu induk dari perkerjaan ini menjadi dapat diedit oleh project member.');
					if (cnf == true) {
						
						ProjectService.lock($scope.node.id, 0).then(function(data) {
							$scope.node.lock = 0;
							
							//$scope.$emit('nodeRefresh', {});
							alert('Pekerjaan berhasil dibuka dan siap dilanjutkan oleh project member');
							lockingSystem($scope.node.lock);
						});
					}
				} else if ($scope.isAssessor() == true) {
					
					//when assessors is allowed to unlock project node
					cnf = confirm('Apakah anda yakin ingin membuka pekerjaan yang terkunci ini?');
					if (cnf == true) {
						
						ProjectService.lock($scope.node.id, 0).then(function(data) {
							$scope.node.lock = 0;
							
							//$scope.$emit('nodeRefresh', {});
							alert('Pekerjaan berhasil dibuka dan siap dilanjutkan oleh project member');
							lockingSystem($scope.node.lock);
						});
					}
					
				} else if ($scope.isLeader() == true) {
					
					//when project leader try to unlock the project node
					alert('Project ini sudah terkunci, harap hubungi administrator atau assessor untuk membuka pekerjaan yang terkunci');
					
				} else if ($scope.isDelegate() == true) {
					
					//when delegate project member try to unlock project node
					alert('Project ini sudah terkunci, harap hubungi administrator atau assessor untuk membuka pekerjaan yang terkunci');
					
				}
			}
			
			
			
			//load its children controller
			
			
			
		}
		
		/**
		 * ------------------- END OF PROJECT LEADER FUNCTION FUNCTION -------------------
		 */
		
		
		
		
		/**
		 * ------------------- BEGIN OF ADMIN FUNCTION -------------------
		 * Function that used by admin for manipulating project node. 
		 * this function can be accessed because visibility on project form
		 * 
		 * -create
		 * -update
		 * -delete
		 * 
		 * -createNodeForm
		 * -deleteNodeForm
		 * 
		 * -createNodeFormItem
		 * -updateNoteFormItem
		 * -deleteNodeFormItem
		 */
		
		$scope.create = function(nodes){
			var modalInstance = $modal.open({
				animation: true,
				templateUrl: 'app/admin/project/views/modal.html',
				controller: 'ModalProjectController',
				size: 'lg',
				resolve: {
					project: null,
				}
			})

			modalInstance.result.then(function (project) {
				$rootScope.pushIfUnique(nodes, project)
			}, function(){})
		};
	
		$scope.update = function(index, nodes, event){
			//stop animation when clicking header
			if (event) {
				event.preventDefault();
				event.stopPropagation();
			}
	
			var modalInstance = $modal.open({
				animation: true,
				templateUrl: 'app/admin/project/views/modal.html',
				controller: 'ModalProjectController',
				size: 'lg',
				resolve: {
					project: nodes[index-1],
				}
			})
			
			modalInstance.result.then(function(project){
				nodes[index-1].header = project.header;
				nodes[index-1].description = project.description
			}, function(){})
		};
	
		$scope.delete = function(index, nodes, event){
			if (event) {
				event.preventDefault();
				event.stopPropagation();
			}
			
			var alert = confirm('Apakah Anda yakin ingin menghapus butir project ini?');
			if (alert == true) {
				$timeout(function(){
					nodes.splice(index - 1, 1);
				},0);
			}
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
			
			//remove temporary this attribute so can match to modal form
			var projectFormItemId = forms[index].project_form_item_id;
			var uploads = forms[index].uploads;
			
			delete forms[index].project_form_item_id;
			delete forms[index].uploads;
			
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
					//returning back attribute for these node;
					node.forms[index].project_form_item_id = projectFormItemId;
					node.forms[index].uploads = uploads;
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
		
		$scope.assess = function() {
			
			if($scope.setting.isAdmin == true) {
				$state.go('main.admin.project.scoring.assess', { nodeId: $scope.node.id });
			} else if ($scope.isAssessor() == true) {
				$state.go('main.user.project.detail.assess', { nodeId: $scope.node.id });
			} else {
				alert('Anda tidak berhak');
			}
			
		}
		
		/**
		 * ------------------- END OF ADMIN FUNCTION -------------------
		 */
		
		
	
		
		
		
		
		
		
		
		$scope.detailForm = function(formId) {

			$state.go('main.user.project.detail.form', {formId: formId})
		}
		

	}
	
})();