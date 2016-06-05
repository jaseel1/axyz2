// Controller of menu toggle.
// Learn more about Sidenav directive of angular material
// https://material.angularjs.org/latest/#/demo/material.components.sidenav
appControllers.controller('menuCtrl', function ($interval,$scope, $timeout, $mdUtil, $mdSidenav, $log, $ionicHistory, $state, $ionicPlatform, $mdDialog, $mdBottomSheet, $mdMenu, $mdSelect,$rootScope) {

    var token;
    $scope.profile=[];
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
      StatusBar.backgroundColorByHexString("263238");
    }
    $scope.profile.profile_pic='img/default-profile.jpg';
    $scope.profile.email='loading..';
    $scope.isLoaded=false;
    $rootScope.$on("loggedIn", function(){
    token=window.localStorage.getItem('usertoken');
    console.log("token"+token);
    //do something
    if(window.localStorage.getItem('usertoken')==null){
        $scope.showAuth=true;
        $scope.showOthers=false;
     }else{
        $scope.showAuth=false;
        $scope.showOthers=true;
        getProfile();
        }
     });
    $rootScope.$on('profileUpdated',function(){
        console.log('profile updated');
        token=window.localStorage.getItem('usertoken');
        resetUpdate();
    });
    function resetUpdate(){
        /*--ajax start--*/
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
                console.log("res update"+response);
                $scope.$apply(function(){
                 if(response.status==1){
                        $scope.profile=response.data;
                        $rootScope.userprofile=response.data;
                    }
                });
            },function(err){
                console.log(JSON.stringify(err));
            });
            /*--ajax end--*/
    }
    function getProfile(){
            var interval=$interval(function(){
            /*--ajax start--*/
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
                console.log("res"+response);
                $scope.$apply(function(){
                 if(response.status==1){
                        $interval.cancel(interval);
                        $scope.profile=response.data;
                        $rootScope.userprofile=response.data;
                    }
                });
            },function(err){
                console.log(JSON.stringify(err));
            });
            /*--ajax end--*/
            },4000);
    }
     if(window.localStorage.getItem('usertoken')==null){
        $scope.showAuth=true;
        $scope.showOthers=false;
     }else{
        token=window.localStorage.getItem('usertoken');
        getProfile();
        $scope.showAuth=false;
        $scope.showOthers=true;
     }
    $scope.toggleLeft = buildToggler('left');

     $scope.logout=function(){
       $mdSidenav('left').close();
       window.localStorage.removeItem('usertoken');
       window.localStorage.removeItem('oldNotes');
       window.localStorage.removeItem('oldCalander');
       window.localStorage.removeItem('oldTodos');
       window.localStorage.removeItem('isDash');
       $state.go('app.fakeLogin');
     }
    // buildToggler is for create menu toggle.
    // Parameter :
    // navID = id of navigation bar.
    function buildToggler(navID) {
        var debounceFn = $mdUtil.debounce(function () {
            $mdSidenav(navID).toggle();
        }, 0);
        return debounceFn;
    };// End buildToggler.

    // navigateTo is for navigate to other page
    // by using targetPage to be the destination state.
    // Parameter :
    // stateNames = target state to go
    $scope.navigateTo = function (stateName) {
        console.log(stateName);
        $timeout(function () {
            $mdSidenav('left').close();
            if ($ionicHistory.currentStateName() != stateName) {
                $ionicHistory.nextViewOptions({
                    disableAnimate: true,
                    disableBack: true
                });
                $state.go(stateName);
            }
        }, ($scope.isAndroid == false ? 300 : 0));
    };// End navigateTo.

    //closeSideNav is for close side navigation
    //It will use with event on-swipe-left="closeSideNav()" on-drag-left="closeSideNav()"
    //When user swipe or drag md-sidenav to left side
    $scope.closeSideNav = function(){
        $mdSidenav('left').close();
    };
    //End closeSideNav

    //  $ionicPlatform.registerBackButtonAction(callback, priority, [actionId])
    //
    //     Register a hardware back button action. Only one action will execute
    //  when the back button is clicked, so this method decides which of
    //  the registered back button actions has the highest priority.
    //
    //     For example, if an actionsheet is showing, the back button should
    //  close the actionsheet, but it should not also go back a page view
    //  or close a modal which may be open.
    //
    //  The priorities for the existing back button hooks are as follows:
    //  Return to previous view = 100
    //  Close side menu         = 150
    //  Dismiss modal           = 200
    //  Close action sheet      = 300
    //  Dismiss popup           = 400
    //  Dismiss loading overlay = 500
    //
    //  Your back button action will override each of the above actions
    //  whose priority is less than the priority you provide. For example,
    //  an action assigned a priority of 101 will override the ‘return to
    //  previous view’ action, but not any of the other actions.
    //
    //  Learn more at : http://ionicframework.com/docs/api/service/$ionicPlatform/#registerBackButtonAction

    $ionicPlatform.registerBackButtonAction(function(){
     navigator.app.backHistory()
       /*) if($mdSidenav("left").isOpen()){
            //If side navigation is open it will close and then return
            $mdSidenav('left').close();
        }
        else if(jQuery('md-bottom-sheet').length > 0 ) {
            //If bottom sheet is open it will close and then return
            $mdBottomSheet.cancel();
        }
        else if(jQuery('[id^=dialog]').length > 0 ){
            //If popup dialog is open it will close and then return
            $mdDialog.cancel();
        }
        else if(jQuery('md-menu-content').length > 0 ){
            //If md-menu is open it will close and then return
            $mdMenu.hide();
        }
        else if(jQuery('md-select-menu').length > 0 ){
            //If md-select is open it will close and then return
            $mdSelect.hide();
        }

        else{

            // If control :
            // side navigation,
            // bottom sheet,
            // popup dialog,
            // md-menu,
            // md-select
            // is not opening, It will show $mdDialog to ask for
            // Confirmation to close the application or go to the view of lasted state.

            // Check for the current state that not have previous state.
            // It will show $mdDialog to ask for Confirmation to close the application.
            $ionicHistory.goBack();

        }*/

    },100);
    //End of $ionicPlatform.registerBackButtonAction

}); // End of menu toggle controller.
