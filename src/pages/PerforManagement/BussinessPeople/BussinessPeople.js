import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Row, Col, Form, Input, Button, Card,Popconfirm,Divider,Select,message } from 'antd';
import NormalTable from '@/components/NormalTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import BPAdd from './BussinessPeopleAdd';
import BPUpdate from './BussinessPeopleUpdate';
import styles from '../../System/UserAdmin.less';
import TextArea from 'antd/lib/input/TextArea';
import ModelTable from '../../tool/ModelTable/ModelTable';
import { toTree } from '@/pages/tool/ToTree';
import TreeTable from '@/pages/tool/TreeTable/TreeTable';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ BP, loading }) => ({
  BP,
  loading: loading.models.BP,
}))
@Form.create()
class BussinessPeople extends PureComponent {
  state = {
    submitId:false,
    addVisible:false,
    updateVisible:false,
    record:{},
    conditions:[],
    dataList:[],
    personId:null,

    TableData:[],
    SelectValue:[],
    selectedRowKeys:[],
    Sconditions:[],

    addid:null,
    title:null,
    TreeWorkData:[], //存储左边树的数据
    WorkConditions:[], //存储查询条件
    work_id:null, //存储立项人左边数点击时的id  分页时使用
    TableWorkData:[], //存储表数据  格式{list: response.resData, pagination:{total: response.total}}
    SelectWorkValue:[], //存储右表选中时时的name  初始进来时可以把获取到的name存入进来显示
    selectedWorkRowKeys:[], //立项人  存储右表选中时的挣个对象  可以拿到id
    pageWork:{},


  };

  columns = [
    {
      title: '项目名称',
      dataIndex: 'projectname',
    },
    {
      title: '商务人员',
      dataIndex: 'initiationpersonName',
    },

    {
      title:'合同签订时间',
      dataIndex:'signingdate',
    },
    {
      title: '客户类型',
      dataIndex: 'type',
    },
    {
      title: '合同内容',
      dataIndex: 'memo',
    },
    {
      title: '合同金额',
      dataIndex: 'contractamount',
    },
    {
      title: '额外费用',
      dataIndex: 'addcharges',
    },
    {
      title: '有效合同额',
      dataIndex: 'additionalcharges',
    },
    {
      title: '项目所在地',
      dataIndex: 'projectaddress',
    },
    {
      title: '付款情况',
      dataIndex: 'paymentsitustion',
    },
    {
      title: '余额',
      dataIndex: 'balance',
    },
    {
      title: '商务负责人',
      dataIndex: 'businessleader',
    },
    {
      title: 'p1',
      dataIndex: 'p1',
    },
    {
      title: 'p2',
      dataIndex: 'p2',
    },
    {
      title: 'p3',
      dataIndex: 'p3',
    },
    {
      title: 'p4',
      dataIndex: 'p4',
    },
    {
      title: 'p5',
      dataIndex: 'p5',
    },
    {
      title: 'p6',
      dataIndex: 'p6',
    },
    {
      title: 'p7',
      dataIndex: 'p7',
    },
    {
      title: '贡献合同额',
      dataIndex: 'cca',
    },
    {
      title: '项目状态',
      dataIndex: 'status',
    },
    {
      title: '',
      dataIndex: 'operation',
    },
  ];
  componentDidMount(){
    const { dispatch } = this.props;
    dispatch({
      type:'BP/fetch',
      payload:{

      }
    })
  }
  handleStandardTableChange = (pagination)=>{
    const { dispatch } = this.props;
    const { conditions } = this.state
    const obj = {
      pageIndex: pagination.current-1,
      pageSize: pagination.pageSize,
    };
    if(conditions){
      let obj = {
        pageIndex: pagination.current-1,
        pageSize: pagination.pageSize,
        conditions,
      }
      dispatch({
        type:'BP/fetch',
        payload: obj,
      });
    }else{
      dispatch({
        type:'BP/fetch',
        payload: obj,
      });
    }

  };

  //查询
  findList = (e) => {
    const {form,dispatch} = this.props

    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if(err){
        return
      }

      const { selectedWorkRowKeys,selectedRowKeys} = this.state
      const { personId,projectNameSe} = values
      if(personId || projectNameSe){
        let conditions = [];
        let codeObj = {};
        let nameObj = {};
        if(personId){
          codeObj = {
            code:'INITIATIONPERSON_ID',
            exp:'=',
            value:selectedWorkRowKeys[0]
          };
          conditions.push(codeObj)
        }
        if(projectNameSe){
          nameObj = {
            code:'ID',
            exp:'=',
            value:selectedRowKeys[0]
          };
          conditions.push(nameObj)
        }
        this.setState({
          conditions
        })
        const obj = {
          conditions,
          pageSize:10
        };
        dispatch({
          type:'BP/fetch',
          payload:obj,
        })
      }

    })
  };

  //取消
  handleFormReset = ()=>{
    const { dispatch,form} = this.props;
    //清空输入框
    form.resetFields();
    this.setState({
      conditions:[],
      addid:null,
      title:null,
      TreeWorkData:[], //存储左边树的数据
      WorkConditions:[], //存储查询条件
      work_id:null, //存储立项人左边数点击时的id  分页时使用
      TableWorkData:[], //存储表数据  格式{list: response.resData, pagination:{total: response.total}}
      SelectWorkValue:[], //存储右表选中时时的name  初始进来时可以把获取到的name存入进来显示
      selectedWorkRowKeys:[], //立项人  存储右表选中时的挣个对象  可以拿到id
      pageWork:{},
      SelectValue:[],
      selectedRowKeys:[],
    });
    //清空后获取列表
    dispatch({
      type:'BP/fetch',
      payload:{
        pageIndex:0,
        pageSize:10,
      }
    });
  };

  handleBPAdd = ()=>{
    this.setState({
      addVisible:true
    })
  };

  update = (e,record)=>{
    e.preventDefault();
    this.setState({
      updateVisible:true,
      record
    })
  };

  onFocus = ()=>{
    const { dispatch } = this.props;
    dispatch({
      type:'BP/dataList',
      payload:{},
      callback:(res)=>{
        this.setState({
          dataList:res.resData
        })
      }
    })
  };

  onChangeSelect = (value)=>{
    this.setState({
      personId:value
    })
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { dataList } = this.state;

    const option = dataList.map(item =>{
      return <Option value={item.id} key={item.id}>{item.name}</Option>
    });

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

    const onWork  = {
      onIconClick:()=>{
        const { dispatch } = this.props;
        dispatch({
          type:'BP/newdata',
          payload: {
            reqData:{

            }
          },
          callback:(res)=>{
            if (res.resData){
              const a = toTree(res.resData);
              this.setState({
                TreeWorkData:a
              })
            }
          }
        });
        dispatch({
          type:'BP/fetchTable',
          payload:{
            pageIndex:0,
            pageSize:10,
          },
          callback:(res)=>{
            this.setState({
              TableWorkData:res,
            })
          }
        })
      },
      onSelectTree:(selectedKeys, info)=>{
        const { dispatch} = this.props;
        if(info.selectedNodes[0]){
          const obj = {
            pageIndex:0,
            pageSize:10,
            id:info.selectedNodes[0].props.dataRef.id
          }
          dispatch({
            type:'BP/fetchTable',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TableWorkData:res,
                work_id:obj.id
              })
            }
          })
        }else{
          dispatch({
            type:'BP/fetchTable',
            payload:{
              pageIndex:0,
              pageSize:10,
            },
            callback:(res)=>{
              this.setState({
                TableWorkData:res,
                work_id:obj.id
              })
            }
          })
        }
      },
      handleTableChange:(obj)=>{
        const { dispatch } = this.props;
        const { WorkConditions,work_id } = this.state;
        const param = {
          id:work_id,
          ...obj
        };
        this.setState({
          pageWork:param
        })
        if(WorkConditions.length){
          dispatch({
            type:'BP/fetchTable',
            payload:{
              conditions:WorkConditions,
              ...obj,
            },
            callback:(res)=>{
              this.setState({
                TableWorkData:res,
              })
            }
          });
          return
        }
        dispatch({
          type:'BP/fetchTable',
          payload:param,
          callback:(res)=>{
            this.setState({
              TableWorkData:res,
            })
          }
        })
      }, //分页
      onOk:(selectedRowKeys,selectedRows,onChange)=>{
        const { dispatch } = this.props
        if(!selectedRowKeys.length || !selectedRows.length){
          return
        }

        const nameList = selectedRows.map(item =>{
          return item.name
        });
        onChange(nameList)
        this.setState({
          SelectWorkValue:nameList,
          selectedWorkRowKeys:selectedRowKeys,
        })

      }, //模态框确定时触发
      onCancel:()=>{

      },  //取消时触发
      handleSearch:(values)=>{
        const { dispatch } = this.props;
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
            WorkConditions:conditions
          })
          const obj = {
            pageIndex:0,
            pageSize:10,
            conditions,
          };
          dispatch({
            type:'BP/fetchTable',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TableWorkData:res,
              })
            }
          })
        }else{
          this.setState({
            WorkConditions:[]
          })
          if(this.state.work_id){
            dispatch({
              type:'BP/fetchTable',
              payload:{
                id:this.state.manager_id,
                pageIndex:0,
                pageSize:10,
              },
              callback:(res)=>{
                this.setState({
                  TableWorkData:res,
                })
              }
            })
          }else{
            dispatch({
              type:'BP/fetchTable',
              payload:{
                pageIndex:0,
                pageSize:10,
              },
              callback:(res)=>{
                this.setState({
                  TableWorkData:res,
                })
              }
            })
          }
        }
      }, //查询时触发
      handleReset:()=>{
        const { dispatch } = this.props;
        const { pageWork } = this.state;
        this.setState({
          WorkConditions:[]
        })
        dispatch({
          type:'BP/fetchTable',
          payload:{
            ...pageWork
          },
          callback:(res)=>{
            this.setState({
              TableWorkData:res,
            })
          }
        })
      }, //清空时触发
      onButtonEmpty:()=>{
        this.setState({
          SelectWorkValue:[],
          selectedWorkRowKeys:[],
        })
      },
    }
    const datasWork = {
      TreeData:this.state.TreeWorkData, //树的数据
      TableData:this.state.TableWorkData, //表的数据
      SelectValue:this.state.SelectWorkValue, //框选中的集合
      selectedRowKeys:this.state.selectedWorkRowKeys, //右表选中的数据
      placeholder:'请选择人员',
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
          title: '操作',
          dataIndex: 'operation',
          render: (text, record) =>
            <Fragment>
              <a href="javascript:;" onClick={() => this.handleUpdate(true,record)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm title="确定删除吗?"  onConfirm={() => this.handleDelete(record)}>
                <a href="javascript:;">删除</a>
              </Popconfirm>
            </Fragment>
        },
      ],
      fetchList:[
        {label:'人员编码',code:'code',placeholder:'人员编码'},
        {label:'人员名称',code:'name',placeholder:'人员名称'},
      ],
      title:'选择人员',
    }
    return (
      <Form layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <Form.Item label='商务人员'>
              {getFieldDecorator('personId', {
                initialValue:this.state.SelectWorkValue,
                // rules: [{ required: true,message:'选择人员' }],
              })(
                <TreeTable
                  on={onWork}
                  data={datasWork}
                />
              )}
            </Form.Item>
          </Col>
          <Col md={8} sm={16}>
            <FormItem label='项目名称'>
              {getFieldDecorator('projectNameSe',{
                // rules: [{ required: true,message:'选择项目' }],
              })(
                <ModelTable
                  on={onClick}
                  data={dataClick}
                />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
           <span>
              <Button type="primary"  onClick={this.findList}>
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

  render() {
    const {
      BP:{ fetchData },
      loading,
    } = this.props;
    const { submitId,addVisible,updateVisible } = this.state;

    /* const addData = {
       visible:addVisible,
       submitId
     };
     const addOn = {
       onOk:(res)=>{

       },
       onCancel:()=>{
         this.setState({
           addVisible:false
         })
       }
     };

     const updateData = {
       visible:updateVisible
     };
     const updateOn = {
       onOk:(res)=>{

       },
       onCancel:()=>{
         this.setState({
           updateVisible:false
         })
       }
     };*/

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.userAdminForm}>{this.renderForm()}</div>
          <div style={{marginTop:'15px'}}>
            <NormalTable
              // rowKey="id"
              loading={loading}
              data={fetchData}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>

          {/* <BPAdd  data={addData} on={addOn}/>

          <BPUpdate  data={updateData} on={updateOn}/>*/}

        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default BussinessPeople;
