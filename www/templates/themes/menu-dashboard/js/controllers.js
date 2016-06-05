// Controller of menu dashboard page.
appControllers.controller('menuDashboardCtrl', function ($scope, $mdToast,$rootScope) {
    //ShowToast for show toast when user press button.
    var token=window.localStorage.getItem('usertoken');
    if(window.localStorage.getItem('isDash')==null){
       $scope.displayTitle='';
       window.localStorage.setItem('isDash',true);
    }else{
       $scope.displayTitle='';
    }
    $scope.loading=true;
    $scope.showToast = function (menuName) {
        //Calling $mdToast.show to show toast.
        $mdToast.show({
            controller: 'toastController',
            templateUrl: 'toast.html',
            hideDelay: 800,
            position: 'top',
            locals: {
                displayOption: {
                    title: 'Going to ' + menuName + " !!"
                }
            }
        });
    }// End showToast.

    getDashBoard();
    function getDashBoard(){
        var settings = {
          "async": true,
          "crossDomain": true,
          "url": "http://axyzventures.net/app/customer/api/v1/dashboard/dashboard",
          "method": "GET",
          "headers": {
            "x-api-key": token
          }
        }
$scope.dashboard=[];
$.ajax(settings).then(function (response) {
   $scope.loading=false;
   $scope.dashboard=response.data;
},function(){
    console.log("Unable to load dashboard data");
});
    }
});// End of controller menu dashboard.