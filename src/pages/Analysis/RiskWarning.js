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
import styles from '../System/UserAdmin.less';
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

@connect(({ RW, loading }) => ({
  RW,
  loading: loading.models.RW,
}))
@Form.create()
class RiskWarning extends PureComponent {
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
      type:'RW/fetch',
      payload:{

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
      const { projectname, custname } = values;
      if(projectname || custname){
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
        if(custname){
          nameObj = {
            code:'custname',
            exp:'like',
            value:custname
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
          type:'RW/fetch',
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
      type:'RW/fetch',
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
              {getFieldDecorator('projectname')(<Input placeholder='请输入项目名称' />)}
            </FormItem>
          </Col>
          <Col md={8} sm={16}>
            <FormItem label='合同名称'>
              {getFieldDecorator('custname')(<Input placeholder='请输入合同名称' />)}
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
        type:'RW/fetch',
        payload: param,
      });
      return
    }

    dispatch({
      type:'RW/fetch',
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
      RW:{ fetchData }
    } = this.props;
    const { childData }= this.state
   /* const columns1= [
      {
        title: '开票事项',
        dataIndex:'thing',
        key:'thing',
        children:[
          { title: '项目名称', dataIndex: 'projectname', key: 'projectname' },
          { title: '单位名称', dataIndex: 'custname', key: 'custname' },

        ]
      },
      {
        title: '开票回款金额',
        dataIndex:'money',
        key:'money',
        children:[
          { title: '未到账金额', dataIndex: 'nopay', key: 'nopay', },
          { title: '开票金额', dataIndex: 'includetaxmny', key: 'includetaxmny', },
          { title: '实到账', dataIndex: 'accountmny', key: 'accountmny', },
          { title: '税率', dataIndex: 'taxrate', key: 'taxrate', },
        ]

      },
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
    ];*/
    const columns1= [
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
      /*{
        title: '',
        dataIndex: 'caozuo',
      },*/
    ];
    const expandedRowRender = () => {
      const columns = [
        {
          title: '项目名称',
          dataIndex: 'projectname',
        },
        {
          title: '发票类型',
          dataIndex: 'type',
        },
        {
          title: '含税金额',
          dataIndex: 'includetaxmny',
        },
        {
          title: '发票号',
          dataIndex: 'code',
        },
        {
          title: '客户名称',
          dataIndex: 'custname',
        },
        {
          title: '部门',
          dataIndex: 'deptname',//deptname
        },
        {
          title: '制单人',
          dataIndex: 'operatorname',
        },
        {
          title: '发票总金额',
          dataIndex: 'totalsummoney',
        },
        {
          title: '结算标志',
          dataIndex: 'balanceflag',
          render:(text, record)=>{
            if(text === 0){
              return "未结算"
            }
            if (text === 1){
              return "已结算"
            }
          }
        },
        {
          title: '状态',
          dataIndex: 'status',
        },
        /*{
          title: '行号',
          dataIndex: 'crowno',
        },
        {
          title: '服务内容',
          dataIndex: 'serivcename',
        },
        {
          title: '单位',
          dataIndex: 'unit',
        },*/
        {
          title: '数量',
          dataIndex: 'number',
        },
        {
          title: '税率',
          dataIndex: 'taxrate',
        },
        {
          title: '无税单价',
          dataIndex: 'price',
        },
        {
          title: '含税单价',
          dataIndex: 'includetaxprice',
        },
        {
          title: '无税金额',
          dataIndex: 'mny',
        },

        {
          title: '税额',
          dataIndex: 'taxmny',
        },
        /*{
          title: '操作',
          dataIndex: 'caozuo',
        },*/
      ]
      return <NormalTable columns={columns} dataSource={childData} pagination={false} />;
    };
    return (
      <PageHeaderWrapper>
        <Card>
          <div className={styles.userAdmin}>
            <div className={styles.userAdminForm} style={{marginBottom:'20px'}}>{this.renderForm()}</div>
            <div style={{margin:'-20px 0 20px 0'}}>
              <Button type={'primary'} size={'small'} onClick={this.download}>导出</Button>
            </div>
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
                this.setState({superId:record.id})
                const { dispatch } = this.props
                let conditions = [];
                let codeObj = {
                  code:'project_id',
                  exp:'=',
                  value:record.projectId
                };
                conditions.push(codeObj)
                let obj = {
                  conditions
                }
                dispatch({
                  type:'RW/fetchChild',
                  payload:obj,
                  callback:(res)=>{
                    if(res.resData){
                      res.resData.map((item)=>{
                        item.key = item.id
                        item.nopay = item.includetaxmny - item.accountmny
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
              data={fetchData}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default RiskWarning;
