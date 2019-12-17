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

import BraftEditor from 'braft-editor';
import { formatMessage, FormattedMessage } from 'umi/locale';
import 'braft-editor/dist/index.css';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FooterToolbar from '@/components/FooterToolbar';
import { toTree } from '@/pages/tool/ToTree';
import TreeTable from '@/pages/tool/TreeTable/TreeTable';
import router from 'umi/router';

import ModelTable from '../../tool/ModelTable/ModelTable';

const { TextArea } = Input;
@connect(({ matemanage, loading }) => ({
  matemanage,
  loading: loading.models.matemanage,
}))

@Form.create()
class MatemanageUpdate extends PureComponent {
  state = {
    initData:{},

    TableData:[],
    SelectValue:[],
    selectedRowKeys:[],
    conditions:[],
    page:{},

    addid:null,
    TreeWorkData:[], //存储左边树的数据
    WorkConditions:[], //存储查询条件
    work_id:null, //存储立项人左边数点击时的id  分页时使用
    TableWorkData:[], //存储表数据  格式{list: response.resData, pagination:{total: response.total}}
    SelectWorkValue:[], //存储右表选中时时的name  初始进来时可以把获取到的name存入进来显示
    selectedWorkRowKeys:[], //立项人  存储右表选中时的挣个对象  可以拿到id
    pageWork:{},

  };


  componentDidMount() {
    if(this.props.location){
      const initData = this.props.location.record;
      console.log('上一页数据：',initData)
      const ucumName = initData.ucumName;
      let workName;
      if(initData.manufactureName){
        workName = initData.manufactureName
        this.setState({SelectWorkValue:workName,})
      }
      let manufacture
      if(initData.manufacture){
        manufacture = Number(initData.manufacture)
        this.setState({selectedWorkRowKeys:[manufacture],})
      }
      const ucumId = initData.ucumId;
      this.setState({
        initData,
        SelectValue:ucumName,
        selectedRowKeys:[ucumId],
      //
      })
    }
  }

  validate () {
    const { dispatch } = this.props;
    const { form} = this.props;
    const { initData } = this.state;
    form.validateFields((err, fieldsValue) => {
     if(!err){
       const values = {
         reqData:{
           ...fieldsValue,
           id:initData.id,
           invclId:initData.invclId,
           manufacture:this.state.selectedWorkRowKeys[0],
           ucumId:this.state.selectedRowKeys[0],
           price:fieldsValue.price?Number(fieldsValue.price):null,
         }
       };
       dispatch({
         type:'matemanage/add',
         payload: values,
         callback:(res)=>{
           if(res.errMsg === "成功"){
             message.success('编辑成功',1,()=>{
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
    } = this.props;
    const { initData } = this.state;
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
      onAdd:(form)=>{
        const on = {
          onIconClick:()=>{
            const { dispatch } = this.props;
            dispatch({
              type:'bom/fetchUcum',
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
          onOk:(selectedRowKeys,selectedRows)=>{
            if(!selectedRowKeys || !selectedRows){
              return
            }
            console.log("selectedRows",selectedRows)
            const nameList = selectedRows.map(item =>{
              return item.name
            });
            this.setState({
              SelectValue:nameList,
              selectedRowKeys:selectedRowKeys,
            })
          },
          handleTableChange:(obj)=>{
            const { dispatch } = this.props;
            const { Jconditions } = this.state;
            const param = {
              ...obj
            };
            this.setState({
              Jpage:param
            });
            if(Jconditions.length){
              dispatch({
                type:'bom/fetchUcum',
                payload:{
                  conditions:Jconditions,
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
              type:'bom/fetchUcum',
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
                Jconditions:conditions,
              });
              const obj = {
                conditions,
              };
              dispatch({
                type:'bom/fetchUcum',
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
            const { Jpage } = this.state;
            this.setState({
              Jconditions:[]
            });
            dispatch({
              type:'bom/fetchUcum',
              payload:{
                ...Jpage
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
              title: '操作',
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
        return <Form layout="vertical" hideRequiredMark>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label='物料编码'>
                {form.getFieldDecorator('code', {
                  rules: [{ required: true}],
                })(<Input placeholder='请输入物料编码' />)}
              </Form.Item>
            </Col>
            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item label='物料名称'>
                {form.getFieldDecorator('name', {
                  rules: [{ required: true}],
                })(<Input placeholder='请输入物料名称' />)}
              </Form.Item>
            </Col>
            <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
              <Form.Item label='规格'>
                {form.getFieldDecorator('spec', {
                  rules: [{ required: true}],
                })(<Input placeholder='请输入规格' />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label='型号'>
                {form.getFieldDecorator('model', {
                  rules: [{ required: true}],
                })(<Input placeholder='请输入型号' />)}
              </Form.Item>
            </Col>
            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item label='计量单位'>
                {form.getFieldDecorator('ucumId', {
                  rules: [{ required: true }],
                })(<ModelTable
                  data={onData}
                  on={on}
                />)}
              </Form.Item>
            </Col>
            <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
              <Form.Item label='物料简称'>
                {form.getFieldDecorator('materialshortname', {
                  rules: [
                    { required: true }
                  ]
                })(<Input placeholder='请输入物料简称' />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label='物料条码'>
                {form.getFieldDecorator('materialbarcode', {
                  rules: [{ required: true}],
                })(<Input placeholder='请输入物料条码'/>)}
              </Form.Item>
            </Col>
            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item label='物料助记码'>
                {form.getFieldDecorator('materialmnecode', {
                  rules: [{ required: true }],
                })(<Input placeholder='请输入物料助记码' />)}
              </Form.Item>
            </Col>
            <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
              <Form.Item label='图号'>
                {form.getFieldDecorator('graphid', {
                  rules: [
                    { required: true},
                  ],
                })(<Input placeholder='图号' />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={24} md={24} sm={24}>
              <Form.Item label="备注">
                {form.getFieldDecorator('memo',{
                })(<TextArea rows={4}/>)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      },
      onAddOk:(values)=>{
        console.log("values",values)
        const { selectedRowKeys,material_id } = this.state;
        const { code,name,spec,model,materialshortname,materialbarcode,materialmnecode,graphid,memo} = values;
        const { dispatch } = this.props;
        return new Promise((resolve, reject) => {
          dispatch({
            type:'bom/addWuLiao',
            payload:{
              reqData:{
                invclId:material_id,
                code,
                name,
                spec,
                model,
                materialshortname,
                materialbarcode,
                materialmnecode,
                graphid,
                memo,
                ucumId:selectedRowKeys[0]
              }
            },
            callback:(res)=>{
              if(res.errMsg === "成功"){
                dispatch({
                  type:'bom/fetchMata',
                  payload:{
                    pageIndex:0,
                    pageSize:10,
                    id:material_id
                  },
                  callback:(res)=>{
                    this.setState({
                      TableMaterialData:res,
                      TableData:[],
                      SelectValue:'',
                      selectedRowKeys:[],
                      Jpage:{},
                      Jconditions:[]
                    })
                    resolve()
                  }
                })
              }else{
                reject()
              }
            }
          })
        })
      },
      onAddCancel:()=>{
        this.setState({
          TableData:[],
          SelectValue:'',
          selectedRowKeys:[],
          Jpage:{},
          Jconditions:[]
        })
      }
    };
    const datasWork = {
      TreeData:this.state.TreeWorkData, //树的数据
      TableData:this.state.TableWorkData, //表的数据
      SelectValue:this.state.SelectWorkValue, //框选中的集合
      selectedRowKeys:this.state.selectedWorkRowKeys, //右表选中的数据
      placeholder:'请选择供应商',
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
      title:'供应商选择',
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
                    rules: [{ required: true,message:'物料编码'}],
                    initialValue:initData.code?initData.code:''
                  })(<Input placeholder='请输入物料编码' />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label='物料名称'>
                  {getFieldDecorator('name', {
                    rules: [{ required: true,message:'物料名称'}],
                    initialValue:initData.name?initData.name:''
                  })(<Input placeholder='请输入物料名称' />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label='物料分类'>
                  {getFieldDecorator('invclId', {
                    // rules: [{ required: true}],
                    initialValue:initData.invclName?initData.invclName:''
                  })(<Input placeholder='请输入物料分类' disabled/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label='型号'>
                  {getFieldDecorator('model', {
                    // rules: [{ required: true,message:'型号'}],
                    initialValue:initData.model?initData.model:''
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
                    initialValue:initData.materialshortname?initData.materialshortname:''
                  })(<Input placeholder='请输入物料简称' />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label='物料条码'>
                  {getFieldDecorator('materialbarcode', {
                    initialValue:initData.materialbarcode?initData.materialbarcode:''
                  })(<Input placeholder='请输入物料条码'/>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label='物料助记码'>
                  {getFieldDecorator('materialmnecode', {
                    initialValue:initData.materialmnecode?initData.materialmnecode:''
                  })(<Input placeholder='请输入物料助记码' />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label='图号'>
                  {getFieldDecorator('graphid', {
                    initialValue:initData.graphid?initData.graphid:''
                  })(<Input placeholder='图号' />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label='计划价格'>
                  {getFieldDecorator('price', {
                    // rules: [{ required: true}],
                    initialValue:initData.price?initData.price:null
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
                    initialValue:initData.spec?initData.spec:''
                  })(<Input placeholder='请输入规格' />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={24} md={24} sm={24}>
                <Form.Item label="备注">
                  {getFieldDecorator('memo',{
                    initialValue:initData.memo?initData.memo:''
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

export default MatemanageUpdate;
