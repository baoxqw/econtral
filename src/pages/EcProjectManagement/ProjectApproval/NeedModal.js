import React, { PureComponent, Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { connect } from 'dva';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  TreeSelect,
  Radio,
  Modal,
  Tree,
  AutoComplete,
  Row,
  Col,
  message,
  Popconfirm,
  Table,
  Tabs,
  Divider
} from 'antd';
import NormalTable from '@/components/NormalTable';
import Cadd from './Cadd'
import './tableBg.less'
import styles from '../../System/UserAdmin.less';
const FormItem = Form.Item;
const { Option } = Select;
@connect(({ pd, papproval,paneed,loading }) => ({
  pd,
  papproval,
  paneed,
  loading:loading.models.paneed,
  topLoading:loading.effects['paneed/toplist'],
  childLoading:loading.effects['paneed/childList'],

}))
@Form.create()

class NeedModal extends PureComponent {
  state = {
    rowId:null,
    rowObj:{},
    caddArray:[], //子表确定时返回的数据
    chlidDataRes:[],  //子表数据
    versionObj:{}, //哪个版本可以变更
    status:true,
    projectId:null,
    isChange:false,  //变更按钮判断
    HeadVisible:false,  //弹出表头框

    isNew:false,  //如果是第一次建
  };

  componentDidMount(){
    const { dispatch,projectId } = this.props;
    console.log("projectId",projectId)
    const conditions = [{
      code:'PROJECT_ID',
      exp:'=',
      value:this.props.projectId+''
    }]
    dispatch({
      type:'paneed/toplist',
      payload:{
        conditions
      }
    })
    //查询最大版本
    dispatch({
      type:'paneed/queryPId',
      payload:{
        reqData:{
          projectid:this.props.projectId
        }
      },
      callback:(res)=>{
        console.log("变更",res)
        if(res.resData && res.resData.length && res.resData[0] !== null){
          this.setState({
            versionObj:res.resData[0]
          })
        }else{
          this.setState({
            isChange:true,
            isNew:true
          })
        }
      }
    })
    this.setState({
      projectId
    })
  }

  addTopOk = ()=>{
    const { form,dispatch } = this.props;
    let { caddArray,projectId } = this.state;
    form.validateFields((err, fieldsValue) => {
      if(err){
        return
      }
      const obj = {
        reqData:{
          projectId,
          mny:fieldsValue.topmny?Number(fieldsValue.topmny):null,
          memo:fieldsValue.topmemo,
        }
      }
      dispatch({
        type:'paneed/topadd',
        payload:obj,
        callback:(response)=>{
          //response 返回表头新建的结果
          caddArray = caddArray.map(item=>{
            delete item.id;
            item.bmrId = response.id;
            return item
          });
          //建表体
          dispatch({
            type:'paneed/childAdds',
            payload:{
              reqDataList:caddArray
            },
            callback:(res)=>{
              message.success("操作成功",1,()=>{
                this.setState({
                  status:true,
                  rowId:response.id, //表头锁定在变更后的那一条
                })
                //查询下表体
                const conditions = [{
                  code:'BMR_ID',
                  exp:'=',
                  value:response.id+''
                }]
                dispatch({
                  type:'paneed/childList',
                  payload:{
                    conditions
                  },
                  callback:(res)=>{
                    this.setState({
                      chlidDataRes:res.resData
                    })
                  }
                })

                //变更后应该再更新下最新可变更的版本
                dispatch({
                  type:'paneed/queryPId',
                  payload:{
                    reqData:{
                      projectid:this.props.projectId
                    }
                  },
                  callback:(res)=>{
                    console.log("最新的版本",res)
                    if(res.resData.length){
                      this.setState({
                        versionObj:res.resData[0]
                      })
                    }
                  }
                })
              })
            }
          });
          //表头建好查询下表头
          const conditions = [{
            code:'PROJECT_ID',
            exp:'=',
            value:projectId+''
          }]
          dispatch({
            type:'paneed/toplist',
            payload:{
              conditions
            }
          })
          this.setState({
            isChange:false
          })
        }
      });
      this.setState({
        HeadVisible:false,
        status:false
      })
    })
  };

  addTopCancel = ()=>{
    this.setState({
      HeadVisible:false,
    })
  }

  setRowClassName = (record) => {
    return record.id === this.state.rowId ? 'clickRowStyl' : '';
  };

  onButtonChange = () =>{
    document.getElementById('maoDian').scrollIntoView();
    this.setState({
      status:false
    })
  };

  handleDeleteTop =(record)=>{
    const { dispatch } = this.props;
    dispatch({
      type:"paneed/topDelete",
      payload:{
        reqData:{
          id:record.id
        }
      },
      callback:(res)=>{
        if(res.errMsg === "成功"){
          message.success('删除成功',1,()=>{
            const conditions = [{
              code:'PROJECT_ID',
              exp:'=',
              value:this.props.projectId+''
            }]
            dispatch({
              type:'paneed/toplist',
              payload:{
                conditions
              },
              callback:(res)=>{
                //查询最大版本
                dispatch({
                  type:'paneed/queryPId',
                  payload:{
                    reqData:{
                      projectid:this.props.projectId
                    }
                  },
                  callback:(res)=>{
                    console.log("变更",res)
                    if(res.resData && res.resData.length && res.resData[0] !== null){
                      this.setState({
                        versionObj:res.resData[0]
                      })
                    }
                  }
                })
              }
            })
            this.setState({
              isChange:false,
              chlidDataRes:[],
              status:true
            })
          })
        }
      }
    })
  }

  render() {
    const {
      form:{getFieldDecorator},
      paneed:{data,childdata},
      loading,
      topLoading,
    } = this.props;
    const { HeadVisible,status} = this.state;

    const columns = [
      {
        title: '清单版本',
        dataIndex: 'version',
      },
      {
        title: '变更所需费用',
        dataIndex: 'mny',
      },
      {
        title: '变更备注',
        dataIndex: 'memo',
      },
      {
        title: formatMessage({ id: 'validation.operation' }),
        dataIndex: 'operation',
        render: (text, record) => (
          <Fragment>
            <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDeleteTop(record)}>
              <a href="#javascript:;">删除</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];

    const on = {
      onOk:(value)=>{
        const { isNew,projectId } = this.state;
        const { dispatch } = this.props;
        console.log("---data----",data)
        console.log("isNew",isNew)
        if(isNew || !data.list.length){
          const obj = {
            reqData:{
              projectId,
              mny:null,
              memo:'',
            }
          }
          dispatch({
            type:'paneed/topadd',
            payload:obj,
            callback:(response)=>{
              //response 返回表头新建的结果
              value = value.map(item=>{
                delete item.id;
                item.bmrId = response.id;
                return item
              });
              //建表体
              dispatch({
                type:'paneed/childAdds',
                payload:{
                  reqDataList:value
                },
                callback:(res)=>{
                  message.success("操作成功",1,()=>{
                    this.setState({
                      status:true,
                      rowId:response.id, //表头锁定在变更后的那一条
                      isNew:false,
                    })
                    //查询下表体
                    const conditions = [{
                      code:'BMR_ID',
                      exp:'=',
                      value:response.id+''
                    }]
                    dispatch({
                      type:'paneed/childList',
                      payload:{
                        conditions
                      },
                      callback:(ress)=>{
                        this.setState({
                          chlidDataRes:ress.resData
                        })
                      }
                    })

                    //变更后应该再更新下最新可变更的版本
                    dispatch({
                      type:'paneed/queryPId',
                      payload:{
                        reqData:{
                          projectid:projectId
                        }
                      },
                      callback:(res)=>{
                        console.log("最新的版本",res)
                        if(res.resData.length){
                          this.setState({
                            versionObj:res.resData[0]
                          })
                        }
                      }
                    })
                  })
                }
              });
              //表头建好查询下表头
              const conditions = [{
                code:'PROJECT_ID',
                exp:'=',
                value:projectId+''
              }]
              dispatch({
                type:'paneed/toplist',
                payload:{
                  conditions
                }
              })
              this.setState({
                isChange:false
              })
            }
          });
        }else{
          this.setState({
            caddArray:value,
            HeadVisible:true
          })
        }
      },
      cancel:()=>{
        const { rowId } = this.state;
        const { dispatch } = this.props;
        const conditions = [{
          code:'BMR_ID',
          exp:'=',
          value:rowId+''
        }]
        dispatch({
          type:'paneed/childList',
          payload:{
            conditions
          },
          callback:(res)=>{
            console.log("res",res)
            if(!res.resData){
              this.setState({
                chlidDataRes:[]
              })
            }else{
              this.setState({
                chlidDataRes:res.resData
              })
            }
          }
        })
        this.setState({
          status:true
        })
      },
      status
    };

    return   (
      <Card>
        <div className={styles.userAdmin}>
          <div style={{margin:'15px 0'}}>
            <Button type="primary" disabled={!this.state.isChange} onClick={this.onButtonChange}>变更</Button>
          </div>
          <NormalTable
            columns={columns}
            loading={topLoading}
            data={data}
            pagination={false}
            onRow={(record )=>{
              return {
                onClick:()=>{
                  console.log("record",record)
                  const { versionObj } = this.state;
                  console.log("versionObj",versionObj)
                  this.setState({
                    rowId: record.id,
                  });
                  if(versionObj.id === record.id){
                    this.setState({
                      isChange:true
                    })
                  }else{
                    this.setState({
                      isChange:false,
                      status:true
                    })
                  }
                  const { dispatch } = this.props;
                  const conditions = [{
                    code:'BMR_ID',
                    exp:'=',
                    value:record.id+''
                  }]
                  dispatch({
                    type:'paneed/childList',
                    payload:{
                      conditions
                    },
                    callback:(res)=>{
                      console.log('点击查询',res)
                      this.setState({
                        chlidDataRes:res.resData
                      })
                    }
                  })
                },
                rowKey:record.id
              }
            }}
            rowClassName={this.setRowClassName}
            scroll={{y:260}}/>
          <Divider orientation="left">清单</Divider>
          <div id="maoDian">
            <Cadd  data={this.state.chlidDataRes}  on={on} loading={loading}/>
          </div>
        </div>
        <Modal
          title="新建"
          visible={HeadVisible}
          destroyOnClose
          onOk={this.addTopOk}
          onCancel={this.addTopCancel}
        >
          <Form  layout="inline" >
            <Row gutter={16} style={{marginBottom:"20px"}}>
              <Col >
                <FormItem label='变更费用'>
                  {getFieldDecorator('topmny',{
                    rules: [{required: true,message:'变更费用'}]
                  })(<Input placeholder='请输入变更费用' type={"Number"} style={{width:'370px'}}/>)}
                </FormItem>
              </Col>
            </Row >
            <Row gutter={16}>
                <Col style={{marginLeft:'8px'}}>
                  <FormItem label='变更备注'>
                    {getFieldDecorator('topmemo',{
                      //rules: [{required: true,message:'变更备注'}]
                    })(<Input placeholder='备注' style={{width:'370px'}}/> )}
                  </FormItem>
                </Col>
            </Row>
          </Form>
        </Modal>
      </Card>
    );
  }
}

export default NeedModal;
