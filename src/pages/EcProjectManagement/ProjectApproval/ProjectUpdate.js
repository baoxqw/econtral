import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import FooterToolbar from '@/components/FooterToolbar';
import moment from 'moment'
import NormalTable from '@/components/NormalTable';
import router from 'umi/router';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  TreeSelect,
  Radio,
  Modal,
  Tree,
  AutoComplete,
  Row,
  Col,
  message,
  Popconfirm,
  Table,
  Tabs,
  Divider
} from 'antd';
import TreeTable from '../../tool/TreeTable/TreeTable';
import { toTree } from '../../tool/ToTree';
import ModelTable from '../../tool/ModelTable/ModelTable';
import TableModal from '@/pages/EcProjectManagement/ProjectApproval/TableModal';
import MarketModal from '@/pages/EcProjectManagement/ProjectApproval/MarketModal';
import NeedModal from '@/pages/EcProjectManagement/ProjectApproval/NeedModal';

const { TreeNode } = TreeSelect;
const { TabPane } = Tabs;
const { Option } = Select;

const fieldLabe = {
  fundname:'项目名称',
  fundtype:'项目类型',
  projector:'立项人',
  projectdate:'立项日期',
  projectmanager:'项目负责人',
  projectresponsibledepartment:'项目负责部门',
  itemamount:'项目经费(元)',
  costbudget:'成本预算(元)',
  projectschedulestart:'项目工期计划(开始)',
  projectschedulestop:'项目工期计划(结束)',
  externalexpenses:'外委费用(元)',
  taxrate:'税率',
  subcontractingratio:'分包比例(%)',
  professionalsubcontracting:'分包金额(元)',
  system:'系统内外',
  projectgrading:'项目分级',
  signingtime:'合同签订时间',
  acceptancetime:'合同验收时间',
  customertype:'客户类型',
  contractcontent:'合同内容',
  contractamount:'合同金额',
  additionalcharges:'额外费用',
  eca:'有效合同额',
  projectaddress:'项目所在地',
  paymentsitustion:'付款情况(%)',
  balance:'余额(万元)',
  businessleader:'商务负责人',
  p1:'p1',
  p2:'p2',
  p3:'p3',
  p4:'p4',
  p5:'p5',
  p6:'p6',
  cca:'贡献合同额',
  comname:'客户名称',
}

const dataAddKey = (data) => {
  return data.map((item) => {
    item.key = item.id;
    if(item.children){
      dataAddKey(item.children)
    }
    return item;
  })
}
const FormItem = Form.Item;
@connect(({ pd, papproval,loading }) => ({
  pd,
  papproval,
  loading:loading.models.papproval,
  submitting: loading.models.pd,
  loadingsub: loading.models.papproval,
  saveform:loading.effects['papproval/approvalAdd'],
  sub:loading.effects['papproval/endhandle'],
}))
@Form.create()
class ProjectUpdate extends PureComponent {
  state = {
    marModleSS:{},
    proUpdate:{},
    marliname:'',
    node_nameadd:null,
    liname:null,
    marModleVisible:false,
    marratioadd:'',
    nodemar_nameadd:'',
    marendadd:'',
    marratioa:'',
    node_namemara:'',
    marenda:'',
    pronamea:'',
    pronameadd:'',
    proratioa:'',
    proratioadd:'',
    proenda:'',
    proendadd:'',
    proModleName:'',
    marModleName:'',
    proModleCode:'',
    marModleCode:'',
    proModleVisible:false,
    projectModleData:[],
    marModleData:[],
    proRatio:'',
    proMilestoneoutcome:'',
    subShowOk:false,
    startValue: null,
    endValue: null,
    endOpen: false,
    startValueAssign: null,
    endValueAssign: null,
    endOpenAssign: false,
    endTimeShow:true,
    ProList:[],
    ProAddList:[],
    MarList:[],
    MarAddList:[],
    list_id:null,
    proNodevisibleAdd:false,
    proNodevisible:false,
    marNodevisible:false,
    marNodevisibleAdd:false,
    proTime:null,
    proAddTime:null,
    marTime:null,
    marAddTime:null,
    proInfor:null,
    proAddInfor:null,
    marInfor:null,
    marAddInfor:null,
    deptList:[],
    nodemar_name:'',
    initData:{},
    TreeData:[],
    TableData:[],
    SelectValue:[],
    selectedRowKeys:[], //立项人
    page:{},
    personConditions:[],
    person_id:null,
    TreeProjectData:[],
    TableProjectData:[],
    SelectPersonValue:"",
    selectedPersonRowKeys:[], //项目负责人
    ProjectConditions:[],
    Project_id:null,
    pageProject:{},


    //合同
    TableContractData:[],
    SelectContractValue:"",
    selectedContractRowKeys:[],
    ContractConditions:[{
      code:'STATUS',
      exp:'=',
      value:'审批通过'
    }],
    pageContract:{},

    departmentId:null,
    departmentTreeValue:[],

    deptId:null,
    deptName:'',

    signdate:null, //合同签订时间

    custName:"", //客户名称
    custId:null, //客户Id

    operatorId:null, //商务负责人Id
    operatorName:null, //商务负责人名称


    visible:false
  };
  columns2 = [

    {
      title: '序号',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '里程碑节点',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '里程碑类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '里程碑占比',
      dataIndex: 'ratio',
      key: 'ratio',
    },
    {
      title: '项目里程碑成果',
      dataIndex: 'milestoneoutcome',
      key: 'milestoneoutcome',
    },
    {
      title: '预计完成时间',
      dataIndex: 'estimateenddate',
      key: 'estimateenddate',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) => (
        <Fragment>
          <Popconfirm title='确定删除吗?' onConfirm={() => this.handleDelete(record)}>
            <a href="javascript:;" style={{color:'#ff2340'}}>删除</a>
          </Popconfirm>
          <Divider type="vertical" />
          <a type="primary" onClick={() => this.handleProChange(record)} >
            编辑
          </a>
        </Fragment>
      ),
    },
  ]
  columns22 = [

    {
      title: '序号',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '里程碑节点',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '里程碑类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '里程碑占比',
      dataIndex: 'ratio',
      key: 'ratio',
    },
    {
      title: '里程碑结果',
      dataIndex: 'milestoneoutcome',
      key: 'milestoneoutcome',
    },

    {
      title: '预计完成时间',
      dataIndex: 'estimateenddate',
      key: 'estimateenddate',
    },
    {
      title: '',
      dataIndex: 'operation',
      key: 'operation',
    },
  ]
  columns3 = [
    {
      title: '序号',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '里程碑节点',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '里程碑类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '里程碑占比',
      dataIndex: 'ratio',
      key: 'ratio',
    },
    {
      title: '里程碑结果',
      dataIndex: 'milestoneoutcome',
      key: 'milestoneoutcome',
    },
    {
      title: '预计完成时间',
      dataIndex: 'estimateenddate',
      key: 'estimateenddate',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) => (
        <Fragment>
          <Popconfirm title='确定删除吗?' onConfirm={() => this.handleDelete2(record)}>
            <a href="javascript:;" style={{color:'#ff2340'}}>删除</a>
          </Popconfirm>
          <Divider type="vertical" />
          <a type="primary" onClick={() => this.handleMarChange(record)}>
            编辑
          </a>
        </Fragment>
      ),
    },
  ]
  columnsNo = [
    {
      title: '序号',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '里程碑节点',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '里程碑类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '里程碑占比',
      dataIndex: 'ratio',
      key: 'ratio',
    },
    {
      title: '里程碑结果',
      dataIndex: 'milestoneoutcome',
      key: 'milestoneoutcome',
    },
    {
      title: '预计完成时间',
      dataIndex: 'estimateenddate',
      key: 'estimateenddate',
    },
    {
      title: '',
      dataIndex: 'operation',
      key: 'operation',
    },
  ]
  columnsNoNo = [
    {
      title: '序号',
      dataIndex: 'rownum',
      key: 'rownum',
    },
    {
      title: '里程碑节点',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '里程碑类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '里程碑占比',
      dataIndex: 'ratio',
      key: 'ratio',
    },
    {
      title: '里程碑结果',
      dataIndex: 'milestoneoutcome',
      key: 'milestoneoutcome',
    },
    {
      title: '预计完成时间',
      dataIndex: 'estimateenddate',
      key: 'estimateenddate',
    },
    {
      title: '',
      dataIndex: 'operation',
      key: 'operation',
    },
  ]
  componentDidMount() {
    const { dispatch } = this.props;
    const { SelectValue,SelectPersonValue,SelectBusinessValue,SelectClientValue } = this.state;

      console.log('上一页数据：',this.props)
      const initData = this.props.location.state.record

      // const initData = this.props.location.record
      const subShow = initData.status;
      const initiationpersonId = initData.initiationpersonId;
      const initiationpersonName = initData.initiationpersonName;
      const projectmanagerId = initData.projectmanagerId;//项目负责人
      const projectmanagerName = initData.projectmanagerName;
      const businessleaderId = initData.businessleaderId;//商务负责人
      const businessleaderName = initData.businessleaderName;
      const custId = initData.custId;//客户名称ID
      const custName = initData.custName;//客户名称
      const deptId = initData.deptId;//部门
      const deptName = initData.deptName;
      const signingdate = initData.signingdate;

      const contractId = initData.contractId;//合同
      const contractName = initData.contractName;

      if(subShow === '初始状态'){
        this.setState({
          subShowOk:true
        })
      }
      //项目里程碑
      dispatch({
        type:'papproval/fetchProjectNode',
        payload:{
          reqData:{
            project_id:initData.id,
            type:'项目'
          }
        },
        callback:(res)=>{
          if(res.resData){
            this.setState({projectModleData:res.resData})
          }
        }
      })
      //营销里程碑
      dispatch({
        type:'papproval/fetchMarketNode',
        payload:{
          reqData:{
            project_id:initData.id,
            type:'营销'
          }
        },
        callback:(res)=>{
          if(res.resData){
            this.setState({marModleData:res.resData})
          }
        }
      })
      if(initData.startdate){
        this.setState({
          startValue:moment(initData.startdate),
          endValue:moment(initData.enddate),
        })
      }
      if(initData.signingdate){
        this.setState({
          startValueAssign:moment(initData.signingdate),
          endValueAssign:moment(initData.acceptancedate),
        })
      }
      this.setState({
        initData,
        SelectValue:initiationpersonName,
        selectedRowKeys:[initiationpersonId],
        SelectPersonValue:projectmanagerName,
        selectedPersonRowKeys:[projectmanagerId],

        operatorName:businessleaderName,
        operatorId:businessleaderId,
        custName:custName,
        custId:custId,
        signdate:signingdate,

        SelectContractValue:contractName,
        selectedContractRowKeys:[contractId],

        deptId,
        deptName
      })

  }
  backClick = ()=>{
    router.push('/ecprojectmanagement/projectapproval/list')
  }
  validate =() =>{
    const { dispatch } = this.props;
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if(!err){
        return
      }
      const obj = {
        reqData:{
          ...fieldsValue,
          status:this.state.initData.status,
          id:this.state.initData.id,
          Initiationdate:fieldsValue['initiationdate']?fieldsValue['initiationdate'].format('YYYY-MM-DD'):'',
          enddate:fieldsValue['enddate']?fieldsValue['enddate'].format('YYYY-MM-DD'):'',
          startdate:fieldsValue['startdate']?fieldsValue['startdate'].format('YYYY-MM-DD'):'',
          signingdate:fieldsValue['signingdate']?fieldsValue['signingdate'].format('YYYY-MM-DD'):'',
          acceptancedate:fieldsValue['acceptancedate']?fieldsValue['acceptancedate'].format('YYYY-MM-DD'):'',
          projectmoney:Number(fieldsValue['projectmoney']),
          budget:Number(fieldsValue['budget']),
          outsourcingexpenses:Number(fieldsValue['outsourcingexpenses']),
          subcontractingratio:Number(fieldsValue['subcontractingratio']),
          subcontractingmoney:Number(fieldsValue['subcontractingmoney']),
          contractamount:Number(fieldsValue['contractamount']),
          additionalcharges:Number(fieldsValue['additionalcharges']),
          eca:Number(fieldsValue['eca']),
          balance:Number(fieldsValue['balance']),
          Initiationperson_id:this.state.selectedRowKeys[0],//立项人
          projectmanager_id:this.state.selectedPersonRowKeys[0],//项目负责人
          dept_id:this.state.deptId,//项目负责部门
          cust_id:this.state.custId,//客户
          businessleader_id:this.state.operatorId,//商务负责人
          contractId:this.state.selectedContractRowKeys[0], //合同id
        }
      }
      delete obj.reqData.initiationdate;
      dispatch({
        type:'papproval/approvalAdd',
        payload:obj,
        callback:(res)=>{
          // form.resetFields();
          message.success('保存成功')

        }
      })

    })
  }
  endHandle = ()=>{
    const { dispatch } = this.props;
    dispatch({
      type:'papproval/endhandle',
      payload:{
        reqData:{
          billcode:this.state.initData.id+'',
          billid:this.state.initData.id+'',
          billtype:'PM_PROJECT_H',
          auditors:[{
            id:94,
            name:'a',
          }],
          audittype:'PM_PROJECT_H'
        }
      },
      callback:(res)=>{
        message.success('提交成功',1,()=>{
          this.setState({subShowOk:false})
        })

      }
    })

  }
  handleProChange = (record)=>{
    this.setState({
      proUpdate:record,
      proratioadd:record.ratio,
      list_id:record.id,
      proInfor:record.code,
      pro_id:record.nodeId,
      node_name:record.name,
      liname:record.name,
      proratioa:record.ratio,
      proenda:record.milestoneoutcome,
      proendadd:record.milestoneoutcome,
      proTime:record.estimateenddate,
      proRatio:record.ratio,
      proMilestoneoutcome:record.milestoneoutcome,
      proNodevisible:true
    })
  }
  handleDelete = (record) =>{
    const { dispatch} = this.props
    dispatch({
      type:'papproval/deleteNode',
      payload:{
        reqData:{
          id:record.id
        }
      },
      callback:(res)=>{
        dispatch({
          type:'papproval/fetchProjectNode',
          payload:{
            reqData:{
              project_id:this.state.initData.id,
              type:'项目'
            }
          },
        })
      }
    })
  }
  handleDelete2 = (record) =>{
    const { dispatch} = this.props
    dispatch({
      type:'papproval/deleteNodeMarket',
      payload:{
        reqData:{
          id:record.id
        }
      },
      callback:(res)=>{
        dispatch({
          type:'papproval/fetchMarketNode',
          payload:{
            reqData:{
              project_id:this.state.initData.id,
              type:'营销'
            }
          },
        })
      }
    })
  }
  handleMarChange = (record)=>{
    this.setState({
      marModleSS:record,
      listmar_id:record.id,
      marratioa:record.ratio,
      marratioadd:record.ratio,
      marenda:record.milestoneoutcome,
      marendadd:record.milestoneoutcome,
      marInfor:record.code,
      mar_id:record.nodeId,
      marliname:record.name,
      nodemar_name:record.nodename,
      marTime:record.estimateenddate,
      marNodevisible:true
    })
  }
  //编辑项目里程碑节点
  proNodeOk = (e)=>{
    e.preventDefault();
    const { form,dispatch} = this.props
    if(!this.state.liname){
      message.error('请填写里程碑节点')
      return
    }
    const { page } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      const obj = {
        reqData:{
          project_id:this.state.initData.id,
          estimateenddate:values.patimeUpdate.format('YYYY-MM-DD'),
          code:values.pacodeUpdate,
          name:this.state.liname,
          type:'项目',
          ratio:this.state.proratioadd,
          milestoneoutcome:this.state.proendadd,
          id:this.state.list_id,
        }
      }
      dispatch({
       type:'papproval/proAdd',
       payload:obj,
       callback:(res)=>{
         dispatch({
           type:'papproval/fetchProjectNode',
           payload:{
             reqData:{
               project_id:this.state.initData.id,
               type:'项目'
             }
           },
         })
         message.success('成功')
         this.setState({
           proNodevisible:false,
           proratioadd:null,
           proendadd:null,
           liname:null,
         })
       }
   })
    })

  }
  //添加项目里程碑节点
  proAddNodeOk = (e)=>{
    e.preventDefault();
    const { form,dispatch} = this.props
    if(!this.state.liname){
      message.error('请填写里程碑节点')
      return
    }
    const { page } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      const obj = {
        reqData:{
          project_id:this.state.initData.id,
          estimateenddate:values.patimeAdd.format('YYYY-MM-DD'),
          code:values.pacodeAdd,
          type:'项目',
          name:this.state.liname,
          ratio:this.state.proratioadd,
          milestoneoutcome:this.state.proendadd,
        }
      }
      dispatch({
        type:'papproval/proAdd',
        payload:obj,
        callback:(res)=>{
          message.success('成功')
          this.setState({
            proNodevisibleAdd:false,
            pro_id:null,
            proratioadd:null,
            proendadd:null,
            liname:null,
          })
          dispatch({
            type:'papproval/fetchProjectNode',
            payload:{
              reqData:{
                project_id:this.state.initData.id,
                type:'项目'
              }
            },
            callback:(res)=>{
              if(res.resData){
                this.setState({projectModleData:res.resData})
              }
            }
          })

        }
      })
    })

  }
  //编辑营销里程碑节点
  marNodeOk = (e)=>{
    e.preventDefault();
    const { form,dispatch} = this.props
    if(!this.state.marliname){
      message.error('请选择里程碑节点')
      return
    }
    form.validateFieldsAndScroll((err, values) => {
      const obj ={
        reqData:{
          project_id:this.state.initData.id,
          code:values.marcodeUp,
          type:'营销',
          name:this.state.marliname,
          estimateenddate:values.martimeUp.format('YYYY-MM-DD'),
          ratio:this.state.marratioadd,
          milestoneoutcome:this.state.marendadd,
          id:this.state.listmar_id,
        }
      }
       dispatch({
      type:'papproval/proAdd',
      payload:obj,
      callback:(res)=>{
        this.setState({
          mar_id:null,
          marendadd:null,
          marratioadd:null,
          marliname:null,
        })
        dispatch({
          type:'papproval/fetchMarketNode',
          payload:{
            reqData:{
              project_id:this.state.initData.id,
              type:'营销'
            }
          },
          callback:(res)=>{
            if(res.resData){
              this.setState({marModleData:res.resData})
            }
          }
        })
        message.success('成功')
        this.setState({marNodevisible:false})
      }
    })
    })


  }
  //添加营销里程碑节点
  marAddNodeOkAdd = (e)=>{
    e.preventDefault();
    const { form,dispatch} = this.props
    if(!this.state.marliname){
      message.error('请选择里程碑节点')
      return
    }
    form.validateFieldsAndScroll((err, values) => {
      const obj ={
        reqData:{
          project_id:this.state.initData.id,
          code:values.marcode,
          type:'营销',
          name:this.state.marliname,
          estimateenddate:values.martime.format('YYYY-MM-DD'),
          ratio:this.state.marratioadd,
          milestoneoutcome:this.state.marendadd,
        }
      }
      dispatch({
        type:'papproval/proAdd',
        payload:obj,
        callback:(res)=>{
          this.setState({
            marAdd_id:null,
            marratioadd:null,
            marendadd:null,
            nodemar_nameadd:null,
          })
          dispatch({
            type:'papproval/fetchMarketNode',
            payload:{
              reqData:{
                project_id:this.state.initData.id,
                type:'营销'
              }
            },
            callback:(res)=>{
              this.setState({
                marendadd:null,
                marliname:null,
                marratioadd:null,
              })
              if(res.resData){
                this.setState({marModleData:res.resData})
              }
            }
          })
          message.success('成功')
          this.setState({marNodevisibleAdd:false})
        }
      })
    })

  }
  proNodeCancel = ()=>{
    this.setState({
      proNodevisible:false
    })
  }
  proAddNodeCancel = ()=>{
    this.setState({
      proNodevisibleAdd:false
    })
  }
  marNodeCancel = ()=>{
    this.setState({
      marNodevisible:false
    })
  }
  addMarket = ()=>{
    this.setState({
      marNodevisibleAdd:true
    })
  }
  addProNode = ()=>{
    this.setState({
      proNodevisibleAdd:true
    })
  }
  addModle = ()=>{
    this.setState({proModleVisible:true})
  }
  addMarModle = ()=>{
    this.setState({marModleVisible:true})
  }
  proModleIn = ()=>{
    console.log('模板导入')
  }
  marAddNodeCancel = ()=>{
    this.setState({
      marNodevisibleAdd:false
    })
  }
  proModlecodeDD = e =>{
    this.setState({proModleCode:e.target.value})
  }
  marModlecodeDD = e =>{
    this.setState({marModleCode:e.target.value})
  }
  proModlenameDD = e =>{
    this.setState({proModleName:e.target.value})
  }
  marModlenameDD = e =>{
    this.setState({marModleName:e.target.value})
  }
  //生成模板  确认
  proModleAdd = ()=>{
    const { proModleName,proModleCode,projectModleData } = this.state
    const { dispatch } = this.props
    let obj = {
      reqData:{
        code:proModleCode,
        name:proModleName,
        type:'项目'
      }
    }
    if(projectModleData.length<1){
      message.error('请先添加数据')
      return
    }
    dispatch({
      type:'papproval/proAddModleData',
      payload:obj,
      callback:(res)=>{
        const reqDataList = []
        const ee = {
          reqDataList:reqDataList
        }
        projectModleData.forEach((item)=>{
          reqDataList.push({templateHId:Number(res.id),nodeId:item.nodeId,code:item.code,rownum:item.code,name:item.nodename,type:item.type,
            ratio:item.ratio,milestoneoutcome:item.milestoneoutcome,estimateenddate:item.estimateenddate
          })
        })
        dispatch({
          type:'papproval/proAddModleArray',
          payload:ee,
          callback:(res)=>{
            if(res.errCode == '0'){
              message.success('模板生成成功',1,()=>{
                this.setState({proModleVisible:false})
              })
            }
          }
        })
      }
    })
  }
  marModleAdd = ()=>{
    const { marModleName,marModleCode,marModleData } = this.state
    const { dispatch } = this.props
    let obj = {
      reqData:{
        code:marModleName,
        name:marModleCode,
        type:'营销'
      }
    }
    if(marModleData.length<1){
      message.error('请先添加数据')
      return
    }
    dispatch({
      type:'papproval/proAddModleData',
      payload:obj,
      callback:(res)=>{
        const reqDataList = []
        const obj = {
          reqDataList:reqDataList
        }
        marModleData.forEach((item)=>{
          reqDataList.push({templateHId:Number(res.id),rownum:item.code,name:item.nodename,type:item.type,
            ratio:item.ratio,milestoneoutcome:item.milestoneoutcome
          })
        })
        dispatch({
          type:'papproval/proAddModleArray',
          payload:obj,
          callback:(res)=>{
            if(res.errCode == '0'){
              message.success('模板生成成功',1,()=>{
                this.setState({marModleVisible:false})
              })
            }
          }
        })
      }
    })
  }
  proModleAddCancel = ()=>{
    this.setState({proModleVisible:false})
  }
  marModleAddCancel = ()=>{
    this.setState({marModleVisible:false})
  }
  proValue = e=>{
    this.setState({proInfor:e.target.value})
  }
  proAddValue = e=>{
    this.setState({proAddInfor:e.target.value})
  }
  marValue = e=>{
    this.setState({marInfor:e.target.value})
  }
  marAddValue = e=>{
    this.setState({marAddInfor:e.target.value})
  }
  proratio = e=>{
    this.setState({proratioa:e.target.value})
  }
  proratioadds = e=>{
    this.setState({proratioadd:e.target.value})
  }
  marratioas = e=>{
    this.setState({marratioa:e.target.value})
  }
  marratioadds = e=>{
    this.setState({marratioadd:e.target.value})
  }
  marendadds = e=>{
    this.setState({marendadd:e.target.value})
  }
  marendas = e=>{
    this.setState({marenda:e.target.value})
  }
  proend = e=>{
    this.setState({proenda:e.target.value})
  }
  proendadds= e=>{
    this.setState({proendadd:e.target.value})
  }
  onProChange = (date, dateString)=>{
    this.setState({
      proTime:dateString
    })
  }
  onAddProChange = (date, dateString)=>{
    this.setState({
      proAddTime:dateString
    })
  }
  onMarChange = (date, dateString)=>{
    this.setState({
      marTime:dateString
    })
  }
  onMarChangeAdd = (date, dateString)=>{
    this.setState({
      marAddTime:dateString
    })
  }
  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode defaultExpandAll title={item.name} key={item.id} value ={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode  title={item.name} key={item.id} value ={item.id} dataRef={item} />;
    });

  onFocusDepartment = () =>{
    const { dispatch } = this.props;
    dispatch({
      type:'pd/fetchDept',
      payload: {
        reqData:{}
      },
      callback:(res)=>{
        const a = toTree(res);
        this.setState({
          departmentTreeValue:a
        })
      }
    });
  }

  onChangDepartment=(value, label, extra)=>{
    console.log("value",value)
    this.setState({
      deptId:value
    })
  }
  //工期开始计划
  disabledStartDate = startValue => {
    const { endValue } = this.state;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  disabledEndDate = endValue => {
    const { startValue } = this.state;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  };

  onStartChange = value => {
    this.onChange('startValue', value);
  };

  onEndChange = value => {
    this.onChange('endValue', value);
  };

  handleStartOpenChange = open => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  };

  handleEndOpenChange = open => {
    this.setState({ endOpen: open });
  };
  //签订时间
  disabledStartDateAssign = startValueAssign => {
    const { endValueAssign } = this.state;
    if (!startValueAssign || !endValueAssign) {
      return false;
    }
    return startValueAssign.valueOf() > endValueAssign.valueOf();
  };

  disabledEndDateAssign = endValueAssign => {
    const { startValueAssign } = this.state;
    if (!endValueAssign || !startValueAssign) {
      return false;
    }
    return endValueAssign.valueOf() <= startValueAssign.valueOf();
  };

  onChangeAssign = (field, value) => {
    this.setState({
      [field]: value,
    });
  };

  onStartChangeAssign = value => {
    this.onChangeAssign('startValueAssign', value);
  };

  onEndChangeAssign = value => {
    this.onChangeAssign('endValueAssign', value);
  };

  handleStartOpenChangeAssign = open => {
    if (!open) {
      this.setState({ endOpenAssign: true });
    }
  };

  handleEndOpenChangeAssign = open => {
    this.setState({ endOpenAssign: open });
  };
  //时间范围
  disabledDateArea = (val)=>{
    return val < moment(this.state.startdate)
  }
  render() {
    const {
      form:{getFieldDecorator},
      loading,
      loadingsub,
      dispatch,
      papproval:{ data,mardata }
    } = this.props;
    const { initData,startValue, endValue, endOpen ,startValueAssign, endValueAssign, endOpenAssign} = this.state;
    const on = {
      onIconClick:()=>{
        const { dispatch } = this.props;
        dispatch({
          type:'pd/fetchDept',
          payload: {
            reqData:{}
          },
          callback:(res)=>{
            const a = toTree(res);
            this.setState({
              TreeData:a
            })
          }
        });
        dispatch({
          type:'pd/fetchPerson',
          payload:{
            pageIndex:0,
            pageSize:10,
          },
          callback:(res)=>{
            this.setState({
              TableData:res,
            })
          }
        })
      }, //input聚焦时调用的接口获取信息
      onSelectTree:(selectedKeys, info)=>{
        const { dispatch} = this.props;
        if(info.selectedNodes[0]){
          const obj = {
            pageIndex:0,
            pageSize:10,
            id:info.selectedNodes[0].props.dataRef.id
          }
          dispatch({
            type:'pd/fetchPerson',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TableData:res,
                person_id:obj.id
              })
            }
          })
        }else{
          dispatch({
            type:'pd/fetchPerson',
            payload:{
              pageIndex:0,
              pageSize:10,
            },
            callback:(res)=>{
              this.setState({
                TableData:res,
                person_id:null
              })
            }
          })
        }
      }, //点击左边的树
      handleTableChange:(obj)=>{
        const { dispatch } = this.props;
        const { personConditions,person_id } = this.state;
        const param = {
          id:person_id,
          ...obj
        };
        if(personConditions.length){
          dispatch({
            type:'pd/fetchPerson',
            payload:{
              conditions:personConditions,
              ...obj,
            },
            callback:(res)=>{
              this.setState({
                TableData:res,
              })
            }
          });
          return
        }
        dispatch({
          type:'pd/fetchPerson',
          payload:param,
          callback:(res)=>{
            this.setState({
              TableData:res,
            })
          }
        })
      }, //分页
      onOk:(selectedRowKeys,selectedRows,onChange)=>{
        if(!selectedRowKeys || !selectedRows){
          return
        }
        const nameList = selectedRows.map(item =>{
          return item.name
        });
        onChange(nameList)
        this.setState({
          SelectValue:nameList,
          selectedRowKeys,
        })
      }, //模态框确定时触发
      onCancel:()=>{

      },  //取消时触发
      handleSearch:(values)=>{
        //点击查询调的方法 参数是个对象  就是输入框的值
        const { code, name } = values;
        if(code || name){
          let conditions = [];
          let codeObj = {};
          let nameObj = {};

          if(code){
            codeObj = {
              code:'code',
              exp:'like',
              value:code
            };
            conditions.push(codeObj)
          }
          if(name){
            nameObj = {
              code:'name',
              exp:'like',
              value:name
            };
            conditions.push(nameObj)
          }
          this.setState({
            personConditions:conditions
          })
          const obj = {
            pageIndex:0,
            pageSize:10,
            conditions,
            id:this.state.person_id
          };
          dispatch({
            type:'pd/fetchPerson',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TableData:res,
              })
            }
          })
        }else{
          this.setState({
            ClientConditions:[]
          });
          dispatch({
            type:'pd/fetchPerson',
            payload:{
              id:this.state.person_id,
              pageIndex:0,
              pageSize:10,
            },
            callback:(res)=>{
              this.setState({
                TableData:res,
              })
            }
          })
        }
      }, //查询时触发
      handleReset:()=>{
        const { person_id } = this.state;
        this.setState({
          personConditions:[]
        })
        dispatch({
          type:'pd/fetchPerson',
          payload:{
            id:person_id,
            pageIndex:0,
            pageSize:10,
          },
          callback:(res)=>{
            this.setState({
              TableData:res,
            })
          }
        })
      }, //清空时触发
      onButtonEmpty:()=>{
        this.setState({
          SelectValue:[],
          selectedRowKeys:[],
        })
      }
    };
    const datas = {
      TreeData:this.state.TreeData, //树的数据
      TableData:this.state.TableData, //表的数据
      //childrenList:this.state.childrenList, //input下拉框数据
      SelectValue:this.state.SelectValue, //框选中的集合
      selectedRowKeys:this.state.selectedRowKeys, //右表选中的数据
      placeholder:'请选择立项人',
      columns:[
        {
          title: '人员编码',
          dataIndex: 'code',
          key: 'code',
        },
        {
          title: '人员名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '部门',
          dataIndex: 'deptname',
          key: 'deptname',
        },
        {
          title: '',
          dataIndex: 'caozuo',
          key: 'caozuo',
        },
      ],
      fetchList:[
        {label:'人员编码',code:'code',placeholder:'请输入人员编码'},
        {label:'姓名',code:'name',placeholder:'请输入姓名'},
      ],
      title:'立项人选择'
    }

    const onProject = {
      onIconClick:()=>{
        const { dispatch } = this.props;
        dispatch({
          type:'pd/fetchDept',
          payload: {
            reqData:{}
          },
          callback:(res)=>{
            const a = toTree(res);
            this.setState({
              TreeProjectData:a
            })
          }
        });
        dispatch({
          type:'pd/fetchPerson',
          payload:{
            pageIndex:0,
            pageSize:10,
          },
          callback:(res)=>{
            this.setState({
              TableProjectData:res
            })
          }
        })
      }, //input聚焦时调用的接口获取信息
      onSelectTree:(selectedKeys, info)=>{
        const { dispatch} = this.props;
        if(info.selectedNodes[0]){
          const obj = {
            pageIndex:0,
            pageSize:10,
            id:info.selectedNodes[0].props.dataRef.id
          }
          dispatch({
            type:'pd/fetchPerson',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TableProjectData:res,
                Project_id:obj.id
              })
            }
          })
        }else{
          dispatch({
            type:'pd/fetchPerson',
            payload:{
              pageIndex:0,
              pageSize:10,
            },
            callback:(res)=>{
              this.setState({
                TableProjectData:res,
                Project_id:null
              })
            }
          })
        }
      }, //点击左边的树
      handleTableChange:(obj)=>{
        const { dispatch } = this.props;
        const { ProjectConditions,Project_id } = this.state;
        const param = {
          id:Project_id,
          ...obj
        };
        if(ProjectConditions.length){
          dispatch({
            type:'pd/fetchPerson',
            payload:{
              conditions:ProjectConditions,
              ...obj,
            },
            callback:(res)=>{
              this.setState({
                TableProjectData:res,
              })
            }
          });
          return
        }
        dispatch({
          type:'pd/fetchPerson',
          payload:param,
          callback:(res)=>{
            this.setState({
              TableProjectData:res,
            })
          }
        })
      }, //分页
      onOk:(selectedRowKeys,selectedRows,onChange)=>{
        if(!selectedRowKeys || !selectedRows){
          return
        }
        const nameList = selectedRows.map(item =>{
          return item.name
        });
        onChange(nameList)
        this.setState({
          SelectPersonValue:nameList,
          selectedPersonRowKeys:selectedRowKeys
        })
      }, //模态框确定时触发
      onCancel:()=>{

      },  //取消时触发
      handleSearch:(values)=>{
        //点击查询调的方法 参数是个对象  就是输入框的值
        const { code, name } = values;
        if(code || name){
          let conditions = [];
          let codeObj = {};
          let nameObj = {};

          if(code){
            codeObj = {
              code:'code',
              exp:'like',
              value:code
            };
            conditions.push(codeObj)
          }
          if(name){
            nameObj = {
              code:'name',
              exp:'like',
              value:name
            };
            conditions.push(nameObj)
          }
          this.setState({
            ProjectConditions:conditions
          })
          const obj = {
            pageIndex:0,
            pageSize:10,
            conditions,
            id:this.state.Project_id
          };
          dispatch({
            type:'pd/fetchPerson',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TableProjectData:res,
              })
            }
          })
        }else{
          this.setState({
            ProjectConditions:[]
          })
          dispatch({
            type:'pd/fetchPerson',
            payload:{
              pageIndex:0,
              pageSize:10,
              id:this.state.Project_id
            },
            callback:(res)=>{
              this.setState({
                TableProjectData:res,
              })
            }
          })
        }
      }, //查询时触发
      handleReset:()=>{
        const { Project_id } = this.state;
        this.setState({
          ProjectConditions:[]
        })
        dispatch({
          type:'pd/fetchPerson',
          payload:{
            pageIndex:0,
            pageSize:10,
            id:this.state.Project_id
          },
          callback:(res)=>{
            this.setState({
              TableProjectData:res,
            })
          }
        })
      }, //清空时触发
      onButtonEmpty:()=>{
        this.setState({
          SelectPersonValue:[],
          selectedPersonRowKeys:[],
        })
      }
    };
    const dataProject = {
      TreeData:this.state.TreeProjectData, //树的数据
      TableData:this.state.TableProjectData, //表的数据
      SelectValue:this.state.SelectPersonValue, //下拉框选中的集合
      selectedRowKeys:this.state.selectedPersonRowKeys,
      placeholder:'请选择项目负责人',
      columns:[
        {
          title: '人员编码',
          dataIndex: 'code',
          key: 'code',
        },
        {
          title: '人员名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '部门',
          dataIndex: 'deptname',
          key: 'deptname',
        },
        {
          title: '',
          dataIndex: 'caozuo',
          key: 'caozuo',
        },
      ],
      fetchList:[
        {label:'人员编码',code:'code',placeholder:'请输入人员编码'},
        {label:'姓名',code:'name',placeholder:'请输入姓名'},
      ],
      title:'项目负责人'
    }

    const onContract = {
      onIconClick:()=>{
        const { dispatch } = this.props;
        const { ContractConditions } = this.state;

        dispatch({
          type:'pd/fetchContract',
          payload:{
            reqData:{
              pageIndex:0,
              pageSize:10
            },
            conditions:ContractConditions
          },
          callback:(res)=>{
            if(res){
              this.setState({
                TableContractData:res,
              })
            }
          }
        })
      },
      onOk:(selectedRowKeys,selectedRows,onChange)=>{
        if(!selectedRowKeys || !selectedRows){
          return
        }
        let signdate;
        let custName;
        let custId;
        let operatorId;
        let operatorName;
        let projectname = '';
        console.log("selectedRows",selectedRows)
        const nameList = selectedRows.map(item =>{
          signdate = item.signdate;
          custName = item.custname;
          custId = item.custId;
          operatorId = item.operatorId;
          operatorName = item.operatorname;
          projectname = item.billname
          return item.billname
        });
        onChange(nameList)
        this.setState({
          SelectContractValue:nameList,
          selectedContractRowKeys:selectedRowKeys,
          startValueAssign:moment(signdate),
          signdate,
          custName,
          custId,
          operatorId,
          operatorName,
          projectname
        })
      },
      handleTableChange:(obj)=>{
        const { dispatch } = this.props;
        const { ContractConditions } = this.state;
        const param = {
          ...obj
        };
        if(ContractConditions.length){
          dispatch({
            type:'pd/fetchContract',
            payload:{
              conditions:ContractConditions,
              ...obj,
            },
            callback:(res)=>{
              this.setState({
                TableContractData:res,
              })
            }
          });
          return
        }
        dispatch({
          type:'pd/fetchContract',
          payload:param,
          callback:(res)=>{
            this.setState({
              TableContractData:res,
            })
          }
        })
      }, //分页
      handleSearch:(values)=>{
        const { billcode, billname } = values;
        if(billcode || billname){
          let conditions = [];
          let codeObj = {};
          let nameObj = {};

          if(billcode){
            codeObj = {
              code:'billcode',
              exp:'like',
              value:billcode
            };
            conditions.push(codeObj)
          }
          if(billname){
            nameObj = {
              code:'billcode',
              exp:'like',
              value:billname
            };
            conditions.push(nameObj)
          }
          const arr = this.state.ContractConditions.concat(conditions);
          this.setState({
            ContractConditions:arr
          });
          const obj = {
            pageIndex:0,
            pageSize:10,
            conditions:arr,
          };
          dispatch({
            type:'pd/fetchContract',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TableContractData:res,
              })
            }
          })
        }else{
          this.setState({
            ContractConditions:[]
          });
          dispatch({
            type:'pd/fetchContract',
            payload:{
              pageIndex:0,
              pageSize:10,
            },
            callback:(res)=>{
              this.setState({
                TableContractData:res,
              })
            }
          })
        }
      }, //查询时触发
      handleReset:()=>{
        const { ContractConditions } = this.state;
        this.setState({
          ContractConditions:[{
            code:'STATUS',
            exp:'=',
            value:'审批通过'
          }],
        });
        dispatch({
          type:'pd/fetchContract',
          payload:{
            pageIndex:0,
            pageSize:10,
          },
          callback:(res)=>{
            this.setState({
              TableContractData:res,
            })
          }
        })
      }, //清空时触发
      onButtonEmpty:()=>{
        this.setState({
          SelectContractValue:[],
          selectedContractRowKeys:[],
        })
      }
    };
    const dataContract = {
      TableData:this.state.TableContractData,
      SelectValue:this.state.SelectContractValue,
      selectedRowKeys:this.state.selectedContractRowKeys,
      columns : [
        {
          title: '合同编码',
          dataIndex: 'billcode',
        },
        {
          title: '合同名称',
          dataIndex: 'billname',
        },
        {
          title: '合同类型',
          dataIndex: 'type',
        },
        {
          title: '版本号',
          dataIndex: 'version',
        },
        {
          title: '签约日期',
          dataIndex: 'signdate',
        },
        {
          title: '签约地址',
          dataIndex: 'signplace',
        },
        {
          title: '计划生效日期',
          dataIndex: 'planValidateTime',
        },
        {
          title: '计划终止日期',
          dataIndex: 'planTeminateTime',
        },
        {
          title: '客户',
          dataIndex: 'custname',
        },
        {
          title: '经办部门',
          dataIndex: 'deptname',
        },
        {
          title: '经办人员',
          dataIndex: 'operatorname',
        },
        {
          title: '合同状态',
          dataIndex: 'status',
        },
        {
          title: '操作',
          dataIndex: 'caozuo',
        },
      ],
      fetchList:[
        {label:'合同编码',code:'billcode',placeholder:'请输入合同编码'},
        {label:'合同名称',code:'billname',placeholder:'请输入合同名称'},
      ],
      title:'合同名称',
      placeholder:'请选择合同',
    };

    const options = this.state.ProList.map(group => (
      <Option key={group.name}>{group.name}</Option>
    ));
    const optionsAdd = this.state.ProAddList.map(group => (
      <Option key={group.name}>{group.name}</Option>
    ));
    const maroptions = this.state.MarList.map(group => (
      <Option key={group.id}>{group.name}</Option>
    ));
    const marAddoptions = this.state.MarAddList.map(group => (
      <Option key={group.name}>{group.name}</Option>
    ));
    const obj = {
      button:'从模板导入',
      columns1:[{
        title: '编码',
        width:'50%',
        dataIndex: 'code',
      },{
        title: '名称',
        width:'50%',
        dataIndex: 'name',
      },{
        title: '',
        dataIndex: 'caozuo',
      }],
      columns2:this.columnsNoNo,
      title:'选择模板',
      onClick: ()=>{
        return new Promise((resolve, reject) => {
          let conditions = []
          let nameObj = {
            code:'type',
            exp:'=',
            value:'项目'
          };
          conditions.push(nameObj)
          let aa = {
            conditions,
          }

          dispatch({
            type:'papproval/fetchModle',
            payload:aa,
            callback:(res)=>{
              if(res.length){
                resolve(res)
              }else{
                reject()
              }
            }
          })
        })
      },
      onClickRow:(record)=>{
        return new Promise((resolve, reject) => {
          let conditions = []
          let codeObj = {
            code:'TEMPLATE_H_ID',
            exp:'=',
            value:record.id
          }
          const objee = {
            conditions,
          };
          conditions.push(codeObj)
          dispatch({
            type:'papproval/fetchChildModle',
            payload:objee,
            callback:(res)=>{
              if(res){
                resolve(res)
              }else{
                reject()
              }
            }
          })
        })
      },
      onOk:(res)=>{
        let cc = []
        res.forEach((item)=>{
          cc.push({type:'项目',code:item.rownum,project_id:this.state.initData.id,ratio:item.ratio,name:item.name,milestoneoutcome:item.milestoneoutcome})
        })
        let aa = {
          reqDataList:cc
        }
        dispatch({
          type:'papproval/addModleData',
          payload:aa,
          callback:(res)=>{
            dispatch({
              type:'papproval/fetchProjectNode',
              payload:{
                reqData:{
                  project_id:this.state.initData.id,
                  type:'项目'
                }
              },
              callback:(res)=>{
                if(res.resData){
                  this.setState({projectModleData:res.resData})
                }
              }
            })
          }
        })
      }
    };
    const marobj = {
      button:'从模板导入',
      columns1:[{
        title: '编码',
        width:'50%',
        dataIndex: 'code',
      },{
        title: '名称',
        width:'50%',
        dataIndex: 'name',
      }],
      columns2:this.columnsNoNo,
      title:'选择模板',
      onClick: ()=>{
        return new Promise((resolve, reject) => {
          let conditions = []
          let nameObj = {
            code:'type',
            exp:'=',
            value:'营销'
          };
          conditions.push(nameObj)
          let aa = {
            pageIndex:0,
            pageSize:100000,
            conditions,
          }
          dispatch({
            type:'papproval/fetchModle',
            payload:aa,
            callback:(res)=>{
              if(res.length){
                resolve(res)
              }else{
                reject()
              }
            }
          })
        })
      },
      onClickRow:(record)=>{
        return new Promise((resolve, reject) => {
          let conditions = []
          let codeObj = {
            code:'TEMPLATE_H_ID',
            exp:'=',
            value:record.id
          }
          const objee = {
            pageIndex:0,
            pageSize:10000,
            conditions,
          };
          conditions.push(codeObj)
          dispatch({
            type:'papproval/fetchChildModle',
            payload:objee,
            callback:(res)=>{
              if(res){
                resolve(res)
              }else{
                reject()
              }
            }
          })
        })
      },
      onOk:(res)=>{
        let cc = []
        res.forEach((item)=>{
          cc.push({type:'营销',code:item.rownum,project_id:this.state.initData.id,ratio:item.ratio,name:item.name,milestoneoutcome:item.milestoneoutcome})
        })
        let aa = {
          reqDataList:cc
        }

        dispatch({
          type:'papproval/addModleDataMarket',
          payload:aa,
          callback:(res)=>{
            dispatch({
              type:'papproval/fetchMarketNode',
              payload:{
                reqData:{
                  project_id:initData.id,
                  type:'营销'
                }
              },
              callback:(res)=>{
                if(res.resData){
                  this.setState({marModleData:res.resData})
                }
              }
            })
          }
        })

      }
    };
    const needObj = {
      projectId:this.state.initData.id
    }
    return (
      <Card title='编辑立项申请单'>
        <Tabs defaultActiveKey="1" >
          <TabPane key="1" tab='项目基本信息'>
            <Card >
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label="合同">
                    {getFieldDecorator('hetong',{
                      rules: [{required: true,message:'请选择合同'}],
                      initialValue:this.state.SelectContractValue
                    })(
                      <ModelTable
                        on={onContract}
                        data={dataContract}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                  <Form.Item label={fieldLabe.fundname}>
                    {getFieldDecorator('projectname',{
                      initialValue:initData.projectname?initData.projectname:'',
                      rules: [{
                        required: true,
                        message:'请输入项目名称'
                      }]
                    })(<Input placeholder="请输入项目名称" />)}
                  </Form.Item>

                </Col>
                <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                  <Form.Item label={fieldLabe.projector}>
                    {getFieldDecorator('Initiationperson_id', {
                      rules: [
                        {
                          required: true,
                          message:'请输入立项人'
                        }
                      ],
                      initialValue:this.state.SelectValue
                    })(<TreeTable
                      on={on}
                      data={datas}
                    />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={fieldLabe.signingtime}>
                    {getFieldDecorator('signingdate',{
                      rules: [{required: true,message:'合同签订时间'}],
                      initialValue:this.state.signdate?moment(this.state.signdate):null
                    })(<DatePicker
                      disabled
                      format="YYYY-MM-DD"
                      style={{width:'100%'}}
                      placeholder="请选择项合同后显示"
                    />)}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                  <Form.Item label='客户名称'>
                    {getFieldDecorator('cust_id',{
                      rules:[{
                        required:true,
                        message:'请选择客户名称'
                      }],
                      initialValue:this.state.custName
                    })(
                      <Input placeholder="请选择合同后显示" disabled/>
                    )}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                  <Form.Item label={fieldLabe.businessleader}>
                    {getFieldDecorator('businessleader_id',{
                      rules: [
                        {
                          required: true,
                          message:'商务负责人'
                        }
                      ],
                      initialValue:this.state.operatorName
                    })(
                      <Input placeholder="选择合同后显示" disabled/>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={fieldLabe.projectdate}>
                    {getFieldDecorator('initiationdate',{
                      initialValue:initData.Initiationdate?moment(initData.Initiationdate):null,
                      rules: [{required: true}]
                    })(<DatePicker  placeholder="请选择立项日期" style={{ width: '100%' }}/>)}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                  <Form.Item label={fieldLabe.projectmanager}>
                    {getFieldDecorator('projectmanager_id',{
                      rules: [
                        {
                          required: true,
                          message:'请选择项目项目负责人'
                        }
                      ],
                      initialValue:this.state.SelectPersonValue
                    })(
                      <TreeTable
                        on={onProject}
                        data={dataProject}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>

                  <Form.Item label={fieldLabe.fundtype}>
                    {getFieldDecorator('type',{
                      initialValue:initData.type?initData.type:'',
                      rules: [
                        {
                          required: true,
                          message:'请选择项目类型'
                        }
                      ]
                    })(
                      <Select placeholder="请选择项目类型" style={{ width: '100%' }}>
                        <Option value="咨询类">咨询类</Option>
                        <Option value="技术服务类">技术服务类</Option>
                        <Option value="设备类">设备类</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={fieldLabe.projectschedulestart}>
                    {getFieldDecorator('startdate',{
                      initialValue:initData.startdate?moment(initData.startdate):null,

                      rules: [
                        {
                          required: true,
                          message:'请选择项目工期计划'
                        }
                      ]
                    })(
                      <DatePicker
                        disabledDate={this.disabledStartDate}
                        showTime
                        format="YYYY-MM-DD"
                        value={startValue}
                        style={{width:'100%'}}
                        placeholder="请选择项目工期计划"
                        onChange={this.onStartChange}
                        onOpenChange={this.handleStartOpenChange}
                      />
                    )}
                  </Form.Item>

                </Col>
                <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                  <Form.Item label={fieldLabe.projectschedulestop}>
                    {getFieldDecorator('enddate',{
                      initialValue:initData.enddate?moment(initData.enddate):null,
                      rules: [
                        {
                          required: true,
                          message:'请选择项目工期计划(结束)'
                        }
                      ]
                    })(<DatePicker
                      disabledDate={this.disabledEndDate}
                      showTime
                      format="YYYY-MM-DD"
                      value={endValue}
                      placeholder="请选择项目工期计划"
                      onChange={this.onEndChange}
                      open={endOpen}
                      style={{width:'100%'}}
                      onOpenChange={this.handleEndOpenChange}
                    />)}
                  </Form.Item>

                </Col>
                <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                  <Form.Item label={fieldLabe.itemamount}>
                    {getFieldDecorator('projectmoney',{
                      initialValue:initData.projectmoney?initData.projectmoney:'',
                      rules: [{required: true}]
                    })(<Input placeholder="请输入项目经费" type='number'/>)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={fieldLabe.costbudget}>
                    {getFieldDecorator('budget',{
                      initialValue:initData.budget?initData.budget:'',
                      rules: [
                        {
                          required: true,
                          message:'请输入成本预算'
                        }
                      ]
                    })(<Input placeholder="请输入成本预算" type='number'/>)}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                  <Form.Item label={fieldLabe.externalexpenses}>
                    {getFieldDecorator('outsourcingexpenses',{
                      initialValue:initData.outsourcingexpenses?initData.outsourcingexpenses:'',
                      rules: [
                        {
                          required: true,
                          message:'请输入外委费用'
                        }
                      ]
                    })(<Input  placeholder="请输入外委费用" style={{ width: '100%' }} type='number'/>)}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                  <Form.Item label={fieldLabe.taxrate}>
                    {getFieldDecorator('taxrate',{
                      initialValue:initData.taxrate,
                      rules: [{
                        required: true,
                        message:'请选择税率'
                      }]
                    })(
                      <Select placeholder="请选择税率" style={{ width: '100%' }}>
                        <Option value={0}>0%</Option>
                        <Option value={0.03}>3%</Option>
                        <Option value={0.06}>6%</Option>
                        <Option value={0.09}>9%</Option>
                        <Option value={0.13}>13%</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={fieldLabe.subcontractingratio}>
                    {getFieldDecorator('subcontractingratio',{
                      initialValue:initData.subcontractingratio?initData.subcontractingratio:'',
                      rules: [
                        {
                          required: true,
                          message:'请输入分包比例'
                        }
                      ]
                    })(<Input  placeholder="请输入分包比例" type='number'/>)}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                  <Form.Item label={fieldLabe.professionalsubcontracting}>
                    {getFieldDecorator('subcontractingmoney',{
                      initialValue:initData.subcontractingmoney?initData.subcontractingmoney:'',
                    })(<Input  placeholder="请输入分包金额"  type='number'/>)}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                  <Form.Item label={fieldLabe.customertype}>
                    {getFieldDecorator('customertype',{
                      initialValue:initData.customertype?initData.customertype:'',
                    })(
                      <Input placeholder='请输入客户类型'/>
                    )}
                  </Form.Item>
                </Col>
                {/*

                */}
              </Row>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={fieldLabe.projectgrading}>
                    {getFieldDecorator('projectgrading',{
                      initialValue:initData.projectgrading?initData.projectgrading:'',
                    })(
                      <Select placeholder="请选择项目分级" style={{ width: '100%' }}>
                        <Option value="1级">1级</Option>
                        <Option value="2级">2级</Option>
                        <Option value="3级">3级</Option>
                        <Option value="4级">4级</Option>
                        <Option value="5级">5级</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                  <Form.Item label={fieldLabe.contractamount}>
                    {getFieldDecorator('contractamount',{
                      initialValue:initData.contractamount?initData.contractamount:'',
                    })(
                      <Input placeholder='请输入合同金额' type='number'/>
                    )}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                  <Form.Item label={fieldLabe.projectresponsibledepartment}>
                    {getFieldDecorator('dept_id',{
                      rules: [
                        {
                          required: true,
                          message:'请选择项目负责部门'
                        }
                      ],
                      initialValue:this.state.deptName
                    })(
                      <TreeSelect
                        treeDefaultExpandAll
                        style={{ width: '100%' }}
                        onFocus={this.onFocusDepartment}
                        onChange={this.onChangDepartment}
                        placeholder="请选择负责部门"
                      >
                        {this.renderTreeNodes(this.state.departmentTreeValue)}
                      </TreeSelect >

                    )}
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={fieldLabe.acceptancetime}>
                    {getFieldDecorator('acceptancedate',{
                      initialValue:initData.acceptancedate?moment(initData.acceptancedate):null,
                      rules: [{required: true,message:'请选择合同验收时间'}]
                    })(<DatePicker
                      disabledDate={this.disabledEndDateAssign}
                      showTime
                      format="YYYY-MM-DD"
                      value={endValueAssign}
                      placeholder="请选择项目工期计划"
                      onChange={this.onEndChangeAssign}
                      open={endOpenAssign}
                      style={{width:'100%'}}
                      onOpenChange={this.handleEndOpenChangeAssign}
                    />)}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                  <Form.Item label={fieldLabe.projectaddress}>
                    {getFieldDecorator('projectaddress',{
                      initialValue:initData?initData.projectaddress:'',
                    })(
                      <Input placeholder='请输入项目所在地'/>
                    )}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                  <Form.Item label={fieldLabe.paymentsitustion}>
                    {getFieldDecorator('paymentsitustion',{
                      initialValue:initData?initData.paymentsitustion:'',
                    })(
                      <Input placeholder='请输入付款情况' type='number'/>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={fieldLabe.balance}>
                    {getFieldDecorator('balance',{
                      initialValue:initData.balance?initData.balance:'',
                    })(
                      <Input placeholder='请输入余额' type='number'/>
                    )}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                  <Form.Item label='设置免费交通次数'>
                    {getFieldDecorator('ndef1',{
                      initialValue:initData.ndef1?initData.ndef1:''
                    })(
                      <Input placeholder='请输入免费交通次数'/>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={24} md={24} sm={24}>
                  <Form.Item label={fieldLabe.contractcontent}>
                    {getFieldDecorator('memo',{
                      initialValue:initData.memo?initData.memo:'',
                    })(
                      <Input placeholder='请输入合同内容'/>
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Card>
            <FooterToolbar style={{ width:'100%' }}>
              {
                this.state.subShowOk?<div style={{display:'inline-block'}}>
                    <Button type="primary" onClick={()=>this.validate()} loading={loadingsub}>
                      保存
                    </Button>
                    <Button type="primary" onClick={()=>this.endHandle()} loading={loadingsub}>
                      提交
                    </Button>
                  </div>:''
              }
              <Button
                style={{marginLeft:'10px'}}
                onClick={this.backClick}
              >取消</Button>
            </FooterToolbar>
          </TabPane>
          <TabPane  key="2" tab='项目里程碑节点'>
            <Card>
              <div style={{marginBottom:'15px',display:'flex'}}>
                {/* disabled={!this.state.subShowOk}  */}
                <Button icon="plus"  type="primary" onClick={this.addProNode} >
                  添加
                </Button>
                <Button icon="plus"  type="primary" onClick={this.addModle} style={{marginLeft:'20px'}}>
                保存为模板
              </Button>
                <TableModal {...obj}/>
              </div>
              <NormalTable
                pagination={false}
                loading={loading}
                data={data}
                columns={this.state.subShowOk?this.columns2:this.columns22}
                scroll={{x:this.state.subShowOk?this.columns2.length*120:this.columns22.length*120}}
                // onChange={this.handleStandardTableChange2}
              />
              <Modal
                destroyOnClose
                title="编辑项目里程碑节点"
                visible={this.state.proNodevisible}
                onOk={this.proNodeOk}
                onCancel={this.proNodeCancel}
              >
                <Form onSubmit={(e)=>this.proNodeOk(e)} layout="inline" style={{boxSizing:'border-box',paddingLeft:'30px'}}>
                  <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col>
                      <FormItem label='请输入序号'>
                        {getFieldDecorator('pacodeUpdate',{
                          initialValue:this.state.proUpdate.code?this.state.proUpdate.code:'',
                        })(<Input placeholder='请输入序号' style={{marginLeft:'80px'}}/>)}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={{ md: 8, lg: 24, xl: 48 }}  style={{marginTop:'20px'}}>
                    <Col>
                      <FormItem label='请选择里程碑节点'>
                        {getFieldDecorator('maridUpdate',{
                          initialValue:this.state.liname
                        })(
                          <AutoComplete
                            style={{marginLeft:'38px',width:'251px'}}
                            dataSource={options}
                            onFocus={()=>{
                              dispatch({
                                type:'pd/fetchPro',
                                payload: {
                                  conditions:[{
                                    code:'type',
                                    exp:'=',
                                    value:'项目'
                                  }]
                                },
                                callback:(res)=>{
                                  this.setState({
                                    ProList: res.resData
                                  });
                                }
                              })
                            }}
                            onChange={async(values)=>{
                              this.setState({liname:values})
                            }}
                            onSelect={async (value,option)=>{
                              this.state.ProList.forEach((item,index)=>{
                                if(item.name == option.key){
                                  this.setState({
                                    proratioadd:item.ratio,
                                    proendadd:item.milestoneoutcome,
                                    node_nameadd:item.name,
                                    liname:item.name
                                  })
                                }
                              })
                              await this.setState({
                                proAdd_id: Number(option.key)
                              });
                            }}
                            filterOption={(inputValue, option) =>
                              option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                            }
                            placeholder="请选择里程碑节点"
                          />
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={{ md: 8, lg: 24, xl: 48 }}  style={{marginTop:'20px'}}>
                    <Col >
                      <FormItem label='里程碑占比'>
                        <Input placeholder='请输入里程碑占比' value={this.state.proratioadd} onChange={this.proratioadds} style={{marginLeft:'78px'}}/>
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={{ md: 8, lg: 24, xl: 48 }}  style={{marginTop:'20px'}}>
                    <Col >
                      <FormItem label='项目里程碑成果'>
                        <Input placeholder='请输入项目里程碑成果' value={this.state.proendadd} onChange={this.proendadds} style={{marginLeft:'50px',width:'251px'}}/>
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{marginTop:'20px'}}>
                    <Col >
                      <FormItem label='预计完成时间'>
                        {getFieldDecorator('patimeUpdate',{
                          initialValue:this.state.proUpdate.estimateenddate?moment(this.state.proUpdate.estimateenddate):'',
                        })(
                          <DatePicker style={{width:'250px',display:'inline-block',marginLeft:'63px'}} />
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                </Form>
               {/* <div style={{dispatch:'flex'}}>
                  <div style={{marginBottom:'20px'}}>
                    <span style={{display:'inline-block',width:'140px',marginLeft:'20px'}}>序号：</span>
                    <Input placeholder="请输入序号" disabled={!this.state.subShowOk}  value={this.state.proInfor} onChange={this.proValue} style={{marginLeft:'50px',width:'200px',display:'inline-block'}}/>
                  </div>
                  <div style={{marginBottom:'20px'}}>
                    <span style={{display:'inline-block',width:'140px',marginLeft:'20px'}}>请选择里程碑节点：</span>
                    <AutoComplete
                      style={{display:'inline-block',width:'200px',marginLeft:'50px'}}
                      dataSource={options}
                      disabled={!this.state.subShowOk}
                      onFocus={()=>{
                        dispatch({
                          type:'pd/fetchPro',
                          payload: {
                              conditions:[{
                                code:'type',
                                exp:'=',
                                value:'项目'
                              }]
                          },
                          callback:(res)=>{
                            this.setState({
                              ProList: res.resData
                            });
                          }
                        })
                      }}
                      onSelect={async (value,option)=>{
                        this.state.ProList.forEach((item,index)=>{
                          if(item.id == option.key){
                            console.log('item[index]',item)
                            this.setState({
                              proratioa:item.ratio,
                              proenda:item.milestoneoutcome,
                              node_name:item.name
                            })
                          }
                        })
                        await this.setState({
                          pro_id: Number(option.key),

                        });
                      }}
                      filterOption={(inputValue, option) =>
                        option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                      }
                      placeholder="请选择里程碑节点"
                      defaultValue={this.state.node_name}
                    />
                  </div>
                  <div style={{marginBottom:'20px'}}>
                    <span style={{display:'inline-block',width:'140px',marginLeft:'20px'}}>里程碑占比：</span>
                    <Input placeholder="请输入里程碑占比"  value={this.state.proratioa} onChange={this.proratio} style={{marginLeft:'50px',width:'200px',display:'inline-block'}}/>
                  </div>
                  <div style={{marginBottom:'20px'}}>
                    <span style={{display:'inline-block',width:'140px',marginLeft:'20px'}}>项目里程碑成果：</span>
                    <Input placeholder="请输入项目里程碑成果" value={this.state.proenda} onChange={this.proend}  style={{marginLeft:'50px',width:'200px',display:'inline-block'}}/>
                  </div>
                  <div>
                    <span style={{display:'inline-block',width:'140px',marginLeft:'20px'}}>预计完成时间：</span>
                    <DatePicker disabled={!this.state.subShowOk} defaultValue={moment(this.state.proTime)} style={{marginLeft:'50px',width:'200px',display:'inline-block'}} onChange={this.onProChange}/>
                  </div>
                </div>*/}
              </Modal>
              {/* 生成项目模板 */}
              <Modal
                destroyOnClose
                title="保存为模板"
                visible={this.state.proModleVisible}
                onOk={this.proModleAdd}
                onCancel={this.proModleAddCancel}
              >
                <div style={{dispatch:'flex'}}>
                  <div style={{marginBottom:'20px'}}>
                    <span style={{display:'inline-block',width:'140px',marginLeft:'20px'}}>模板编码：</span>
                    <Input placeholder="请输入模板编码"  onChange={this.proModlecodeDD} style={{marginLeft:'50px',width:'200px',display:'inline-block'}}/>
                  </div>
                  <div style={{marginBottom:'20px'}}>
                    <span style={{display:'inline-block',width:'140px',marginLeft:'20px'}}>模板名称：</span>
                    <Input placeholder="请输入模板名称"  onChange={this.proModlenameDD} style={{marginLeft:'50px',width:'200px',display:'inline-block'}}/>
                  </div>
                </div>
              </Modal>
              <Modal
                destroyOnClose
                title="添加项目里程碑节点"
                visible={this.state.proNodevisibleAdd}
                 onOk={this.proAddNodeOk}
                onCancel={this.proAddNodeCancel}
              >
                <Form onSubmit={(e)=>this.proAddNodeOk(e)} layout="inline" style={{boxSizing:'border-box',paddingLeft:'30px'}}>
                  <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col>
                      <FormItem label='请输入序号'>
                        {getFieldDecorator('pacodeAdd')(<Input placeholder='请输入序号' style={{marginLeft:'80px'}}/>)}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={{ md: 8, lg: 24, xl: 48 }}  style={{marginTop:'20px'}}>
                    <Col>
                      <FormItem label='请选择里程碑节点'>
                        {getFieldDecorator('proid')(
                          <AutoComplete
                            style={{marginLeft:'38px',width:'251px'}}
                            dataSource={optionsAdd}
                            onFocus={()=>{
                              dispatch({
                                type:'pd/fetchPro',
                                payload: {
                                  conditions:[{
                                    code:'type',
                                    exp:'=',
                                    value:'项目'
                                  }]
                                },
                                callback:(res)=>{
                                  this.setState({
                                    ProAddList: res.resData
                                  });
                                }
                              })
                            }}
                            onChange={async(values)=>{
                               this.setState({liname:values})
                            }}
                            onSelect={async (value,option)=>{
                              this.state.ProAddList.forEach((item,index)=>{
                                if(item.name == option.key){
                                  this.setState({
                                    proratioadd:item.ratio,
                                    proendadd:item.milestoneoutcome,
                                    node_nameadd:item.name,
                                    liname:item.name
                                  })
                                }
                              })
                              await this.setState({
                                proAdd_id: Number(option.key)
                              });
                            }}
                            filterOption={(inputValue, option) =>
                              option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                            }
                            placeholder="请选择里程碑节点"
                          />
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={{ md: 8, lg: 24, xl: 48 }}  style={{marginTop:'20px'}}>
                    <Col >
                      <FormItem label='里程碑占比'>
                        <Input placeholder='请输入里程碑占比' value={this.state.proratioadd} onChange={this.proratioadds} style={{marginLeft:'78px'}}/>
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={{ md: 8, lg: 24, xl: 48 }}  style={{marginTop:'20px'}}>
                    <Col >
                      <FormItem label='项目里程碑成果'>
                        <Input placeholder='请输入项目里程碑成果' value={this.state.proendadd} onChange={this.proendadds} style={{marginLeft:'50px',width:'251px'}}/>
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{marginTop:'20px'}}>
                    <Col >
                      <FormItem label='预计完成时间'>
                        {getFieldDecorator('patimeAdd')(
                          <DatePicker style={{width:'250px',display:'inline-block',marginLeft:'63px'}} />
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                </Form>
               {/* <div style={{dispatch:'flex'}}>
                  <div style={{marginBottom:'20px'}}>
                    <span style={{display:'inline-block',width:'140px',marginLeft:'20px'}}>序号：</span>
                    <Input placeholder="请输入序号"  onChange={this.proAddValue} style={{marginLeft:'50px',width:'200px',display:'inline-block'}}/>
                  </div>
                  <div style={{marginBottom:'20px'}}>
                    <span style={{display:'inline-block',width:'140px',marginLeft:'20px'}}>请选择里程碑节点：</span>
                    <AutoComplete
                      style={{display:'inline-block',width:'200px',marginLeft:'50px'}}
                      dataSource={optionsAdd}
                      onFocus={()=>{
                        dispatch({
                          type:'pd/fetchPro',
                          payload: {
                            conditions:[{
                              code:'type',
                              exp:'=',
                              value:'项目'
                            }]
                          },
                          callback:(res)=>{
                            this.setState({
                              ProAddList: res.resData
                            });
                          }
                        })
                      }}
                      onSelect={async (value,option)=>{
                        this.state.ProAddList.forEach((item,index)=>{
                          if(item.id == option.key){
                            this.setState({
                              proratioadd:item.ratio,
                              proendadd:item.milestoneoutcome,
                              node_nameadd:item.name
                            })
                          }
                        })
                        await this.setState({
                          proAdd_id: Number(option.key)
                        });
                      }}
                      filterOption={(inputValue, option) =>
                        option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                      }
                      placeholder="请选择里程碑节点"
                      // defaultValue={this.state.node_name}
                    />
                  </div>
                  <div style={{marginBottom:'20px'}}>
                    <span style={{display:'inline-block',width:'140px',marginLeft:'20px'}}>里程碑占比：</span>
                    <Input placeholder="请输入里程碑占比"  value={this.state.proratioadd} onChange={this.proratioadds} style={{marginLeft:'50px',width:'200px',display:'inline-block'}}/>
                  </div>
                  <div style={{marginBottom:'20px'}}>
                    <span style={{display:'inline-block',width:'140px',marginLeft:'20px'}}>项目里程碑成果：</span>
                    <Input placeholder="请输入项目里程碑成果" value={this.state.proendadd} onChange={this.proendadds}  style={{marginLeft:'50px',width:'200px',display:'inline-block'}}/>
                  </div>
                  <div>
                    <span style={{display:'inline-block',width:'140px',marginLeft:'20px'}}>预计完成时间：</span>
                    <DatePicker  style={{marginLeft:'50px',width:'200px',display:'inline-block'}} onChange={this.onAddProChange}/>
                  </div>
                </div>*/}
              </Modal>
            </Card>
            <FooterToolbar style={{ width:'100%' }}>
              <Button
                onClick={this.backClick}
              >返回</Button>
            </FooterToolbar>
          </TabPane>
          <TabPane  key="3" tab='营销里程碑节点'>
            <Card>
              <div style={{marginBottom:'15px',display:'flex'}}>
                {/*  disabled={!this.state.subShowOk}  */}
                <Button icon="plus"  type="primary" onClick={this.addMarket} >
                  添加
                </Button>
                <Button icon="plus"  type="primary" onClick={this.addMarModle} style={{marginLeft:'20px'}}>
                  保存为模板
                </Button>
                <MarketModal {...marobj}/>
               {/* <Button  type="primary" onClick={this.proMarModleIn} style={{marginLeft:'20px'}}>
                  模板导入
                </Button>*/}

              </div>
              <NormalTable
                pagination={false}
                loading={loading}
                data={mardata}
                columns={this.state.subShowOk?this.columns3:this.columnsNo}
                scroll={{x:this.state.subShowOk?this.columns3.length*120:this.columnsNo.length*120}}
                // onChange={this.handleStandardTableChange2}
              />
              {/* 生成营销模板 */}
              <Modal
                destroyOnClose
                title="保存为模板"
                visible={this.state.marModleVisible}
                onOk={this.marModleAdd}
                onCancel={this.marModleAddCancel}
              >
                <div style={{dispatch:'flex'}}>
                  <div style={{marginBottom:'20px'}}>
                    <span style={{display:'inline-block',width:'140px',marginLeft:'20px'}}>模板编码：</span>
                    <Input placeholder="请输入模板编码"  onChange={this.marModlecodeDD} style={{marginLeft:'50px',width:'200px',display:'inline-block'}}/>
                  </div>
                  <div style={{marginBottom:'20px'}}>
                    <span style={{display:'inline-block',width:'140px',marginLeft:'20px'}}>模板名称：</span>
                    <Input placeholder="请输入模板名称"  onChange={this.marModlenameDD} style={{marginLeft:'50px',width:'200px',display:'inline-block'}}/>
                  </div>
                </div>
              </Modal>
              <Modal
                destroyOnClose
                title="编辑营销里程碑节点"
                visible={this.state.marNodevisible}
                onOk={this.marNodeOk}
                onCancel={this.marNodeCancel}
              >
                <Form onSubmit={(e)=>this.marNodeOk(e)} layout="inline" style={{boxSizing:'border-box',paddingLeft:'30px'}}>
                  <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col>
                      <FormItem label='请输入序号'>
                        {getFieldDecorator('marcodeUp',{
                          initialValue:this.state.marModleSS.code?this.state.marModleSS.code:'',
                        })(<Input placeholder='请输入序号' style={{marginLeft:'80px'}}/>)}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={{ md: 8, lg: 24, xl: 48 }}  style={{marginTop:'20px'}}>
                    <Col>
                      <FormItem label='请选择里程碑节点'>
                        {getFieldDecorator('maridUp',{
                          initialValue:this.state.marliname
                        })(
                          <AutoComplete
                            style={{marginLeft:'38px',width:'251px'}}
                            dataSource={marAddoptions}
                            onFocus={()=>{
                              dispatch({
                                type:'pd/fetchPro',
                                payload: {
                                  conditions:[{
                                    code:'type',
                                    exp:'=',
                                    value:'营销'
                                  }]
                                },
                                callback:(res)=>{
                                  this.setState({
                                    MarAddList: res.resData
                                  });
                                }
                              })
                            }}
                            onChange={async(value)=>{
                              this.setState({marliname:value})
                            }}
                            onSelect={async (value,option)=>{
                              this.state.MarAddList.forEach((item,index)=>{
                                if(item.name == option.key){
                                  this.setState({
                                    marratioadd:item.ratio,
                                    marendadd:item.milestoneoutcome,
                                    nodemar_nameadd:item.name,
                                    marliname:item.name,
                                  })
                                }
                              })
                              await this.setState({
                                marAdd_id: Number(option.key)
                              });
                            }}
                            filterOption={(inputValue, option) =>
                              option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                            }
                            placeholder="请选择营销里程碑节点"
                          />
                        )}
                      </FormItem>

                    </Col>
                  </Row>
                  <Row gutter={{ md: 8, lg: 24, xl: 48 }}  style={{marginTop:'20px'}}>
                    <Col >
                      <FormItem label='里程碑占比'>
                        <Input placeholder='请输入里程碑占比' value={this.state.marratioadd} onChange={this.marratioadds} style={{marginLeft:'78px'}}/>
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={{ md: 8, lg: 24, xl: 48 }}  style={{marginTop:'20px'}}>
                    <Col >
                      <FormItem label='项目里程碑成果'>
                        <Input placeholder='请输入项目里程碑成果' value={this.state.marendadd} onChange={this.marendadds} style={{marginLeft:'50px',width:'251px'}}/>
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{marginTop:'20px'}}>
                    <Col >
                      <FormItem label='预计完成时间'>
                        {getFieldDecorator('martimeUp',{
                          initialValue:this.state.marModleSS.estimateenddate?moment(this.state.marModleSS.estimateenddate):''
                        })(
                          <DatePicker style={{width:'250px',display:'inline-block',marginLeft:'63px'}} />
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                </Form>
                {/*<div style={{dispatch:'flex'}}>
                  <div style={{marginBottom:'20px'}}>
                    <span style={{display:'inline-block',width:'140px',marginLeft:'20px'}}>序号：</span>
                    <Input placeholder="请输入序号" disabled={!this.state.subShowOk} defaultValue={this.state.marInfor} onChange={this.marValue} style={{marginLeft:'50px',width:'200px',display:'inline-block'}}/>
                  </div>
                  <div style={{marginBottom:'20px'}}>
                    <span style={{display:'inline-block',width:'140px',marginLeft:'20px'}}>请选择里程碑节点：</span>
                    <AutoComplete
                      style={{display:'inline-block',width:'200px',marginLeft:'50px'}}
                      dataSource={maroptions}
                      disabled={!this.state.subShowOk}
                      onFocus={()=>{
                        dispatch({
                          type:'pd/fetchPro',
                          payload: {
                              conditions:[{
                                code:'type',
                                exp:'=',
                                value:'营销'
                              }]
                          },
                          callback:(res)=>{
                            this.setState({
                              MarList: res.resData
                            });
                          }
                        })
                      }}
                      onSelect={async (value,option)=>{
                        this.state.MarList.forEach((item,index)=>{
                          if(item.id == option.key){
                            this.setState({
                              marratioa:item.ratio,
                              marenda:item.milestoneoutcome,
                              nodemar_name:item.name
                            })
                          }
                        })
                        await this.setState({
                          mar_id: Number(option.key)
                        });
                      }}
                      filterOption={(inputValue, option) =>
                        option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                      }
                      placeholder="请选择营销里程碑节点"
                      defaultValue={this.state.nodemar_name}
                    />
                  </div>
                  <div style={{marginBottom:'20px'}}>
                    <span style={{display:'inline-block',width:'140px',marginLeft:'20px'}}>里程碑占比：</span>
                    <Input placeholder="请输入里程碑占比"  value={this.state.marratioa} onChange={this.marratioas} style={{marginLeft:'50px',width:'200px',display:'inline-block'}}/>
                  </div>
                  <div style={{marginBottom:'20px'}}>
                    <span style={{display:'inline-block',width:'140px',marginLeft:'20px'}}>项目里程碑成果：</span>
                    <Input placeholder="请输入项目里程碑成果" value={this.state.marenda} onChange={this.marendas}  style={{marginLeft:'50px',width:'200px',display:'inline-block'}}/>
                  </div>
                  <div>
                    <span style={{display:'inline-block',width:'140px',marginLeft:'20px'}}>预计完成时间：</span>
                    <DatePicker disabled={!this.state.subShowOk} style={{marginLeft:'50px',width:'200px',display:'inline-block'}} defaultValue={moment(this.state.marTime)} onChange={this.onMarChange}/>
                  </div>
                </div>*/}
              </Modal>
              <Modal
                destroyOnClose
                title="添加营销里程碑节点"
                visible={this.state.marNodevisibleAdd}
                 onOk={this.marAddNodeOkAdd}
                 onCancel={this.marAddNodeCancel}
              >
                <Form onSubmit={(e)=>this.marAddNodeOkAdd(e)} layout="inline" style={{boxSizing:'border-box',paddingLeft:'30px'}}>
                  <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col>
                      <FormItem label='请输入序号'>
                        {getFieldDecorator('marcode')(<Input placeholder='请输入序号' style={{marginLeft:'80px'}}/>)}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={{ md: 8, lg: 24, xl: 48 }}  style={{marginTop:'20px'}}>
                    <Col>
                      <FormItem label='请选择里程碑节点'>
                        {getFieldDecorator('marid')(
                          <AutoComplete
                            style={{marginLeft:'38px',width:'251px'}}
                            dataSource={marAddoptions}
                            onFocus={()=>{
                              dispatch({
                                type:'pd/fetchPro',
                                payload: {
                                  conditions:[{
                                    code:'type',
                                    exp:'=',
                                    value:'营销'
                                  }]
                                },
                                callback:(res)=>{
                                  this.setState({
                                    MarAddList: res.resData
                                  });
                                }
                              })
                            }}
                            onChange={async(value)=>{
                              this.setState({marliname:value})
                            }}
                            onSelect={async (value,option)=>{
                              this.state.MarAddList.forEach((item,index)=>{
                                if(item.name == option.key){
                                  this.setState({
                                    marratioadd:item.ratio,
                                    marendadd:item.milestoneoutcome,
                                    nodemar_nameadd:item.name,
                                    marliname:item.name,
                                  })
                                }
                              })
                              await this.setState({
                                marAdd_id: Number(option.key)
                              });
                            }}
                            filterOption={(inputValue, option) =>
                              option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                            }
                            placeholder="请选择营销里程碑节点"
                          />
                        )}
                      </FormItem>

                    </Col>
                  </Row>
                  <Row gutter={{ md: 8, lg: 24, xl: 48 }}  style={{marginTop:'20px'}}>
                    <Col >
                      <FormItem label='里程碑占比'>
                        <Input placeholder='请输入里程碑占比' value={this.state.marratioadd} onChange={this.marratioadds} style={{marginLeft:'78px'}}/>
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={{ md: 8, lg: 24, xl: 48 }}  style={{marginTop:'20px'}}>
                    <Col >
                      <FormItem label='项目里程碑成果'>
                        <Input placeholder='请输入项目里程碑成果' value={this.state.marendadd} onChange={this.marendadds} style={{marginLeft:'50px',width:'251px'}}/>
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{marginTop:'20px'}}>
                    <Col >
                      <FormItem label='预计完成时间'>
                        {getFieldDecorator('martime')(
                          <DatePicker style={{width:'250px',display:'inline-block',marginLeft:'63px'}} />
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                </Form>
              </Modal>
            </Card>
            <FooterToolbar style={{ width:'100%' }}>
              <Button
                onClick={this.backClick}
              >返回</Button>
            </FooterToolbar>
          </TabPane>
          <TabPane  key="4" tab='项目所需物料'>
            <NeedModal {...needObj}/>
          </TabPane>
        </Tabs>

      </Card>
    );
  }
}

export default ProjectUpdate;
