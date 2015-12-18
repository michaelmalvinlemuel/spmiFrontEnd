(function() {
	
	'use strict';
	
	angular.module('spmiFrontEnd')
		.controller('ReportModalUserProjectController', ReportModalUserProjectController)
		
	function ReportModalUserProjectController($scope, $modalInstance, projects, user) {
		

		$scope.nodes = [],
		$scope.projects = projects,

		$scope.user = user;
		
		var filterNode = function(nodes) {
			
			for (var i = 0; i < nodes.length; i++) {
				
				var counter = 0;
				for (var j = 0; j < nodes[i].delegations.length; j++) {
					
					if (nodes[i].delegations[j].id == $scope.user.id) {
						$scope.nodes.push(nodes[i]);
						break;
					}
					counter++;
					
				}
				
				if (counter == nodes[i].delegations.length) {
					filterNode(nodes[i].children);
				}
				
			}
			
		}
		
		filterNode($scope.projects);
		
		var labelNumbering = function(nodes) {
			for (var i = 0; i < nodes.length; i++) {
				
				if (nodes[i].fixedIndex) {
					nodes[i].label = nodes[i].fixedIndex + ' ' + nodes[i].label;	
				} else {
					nodes[i].label = nodes[i].index + nodes[i].label;
				}
				
				
				if (nodes[i].children.length > 0) {
					labelNumbering(nodes[i].children);
				}
			}
		}
		
		labelNumbering($scope.nodes);
		
		
		$scope.close = function() {
			$modalInstance.dismiss('cancel');
		}
		

	}
})();