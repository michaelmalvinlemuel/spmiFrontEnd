(function () {
	
	'use strict'
	
	angular
		.module('spmiFrontEnd')
		.directive('userNodeList', ['$compile', userNodeList])
		.directive('userNode', ['$compile', userNode])
		.directive('userNodeFormList', ['$compile', userNodeFormList])
		
	function userNodeList ($compile) {
		return {
			restrict: 'E',
			terminal: true,
			replace: true,
			transclude: true,
			scope: {
				nodes: '=ngModel',
				node: '=',
				users: '=',
				nodeController: '@',
				parentIndex: '@'
			},
			controller: '@',
			name: 'nodeController',
			link: function ($scope, $element, $attrs) {

				$scope.template = ''
					+ '<accordion close-others="false">'
						+ '<user-node ng-repeat="item in nodes track by $index" ng-model="item" nodes="nodes" node-index="$index + 1" parent-index="' + $scope.parentIndex + '"  users="users" node-controller="' + $scope.nodeController + '"></user-node>'
					+ '</accordion>'
	
				//console.log($scope.template)
				if (angular.isArray($scope.nodes)) {
					$element.append($scope.template);
				} 
				$compile($element.contents())($scope.$new());
			}, 
		};
	}
	
	function userNode ($compile) {
		return {
			restrict: 'E',
			terminal: true,
			replace: true,
			transclude: true,
			scope: {
				node: '=ngModel',
				nodes: '=',
				users: '=',
				nodeController: '@',
				nodeIndex: '=',
				parentIndex: '@'
			},
			controller: '@',
			name: 'nodeController',
	
			link: function ($scope, $element, $attrs) {

				if ($scope.parentIndex == 'undefined') {
					$scope.parentIndexString = ''
				} else {
					$scope.parentIndexString = $scope.parentIndex + '.'
				}
	
				$scope.parentIndexStringNode = $scope.parentIndexString + $scope.nodeIndex
				
				if (angular.isArray($scope.node.children) && $scope.node.children.length > 0) {
					$scope.template = ''
						+ '<div style="margin-top: 5px;">'
							+ '<accordion-group is-open="node.open">'
								+ '<accordion-heading>'
									+ '<i class="pull-left glyphicon" ng-class="{'
										+ '\'glyphicon-chevron-down\': node.open,'
										+ '\'glyphicon-chevron-right\': !node.open}">'
									+ '</i>&nbsp;'
									+ '{{ parentIndexString }}{{ nodeIndex }}. {{node.header}}'
								+ '</accordion-heading>'
	
								+ '<div class="row">'
									+ '<div class="col-md-7">'
										+ '<h3>{{ parentIndexString }}{{ nodeIndex }}. {{ node.header }}</h3>'
										+ '<h3>Deskripsi</h3>'
										+ '<div class="col-md-12">'
											+ '<p>{{ node.description }}</p>'
										+ '</div><br/>'
									+ '</div>'
	
									+ '<div class="col-md-5">'
										+ '<div class="panel panel-default">'
											+ '<div class="panel-heading clearfix">'
												+ '<div class="panel-title pull-left">'
													+ 'Delegation'
												+ '</div>'
												+ '<div class="panel-title pull-right">'
													+ '<button ng-if="isLeaderLocal" ng-click="delegateNode(node)" class="btn btn-primary btn-xs"><i class="fa fa-plus fa-xs"></i></button>'
												+ '</div>'
											+ '</div>'
											+ '<div class="panel-body">'
												+ '<div class="list-group">'
													+ '<a href="" ng-click="detail(work)" class="list-group-item" ng-repeat="object in node.delegations">'
														+ '<i class="fa" ng-class="{'
															+ '\'fa-user\': object.id !== ' + $scope.isLeader + ','
															+ '\'fa-star\': object.id == ' + $scope.isLeader 
														+ '}"></i>&nbsp;{{ object.name }}'
													+ '</a>'
												+ '</div>'
											+ '</div>'
										+ '</div>'
									+ '</div>'
								+ '</div>'
	
								+ '<div ng-if="node.forms">'
									+ '<node-form-list ng-model="node" node-controller="' + $scope.nodeController + '"></node-form-list>'
								+ '</div>'
								+ '<user-node-list ng-model="node.children" node="node" users="users" node-controller="' + $scope.nodeController + '" parent-index="' + $scope.parentIndexStringNode + '"></user-node-list>'
							+ '</accordion-group>'
						+ '</div>'
	
					$element.append($scope.template);
	
				} else {
	
					$scope.template = ''
						+ '<div style="margin-top: 5px;">'
							+ '<accordion-group>'
								+ '<accordion-heading>'
									+ '<i class="pull-left glyphicon" ng-class="{'
										+ '\'glyphicon-chevron-down\': node.open,'
										+ '\'glyphicon-chevron-right\': !node.open}">'
									+ '</i>&nbsp;'
									+ '{{ parentIndexString }}{{ nodeIndex }}. {{node.header}}'
								+ '</accordion-heading>'
	
								+ '<div class="row">'
									+ '<div class="col-md-7">'
										+ '<h3>{{ parentIndexString }}{{ nodeIndex }}. {{ node.header }}</h3>'
										+ '<h3>Deskripsi</h3>'
										+ '<div class="col-md-12">'
											+ '<p>{{ node.description }}</p>'
										+ '</div><br/>'
									+ '</div>'
	
									+ '<div class="col-md-5">'
										+ '<div class="panel panel-default">'
											+ '<div class="panel-heading clearfix">'
												+ '<div class="panel-title pull-left">'
													+ 'Delegation'
												+ '</div>'
												+ '<div class="panel-title pull-right">'
													+ '<button ng-if="isLeaderLocal" ng-click="delegateNode(node)" class="btn btn-primary btn-xs"><i class="fa fa-plus fa-xs"></i></button>'
												+ '</div>'
											+ '</div>'
											+ '<div class="panel-body">'
												+ '<div class="list-group">'
													+ '<a href="" ng-click="detail(work)" class="list-group-item" ng-repeat="object in node.delegations">'
														+ '<i class="fa" ng-class="{'
															+ '\'fa-user\': object.id !== ' + $scope.isLeader + ','
															+ '\'fa-star\': object.id == ' + $scope.isLeader 
														+ '}"></i>&nbsp;{{ object.name }}'
													+ '</a>'
												+ '</div>'
											+ '</div>'
										+ '</div>'
									+ '</div>'
	
								+ '</div>'
	
	
								+ '<div ng-if="node.forms">'
									+ '<user-node-form-list ng-model="node" node-controller="' + $scope.nodeController + '"></node-form-list>'
								+ '</div>'
								+ '<user-node-list ng-model="node.children" node="node" users="users" node-controller="' + $scope.nodeController + '" parent-index="' + $scope.parentIndexStringNode + '"></user-node-list>'
							+ '</accordion-group>'
						+ '</div>'
	
					$element.append($scope.template);
				}
	
				$compile($element.contents())($scope.$new());
			}
		};
	}
	
	function userNodeFormList ($compile) {
		return {
			restrict: 'E',
			terminal: true,
			replace: true,
			transclude: true,
			scope: {
				node: '=ngModel',
				nodes: '=',
				nodeController: '@',
			},
			controller: '@',
			name: 'nodeController',
			link: function ($scope, $element, $attrs) {
	
				$scope.template = ''
					+ '<div class="row">'
						+ '<div class="col-lg-12">'
							+ '<h3>Formulir</h3>'
							+ '<div class="row">'
								+ '<div class="col-md-6">'									
									+ '<div class="form-group has-feedback">'
										+ '<label class="control-label">Bobot Pekerjaan:&nbsp;</label>'
										+ '{{ node.weight }}'
									+ '</div>'
								+ '</div>'
							+ '</div>'
							+ '<div class="panel panel-default">'
								+ '<div class="panel-heading clearfix">'
									+ '<label class="control-label">Dafar Formulir Penugasan</label>'
								+ '</div>'
								+ '<div class="panel-body">'
									+ '<div class="row">'
										+ '<div class="col-md-12">'
											+ '<div class="table-responsive">'
												+ '<table class="table table-hover">'
													+ '<thead>'
														+ '<tr>'
															+ '<th>#</th>'
															+ '<th><a href="" ng-click="sortField = \'name\'	; reverse = !reverse">Formulir</a></th>'
															+ '<th><a href="" ng-click="sortField = \'uploader\'; reverse = !reverse">Uploader</a></th>'
															+ '<th><a href="" ng-click="sortField = \'date\'	; reverse = !reverse">Date Upload</a></th>'
															+ '<th>Action</th>'
														+ '</tr>'
													+ '</thead>'
													+ '<tbody>'
														+ '<tr ng-repeat="object in node.forms | filter:query |   orderBy:sortField:reverse track by $index">'
															+ '<td>{{ $index + 1 }}</td>'
															+ '<td>{{ object.description }}</td>'
															+ '<td>{{ object.uploads.users.name }}</td>'
															+ '<td>{{ object.uploads.created_at | date:\'dd-MM-yyyy hh:mm\' }}</td>'
															+ '<td>'
																+ '<button ng-if="isDelegate" popover="Detail" popover-trigger="mouseenter" ng-click="detailForm(object.project_form_item_id)" class="btn btn-info btn-xs"><i class="fa fa-search"></i></button>&nbsp;'
															+ '</td>'
														+ '</tr>'
													+ '</tbody>'
												+ '</table>'
											+ '</div>'
											+ '<pre>{{ isDelegate | json }}</pre>'
										+ '</div>'
									+ '</div>'
								+ '</div>'
							+ '</div>'
						+ '</div>'
					+ '</div>	'
	
				$element.append($scope.template);
	
				$compile($element.contents())($scope.$new());
			}
		}
	}
})();