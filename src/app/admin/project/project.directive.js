(function() {
    'use strict'
	angular.module('spmiFrontEnd')

		.directive('nodeList', ['$compile', nodeList])
		.directive('node', ['$compile', node])
		.directive('nodeFormList', ['$compile', nodeFormList])
    
    function nodeList ($compile) {
        return {
            restrict: 'E',
            terminal: true,
            replace: true,
            transclude: true,
            scope: {
                nodes: '=ngModel',
                node: '=',
                nodeController: '@',
                parentIndex: '@'
            },
            controller: '@',
            name: 'nodeController',
            link: function ($scope, $element, $attrs) {
    
                $scope.template = ''
                    + '<accordion close-others="false">'
                        + '<node ng-repeat="item in nodes track by $index" ng-model="item" nodes="nodes" node-index="$index + 1" parent-index="' + $scope.parentIndex + '" node-controller="' + $scope.nodeController + '"></node>'
                        + '<div class="pull-left" style="margin-top: 5px;">'
                            + '<button ng-if="!node.forms" ng-click="create(nodes)" class="btn btn-primary"><i class="fa fa-plus"></i></button>&nbsp;'
                            + '<button ng-if="parentIndex && !nodes.length && !node.forms" ng-click="createNodeForm(node)" class="btn btn-warning"><i class="fa fa-file-text-o"></i></button>'
                        + '</div>'
                    + '</accordion>'
    
                if (angular.isArray($scope.nodes)) {
                    $element.append($scope.template);
                } 
                $compile($element.contents())($scope.$new());
            }, 
        };
    }
    
    function node ($compile) {
        return {
            restrict: 'E',
            terminal: true,
            replace: true,
            transclude: true,
            scope: {
                node: '=ngModel',
                nodes: '=',
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
    
                                    + '<div class="pull-right">'
                                        + '<button ng-click="update(nodeIndex, nodes)" class="btn btn-success btn-xs"><i class="fa fa-edit fa-xs"></i></button>&nbsp;'
                                        + '<button ng-click="delete(nodeIndex, nodes)" class="btn btn-danger btn-xs"><i class="fa fa-close fa-xs"></i></button>'
                                    + '</div>'
                                + '</accordion-heading>'
    
                                + '<h3>{{ parentIndexString }}{{ nodeIndex }}. {{ node.header }}</h3>'
                                + '<h3>Deskripsi</h3>'
                                + '<div class="col-md-12">'
                                    + '<p>{{ node.description }}</p>'
                                + '</div><br/>'
                                + '<div ng-if="node.forms">'
                                    + '<node-form-list ng-model="node" node-controller="' + $scope.nodeController + '"></node-form-list>'
                                + '</div>'
                                + '<node-list ng-model="node.children" node="node" node-controller="' + $scope.nodeController + '" parent-index="' + $scope.parentIndexStringNode + '"></node-list>'
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
    
                                    + '<div class="pull-right">'
                                        + '<button ng-click="update(nodeIndex, nodes)" class="btn btn-success btn-xs"><i class="fa fa-edit fa-xs"></i></button>&nbsp;'
                                        + '<button ng-click="delete(nodeIndex, nodes)" class="btn btn-danger btn-xs"><i class="fa fa-close fa-xs"></i></button>'
                                    + '</div>'
                                + '</accordion-heading>'
    
                                + '<h3>{{ parentIndexString }}{{ nodeIndex }}. {{ node.header }}</h3>'
                                + '<h3>Deskripsi</h3>'
                                + '<div class="col-md-12">'
                                    + '<p>{{ node.description }}</p>'
                                + '</div><br/>'
                                + '<div ng-if="node.forms">'
                                    + '<node-form-list ng-model="node" node-controller="' + $scope.nodeController + '"></node-form-list>'
                                + '</div>'
                                + '<node-list ng-model="node.children" node="node" node-controller="' + $scope.nodeController + '" parent-index="' + $scope.parentIndexStringNode + '"></node-list>'
                            + '</accordion-group>'
                        + '</div>'
    
                    $element.append($scope.template);
                }
    
                $compile($element.contents())($scope.$new());
            }
        };
    }


    function nodeFormList ($compile) {
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
                                        + '<label class="control-label">Bobot Pekerjaan</label>&nbsp;<label style="color: #a94442;">*</label>'
                                        + '<input type="number" ng-model="node.weight" name="name" class="form-control">'
                                    + '</div>'
                                + '</div>'
                            + '</div>'
                            + '<label class="control-label">Dafar Formulir Penugasan</label>&nbsp;<label style="color: #a94442;">*</label>'
                            + '<div class="panel panel-default">'
                                + '<div class="panel-heading clearfix">'
                                    + '<div class="panel-title pull-left">'
                                        + '<div class="form-inline">'
                                            + '<div class="form-group">'
                                                + '<button ng-click="createNodeFormItem(node)" class="btn btn-primary btn-xs"><i class="fa fa-plus fa-xs"></i></button>'
                                            + '</div>'
                                        + '</div>'
                                    + '</div>'
                                    + '<div class="pull-right">'
                                        + '<button ng-click="deleteNodeForm(node)" class="btn btn-danger btn-xs"><i class="fa fa-close fa-xs"></i></button>'
                                    + '</div>'
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
                                                            + '<th>Action</th>'
                                                        + '</tr>'
                                                    + '</thead>'
                                                    + '<tbody>'
                                                        + '<tr ng-repeat="object in node.forms | filter:query |   orderBy:sortField:reverse track by $index">'
                                                            + '<td>{{ $index + 1 }}</td>'
                                                            + '<td>{{ object.description }}</td>'
                                                            + '<td>'
                                                                + '<button popover="Update" popover-trigger="mouseenter" ng-click="updateNodeFormItem($index, node.forms, node)" class="btn btn-success btn-xs"><i class="fa fa-edit"></i></button>&nbsp;|&nbsp;'
                                                                + '<button popover="Delete" popover-trigger="mouseenter" ng-click="deleteNodeFormItem($index, node.forms)" class="btn btn-danger btn-xs"><i class="fa fa-close"></i></button>'
                                                            + '</td>'
                                                        + '</tr>'
                                                    + '</tbody>'
                                                + '</table>'
                                            + '</div>'
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




