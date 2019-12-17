import authoritizeRoutes from './routesAuthority.config';

const routesConfig = [
  // user
  {
    path: '/user',
    // component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      // { path: '/user/register', component: './User/Register' },
      // { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      // { path: '/', redirect: '/dashboard/projectDashboard' },
      // dashboard
      // { path: '/', redirect: '/dashboard/analysis' },
      // {
      //   path: '/dashboard',
      //   name: 'dashboard',
      //   icon: 'dashboard',
      //   routes: [
      //     {
      //       path: '/dashboard/analysis',
      //       name: 'analysis',
      //       component: './Dashboard/Analysis',
      //     },
      //     {
      //       path: '/dashboard/monitor',
      //       name: 'monitor',
      //       component: './Dashboard/Monitor',
      //     },
      //     {
      //       path: '/dashboard/workplace',
      //       name: 'workplace',
      //       component: './Dashboard/Workplace',
      //     },
      //   ],
      // },

      // 管理员 dashboard
      {
        path: '/dashboard/projectDashboard',
        component: './Dashboard/projectDashboard',
      },
      // {
      //   path: '/dashboard/analysis',
      //   name: 'analysis',
      //   component: './Dashboard/Analysis',
      // },

      //系统管理
      {
        path: '/system',
        icon: 'setting',
        name: 'system',
        routes: [
          {
            path: '/system/useradmin',
            name: 'useradmin',
            component: './System/UserAdmin',
          },
          {
            path: '/system/roleadmin',
            name: 'roleadmin',
            component: './System/RoleAdmin',
          },
          {
            path: '/system/registered',
            name: 'registered',
            component: './System/Registered',
          },
        ],
      },
      //基础数据
      {
        path: '/fundamental',
        icon: 'database',
        name: 'fundamental',
        routes: [

          {
            path: '/fundamental/areaadmin',
            name: 'areaadmin',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/fundamental/areaadmin',
                redirect: '/fundamental/areaadmin/add',
              },
              {
                path: '/fundamental/areaadmin/add',
                name: 'list',
                component: './FundaMental/Areaadmin/Add',
              },
            ],
          },
          /*{
            path: '/fundamental/businessadmin',
            name: 'businessadmin',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/fundamental/businessadmin',
                redirect: '/fundamental/businessadmin/businessadd',
              },
              {
                path: '/fundamental/businessadmin/businessadd',
                name: 'businessadmin',
                component: './FundaMental/BusinessAdmin/BusinessAdd',
              },
              {
                path: '/fundamental/businessadmin/businessnew',
                name: 'new',
                component: './FundaMental/BusinessAdmin/BusinessNew',
              },
              {
                path: '/fundamental/businessadmin/businessupdate',
                name: 'update',
                component: './FundaMental/BusinessAdmin/BusinessUpdate',
              },
            ],
          },*/
          {
            path: '/fundamental/customermanagement',
            name: 'customermanagement',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/fundamental/customermanagement',
                redirect: '/fundamental/customermanagement/list',
              },
              {
                path: '/fundamental/customermanagement/list',
                name: 'list',
                component: './FundaMental/CustomerManagement/CustomerManagement',
              },
              {
                path: '/fundamental/customermanagement/add',
                name: 'add',
                component: './FundaMental/CustomerManagement/CustomerManagementAdd',
              },
              {
                path: '/fundamental/customermanagement/update',
                name: 'update',
                component: './FundaMental/CustomerManagement/CustomerManagementUpdate',
              },
            ],
          },
          {
            path: '/fundamental/suppliermanagement',
            name: 'suppliermanagement',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/fundamental/suppliermanagement',
                redirect: '/fundamental/suppliermanagement/list',
              },
              {
                path: '/fundamental/suppliermanagement/list',
                name: 'list',
                component: './FundaMental/SupplierManagement/SupplierManagement',
              },
              {
                path: '/fundamental/suppliermanagement/add',
                name: 'add',
                component: './FundaMental/SupplierManagement/SupplierManagementAdd',
              },
              {
                path: '/fundamental/suppliermanagement/update',
                name: 'update',
                component: './FundaMental/SupplierManagement/SupplierManagementUpdate',
              },
            ],
          },
          {
            path: '/fundamental/dapartmanage',
            name: 'dapartmanage',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/fundamental/dapartmanage',
                redirect: '/fundamental/dapartmanage/list',
              },
              {
                path: '/fundamental/dapartmanage/list',
                name: 'list',
                component: './FundaMental/DapartManage/DapartManagelist',
              },
            ],
          },
          {
            path: '/fundamental/personalfile',
            name: 'personalfile',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/fundamental/personalfile',
                redirect: '/fundamental/personalfile/list',
              },
              {
                path: '/fundamental/personalfile/list',
                name: 'list',
                component: './FundaMental/PersonalFile/PersonalFilelist',
              },
              {
                path: '/fundamental/personalfile/add',
                name: 'add',
                component: './FundaMental/PersonalFile/PersonalFileadd',
              },
              {
                path: '/fundamental/personalfile/update',
                name: 'update',
                component: './FundaMental/PersonalFile/PersonalFileupdate',
              },
            ],
          },
          {
            path: '/fundamental/incomeandexpenditure',
            name: 'incomeandexpenditure',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/fundamental/incomeandexpenditure',
                redirect: '/fundamental/incomeandexpenditure/list',
              },
              {
                path: '/fundamental/incomeandexpenditure/list',
                name: 'list',
                component: './FundaMental/IncomeAndExpenditure/IncomeAndExpenditure',
              }
            ],
          },
          //计量单位
          {
            path: '/fundamental/measurement',
            name: 'measurement',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/fundamental/measurement',
                redirect: '/fundamental/measurement/list',
              },
              {
                path: '/fundamental/measurement/list',
                name: 'list',
                component: './FundaMental/MeasureMent/MeasureMent',
              }
            ],
          },
          {
            path: '/fundamental/businessline',
            name: 'businessline',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/fundamental/businessline',
                redirect: '/fundamental/businessline/list',
              },
              {
                path: '/fundamental/businessline/list',
                name: 'list',
                component: './FundaMental/BusinessLine/BusinessLine',
              }
            ],
          },
          //物料分类
          {
            path: '/fundamental/material',
            name: 'material',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/fundamental/material',
                redirect: '/fundamental/material/list',
              },
              {
                path: '/fundamental/material/list',
                name: 'list',
                component: './FundaMental/Material/Material',
              }
            ],
          },
          //物料管理
          {
            path: '/fundamental/matemanage',
            name: 'matemanage',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/fundamental/matemanage',
                redirect: '/fundamental/matemanage/list',
              },
              {
                path: '/fundamental/matemanage/list',
                name: 'list',
                component: './FundaMental/Matemanage/Matemanage',
              },
              {
                path: '/fundamental/matemanage/add',
                name: 'add',
                component: './FundaMental/Matemanage/MatemanageAdd',
              },
              {
                path: '/fundamental/matemanage/update',
                name: 'update',
                component: './FundaMental/Matemanage/MatemanageUpdate',
              },
            ],
          },

        ],
      },
      //合同管理
      {
        path: '/agreemanagement',
        icon: 'schedule',
        name: 'agreemanagement',
        routes: [
          //合同管理
          {
            path: '/agreemanagement/contact',
            name: 'contact',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/agreemanagement/contact',
                redirect: '/agreemanagement/contact/list',
              },
              {
                path: '/agreemanagement/contact/list',
                name: 'list',
                component: './AgreeManagement/Contact/ContactManagement',
              },
              {
                path: '/agreemanagement/contact/update',
                name: 'update',
                // component: './AgreeManagement/Contact/ContactManagementUpdate',
              },
            ],
          },
          //合同审批
          {
            path: '/agreemanagement/approve',
            name: 'aggreeapprove',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/agreemanagement/approve',
                redirect: '/agreemanagement/approve/approve',
              },
              {
                path: '/agreemanagement/approve/approve',
                name: 'list',
                component: './AgreeManagement/Approve/Approve',
              },
              {
                path: '/agreemanagement/approve/agree',
                name: 'agree',
                 component: './AgreeManagement/Approve/Agree',
              },
            ],
          },
          //合同变更审批
          {
            path: '/agreemanagement/changeapprove',
            name: 'changeapprove',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/agreemanagement/changeapprove',
                redirect: '/agreemanagement/changeapprove/changeapprove',
              },
              {
                path: '/agreemanagement/changeapprove/changeapprove',
                name: 'list',
                component: './AgreeManagement/ChangeApprove/ChangeApprove',
              },
              {
                path: '/agreemanagement/changeapprove/changeagree',
                name: 'change',
                component: './AgreeManagement/ChangeApprove/ChangeAgree',
              },
            ],
          },
          //收款管理
          {
            path: '/agreemanagement/financial',
            name: 'financial',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/agreemanagement/financial',
                redirect: '/agreemanagement/financial/list',
              },
              {
                path: '/agreemanagement/financial/list',
                name: 'list',
                component: './AgreeManagement/Financial/FinancialManagement',
              },
              {
                path: '/agreemanagement/financial/add',
                name: 'add',
                // component: './AgreeManagement/Financial/FinancialAdd',
              },
            ],
          },
          //文档管理
          {
            path: '/agreemanagement/document',
            name: 'document',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/agreemanagement/document',
                redirect: '/agreemanagement/document/list',
              },
              {
                path: '/agreemanagement/document/list',
                name: 'list',
                component: './AgreeManagement/Document/DocumentManagement',
              },
              {
                path: '/agreemanagement/document/add',
                name: 'add',
                // component: './AgreeManagement/Document/DocumentAdd',
              },
            ],
          },

        ],
      },
      //项目管理
      {
        path: '/ecprojectmanagement',
        icon: 'project',
        name: 'ecprojectmanagement',
        routes: [
          {
            path: '/ecprojectmanagement/projectapproval',
            name: 'projectapproval',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/ecprojectmanagement/projectapproval',
                redirect: '/ecprojectmanagement/projectapproval/list',
              },
              {
                path: '/ecprojectmanagement/projectapproval/list',
                name: 'list',
                component: './EcProjectManagement/ProjectApproval/ProjectApproval',
              },
              {
                path: '/ecprojectmanagement/projectapproval/add',
                name: 'add',
                component: './EcProjectManagement/ProjectApproval/ProjectAdd',
              },
              {
                path: '/ecprojectmanagement/projectapproval/update',
                name: 'update',
                component: './EcProjectManagement/ProjectApproval/ProjectUpdate',
              },
            ],
          },
          //立项审核
          {
            path: '/ecprojectmanagement/projectverify',
            name: 'projectverify',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/ecprojectmanagement/projectverify',
                redirect: '/ecprojectmanagement/projectverify/list',
              },
              {
                path: '/ecprojectmanagement/projectverify/list',
                name: 'list',
                component: './EcProjectManagement/ProjectVerify/ProjectVerify',
              },
              {
                path: '/ecprojectmanagement/projectverify/query',
                name: 'query',
                component: './EcProjectManagement/ProjectVerify/ProjectVerifyQuery',
              }
            ],
          },
          //里程碑档案节点
          {
            path: '/ecprojectmanagement/bosom',
            name: 'bosom',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/ecprojectmanagement/bosom',
                redirect: '/ecprojectmanagement/bosom/list',
              },
              {
                path: '/ecprojectmanagement/bosom/list',
                name: 'list',
                component: './EcProjectManagement/Bosom/Bosom',
              },
              {
                path: '/ecprojectmanagement/bosom/add',
                name: 'add',
                component: './EcProjectManagement/Bosom/BosomAdd',
              },
              {
                path: '/ecprojectmanagement/bosom/update',
                name: 'update',
                component: './EcProjectManagement/Bosom/BosomUpdate',
              }
            ],
          },
          //里程碑节点
          {
            path: '/ecprojectmanagement/typemiel',
            name: 'typemiel',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/ecprojectmanagement/typemiel',
                redirect: '/ecprojectmanagement/typemiel/list',
              },
              {
                path: '/ecprojectmanagement/typemiel/list',
                name: 'list',
                component: './EcProjectManagement/TypeMiel/TypeMiel',
              },
             /* {
                path: '/ecprojectmanagement/bosom/add',
                name: 'add',
                component: './EcProjectManagement/Bosom/BosomAdd',
              },
              {
                path: '/ecprojectmanagement/bosom/update',
                name: 'update',
                component: './EcProjectManagement/Bosom/BosomUpdate',
              }*/
            ],
          },
          {
            path: '/ecprojectmanagement/processmanege',
            name: 'processmanege',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/ecprojectmanagement/processmanege',
                redirect: '/ecprojectmanagement/processmanege/list',
              },
              {
                path: '/ecprojectmanagement/processmanege/list',
                name: 'process',
                component: './EcProjectManagement/ProcessManege/ProcessManege',
              },
              /*       {
                       path: '/projectmanagement/processmanege/add',
                       name: 'add',
                       component: './ProjectManagement/ProcessManege/ProcessAdd',
                     },*/
            ],
          },
          {
            path: '/ecprojectmanagement/milestonereview',
            name: 'milestonereview',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/ecprojectmanagement/milestonereview',
                redirect: '/ecprojectmanagement/milestonereview/list',
              },
              {
                path: '/ecprojectmanagement/milestonereview/list',
                name: 'list',
                component: './EcProjectManagement/MilestoneReview/MilestoneReview',
              }
            ],
          },
          {
            path: '/ecprojectmanagement/marketingmilestone',
            name: 'marketingmilestone',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/ecprojectmanagement/marketingmilestone',
                redirect: '/ecprojectmanagement/marketingmilestone/list',
              },
              {
                path: '/ecprojectmanagement/marketingmilestone/list',
                name: 'list',
                component: './EcProjectManagement/MarketingMilestone/MarketingMilestone',
              }
            ],
          },
          {
            path: '/ecprojectmanagement/concludingAudit',
            name: 'concludingAudit',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/ecprojectmanagement/concludingAudit',
                redirect: '/ecprojectmanagement/concludingAudit/list',
              },
              {
                path: '/ecprojectmanagement/concludingAudit/list',
                name: 'list',
                component: './EcProjectManagement/ConcludingAudit/ConcludingAudit',
              }
            ],
          },

          {
            path: '/ecprojectmanagement/findproject',
            name: 'findproject',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/ecprojectmanagement/findproject',
                redirect: '/ecprojectmanagement/findproject/list',
              },
              {
                path: '/ecprojectmanagement/findproject/list',
                name: 'process',
                component: './EcProjectManagement/FindProject/FindProject',
              },
              {
                path: '/ecprojectmanagement/findproject/change',
                name: 'change',
                component: './EcProjectManagement/FindProject/ProjectChange',
              },
              {
                path: '/ecprojectmanagement/findproject/project',
                name: 'project',
                component: './EcProjectManagement/FindProject/ProjectDetails',
              }
            ],
          },
          /*{
            path: '/ecprojectmanagement/customermaintenance',
            name: 'customermaintenance',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/ecprojectmanagement/customermaintenance',
                redirect: '/ecprojectmanagement/customermaintenance/list',
              },
              {
                path: '/ecprojectmanagement/customermaintenance/list',
                name: 'list',
                component: './EcProjectManagement/CustomerMaintenance/CustomerMaintenance',
              }
            ],
          },*/
          {
            path: '/ecprojectmanagement/paymentmaintenance',
            name: 'paymentmaintenance',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/ecprojectmanagement/paymentmaintenance',
                redirect: '/ecprojectmanagement/paymentmaintenance/list',
              },
              {
                path: '/ecprojectmanagement/paymentmaintenance/list',
                name: 'list',
                component: './EcProjectManagement/PaymentMaintenance/PaymentMaintenance',
              },
              {
                path: '/ecprojectmanagement/paymentmaintenance/add',
                name: 'add',
                component: './EcProjectManagement/PaymentMaintenance/PaymentMaintenanceAdd',
              },
              {
                path: '/ecprojectmanagement/paymentmaintenance/update',
                name: 'update',
                component: './EcProjectManagement/PaymentMaintenance/PaymentMaintenanceUpdate',
              }
            ],
          },
        ],
      },
      //绩效管理
       {
         path: '/performanagement',
         icon: 'profile',
         name: 'performanagement',
         routes: [
           {
             path: '/performanagement/performanagement',
             name: 'performanagement',
             hideChildrenInMenu: true,
             routes: [
               {
                 path: '/performanagement/performanagement',
                 redirect: '/performanagement/performanagement/list',
               },
               {
                 path: '/performanagement/performanagement/list',
                 name: 'list',
                 component: './PerforManagement/PerforManagement/PerforManagement',
               },
             ],
           },
           {
             path: '/performanagement/bussinesspeople',
             name: 'bussinesspeople',
             component: './PerforManagement/BussinessPeople/BussinessPeople',
           },
         ],
       },

      //发票管理
      {
        path: '/billmanagement',
        icon: 'profile',
        name: 'bill',
        routes: [
          {
            path: '/billmanagement/billmanagement',
            name: 'billmanagement',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/billmanagement/billmanagement',
                redirect: '/billmanagement/billmanagement/list',
              },
              {
                path: '/billmanagement/billmanagement/list',
                name: 'list',
                component: './BillManagement/BillManagement/BillManagement',
              },
              {
                path: '/billmanagement/billmanagement/add',
                name: 'add',
                component: './BillManagement/BillManagement/BillManagementAdd',
              },
              {
                path: '/billmanagement/billmanagement/update',
                name: 'update',
                component: './BillManagement/BillManagement/BillManagementUpdate',
              },
            ],
          },
          {
            path: '/billmanagement/receiptmoney',
            name: 'receiptmoney',
            hideChildrenInMenu: true,
            routes:[
              {
                path: '/billmanagement/receiptmoney',
                redirect: '/billmanagement/receiptmoney/list',
              },
              {
                path: '/billmanagement/receiptmoney/list',
                name: 'list',
                component: './BillManagement/ReceiptMoney/ReceiptMoney',
              },
            ]
          },
          {
            path: '/billmanagement/suresettle',
            name: 'suresettle',
            component: './BillManagement/SureSettle/SureSettle',
          },
        ],
      },
      //日常审批
      {
        path: '/approval',
        icon: 'audit',
        name: 'approval',
        // authority:["corpadmin"],
        routes: [
          {
            path: '/approval/reimbursementform',
            name: 'reimbursementform',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/approval/reimbursementform',
                redirect: '/approval/reimbursementform/list',
              },
              {
                path: '/approval/reimbursementform/list',
                name: 'list',
                component: './Approval/ReimbursementRorm/ReimbursementRorm',
              },
            ],
          },
          {
            path: '/approval/statustable',
            name: 'status',
            //component: './Approval/Status/StatusTable'
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/approval/statustable',
                // authority:["corpadmin"],
                redirect: '/approval/statustable/list',
              },
              {
                path: '/approval/statustable/list',
                name: 'list',
                // authority:["corpadmin"],
                component: './Approval/Status/StatusTable',
              },
              {
                path: '/approval/statustable/application',
                name: 'application',
                // authority:["corpadmin"],
                component: './Approval/Status/Application',
              },

              {
                path: '/approval/statustable/save',
                name: 'save',
                authority:["corpadmin"],
              },
            ],
          },
          {
            path: '/approval/myapproval',
            name: 'myapproval',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/approval/myapproval',
                redirect: '/approval/myapproval/list',
              },
              {
                path: '/approval/myapproval/list',
                name: 'list',
                component: './Approval/MyApproval/MyApproval',
              },
              {
                path: '/approval/myapproval/approval',
                name: 'approval',
                component: './Approval/MyApproval/Approval',
              },
              {
                path: '/approval/myapproval/approvalcheck',
                name: 'approvalcheck',
                component: './Approval/MyApproval/ApprovalCheck',
              },
            ],
          },

        ],
      },
      /* {
         path: '/approval',
         icon: 'audit',
         name: 'approval',
         routes: [
           {
             path: '/approval/statustable',
             name: 'status',
             //component: './Approval/Status/StatusTable'
             hideChildrenInMenu: true,
             routes: [
               {
                 path: '/approval/statustable',
                 // authority:["corpadmin"],
                 redirect: '/approval/statustable/list',
               },
               {
                 path: '/approval/statustable/list',
                 name: 'list',
                 // authority:["corpadmin"],
                 component: './Approval/Status/StatusTable',
               },
               {
                 path: '/approval/statustable/application',
                 name: 'application',
                 // authority:["corpadmin"],
                 component: './Approval/Status/Application',
               },
               {
                 path: '/approval/statustable/approval',
                 name: 'approval',
                 // authority:["corpadmin"],
                 component: './Approval/Status/Approval',
               },
               {
                 path: '/approval/statustable/save',
                 name: 'save',
                 // authority:["corpadmin"],
               },
             ],
           },
          /!* {
             path: '/approval/finance',
             name: 'finance',
              component: './Approval/Finance/Finance',
           },
           {
             path: '/approval/leave',
             name: 'leave',
             component: './Approval/Leave/Leave',
           },*!/

         ],
       },*/
      //分析统计
        {
          path: '/analysis',
          icon: 'bar-chart',
          name: 'analysis',
          routes: [
            {
              path: '/analysis/fundnetvalue',
              name: 'fundnetvalue',
              component: './Analysis/NetFund',
            },
            {
              path: '/analysis/riskWarning',
              name: 'riskWarning',
              component: './Analysis/RiskWarning',
            },
            //项目收款统计
            /*{
              path: '/analysis/projectReceipt',
              name: 'projectReceipt',
              component: './Analysis/projectReceipt',
            },*/
          ],
        },

    ],
  },
];

export default routesConfig;
