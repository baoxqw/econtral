import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import NormalTable from '@/components/NormalTable';
import { formatMessage, FormattedMessage } from 'umi/locale';
import ExportJsonExcel from 'js-export-excel';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  Popconfirm,
  Divider,
  Icon,
  Table,
  Row,
  Modal,
  Badge,
  Menu,
  Dropdown,
  Col,
  message,
} from 'antd';
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../../System/UserAdmin.less';
const FormItem = Form.Item;
// import styles from './style.less';
const { Option } = Select;
const { TextArea } = Input;


const label = {
  projectname:'项目名称',
  milestonenode:'里程碑节点',
  completetime:'完成时间',
  evidence:'证明材料',
  memo:'备注',
  opinion:'部门领导审核意见',
}

@connect(({ perf, loading }) => ({
  perf,
  loading: loading.models.perf,
}))
@Form.create()
class PerforManagement extends PureComponent {
  state ={
    changeVisible:false,
    deleteVisible:false,
    superId:null,
    childData:[],
    expandedRowKeys:[],
    daoChu:{},
    resColumns:[
      { title: '项目名称', dataIndex: 'projectname', key: 'projectname' },
      { title: '单位名称', dataIndex: 'custname', key: 'custname' },
      { title: '未到账金额', dataIndex: 'nopay', key: 'nopay', },
      { title: '开票金额', dataIndex: 'includetaxmny', key: 'includetaxmny', },
      { title: '实到账', dataIndex: 'accountmny', key: 'accountmny', },
      { title: '税率', dataIndex: 'taxrate', key: 'taxrate', },
      {
        title: '未到账原因',
        dataIndex: 'reason',
        key:'reason'
      },
      {
        title: '项目负责人',
        dataIndex: 'operatorname',
        key:'operatorname'
      },
    ],
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type:'perf/fetch',
      payload:{
        pageIndex:0,
        pageSize:10,
      },
      callback:(res)=>{
        this.setState({
          daoChu:res
        })
      }
    })
  }

  projectChange = (e,record)=>{
    e.preventDefault()
  }
  //查询
  findList = (e)=>{
    e.preventDefault();
    const { form,dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      const { projectname, initiationdate } = values;
      if(projectname || initiationdate){
        let conditions = [];
        let codeObj = {};
        let nameObj = {};

        if(projectname){
          codeObj = {
            code:'projectname',
            exp:'like',
            value:projectname
          };
          conditions.push(codeObj)
        }
        if(initiationdate){
          nameObj = {
            code:'initiationdate',
            exp:'like',
            value:initiationdate.format('YYYY-MM-DD')
          };
          conditions.push(nameObj)
        }

        this.setState({
          conditions
        })
        const obj = {
          conditions,
        };
        dispatch({
          type:'perf/fetch',
          payload:obj,
          callback:(res)=>{
            this.setState({
              daoChu:res
            })
          }
        })
      }else{
        this.setState({
          conditions:[]
        })
        dispatch({
          type:'RW/fetch',
          payload:{},
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
    this.setState({
      conditions:[]
    })
    //清空后获取列表
    dispatch({
      type:'perf/fetch',
      payload:{}
    });
  }
  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={(e)=>this.findList(e)} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label='项目名称'>
              {getFieldDecorator('projectname')(<Input placeholder='请输入项目名称' style={{width:"100%"}}/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={16}>
            <FormItem label='时间'>
              {getFieldDecorator('initiationdate')( <DatePicker  style={{width:"100%"}}/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={16}>
            <span>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
               取消
              </Button>
            </span>
          </Col>
        </Row>
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
        type:'perf/fetch',
        payload: param,
      });
      return
    }
    dispatch({
      type:'perf/fetch',
      payload: obj,

    });

  };
  download = ()=>{
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
        dataTable.push(obj);
      });
      if(dataTable.length){
        for(let key in dataTable[0]){
          arr.push(key)
        }
      }
      let a = [{
        '项目名称11':'中国制造',
        '合同金额111':'2099'
      }]
      dataTable[0].children = a
      console.log('dataTable',dataTable)
      option.fileName = '项目收款统计';
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
  }
  onClickColumns = (res)=>{
    this.setState({
      resColumns:res
    })
  }
  render() {
    const {
      form:{ getFieldDecorator },
      loading,
       perf:{ data }
    } = this.props;
    const { childData }= this.state
    const columns1 = [
      {
        title: '项目名称',
        dataIndex: 'projectname',
        key:'projectname'
      },
      {
        title:'时间',
        dataIndex:'initiationdate',
        key:'initiationdate',
      },
      {
        title: '费用花销(交通费)',
        dataIndex: 'totaltravelfee',
        key: 'totaltravelfee',
      },
      {
        title: '费用花销（补贴）',
        dataIndex: 'totalsubsidy',
        key: 'totalsubsidy',
      },
      {
        title: '项目预算',
        dataIndex: 'budget',
        key: 'budget',
      },
      {
        title: '项目结余',
        dataIndex: 'leftfee',
        key: 'leftfee',
      },
      {
        title:'项目状态',
        dataIndex:'status',
        key:'status',
      },
      {
        title:'项目地址',
        dataIndex:'projectaddress',
        key:'projectaddress',
      },
    ];
    const expandedRowRender = () => {
      const columns = [
        {
          title: '单据号',
          dataIndex: 'billcode',
        },
        {
          title: '所属项目',
          dataIndex: 'projectname',
        },
        {
          title: '报销人',
          dataIndex: 'psnname',
        },
        {
          title: '完成内容',
          dataIndex: 'phasenames',
        },
        {
          title: '单据日期',
          dataIndex: 'billdate',
        },
        {
          title: '部门',
          dataIndex: 'deptname',
        },
        {
          title: '出差费',
          dataIndex: 'travelfee',
        },
        {
          title: '比例',
          dataIndex: 'sumratio',
        },
        {
          title: '补贴',
          dataIndex: 'subsidy',
        },
        {
          title: '个人提成',
          dataIndex: 'commission',
        },



        {
          title: '状态',
          dataIndex: 'status',
        },
        {
          title: '备注',
          dataIndex: 'memo',
        },

        /*{
          title: formatMessage({ id: 'validation.operation' }),
          dataIndex: 'operation',
        },*/
      ];
      return <NormalTable columns={columns} dataSource={childData} pagination={false} />;
    };
    return (
      <PageHeaderWrapper>
        <Card>
          <div className={styles.userAdmin}>
            <div className={styles.userAdminForm} style={{marginBottom:'20px'}}>{this.renderForm()}</div>
           {/* <div style={{margin:'-20px 0 20px 0'}}>
              <Button type={'primary'} onClick={this.download}>导出</Button>
            </div>*/}
            <NormalTable
              onClickColumns={this.onClickColumns}
              className="components-table-demo-nested"
              columns={columns1}
              loading={loading}
              scroll={{ x:14*170,y:260}}
              onExpandedRowsChange={(expandedRows)=>{
                this.setState({childData:[]})
                if(expandedRows.length){
                  if(expandedRows.length>=2){
                    expandedRows.splice(0,1)
                  }
                }
                this.setState({
                  expandedRowKeys:expandedRows
                })
              }}
              expandedRowKeys={this.state.expandedRowKeys}
              onExpand={(expandedRows,record)=>{
                this.setState({
                  superId:record.id,
                })
                const { dispatch } = this.props
                let conditions = [];
                let codeObj = {
                  code:'PROJECT_ID',
                  exp:'=',
                  value:record.projectId
                };
                conditions.push(codeObj)
                let statusObj = {
                  code:'STATUS',
                  exp:'=',
                  value:record.status
                };
                conditions.push(statusObj)
                let obj = {
                  conditions
                }
                dispatch({
                  type:'perf/fetchChild',
                  payload:obj,
                  callback:(res)=>{
                    console.log('子表数据',res)
                    if(res.resData){
                      res.resData.map((item)=>{
                        item.key = item.id
                        return item
                      })
                      this.setState({childData:res.resData})
                    }
                  }
                })
                if(expandedRows == false){
                  this.setState({childData:[]})
                }
              }}
              expandedRowRender = {expandedRowRender}
              onChange={this.handleStandardTableChange}
              data={data}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default PerforManagement;
