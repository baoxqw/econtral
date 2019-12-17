import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  TreeSelect ,
  Button,
  Card,
  Checkbox,
  InputNumber,
  Tree,
  Icon,
  Tooltip,
  Modal,
  Select,
  message,
  Popconfirm,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
import { toTree } from '../../tool/ToTree';
import TreeTable from '../../tool/TreeTable/TreeTable';
import storage from '@/utils/storage'
import ModelTable from '../../tool/ModelTable/ModelTable';
const { Option } = Select;
const FormItem = Form.Item;
const { TextArea } = Input;
const { TreeNode } = TreeSelect;

@connect(({ BP, loading }) => ({
  BP,
  loading: loading.models.BP,
}))
@Form.create()
class BussinessPeopleAdd extends PureComponent {
  state = {
    TableData:[],
    SelectValue:[],
    selectedRowKeys:[],
    Sconditions:[],

    TreeBusinessData:[],
    TableBusinessData:[],
    SelectBusinessValue:[],
    selectedBusinessRowKeys:[], //商务负责人
    BusinessConditions:[],
    Business_id:null,
    pageBusiness:{},
  };

  handleCancel = (onCancel)=>{
    if(typeof onCancel === 'function'){
      onCancel()
    }
  };

  onSave = (onSave)=>{
    const { form } = this.props;
    if(!this.state.deptId){
      message.error("部门不能为空");
      return
    }
    if(!this.state.selectedRowKeys.length){
      message.error("所属项目不能为空");
      return
    }
    form.validateFields((err,values)=>{
      const obj = {
        billcode:values.billcode,
        billdate:values.billdate.format('YYYY-MM-DD'),
        projectId:this.state.selectedRowKeys[0],
        deptId:this.state.deptId, //部门id
        psnId:this.state.id,
        status:values.status,
        memo:values.memo
      }
      console.log("obj",obj)
      if(typeof onSave === 'function'){
        onSave(obj)
      }
    })
  };

  onsubmit = (onOk)=>{
    if(typeof onOk === 'function'){
      onOk()
    }
  };

  render() {
    const {
      form: { getFieldDecorator },
      on,
      data,
      dispatch
    } = this.props;

    const { visible,submitId } = data;
    const { onOk,onCancel } = on;

    const onClick = {
      onIconClick:()=>{
        const { dispatch } = this.props;
        dispatch({
          type:'BP/fetchProject',
          payload:{
            pageIndex:0,
            pageSize:10
          },
          callback:(res)=>{
            this.setState({
              TableData:res,
            })
          }
        })
      },
      onOk:(selectedRowKeys,selectedRows)=>{
        if(!selectedRowKeys || !selectedRows){
          return
        }
        const nameList = selectedRows.map(item =>{
          return item.projectname
        });
        this.setState({
          SelectValue:nameList,
          selectedRowKeys
        })
      },
      handleTableChange:(obj)=>{
        const { dispatch } = this.props;
        const { Sconditions } = this.state;
        const param = {
          ...obj
        };
        if(Sconditions.length){
          dispatch({
            type:'BP/fetchProject',
            payload:{
              Sconditions,
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
          type:'BP/fetchProject',
          payload:param,
          callback:(res)=>{
            this.setState({
              TableData:res,
            })
          }
        })
      }, //分页
      handleSearch:(values)=>{
        //点击查询调的方法 参数是个对象  就是输入框的值
        const { dispatch } = this.props;
        const { projectname,status,type } = values;
        if(projectname || status || type) {
          let Sconditions = [];
          let codeObj = {};
          let nameObj = {};
          let typeObj = {}

          if (projectname) {
            codeObj = {
              code: 'projectname',
              exp: 'like',
              value: projectname
            };
            Sconditions.push(codeObj)
          }
          if (status) {
            nameObj = {
              code: 'status',
              exp: 'like',
              value: status
            };
            Sconditions.push(nameObj)
          }
          if (type) {
            typeObj = {
              code: 'type',
              exp: 'like',
              value: type
            };
            Sconditions.push(typeObj)
          }
          this.setState({
            Sconditions
          });
          const obj = {
            pageIndex:0,
            pageSize:10,
            conditions:Sconditions,
          };
          dispatch({
            type: 'BP/fetchProject',
            payload: obj,
            callback:(res)=>{
              this.setState({
                TableData:res,
              })
            }
          })
        }else{
          this.setState({
            Sconditions:[]
          });
          dispatch({
            type: 'BP/fetchProject',
            payload: {
              pageIndex:0,
              pageSize:10,
            },
            callback:(res)=>{
              if(res){
                this.setState({
                  TableData:res,
                })
              }
            }
          })
        }
      }, //查询时触发
      handleReset:()=>{
        const { dispatch } = this.props;
        this.setState({
          Sconditions:[]
        });
        dispatch({
          type: 'BP/fetchProject',
          payload: {
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
    const dataClick = {
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
          title:'操作',
          dataIndex: 'operation',
        },
      ],
      fetchList:[
        {label:'项目名称',code:'projectname',placeholder:'请输入项目名称'},
        {label:'申请单状态',code:'status',placeholder:'请输申请单状态'},
        // {label:'项目类型',code:'type',type:()=>(<Select placeholder='请选择状态' style={{width:'180px'}}>
        //     <Option value="咨询类">咨询类</Option>
        //     <Option value="技术服务类">技术服务类</Option>
        //     <Option value="设备类">设备类</Option>
        //   </Select>)},
      ],
      title:'项目名称',
      placeholder:'请选择项目名称',
    };

    const onBusiness = {
      onIconClick:()=>{
        const { dispatch } = this.props;
        dispatch({
          type:'BP/fetchDept',
          payload: {
            reqData:{}
          },
          callback:(res)=>{
            const a = toTree(res);
            this.setState({
              TreeBusinessData:a
            })
          }
        });
        dispatch({
          type:'BP/fetchPerson',
          payload:{
            pageIndex:0,
            pageSize:10,
          },
          callback:(res)=>{
            this.setState({
              TableBusinessData:res
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
            type:'BP/fetchPerson',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TableBusinessData:res,
                Business_id:obj.id
              })
            }
          })
        }else{
          dispatch({
            type:'BP/fetchPerson',
            payload:{
              pageIndex:0,
              pageSize:10,
            },
            callback:(res)=>{
              this.setState({
                TableBusinessData:res,
                Business_id:null
              })
            }
          })
        }
      }, //点击左边的树
      handleTableChange:(obj)=>{
        const { dispatch } = this.props;
        const { BusinessConditions,Business_id } = this.state;
        const param = {
          id:Business_id,
          ...obj
        };
        if(BusinessConditions.length){
          dispatch({
            type:'BP/fetchPerson',
            payload:{
              conditions:BusinessConditions,
              ...obj,
            },
            callback:(res)=>{
              this.setState({
                TableBusinessData:res,
              })
            }
          });
          return
        }
        dispatch({
          type:'BP/fetchPerson',
          payload:param,
          callback:(res)=>{
            this.setState({
              TableBusinessData:res,
            })
          }
        })
      }, //分页
      onOk:(selectedRowKeys,selectedRows)=>{
        if(!selectedRowKeys || !selectedRows){
          return
        }
        const nameList = selectedRows.map(item =>{
          return item.name
        });
        this.setState({
          SelectBusinessValue:nameList,
          selectedBusinessRowKeys:selectedRowKeys
        })
      }, //模态框确定时触发
      onCancel:()=>{

      } , //取消时触发
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
            BusinessConditions:conditions
          })
          const obj = {
            pageIndex:0,
            pageSize:10,
            conditions,
          };
          dispatch({
            type:'BP/fetchPerson',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TableBusinessData:res,
              })
            }
          })
        }else{
          this.setState({
            BusinessConditions:[]
          })
          if(this.state.Business_id){
            dispatch({
              type:'BP/fetchPerson',
              payload:{
                id:this.state.Business_id,
                pageIndex:0,
                pageSize:10,
              },
              callback:(res)=>{
                this.setState({
                  TableBusinessData:res,
                })
              }
            })
          }else{
            dispatch({
              type:'BP/fetchPerson',
              payload:{
                pageIndex:0,
                pageSize:10,
              },
              callback:(res)=>{
                this.setState({
                  TableBusinessData:res,
                })
              }
            })
          }
        }
      }, //查询时触发
      handleReset:()=>{
        const { Business_id } = this.state;
        this.setState({
          BusinessConditions:[]
        });
        dispatch({
          type:'BP/fetchPerson',
          payload:{
            id:Business_id,
            pageIndex:0,
            pageSize:10,
          },
          callback:(res)=>{
            this.setState({
              TableBusinessData:res,
            })
          }
        })
      }, //清空时触发
      onButtonEmpty:()=>{
        this.setState({
          SelectBusinessValue:[],
          selectedBusinessRowKeys:[],
        })
      }
    };
    const dataBusiness = {
      TreeData:this.state.TreeBusinessData, //树的数据
      TableData:this.state.TableBusinessData, //表的数据
      SelectValue:this.state.SelectBusinessValue, //下拉框选中的集合
      selectedRowKeys:this.state.selectedBusinessRowKeys,
      placeholder:'请选择项商务负责人',
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
      title:'商务负责人'
    }

    return (
      <Modal
        title={"新建"}
        visible={visible}
        width='80%'
        //onOk={()=>this.onSubmit(onOk)}
        onCancel={()=>this.handleCancel(onCancel)}
        footer={[<Button onClick={()=>this.handleCancel(onCancel)} key={1} >取消</Button>,<Button type="primary" key={2} onClick={()=>this.onSave(onSave)}>保存</Button>,<Button type="primary" key={3} disabled={submitId?0:1} onClick={()=>this.onsubmit(onOk)}>提交</Button>]}
      >
        <Card bordered={false}>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="项目名称">
                {getFieldDecorator('projectname',{
                })(<ModelTable
                  on={onClick}
                  data={dataClick}
                />)}
              </Form.Item>
            </Col>
            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item label="签合同时间">
                {getFieldDecorator('signingtime',{
                  rules: [
                    {
                      required: true,
                    }
                  ]
                })(
                  <DatePicker  placeholder="请选择签合同时间" style={{ width: '100%' }}/>
                )}
              </Form.Item>
            </Col>
            <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
              <Form.Item label="客户类型">
                {getFieldDecorator('type',{
                  rules: [
                    {
                      required: true,
                    }
                  ]
                })(
                  <Input placeholder="请输入客户类型"/>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="合同内容">
                {getFieldDecorator('content',{
                  rules: [
                    {
                      required: true,
                    }
                  ],
                })(
                  <Input placeholder="请输入合同内容"/>
                )}
              </Form.Item>
            </Col>
            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item label="合同金额">
                {getFieldDecorator('contractamount',{
                  rules: [
                    {
                      required: true,
                    }
                  ],
                })(
                  <Input type="Number" placeholder="请输入合同金额"/>
                )}
              </Form.Item>
            </Col>
            <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
              <Form.Item label="额外费用">
                {getFieldDecorator('addcharges',{
                  rules: [
                    {
                      required: true,
                    }
                  ]
                })(
                  <Input placeholder="请输入额外费用" type="Number"/>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="有效合同额">
                {getFieldDecorator('ecamount',{
                  rules: [
                    {
                      required: true,
                    }
                  ],
                })(
                  <Input placeholder="请输入有效合同额" type="Number"/>
                )}
              </Form.Item>
            </Col>
            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item label="项目所在地">
                {getFieldDecorator('projectaddress',{
                  rules: [
                    {
                      required: true,
                    }
                  ],
                })(
                  <Input placeholder="请输入项目所在地"/>
                )}
              </Form.Item>
            </Col>
            <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
              <Form.Item label="付款情况(%)">
                {getFieldDecorator('addcharges',{
                  rules: [
                    {
                      required: true,
                    }
                  ]
                })(
                  <Input placeholder="请输入付款情况" type="Number"/>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="付款金额">
                {getFieldDecorator('paymentamount',{
                  rules: [
                    {
                      required: true,
                    }
                  ],
                })(
                  <Input placeholder="请输入付款金额" type="Number"/>
                )}
              </Form.Item>
            </Col>
            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item label="余额">
                {getFieldDecorator('balance',{
                  rules: [
                    {
                      required: true,
                    }
                  ],
                })(
                  <Input placeholder="请输入余额"/>
                )}
              </Form.Item>
            </Col>
            <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
              <Form.Item label="商务负责人">
                {getFieldDecorator('businessleader',{
                  rules: [
                    {
                      required: true,
                    }
                  ]
                })(
                  <ModelTable on={onBusiness} data={dataBusiness}/>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Modal>
    );
  }
}

export default BussinessPeopleAdd;

