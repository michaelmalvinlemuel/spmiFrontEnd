(function(angular) {
	
	'use strict';
	
	angular.module('spmiFrontEnd')
		.controller('UpdateTemplateProjectController', UpdateTemplateProjectController)
	
	function UpdateTemplateProjectController($rootScope, $scope, $state, $modal, $window, project, ProjectConverterService, ProjectTemplateService) {
		
		var vm = this;
		
		vm.selectedNode = {};
		
		var numberingUpdate = function () {
			var recursiveNumbering = function(nodes) {
				for (var i = 0; i < nodes.length; i++) {
					if (nodes[i].parentIndex) {
						nodes[i].fixedIndex = nodes[i].parentIndex + '.' + (i + 1);
						for (var j = 0; j < nodes[i].children.length; j++) {
							nodes[i].children[j].parentIndex = nodes[i].fixedIndex;
						}
					} else {
						nodes[i].fixedIndex = i + 1; 
						for (var j = 0; j < nodes[i].children.length; j++) {
							nodes[i].children[j].parentIndex = nodes[i].fixedIndex;
						}
					}
					
					nodes[i].label = nodes[i].fixedIndex + '. ' + nodes[i].name;
					if (nodes[i].children.length > 0) {
						recursiveNumbering(nodes[i].children);
					}
				}
			}
			recursiveNumbering(vm.input.projects);
		}
		
		var onSelecetBranch = function() {
			
			var recursiveBranching = function(nodes) {
				for (var i = 0; i < nodes.length; i++) {
					nodes[i].onSelect = function(branch) {
						vm.selectedNode = branch;
					}
					if (nodes[i].children.length > 0) {
						recursiveBranching(nodes[i].children);
					}
				}
			}
			
			recursiveBranching(vm.input.projects);
		}
		
		vm.input = project;
		
		numberingUpdate();
		onSelecetBranch();
		ProjectConverterService.decimalConverter(vm.input.projects);
			
		
		vm.addNode = function() {
			vm.input.projects.push({
				label: '[No Name]',
				name: '[No Name]',
				description: '[No Description]',
				children: [],
				onSelect: function(branch) {
					vm.selectedNode = branch;
					return null;
				}
			});
			numberingUpdate();
		}
		
		vm.addChild = function() {
			numberingUpdate();
			vm.selectedNode.children.push({
				label: '[No Name]',
				name: '[No Name]',
				description: '[No Description]',
				children: [],
				onSelect: function(branch) {
					vm.selectedNode = branch;
					return null;
				}
			})
			numberingUpdate();
		}
		
		var deleteNode = function(node) {
			var recursiveNodeSearch = function(nodes) {
				for (var i = 0; i < nodes.length; i++) {
					if (node.uid == nodes[i].uid) {
						nodes.splice(i, 1);
						break;
					}
					if (nodes[i].children.length > 0) {
						recursiveNodeSearch(nodes[i].children)
					}
				}
			}
			recursiveNodeSearch(vm.input.projects)
		}
		
		vm.removeNode = function() {
			deleteNode(vm.selectedNode)
			numberingUpdate();
		}
		
		vm.addForm = function() {
			vm.selectedNode.forms = [];
		}
		
		vm.removeForm = function() {
			var cnf = confirm('Apakah anda yakin ingin meghapus Formulir ini?')
			if (cnf == true) {
				delete vm.selectedNode.forms;
				delete vm.selectedNode.weight;
			}
		}
		
		vm.addFormItem = function() {
			var modalInstance = $modal.open({
				animation: true,
				templateUrl: 'app/admin/form/views/modal.html',
				controller: 'CreateModalFormController as vm',
			})

			modalInstance.result.then(function(form){
				$rootScope.pushIfUnique(vm.selectedNode.forms, form)
			})
		}
		
		vm.editFormItem = function(index) {

			
			delete vm.selectedNode.forms[index].project_form_item_id;
			delete vm.selectedNode.forms[index].uploads;
			
			var modalInstance = $modal.open({
				animation: true,
				templateUrl: 'app/admin/form/views/modal.html',
				controller: 'UpdateModalFormController as vm',
				resolve: {
					form: vm.selectedNode.forms[index],
				}
			})
			
			modalInstance.result.then(function(form){
				if ($rootScope.findObject(vm.selectedNode.forms, form) == -1) {
					vm.selectedNode.forms[index] = form
				} else {
					alert('Formulir ini sudah bagian dari pekerjaan')
				}
			}, function(){})
		}
		
		vm.removeFormItem = function(index) {
			var cnf = confirm('Apakah anda yakin ingin menghapus form ini?');
			if (cnf == true) {
				vm.selectedNode.forms.splice(index, 1);
			}
		}
		
		vm.back = function() {
			$state.go('main.admin.project');
		}
		
		vm.checkpoint = function() {
			
			$scope.ProjectForm.name.$setDirty();
			$scope.ProjectForm.description.$setDirty();

			vm.msg = {}
			vm.input.status = '0';
			ProjectConverterService.decimalConverter(vm.input.projects);
			
			if ($scope.ProjectForm.$valid) {
				ProjectTemplateService.update(vm.input)
					.then(function(data) {
						$state.go('main.admin.project', null, {reload: true});
					});
			} else {
				vm.validated = true;
			}
		}
		
		vm.submit = function() {
			
			$scope.ProjectForm.name.$setDirty();
			$scope.ProjectForm.description.$setDirty();
			
			vm.msg = {}
			vm.input.status = '1';
			//convert weight into number
			ProjectConverterService.decimalConverter(vm.input.projects);
			//error checking before submit
			vm.msg = ProjectConverterService.validateTemplateSubmit(vm.input);
			//if all error had been handled
			if (
				vm.msg.general.length == 0 &&
				vm.msg.noChild.length == 0 &&
				vm.msg.noForm.length == 0 &&
				vm.msg.noWeight.length == 0 &&
				$scope.ProjectForm.$valid
			) {
				ProjectTemplateService.update(vm.input).then(function() {
					$state.go('main.admin.project', null, {reload: true});
				}, function(){});
			} else {
				alert('Terjadi kesalahan dalam input, silahkan lihat log error pada keterangan dibwah');
				vm.validated = true;
				var errorMsg = $window.open('/#/window/project/error');
				errorMsg.message = vm.msg;
			}
		}
		
		return vm;	
	}
	
})(angular);