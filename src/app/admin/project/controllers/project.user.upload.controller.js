(function(angular) {
    
    'use strict';
    
    angular.module('spmiFrontEnd')
        .controller('FormDetailUserProjectController', FormDetailUserProjectController)
        
    
    function FormDetailUserProjectController($rootScope, $scope, $state, $timeout, $modal
        , form, project, CURRENT_USER, ProjectService) {

		var vm = this,
            uploadIndex = null,
            attachmentIndex = null;
		
		
		vm.form = form;
		vm.project = project
		vm.leader = project.leader
		vm.projectFormItemId = null
       
		
        vm.input = null;
        
		for (var i = 0 ; i < vm.form.uploads.length ; i++) {

			if (vm.projectFormItemId === null)
			vm.projectFormItemId = vm.form.uploads[i].project_form_item_id;
			vm.form.uploads[i].created_at = new Date(vm.form.uploads[i].created_at)
		}
        
        vm.addUpload = function() {
            
 
            vm.input = {
                project_form_item_id: vm.form.id,
                attachments: [],
            }

        }
		
        vm.updateUpload = function(index) {
            
            vm.input = angular.copy(vm.form.uploads[index]);
            uploadIndex = index;
        }
        
        vm.addCommit = function () {
            
        }
        
        vm.addAttachment = function() {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'app/admin/project/views/upload.modal.html',
                controller: 'ModalAttachmentUploadController as vm',
                resolve: {
                    attachment: null
                }
            })
            
            modalInstance.result.then(function(attachment) {
                $rootScope.pushIfUnique(vm.input.attachments, attachment);
            })
        }
        
        vm.updateAttachment = function(index, object) {
            
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'app/admin/project/views/upload.modal.html',
                controller: 'ModalAttachmentUploadController as vm',
                resolve: {
                    attachment : function() {
                        return vm.input.attachments[index];
                    }
                }
            })
            
            modalInstance.result.then(function(attachment) {
                
            })
            
        }
        
        vm.deleteAttachment = function(index, object) {
            var cnf = confirm("Apakah Anda yakin ingin menghapus attachment ini?");
            if (cnf == true) {
                vm.input.attachments.splice(index, 1);
            }
        }
        
        
        
		vm.upload = function() {
			
			
			//vm.input.description = vm.form.form.description;
			
            console.log(vm.input);
            
            
			ProjectService.upload(vm.input).then(function(data) {
				console.log(data);
                alert('Upload Success');
                
                vm.input.project_form_item_id = vm.form.id;
                vm.input.created_at = new Date();
                vm.input.users = {}
                vm.input.upload = vm.input.file;
                vm.input.users.nik = CURRENT_USER.nik;
                vm.input.users.name = CURRENT_USER.name;
                vm.form.uploads.unshift(vm.input);
				
                vm.input = null
                
			}, function() {
				
			})
            
			
		}
		

		return vm;
	}
    
})(angular);