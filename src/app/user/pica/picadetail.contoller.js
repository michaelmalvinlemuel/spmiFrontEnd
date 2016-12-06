(function(angular) {

  'use strict';

	angular.module('spmiFrontEnd')
    .controller('picadetailcontroller', picadetailcontroller)

  function picadetailcontroller($state, picadetails, users, PicaService) {
    var vm = this;
    var mindate = new Date();
    vm.picadetails = picadetails;
    
    vm.mindate = mindate.getDate();
    vm.maxdate = "3000-12-31";
    vm.input = {};
    vm.input.assignment = [{
    picaid: vm.picadetails.id,
		problem:'',
		corrective:'',
		user: '',
		expdate:''
	}];

	  vm.user = users;
    vm.addNew = function (object) {
      if (object) {
        var newinput = {
      picaid: vm.picadetails.id,
			problem: object.problem,
			corrective: object.corrective,
			user: object.user,
			expdate: $filter('date')(object.expdate,'yyyy-MM-dd')
		}

		vm.input.assignment.push(newinput);
    } else {

		  vm.input.assignment.push({picaid:vm.picadetails.id, problem: '', corrective: '',user: '',expdate: ''});
	  }
      
    }
    vm.disabled = function(date, mode) {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
     };

    vm.submit = function(){
      console.log(vm.input)
      PicaService.store(vm.input)
      .then (function(data){
        $state.go('main.user.pica.detail', null, { reload: true });
      })
    };

 
	 vm.deleteNode = function(object, index) {
            var cnf = confirm('Apakah Anda yakin ingin menghapus assignment ini?')
            if (cnf == true) {
                vm.input.assignment.splice(index, 1);
            }
        }
    vm.indicator = function (score,indicator){
      for(var i=0; i < indicator.length; i++){
        //alert(score);
        if (Math.floor(score) == indicator[i].value)
        {
          return indicator[i].description;
        }

      }
  
    }
     
    return vm;
  }

})(angular);
