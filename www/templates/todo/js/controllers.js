// Controller of expense dashboard page.
appControllers.controller('todoListCtrl', function ($scope,$state,$stateParams,$rootScope,$mdDialog,$mdToast) {

    //$scope.isAnimated is the variable that use for receive object data from state params.
    //For enable/disable row animation.
    $scope.isAnimated =  $stateParams.isAnimated;
    var token=window.localStorage.getItem('usertoken');
    if(window.localStorage.getItem('oldTodos')==null||JSON.parse(window.localStorage.getItem('oldTodos')).length==0){
      $scope.loading=true;
      getAllTodo();
    }else{
       $scope.loading=false;
       var temp=JSON.parse(window.localStorage.getItem('oldTodos'));
       $scope.todos=temp;
       $rootScope.commontodo=temp;
    }
    $scope.editNote=function(id){
        $state.go('app.updatetodo',{'id':id});
    }
    $scope.ch=false;
    $scope.changeText=function(val){
    }
  function getAllTodo(){

    var settings = {
    "async": true,
    "crossDomain": true,
    "url": "http://axyzventures.net/app/customer/api/v1/todo/todo",
    "method": "GET",
    "headers": {
      "x-api-key": token
    }
  }

  $.ajax(settings).then(function (response) {
     $scope.$apply(function(){
          $scope.loading=false;
          $scope.todos=response.data;
          window.localStorage.setItem('oldTodos',JSON.stringify(response.data));
          $rootScope.commontodo=response.data;
       });
  },function(err){console.log("error"+JSON.stringify(err));
          $scope.$apply(function(){
          $scope.loading=false;
          $scope.todos=[];
          $scope.todoFlag=true;
       });});
}

$scope.deleteTodo=function(id,index){
     $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: null,
            locals: {
                displayOption: {
                    title: "Confirmation",
                    content: "Do you want to delete this todo?",
                    ok: "Confirm",
                    cancel: "Cancel"
                }
            }
        }).then(function () {
             if(!navigator.onLine){
               var t=window.localStorage.getItem('oldTodos');
              if(t!=null){
               t=JSON.parse(t);
               t.splice(index,1);
               window.localStorage.setItem('oldTodos',JSON.stringify(t));
               $scope.todos=t;
               $rootScope.commontodo=t;
               showErrorMsg("Todo Deleted");
              }
              return false;
            }
            var settings = {
            "async": true,
            "crossDomain": true,
            "url": "http://axyzventures.net/app/customer/api/v1/todo/todo/id/"+id,
            "method": "DELETE",
            "headers": {
              "x-api-key": token
            },
            "dataType":"json"
          }
        $.ajax(settings).then(function (response) {
           if(response.status==1){
             getAllTodo();
             showErrorMsg(response.message);
           }else{
             showErrorMsg(response.message);
           }
        },function (err){
           console.log("error"+JSON.stringify(err));
           $scope.$apply(function(){
              $scope.loading=false;
              $scope.todos=[];
             });
          });
        },function(){

        });
}
/*--Message function--*/
    function showErrorMsg(msg){
       $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 700,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: msg
                        }
                    }
                });
      }
      /*--end of message func--*/
})// End of controller expense dashboard.
.controller('NewToDoCtrl', function ($interval,$scope,$stateParams, $filter, $mdBottomSheet, $mdDialog, $mdToast, $ionicHistory,$rootScope) {
 var logext=0;
   $interval(function(){
      logext=0;
    },2000);

   $scope.OnBackButton=function(){
     navigator.app.backHistory();
  }
 var token=window.localStorage.getItem('usertoken');
 $scope.noteTxt='Save';
 $scope.todo=[];
 var count=0;
 function getDate(){
       var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        if(dd<10) {
            dd='0'+dd
        }
        if(mm<10) {
            mm='0'+mm
        }
        var h=today.getHours(); // => 9
        var m=today.getMinutes(); // =>  30
        var s=today.getSeconds(); // => 5
        today = dd+'-'+mm+'-'+yyyy+'-'+h+'-'+m+'-'+s;
        return today;
    }

 $scope.addTodo=function(todo){
     if(!logext==0){
       return false;
     }
     logext++;
     var d=getDate();
    if(!todo.description){
         showErrorMsg("Todo note required");
         return false;
       }
       if(!navigator.onLine){
               var t;
               if(window.localStorage.getItem('oldTodos')==null){
                  t=[];
                }else{
                  t=JSON.parse(window.localStorage.getItem('oldTodos'));
                }

                  t.push({'id':count,'note':todo,'create_date':moment(new Date()).format("YYYY-MM-DDThh:mm:ssZ"),'completed_date':'0000-00-00 00:00:00','type':'local'});
                  window.localStorage.setItem('oldTodos',JSON.stringify(t));
                  count++;
                  window.localStorage.setItem('isTodoSync',true)
                  $scope.noteTxt='Save';
                  showErrorMsg("Todo added successfully");
            }else{
                $scope.noteTxt='Loading..';
                  var settings = {
                  "async": true,
                  "crossDomain": true,
                  "url": "http://axyzventures.net/app/customer/api/v1/todo/todo",
                  "method": "POST",
                  "headers": {
                    "x-api-key": token
                  },
                  "data": {
                    "note": todo.description
                  },
                  "dataType":"json"
                }
                $.ajax(settings).then(function (response) {
                  $scope.$apply(function(){
                    $scope.noteTxt='Save';
                    if(response.status){
                      getAllTodo();
                      showErrorMsg(response.message);
                    }else{
                      showErrorMsg(response.message);
                    }
                  })
                },function(err){
                    $scope.$apply(function(){
                    $scope.noteTxt='Save';
                    console.log("err"+JSON.stringify(err));
                    showErrorMsg("An error occured try again");
                  });
                });
            }
 }

 function getAllTodo(){

    var settings = {
    "async": true,
    "crossDomain": true,
    "url": "http://axyzventures.net/app/customer/api/v1/todo/todo",
    "method": "GET",
    "headers": {
      "x-api-key": token
    }
  }

  $.ajax(settings).then(function (response) {
     $scope.$apply(function(){
          $scope.loading=false;
          $scope.todos=response.data;
          window.localStorage.setItem('oldTodos',JSON.stringify(response.data));
          $rootScope.commontodo=response.data;
       });
  },function(err){console.log("error"+JSON.stringify(err));
          $scope.$apply(function(){
          $scope.loading=false;
          $scope.todos=[];
          $scope.todoFlag=true;
       });});
}
 /*--Message function--*/
    function showErrorMsg(msg){
       $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 700,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: msg
                        }
                    }
                });
      }
      /*--end of message func--*/
})
.controller('TodoUpdateCtrl',function($scope,$stateParams,$rootScope,$mdToast){
    $scope.item=$rootScope.commontodo[$stateParams.id];
    $scope.noteTxt='Save';

    $scope.OnBackButton=function(){
     navigator.app.backHistory();
  }
    var token=window.localStorage.getItem('usertoken');
    $scope.updateTodo=function(item){
     $scope.noteTxt='Loading..';
     var settings = {
          "async": true,
          "crossDomain": true,
          "url": "http://axyzventures.net/app/customer/api/v1/todo/todo/id/"+item.to_do_id,
          "method": "PUT",
          "headers": {
            "x-api-key": token
          },
          "data": {
            "note": item.note
          },
          "dataType":"json"
        }
      $.ajax(settings).then(function (response) {
        $scope.$apply(function(){
            $scope.noteTxt='Save';
        });
        if(response.status==1){
          showErrorMsg(response.message);
        }else{
          showErrorMsg(response.message);
        }
      },function(err){
         console.log(JSON.stringify(err));
         $scope.$apply(function(){
           updateTodoJson();
           $scope.noteTxt='Save';
           showErrorMsg("Note required");
         });
      });
   }
   function updateTodoJson(){
      var settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://axyzventures.net/app/customer/api/v1/todo/todo",
        "method": "GET",
        "headers": {
          "x-api-key": token
        }
      }
      $.ajax(settings).then(function (response) {
         window.localStorage.setItem('oldTodos',JSON.stringify(response.data));
      });
    }
   /*--Message function--*/
    function showErrorMsg(msg){
       $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 700,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: msg
                        }
                    }
                });
      }
      /*--end of message func--*/

});
