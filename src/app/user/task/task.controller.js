(function () {
	
	'use strict'
	
	angular.module('spmiFrontEnd')
		.controller('TaskController', TaskController)
		.controller('TaskFormController', TaskFormController)
		
		
	function TaskController ($state, tasks, TaskService) {
		var vm = this;
		vm.tasks = tasks;
		console.log(vm.tasks);
		
		vm.ongoing = vm.tasks.ongoing[0]
		//console.log(vm.ongoing)

		vm.toDo = 0;
		vm.homeWork = 0;
		vm.done = 0;
		
		//console.log(vm.ongoing)
		if ( vm.ongoing ) {
			for (var i = 0 ; i < vm.ongoing.jobs.length ; i++) {
				vm.toDo += vm.ongoing.jobs[i].works.length
				for (var j = 0 ; j < vm.ongoing.jobs[i].works.length ; j++) {
					vm.ongoing.jobs[i].works[j].created_at = Date.parse(vm.ongoing.jobs[i].works[j].created_at);
					vm.ongoing.jobs[i].works[j].expired_at = Date.parse(vm.ongoing.jobs[i].works[j].expired_at);
					var now = new Date();
					var expired = new Date(vm.ongoing.jobs[i].works[j].expired_at);
					var timeDiff = Math.abs(now.getTime() - expired.getTime());
					var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
					vm.ongoing.jobs[i].works[j].remaining = diffDays;
	
					var jobsDone = 0;
					for (var k = 0 ; k < vm.ongoing.jobs[i].works[j].tasks.length ; k++) {
						if (vm.ongoing.jobs[i].works[j].tasks[k].status == 2) {
							jobsDone++
						}
					}
	
					vm.ongoing.jobs[i].works[j].progress = '(' + jobsDone + '/' +vm.ongoing.jobs[i].works[j].tasks.length + ')'
	
				}
			}
		}

		vm.overdue = vm.tasks.overdue[0]
		//console.log(vm.overdue)
		
		if ( vm.overdue )
		for (var i = 0 ; i < vm.overdue.jobs.length ; i++) {
			vm.homeWork += vm.overdue.jobs[i].works.length
			for (var j = 0 ; j < vm.overdue.jobs[i].works.length ; j++) {
				vm.overdue.jobs[i].works[j].created_at = Date.parse(vm.overdue.jobs[i].works[j].created_at);
				vm.overdue.jobs[i].works[j].expired_at = Date.parse(vm.overdue.jobs[i].works[j].expired_at);
				var now = new Date();
				var expired = new Date(vm.overdue.jobs[i].works[j].expired_at);
				var timeDiff = Math.abs(now.getTime() - expired.getTime());
				var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
				vm.overdue.jobs[i].works[j].remaining = diffDays;

				var jobsDone = 0;
				for (var k = 0 ; k < vm.overdue.jobs[i].works[j].tasks.length ; k++) {
					if (vm.overdue.jobs[i].works[j].tasks[k].status == 2) {
						jobsDone++
					}
				}

				vm.overdue.jobs[i].works[j].progress = '(' + jobsDone + '/' +vm.overdue.jobs[i].works[j].tasks.length + ')'

			}
		}

		vm.complete = vm.tasks.complete[0]
		//console.log(vm.complete)
		
		if ( vm.complete )
		for (var i = 0 ; i < vm.complete.jobs.length ; i++) {
			vm.done += vm.complete.jobs[i].works.length
			for (var j = 0 ; j < vm.complete.jobs[i].works.length ; j++) {
				vm.complete.jobs[i].works[j].created_at = Date.parse(vm.complete.jobs[i].works[j].created_at);
				vm.complete.jobs[i].works[j].expired_at = Date.parse(vm.complete.jobs[i].works[j].expired_at);
				var now = new Date();
				var expired = new Date(vm.complete.jobs[i].works[j].expired_at);
				var timeDiff = Math.abs(now.getTime() - expired.getTime());
				var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
				vm.complete.jobs[i].works[j].remaining = diffDays;

				var jobsDone = 0;
				for (var k = 0 ; k < vm.complete.jobs[i].works[j].tasks.length ; k++) {
					if (vm.complete.jobs[i].works[j].tasks[k].status == 2) {
						jobsDone++
					}
				}

				vm.complete.jobs[i].works[j].progress = '(' + jobsDone + '/' +vm.complete.jobs[i].works[j].tasks.length + ')'

			}
		}
		
		
	
		vm.detail = function (work) {
			console.log(work.batch_id);
			//console.log({ userId: vm.user.id, jobId: work.job_id, batchId: work.batch_id});
			$state.go('main.user.task.form', {batchId: work.batch_id});
		}
		
	
		return vm;
	}
	
	function TaskFormController($state, task, TaskService){
		var vm = this;
		vm.task = task;
		console.log(vm.task);
		
		vm.submit = function() {
			TaskService.update(task).then(function(data){
				$state.go('main.user.task', null, {reload: true});
			});
		}
		
		return vm;
	}

})();

