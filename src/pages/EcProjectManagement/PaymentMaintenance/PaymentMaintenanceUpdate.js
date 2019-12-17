import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';

import { formatMessage, FormattedMessage } from 'umi/locale';
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
  Col,
  message,
} from 'antd';
import router from 'umi/router';
import ModelTable from '../../tool/ModelTable/ModelTable';

import { toTree } from '../../tool/ToTree';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import moment from 'moment';
import TreeTable from '../../tool/TreeTable/TreeTable';

const FormItem = Form.Item;

const { Option } = Select;
const { TextArea } = Input;
const dateFormat = 'YYYY-MM-DD';


@connect(({ PMA, loading }) => ({
  PMA,
  loading: loading.models.PMA,
}))
@Form.create()
class PaymentMaintenanceUpdate extends PureComponent {
  state ={
    initData:{},
    TableData:[],
    SelectValue:[],
    selectedRowKeys:[],

    ManagerPageIndex:null,
    TreeManagerData:[],
    TableManagerData:{
      list:[],
      pagination:{}
    },
    SelectManagerValue:[],
    selectedManagerRowKeys:[],
    ManagerConditions:[],
    manager_id:null,
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const initData = this.props.location.state.record;
    const projectId = initData.projectId;
    const operatorId = initData.operatorId;

    this.setState({
      initData,
      SelectValue:initData.projectname,
      selectedRowKeys:[projectId],
      SelectManagerValue:initData.operatorname,
      selectedManagerRowKeys:[operatorId]
    })
  }

//取消
  backClick = ()=>{
    router.push("/ecprojectmanagement/paymentmaintenance/list")
  }
  //提交
  validate = ()=>{
    const { form,dispatch } = this.props;
    const { selectedRowKeys,selectedManagerRowKeys,initData } = this.state;
    form.validateFields((err, values) => {
      if(err) return;
      const obj = {
        id:initData.id,
        project_id:selectedRowKeys[0],
        operatorid:selectedManagerRowKeys[0],
        paymentdate:values.paymentdate.format('YYYY-MM-DD'),
        paymentamount:Number(values.paymentamount),
        memo:values.memo
      }
      dispatch({
        type:'PMA/add',
        payload: {
          reqData:{
            ...obj
          }
        },
        callback:(res)=>{
          if(res){
            message.success("编辑成功",1,()=>{
              router.push("/ecprojectmanagement/paymentmaintenance/list")
            })
          }
        }
      })
    })
  };

  render() {
    const {
      form:{getFieldDecorator},
      dispatch
    } = this.props;
    const { initData } = this.state;

    const on = {
      onIconClick:()=>{
        const { dispatch } = this.props;
        dispatch({
          type:'PMA/fetchProject',
          payload:{
            pageIndex:0,
            pageSize:10
          },
          callback:(res)=>{
            if(res){
              this.setState({
                TableData:res,
              })
            }
          }
        })
      },
      onOk:(selectedRowKeys,selectedRows,onChange)=>{
        if(!selectedRowKeys || !selectedRows){
          return
        }
        const nameList = selectedRows.map(item =>{
          return item.projectname
        });
        onChange(nameList)
        this.setState({
          SelectValue:nameList,
          selectedRowKeys
        })
      },
      handleTableChange:(obj)=>{
        const { dispatch } = this.props;
        const { conditions } = this.state;
        const param = {
          ...obj
        };
        if(conditions.length){
          dispatch({
            type:'PMA/fetchProject',
            payload:{
              conditions,
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
          type:'PMA/fetchProject',
          payload:param,
          callback:(res)=>{
            this.setState({
              TableData:res,
            })
          }
        })
      }, //分页
      handleSearch:(values)=>{
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
            conditions
          })
          const obj = {
            pageIndex:0,
            pageSize:10,
            conditions,
          };
          dispatch({
            type:'PMA/fetchProject',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TableData:res,
              })
            }
          })
        }else{
          this.setState({
            conditions:[]
          })
          dispatch({
            type:'PMA/fetchProject',
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
        }
      }, //查询时触发
      handleReset:()=>{
        this.setState({
          conditions:[]
        })
        dispatch({
          type:'PMA/fetchProject',
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
      }, //清空时触发
      onButtonEmpty:()=>{
        this.setState({
          SelectValue:[],
          selectedRowKeys:[],
        })
      }
    };
    const data = {
      TableData:this.state.TableData,
      SelectValue:this.state.SelectValue,
      selectedRowKeys:this.state.selectedRowKeys,
      columns : [
        {
          title: '项目名称',
          dataIndex: 'projectname',
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
          title:'申请单状态',
          dataIndex: 'status',
        },
        {
          title:'',
          dataIndex: 'caozuo',
        },
      ],
      fetchList:[
        {label:'申请编号',code:'code',placeholder:'请输入申请编号'},
        {label:'项目名称',code:'projectname',placeholder:'请输入项目名称'}
      ],
      title:'项目名称',
      placeholder:'请选择项目名称',
    };

    const onManager = {
      onIconClick:()=>{
        const { dispatch } = this.props;
        dispatch({
          type:'PMA/fetchTree',
          payload: {
            reqData:{

            }
          },
          callback:(res)=>{
            if(res){
              const a = toTree(res);
              this.setState({
                TreeManagerData:a
              })
            }
          }
        });
        dispatch({
          type:'PMA/fetchPerson',
          payload:{
            pageIndex:0,
            pageSize:10,
          },
          callback:(res)=>{
            this.setState({
              TableManagerData:res,
            })
          }
        });
      },
      onSelectTree:(selectedKeys, info)=>{
        const { dispatch} = this.props;
        const { ManagerPageIndex } = this.state;
        if(info.selectedNodes[0]){
          const obj = {
            pageIndex:ManagerPageIndex?ManagerPageIndex:0,
            pageSize:10,
            id:info.selectedNodes[0].props.dataRef.id
          }
          dispatch({
            type:'PMA/fetchPerson',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TableManagerData:res,
                manager_id:obj.id
              })
            }
          })
        }else{
          dispatch({
            type:'PMA/fetchPerson',
            payload:{
              pageIndex:0,
              pageSize:10,
            },
            callback:(res)=>{
              this.setState({
                TableManagerData:res,
                manager_id:null
              })
            }
          })
        }
      },
      handleTableChange:(obj)=>{
        const { dispatch } = this.props;
        const { ManagerConditions,manager_id } = this.state;
        const param = {
          id:manager_id,
          ...obj
        };
        if(ManagerConditions.length){
          dispatch({
            type:'PMA/fetchPerson',
            payload:{
              conditions:ManagerConditions,
              ...obj,
            },
            callback:(res)=>{
              this.setState({
                TableManagerData:res,
              })
            }
          });
          return
        }
        dispatch({
          type:'PMA/fetchPerson',
          payload:param,
          callback:(res)=>{
            this.setState({
              TableManagerData:res,
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
          SelectManagerValue:nameList,
          selectedManagerRowKeys:selectedRowKeys
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
            ManagerConditions:conditions
          })
          const obj = {
            pageIndex:0,
            pageSize:10,
            conditions,
          };
          dispatch({
            type:'PMA/fetchPerson',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TableManagerData:res,
              })
            }
          })
        }else{
          this.setState({
            ManagerConditions:[]
          })
          if(this.state.manager_id){
            dispatch({
              type:'PMA/fetchPerson',
              payload:{
                id:this.state.manager_id,
                pageIndex:0,
                pageSize:10,
              },
              callback:(res)=>{
                this.setState({
                  TableManagerData:res,
                })
              }
            })
          }else{
            dispatch({
              type:'PMA/fetchPerson',
              payload:{
                pageIndex:0,
                pageSize:10,
              },
              callback:(res)=>{
                this.setState({
                  TableManagerData:res,
                })
              }
            })
          }
        }
      }, //查询时触发
      handleReset:()=>{
        const { manager_id } = this.state;
        this.setState({
          ManagerConditions:[]
        })
        dispatch({
          type:'PMA/fetchPerson',
          payload:{
            id:manager_id,
            pageIndex:0,
            pageSize:10,
          },
          callback:(res)=>{
            this.setState({
              TableManagerData:res,
            })
          }
        })
      }, //清空时触发
      onButtonEmpty:()=>{
        this.setState({
          SelectManagerValue:[],
          selectedManagerRowKeys:[],
        })
      }
    };
    const dataManager = {
      TreeData:this.state.TreeManagerData, //树的数据
      TableData:this.state.TableManagerData, //表的数据
      //childrenList:this.state.childrenList, //input下拉框数据
      SelectValue:this.state.SelectManagerValue, //下拉框选中的集合
      selectedRowKeys:this.state.selectedManagerRowKeys, //右表选中的数据
      placeholder:'请选择经办人',
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
      title:'经办人选择'
    };

    return (
      <PageHeaderWrapper>
        <Card>
          <Form >
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <FormItem label='所属项目'>
                  {getFieldDecorator('ownproject',{
                    rules: [
                      {
                        required: true,
                        message:'请选择所属项目'
                      }
                    ],
                    initialValue:this.state.SelectValue,
                  })(<ModelTable
                    on={on}
                    data={data}
                  />)}
                </FormItem>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <FormItem label='经办人'>
                  {getFieldDecorator('manager',{
                    rules: [
                      {
                        required: true,
                        message:'请选择经办人'
                      }
                    ],
                    initialValue:this.state.SelectManagerValue,
                  })(<TreeTable
                    on={onManager}
                    data={dataManager}
                  />)}
                </FormItem>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <FormItem label='回款日期'>
                  {getFieldDecorator('paymentdate',{
                    rules: [
                      {
                        required: true,
                        message:'请选择回款日期'
                      }
                    ],
                    initialValue: initData.paymentdate?moment(initData.paymentdate,dateFormat):null
                  })(<DatePicker style={{width:'100%'}} placeholder='请选择回款日期' />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <FormItem label='回款金额'>
                  {getFieldDecorator('paymentamount',{
                    rules: [
                      {
                        required: true,
                        message:'请输入回款金额'
                      }
                    ],
                    initialValue:initData.paymentamount?initData.paymentamount:null
                  })(<Input placeholder='请输入回款金额' type='number'/>)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col md={24} sm={24}>
                <FormItem label='备注'>
                  {getFieldDecorator('memo',{
                    initialValue:initData.memo?initData.memo:''
                  })(<TextArea rows={3} />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16} style={{display:'flex',justifyContent:'flex-end',marginTop:'20px'}}>
              <Col>
                <Button onClick={this.backClick}>取消</Button>
              </Col>
              <Col style={{marginLeft:'12px'}}>
                <Button type="primary" onClick={this.validate}>确定</Button>
              </Col>
            </Row>
          </Form>
        </Card>

      </PageHeaderWrapper>
    );
  }
}

export default PaymentMaintenanceUpdate;
