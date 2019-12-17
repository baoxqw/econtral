import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import storage from '@/utils/storage'
import { formatMessage, FormattedMessage } from 'umi/locale';
import './tableBg.less'
import './style.less'
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
  Tabs,
  Tooltip,
  Modal,
  message,
  Switch,
  Popconfirm,
  Transfer,
} from 'antd';
import NormalTable from '@/components/NormalTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import TreeTable from '../../tool/TreeTable/TreeTable';
import { toTree } from '../../tool/ToTree';
import ModelTable from '../../tool/ModelTable/ModelTable';
import TableModal from '@/pages/EcProjectManagement/ProjectApproval/TableModal';
import NeedModal from '@/pages/EcProjectManagement/ProjectApproval/NeedModal';
import ProCadd from './ProCadd'
import MarkCadd from './MarkCadd'
import router from 'umi/router';
import styles from '../../System/UserAdmin.less';
import Cadd from '../ProjectApproval/NeedModal';
const { Option } = Select;
const { TabPane } = Tabs;
const FormItem = Form.Item;
const mockData = [];
const handleCorpAdd = () => {
  router.push('/ecprojectmanagement/bosom/add');
};

@connect(({ papproval,pau,typem, loading }) => ({
  papproval,
  pau,
  typem,
  loading: loading.models.papproval,
}))
@Form.create()

class TypeMiel extends PureComponent {
  state = {
    projetTopList:[],//项目表头
    proModleVisible:false,//项目表头
    isTopAdd:true,//true:新建，false:编辑
    proTopData:{},
    childPro:{},
    proChildData:[],
    prostatues:true,

    markTopList:[],
    rowMarkId:null,
    markstatues:true,
    markChildData:[],
    isMarkAdd:true,
    markModleVisible:false,
    markTopData:{},

  }
  columns = [
    {
      title: '模板编码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '模板名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '模板类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) => (
        <Fragment>
          <Popconfirm title='确定删除吗?' onConfirm={() => this.deleteProTop(record)}>
            <a href="javascript:;" style={{color:'#ff2340'}}>删除</a>
          </Popconfirm>
          <Divider type="vertical" />
          <a type="primary" onClick={() => this.updateProTop(record)} >
            编辑
          </a>
        </Fragment>
      ),
    },
  ]
  columns2 = [
    {
      title: '模板编码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '模板名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '模板类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) => (
        <Fragment>
          <Popconfirm title='确定删除吗?' onConfirm={() => this.deleteMarkTop(record)}>
            <a href="javascript:;" style={{color:'#ff2340'}}>删除</a>
          </Popconfirm>
          <Divider type="vertical" />
          <a type="primary" onClick={() => this.updateMarkTop(record)} >
            编辑
          </a>
        </Fragment>
      ),
    },
  ]

  componentDidMount() {
    const { dispatch } = this.props;
    //项目表头列表
    let conditions = []
    let nameObj = {
      code:'type',
      exp:'=',
      value:'项目'
    };
    conditions.push(nameObj)
    let aa = {
      conditions,
      pageSize:10000
    }

    dispatch({
      type:'typem/fetchModle',
      payload:aa,
      callback:(res)=>{
       this.setState({projetTopList:res})
      }
    })

   //营销表头
    let conditionsMark = []
    let codeObj = {
      code:'type',
      exp:'=',
      value:'营销'
    };
    conditionsMark.push(codeObj)
    let bb = {
      conditions:conditionsMark,
      pageSize:10000
    }

    dispatch({
      type:'typem/fetchModle',
      payload:bb,
      callback:(res)=>{
        this.setState({markTopList:res})
      }
    })
  }
  //
  addModle = ()=>{
    this.setState({proModleVisible:true})
  }
  proModleAddCancel = ()=>{
    const { form,dispatch} = this.props
    this.setState({proModleVisible:false,isTopAdd:true,proTopData:{}})
    form.resetFields();
  }
  //表头提交
  proModleAdd = (e)=>{
    e.preventDefault();
    const { form,dispatch} = this.props
    form.validateFieldsAndScroll((err, values) => {
      const obj = {
        reqData:{
          id:this.state.isTopAdd?'':this.state.proTopData.id,
          code:values.code,
          name:values.name,
          type:'项目'
        }
      }
      dispatch({
        type:'typem/proAddModleData',
        payload:obj,
        callback:(res)=>{

          this.setState({proTopData:{}})
          if(res.errCode == '0'){
            message.success('成功',1,()=>{
              this.setState({proModleVisible:false,isTopAdd:true})
              form.resetFields();
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
                type:'typem/fetchModle',
                payload:aa,
                callback:(res)=>{
                  this.setState({projetTopList:res})
                }
              })
            })
          }
        }
      })
    })
  }
  //删除表头
  deleteProTop = (record) =>{
    const { dispatch} = this.props
    dispatch({
      type:'typem/deleteProTop',
      payload:{
        reqData:{
          id:record.id
        }
      },
      callback:(res)=>{
       if(res){
         message.success('删除成功',1,()=>{
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
             type:'typem/fetchModle',
             payload:aa,
             callback:(res)=>{
               this.setState({projetTopList:res})
             }
           })
         })
       }
      }
    })
  }
  //编辑表头
  updateProTop = (record)=>{
    this.setState({
      proTopData:record,
      isTopAdd:false,
      proModleVisible:true
    })
  }
  //
  //
  addMarkModle = ()=>{
    this.setState({markModleVisible:true})
  }
  updateMarkTop = (record)=>{
    this.setState({
      markTopData:record,
      isMarkAdd:false,
      markModleVisible:true
    })
  }
  markModleAdd = (e)=>{
    e.preventDefault();
    const { form,dispatch} = this.props
    form.validateFieldsAndScroll((err, values) => {
      const obj = {
        reqData:{
          id:this.state.isMarkAdd?'':this.state.markTopData.id,
          code:values.markcode,
          name:values.markname,
          type:'营销'
        }
      }
      dispatch({
        type:'typem/proAddModleData',
        payload:obj,
        callback:(res)=>{
          this.setState({markTopData:{}})
          if(res.errCode == '0'){
            message.success('成功',1,()=>{
              this.setState({markModleVisible:false,isMarkAdd:true})
              form.resetFields();
              let conditions = []
              let nameObj = {
                code:'type',
                exp:'=',
                value:'营销'
              };
              conditions.push(nameObj)
              let aa = {
                conditions,
              }
              dispatch({
                type:'typem/fetchModle',
                payload:aa,
                callback:(res)=>{
                  this.setState({markTopList:res})
                }
              })
            })
          }
        }
      })
    })
  }
  markModleAddCancel  = ()=>{
    this.setState({markModleVisible:false,markTopData:{},isMarkAdd:true,})
  }
  deleteMarkTop = (record) =>{
    const { dispatch} = this.props
    dispatch({
      type:'typem/deleteProTop',
      payload:{
        reqData:{
          id:record.id
        }
      },
      callback:(res)=>{
        if(res){
          message.success('删除成功',1,()=>{
            let conditions = []
            let nameObj = {
              code:'type',
              exp:'=',
              value:'营销'
            };
            conditions.push(nameObj)
            let aa = {
              conditions,
            }

            dispatch({
              type:'typem/fetchModle',
              payload:aa,
              callback:(res)=>{
                this.setState({markTopList:res})
              }
            })
          })
        }
      }
    })
  }
  //
  setRowClassName = (record) => {
    return record.id === this.state.rowId ? 'clickRowStyl' : '';
  }
  setRowClassNameTwo = (record) => {
    return record.id === this.state.rowMarkId ? 'clickRowStyl' : '';
  }
  render() {
    const {
      form:{getFieldDecorator},
      loading,
      dispatch,
      // papproval:{data}
    } = this.props;
    const { projetTopList,isTopAdd,proTopData,childPro,proChildData,prostatues }= this.state
    const { markTopList,markChildData,isMarkAdd,markTopData,markstatues  }= this.state
    proChildData.forEach((item)=>{
      item.key = item.id
    })
    markChildData.forEach((item)=>{
      item.key = item.id
    })
    const on ={
      onOk:(value)=>{
        let reqDataList = []
        const ee = {
          reqDataList:reqDataList
        }
        value.forEach((item)=>{
          reqDataList.push({templateHId:Number(this.state.rowId),name:item.name,rownum:item.rownum,type:'项目',
            ratio:item.ratio,milestoneoutcome:item.milestoneoutcome,
          })
        })
        dispatch({
          type:'typem/deleteAddModleArray',
          payload:{
            reqData:{
              id:this.state.rowId
            }
          },
          callback:(res)=>{
            if(res.errMsg === '成功'){
               dispatch({
              type:'typem/proAddModleArray',
              payload:ee,
              callback:(res)=>{
                message.success('成功',1,()=>{
                  let conditions = []
                  let codeObj = {
                    code:'TEMPLATE_H_ID',
                    exp:'=',
                    value:this.state.rowId
                  }
                  const objee = {
                    conditions,
                  };
                  conditions.push(codeObj)
                  dispatch({
                    type:'typem/fetchChildModle',
                    payload:objee,
                    callback:(res)=>{
                      this.setState({proChildData:res})
                    }
                  })
                })

          }
        })
            }
          }
        })

      },
      onFocus:()=>{
        return new Promise((resolve, reject) => {
          dispatch({
            type:'pau/fetchPro',
            payload: {
              conditions:[{
                code:'type',
                exp:'=',
                value:'项目'
              }]
            },
            callback:(res)=>{
              resolve(res.resData)
            }
          })
        })

      },
      onCancle:()=>{
        const { dispatch } = this.props;
        let conditions = []
        let codeObj = {
          code:'TEMPLATE_H_ID',
          exp:'=',
          value:this.state.rowId
        }
        const objee = {
          conditions,
        };
        conditions.push(codeObj)
        dispatch({
          type:'typem/fetchChildModle',
          payload:objee,
          callback:(res)=>{
            this.setState({proChildData:res})
          }
        })
      },

      prostatues,
    }
    const onMark ={
      onOk:(value)=>{
        let reqDataList = []
        const ee = {
          reqDataList:reqDataList
        }
        value.forEach((item)=>{
          reqDataList.push({templateHId:Number(this.state.rowMarkId),name:item.name,rownum:item.rownum,type:'营销',
            ratio:item.ratio,milestoneoutcome:item.milestoneoutcome,
          })
        })
        dispatch({
          type:'typem/deleteAddModleArray',
          payload:{
            reqData:{
              id:this.state.rowMarkId
            }
          },
          callback:(res)=> {
            if (res.errMsg === '成功') {
              dispatch({
                type: 'typem/proAddModleArray',
                payload: ee,
                callback: (res) => {
                  message.success('成功', 1, () => {
                    let conditions = []
                    let codeObj = {
                      code: 'TEMPLATE_H_ID',
                      exp: '=',
                      value: this.state.rowMarkId
                    }
                    const objee = {
                      conditions,
                    };
                    conditions.push(codeObj)
                    dispatch({
                      type: 'typem/fetchChildModle',
                      payload: objee,
                      callback: (res) => {
                        this.setState({ markChildData: res })
                      }
                    })
                  })

                }
              })
            }
          }
        })

      },
      onFocus:()=>{
        return new Promise((resolve, reject) => {
          dispatch({
            type:'pau/fetchPro',
            payload: {
              conditions:[{
                code:'type',
                exp:'=',
                value:'营销'
              }]
            },
            callback:(res)=>{
              resolve(res.resData)
            }
          })
        })

      },
      onCancle:()=>{
        const { dispatch } = this.props;
        let conditions = []
        let codeObj = {
          code:'TEMPLATE_H_ID',
          exp:'=',
          value:this.state.rowMarkId
        }
        const objee = {
          conditions,
        };
        conditions.push(codeObj)
        dispatch({
          type:'typem/fetchChildModle',
          payload:objee,
          callback:(res)=>{
            this.setState({markChildData:res})
          }
        })
      },
      markstatues
    }
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Tabs defaultActiveKey="1" >
            <TabPane tab="项目里程碑" key="1">
              <Card>
                <div style={{marginBottom:'15px',display:'flex'}}>
                  <Button icon="plus"  type="primary" onClick={this.addModle} >
                    新建
                  </Button>
                </div>
                <NormalTable
                  pagination={false}
                  loading={loading}
                  dataSource={projetTopList}
                  columns={this.columns}
                  onRow={(record )=>{
                    return {
                      onClick:()=>{
                        this.setState({rowId:record.id,prostatues:false})
                        const { dispatch } = this.props;
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
                          type:'typem/fetchChildModle',
                          payload:objee,
                          callback:(res)=>{
                            this.setState({proChildData:res})
                          }
                        })

                      },
                      rowKey:record.id
                    }
                  }}
                  rowClassName={this.setRowClassName}
                  scroll={{x:this.columns.length*120,y:260}}
                  // onChange={this.handleStandardTableChange2}
                />
                <Divider orientation="left">项目阶段</Divider>
                <div id="maoDian">
                  <ProCadd  data={proChildData}  on={on} loading={loading}/>
                </div>
              </Card>
              {/*  新建表头 */}
              <Modal
                destroyOnClose
                centered
                title={isTopAdd?'新建':'编辑'}
                visible={this.state.proModleVisible}
                onOk={this.proModleAdd}
                onCancel={this.proModleAddCancel}
              >
                <Form onSubmit={(e)=>this.proModleAdd(e)} layout="inline">
                  <Row style={{width:'400px',display:'inline-block',marginBottom:'20px'}}>
                    <Col>
                      <FormItem label='模板编码'>
                        {getFieldDecorator('code',{
                          initialValue:proTopData.code?proTopData.code:'',
                          rules: [{required: true,message:'模板编码'}],
                        })(<Input placeholder='请输入模板编码' style={{width:'300px'}}/>)}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row >
                    <Col>
                      <FormItem label='模板名称'>
                        {getFieldDecorator('name',{
                          initialValue:proTopData.name?proTopData.name:'',
                          rules: [{required: true,message:'模板名称'}],
                        })(<Input placeholder='请输入模板名称' style={{width:'300px'}}/>)}
                      </FormItem>
                    </Col>
                  </Row>
                </Form>
              </Modal>
            </TabPane>
            <TabPane tab="营销里程碑" key="2">
              <Card>
                <div style={{marginBottom:'15px',display:'flex'}}>
                  <Button icon="plus"  type="primary" onClick={this.addMarkModle} >
                    新建
                  </Button>
                </div>
                <NormalTable
                  pagination={false}
                  loading={loading}
                  dataSource={markTopList}
                  columns={this.columns2}
                  onRow={(record )=>{
                    return {
                      onClick:()=>{
                        this.setState({rowMarkId:record.id,markstatues:false})
                        const { dispatch } = this.props;
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
                          type:'typem/fetchChildModle',
                          payload:objee,
                          callback:(res)=>{
                            this.setState({markChildData:res})
                          }
                        })
                      },
                      rowKey:record.id
                    }
                  }}
                  rowClassName={this.setRowClassNameTwo}
                  scroll={{x:this.columns.length*120,y:260}}
                  // onChange={this.handleStandardTableChange2}
                />
                <Divider orientation="left">项目阶段</Divider>
                <div id="maoDian">
                  <MarkCadd  data={markChildData}  onMark={onMark} loading={loading}/>
                </div>
              </Card>
              <Modal
                destroyOnClose
                centered
                title={isMarkAdd?'新建':'编辑'}
                visible={this.state.markModleVisible}
                onOk={this.markModleAdd}
                onCancel={this.markModleAddCancel}
              >
                <Form onSubmit={(e)=>this.markModleAdd(e)} layout="inline">
                  <Row style={{width:'400px',display:'inline-block',marginBottom:'20px'}}>
                    <Col>
                      <FormItem label='模板编码'>
                        {getFieldDecorator('markcode',{
                          initialValue:markTopData.code?markTopData.code:'',
                          rules: [{required: true,message:'模板编码'}],
                        })(<Input placeholder='请输入模板编码' style={{width:'300px'}}/>)}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row >
                    <Col>
                      <FormItem label='模板名称'>
                        {getFieldDecorator('markname',{
                          initialValue:markTopData.name?markTopData.name:'',
                          rules: [{required: true,message:'模板名称'}],
                        })(<Input placeholder='请输入模板名称' style={{width:'300px'}}/>)}
                      </FormItem>
                    </Col>
                  </Row>
                </Form>
              </Modal>
            </TabPane>

          </Tabs>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default TypeMiel;
