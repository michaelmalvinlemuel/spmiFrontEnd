(function() {
    'use strict'
	angular.module('spmiFrontEnd')

		.directive('nodeList', ['$compile', nodeList])
		.directive('node', ['$compile', node])
		.directive('nodeFormList', ['$compile', nodeFormList])
    
    function nodeList ($compile) {
        return {
            restrict: 'E',												//PROJECT PHASE
            terminal: true,												// * 1 = Creation - Admin Stuff
            replace: true,												// * 2 = Delegation - User Stuff
            transclude: true,											// * 3 = Modification - Admin Stuff
            scope: {													// * 4 = Execution - User Stuff
                nodes: '=ngModel',										// * 5 = Assessment - Admin Stuff
                node: '=',												// * 6 = Completion - Admin Stuff
				users: '=',                                             // * 7 = Termination - Admin Stuff
				setting: '=',
                nodeController: '@',
                parentIndex: '@'
            },
            controller: '@',
            name: 'nodeController',
            link: function ($scope, $element, $attrs) {
    
                $scope.template = ''
                    + '<accordion close-others="false">'
                        + '<node ng-repeat="item in nodes track by $index" ng-model="item" nodes="nodes" users="users" setting="setting" node-index="$index + 1" parent-index="' + $scope.parentIndex + '" node-controller="' + $scope.nodeController + '"></node>'
                        
                        //button for add project node or project node form only available when Creation or Modification
                        + '<div ng-if="setting.editableNode" class="pull-left" style="margin-top: 5px;">'
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
                users: '=',
                setting: '=',
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
                
                $scope.template = ''
                    + '<div style="margin-top: 5px;">'
                        + '<accordion-group is-open="node.open">'
                            + '<accordion-heading>'
                                + '<i class="pull-left glyphicon" ng-class="{'
                                    + '\'glyphicon-chevron-down\': node.open,'
                                    + '\'glyphicon-chevron-right\': !node.open}">'
                                + '</i>&nbsp;'
                                + '{{ parentIndexString }}{{ nodeIndex }}. {{node.header}}'
                                //can update or delete node when Creation and Modification
                                + '<div ng-if="setting.editableNode" class="pull-right">'
                                    + '<button ng-click="update(nodeIndex, nodes)" class="btn btn-success btn-xs"><i class="fa fa-edit fa-xs"></i></button>&nbsp;'
                                    + '<button ng-click="delete(nodeIndex, nodes)" class="btn btn-danger btn-xs"><i class="fa fa-close fa-xs"></i></button>'
                                + '</div>'
                            + '</accordion-heading>'
                            
                          
                            
                            //show delegation each project node
                            + '<div ng-if="setting.showDelegatoin" class="row">'
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
                                                //show delegation button for leader
                                                + '<button ng-if="setting.delegatable" ng-click="delegateNode(node)" class="btn btn-primary btn-xs"><i class="fa fa-plus fa-xs"></i></button>'
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
                            
                            //don't show delegation user list. because project just created
                            + '<div ng-if="!setting.showDelegation" class="row">'
                                + '<div class="col-md-12">'
                                    + '<h3>{{ parentIndexString }}{{ nodeIndex }}. {{ node.header }}</h3>'
                                    + '<h3>Deskripsi</h3>'
                                    + '<div class="col-md-12">'
                                        + '<p>{{ node.description }}</p>'
                                    + '</div><br/>'
                                + '</div>'
                            + '</div>'
                            
                            //if has forms and the end of project node
                            + '<div ng-if="node.forms">'
                                + '<node-form-list ng-model="node" users="users" setting="setting" node-controller="' + $scope.nodeController + '"></node-form-list>'
                            + '</div>'
                            //if has not form and still had children
                            + '<div ng-if="!node.forms">'
                                + '<node-list ng-model="node.children" node="node" users="users" setting="setting" node-controller="' + $scope.nodeController + '" parent-index="' + $scope.parentIndexStringNode + '"></node-list>'
                            + '</div>'
                            
                        + '</accordion-group>'
                    + '</div>'
                    
                        
             
                
                $element.append($scope.template);
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
                setting: '=',
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
                                        
                                        //show mandatory mark when editable weight true
                                        + '<label class="control-label">Bobot Pekerjaan</label>&nbsp;<label ng-if="setting.editableWeight" style="color: #a94442;">*</label>'
                                        + '<input ng-if="setting.editableWeight" type="number" min="0" max="100" step="0.01" ng-model="node.weight" name="name" class="form-control">'
                                        // show weight when not Creation and Modification 
                                        + '<span ng-if="!setting.editableWeight">&nbsp;:&nbsp;{{ node.weight }}</span>'
                                    + '</div>'
                                + '</div>'
                                
                                //show score input group
                                + '<div ng-if="setting.showScore" class="col-md-6">'									
                                    + '<div class="form-group has-feedback">'
                                        //show mandatory mark when editable weight true
                                        + '<label class="control-label">Score Penilaian</label>&nbsp;<label ng-if="setting.editableScore" style="color: #a94442;">*</label>'
                                        + '<input ng-if="setting.editableScore" type="number" min="0" max="4" step="0.01" ng-model="node.score" name="name" class="form-control">'
                                        // show score when Compelition or Termination 
                                        + '<span ng-if="!setting.editableScore">&nbsp;:&nbsp;</span>{{ node.score }}'
                                    + '</div>'
                                + '</div>'
                            + '</div>'
                            
                            + '<label class="control-label">Dafar Formulir Penugasan</label>&nbsp;<label ng-if="setting.editableNode" style="color: #a94442;">*</label>'
                            + '<div class="panel panel-default">'
                                + '<div class="panel-heading clearfix">'
                                
                                    //can add Form Panel when Creation or Modification
                                    + '<div ng-if="setting.editableNode" class="panel-title pull-left">'
                                        + '<div class="form-inline">'
                                            + '<div class="form-group">'
                                                + '<button ng-click="createNodeFormItem(node)" class="btn btn-primary btn-xs"><i class="fa fa-plus fa-xs"></i></button>'
                                            + '</div>'
                                        + '</div>'
                                    + '</div>'
                                    
                                    //can delete Form Panel when Creation or Modification
                                    + '<div ng-if="setting.editableNode" class="pull-right">'
                                        + '<button ng-click="deleteNodeForm(node)" class="btn btn-danger btn-xs"><i class="fa fa-close fa-xs"></i></button>'
                                    + '</div>'
                                    
                                    //replace add and delete button if not Creation or Modification
                                    + '<label ng-if="!setting.editableNode" class="control-label">Dafar Formulir Penugasan</label>'
                                    
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
															//showing uploaded form header
                                                            + '<th ng-if="setting.showFormUpload"><a href="" ng-click="sortField = \'uploader\'; reverse = !reverse">Uploader</a></th>'
															+ '<th ng-if="setting.showFormUpload"><a href="" ng-click="sortField = \'date\'	; reverse = !reverse">Date Upload</a></th>'
															+ '<th>Action</th>'
														+ '</tr>'
													+ '</thead>'
                                                    + '<tbody>'
                                                        + '<tr ng-repeat="object in node.forms | filter:query |   orderBy:sortField:reverse track by $index">'
                                                            + '<td>{{ $index + 1 }}</td>'
                                                            + '<td>{{ object.description }}</td>'
                                                            //showing uploaded form detail
                                                            + '<td ng-if="setting.showFormUpload">{{ object.uploads.users.name }}</td>'
															+ '<td ng-if="setting.showFormUpload">{{ object.uploads.created_at | date:\'dd-MM-yyyy hh:mm\' }}</td>'
                                                            //show when editable node mode
                                                            + '<td ng-if="setting.editableNode">'
                                                                + '<a ng-href="{{ $root.API_HOST }}/upload/form/{{ object.document }}" target="_blank" class="btn btn-info btn-xs"><i class="fa fa-arrow-down"></i></a>&nbsp;|&nbsp;'
                                                                + '<button popover="Update" popover-trigger="mouseenter" ng-click="updateNodeFormItem($index, node.forms, node)" class="btn btn-success btn-xs"><i class="fa fa-edit"></i></button>&nbsp;|&nbsp;'
                                                                + '<button popover="Delete" popover-trigger="mouseenter" ng-click="deleteNodeFormItem($index, node.forms)" class="btn btn-danger btn-xs"><i class="fa fa-close"></i></button>'
                                                            + '</td>'
                                                            
                                                            //cannot show details when creation or Modification
                                                            + '<td ng-if="!setting.editableNode">'
                                                                //hide download master form when Delegation or user not delegate but shows when Assessment
                                                                + '<a ng-if="isDelegate" ng-href="{{ $root.API_HOST }}/upload/form/{{ object.document }}" target="_blank" class="btn btn-info btn-xs"><i class="fa fa-arrow-down"></i></a>'
                                                                
                                                                //show detail when user delegate and when not Delegation and not Assessment
                                                                + '<span ng-if="isDelegate && setting.editableFormUpload">&nbsp;|&nbsp;</span>'
                                                                + '<button ng-if="isDelegate && setting.editableFormUpload" popover="Detail" popover-trigger="mouseenter" ng-click="detailForm(object.project_form_item_id)" class="btn btn-info btn-xs"><i class="fa fa-search"></i></button>'
                                                                
                                                                //show download last uploaded form when Assessment
                                                                + '<span ng-if="isDelegate && setting.showFormUpload && object.uploads.upload">&nbsp;|&nbsp;</span>'
                                                                + '<a ng-if="isDelegate && setting.showFormUpload && object.uploads.upload" ng-href="{{ $root.API_HOST }}/upload/project/{{ object.uploads.upload }}" target="_blank" class="btn btn-success btn-xs"><i class="fa fa-arrow-down"></i></a>'
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




