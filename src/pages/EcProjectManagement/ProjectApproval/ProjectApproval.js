import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import './tableBg.less'
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  Divider,
  InputNumber,
  Radio,
  Icon,
  Tooltip,
  Modal,
  message,
  Switch,
  Popconfirm,
  Transfer,
} from 'antd';
import NormalTable from '@/components/NormalTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
import styles from '../../System/UserAdmin.less';
import ExportJsonExcel from 'js-export-excel';
const { Option } = Select;

const FormItem = Form.Item;
const mockData = [];
const handleCorpAdd = () => {

  router.push('/ecprojectmanagement/projectapproval/add');
};

@connect(({ papproval, loading }) => ({
  papproval,
  loading: loading.models.papproval,
}))
@Form.create()

class ProjectApproval extends PureComponent {
  state = {
    conditions:null,
    visible: false,
    disabled: false,
    create_id:null,  //创建人id
    pageIndex:0,
    show:0,
    attachdata:[],
    visibleModal:false,
    expandForm:false,
    daoChu:{},
    resColumns:[]
  };
  filterOption = (inputValue, option) => option.description.indexOf(inputValue) > -1;
  columns = [

    {
      title: '合同名称',
      dataIndex: 'contractName',
      width:260
    },
    {
      title: '项目名称',
      dataIndex: 'projectname',
      width:260
    },
    {
      title: '项目类型',
      dataIndex: 'type',
    },
    {
      title: '项目负责人',
      dataIndex: 'projectmanagerName',
    },
    {
      title:'负责部门',
      dataIndex: 'deptName',
    },
    {
      title:'合同验收时间',
      dataIndex: 'acceptancedate',
    },
    {
      title:'申请单状态',
      dataIndex: 'status',
    },
    {
      title:'客户类型',
      dataIndex: 'customertype',
    },
    {
      title:'客户名称',
      dataIndex: 'custName',
    },
    {
      title:'项目分级',
      dataIndex: 'projectgrading',
    },
    {
      title:'合同金额',
      dataIndex: 'contractamount',
    },
    {
      title:'分包金额',
      dataIndex: 'subcontractingmoney',
    },
    {
      title:'分包比例',
      dataIndex: 'subcontractingratio',
    },
    {
      title:'税率',
      dataIndex: 'taxrate',
    },
    {
      title:'外委费用',
      dataIndex: 'outsourcingexpenses',
    },
    {
      title:'成本预算',
      dataIndex: 'budget',
    },
    {
      title:'项目经费',
      dataIndex: 'projectmoney',
    },
    {
      title:'项目工期计划(开始)',
      dataIndex: 'startdate',
    },
    {
      title:'项目工期计划(结束)',
      dataIndex: 'enddate',
    },
    {
      title:'立项日期',
      dataIndex: 'initiationdate',
    },
    {
      title:'项目所在地',
      dataIndex: 'projectaddress',
    },
    {
      title:'付款情况',
      dataIndex: 'paymentsitustion',
    },
    {
      title:'余额',
      dataIndex: 'balance',
    },
    {
      title:'免费交通次数',
      dataIndex: 'ndef1',
    },

    {
      title: formatMessage({ id: 'validation.operation' }),
      dataIndex: 'operation',
      fixed:'right',
      render: (text, record) => (
        <Fragment>
          <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record)}>
            <a href="#javascript:;">删除</a>
          </Popconfirm>
          <Divider type="vertical" />
         {/* <span style={{color:'#123dff',cursor:'pointer'}}>撤回</span>
          <Divider type="vertical" />*/}
          <a href="#javascript:;" onClick={(e)=>this.update(e,record)}>编辑</a>
          {/*<span style={{color:'#1890ff',cursor:'pointer'}} onClick={()=>this.update(record)}>编辑</span>*/}

        </Fragment>
      ),
    },
  ];
  visibleModal = async (record) => {
    await this.setState({
      visibleModal: true,
    });
    const { dispatch} = this.props;
    const str = {
      reqData:{
        bill_id:record.id,
        type:'pm',
      }
    };
    dispatch({
      type: 'fundproject/queryattchment',
      payload: str,
      callback:(res)=>{
        if(res){
          this.setState({
            attachdata:res,
          });
          return
        }
        this.setState({
          attachdata:[],
        });
      }
    })

  };

  //点击删除
  handleDelete = (record)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'papproval/remove',
      payload:{
        reqData:{
          id: record.id
        }
      }
    })
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type:'papproval/fetch',
      payload:{
        pageIndex:0,
        pageSize:10
      },
      callback:(res)=>{
        this.setState({
          daoChu:res
        })
      }
    })
  }
  //编辑
  update = (e,record) =>{
    e.preventDefault();
    router.push('/ecprojectmanagement/projectapproval/update',{record})
    // router.push({pathname:'/ecprojectmanagement/projectapproval/update',record:record});
  }

  //展开-收起
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };
  //查询
  findList = (e) => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err,values)=>{
      const {projectname,status,type,projectaddress} = values;
      if(projectname || status || type || projectaddress) {
        let conditions = [];
        let codeObj = {};
        let nameObj = {};
        let typeObj = {}
        let addressObj = {}

        if (projectname) {
          codeObj = {
            code: 'projectname',
            exp: 'like',
            value: projectname
          };
           conditions.push(codeObj)
        }
        if (status) {
          nameObj = {
            code: 'status',
            exp: 'like',
            value: status
          };
           conditions.push(nameObj)
        }
        if (type) {
          typeObj = {
            code: 'type',
            exp: 'like',
            value: type
          };
          conditions.push(typeObj)
        }
        if (projectaddress) {
          addressObj = {
            code: 'projectaddress',
            exp: 'like',
            value: projectaddress
          };
          conditions.push(addressObj)
        }
        this.setState({conditions})
        const obj = {
          pageIndex:0,
          pageSize:10,
          conditions,
        };
        dispatch({
          type: 'papproval/fetch',
          payload: obj,
          callback:(res)=>{
            this.setState({
              daoChu:res
            })
          }
        })
      }else{
        this.setState({conditions:[]})
        dispatch({
          type: 'papproval/fetch',
          payload: {
            pageIndex:0,
            pageSize:10
          },
          callback:(res)=>{
            this.setState({
              daoChu:res
            })
          }
        })
      }
    })
  }
  //取消
  handleFormReset = ()=>{
    const { dispatch,form} = this.props;
    //清空输入框
    form.resetFields();
    this.setState({conditions:[]})
    //清空后获取列表
    dispatch({
      type: 'papproval/fetch',
      payload:{
        pageIndex:0,
        pageSize:10
      },
      callback:(res)=>{
        this.setState({
          daoChu:res
        })
      }
    })
  }

  onClickColumns = (res)=>{
    this.setState({
      resColumns:res
    })
  }

  daoChu = ()=>{
    const { daoChu,resColumns } = this.state;
    if(daoChu && daoChu.list){
      let option={};
      let dataTable = [];
      let arr = []; //保存key
      daoChu.list.map((item)=>{
        let obj = {}
        resColumns.map(ite => {
          const title = ite.title;
          const dataIndex = ite.dataIndex;
          for(let key in item){
            if(key === dataIndex){
              obj[title] = item[key]
            }
          }
        })
        /*let obj = {
          '合同名称':item.contractName,
          '项目名称':item.projectname,
          '项目类型':item.type,
          '项目负责人':item.projectmanagerName,
          '负责部门':item.deptName,
          '合同验收时间':item.acceptancedate,
          '申请单状态':item.status,
          '客户类型': item.customertype,
          '客户名称': item.custName,
          '项目分级': item.projectgrading,
          '合同金额': item.contractamount,
          '分包金额': item.subcontractingmoney,
          '分包比例': item.subcontractingratio,
          '税率': item.taxrate,
          '外委费用': item.outsourcingexpenses,
          '成本预算': item.budget,
          '项目经费': item.projectmoney,
          '项目工期计划(开始)': item.startdate,
          '项目工期计划(结束)': item.enddate,
          '立项日期': item.initiationdate,
          '项目所在地': item.projectaddress,
          '付款情况': item.paymentsitustion,
          '余额': item.balance,
          '免费交通次数': item.ndef1,
        }*/
        dataTable.push(obj);
      });
      if(dataTable.length){
        for(let key in dataTable[0]){
          arr.push(key)
        }
      }
      option.fileName = '项目管理';
      option.datas=[
        {
          sheetData:dataTable,
          sheetName:'sheet',
          sheetFilter:arr,
          sheetHeader:arr,
        }
      ];
      const toExcel = new ExportJsonExcel(option);
      toExcel.saveExcel();
    }else{
      message.error("没有数据可导出");
    }

  };

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { expandForm } = this.state
    return (
      <Form onSubmit={this.findList} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label='项目名称'>
              {getFieldDecorator('projectname')(<Input placeholder='项目名称' />)}
            </FormItem>
          </Col>
          <Col md={8} sm={16}>
            <FormItem label='申请单状态'>
              {getFieldDecorator('status')(<Input placeholder='申请单状态' />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
               取消
              </Button>
              {
                expandForm?<a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                  收起
                  <Icon type="up" />
                </a>:<a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                  展开
                  <Icon type="down" />
                </a>
              }
            </span>
          </Col>
        </Row>
        {expandForm?<Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label='项目类型'>
              {getFieldDecorator('type')(
                <Select placeholder="请选择项目类型" style={{ width: '100%' }}>
                  <Option value="咨询类">咨询类</Option>
                  <Option value="技术服务类">技术服务类</Option>
                  <Option value="设备类">设备类</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={16}>
            <FormItem label='项目所在地'>
              {getFieldDecorator('projectaddress')(<Input placeholder='项目所在地' />)}
            </FormItem>
          </Col>
        </Row>:''}

        <div >
          <Button icon="plus" onClick={handleCorpAdd} type="primary" >
            新建
          </Button>
          <Button type='primary' style={{marginLeft:'20px'}} onClick={this.daoChu}>
            导出
          </Button>
        </div>
      </Form>

    );
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    /*
      pagination中包含：
        current: 2
        pageSize: 10
        showQuickJumper: true
        showSizeChanger: true
        total: 48
    */
    const { dispatch } = this.props;
    const { conditions} = this.state;

    const obj = {
      pageIndex: pagination.current-1,
      pageSize: pagination.pageSize,
    };
    if(conditions){
      const param = {
        ...obj,
        conditions
      };
      dispatch({
        type:'papproval/fetch',
        payload: param,
        callback:(res)=>{
          this.setState({
            daoChu:res
          })
        }
      });
      return
    }

    dispatch({
      type:'papproval/fetch',
      payload: obj,
      callback:(res)=>{
        this.setState({
          daoChu:res
        })
      }
    });

  };

  handleM = ()=>{
    this.setState({
      visibleModal:false
    })
  }

  render() {
    const {
      loading,
      papproval:{fetchData}
    } = this.props;

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.userAdmin}>
            <div className={styles.userAdminForm}>{this.renderForm()}</div>
            <div className={styles.userAdminOperator}>

            </div>
            <NormalTable
              onClickColumns={this.onClickColumns}
              loading={loading}
              data={fetchData}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />

          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ProjectApproval;
