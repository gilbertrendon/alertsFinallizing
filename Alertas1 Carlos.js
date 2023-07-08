define(['modules/platform/platformModule'], function () {
  angular.module('platformModule')
  
  
  .service("formServiceAlerts", function(){
      var formServiceAlerts = [];
      return formServiceAlerts;
  })
  
  .controller('ServiceAlertController',['$scope', 'w6serverServices', '$location', 'formServiceAlerts', function ($scope, w6serverServices, $location, formServiceAlerts) {
  //Define parameters and functions of custom controller with the $scope
      
      populatePanelData();
      
      function populatePanelData() {
          //este metodo consulta las ServiceAlert existentes para la tarea y genera la tabla con los resultados
          
          //Variables para recopilar datos
          $scope.serviceAlerts = [];
          $scope.serviceAlertsStatusFlows = [];
          $scope.followUpActionsValues = [];
          
          if(formServiceAlerts.length!==0){
              $scope.serviceAlerts = formServiceAlerts;
          }
          else{
              var taskKey = $scope.formInfo.object.Key;
              if (taskKey == -1)
                  return;
                  
              //Variables para recopilar datos
              var ServiceAlertQuery = {filter: "ReferencedTask/Key eq " + taskKey,};
                  
              //Se consultan las transiciones
              var ServiceAlertStatuses = w6serverServices.getStatusFlow("ServiceAlert","ServiceAlertStatus",false);
                  
              //Se consultan las Acciones
              var FollowUpActions = w6serverServices.getStatusFlow("ServiceAlert","FollowUpAction",true);
                  
              //Se realiza consulta de ServiceAlerts asociados a la tarea
              var reqServiceAlerts = w6serverServices.getObjects("ServiceAlert", ServiceAlertQuery, false);
                  
              const promises = [ServiceAlertStatuses.$promise, FollowUpActions.$promise, reqServiceAlerts.$promise];
              Promise.all(promises).then(
                  function(promisesResult)
                  {
                      for (var i = 0; i < promisesResult[0].length; i++) {
                          if(promisesResult[0][i].StatusTransitionType === "AllowStatusChange"){
                          $scope.serviceAlertsStatusFlows.push(promisesResult[0][i]);
                          }
                      }
                      
                      for (var i = 0; i < promisesResult[1].length; i++) {
                          if(promisesResult[1][i].StatusTransitionType === "AllowStatusChange"){
                              $scope.followUpActionsValues.push(promisesResult[1][i]);
                          }
                      }
                      
                      if(promisesResult[2].length>0){
                          document.getElementById("AlertHeader").style.display = "block";
                          document.getElementById("AlertData").style.display = "block";
                          document.getElementById("NoAlert").style.display = "none";
                      /*
                          for (var i = 0; i < promisesResult[2].length; i++) {
                              promisesResult[2][i].StatusOptions = getAllowedTransitions(promisesResult[2][i].ServiceAlertStatus, $scope.serviceAlertsStatusFlows);
                              for (y = 0; y < promisesResult[2][i].StatusOptions.length; y++) {if(promisesResult[2][i].StatusOptions[y].Value === promisesResult[2][i].ServiceAlertStatus.Key){promisesResult[2][i].CurrentStatus = promisesResult[2][i].StatusOptions[y];}} 
                              //promisesResult[2][i].CurrentFollowUpAction = [];
                              promisesResult[2][i].changeDetected = false;
                              promisesResult[2][i].FollowUpActionOptions = getAllowedTransitions(promisesResult[2][i].FollowUpAction, $scope.followUpActionsValues, true);
                              for (y = 0; y < promisesResult[2][i].FollowUpActionOptions.length; y++) {
                              if(promisesResult[2][i].FollowUpActionOptions[y].Value === promisesResult[2][i].FollowUpAction.Key && promisesResult[2][i].FollowUpAction.Key !== -1){promisesResult[2][i].CurrentFollowUpAction = promisesResult[2][i].FollowUpActionOptions[y];}}
                              if (new Date("1899-12-30T00:00:00").getDate()===new Date(promisesResult[2][i].CreationTime).getDate()){promisesResult[2][i].CreationTime = "";}
                              if (new Date("1899-12-30T00:00:00").getDate()===new Date(promisesResult[2][i].closeAlert).getDate()){promisesResult[2][i].closeAlert = "";}
                              formServiceAlerts.push(promisesResult[2][i]);
                          }
                          $scope.serviceAlerts = formServiceAlerts;
                          */
                          
                          setAdditionalInfoServiceAlert (promisesResult[2]);
                      }
                      else{
                          document.getElementById("AlertHeader").style.display = "none";
                          document.getElementById("AlertData").style.display = "none";
                          document.getElementById("NoAlert").style.display = "block";
                      }
                      
                  }
                  
              );
          }
          
      }
      
      function getAllowedTransitions(currentValue, statusFlows, getAll) {
          var allowedOptions = [];
          if(currentValue.Key !== -1){allowedOptions=[{Value:currentValue.Key,Name:currentValue["@DisplayString"]}];}
          for (y = 0; y < statusFlows.length; y++) {
              if(statusFlows[y].SourceStatus === null & getAll === true){
                  for(n = 0; n < statusFlows[y].TargetStatuses.length; n++){
                      if(currentValue.Key !== statusFlows[y].TargetStatuses[n].Key){
                          allowedOptions.push({Value:statusFlows[y].TargetStatuses[n].Key,Name:statusFlows[y].TargetStatuses[n].Name});
                     }
                      
                  }
              }
              else if(statusFlows[y].SourceStatus !== null & currentValue.Key == statusFlows[y].SourceStatus.Key){
                  

                   for(m=0;m<statusFlows[y].TargetStatuses.length;m++){

                        allowedOptions.push({Value:statusFlows[y].TargetStatuses[m].Key,Name:statusFlows[y].TargetStatuses[m].Name });
                   }
          }
          }
        return allowedOptions;
      }

      function setAdditionalInfoServiceAlert ($promises)
      {
          for (var i = 0; i < $promises.length; i++) {
              $promises[i].StatusOptions = getAllowedTransitions($promises[i].ServiceAlertStatus, $scope.serviceAlertsStatusFlows);
              for (y = 0; y < $promises[i].StatusOptions.length; y++) {if($promises[i].StatusOptions[y].Value === $promises[i].ServiceAlertStatus.Key){$promises[i].CurrentStatus = $promises[i].StatusOptions[y];}} 
                  //promisesResult[2][i].CurrentFollowUpAction = [];
                  $promises[i].changeDetected = false;
                  $promises[i].FollowUpActionOptions = getAllowedTransitions($promises[i].FollowUpAction, $scope.followUpActionsValues, true);
                  for (y = 0; y < $promises[i].FollowUpActionOptions.length; y++) {
                      if($promises[i].FollowUpActionOptions[y].Value === $promises[i].FollowUpAction.Key && $promises[i].FollowUpAction.Key !== -1){$promises[i].CurrentFollowUpAction = $promises[i].FollowUpActionOptions[y];}
                  }
                  if (new Date("1899-12-30T00:00:00").getDate()===new Date($promises[i].CreationTime).getDate()){$promises[i].CreationTime = "";}
                  if (new Date("1899-12-30T00:00:00").getDate()===new Date($promises[i].closeAlert).getDate()){$promises[i].closeAlert = "";}
                  var updated = false;
                  if(formServiceAlerts.length>0){
                      for(ii=0;ii<formServiceAlerts.length;ii++)
                      {
                          if(formServiceAlerts[ii].Key===$promises[i].Key)
                          {
                              formServiceAlerts[ii] = $promises[i];
                              updated= true;
                          }
                      }
                      if(updated===false){
                          formServiceAlerts.push($promises[i]);
                      }
                  }
                  else{formServiceAlerts.push($promises[i]);}
          }
          $scope.serviceAlerts = formServiceAlerts;
      }


GetServiceAlertData = function (ServiceAlertKey){
          var ServiceAlertQuery = {filter: "Key eq " + ServiceAlertKey,};
          var queryResult = w6serverServices.getObjects("ServiceAlert", ServiceAlertQuery);
          return queryResult;
      };

      $scope.markUpdatedItem = function ($index){
          $scope.serviceAlerts[$index].changeDetected = true;
          if ($scope.serviceAlerts[$index].CurrentFollowUpAction !== undefined)
          {
              $scope.serviceAlerts[$index].FollowUpAction = {"Key":$scope.serviceAlerts[$index].CurrentFollowUpAction.Value,"Name":$scope.serviceAlerts[$index].CurrentFollowUpAction.Name};
          }
          formServiceAlerts = $scope.serviceAlerts;
      };
      
      $scope.formInfo.beforeOKClick = function () {
         
          
          formServiceAlerts.length = 0;
          glb_Requestor = $scope.formInfo.object.Requestor;
          glb_Client = $scope.formInfo.object.Client;
          
      };
      
      $scope.formInfo.beforeApplyClick = function () {
          
          
           var updatePromises = [];
          for(n = 0; n < $scope.serviceAlerts.length; n++){
              if($scope.serviceAlerts[n].changeDetected)
              {
                  ServiceAlertForUpdateQuery = {"@objectType": "ServiceAlert","Key": $scope.serviceAlerts[n].Key,
                  //managementDate: managementD,
                  //notManageTime: Math.trunc(diff / (60 * 1000)), //Estos son los minutos que han pasado sin aceptar la alerta
                  "ServiceAlertStatus": {"Name": $scope.serviceAlerts[n].CurrentStatus.Name,"Key": $scope.serviceAlerts[n].CurrentStatus.Value},
                  //FollowUpUser: UserManag,
                  "FollowUpComments": $scope.serviceAlerts[n].FollowUpComments,
                  "FollowUpAction": {"Name": $scope.serviceAlerts[n].FollowUpAction.Name,"Key": $scope.serviceAlerts[n].FollowUpAction.Key},
                  };
                  
                  var resultUpdateSAStatus = w6serverServices.updateObject("ServiceAlert",ServiceAlertForUpdateQuery,false);
                  updatePromises[n] = resultUpdateSAStatus.$promise;
              }
          }
          if(updatePromises.length>0)
          {
              Promise.all(updatePromises).then(
                  
                  function(updateResult){
                      var updatedObjectPromises = [];
                      for (var i = 0; i < updateResult.length; i++) {
                          var ServiceAlertQuery = {filter: "Key eq " + updateResult[i].Key,};
                          updatedObjectPromises[i] = w6serverServices.getObjects("ServiceAlert",ServiceAlertQuery);
                      }
                      Promise.all(updatedObjectPromises).then(function(updatedServiceAlerts){
                          for(i=0;i<updatedServiceAlerts.length;i++){
                              var updatedServiceAlert = updatedServiceAlerts[i];
                              for(y=0;y<$scope.serviceAlerts.length;y++){
                                  if($scope.serviceAlerts[y].Key===updatedServiceAlert.Key){
                                      setAdditionalInfoServiceAlert (updatedServiceAlert);
                                      
                                  }
                              }
                          }
                      });
                  }
              );
          }
          
          
          formServiceAlerts.length = 0;
          glb_Requestor = $scope.formInfo.object.Requestor;
          glb_Client = $scope.formInfo.object.Client;
          
      };
      
      $scope.$on("form:onCancelClicked", function (event, updatedObject) {
          formServiceAlerts.length = 0;
      });
      
      //////////////////////////////////
      $scope.CommitServiceAlertChanges = function (UserManag, Coment, State, actionName, actionKey) {
      if(State.Name == "Accepted"){
          State.Key = 857653252;
      }else{
        State.Name = "Accepted";
        State.Key = 857653252;
      }  
      if ((LastServiceAlert.ServiceAlertStatus["@DisplayString"] == "Pending" && State.Name == "Accepted") || (LastServiceAlert.ServiceAlertStatus["@DisplayString"] == "Accepted" && State.Name == "Closed"))
      {
        const numberOfMlSeconds = new Date(Date.now()).getTime();
        var newDateObj = new Date(numberOfMlSeconds);
        var newDateObjj = new Date(numberOfMlSeconds - 18000000);
        const hoyy = new Date(newDateObj);
        const hoy = new Date(hoyy);
        const managemethoy = new Date(newDateObjj);
        const managementD = new Date(managemethoy);
        var fechaInicioo = LastServiceAlert.CreationTime;
        var fechaAcceptedd = LastServiceAlert.managementDate;
        var fechaFinn = hoy;
        var fechaInicio = new Date(fechaInicioo).getTime();
        const numberOfMlSecondss = new Date(fechaAcceptedd).getTime();
        var newDateObjj = new Date(numberOfMlSecondss - 18000000);
        var hoyacc = new Date(newDateObjj);
        var hoyac = new Date(hoyacc);
        var fechaAccepted = new Date(hoyac).getTime();
        var fechaFin = new Date(fechaFinn).getTime();
        var diff = fechaFin - fechaInicio;
        var diff2 = fechaFin - fechaAccepted;
        var ServiceAlertForUpdateQuery = {};
        var nextServiceAlertKey;
        nextServiceAlertKey = LastServiceAlert["Key"];
        $scope.LastServiceAlert.ServiceAlertStatus["@DisplayString"];
        if (
          LastServiceAlert.ServiceAlertStatus["@DisplayString"] ==
            "Pending" &&
          State.Name == "Accepted"
        ) {
          if (
            actionName == "Llamar al proveedor" ||
            actionName == "Llamar al cliente"
          ) {
            ServiceAlertForUpdateQuery = {
              "@objectType": "ServiceAlert",
              Key: nextServiceAlertKey,
              managementDate: managementD,
              notManageTime: Math.trunc(diff / (60 * 1000)), //Estos son los minutos que han pasado sin aceptar la alerta
              ServiceAlertStatus: {
                Name: State.Name,
                Key: State.Key,
              },
              FollowUpUser: UserManag,
              FollowUpComments: Coment,
              FollowUpAction: {
                Name: actionName,
                Key: actionKey,
              },
            };
          } else {
            ServiceAlertForUpdateQuery = {
              "@objectType": "ServiceAlert",
              Key: nextServiceAlertKey,
              managementDate: managementD,
              notManageTime: Math.trunc(diff / (60 * 1000)), //Estos son los minutos que han pasado sin aceptar la alerta
              ServiceAlertStatus: {
                Name: State.Name,
                Key: State.Key,
              },
              FollowUpUser: UserManag,
              FollowUpComments: Coment,
            };
          }
        } else if (
          LastServiceAlert.ServiceAlertStatus["@DisplayString"] ==
            "Accepted" &&
          State.Name == "Closed"
        ) {
          if (
            actionName == "Llamar al proveedor" ||
            actionName == "Llamar al cliente"
          ) {
            ServiceAlertForUpdateQuery = {
              "@objectType": "ServiceAlert",
              Key: nextServiceAlertKey,
              closeAlert: hoy,
              manageTime: Math.trunc(diff2 / (60 * 1000)), //Estos son los minutos de gestión de la alerta
              ServiceAlertStatus: {
                Name: State["Name"],
                Key: State["Key"],
              },
              FollowUpUser: UserManag,
              FollowUpComments: Coment,
              FollowUpAction: {
                Name: actionName,
                Key: actionKey,
              },
            };
          } else {
            ServiceAlertForUpdateQuery = {
              "@objectType": "ServiceAlert",
              Key: nextServiceAlertKey,
              closeAlert: hoy,
              manageTime: Math.trunc(diff2 / (60 * 1000)), //Estos son los minutos de gestión de la alerta
              ServiceAlertStatus: {
                Name: State["Name"],
                Key: State["Key"],
              },
              FollowUpUser: UserManag,
              FollowUpComments: Coment,
            };
          }
        }

        var resultUpdateSAStatus = w6serverServices.updateObject(
          "ServiceAlert",
          ServiceAlertForUpdateQuery,
          false
        );
        resultUpdateSAStatus.$promise.then(
          function (data) {
            var ServiceAlertQuery = {
              filter: "Key eq " + LastServiceAlert.Key,
            };
            var finalresult = w6serverServices.getObjects(
              "ServiceAlert",
              ServiceAlertQuery
            );
          finalresult.$promise.then(function (data) {
              LastServiceAlert = data;
              $scope.LastServiceAlert = LastServiceAlert[0];
              $scope.actualAction =
                $scope.LastServiceAlert.FollowUpAction["@DisplayString"];
            });
          },
          function (error) {
            alert(error);
          }
        );
      } else {
        // alert("Transicion de estados no permitida");
      }
    };
      
      
      
      
      ////////////////////////////////////
      
      
      
      
      
  }]);
});