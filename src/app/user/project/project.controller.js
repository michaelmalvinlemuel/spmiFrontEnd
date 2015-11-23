(function () {
	
	'use strict'
	
	angular.module('spmiFrontEnd')
		.controller('ModalDetailUserProjectController', ModalDetailUserProjectController)
		.controller('FormDetailUserProjectController', FormDetailUserProjectController)
	
	function showStatus(start, ended, status) {
			var now = new Date();
			
			start = new Date(start);
			ended = new Date(ended);
			
			if (start > now && status == 1) {
				return {
					code: 1,
					text : 'Preparation',
				}
			}
			
			if (start < now && ended > now && status == 1) {
				return { 
					code: 2,
					text: 'On Progress',
				}
			}
			
			if (ended < now && status == 1) {
				return {
					code: 3,
					text: 'Waiting for Scoring',
				};
			}
			
			if (status == 2) {
				return {
					code: 4,
					text: 'Complete',
				};
			}
			
			if (status == 3) {
				return {
					code: 5,
					text: 'Terminated',
				};
			}
		}
	
	function ModalDetailUserProjectController($timeout, $modalInstance, users, delegations) {
		
		var vm = this;
		vm.useInherit = true	//configuration for allows inherit delegation
		vm.leader = {}			//leader for this project
		vm.users = [] 			//all users that colaborate on this project
		vm.delegations = [] 	//users that already delegate before on this project node
		vm.input = {}			//variable for return from this modal
		
		//console.log(delegations);
		
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
		
		
		//remove user check before checking user that already delegate
		for (var i = 0; i < vm.users.length; i++) {
			vm.users[i].check = false;
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
		
			$modalInstance.close(vm.input)
		}
	
		vm.close = function () {
			$modalInstance.dismiss('cancel');
		}
		
		vm.checkCustom(); //check if all users is delegate for set global check
	
		return vm;
	}
	
	function FormDetailUserProjectController($scope, $state, $timeout, form, project, CURRENT_USER, ProjectService) {

		var vm = this;
		
		
		vm.form = form;
		vm.project = project
		vm.leader = project.leader
		vm.projectFormItemId = null
		
		for (var i = 0 ; i < vm.form.uploads.length ; i++) {

			if (vm.projectFormItemId === null)
			vm.projectFormItemId = vm.form.uploads[i].project_form_item_id;
			vm.form.uploads[i].created_at = new Date(vm.form.uploads[i].created_at)
		}
		
		vm.upload = function() {
			
			vm.input.project_form_item_id = vm.form.id
			vm.input.description = vm.form.form.description;
			
			ProjectService.upload(vm.input).then(function(data) {
				alert('Upload Success');
				data.created_at = new Date(data.created_at);
				vm.form.uploads.unshift(data);
			}, function() {
				
			})
			
		}
		

		return vm;
	}
})();



