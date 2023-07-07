//Not Scheduled Tecnico HAROLD_GPL01
//otro tipo de alerta
define(["modules/platform/platformModule"], function () {
  let LastServiceAlert = [];
  let data = {};

  angular.module("platformModule").controller("ServiceAlertFormController", [
    "$scope",
    "w6serverServices",
    "$window",

    async function ($scope, w6serverServices, $window) {
      {
        $scope.Action = "";
        $scope.Coment = "";
        $scope.ServiceAlertForUpdateQuery = {};
        $scope.Satus = "";
        $scope.Opciones = [
          {
            Key: 857653251,
            Name: "Pending",
          },
          {
            Key: 857653252,
            Name: "Accepted",
          },
        ];
        $scope.Acciones = [
          {
            Key: 989003776,
            Name: "Llamar al proveedor",
          },
          {
            Key: 989011968,
            Name: "Llamar al cliente",
          },
        ];
        $scope.managementDateToShow = "";
        $scope.actualAction = "";
        $scope.LastServiceAlert = [];
        $scope.ServiceAlertKeys = [];
        $scope.mensaje = "msg";
        $scope.showLocationsCombo = true;
        $scope.textoUno = "";
        $scope.arreglo = [];
        $scope.items1_1 = [{ a: "bien" }, { b: "mal" }];
        $scope.items1_2 = [{ c: "bien" }, { d: "mal" }];
        $scope.items1 = [{ a: "bien" }, { b: "mal" }];
        $scope.CallIDg = "4444";
        $scope.serviceAlerts = {
          TaskCallID: "1",
          TaskKey: "",
          TasKNumber: "",
        };
      }
      $scope.refresh = async function () {
        console.log("aquí debe refrescar");
        //Inicio refresh
        let TaskCallID = $scope.formInfo.object.CallID;
        let TaskKey = $scope.formInfo.object.Key;
        $scope.CallIDg = TaskCallID;
        let ServiceAlertQuery = {
          filter: "ReferencedTask/Key eq " + TaskKey,
        };
        let reqServiceAlerts = w6serverServices.getObjects(
          "ServiceAlert",
          ServiceAlertQuery,
          false
        );
        await reqServiceAlerts.$promise.then(
          function (ServiceAlertData) {
            $scope.ServiceAlertKeys = ServiceAlertData;

            if ($scope.ServiceAlertKeys !== null) {
              $scope.LastServiceAlert =
                $scope.ServiceAlertKeys[$scope.ServiceAlertKeys.length - 1];
              $scope.ServiceAlertKeys.pop();

              LastServiceAlert = $scope.LastServiceAlert;
            }
            $scope.actualAction =
              LastServiceAlert.FollowUpAction["@DisplayString"];
            if (
              LastServiceAlert.ServiceAlertStatus["@DisplayString"] ==
                "Pending" &&
              $scope.Satus != "Accepted"
            ) {
              $scope.Opciones = [
                {
                  Key: 857653252,
                  Name: "Accepted",
                },
              ];
            } else if (
              (LastServiceAlert.ServiceAlertStatus["@DisplayString"] ==
                "Accepted" ||
                $scope.Satus == "Accepted") &&
              LastServiceAlert.JeopardyState.Key != 334913536 &&
              LastServiceAlert.JeopardyState.Key != 808681472
            ) {
              $scope.Opciones = [];
            } else if (
              ((LastServiceAlert.ServiceAlertStatus["@DisplayString"] ==
                "Accepted" &&
                $scope.Satus != "Manual Close") ||
                $scope.Satus == "Accepted") &&
              (LastServiceAlert.JeopardyState.Key == 334913536 ||
                LastServiceAlert.JeopardyState.Key == 808681472)
            ) {
              let f1 = LastServiceAlert.manualManageTime;

              if (f1 != 0) {
                LastServiceAlert.ServiceAlertStatus["@DisplayString"] =
                  "Manual Close";
                $scope.Opciones = [];
              } else {
                $scope.Opciones = [
                  {
                    Key: 111111112,
                    Name: "Manual Close",
                  },
                ];
              }
            } else if (
              ((LastServiceAlert.ServiceAlertStatus["@DisplayString"] ==
                "Accepted" &&
                $scope.Satus != "Manual Close") ||
                $scope.Satus == "Manual Close") &&
              (LastServiceAlert.JeopardyState.Key == 334913536 ||
                LastServiceAlert.JeopardyState.Key == 808681472) &&
              ($scope.LastServiceAlert.FollowUpAction["@DisplayString"] ==
                "Llamar al proveedor" ||
                $scope.LastServiceAlert.FollowUpAction["@DisplayString"] ==
                  "Llamar al cliente") && 
              $scope.Coment.length > 0 && ($scope.Action == "Llamar al cliente" 
              || $scope.Action == "Llamar al proveedor")
            ) {
              LastServiceAlert.ServiceAlertStatus["@DisplayString"] =
                "Manual Close";
              $scope.Opciones = [];
            }
          },
          function (error) {
            alert(
              "Failed to update Service Alert object. Error information: " +
                error.ServiceAlertData.ExceptionMessage
            );
            return error;
          }
        );
        //Fin refresh
      };
      $scope.updateAndRefreshAlert = async function (
        ServiceAlertForUpdateQuery
      ) {
        //Inicio getRefreshAlert
        let resultUpdateSAStatus = w6serverServices.updateObject(
          "ServiceAlert",
          ServiceAlertForUpdateQuery,
          false
        );
        await resultUpdateSAStatus.$promise.then(async function () {
          let ServiceAlertQuery = {
            filter: "Key eq " + LastServiceAlert.Key,
          };
          let finalresult = w6serverServices.getObjects(
            "ServiceAlert",
            ServiceAlertQuery
          );
          await finalresult.$promise.then(function (data) {
            LastServiceAlert = data;
            $scope.LastServiceAlert = LastServiceAlert[0];
            $scope.actualAction =
              $scope.LastServiceAlert.FollowUpAction["@DisplayString"];
            let f1 = $scope.LastServiceAlert.manualManageTime;

            if (f1 != 0) {
              $scope.LastServiceAlert.ServiceAlertStatus["@DisplayString"] =
                "Manual Close";
              $scope.Opciones = [];
            }
          });
        });
        $scope.Satus =
          $scope.LastServiceAlert.ServiceAlertStatus["@DisplayString"];
        //Fin getRefreshAlert
      };
      $scope.init = async function () {};

      $scope.refresh();

      $scope.updating = async function (
        UserManag,
        Coment,
        State,
        actionName,
        actionKey
      ) {
        if (State.Name == "Accepted") {
          State.Key = 857653252;
        } else {
          State.Name = "Manual Close";
          State.Key = 111111111;
        }
        $scope.Satus = State.Name;
        $scope.Coment = Coment;
        $scope.Action = actionName;
        if (State.Name == "Accepted" || State.Name == "Manual Close") {
          const numberOfMlSeconds = new Date(Date.now()).getTime();
          let newDateObj = new Date(numberOfMlSeconds);
          let newDateObjj = new Date(numberOfMlSeconds - 18000000);
          const hoyy = new Date(newDateObj);
          const hoy = new Date(hoyy);
          const managemethoy = new Date(newDateObjj);
          const managementD = new Date(managemethoy);
          let fechaInicioo = LastServiceAlert.CreationTime;
          let fechaAcceptedd = LastServiceAlert.managementDate;
          let fechaFinn = hoy;
          let fechaInicio = new Date(fechaInicioo).getTime();
          const numberOfMlSecondss = new Date(fechaAcceptedd).getTime();
          newDateObjj = new Date(numberOfMlSecondss - 18000000);
          let hoyacc = new Date(newDateObjj);
          let hoyac = new Date(hoyacc);
          let fechaAccepted = new Date(hoyac).getTime();
          let fechaFin = new Date(fechaFinn).getTime();
          let diff = fechaFin - fechaInicio;
          let diff2 = fechaFin - fechaAccepted;

          if (State.Name == "Accepted") {
            if (
              actionName == "Llamar al proveedor" ||
              actionName == "Llamar al cliente"
            ) {
              let nextServiceAlertKey = LastServiceAlert["Key"];
              $scope.ServiceAlertForUpdateQuery = {
                "@objectType": "ServiceAlert",
                Key: nextServiceAlertKey,
                managementDate: managementD,
                notManageTime: Math.trunc(diff / (60 * 1000)), //Estos son los minutos que han pasado sin aceptar la alerta
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
              $scope.updateAndRefreshAlert($scope.ServiceAlertForUpdateQuery);
            } else {
              let nextServiceAlertKey = LastServiceAlert["Key"];
              $scope.ServiceAlertForUpdateQuery = {
                "@objectType": "ServiceAlert",
                Key: nextServiceAlertKey,
                managementDate: managementD,
                notManageTime: Math.trunc(diff / (60 * 1000)), //Estos son los minutos que han pasado sin aceptar la alerta
                ServiceAlertStatus: {
                  Name: State["Name"],
                  Key: State["Key"],
                },
                FollowUpUser: UserManag,
                FollowUpComments: Coment,
                FollowUpAction: {
                  Name: "Llamar al cliente",
                  Key: 989011968,
                },
              };
              $scope.updateAndRefreshAlert($scope.ServiceAlertForUpdateQuery);
            }
          } else if (State.Name == "Manual Close") {
            if (
              (actionName == "Llamar al proveedor" ||
                actionName == "Llamar al cliente") &&
              Coment.length > 0
            ) {
              let nextServiceAlertKey = LastServiceAlert["Key"];
              $scope.ServiceAlertForUpdateQuery = {
                "@objectType": "ServiceAlert",
                Key: nextServiceAlertKey,
                //closeAlert: hoy,
                manualCloseAlert: managementD,
                manualManageTime: Math.trunc(diff2 / (60 * 1000)) - 300, //Estos son los minutos de gestión de la alerta
                ServiceAlertStatus: {
                  Name: "Accepted",
                  Key: 857653252,
                },
                FollowUpUser: UserManag,
                FollowUpComments: Coment,
                FollowUpAction: {
                  Name: actionName,
                  Key: actionKey,
                },
              };
              $scope.updateAndRefreshAlert($scope.ServiceAlertForUpdateQuery);
            } else {
              // $scope.Opciones = [
              //   {
              //     Key: 111111111,
              //     Name: "Manual Close",
              //   },
              // ];
              alert(
                "Se debe ingresar una acción ejecutada y un comentario para la transición a estado cerrada manualmente"
              );
            }
          }
          $scope.refresh();
        }
      };

      // $scope.updateOnlyAction = async function (action) {
      //   let nextServiceAlertKey = LastServiceAlert["Key"];
      //    let ServiceAlertForUpdateQuery = {
      //     "@objectType": "ServiceAlert",
      //     Key: nextServiceAlertKey,
      //     FollowUpAction: {
      //       Name: action.Name,
      //       Key: action.Key,
      //     },
      //   };

      //   let resultUpdateSAStatus = w6serverServices.updateObject(
      //     "ServiceAlert",
      //     ServiceAlertForUpdateQuery,
      //     false
      //   );

      //   await resultUpdateSAStatus.$promise.then(async function () {
      //     let ServiceAlertQuery = {
      //       filter: "Key eq " + LastServiceAlert.Key,
      //     };
      //     let finalresult = w6serverServices.getObjects(
      //       "ServiceAlert",
      //       ServiceAlertQuery
      //     );
      //     await finalresult.$promise.then(function (data) {
      //       LastServiceAlert = data;
      //       $scope.LastServiceAlert = LastServiceAlert[0];
      //       $scope.actualAction =
      //         $scope.LastServiceAlert.FollowUpAction["@DisplayString"];
      //       let f1 = $scope.LastServiceAlert.manualManageTime;

      //       if (f1 != 0) {
      //         $scope.LastServiceAlert.ServiceAlertStatus["@DisplayString"] =
      //           "Manual Close";
      //         $scope.Opciones = [];
      //       }
      //     });
      //   });
      //   //Inicio refresh
      //   let TaskCallID = $scope.formInfo.object.CallID;
      //   let TaskKey = $scope.formInfo.object.Key;
      //   $scope.CallIDg = TaskCallID;
      //   let ServiceAlertQuery = {
      //     filter: "ReferencedTask/Key eq " + TaskKey,
      //   };
      //   let reqServiceAlerts = w6serverServices.getObjects(
      //     "ServiceAlert",
      //     ServiceAlertQuery,
      //     false
      //   );
      //   await reqServiceAlerts.$promise.then(
      //     function (ServiceAlertData) {
      //       $scope.ServiceAlertKeys = ServiceAlertData;

      //       if ($scope.ServiceAlertKeys !== null) {
      //         $scope.LastServiceAlert =
      //           $scope.ServiceAlertKeys[$scope.ServiceAlertKeys.length - 1];
      //         $scope.ServiceAlertKeys.pop();

      //         LastServiceAlert = $scope.LastServiceAlert;
      //       }
      //       $scope.actualAction =
      //         LastServiceAlert.FollowUpAction["@DisplayString"];
      //       if (
      //         LastServiceAlert.ServiceAlertStatus["@DisplayString"] ==
      //           "Pending" &&
      //         State.Name != "Accepted"
      //       ) {
      //         $scope.Opciones = [
      //           {
      //             Key: 857653252,
      //             Name: "Accepted",
      //           },
      //         ];
      //       } else if (
      //         (LastServiceAlert.ServiceAlertStatus["@DisplayString"] ==
      //           "Accepted" ||
      //           State.Name == "Accepted") &&
      //         LastServiceAlert.JeopardyState.Key != 334913536 &&
      //         LastServiceAlert.JeopardyState.Key != 80868147
      //       ) {
      //         $scope.Opciones = [];
      //       } else if (
      //         ((LastServiceAlert.ServiceAlertStatus["@DisplayString"] ==
      //           "Accepted" &&
      //           State.Name != "Manual Close") ||
      //           State.Name == "Accepted") &&
      //         (LastServiceAlert.JeopardyState.Key == 334913536 ||
      //           LastServiceAlert.JeopardyState.Key == 808681472)
      //       ) {
      //         $scope.Opciones = [
      //           {
      //             Key: 111111112,
      //             Name: "Manual Close",
      //           },
      //         ];
      //       } else if (
      //         ((LastServiceAlert.ServiceAlertStatus["@DisplayString"] ==
      //           "Accepted" &&
      //           State.Name != "Manual Close") ||
      //           State.Name == "Manual Close") &&
      //         (LastServiceAlert.JeopardyState.Key == 334913536 ||
      //           LastServiceAlert.JeopardyState.Key == 808681472) &&
      //         ($scope.LastServiceAlert.FollowUpAction["@DisplayString"] ==
      //           "Llamar al proveedor" ||
      //           $scope.LastServiceAlert.FollowUpAction["@DisplayString"] ==
      //             "Llamar al cliente") &&
      //         Coment.length > 1
      //       ) {
      //         LastServiceAlert.ServiceAlertStatus["@DisplayString"] =
      //           "Manual Close";
      //         $scope.Opciones = [];
      //       }
      //     },
      //     function (error) {
      //       alert(
      //         "Failed to update Service Alert object. Error information: " +
      //           error.ServiceAlertData.ExceptionMessage
      //       );
      //       return error;
      //     }
      //   );
      //   //Fin refresh

      // };
    },
  ]);
});
