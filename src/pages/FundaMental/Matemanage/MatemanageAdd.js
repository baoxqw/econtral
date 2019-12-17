import React, { Fragment, PureComponent } from 'react';
import {
  Card,
  Button,
  Form,
  Col,
  Row,
  Divider,
  Popconfirm,
  DatePicker,
  TimePicker,
  Input,
  Checkbox,
  message,
  TreeSelect,
} from 'antd';
const FormItem = Form.Item;
import BraftEditor from 'braft-editor';
import { formatMessage, FormattedMessage } from 'umi/locale';
import 'braft-editor/dist/index.css';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { toTree } from '@/pages/tool/ToTree';
import TreeTable from '@/pages/tool/TreeTable/TreeTable';
import FooterToolbar from '@/components/FooterToolbar';
import router from 'umi/router';

import ModelTable from '../../tool/ModelTable/ModelTable';

const { TextArea } = Input;
@connect(({ matemanage,businessadmin, loading }) => ({
  matemanage,
  businessadmin,
  loading: loading.models.matemanage,
}))

@Form.create()
class MatemanageAdd extends PureComponent {
  state = {
    TableData:[],
    SelectValue:[],
    selectedRowKeys:[],
    conditions:[],
    page:{},

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


  componentDidMount() {
    if(this.props.location.record){
      this.setState({
        addid:this.props.location.record.addid,
        title:this.props.location.record.title,
      })
    }
    console.log('-----',this.props.location)
  }

  validate () {
    const { dispatch } = this.props;
    const { form} = this.props;
    const { addid } = this.state;
    form.validateFields((err, fieldsValue) => {
     if(!err){
       const values = {
         reqData:{
           ...fieldsValue,
           // manufacture:fieldsValue.manufacture[0]?fieldsValue.manufacture[0]+'':null,
           manufacture:this.state.selectedWorkRowKeys[0]?this.state.selectedWorkRowKeys[0]+'':null,
           invclId:addid,
           ucumId:this.state.selectedRowKeys[0],
           price:fieldsValue.price?Number(fieldsValue.price):null,
         }
       };
       console.log('提交：',values)
       dispatch({
         type:'matemanage/add',
         payload: values,
         callback:(res)=>{
           if(res.errMsg === "成功"){
             message.success('新建成功',1,()=>{
               router.push('/fundamental/matemanage/list');
             });
           }
         }
       })
     }

    })

  }


  backClick = ()=>{
    this.props.history.go(-1)
  }

  render() {
    const {
      form: { getFieldDecorator },
      submitting,
      dispatch,
      form
    } = this.props;

    const on = {
      onIconClick:()=>{
        const { dispatch } = this.props;
        dispatch({
          type:'matemanage/fetchUcum',
          payload:{
            reqData:{
              pageIndex:0,
              pageSize:10
            }
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
        console.log("selectedRows",selectedRows)
        const nameList = selectedRows.map(item =>{
          return item.name
        });
        onChange(nameList)
        this.setState({
          SelectValue:nameList,
          selectedRowKeys:selectedRowKeys,
        })
      },
      handleTableChange:(obj)=>{
        const { dispatch } = this.props;
        const { conditions } = this.state;
        const param = {
          ...obj
        };
        this.setState({
          page:param
        });
        if(conditions.length){
          dispatch({
            type:'matemanage/fetchUcum',
            payload:{
              conditions:conditions,
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
          type:'matemanage/fetchUcum',
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
            conditions:conditions,
          });
          const obj = {
            conditions,
          };
          dispatch({
            type:'matemanage/fetchUcum',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TableData:res,
              })
            }
          })
        }
      }, //查询时触发
      handleReset:()=>{
        const { page } = this.state;
        this.setState({
          conditions:[]
        });
        dispatch({
          type:'matemanage/fetchUcum',
          payload:{
            ...page
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
    const onData = {
      TableData:this.state.TableData,
      SelectValue:this.state.SelectValue,
      selectedRowKeys:this.state.selectedRowKeys,
      columns :[
        {
          title: '编码',
          dataIndex: 'code',
        },
        {
          title: '名称',
          dataIndex: 'name',
        },
        {
          title: '所属量纲',
          dataIndex: 'dimension',
        },
        {
          title: '是否基本计量单位',
          dataIndex: 'basecodeflag',
          render:(text)=>{
              return <Checkbox checked={text}/>
          }
        },
        {
          title: '换算率（与量纲基本单位）',
          dataIndex: 'conversionrate',
        },
        {
          title: '',
          dataIndex: 'caozuo',
        }
      ],
      fetchList:[
        {label:'编码',code:'code',placeholder:'请输入区域编号'},
        {label:'名称',code:'name',placeholder:'请输入区域名称'},
      ],
      title:'计量单位',
      placeholder:'请选择计量单位',
    };

    const onWork = {
      onIconClick:()=>{
        const { dispatch } = this.props;
        dispatch({
          type:'businessadmin/tree',
          payload: {
            reqData:{}
          },
          callback:(res)=>{
            if(res){
              const a = toTree(res);
              this.setState({
                TreeWorkData:a
              })
            }

          }
        });
        let conditions = [];
        let codeObj = {
          code:'CUSTTYPE',
          exp:'like',
          value:'3'
        };
        conditions.push(codeObj)
        dispatch({
          type:'businessadmin/fetch',
          payload:{
            pageIndex:0,
            pageSize:10,
            conditions
          },
          callback:(res)=>{
              this.setState({
                TableWorkData:res,
              })
          }
        })
      }, //input聚焦时调用的接口获取信息
      onSelectTree:(selectedKeys, info)=>{
        const { dispatch} = this.props;
        if(info.selectedNodes[0]){
          let conditions = [];
          let codeObj = {
            code:'CUSTTYPE',
            exp:'like',
            value:'3'
          };
          conditions.push(codeObj)
          const obj = {
            pageIndex:0,
            pageSize:10,
            conditions,
            id:info.selectedNodes[0].props.dataRef.id
          }
          dispatch({
            type:'businessadmin/fetch',
            payload:obj,
            callback:(res)=>{
                this.setState({
                  TableWorkData:res,
                  work_id:obj.id
                })
            }
          })
        }
      }, //点击左边的树
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
            type:'businessadmin/fetch',
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
          type:'businessadmin/fetch',
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
            type:'businessadmin/fetch',
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
            let conditions = [];
            let codeObj = {
              code:'CUSTTYPE',
              exp:'like',
              value:'3'
            };
            conditions.push(codeObj)
            dispatch({
              type:'businessadmin/fetch',
              payload:{
                pageIndex:0,
                pageSize:10,
                conditions,
                id:this.state.manager_id,
              },
              callback:(res)=>{
                this.setState({
                  TableWorkData:res,
                })
              }
            })
          }else{
            let conditions = [];
            let codeObj = {
              code:'CUSTTYPE',
              exp:'like',
              value:'3'
            };
            conditions.push(codeObj)
            dispatch({
              type:'businessadmin/fetch',
              payload:{
                pageIndex:0,
                pageSize:10,
                conditions,
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
        const { pageWork } = this.state;
        this.setState({
          WorkConditions:[]
        })
        dispatch({
          type:'businessadmin/fetch',
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
    };
    const datasWork = {
      TreeData:this.state.TreeWorkData, //树的数据
      TableData:this.state.TableWorkData, //表的数据
      SelectValue:this.state.SelectWorkValue, //框选中的集合
      selectedRowKeys:this.state.selectedWorkRowKeys, //右表选中的数据
      placeholder:'请选择生产厂家',
      columns : [
        {
          title: '供应商编码',
          dataIndex: 'code',
          key: 'code',
        },
        {
          title: '供应商名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '供应商类型',
          dataIndex: 'custtype',
          key: 'custtype',
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
        {label:'供应商编码',code:'code',placeholder:'供应商编码'},
        {label:'供应商名称',code:'name',placeholder:'供应商名称'},
      ],
      title:'生产厂家选择',
      add:false
    }
    return (
      <PageHeaderWrapper>
        <Card title='物料档案'  bordered={false}>
          <Form layout="vertical"  onSubmit={this.handleSubmit}>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label='物料编码'>
                  {getFieldDecorator('code', {
                    rules: [{ required: true}],
                  })(<Input placeholder='请输入物料编码' />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label='物料名称'>
                  {getFieldDecorator('name', {
                    rules: [{ required: true}],
                  })(<Input placeholder='请输入物料名称' />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label='物料分类'>
                  {getFieldDecorator('INVCL_ID', {
                    initialValue: this.state.title
                    // rules: [{ required: true}],
                  })(<Input placeholder='物料分类' disabled/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label='型号'>
                  {getFieldDecorator('model', {
                     // rules: [{ required: true,message:'型号'}],
                  })(<Input placeholder='请输入型号' />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label='计量单位'>
                  {getFieldDecorator('ucumId', {
                    rules: [{ required: true,message:'计量单位' }],
                    initialValue:this.state.SelectValue
                  })(<ModelTable
                    data={onData}
                    on={on}
                  />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label='物料简称'>
                  {getFieldDecorator('materialshortname', {
                    rules: [
                      { required: true,message:'物料简称' }
                      ]
                  })(<Input placeholder='请输入物料简称' />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label='物料条码'>
                  {getFieldDecorator('materialbarcode', {
                    rules: [{ required: true,message:'物料条码'}],
                  })(<Input placeholder='请输入物料条码'/>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label='物料助记码'>
                  {getFieldDecorator('materialmnecode', {
                     rules: [{ required: true,message:'物料助记码' }],
                  })(<Input placeholder='请输入物料助记码' />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label='图号'>
                  {getFieldDecorator('graphid', {
                    rules: [
                      { required: true,message:'图号'},
                    ],
                  })(<Input placeholder='图号' />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label='计划价格'>
                  {getFieldDecorator('price', {
                    // rules: [{ required: true,message:'计划价格'}],
                  })(<Input placeholder='请输入计划价格' type={"Number"}/>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label='生产厂家'>
                  {getFieldDecorator('manufacture', {
                    initialValue:this.state.SelectWorkValue,
                     // rules: [{ required: true,message:'生产厂家' }],
                  })(
                    <TreeTable
                      on={onWork}
                      data={datasWork}
                    />
                    )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label='规格'>
                  {getFieldDecorator('spec', {
                    // rules: [{ required: true,message:'规格'}],
                  })(<Input placeholder='请输入规格' />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={24} md={24} sm={24}>
                <Form.Item label="备注">
                  {getFieldDecorator('memo',{
                  })(<TextArea rows={4}/>)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>

        <FooterToolbar style={{ width:'100%' }}>
          {/* {this.getErrorInfo()} */}
          <Button
            onClick={this.backClick}
          >
            取消
          </Button>
          <Button type="primary" onClick={()=>this.validate()} loading={submitting}>
            确定
          </Button>

        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}

export default MatemanageAdd;
