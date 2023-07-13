//Not Scheduled Tecnico HAROLD_GPL01
//otro tipo de alerta
define(["modules/platform/platformModule"], function () {
  let PresentLastServiceAlert = [];
  let data = {};
  let applied = false;
  angular.module("platformModule").controller("ServiceAlertFormController", [
    "$scope",
    "w6serverServices",
    "$window",

    async function ($scope, w6serverServices, $window) {
      {
        $scope.colorete = false;
        $scope.actionColorete = false;
        $scope.myselect = "";
        $scope.Action = "";
        $scope.Coment = "";
        $scope.ServiceAlertForUpdateQuery = {};
        $scope.Satus = "";
        $scope.Opciones = [
          {
            Key:857653251,
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
          {
            Key: 309641216,
            Name: "Devolver Alerta a Front",
          },
          {
            Key: 309649408,
            Name: "Se realiza el reporte de las novedades del servicio",
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

      $scope.selectedValues = [];
      $scope.selected = [];

      $scope.clearDate = function (alerta) {
        if (alerta.managementDate == "1899-12-30T00:00:00") {
          alerta.managementDate = "";
        }
        if (alerta.closeAlert == "1899-12-30T00:00:00") {
          alerta.closeAlert = "";
        }
        if (alerta.manualCloseAlert == "1899-12-30T00:00:00") {
          alerta.manualCloseAlert = "";
        }
        return alerta;
      };

      $scope.changeResalt = function () {
        if ($scope.LastServiceAlert.FollowUpComments == "") {
          $scope.colorete = true;
        } else {
          $scope.colorete = false;
        }
      };

      $scope.changeActionsResalt = function () {
        if ($scope.selectedValues.length == 0) {
          $scope.actionColorete = true;
        } else {
          $scope.actionColorete = false;
        }
      };

      $scope.$watch("selected", function (nowSelected) {
        $scope.selectedValues = [];

        if (!nowSelected) {
          // here we've initialized selected already
          // but sometimes that's not the case
          // then we get null or undefined
          return;
        }
        angular.forEach(nowSelected, function (val) {
          $scope.selectedValues.push(val.id.toString());
        });
      });

      $scope.updateVisibleState = function (visibleState) {
        $scope.LastServiceAlert.ServiceAlertStatus["@DisplayString"] =
          visibleState;
        if (visibleState.Key == 649388032) {
          $scope.Opciones = [];
        }
      };
      $scope.refresh = async function () {
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
              $scope.LastServiceAlert = $scope.clearDate(
                $scope.LastServiceAlert
              );
              $scope.ServiceAlertKeys.pop();

              PresentLastServiceAlert = $scope.LastServiceAlert;
            }

            $scope.selected = [];
            if ($scope.LastServiceAlert.FollowUpActions.length > 0) {
              let i;
              for (
                i = 0;
                i < $scope.LastServiceAlert.FollowUpActions.length;
                i++
              ) {
                if (
                  $scope.LastServiceAlert.FollowUpActions[i].Action.Key ==
                  309641216
                ) {
                  $scope.selected = [
                    { id: 1, name: "Devolver alerta a front" },
                  ];
                }
                if (
                  $scope.LastServiceAlert.FollowUpActions[i].Action.Key ==
                  989011968
                ) {
                  if ($scope.selected == []) {
                    $scope.selected = [{ id: 2, name: "Llamar cliente" }];
                  } else {
                    $scope.selected.push({ id: 2, name: "Llamar cliente" });
                  }
                }
                if (
                  $scope.LastServiceAlert.FollowUpActions[i].Action.Key ==
                  989003776
                ) {
                  if ($scope.selected == []) {
                    $scope.selected = [{ id: 3, name: "Llamar proveedor" }];
                  } else {
                    $scope.selected.push({ id: 3, name: "Llamar proveedor" });
                  }
                }
                if (
                  $scope.LastServiceAlert.FollowUpActions[i].Action.Key ==
                  309649408
                ) {
                  if ($scope.selected == []) {
                    $scope.selected = [
                      {
                        id: 4,
                        name: "Se realiza el reporte de las novedades del servicio",
                      },
                    ];
                  } else {
                    $scope.selected.push({
                      id: 4,
                      name: "Se realiza el reporte de las novedades del servicio",
                    });
                  }
                }
              }
            }

            if (
              PresentLastServiceAlert.ServiceAlertStatus["@DisplayString"] ==
                "Pending" &&
              $scope.Satus != "Accepted"
            ) {
              $scope.Opciones = [
                {
                  Key:857653251,
                  Name: "Pending",
                },
                {
                  Key: 857653252,
                  Name: "Accepted",
                },
              ];
            } else if (
              (PresentLastServiceAlert.ServiceAlertStatus["@DisplayString"] ==
                "Accepted" ||
                $scope.Satus == "Accepted") &&
              PresentLastServiceAlert.JeopardyState.Key != 334913536 &&
              PresentLastServiceAlert.JeopardyState.Key != 808681472
            ) {
              $scope.Opciones = [];
            } else if (
              ((PresentLastServiceAlert.ServiceAlertStatus["@DisplayString"] ==
                "Accepted" &&
                $scope.Satus != "Manual Close") ||
                $scope.Satus == "Accepted") &&
              (PresentLastServiceAlert.JeopardyState.Key == 334913536 ||
                PresentLastServiceAlert.JeopardyState.Key == 808681472)
            ) {
              let f1 = PresentLastServiceAlert.manualManageTime;

              if (f1 != 0) {
                PresentLastServiceAlert.ServiceAlertStatus["@DisplayString"] =
                  "Manual Close";
                $scope.Opciones = [];
              } else {
                $scope.Opciones = [
                  {
                    Name: "Manual Close",
                    Key: 649388032,
                  },
                ];
              }
            } else if (
              (((PresentLastServiceAlert.ServiceAlertStatus["@DisplayString"] ==
                "Accepted" &&
                $scope.Satus != "Manual Close") ||
                $scope.Satus == "Manual Close") &&
                (LastServiceAlert.JeopardyState.Key == 334913536 ||
                  PresentLastServiceAlert.JeopardyState.Key == 808681472) &&
                ($scope.LastServiceAlert.FollowUpAction["@DisplayString"] ==
                  "Llamar al proveedor" ||
                  $scope.LastServiceAlert.FollowUpAction["@DisplayString"] ==
                    "Llamar al cliente") &&
                $scope.Coment.length > 0 &&
                ($scope.Action == "Llamar al cliente" ||
                  $scope.Action == "Llamar al proveedor")) ||
              PresentLastServiceAlert.ServiceAlertStatus["@DisplayString"] ==
                "Manual Close"
            ) {
              PresentLastServiceAlert.ServiceAlertStatus["@DisplayString"] =
                "Manual Close";
              $scope.nextAction = {};
              $scope.Opciones = [];
            } else {
              $scope.nextAction = {};
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
      $scope.refresh();

      $scope.formInfo.beforeApplyClick = function () {
        if (!applied) {
          $scope.Satus =
            $scope.LastServiceAlert.ServiceAlertStatus["@DisplayString"];
          $scope.Coment = $scope.LastServiceAlert.FollowUpComments;
          $scope.Action =
            $scope.LastServiceAlert.FollowUpAction["@DisplayString"];
          if (
            $scope.LastServiceAlert.ServiceAlertStatus.Name == "Accepted" ||
            $scope.LastServiceAlert.ServiceAlertStatus.Name == "Manual Close"
          ) {
            const numberOfMlSeconds = new Date(Date.now()).getTime();
            let newDateObj = new Date(numberOfMlSeconds);
            let newDateObjj = new Date(numberOfMlSeconds - 18000000);
            const hoyy = new Date(newDateObj);
            const hoy = new Date(hoyy);
            const managemethoy = new Date(newDateObjj);
            const managementD = new Date(managemethoy);
            let fechaInicioo = PresentLastServiceAlert.CreationTime;
            let fechaAcceptedd = PresentLastServiceAlert.managementDate;
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
            //Para las acciones
            let boolActOne = false;
            let boolActTwo = false;
            let boolActThree = false;
            let boolActFour = false;
            let actionss = [];
            if ($scope.selectedValues.includes("1")) {
              boolActOne = true;
              actionss.push({
                "@objectType": "Item",
                Action: {
                  Key: 309641216,
                  "@DisplayString": "Devolver Alerta a Front",
                },
                ActionDate: "1899-12-30T00:00:00",
              });
            }
            if ($scope.selectedValues.includes("2")) {
              boolActTwo = true;
              actionss.push({
                "@objectType": "Item",
                Action: {
                  Key: 989011968,
                  "@DisplayString": "Llamar al cliente",
                },
                ActionDate: "1899-12-30T00:00:00",
              });
            }
            if ($scope.selectedValues.includes("3")) {
              boolActThree = true;
              actionss.push({
                "@objectType": "Item",
                Action: {
                  Key: 989003776,
                  "@DisplayString": "Llamar al proveedor",
                },
                ActionDate: "1899-12-30T00:00:00",
              });
            }
            if ($scope.selectedValues.includes("4")) {
              boolActFour = true;
              actionss.push({
                "@objectType": "Item",
                Action: {
                  Key: 309649408,
                  "@DisplayString":
                    "Se realiza el reporte de las novedades del servicio",
                },
                ActionDate: "1899-12-30T00:00:00",
              });
            }
            if (
              PresentLastServiceAlert.ServiceAlertStatus["@DisplayString"] ==
                "Pending" &&
              $scope.LastServiceAlert.ServiceAlertStatus.Name == "Accepted"
            ) {
              if (boolActOne || boolActTwo || boolActThree || boolActFour) {
                let nextServiceAlertKey = PresentLastServiceAlert["Key"];
                $scope.ServiceAlertForUpdateQuery = {
                  "@objectType": "ServiceAlert",
                  Key: nextServiceAlertKey,
                  managementDate: managementD,
                  notManageTime: Math.trunc(diff / (60 * 1000)),
                  ServiceAlertStatus: {
                    Name: "Accepted",
                    Key: 857653252,
                  },
                  FollowUpUser: $scope.LastServiceAlert.FollowUpUser,
                  FollowUpComments: $scope.LastServiceAlert.FollowUpComments,
                  // Acciones: [
                  //   {
                  //     DevolverAlertaaFront: boolActOne,
                  //     LlamarCliente: boolActTwo,
                  //     LlamarProveedor: boolActThree,
                  //     Serealizaelreporte: boolActFour,
                  //   },
                  // ],
                  FollowUpActions: actionss,
                };
                $scope.updateAndRefreshAlert($scope.ServiceAlertForUpdateQuery);
              } else {
                let nextServiceAlertKey = PresentLastServiceAlert["Key"];
                $scope.ServiceAlertForUpdateQuery = {
                  "@objectType": "ServiceAlert",
                  Key: nextServiceAlertKey,
                  managementDate: managementD,
                  notManageTime: Math.trunc(diff / (60 * 1000)),
                  ServiceAlertStatus: {
                    Name: "Accepted",
                    Key: 857653252,
                  },
                  FollowUpUser: $scope.LastServiceAlert.FollowUpUser,
                  FollowUpComments: $scope.LastServiceAlert.FollowUpComments,
                  // Acciones: [
                  //   {
                  //     DevolverAlertaaFront: boolActOne,
                  //     LlamarCliente: boolActTwo,
                  //     LlamarProveedor: boolActThree,
                  //     Serealizaelreporte: boolActFour,
                  //   },
                  // ],
                  FollowUpActions: actionss,
                };
                $scope.updateAndRefreshAlert($scope.ServiceAlertForUpdateQuery);
              }
            } else if (
              PresentLastServiceAlert.ServiceAlertStatus["@DisplayString"] ==
                "Accepted" &&
              $scope.LastServiceAlert.ServiceAlertStatus.Name == "Accepted"
            ) {
              let nextServiceAlertKey = PresentLastServiceAlert["Key"];
              $scope.ServiceAlertForUpdateQuery = {
                "@objectType": "ServiceAlert",
                Key: nextServiceAlertKey,
                FollowUpUser: $scope.LastServiceAlert.FollowUpUser,
                FollowUpComments: $scope.LastServiceAlert.FollowUpComments,
                ServiceAlertStatus: {
                  Name: "Accepted",
                  Key: 857653252,
                },
                // Acciones: [
                //   {
                //     DevolverAlertaaFront: boolActOne,
                //     LlamarCliente: boolActTwo,
                //     LlamarProveedor: boolActThree,
                //     Serealizaelreporte: boolActFour,
                //   },
                // ],
                FollowUpActions: actionss,
              };
              $scope.updateAndRefreshAlert($scope.ServiceAlertForUpdateQuery);
            } else if (
              PresentLastServiceAlert.ServiceAlertStatus["@DisplayString"] ==
                "Accepted" &&
              $scope.LastServiceAlert.ServiceAlertStatus.Name == "Manual Close"
            ) {
              if (
                (boolActOne || boolActTwo || boolActThree || boolActFour) &&
                $scope.LastServiceAlert.FollowUpComments != ""
              ) {
                let nextServiceAlertKey = PresentLastServiceAlert["Key"];
                $scope.ServiceAlertForUpdateQuery = {
                  "@objectType": "ServiceAlert",
                  Key: nextServiceAlertKey,
                  manualCloseAlert: managementD,
                  manualManageTime: Math.trunc(diff2 / (60 * 1000)) - 300, //Estos son los minutos de gestión de la alerta
                  ServiceAlertStatus: {
                    Name: "Manual Close",
                    Key: 649388032,
                  },
                  FollowUpUser: $scope.LastServiceAlert.FollowUpUser,
                  FollowUpComments: $scope.LastServiceAlert.FollowUpComments,
                  // Acciones: [
                  //   {
                  //     DevolverAlertaaFront: boolActOne,
                  //     LlamarCliente: boolActTwo,
                  //     LlamarProveedor: boolActThree,
                  //     Serealizaelreporte: boolActFour,
                  //   },
                  // ],
                  FollowUpActions: actionss,
                };
                $scope.updateAndRefreshAlert($scope.ServiceAlertForUpdateQuery);
              } else {
                alert(
                  "Se debe ingresar una acción ejecutada y un comentario para la transición a estado cerrada manualmente"
                );
                $scope.changeResalt();
                $scope.changeActionsResalt();
              }
            } else if (
              PresentLastServiceAlert.ServiceAlertStatus["@DisplayString"] ==
                "Manual Close" &&
              $scope.LastServiceAlert.ServiceAlertStatus.Name == "Manual Close"
            ) {
              let nextServiceAlertKey = PresentLastServiceAlert["Key"];
              $scope.ServiceAlertForUpdateQuery = {
                "@objectType": "ServiceAlert",
                Key: nextServiceAlertKey,
                FollowUpUser: $scope.LastServiceAlert.FollowUpUser,
                FollowUpComments: $scope.LastServiceAlert.FollowUpComments,
                // Acciones: [
                //   {
                //     DevolverAlertaaFront: boolActOne,
                //     LlamarCliente: boolActTwo,
                //     LlamarProveedor: boolActThree,
                //     Serealizaelreporte: boolActFour,
                //   },
                // ],
                FollowUpActions: actionss,
              };
              $scope.updateAndRefreshAlert($scope.ServiceAlertForUpdateQuery);
            }
          }
          applied = true;
        } else {
          applied = false;
        }
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
            filter: "Key eq " + PresentLastServiceAlert.Key,
          };
          let finalresult = w6serverServices.getObjects(
            "ServiceAlert",
            ServiceAlertQuery
          );
          await finalresult.$promise.then(function (data) {
            PresentLastServiceAlert = data;
            $scope.LastServiceAlert = PresentLastServiceAlert[0];
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
        $scope.refresh();
        //Fin getRefreshAlert
      };
    },
  ]);
});
