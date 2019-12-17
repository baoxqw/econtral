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
  TextArea,
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

import ModelTable from '../../tool/ModelTable/ModelTable';
const { Option } = Select;
const FormItem = Form.Item;
const { TreeNode } = TreeSelect;
@connect(({ BM, loading }) => ({
  BM,
  loading: loading.models.BM,
}))
@Form.create()
class BillManagementAdd extends PureComponent {
  state = {

    //客户名称
    TreeClientData:[],
    TableClientData:[],
    SelectClientValue:[],
    selectedClientRowKeys:[],
    pageClient:{},
    ClientConditions:[],
    Client_id:null,


    //部门
    departmentId:[],
    departmentTreeValue:[],


    TableData:[],
    SelectValue:[],
    selectedRowKeys:[],
    Sconditions:[],

    id:null,
    name:'',

    person:'',


    TablePersonData:[],
    SelectPersonValue:[],
    selectedRowPersonKeys:[],
    PersonConditions:[],
  };

  componentWillReceiveProps(nextProps){
    if(nextProps.data.id !== this.props.data.id){
      const id = nextProps.data.id;
      const name = nextProps.data.name;
      this.setState({
        id,
        name
      })
    }
  }

  onsubmit = (onOk)=>{
    const { form,dispatch } = this.props
    form.validateFields((err,values)=>{
      if(err){
        return;
      }
      const obj = {
        type:values.type,
        code:values.code,
        invoicedate:values.invoicedate.format('YYYY-MM-DD'),
        custId:this.state.selectedClientRowKeys[0],
        printcustname:values.printcustname,
        deptId:this.state.departmentId, //部门id
        operatorId:this.state.selectedRowPersonKeys[0],
        //balanceflag:values.balanceflag,
        totalsummoney:values.totalsummoney?Number(values.totalsummoney):null,
        //status:values.status,
        projectId:this.state.selectedRowKeys[0]
      };
      if(typeof onOk === 'function'){
        onOk(obj)
      }
      form.resetFields();
      this.setState({
        TreeClientData:[],
        TableClientData:[],
        SelectClientValue:[],
        selectedClientRowKeys:[],
        pageClient:{},
        ClientConditions:[],
        Client_id:null,


        //部门
        departmentId:[],
        departmentTreeValue:[],


        TableData:[],
        SelectValue:[],
        selectedRowKeys:[],
        Sconditions:[],

        id:null,
        name:'',

        person:'',


        TablePersonData:[],
        SelectPersonValue:[],
        selectedRowPersonKeys:[],
        PersonConditions:[],
      })
    })
  }

  backClick = ()=>{
    this.props.history.go(-1)
  }

  onFocusDepartment = () =>{
    const { dispatch } = this.props;
    dispatch({
      type:'BM/fetchDept',
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
    this.setState({
      departmentId:value
    })
  }

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode value={item.id} title={item.name}  key={item.id}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode value={item.id} title={item.name}  key={item.id} />;
    });

  handleCancel = (handleCancel)=>{
    const { form,dispatch } = this.props
    if(typeof handleCancel === 'function'){
      handleCancel();
      form.resetFields();
      this.setState({
        TreeClientData:[],
        TableClientData:[],
        SelectClientValue:[],
        selectedClientRowKeys:[],
        pageClient:{},
        ClientConditions:[],
        Client_id:null,


        //部门
        departmentId:[],
        departmentTreeValue:[],


        TableData:[],
        SelectValue:[],
        selectedRowKeys:[],
        Sconditions:[],

        id:null,
        name:'',

        person:'',


        TablePersonData:[],
        SelectPersonValue:[],
        selectedRowPersonKeys:[],
        PersonConditions:[],
      })
    }
  };

  render() {
    const {
      form: { getFieldDecorator },
      dispatch,
      data,
      loading,
      on
    } = this.props;

    const { visible } = data;
    const { onOk,handleCancel } = on;

    const onClient = {
      onIconClick:()=>{
        const { dispatch } = this.props;
        dispatch({
          type:'BM/fetchClientTree',
          payload: {
            reqData:{}
          },
          callback:(res)=>{
            const a = toTree(res);
            this.setState({
              TreeClientData:a
            })
          }
        });
        dispatch({
          type:'BM/findClientTable',
          payload:{
            pageIndex:0,
            pageSize:10,
          },
          callback:(res)=>{
            if(res){
              this.setState({
                TableClientData:res
              })
            }
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
            type:'BM/findClientTable',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TableClientData:res,
                Client_id:obj.id
              })
            }
          })
        }else{
          dispatch({
            type:'BM/findClientTable',
            payload:{
              pageIndex:0,
              pageSize:10,
            },
            callback:(res)=>{
              this.setState({
                TableClientData:res,
                Client_id:null
              })
            }
          })
        }

      }, //点击左边的树
      handleTableChange:(obj)=>{
        const { dispatch } = this.props;
        const { ClientConditions,Client_id } = this.state;
        const param = {
          id:Client_id,
          ...obj
        };
        if(ClientConditions.length){
          dispatch({
            type:'BM/findClientTable',
            payload:{
              conditions:ClientConditions,
              ...obj,
            },
            callback:(res)=>{
              this.setState({
                TableClientData:res,
              })
            }
          });
          return
        }
        dispatch({
          type:'BM/findClientTable',
          payload:param,
          callback:(res)=>{
            this.setState({
              TableClientData:res,
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
          SelectClientValue:nameList,
          selectedClientRowKeys:selectedRowKeys
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
            ClientConditions:conditions
          })
          const obj = {
            pageIndex:0,
            pageSize:10,
            conditions,
            id:this.state.Client_id
          };
          dispatch({
            type:'BM/findClientTable',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TableClientData:res,
              })
            }
          })
        }else{
          this.setState({
            ClientConditions:[]
          });
          dispatch({
            type:'BM/findClientTable',
            payload:{
              id:this.state.Client_id,
              pageIndex:0,
              pageSize:10,
            },
            callback:(res)=>{
              this.setState({
                TableClientData:res,
              })
            }
          })
        }
      }, //查询时触发
      handleReset:()=>{
        const { Client_id } = this.state;
        this.setState({
          ClientConditions:[]
        });
        dispatch({
          type: 'BM/findClientTable',
          payload: {
            id:Client_id,
            pageIndex:0,
            pageSize:10,
          },
          callback: (res) => {
            this.setState({
              TableClientData: res,
            })
          }
        })
      }, //清空时触发
      onButtonEmpty:()=>{
        this.setState({
          SelectClientValue:[],
          selectedClientRowKeys:[],
        })
      }
    };
    const dataClient = {
      TreeData:this.state.TreeClientData, //树的数据
      TableData:this.state.TableClientData, //表的数据
      SelectValue:this.state.SelectClientValue, //下拉框选中的集合
      selectedRowKeys:this.state.selectedClientRowKeys,
      placeholder:'请选择项客户',
      columns:[
        {
          title: '客商编码',
          dataIndex: 'code',
        },
        {
          title: '客商名称',
          dataIndex: 'name',
        },
        {
          title: '客商类型',
          dataIndex: 'custtype',
          render:(text,item)=>{
            if(text == 1){
              return '客商'
            }else if(text == 2){
              return '客户'
            }else if(text == 3){
              return '供应商'
            }
          }
        },
      ],
      fetchList:[
        {label:'客商编码',code:'code',placeholder:'请输入客商编码'},
        {label:'客商名称',code:'name',placeholder:'请输入客商名称'},
      ],
      title:'客户'
    }

    const onProject = {
      onIconClick:()=>{
        const { dispatch } = this.props;
        dispatch({
          type:'BM/fetchProject',
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
          selectedRowKeys,
          person:selectedRows[0].projectmanagerName
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
            type:'BM/fetchProject',
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
          type:'BM/fetchProject',
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
            type: 'BM/fetchProject',
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
            type: 'BM/fetchProject',
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
          type: 'BM/fetchProject',
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
    const dataProject = {
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


    const onPerson = {
      onIconClick:()=>{
        const { dispatch } = this.props;
        dispatch({
          type:'BM/fetchPerson',
          payload:{
            pageIndex:0,
            pageSize:10
          },
          callback:(res)=>{
            this.setState({
              TablePersonData:res,
            })
          }
        })
      },
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
          selectedRowPersonKeys:selectedRowKeys,
        })
      },
      handleTableChange:(obj)=>{
        const { dispatch } = this.props;
        const { PersonConditions } = this.state;
        const param = {
          ...obj
        };
        if(PersonConditions.length){
          dispatch({
            type:'BM/fetchPerson',
            payload:{
              conditions:PersonConditions,
              ...obj,
            },
            callback:(res)=>{
              this.setState({
                TablePersonData:res,
              })
            }
          });
          return
        }
        dispatch({
          type:'BM/fetchPerson',
          payload:param,
          callback:(res)=>{
            this.setState({
              TablePersonData:res,
            })
          }
        })
      }, //分页
      handleSearch:(values)=>{
        //点击查询调的方法 参数是个对象  就是输入框的值
        const { dispatch } = this.props;
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
            PersonConditions:conditions
          })
          const obj = {
            pageIndex:0,
            pageSize:10,
            conditions,
          };
          dispatch({
            type:'BM/fetchPerson',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TablePersonData:res,
              })
            }
          })
        }else{
          this.setState({
            PersonConditions:[]
          });
          dispatch({
            type:'BM/fetchPerson',
            payload:{
              pageIndex:0,
              pageSize:10,
            },
            callback:(res)=>{
              this.setState({
                TablePersonData:res,
              })
            }
          })
        }
      }, //查询时触发
      handleReset:()=>{
        const { dispatch } = this.props;
        this.setState({
          PersonConditions:[]
        });
        dispatch({
          type: 'BM/fetchPerson',
          payload: {
            pageIndex:0,
            pageSize:10,
          },
          callback:(res)=>{
            this.setState({
              TablePersonData:res,
            })
          }
        })
      }, //清空时触发
      onButtonEmpty:()=>{
        this.setState({
          SelectPersonValue:[],
          selectedRowPersonKeys:[],
        })
      }
    };
    const dataPerson = {
      TableData:this.state.TablePersonData,
      SelectValue:this.state.SelectPersonValue,
      selectedRowKeys:this.state.selectedRowPersonKeys,
      columns : [
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
        },
      ],
      fetchList:[
        {label:'人员编码',code:'code',placeholder:'请输入人员编码'},
        {label:'人员名称',code:'name',placeholder:'请输入人员名称'},
      ],
      title:'制单人',
      placeholder:'请选择制单人',
    };
    return (
      <Modal
        title={"新建"}
        centered
        visible={visible}
        width='80%'
        onOk={()=>this.onsubmit(onOk)}
        onCancel={()=>this.handleCancel(handleCancel)}
      >
        <Card bordered={false}>
          <Form layout="vertical"  onSubmit={()=>this.onsubmit(onOk)}>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="发票类型">
                  {getFieldDecorator('type',{
                    rules: [{required: true,message:'发票类型'}]
                  })(<Input placeholder="发票类型" />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="发票号">
                  {getFieldDecorator('code',{
                    rules: [
                      {
                        required: true,
                        message:'发票号'
                      }
                    ]
                  })(
                    <Input placeholder="发票号" />
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label="开票日期">
                  {getFieldDecorator('invoicedate', {
                    rules: [
                      {
                        required: true,
                        message:'开票日期'
                      }
                    ]
                  })(<DatePicker  placeholder="请选择开票日期" style={{ width: '100%' }}/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="客户名称">
                  {getFieldDecorator('custId',{
                    rules: [{required: true,message:'客户名称'}],
                    initialValue:this.state.SelectClientValue
                  })(<TreeTable
                    on={onClient}
                    data={dataClient}
                  />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="客户打印名称">
                  {getFieldDecorator('printcustname', {
                  })( <Input placeholder="请输入打印名称" />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label="部门">
                  {getFieldDecorator('deptId',{
                    rules: [{required: true,message:'部门'}]
                  })(<TreeSelect
                    treeDefaultExpandAll
                    style={{ width: '100%' }}
                    onFocus={this.onFocusDepartment}
                    onChange={this.onChangDepartment}
                    placeholder="请选择负责部门"
                  >
                    {this.renderTreeNodes(this.state.departmentTreeValue)}
                  </TreeSelect >)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="发票总金额">
                  {getFieldDecorator('totalsummoney',{
                    rules: [{required: true,message:'发票总金额'}]
                  })(<Input placeholder="请输入发票总金额" type='Number'/>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="制单人">
                  {getFieldDecorator('operatorId',{
                    rules: [
                      {
                        required: true,
                        message:'制单人'
                      }
                    ],
                    initialValue:this.state.SelectPersonValue
                  })(
                    <ModelTable
                      on={onPerson}
                      data={dataPerson}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label="项目名称">
                  {getFieldDecorator('projectname', {
                    rules: [
                      {
                        required: true,
                        message:'项目名称'
                      }
                    ],
                    initialValue:this.state.SelectValue
                  })( <ModelTable
                    on={onProject}
                    data={dataProject}
                  />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="项目负责人">
                  {getFieldDecorator('person',{
                    rules: [{required: true,message:'项目负责人'}],
                    initialValue:this.state.person
                  })(<Input placeholder="项目负责人"  disabled/>)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </Modal>
    );
  }
}

export default BillManagementAdd;
