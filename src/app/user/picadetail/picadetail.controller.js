(function(angular) {
  'use strict';

  angular.module('spmiFrontEnd')
    .controller('picaDetailController', picaDetailController)

  function picaDetailController(DetailsPica) {
    var vm = this;

    vm.detail = DetailsPica;
    
    vm.detailModified = [];
    
    for (var i = 0; i < vm.detail.length; i++) {

      if (vm.detail[i].pica_details) {

        //has pica_details
        if (vm.detail[i].pica_details.length > 0) {
          for (var j = 0; j < vm.detail[i].pica_details.length; j++) {

            vm.detailModified.push({
              index: i,
              nodeDescription: {
                value: (j == 0) ? vm.detail[i].project_node.description : '',
                size: vm.detail[i].pica_details.length,
              },
              problemDetail: vm.detail[i].pica_details[j].problemDetail,
              rencana: vm.detail[i].pica_details[j].rencana,
              userName: vm.detail[i].pica_details[j].user.name,
              expdate: vm.detail[i].pica_details[j].expdate,
              upload: vm.detail[i].pica_details[j].pica_detail_upload
            })
            
          }
        } else {

            // empty pica_detail 
          vm.detailModified.push({
            index: i,
            nodeDescription: {
              value: vm.detail[i].project_node.description,
              size: 1,
            },
            problemDetail: 'n/a',
            rencana: 'n/a',
            userName: 'n/a',
            expdate: 'n/a',
            upload: 'n/a'
          })
        }
      
      } else {

        //has no pica detail
        
        vm.detailModified.push({
          index: i,
          nodeDescription: {
            value: vm.detail[i].projectnode.description,
            size: 1,
          },
          problemDetail: vm.detail[i].problemDetail,
          rencana: vm.detail[i].rencana,
          userName: vm.detail[i].user.name,
          expdate: vm.detail[i].expdate,
          upload: vm.detail[i].pica_details[j].pica_detail_upload
        });
        


      }
      
    }
    

    return vm;
  }
})(angular);