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

    async function ($scope, w6serverServices, $interval) {
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
            Value: 857653251,
            Name: "Pending",
          },
          {
            Value: 857653252,
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

      {
        $scope.progressBarWidth = '0%';
        let loadingInterval;
    
        $scope.startLoading = function () {
          // Simula una carga ficticia
          let progress = 0;
          loadingInterval = $interval(function () {
            progress += 2; // Aumenta el progreso en un 2% cada vez
            if (progress <= 100) {
              $scope.progressBarWidth = progress + '%';
            } else {
              $interval.cancel(loadingInterval);
            }
          }, 100); // Actualiza la barra de carga cada 100 ms
        };
      }
      
        

      $scope.clearDate = function (alerta) {
        //Para limpiar el arreglo de las alertas pasadas
        let i;
        for (i = 0; i < $scope.ServiceAlertKeys.length; i++) {
          if (
            $scope.ServiceAlertKeys[i].managementDate == "1899-12-30T00:00:00"
          ) {
            $scope.ServiceAlertKeys[i].managementDate = "";
          }
          if ($scope.ServiceAlertKeys[i].closeAlert == "1899-12-30T00:00:00") {
            $scope.ServiceAlertKeys[i].closeAlert = "";
          }
          if (
            $scope.ServiceAlertKeys[i].manualCloseAlert == "1899-12-30T00:00:00"
          ) {
            $scope.ServiceAlertKeys[i].manualCloseAlert = "";
          }
        }

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
      $scope.refresh = async function () {
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
            if ($scope.ServiceAlertKeys.length > 0) {
              let positionLastAlert = 0;
              let actionsAndCommentsPendingOrClosed= false;
              for (let i = $scope.ServiceAlertKeys.length - 1; i >= 0; i--) {
                if (
                  $scope.ServiceAlertKeys[i].ServiceAlertStatus.Key == 857653251
                ) {
                  $scope.LastServiceAlert = $scope.ServiceAlertKeys[i];
                  $scope.LastServiceAlert = $scope.clearDate(
                    $scope.LastServiceAlert
                  );
                  $scope.PresentStatus = {
                    Value: $scope.LastServiceAlert.ServiceAlertStatus.Key,
                    Name: $scope.LastServiceAlert.ServiceAlertStatus[
                      "@DisplayString"
                    ],
                  };
                  PresentLastServiceAlert = $scope.LastServiceAlert;
                  positionLastAlert = i;
                  break; // Detener la búsqueda una vez que se haya encontrado el primer elemento "pending"
                } else if (
                  $scope.ServiceAlertKeys[i].ServiceAlertStatus.Key == 857653252
                ) {
                  $scope.LastServiceAlert = $scope.ServiceAlertKeys[i];
                  $scope.ServiceAlertKeys.splice(i, 1);
                  $scope.LastServiceAlert = $scope.clearDate(
                    $scope.LastServiceAlert
                  );
                  $scope.PresentStatus = {
                    Value: $scope.LastServiceAlert.ServiceAlertStatus.Key,
                    Name: $scope.LastServiceAlert.ServiceAlertStatus[
                      "@DisplayString"
                    ],
                  };
                  PresentLastServiceAlert = $scope.LastServiceAlert;
                  positionLastAlert = i;
                  break; // Detener la búsqueda una vez que se haya encontrado el primer elemento "pending"
                } else if (
                  $scope.ServiceAlertKeys[i].ServiceAlertStatus.Key == 857653253 && !actionsAndCommentsPendingOrClosed
                ) {
                  $scope.LastServiceAlert = $scope.ServiceAlertKeys[i];
                  $scope.LastServiceAlert = $scope.clearDate(
                    $scope.LastServiceAlert
                  );
                  $scope.PresentStatus = {
                    Value: $scope.LastServiceAlert.ServiceAlertStatus.Key,
                    Name: $scope.LastServiceAlert.ServiceAlertStatus[
                      "@DisplayString"
                    ],
                  };
                  PresentLastServiceAlert = $scope.LastServiceAlert;
                  positionLastAlert = i;
                  actionsAndCommentsPendingOrClosed = true;
                } else if (
                  $scope.ServiceAlertKeys[i].ServiceAlertStatus.Key == 649388032 && !actionsAndCommentsPendingOrClosed
                ) {
                  $scope.LastServiceAlert = $scope.ServiceAlertKeys[i];
                  $scope.LastServiceAlert = $scope.clearDate(
                    $scope.LastServiceAlert
                  );

                  $scope.PresentStatus = {
                    Value: $scope.LastServiceAlert.ServiceAlertStatus.Key,
                    Name: $scope.LastServiceAlert.ServiceAlertStatus[
                      "@DisplayString"
                    ],
                  };
                  PresentLastServiceAlert = $scope.LastServiceAlert;
                  positionLastAlert = i;
                  actionsAndCommentsPendingOrClosed = true;
                }
              }
              //se elimina la alerta que fue puesta para gestionar de la lista de alertas
              $scope.ServiceAlertKeys.splice(positionLastAlert, 1);
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
                  $scope.LastServiceAlert.FollowUpActions[i].Key == 309641216
                ) {
                  $scope.selected = [
                    { id: 1, name: "Devolver alerta a front" },
                  ];
                }
                if (
                  $scope.LastServiceAlert.FollowUpActions[i].Key == 989011968
                ) {
                  if ($scope.selected == []) {
                    $scope.selected = [{ id: 2, name: "Llamar cliente" }];
                  } else {
                    $scope.selected.push({ id: 2, name: "Llamar cliente" });
                  }
                }
                if (
                  $scope.LastServiceAlert.FollowUpActions[i].Key == 989003776
                ) {
                  if ($scope.selected == []) {
                    $scope.selected = [{ id: 3, name: "Llamar proveedor" }];
                  } else {
                    $scope.selected.push({ id: 3, name: "Llamar proveedor" });
                  }
                }
                if (
                  $scope.LastServiceAlert.FollowUpActions[i].Key == 309649408
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
              PresentLastServiceAlert.ServiceAlertStatus.Key == 857653251 &&
              $scope.Satus != "Accepted"
            ) {
              $scope.Opciones = [
                {
                  Value: 857653251,
                  Name: "Pending",
                },
                {
                  Value: 857653252,
                  Name: "Accepted",
                },
              ];
            } else if (
              (PresentLastServiceAlert.ServiceAlertStatus.Key == 857653252 ||
                $scope.Satus == "Accepted") &&
              PresentLastServiceAlert.JeopardyState.Key != 334913536 &&
              PresentLastServiceAlert.JeopardyState.Key != 808681472
            ) {
              $scope.Opciones = [
                {
                  Value: 857653252,
                  Name: "Accepted",
                },
              ];
            } else if (
              ((PresentLastServiceAlert.ServiceAlertStatus.Key == 857653252 &&
                $scope.Satus != "Manual Close") ||
                $scope.Satus == "Accepted") &&
              (PresentLastServiceAlert.JeopardyState.Key == 334913536 ||
                PresentLastServiceAlert.JeopardyState.Key == 808681472)
            ) {
              let f1 = PresentLastServiceAlert.manualManageTime;

              if (f1 != 0) {
                PresentLastServiceAlert.ServiceAlertStatus["@DisplayString"] =
                  "Manual Close";
                $scope.Opciones = [
                  {
                    Name: "Manual Close",
                    Value: 649388032,
                  },
                ];
              } else {
                $scope.Opciones = [
                  {
                    Value: 857653252,
                    Name: "Accepted",
                  },
                  {
                    Name: "Manual Close",
                    Value: 649388032,
                  },
                ];
              }
            } else if (
              (((PresentLastServiceAlert.ServiceAlertStatus.Key == 857653252 &&
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
              $scope.Opciones = [
                {
                  Name: "Manual Close",
                  Value: 649388032,
                },
              ];
            } else if (
              PresentLastServiceAlert.ServiceAlertStatus.Key == 857653253
            ) {
              $scope.Opciones = [
                {
                  Value: 857653253,
                  Name: "Closed",
                },
              ];
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
      };
      $scope.refresh();

      $scope.formInfo.beforeApplyClick = function () {
        if (!applied) {
          $scope.Satus = $scope.PresentStatus.Name;
          $scope.Coment = $scope.LastServiceAlert.FollowUpComments;
          $scope.Action =
            $scope.LastServiceAlert.FollowUpAction["@DisplayString"];
          if (
            $scope.PresentStatus.Name == "Accepted" ||
            $scope.PresentStatus.Name == "Manual Close"
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
                Key: 309641216,
                "@DisplayString": "Devolver Alerta a Front",
              });
            }
            if ($scope.selectedValues.includes("2")) {
              boolActTwo = true;
              actionss.push({
                Key: 989011968,
                "@DisplayString": "Llamar al cliente",
              });
            }
            if ($scope.selectedValues.includes("3")) {
              boolActThree = true;
              actionss.push({
                Key: 989003776,
                "@DisplayString": "Llamar al proveedor",
              });
            }
            if ($scope.selectedValues.includes("4")) {
              boolActFour = true;
              actionss.push({
                Key: 309649408,
                "@DisplayString":
                  "Se realiza el reporte de las novedades del servicio",
              });
            }
            if (
              PresentLastServiceAlert.ServiceAlertStatus.Key == 857653251 && //pending
              $scope.PresentStatus.Name == "Accepted"
            ) {
              if (boolActOne || boolActTwo || boolActThree || boolActFour) {
                let nextServiceAlertKey = PresentLastServiceAlert["Key"];
                let oneOrnoCeros = "";
                if (Math.trunc(diff / (60 * 1000)).toString().length == 1) {
                  oneOrnoCeros = "0";
                }
                $scope.ServiceAlertForUpdateQuery = {
                  "@objectType": "ServiceAlert",
                  Key: nextServiceAlertKey,
                  managementDate: managementD,
                  notManageTime: Math.trunc(diff / (60 * 1000)),
                  notManageTimeStr:
                    "00:" +
                    oneOrnoCeros +
                    Math.trunc(diff / (60 * 1000)).toString() +
                    ":00",
                  // totalTime: (PresentLastServiceAlert.notManageTime + PresentLastServiceAlert.manualManageTime).toString(),
                  ServiceAlertStatus: {
                    Name: "Accepted",
                    Key: 857653252,
                  },
                  FollowUpUser: $scope.LastServiceAlert.FollowUpUser,
                  FollowUpComments: $scope.LastServiceAlert.FollowUpComments,
                  FollowUpActions: actionss,
                };
                $scope.updateAndRefreshAlert($scope.ServiceAlertForUpdateQuery);
              } else {
                let nextServiceAlertKey = PresentLastServiceAlert["Key"];
                let oneOrnoCeros = "";
                if (Math.trunc(diff / (60 * 1000)).toString().length == 1) {
                  oneOrnoCeros = "0";
                }
                $scope.ServiceAlertForUpdateQuery = {
                  "@objectType": "ServiceAlert",
                  Key: nextServiceAlertKey,
                  managementDate: managementD,
                  notManageTime: Math.trunc(diff / (60 * 1000)),
                  notManageTimeStr:
                    "00:" +
                    oneOrnoCeros +
                    Math.trunc(diff / (60 * 1000)).toString() +
                    ":00",
                  // totalTime: (PresentLastServiceAlert.notManageTime + PresentLastServiceAlert.manualManageTime).toString(),
                  ServiceAlertStatus: {
                    Name: "Accepted",
                    Key: 857653252,
                  },
                  FollowUpUser: $scope.LastServiceAlert.FollowUpUser,
                  FollowUpComments: $scope.LastServiceAlert.FollowUpComments,
                  //FollowUpActions: actionss,
                };
                $scope.updateAndRefreshAlert($scope.ServiceAlertForUpdateQuery);
              }
            } else if (
              PresentLastServiceAlert.ServiceAlertStatus.Key == 857653252 && //Accepted
              $scope.PresentStatus.Name == "Accepted"
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
                FollowUpActions: actionss,
              };
              $scope.updateAndRefreshAlert($scope.ServiceAlertForUpdateQuery);
            } else if (
              PresentLastServiceAlert.ServiceAlertStatus.Key == 857653252 &&
              $scope.PresentStatus.Name == "Manual Close"
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
                  manualManageTimeStr:
                    "00:" +
                    (Math.trunc(diff2 / (60 * 1000)) - 300).toString() +
                    ":00",
                  totalTimeDuration:
                    PresentLastServiceAlert.notManageTime +
                    Math.trunc(diff2 / (60 * 1000)) -
                    300,
                  totalTime:
                    "00:" +
                    (
                      PresentLastServiceAlert.notManageTime +
                      Math.trunc(diff2 / (60 * 1000)) -
                      300
                    ).toString() +
                    ":00",
                  ServiceAlertStatus: {
                    Name: "Manual Close",
                    Key: 649388032,
                  },
                  FollowCloseUser: $scope.LastServiceAlert.FollowUpUser,
                  FollowUpComments: $scope.LastServiceAlert.FollowUpComments,
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
              PresentLastServiceAlert.ServiceAlertStatus.Key == 649388032 &&
              $scope.PresentStatus.Name == "Manual Close"
            ) {
              let nextServiceAlertKey = PresentLastServiceAlert["Key"];
              $scope.ServiceAlertForUpdateQuery = {
                "@objectType": "ServiceAlert",
                Key: nextServiceAlertKey,
                // FollowCloseUser: $scope.LastServiceAlert.FollowUpUser, no se cambia porque carolina dijo que era solo el que la cerraba
                FollowUpComments: $scope.LastServiceAlert.FollowUpComments,
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

      $scope.formInfo.beforeOKClick = function () {
        if (!applied) {
          $scope.Satus = $scope.PresentStatus.Name;
          $scope.Coment = $scope.LastServiceAlert.FollowUpComments;
          $scope.Action =
            $scope.LastServiceAlert.FollowUpAction["@DisplayString"];
          if (
            $scope.PresentStatus.Name == "Accepted" ||
            $scope.PresentStatus.Name == "Manual Close"
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
                Key: 309641216,
                "@DisplayString": "Devolver Alerta a Front",
              });
            }
            if ($scope.selectedValues.includes("2")) {
              boolActTwo = true;
              actionss.push({
                Key: 989011968,
                "@DisplayString": "Llamar al cliente",
              });
            }
            if ($scope.selectedValues.includes("3")) {
              boolActThree = true;
              actionss.push({
                Key: 989003776,
                "@DisplayString": "Llamar al proveedor",
              });
            }
            if ($scope.selectedValues.includes("4")) {
              boolActFour = true;
              actionss.push({
                Key: 309649408,
                "@DisplayString":
                  "Se realiza el reporte de las novedades del servicio",
              });
            }
            if (
              PresentLastServiceAlert.ServiceAlertStatus.Key == 857653251 && //pending
              $scope.PresentStatus.Name == "Accepted"
            ) {
              if (boolActOne || boolActTwo || boolActThree || boolActFour) {
                let nextServiceAlertKey = PresentLastServiceAlert["Key"];
                let oneOrnoCeros = "";
                if (Math.trunc(diff / (60 * 1000)).toString().length == 1) {
                  oneOrnoCeros = "0";
                }
                $scope.ServiceAlertForUpdateQuery = {
                  "@objectType": "ServiceAlert",
                  Key: nextServiceAlertKey,
                  managementDate: managementD,
                  notManageTime: Math.trunc(diff / (60 * 1000)),
                  notManageTimeStr:
                    "00:" +
                    oneOrnoCeros +
                    Math.trunc(diff / (60 * 1000)).toString() +
                    ":00",
                  // totalTime: (PresentLastServiceAlert.notManageTime + PresentLastServiceAlert.manualManageTime).toString(),
                  ServiceAlertStatus: {
                    Name: "Accepted",
                    Key: 857653252,
                  },
                  FollowUpUser: $scope.LastServiceAlert.FollowUpUser,
                  FollowUpComments: $scope.LastServiceAlert.FollowUpComments,
                  FollowUpActions: actionss,
                };
                $scope.updateAndRefreshAlert($scope.ServiceAlertForUpdateQuery);
              } else {
                let nextServiceAlertKey = PresentLastServiceAlert["Key"];
                let oneOrnoCeros = "";
                if (Math.trunc(diff / (60 * 1000)).toString().length == 1) {
                  oneOrnoCeros = "0";
                }
                $scope.ServiceAlertForUpdateQuery = {
                  "@objectType": "ServiceAlert",
                  Key: nextServiceAlertKey,
                  managementDate: managementD,
                  notManageTime: Math.trunc(diff / (60 * 1000)),
                  notManageTimeStr:
                    "00:" +
                    oneOrnoCeros +
                    Math.trunc(diff / (60 * 1000)).toString() +
                    ":00",
                  // totalTime: (PresentLastServiceAlert.notManageTime + PresentLastServiceAlert.manualManageTime).toString(),
                  ServiceAlertStatus: {
                    Name: "Accepted",
                    Key: 857653252,
                  },
                  FollowUpUser: $scope.LastServiceAlert.FollowUpUser,
                  FollowUpComments: $scope.LastServiceAlert.FollowUpComments,
                  //FollowUpActions: actionss,
                };
                $scope.updateAndRefreshAlert($scope.ServiceAlertForUpdateQuery);
              }
            } else if (
              PresentLastServiceAlert.ServiceAlertStatus.Key == 857653252 && //Accepted
              $scope.PresentStatus.Name == "Accepted"
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
                FollowUpActions: actionss,
              };
              $scope.updateAndRefreshAlert($scope.ServiceAlertForUpdateQuery);
            } else if (
              PresentLastServiceAlert.ServiceAlertStatus.Key == 857653252 &&
              $scope.PresentStatus.Name == "Manual Close"
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
                  manualManageTimeStr:
                    "00:" +
                    (Math.trunc(diff2 / (60 * 1000)) - 300).toString() +
                    ":00",
                  totalTimeDuration:
                    PresentLastServiceAlert.notManageTime +
                    Math.trunc(diff2 / (60 * 1000)) -
                    300,
                  totalTime:
                    "00:" +
                    (
                      PresentLastServiceAlert.notManageTime +
                      Math.trunc(diff2 / (60 * 1000)) -
                      300
                    ).toString() +
                    ":00",
                  ServiceAlertStatus: {
                    Name: "Manual Close",
                    Key: 649388032,
                  },
                  FollowCloseUser: $scope.LastServiceAlert.FollowUpUser,
                  FollowUpComments: $scope.LastServiceAlert.FollowUpComments,
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
              PresentLastServiceAlert.ServiceAlertStatus.Key == 649388032 &&
              $scope.PresentStatus.Name == "Manual Close"
            ) {
              let nextServiceAlertKey = PresentLastServiceAlert["Key"];
              $scope.ServiceAlertForUpdateQuery = {
                "@objectType": "ServiceAlert",
                Key: nextServiceAlertKey,
                // FollowCloseUser: $scope.LastServiceAlert.FollowUpUser, no se cambia porque carolina dijo que era solo el que la cerraba
                FollowUpComments: $scope.LastServiceAlert.FollowUpComments,
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
      };
    },
  ]);
});
