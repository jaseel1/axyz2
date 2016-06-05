// Controller of expense dashboard page.
appControllers.controller('notesListCtrl', function ($scope,$state,$stateParams,$rootScope,$mdToast) {

    $scope.notes=[];
    $scope.isAnimated =  $stateParams.isAnimated;
    var token=window.localStorage.getItem('usertoken');
    if(window.localStorage.getItem('oldNotes')==null||JSON.parse(window.localStorage.getItem('oldNotes')).length==0){
      $scope.loading=true;
      getAllNotes();
    }else{
       $scope.loading=false;
       var temp=JSON.parse(window.localStorage.getItem('oldNotes'));
       $scope.notes=temp;
       $rootScope.commonnote=temp;
    }

    $scope.notes.forEach(function(notes){
     $scope.notes.date = new Date(notes.date);
    });
    //moment(time).format("YYYY-MM-DDThh:mm:ssZ");
  /* $scope.notes = $scope.notes.map(({text, date}) => {
      const d = new Date(date);
      
      return {
        text,
        month: d.getMonth() + 1, //+1 because in JS months are numbered 0 - 11, so January is 0 and so on 
        days: d.getDate(),
        time: d.getHours() + ':' + d.getMinutes()
      };
    });*/
    $scope.noteDetails=function(state,id){
        $state.go(state,{'id':id});
    }
    function getAllNotes(){

     var settings = {
          "async": true,
          "crossDomain": true,
          "url": "http://axyzventures.net/app/customer/api/v1/notes/notes",
          "method": "GET",
          "headers": {
            "x-api-key": token,
          },
          "dataType":"json"
        }

        $.ajax(settings).then(function (response) {
         $scope.$apply(function() {
          $scope.loading=false;
          if(response.status){
            window.localStorage.setItem('oldNotes',JSON.stringify(response.data));
            $scope.notes=response.data;
            $rootScope.commonnote=response.data;
          }else{
            showErrorMsg(response.message);
          }
         });
        },function(err){
          var msg=(err.responseJSON==undefined)?'Network Error':err.responseJSON.message;
          showErrorMsg(msg);
          $scope.$apply(function(){
             $scope.loading=false;
          });
        });
   }
   /*--Message function--*/
    function showErrorMsg(msg){
       $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 700,
                    position: 'bottom',
                    locals: {
                        displayOption: {
                            title: msg
                        }
                    }
                });
      }
      /*--end of message func--*/

})// End of controller 
.controller('notesDetailCtrl', function ($scope,$state,$rootScope,$stateParams, $filter, $mdBottomSheet, $mdDialog, $mdToast, $ionicHistory) {
   $scope.item=$rootScope.commonnote[$stateParams.id]; 
   var token=window.localStorage.getItem('usertoken');  
   $scope.id=$stateParams.id;
   $scope.OnBackButton=function(){
     navigator.app.backHistory();
  }
   $scope.updateNote=function(state){
       $state.go(state,{'id':$scope.id});
   }
   $scope.deleteNote=function(){
     $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: null,
            locals: {
                displayOption: {
                    title: "Confirmation",
                    content: "Do you want to delete this note?",
                    ok: "Confirm",
                    cancel: "Cancel"
                }
            }
        }).then(function () {
            if(!navigator.onLine){
                 
                 var t=window.localStorage.getItem('oldNotes');
                 if(t!=null){
                   t=JSON.parse(t);
                   t.splice($scope.id,1);
                   window.localStorage.setItem('oldNotes',JSON.stringify(t));
                   $scope.notes=t;
                   $rootScope.commonnote=t;
                   showErrorMsg("Note Deleted");
                }else{
                  window.localStorage.removeItem('oldNotes');
                }
            }else{
                var settings = {
               "async": true,
               "crossDomain": true,
               "url": "http://axyzventures.net/app/customer/api/v1/notes/notes/id/"+$scope.item.id,
               "method": "DELETE",
               "headers": {
                 "x-api-key": token
               }
             }
             $.ajax(settings).then(function (response) {
                if(response.status==1){
                 showErrorMsg("Note deleted successfully");
                  updateNoteJson();
                  $state.go('app.noteslist');
                }else{
                   showErrorMsg("Error in delete");
                }

             },function(err){
                showErrorMsg("Network error");
             });
            }
        }, function () {
            
        }); //End mdDialog
   }

/*--Message function--*/
    function showErrorMsg(msg){
       $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 700,
                    position: 'bottom',
                    locals: {
                        displayOption: {
                            title: msg
                        }
                    }
                });
      }
      /*--end of message func--*/

      function updateNoteJson(){
      var settings = {
          "async": true,
          "crossDomain": true,
          "url": "http://axyzventures.net/app/customer/api/v1/notes/notes",
          "method": "GET",
          "headers": {
            "x-api-key": token,
          },
          "dataType":"json"
        }
        $.ajax(settings).then(function (response) {
            window.localStorage.setItem('oldNotes',JSON.stringify(response.data));
        });
    }

})
.controller('notesUpdateCtrl',function($scope,$rootScope,$stateParams,$mdToast
    ,$state){

  $scope.OnBackButton=function(){
     navigator.app.backHistory();
  }
   var token=window.localStorage.getItem('usertoken');
  $scope.item=$rootScope.commonnote[$stateParams.id];
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
        today = dd+'-'+mm+'-'+yyyy;
        return today;
      }  
  var tdate=getDate(); 
  $scope.updateNoteDb=function(item){
    var settings = {
          "async": true,
          "crossDomain": true,
          "url": "http://axyzventures.net/app/customer/api/v1/notes/notes/id/"+item.id,
          "method": "PUT",
          "headers": {
            "x-api-key": token
          },
          "data": {
            "title": item.title,
            "description": item.description,
            "note_date": tdate
          }
        }
        $scope.noteTxt='Loading';
        $.ajax(settings).then(function (response) {
         $scope.$apply(function() {
              $scope.noteTxt='Update Note';
                    if(response.status==1){
                      updateNoteJson();
                      showErrorMsg(response.message);
                     // $state.go('app.noteslist');
                    }else{
                       showErrorMsg(response.message);
                    }
              },function(err){
                  $scope.$apply(function(){
                    $scope.noteTxt='Update Note';
                    var msg=(err.responseJSON==undefined)?'Network Error':err.responseJSON.message;
                    showErrorMsg(msg);
                  });
              });
        });
  }

   function updateNoteJson(){
     console.log("inside note");
      var settings = {
          "async": true,
          "crossDomain": true,
          "url": "http://axyzventures.net/app/customer/api/v1/notes/notes",
          "method": "GET",
          "headers": {
            "x-api-key": token,
          },
          "dataType":"json"
        }
        $.ajax(settings).then(function (response) {
            window.localStorage.setItem('oldNotes',JSON.stringify(response.data));
        });
    }
  /*--Message function--*/
    function showErrorMsg(msg){
       $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 700,
                    position: 'bottom',
                    locals: {
                        displayOption: {
                            title: msg
                        }
                    }
                });
      }
      /*--end of message func--*/
})
.controller('AddNotesCtrl',function($interval,$scope,$rootScope,$state,$mdToast){
  
  $scope.OnBackButton=function(){
     navigator.app.backHistory();
  }
  var logext=0;
  $interval(function(){
    logext=0;
  },2000);
  var token=window.localStorage.getItem('usertoken');
  var count=1;
  $scope.noteData = [];
  $scope.noteTxt='Save';
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
        today = dd+'-'+mm+'-'+yyyy;
        return today;
      }
  var tdate=getDate();
  $scope.title=null;
  $scope.addNewNote=function(noteData){
    if(!logext==0){
       return false;
     }
     logext++;
    if(!noteData||!noteData.title){
      showErrorMsg("Title required");
      return false;
    }    
    if(!noteData||!noteData.description){
      showErrorMsg("Description required");
      return false;
    }
    if(!navigator.onLine){
       var t;
       if(window.localStorage.getItem('oldNotes')==null){
          t=[];
        }else{
          t=JSON.parse(window.localStorage.getItem('oldNotes'));
        }
          t.push({'id':count,'title':noteData.title,'description':noteData.description,'date':moment(new Date()).format("YYYY-MM-DDThh:mm:ssZ"),'type':'local'});
          window.localStorage.setItem('oldNotes',JSON.stringify(t));
          count++;
          $scope.noteTxt='Save';
          showErrorMsg("Note added successfully");
    }else{
        var form = new FormData();
        form.append("title", noteData.title);
        form.append("description", noteData.description);
        form.append("note_date", tdate);
        $scope.noteTxt='Loading..';
        var settings = {
          "async": true,
          "crossDomain": true,
          "url": "http://axyzventures.net/app/customer/api/v1/notes/notes",
          "method": "POST",
          "headers": {
            "x-api-key": token
          },
          "processData": false,
          "contentType": false,
          "mimeType": "multipart/form-data",
          "data": form,
          "dataType":'json',
        }

        $.ajax(settings).then(function (response) {
            $scope.$apply(function() {
             $scope.noteTxt='Save';
                   if(response.status==1){
                     updateNoteJson();
                     showErrorMsg(response.message);
                    // $state.go('app.noteslist');
                   }else{
                      showErrorMsg(response.message);
                   }
             });
        },function(err){
           $scope.$apply(function(err){
              $scope.noteTxt='Save';
              showErrorMsg(err.responseJSON.message);
           });
        });
    }
  }
  /*--Message function--*/
    function showErrorMsg(msg){
       $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 700,
                    position: 'bottom',
                    locals: {
                        displayOption: {
                            title: msg
                        }
                    }
                });
      }
      /*--end of message func--*/

      function updateNoteJson(){
     console.log("inside note");
      var settings = {
          "async": true,
          "crossDomain": true,
          "url": "http://axyzventures.net/app/customer/api/v1/notes/notes",
          "method": "GET",
          "headers": {
            "x-api-key": token,
          },
          "dataType":"json"
        }
        $.ajax(settings).then(function (response) {
            window.localStorage.setItem('oldNotes',JSON.stringify(response.data));
        });
    }
})