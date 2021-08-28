angular.module('HylanApp').config(function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {


  Globals.BaseUrl = $("#linkRoot").attr("href");

  $urlRouterProvider.otherwise('/Login');

  $httpProvider.interceptors.push('AuthHttpResponseInterceptor');
  //enabling for Load Testing Purpose.
  //$locationProvider.html5Mode(true);

  $stateProvider
      .state('Login', {
        url: '/Login',
        views: {
          'BodyContent': {
            templateUrl: Globals.BaseUrl + 'app/account/views/index.html',
            controller: 'LoginController'
          }
        },
        title: 'Login - Hylan'
      })
      .state('Default', {
        url: '/Default',
        views: {
          'BodyContent': {
            templateUrl: Globals.BaseUrl + 'app/account/views/default.html',
            controller: function ($controller, $scope) {
              $controller('BaseController', { $scope: $scope });
            }
          }
        },
        title: 'Default - Hylan'
      })

      .state('Projects', {
        url: '/Projects',
        views: {
          'PageButtons': {
            templateUrl: Globals.BaseUrl + 'app/Projects/views/menu.html'
          },
          'BodyContent': {
            templateUrl: Globals.BaseUrl + 'app/Projects/views/index.html',
            controller: 'ProjectsController'
          }
        },
        title: 'Manage Projects - Hylan',
        screenId: Globals.Screens.MANAGE_PROJECTS.ID
      })

      .state('Jobs', {
        url: '/Jobs',
        views: {
          'PageButtons': {
            templateUrl: Globals.BaseUrl + 'app/Jobs/views/menu.html'
          },
          'BodyContent': {
            templateUrl: Globals.BaseUrl + 'app/Jobs/views/index.html',
            controller: 'JobsController'
          }
        },
        title: 'Manage Jobs - Hylan',
        screenId: Globals.Screens.MANAGE_JOBS.ID
      })
       .state('Notes', {
         url: '/Notes',
         views: {
           'PageButtons': {
             templateUrl: '/app/Notes/views/menu.html'
           },
           'BodyContent': {
             templateUrl: '/app/Notes/views/index.html',
             controller: 'NotesController'
           }
         },
         title: 'Notes',
         screenId: 0
       })
     
      .state('JobMap', {
        url: '/JobMap',
        views: {
          'PageButtons': {
            templateUrl: Globals.BaseUrl + 'app/maps/views/menu.html'
          },
          'BodyContent': {
            templateUrl: Globals.BaseUrl + 'app/maps/views/maps-index.html',
            controller: 'MapsController'
          }
        },
        title: 'Map View - Hylan',
        screenId: Globals.Screens.JOB_MAP.ID
      })

      .state('Companies', {
        url: '/Companies',
        views: {
          'BodyContent': {
            templateUrl: Globals.BaseUrl + 'app/companies/views/index.html',
            controller: 'CompaniesController'
          },
          'PageButtons': {
            templateUrl: Globals.BaseUrl + 'app/companies/views/menu.html'
          }
        },
        title: 'Manage Clients - Hylan',
        screenId: Globals.Screens.MANAGE_CLIENTS.ID
      })
    .state('Attachments', {
      url: '/Attachments',
      views: {
        'BodyContent': {
          templateUrl: Globals.BaseUrl + 'app/attachments/views/attachment.html',
          controller: 'AttachmentsController as vm'
        },
        'PageButtons': {
          templateUrl: Globals.BaseUrl + 'app/Notes/views/menu.html'
        }
      },
      title: 'Manage Attachments - Hylan',
      screenId: Globals.Screens.MANAGE_ATTACHMENTS.ID
    })
      .state('Users', {
        url: '/Users',
        views: {
          'BodyContent': {
            templateUrl: Globals.BaseUrl + 'app/users/views/users-index.html',
            controller: 'UsersController'
          }
        },
        title: 'Manage Users - Hylan',
        screenId: Globals.Screens.MANAGE_USERS.ID
      })
      .state('UserRoles', {
        url: '/UserRoles',
        views: {
          'BodyContent': {
            templateUrl: Globals.BaseUrl + 'app/users/views/userroles-index.html',
            controller: 'UserRolesController'
          }
        },
        title: 'Manage User Roles - Hylan',
        screenId: Globals.Screens.MANAGE_USER_ROLES.ID
      })
      .state('UserRoleDetails', {
        url: '/UserRoles/{id}',
        views: {
          'BodyContent': {
            templateUrl: Globals.BaseUrl + 'app/users/views/userrole-details.html',
            controller: 'UserRoleDetailsController'
          }
        },
        title: 'User Role Permissions - Hylan',
        screenId: Globals.Screens.MANAGE_USER_ROLES_DETAILS.ID
      })
      .state('Tasks', {
          url: '/Tasks/{id}',
          views: {
              'BodyContent': {
                  templateUrl: '/app/tasks/views/index.html',
                  controller: 'TaskController as vm'
              }
          },
          title: 'Add Edit Tasks - Hylan',
          screenId: 0,
          params: {
              JOB: { JOB_ID: 0, HYLAN_PROJECT_ID: 0, JOB_FILE_NUMBER: 0, BACK_STATE: 'Jobs' }
          }
      })
       .state('TasksRoster', {
        url: '/TasksRoster/{id}',
        views: {
          'BodyContent': {
            templateUrl: '/app/tasks/views/roster-index.html',
            controller: 'TaskRosterController'
          }
        },
        title: 'Manage Tasks - Hylan',
        screenId: Globals.Screens.MANAGE_TASKS.ID
      })
    .state('Dailies', {
      url: '/Dailies/{id}',
      views: {
        'BodyContent': {
          templateUrl: '/app/dailies/views/index.html',
          controller: 'DailiesController'
        }
      },
      title: 'Manage Dailies - Hylan',
      screenId: Globals.Screens.MANAGE_DAILIES.ID
    })
      .state('Permits', {
          url: '/Permits/{id}',
        views: {
            'BodyContent': {
                templateUrl: '/app/permits/views/index.html',
                controller: 'PermitsController'
            }
        },
        title: 'Manage Permits - Hylan',
        screenId: Globals.Screens.MANAGE_PERMITS.ID
      })
      .state('TaskMatrixDashboard', {
          
          url: '/TaskMatrixDashboard/{id}',
          views: {
              'BodyContent': {
                  templateUrl: '/app/tasks/views/matrix-index.html',
                  controller: 'TaskMatrixController'
              }
          },
          title: 'Task Matrix Dashboard - Hylan',
          screenId: Globals.Screens.TASK_MATRIX.ID
      })
      .state('PermitDashboard', {
          url: '/PermitDashboard/{id}',
          views: {
              'BodyContent': {
                  templateUrl: '/app/permits/views/dsashboard.html',
                  controller: 'PermitDashoardController'
              }
          },
          title: 'Permit Dashboard - Hylan',
          screenId: Globals.Screens.PERMIT_DASHBOARD.ID
      })
      .state('OnHoldDashboard', {
          url: '/OnHoldDashboard/{id}',
          views: {
              'BodyContent': {
                  templateUrl: '/app/tasks/views/onhold-index.html',
                  controller: 'TaskOnHoldController'
              }
          },
          title: 'Task On-Hold Dashboard - Hylan',
          screenId: Globals.Screens.TASK_ON_HOLD.ID
          
      });
})

    .factory('$exceptionHandler', function (Utility, NOTIFYTYPE) {
      return function (exception, cause) {
        Utility.Notify({
          type: NOTIFYTYPE.ERROR,
          message: exception.message,
          detail: exception.stack
        });
      };
    });

