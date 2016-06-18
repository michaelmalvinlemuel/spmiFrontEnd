(function(angular) {
    
    'use strict';
    
    angular.module('spmiFrontEnd')
        .controller('StorageController', StorageController)
        .controller('CreateStorageController', CreateStorageController)
        .controller('UpdateStorageController', UpdateStorageController)
        
    function StorageController($state, $timeout, $modal, storages, StorageService) {
        
        var vm = this;
        
       
        
        vm.tree = storages;
        vm.selected = false;
        vm.selectedNode = {}
        
        vm.onSelect = function(nodes) {
            for (var i = 0; i < nodes.length; i++) {
                
                nodes[i].onSelect = function(branch) {
                    //alert(branch.label);
                    vm.selectedNode = branch;
                    vm.selected = true;
                }
                
                if (nodes[i].children) {
                    vm.onSelect(nodes[i].children)
                }
                
            }
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
			recursiveNodeSearch(vm.tree)
		}
        
        
        
        vm.addNode = function() {
           
        }
        
        vm.editNode = function() {
      
                    
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'app/admin/storage/views/tree.modal.html',
                controller: 'ModalEditStorageController as vm',
                resolve: {
                    hierarchy: function(StorageService) {
                        return StorageService.edit(vm.selectedNode.id);
                    },
                }
            })
            
            modalInstance.result.then(function(data) {
                vm.selectedNode.code = data.code;
                vm.selectedNode.description = data.description;
                vm.selectedNode.label = data.description;
            })
            
            
        }
        
        vm.addChild = function() {
  
            var modalInstance = $modal.open({
               animation: true,
               templateUrl: 'app/admin/storage/views/tree.modal.html',
               controller: 'ModalCreateStorageController as vm',
               resolve: {
                   hierarchy: function(StorageService) {
                       return StorageService.edit(vm.selectedNode.id);
                   },
                   sub: function(StorageCategoryService) {
                       return StorageCategoryService.sub(vm.selectedNode.physical_address_category.id);
                   }
               }
            })
           
            modalInstance.result.then(function(data) {
                data.label = data.description;
                vm.selectedNode.children.push(data)
            })
           
        }
        
        vm.removeNode = function() {
            
            var cnf = confirm('Apakah Anda yakin ingin menghapus butir ini?');
            if (cnf == true) {
                
                StorageService.destroy(vm.selectedNode.id)
                    .then(function(data) {
                        
                        deleteNode(vm.selectedNode);
                        vm.selected = false;
                        vm.selectedNode = null;
                    })
                
            }
        }
        
        vm.onSelect(vm.tree);
        
        
        
        return vm;
    }
    
    function CreateStorageController() {
        
    }
    
    function UpdateStorageController() {
        
    }
    
})(angular);