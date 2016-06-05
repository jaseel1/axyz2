var appControllers = angular.module('starter.controllers', []); // Use for all controller of application.
var appServices = angular.module('starter.services', []);// Use for all service of application.

appControllers.controller('LoginCtrl',function($interval,$scope,$mdToast,$rootScope,$state){
   var logext=0;
	 $interval(function(){
      logext=0;
    },2000);
	 $scope.loginTxt='Log In';

     /*--login starts here---*/
     $scope.doLogin=function(loginData){
          if(!logext==0){
            return;
          }
          logext++;
          if(!loginData||!loginData.user_mail){
             showErrorMsg("Email required");
             return false;
          }
          if(!loginData||!loginData.password){
             showErrorMsg("Password required");
             return false;
          }
        $scope.loginTxt='Loading';
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "http://axyzventures.net/app/customer/api/v1/login/login",
            "method": "POST",
            "headers": {
              "content-type": "application/x-www-form-urlencoded"
            },
            "data": {
              "user_mail": loginData.user_mail,
              "password": loginData.password
            }
          }
          $.ajax(settings).then(function (response) {
            $scope.$apply(function() {
                $scope.loginTxt='Log In';
              });
              if(response.status){
                window.localStorage.setItem('usertoken',response.data.key);
                $rootScope.$broadcast('loggedIn');
                $state.go('app.menuDashboard');
              }else{
                showErrorMsg(response.message);
              }
          },function(err){
            $scope.$apply(function(){
               $scope.loginTxt='Login';
               showErrorMsg("Network error");
            })
          });
          /*--end login--*/

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
.controller('BlogsCtrl',function($scope,$rootScope,$mdToast,$state){
    $scope.loading=true;
   var token=window.localStorage.getItem('usertoken');
     var settings = {
    "async": true,
    "crossDomain": true,
    "url": "http://axyzventures.net/app/customer/api/v1/blogs/blogs",
    "method": "GET",
    "headers": {
      "x-api-key": token
    }
  }
  $.ajax(settings).then(function (response) {
       $scope.loading=false;
       if(response.status==1){
         $scope.$apply(function() {
           $scope.blogs=response.data;
           $rootScope.commonblog=response.data;
         });
       }else{
          showErrorMsg(response.message);
       }

  },function(err){$scope.$apply(function(){ $scope.loading=false; });showErrorMsg("Network error");});

  $scope.BlogDetail=function(state,id){
  	 $state.go(state,{'id':id})
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
.controller('BlogsDetailCtrl',function($scope,$stateParams,$rootScope){
   $scope.item=$stateParams.id;
   var token=window.localStorage.getItem('usertoken');
   $scope.OnBackButton=function(){
     navigator.app.backHistory();
  }
   blogsDetail();
   function blogsDetail(){
     var settings = {
      "async": true,
      "crossDomain": true,
      "url": "http://axyzventures.net/app/customer/api/v1/blogs/blogs/id/"+$scope.item,
      "method": "GET",
      "headers": {
        "x-api-key": token
      }
    }

      $.ajax(settings).then(function (response) {
        $scope.item=response.data;
      },function(){
         alert("unable to get blog details");
      });
   }
})
.controller('calanderCtrl',function($scope,$rootScope,$mdToast,$state){
   var token=window.localStorage.getItem('usertoken');
   if(window.localStorage.getItem('oldCalander')==null||JSON.parse(window.localStorage.getItem('oldCalander')).length==0){
      $scope.loading=true;
      getCalander();
    }else{
       $scope.loading=false;
       var temp=JSON.parse(window.localStorage.getItem('oldCalander'));
       $scope.calanders=temp;
       $rootScope.commoncalanders=temp;
    }
     function getCalander(){
     var settings = {
          "async": true,
          "crossDomain": true,
          "url": "http://axyzventures.net/app/customer/api/v1/meetings/meeting",
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
            $scope.calanders=response.data;
            $rootScope.commoncalanders=response.data;
            window.localStorage.setItem('oldCalander',JSON.stringify(response.data));
          }else{
            showErrorMsg(response.message);
          }
         });
        },function(err){
           $scope.$apply(function(){
              $scope.loading=false;
              var msg=(err.responseJSON==undefined)?'No meetings found':err.responseJSON.message;
              showErrorMsg(msg);
           })
        });
   }
   $scope.calanderDetail=function(state,id){
      $state.go(state,{'id':id});
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
.controller('CalanderDetailsCtrl',function($state,$scope,$stateParams,$rootScope,$mdToast,$mdDialog){
   var token=window.localStorage.getItem('usertoken');
   $scope.index=$stateParams.id;
   $scope.item=$rootScope.commoncalanders[$stateParams.id];

    $scope.OnBackButton=function(){
     navigator.app.backHistory();
  }
   $scope.updateCalander=function(state){
     $state.go(state,{'id':$scope.index});
   }
   $scope.deleteCalnder=function(id){

     $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: null,
            locals: {
                displayOption: {
                    title: "Confirmation",
                    content: "Do you want to delete this meeting?",
                    ok: "Confirm",
                    cancel: "Cancel"
                }
            }
        }).then(function () {
           if(!navigator.onLine){
              var t=window.localStorage.getItem('oldCalander');
              if(t!=null){
                   t=JSON.parse(t);
                   t.splice($scope.index,1);
                   window.localStorage.setItem('oldCalander',JSON.stringify(t));
                   $scope.calanders=t;
                   $rootScope.commoncalanders=t;
                   showErrorMsg("Meeting Deleted");
                }
              return false;
             }
             var settings = {
              "async": true,
              "crossDomain": true,
              "url": "http://axyzventures.net/app/customer/api/v1/meetings/meeting/id/"+id,
              "method": "DELETE",
              "headers": {
                "x-api-key": token
              },
              "dataType":"json"
            }
            $.ajax(settings).then(function (response) {
               if(response.status==1){
                 updateCalander();
                 showErrorMsg(response.message);
               }
            },function(err){
              console.log(JSON.stringify(err));
              showErrorMsg("An error occured");
            }
            );


        },function(){

        });
   }
   function updateCalander(){
       var settings = {
          "async": true,
          "crossDomain": true,
          "url": "http://axyzventures.net/app/customer/api/v1/meetings/meeting",
          "method": "GET",
          "headers": {
            "x-api-key": token,
          },
          "dataType":"json"
        }
       $.ajax(settings).then(function (response) {
          window.localStorage.setItem('oldCalander',JSON.stringify(response.data));
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
})
.controller('NewCalanderCtrl',function($interval,$scope,$mdToast,$cordovaDatePicker){

    var token=window.localStorage.getItem('usertoken');
    var logext=0;
    var count=0;
   $interval(function(){
      logext=0;
    },2000);
   $scope.OnBackButton=function(){
     navigator.app.backHistory();
  }
  /*--datepicker--*/
  var options = {
    date: new Date(),
    mode: 'datetime', // or 'time'
    minDate: new Date() - 10000,
    allowOldDates: true,
    allowFutureDates:true,
    doneButtonLabel: 'DONE',
    doneButtonColor: '#F2F3F4',
    cancelButtonLabel: 'CANCEL',
    cancelButtonColor: '#000000'
  };
  $scope.loadDate=function(){
    document.addEventListener("deviceready", function () {
    $cordovaDatePicker.show(options).then(function(date){
        $scope.meetingData.enddate=date;
    });
    }, false);

  }
  /*--end datepicker--*/
    $scope.meetingData=[];
    $scope.noteTxt='Save';
    var sflag=0;
    var desc='No description';
    var location='NA';
    $scope.addMeetings=function(meetingData){
      if(!logext==0){
       return false;
     }
     logext++;
      if(!meetingData||!meetingData.title){
       showErrorMsg("Title required");
       return false;
      }
      if(!meetingData||!meetingData.enddate){
        showErrorMsg("End Date required");
         return false;
      }
      if(!meetingData||!meetingData.remainder_type){
        showErrorMsg("Notification required");
        return false;
      }
      if(!meetingData||!meetingData.priority){
        showErrorMsg("Priority required");
        return false;
      }
     if(meetingData.description){
         desc=meetingData.description;
      }
      if(meetingData.location){
        location=meetingData.location;
      }
      if(!navigator.onLine){
         var t;
       if(window.localStorage.getItem('oldCalander')==null){
          t=[];
        }else{
          t=JSON.parse(window.localStorage.getItem('oldCalander'));
        }
          t.push({'id':count,'title':meetingData.title,'description':desc,'location':location,'start':moment(new Date()).format("YYYY-MM-DDThh:mm:ssZZ"),'end':moment(meetingData.enddate).format("YYYY-MM-DDThh:mm:ssZZ"),'type':'local'});
          window.localStorage.setItem('oldCalander',JSON.stringify(t));
          count++;
          $scope.noteTxt='Save';
          showErrorMsg("Meeting added successfully");
          return false;
      }
      $scope.noteTxt='Loading..';
      var settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://axyzventures.net/app/customer/api/v1/meetings/meeting",
        "method": "POST",
        "dataType":"json",
        "headers": {
          "x-api-key": token
        },
        "data": {
          "title": meetingData.title,
          "end_date": moment(meetingData.enddate).format("YYYY-MM-DDThh:mm:ssZZ"),
          "from_date":  moment(new Date()).format("YYYY-MM-DDThh:mm:ssZZ"),
          "description": desc,
          "remainder_type": meetingData.remainder,
          "priority": meetingData.priority,
          "location":location,
          "loc_lat":'9.5656676',
          "loc_long":'71.67687687'
        }
      }
      $.ajax(settings).then(function (response) {
          $scope.$apply(function() {
           $scope.noteTxt='Save';
                 if(response.status==1){
                   updateCalander();
                   showErrorMsg(response.message);

                 }else{
                    showErrorMsg(response.message);
                 }
           });
      },function(err){
        $scope.$apply(function(){
          $scope.noteTxt='Save';
        });
        console.log(JSON.stringify(err));
        showErrorMsg("Please enter correct date (dd/mm/yyyy) and it should be eariler than today date");
      });


    }

    function updateCalander(){
       var settings = {
          "async": true,
          "crossDomain": true,
          "url": "http://axyzventures.net/app/customer/api/v1/meetings/meeting",
          "method": "GET",
          "headers": {
            "x-api-key": token,
          },
          "dataType":"json"
        }
       $.ajax(settings).then(function (response) {
          window.localStorage.setItem('oldCalander',JSON.stringify(response.data));
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
})
.controller('NotificationCtrl',function($scope,$mdToast,$ionicHistory){
   var token=window.localStorage.getItem('usertoken');
      $scope.loading=true;
      $ionicHistory.clearCache();
      getAllNotifications();
      function getAllNotifications(){
         $scope.loading=true;
         var settings = {
          "async": true,
          "crossDomain": true,
          "url": "http://axyzventures.net/app/customer/api/v1/notifications/notifications",
          "method": "GET",
          "headers": {
            "x-api-key": token
          },
          "dataType":"json"
      }
        $.ajax(settings).then(function (response) {
           $scope.$apply(function(){
            $scope.loading=false;
             if(response.status==1){
               $scope.notifications=response.data;
             }else{
              showErrorMsg("An error occured");
             }
           });
        },function(err){
           console.log(JSON.stringify(err));
           $scope.$apply(function(){
            $scope.loading=false;
           });
           showErrorMsg("No notifications found");
        });
      }
      $scope.markAsRead=function(id){
        var settings = {
          "async": true,
          "crossDomain": true,
          "url": "http://architectsaxyz.com/customer/api/v1/notifications/mark_as_read/id/"+id,
          "method": "PUT",
          "headers": {
            "x-api-key": token
          }
        }
        $.ajax(settings).then(function (response) {
           if(response.status==1){
             showErrorMsg(response.message);
             getAllNotifications();
           }else{
             showErrorMsg("An error occured");
           }
        },function(err){
          showErrorMsg("Session expired please login again");
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
})
.controller('NewUserRegCtrl',function($interval,$scope,$mdToast,$state,$rootScope){

      $scope.regData=[];
      $scope.regTxt='Register';
      $interval(function(){
      logext=0;
      },2000);
      var address='NA',city='NA',state='NA',zip='NA',phone='NA',website='NA',city='NA',country='NA';
      $scope.doRegister=function(regData){
         if(!logext==0){
           return false;
         }
         logext++;
         if(!regData||!regData.name){
            showErrorMsg("Fullname required");
            return false;
         }
         if(!regData||!regData.mobile){
            showErrorMsg("Mobile number required");
            return false;
         }
         if(!regData||!regData.email){
            showErrorMsg("Email required");
            return false;
         }
         if(!regData||!regData.password){
            showErrorMsg("Password required");
            return false;
         }
         /*--setup values if user input is present--*/
         if(regData.address){
            address=regData.address;
         }
         if(regData.state){
            state=regData.state;
         }
         if(regData.country){
            country=regData.country;
         }
         if(regData.website){
            website=regData.website;
         }
         if(regData.phone){
            phone=regData.phone;
         }
         /*--end of values setup--*/
        $scope.regTxt='Loading..';
        var form = new FormData();
        form.append("name",regData.name);
        form.append("mobile",regData.mobile);
        form.append("email",regData.email);
        form.append("password",regData.password);
        form.append("street_address",address);
        form.append("state",state);
        form.append("country",country);
        form.append("website",website);
        form.append("city",'NA');
        form.append("zip",'NA');
        form.append("phone",phone);
        var settings = {
          "async": true,
          "crossDomain": true,
          "url": "http://axyzventures.net/app/customer/api/v1/login/register",
          "method": "POST",
          "processData": false,
          "contentType": false,
          "mimeType": "multipart/form-data",
          "dataType":'json',
          "data": form
        }
        $.ajax(settings).then(function (response) {
          $scope.$apply(function() {
              $scope.regTxt='Register';
              if(response.status==1){
                  window.localStorage.setItem('usertoken',response.data.key);
                  $rootScope.$broadcast('loggedIn');
                  $state.go('app.menuDashboard');
              }else{
                console.log(JSON.stringify(response));
                showErrorMsg(response.message);
              }
            });
        },function (err){
        $scope.$apply(function(){
          $scope.regTxt='Register';
        });
        showErrorMsg("Network error");
        });
      }

      $scope.forgotPassword=function(){
        var email = prompt("Please enter your email", "");
        var form = new FormData();
       form.append("email", email);
          var settings = {
            "async": true,
            "crossDomain": true,
            "url": "http://axyzventures.net/app/customer/api/v1/login/forgot_password",
            "method": "POST",
            "processData": false,
            "contentType": false,
            "mimeType": "multipart/form-data",
            "data": form,
            "dataType":"json"
          }

          $.ajax(settings).done(function (response) {
            $scope.$apply(function(){
                showErrorMsg(response.message);
            });
          });
      }
  /*--Message function--*/
  function showErrorMsg(msg){
       $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 2000,
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
.controller('UserProfileCtrl',function($scope,$rootScope,$mdToast){
   var token=window.localStorage.getItem('usertoken');
   $scope.profile=$rootScope.userprofile;
   $('#profile_img').change( function(event) {
    $scope.$apply(function(){
      $scope.loading=true;
    });
    var tmppath = URL.createObjectURL(event.target.files[0]);
     toDataUrl(tmppath, function(base64Img){
            //console.log(base64Img);
            changeProfilepic(base64Img);
        });
    });
    function changeProfilepic(image){
      var settings = {
      "async": true,
      "crossDomain": true,
      "url": "http://axyzventures.net/app/customer/api/v1/me/change_profile_pic",
      "method": "PUT",
      "headers": {
        "x-api-key":token
      },
      "data": {
        "image":image
      },
      "dataType":"json"
      }

      $.ajax(settings).then(function (response) {
         $scope.loading=false;
         if(response.status==1){
           $scope.profile.profile_pic=response.data.profile_pic;
           showErrorMsg("profile picture updated");
         }else{
           showErrorMsg(response.data.message);
         }
      },function(err){
        $scope.$apply(function(){
          $scope.loading=false;
        });
        console.log(JSON.stringify(err));
      });
    }
    function toDataUrl(url, callback, outputFormat){
        var img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function(){
            var canvas = document.createElement('CANVAS');
            var ctx = canvas.getContext('2d');
            var dataURL;
            canvas.height = this.height;
            canvas.width = this.width;
            ctx.drawImage(this, 0, 0);
            dataURL = canvas.toDataURL(outputFormat);
            callback(dataURL);
            canvas = null;
        };
        img.src = url;
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
.controller('UpdateCalanderCtrl',function($interval,$scope,$stateParams,$rootScope,$mdToast,$cordovaDatePicker){

    var token=window.localStorage.getItem('usertoken');
    $scope.meetingData=$rootScope.commoncalanders[$stateParams.id];
    $scope.noteTxt='Save';
     $interval(function(){
      logext=0;
      },2000);
     $scope.OnBackButton=function(){
      navigator.app.backHistory();
      }
      /*--datepicker--*/
  var options = {
    date: new Date(),
    mode: 'datetime', // or 'time'
    minDate: new Date() - 10000,
    allowOldDates: true,
    allowFutureDates:true,
    doneButtonLabel: 'DONE',
    doneButtonColor: '#F2F3F4',
    cancelButtonLabel: 'CANCEL',
    cancelButtonColor: '#000000'
  };
  $scope.loadDate=function(){
    document.addEventListener("deviceready", function () {
    $cordovaDatePicker.show(options).then(function(date){
        $scope.meetingData.end=date;
    });
    }, false);

  }
  /*--end datepicker--*/
    var desc='No descriptions';
    var location='NA';
    $scope.updateMeetings=function(meetingData){
      if(!logext==0){
           return false;
         }
         logext++;
      if(!meetingData||!meetingData.title){
       showErrorMsg("Title required");
       return false;
      }
      if(!meetingData||!meetingData.end){
        showErrorMsg("End Date required");
         return false;
      }
      if(!meetingData||!meetingData.remainder_type){
        showErrorMsg("Notification required");
        return false;
      }
      if(!meetingData||!meetingData.priority){
        showErrorMsg("Priority required");
        return false;
      }
      if(meetingData.description){
         desc=meetingData.description;
      }
      if(meetingData.location){
        location=meetingData.location;
      }
      if(!navigator.onLine){
         var t;
       if(window.localStorage.getItem('oldCalander')==null){
          t=[];
        }else{
          t=JSON.parse(window.localStorage.getItem('oldCalander'));
        }
          t.push({'id':count,'title':meetingData.title,'description':desc,'location':location,'start':cdate,'end':meetingData.end,'type':'local'});
          window.localStorage.setItem('oldCalander',JSON.stringify(t));
          count++;
          $scope.noteTxt='Save';
          showErrorMsg("Meeting updated successfully");
          return false;
      }
      $scope.noteTxt='Loading..';
      var settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://axyzventures.net/app/customer/api/v1/meetings/meeting/id/"+meetingData.id,
        "method": "PUT",
        "dataType":"json",
        "headers": {
          "x-api-key": token
        },
        "data": {
          "title": meetingData.title,
          "end_date": moment(meetingData.end).format("YYYY-MM-DDThh:mm:ssZZ"),
          "from_date":  moment(new Date()).format("YYYY-MM-DDThh:mm:ssZZ"),
          "description": desc,
          "remainder_type": meetingData.remainder_type,
          "priority": meetingData.priority,
          "location":location,
          "loc_lat":'9.5656676',
          "loc_long":'71.67687687'
        }
      }
      $.ajax(settings).then(function (response) {
          console.log(JSON.stringify(response));
          $scope.$apply(function() {
           $scope.noteTxt='save';
                 if(response.status==1){
                   updateCalander();
                   showErrorMsg(response.message);

                 }else{
                    showErrorMsg(response.message);
                 }
           });
      },function(err){
        $scope.$apply(function(){
          $scope.noteTxt='save';
        });
        console.log(JSON.stringify(err));
         updateCalander();
        showErrorMsg("meeting updated");
      });


    }

    function updateCalander(){
       var settings = {
          "async": true,
          "crossDomain": true,
          "url": "http://axyzventures.net/app/customer/api/v1/meetings/meeting",
          "method": "GET",
          "headers": {
            "x-api-key": token,
          },
          "dataType":"json"
        }
       $.ajax(settings).then(function (response) {
          window.localStorage.setItem('oldCalander',JSON.stringify(response.data));
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

})
.controller('EditProfileCtrl',function($interval,$scope,$mdToast,$rootScope){
  var token=window.localStorage.getItem('usertoken');

  $interval(function(){
      logext=0;
      },2000);
  $scope.OnBackButton=function(){
     navigator.app.backHistory();
  }
  $scope.regTxt='Save';
  $scope.regData=[];
  getProfile();
  function getProfile(){
        var settings = {
              "async": true,
              "crossDomain": true,
              "url": "http://axyzventures.net/app/customer/api/v1/me/me",
              "method": "GET",
              "headers": {
                "x-api-key": token
              }
            }
        $.ajax(settings).then(function (response) {
            $scope.$apply(function(){
             if(response.status==1){
                    $scope.regData=response.data;
                }
            });
        },function(err){
            console.log(JSON.stringify(err));
        });
    }
  var address='NA',city='NA',state='NA',zip='NA',phone='NA',website='NA',city='NA',country='NA';
   $scope.updateProfile=function(regData){
     if(!logext==0){
       return false;
     }
     logext++;
     if(!regData||!regData.name){
            showErrorMsg("Fullname required");
            return false;
         }
         if(!regData||!regData.mobile){
            showErrorMsg("Mobile number required");
            return false;
         }
         if(!regData||!regData.email){
            showErrorMsg("Email required");
            return false;
         }
         if(!regData||!regData.password){
            showErrorMsg("Password required");
            return false;
         }
         /*--setup values if user input is present--*/
         if(regData.street_address){
            address=regData.street_address;
         }
         if(regData.state){
            state=regData.state;
         }
         if(regData.country){
            country=regData.country;
         }
         if(regData.website){
            website=regData.website;
         }
         if(regData.phone){
            phone=regData.phone;
         }
         $scope.regTxt='Loading';
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "http://axyzventures.net/app/customer/api/v1/me/update_profile",
      "method": "PUT",
      "headers": {
        "x-api-key":token
      },
      "data": {
        "name": regData.name,
        "mobile":regData.mobile,
        "email":regData.email,
        "password":regData.password,
        "street_address":address,
        "state":state,
        "country":country,
        "website":website,
        "city":'NA',
        "zip":'NA',
        "phone":phone
      },
      "dataType":"json"
    }

    $.ajax(settings).then(function (response) {
      $scope.$apply(function(){
        $scope.regTxt='Save';
        if(response.status==1){
         $rootScope.$broadcast('profileUpdated');
         showErrorMsg(response.message);
        }
      });

    },function(err){
      $scope.$apply(function(){
        $scope.regTxt='Save';
      });
      console.log(JSON.stringify(err));
    });

   }

   /*--Message function--*/
  function showErrorMsg(msg){
       $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 2000,
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
//yyyy-mm-ddTH:i:s+Z
