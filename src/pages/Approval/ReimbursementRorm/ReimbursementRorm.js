import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  Divider ,
  Button,
  Card,
  Checkbox,
  Icon,
  Upload,
  Tabs,
  Table,
  Modal,
  Select,
  message,
  Popconfirm,
} from 'antd';
import NormalTable from '@/components/NormalTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import RAdd from './ReimbursementRormAdd';
import RUpdate from './ReimbursementRormUpdate';
import ChildAdd from './ReimbursementRormChildAdd'
import ChildUpdate from './ReimbursementRormChildUpdate'
import styles from '../../System/UserAdmin.less';
import './tableBg.less'
import storage from '@/utils/storage';
const { Option } = Select;
const FormItem = Form.Item;
const { TabPane } = Tabs;

@connect(({ RR, loading }) => ({
  RR,
  loading: loading.models.RR,
  uploadLoading:loading.effects['RR/uploadFile'],
  uploadListLoading:loading.effects['RR/uploadFileList'],
}))
@Form.create()
class ReimbursementRorm extends PureComponent {
  state = {
    expandForm:false,
    updateBillCode:'',
    fileList: [],
    billcode:null,
    uploading: false,
    childTable:{},
    superId:null, //主表id
    childId:null,
    childVisible: false,
    childUpdateVisible:false,
    childRecord:{},
    rowId:null,
    page:{},

    pageIndexUpload:0,
    agreeStatus:false,
    refuseStatus:false,
    returnStatus:false,

    rVisible:false,
    uVisible:false,
    uData:{},
    id:null,
    name:'',

    modalUpLoad:false,

    conditions:[],
    findStatus:''
  };

  componentDidMount(){
    const { dispatch } = this.props;
    dispatch({
      type:'RR/fetch',
      payload:{
        pageIndex:0,
        pageSize:10,
      }
    })
  }

  handleUpload = () => {
    const { fileList } = this.state;
    const { dispatch} = this.props;
    const formData = new FormData();
    this.setState({
      uploading: true,
    });
    fileList.forEach(file => {
      formData.append('files[]', file);
      formData.append('bill_id', this.state.superId);
      formData.append('parentpath', 'wfclaimform');
    });
    dispatch({
      type:'RR/uploadFile',
      payload:formData,
      callback:(res)=>{
        console.log('上传附件返回：',res)
        message.success('上传成功',1,()=>{
          this.setState({
            fileList:[],
            uploading: false,
          });
        })
        dispatch({
          type:'RR/uploadFileList',
          payload:{
            pageIndex:0,
            pageSize:10,
            reqData:{
              id:this.state.superId,
              type:'wfclaimform'
            }
          },
          callback:(res)=>{
          }
        })
      }

    })

  }

  sureUpload =()=>{
    console.log('附件',this.state.fileList)
    const { dispatch} = this.props;
    const arrayList = this.state.fileList
    const formData = new FormData();
    if(arrayList.length>0){
      arrayList.forEach((file) => {
        formData.append('files[]', file);
        formData.append('bill_id', this.state.superId);
        formData.append('parentpath', 'wfclaimform');
      })
    }else{
      return
    }
    dispatch({
      type:'RR/uploadFile',
      payload:formData,
      callback:(res)=>{
        console.log('上传附件返回：',res)
        this.setState({fileList:[]})
      }

    })

  }

  handleCorpAdd = () => {
    const userinfo = storage.get("userinfo");
    console.log("userinfo",userinfo)
    let id = null;
    let name = "";
    /*if(userinfo && userinfo.psndoc){
      id = userinfo.psndoc.id;
      name = userinfo.psndoc.name;
      if(!id || !name){
        message.error("关联人不存在，不能新建")
        return
      }
    }else{
      message.error("关联人不存在，不能新建")
    }*/
    this.setState({
      rVisible:true,
      id,
      name
    })
  };

  updataRoute = (e,record) => {
    e.preventDefault()
    this.setState({
      uData:record,
      uVisible:true
    })
  };

  childClick = () =>{
    this.setState({
      childVisible: true,
    })
  };
  //附件删除
  uploadFileDelete =(record)=>{
    console.log('删除',record)
    const { id } = record;
    const { dispatch } = this.props;
    const obj = {
      pageIndex: 0,
      pageSize: 10,
      reqData:{
        id:this.state.superId,
        type:'wfclaimform'
      }
    };
    dispatch({
      type:'RR/uploadDelete',
      payload:{
        reqData:{
          id
        }
      },
      callback:(res)=>{
        if(res){
          message.success("删除成功",1,()=>{
            dispatch({
              type:'RR/uploadFileList',
              payload:obj
            })
          })
        }
      }
    })

  }
  //附件列表分页
  handleStandardTableChangeUpload = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const obj = {
      pageIndex: pagination.current - 1,
      pageSize: pagination.pageSize,
      reqData:{
        id:this.state.superId,
        type:'wfclaimform'
      }
    };
    dispatch({
      type:'RR/uploadFileList',
      payload: obj,
    });
  };
  handleDelete = (record)=>{
    const { id } = record;
    const { dispatch } = this.props;
    dispatch({
      type:'RR/delete',
      payload:{
        reqData:{
          id
        }
      },
      callback:(res)=>{
        if(res){
          message.success("删除成功",1,()=>{
            dispatch({
              type:'RR/fetch',
              payload:{
                reqData:{
                  pageIndex:0,
                  pageSize:10
                }
              }
            })
          })
        }
      }
    })
  }

  //查询
  findList = (e)=>{
    e.preventDefault();
    const { form,dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      const { billcode, status } = values;
      if(billcode || status){
        let conditions = [];
        let billcodeObj = {};
        let statusObj = {};

        if(billcode){
          billcodeObj = {
            code:'billcode',
            exp:'like',
            value:billcode
          };
          conditions.push(billcodeObj)
        }
        if(status){
          statusObj = {
            code:'status',
            exp:'like',
            value:status
          };
          conditions.push(statusObj)
        }
        this.setState({
          conditions
        });
        const obj = {
          pageIndex:0,
          pageSize:10,
          conditions,
        };
         dispatch({
           type:'RR/fetch',
           payload:obj,
         })
      }else{
        this.setState({conditions:[]})
        dispatch({
          type:'RR/fetch',
          payload:{
            pageIndex:0,
            pageSize:10,
          },
        })
      }
    })

  }

  //取消
  handleFormReset = ()=>{
    const { dispatch,form } = this.props;
    //清空输入框
    form.resetFields();
    this.setState({
      conditions:[]
    })
    //清空后获取列表
    dispatch({
      type:'RR/fetch',
      payload:{
        pageIndex:0,
        pageSize:10,
      }
    })
  }

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { expandForm } = this.state
    return (
      <Form onSubmit={(e)=>this.findList(e)} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label='单据号'>
              {getFieldDecorator('billcode')(<Input placeholder='请输入单据号' />)}
            </FormItem>
          </Col>
          <Col md={8} sm={16}>
            <FormItem label='状态'>
              {getFieldDecorator('status')(<Input placeholder='请输入状态' />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
               取消
              </Button>
              {/*{
                expandForm?<a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                  收起
                  <Icon type="up" />
                </a>:<a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                  展开
                  <Icon type="down" />
                </a>
              }*/}
            </span>
          </Col>

        </Row>
        {/*{expandForm? <Row>
          <Col md={8} sm={16}>
            <FormItem label='申请状态'>
              {getFieldDecorator('status')(
                <Select style={{width:128}}>
                  <Option value="0">状态1</Option>
                  <Option value="1">状态2</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>:''}*/}
        <div>
          <Button icon="plus" onClick={this.handleCorpAdd} type="primary" >
            新建
          </Button>
        </div>
      </Form>
    );
  }

  childupdataRoute = (e,record)=>{
    e.preventDefault();
    this.setState({
      childUpdateVisible:true,
      childRecord:record
    })
  }

  childHandleDelete = (record) => {
    const { id } = record;
    const { dispatch } = this.props;
    const { superId } = this.state;
    dispatch({
      type:'RR/deleteChild',
      payload:{
        reqData:{
          id
        }
      },
      callback:(res)=>{
        if(res){
          message.success("删除成功",1,()=>{
            const conditions = [{
              code:'CLAIMFORM_H_ID',
              exp:'=',
              value:superId + ''
            }];
            dispatch({
              type:'RR/findId',
              payload:{
                pageSize:10,
                pageIndex:0,
                conditions
              },
              callback:(res)=>{
                this.setState({
                  childTable:res
                })
              }
            })
          })
        }
      }
    })
  }

  setRowClassName = (record) => {
    return record.id === this.state.rowId ? 'clickRowStyl' : '';
  }

  handleStandardTableChange = (pagination)=>{
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
        type:'RR/fetch',
        payload: param,
      });
      return
    }
    dispatch({
      type:'RR/fetch',
      payload: obj,
    });
  };

  callback = (key) => {
    console.log(key);
  };

  onQueryUpLoad = (e,record)=>{
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch({
      type:'RR/uploadFileList',
      payload:{
        pageIndex:0,
        pageSize:10,
        reqData:{
          id:record.id,
          type:'wfclaimform'
        }
      },
      callback:(res)=>{

      }
    })
    this.setState({
      modalUpLoad:true,
      superId:record.id,
      findStatus:record.status
    })
  };

  handleCancel = ()=>{
    this.setState({
      modalUpLoad:false
    })
  }

  render() {
    const {
      loading,
      RR:{fetchData,uploadData},
      dispatch,
      uploadLoading,
      uploadListLoading
    } = this.props;

    const { uploading, fileList } = this.state;
    const { childTable,superId,agreeStatus,refuseStatus,returnStatus,rVisible,uVisible,uData,submitId } = this.state;

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
        title: '状态',
        dataIndex: 'status',
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
        title: '税率',
        dataIndex: 'taxrate',
      },
      {
        title: '税额',
        dataIndex: 'tax',
      },
      {
        title: '补贴',
        dataIndex: 'subsidy',
      },
      {
        title: '备注',
        dataIndex: 'memo',
      },
      {
        title: formatMessage({ id: 'validation.operation' }),
        dataIndex: 'operation',
        fixed:'right',
        render: (text, record) => (
          <Fragment>
            <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record)}>
              <a href="#javascript:;">删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a href="#javascript:;" onClick={(e)=>this.updataRoute(e,record)}>编辑</a>
            <Divider type="vertical" />
            <a href="#javascript:;" onClick={(e)=>this.onQueryUpLoad(e,record)}>附件</a>
          </Fragment>
        ),
      },
    ];

    const AddData = {
      visible:rVisible,
      submitId,
      id:this.state.id,
      name:this.state.name
    };
    const AddOn = {
      onOk:()=>{
        const { submitId,billcode} = this.state;
        dispatch({
          type:'RR/submit',
          payload:{
            reqData:{
              billcode:billcode+'',
              billid:submitId+'',
              billtype:'WF_CLAIMFORM_H',
              auditors:[{
                id:94,
                name:'a',
              }],
              audittype:'WF_CLAIMFORM_H'
            }
          },
          callback:(res)=>{
            if(res.errMsg === '提交成功'){
              message.success("提交成功",1,()=>{
                this.setState({
                  rVisible:false
                })
                dispatch({
                  type:'RR/fetch',
                  payload:{
                    ...this.state.page
                  }
                })
              })
            }
          }
        })
      },
      onCancel:()=>{
        const { page } = this.state;
        this.setState({
          rVisible:false
        })
      },
      onSave:(res)=>{
        console.log('提交：',res)
        this.setState({
          billcode:res.billcode,
          submitId:res.id
        })
        dispatch({
          type:'RR/add',
          payload: {
            reqData:{
              ...res
            }
          },
          callback:(res)=>{
            if(res.errMsg === '成功'){
              message.success("保存成功",1,()=>{
                this.setState({
                  submitId:res.id
                })
                dispatch({
                  type:'RR/fetch',
                  payload:{
                    ...this.state.page
                  }
                })
              })
            }
          }
        })
      }
    };

    const UpdateData = {
      visible:uVisible,
      record:uData
    };
    const UpdateOn = {
      onOk:(record)=>{
        dispatch({
          type:'RR/submit',
          payload:{
            reqData:{
              billcode:record.billcode+'',
              billid:record.id+'',
              billtype:'WF_CLAIMFORM_H',
              auditors:[{
                id:94,
                name:'a',
              }],
              audittype:'WF_CLAIMFORM_H'
            }
          },
          callback:(res)=>{
            console.log("审批",res)
            if(res.errMsg === '提交成功'){
              message.success("提交成功",1,()=>{
                this.setState({
                  uVisible:false
                })
                dispatch({
                  type:'RR/fetch',
                  payload:{
                    ...this.state.page
                  }
                })
              })
            }
          }
        })
      },
      onCancel:()=>{
        const { page } = this.state;
        this.setState({
          uVisible:false
        })
      },
      onSave:(res)=>{
        dispatch({
          type:'RR/add',
          payload: {
            reqData:{
              ...res
            }
          },
          callback:(res)=>{
            if(res){
              message.success("编辑成功",1,()=>{
                this.setState({
                  uVisible:false
                });
                dispatch({
                  type:'RR/fetch',
                  payload:{
                    ...this.state.page
                  }
                })
              })
            }
          }
        })

      }
    };
    const props = {
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: file => {
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }));
        return false;
      },
      fileList,
    };

    const childColumns = [
      {
        title: '收支项目',
        dataIndex: 'costsubjname',
      },
      {
        title: '报销金额',
        dataIndex: 'claimingamount',
      },
      {
        title: '税率',
        dataIndex: 'taxrate',
      },
      {
        title: '税金',
        dataIndex: 'taxamount',
      },
      {
        title: formatMessage({ id: 'validation.operation' }),
        dataIndex: 'operation',
        render: (text, record) => (
          <Fragment>
            <Popconfirm title="确定删除吗?" onConfirm={() => this.childHandleDelete(record)}>
              <a href="javascript:;">删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a href="javascript:;" onClick={(e)=>this.childupdataRoute(e,record)}>编辑</a>
          </Fragment>
        ),
      },
    ];
    const childUploadColumns = [
      {
        title: '文件名称',
        dataIndex: 'name',
      },
      {
        title: '上传人',
        dataIndex: 'upuser',
      },
      {
        title: '上传时间',
        dataIndex: 'uptime',
      },

      {
        title: formatMessage({ id: 'validation.operation' }),
        dataIndex: 'operation',
        render: (text, record) => (
          <Fragment>
            <Popconfirm title="确定删除吗?" onConfirm={() => this.uploadFileDelete(record)}>
              <a href="javascript:;">删除</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];
    const ChildAddData = {
      visible:this.state.childVisible,
    };

    const onAddChild = {
      onOk:(obj)=>{

        const { superId } = this.state;
        const { dispatch } = this.props;
        if(!superId) return;
        dispatch({
          type:'RR/childadd',
          payload: {
            reqData:{
              claimformHId:superId,
              ...obj
            }
          },
          callback:(res)=>{
            if(res.errMsg === '成功'){
              message.success("创建成功",1,()=>{
                this.setState({
                  childVisible:false
                });
                const conditions = [{
                  code:'CLAIMFORM_H_ID',
                  exp:'=',
                  value:superId + ''
                }];
                dispatch({
                  type:'RR/findId',
                  payload:{
                    pageSize:10,
                    pageIndex:0,
                    conditions
                  },
                  callback:(res)=>{
                    this.setState({
                      childTable:res
                    })
                  }
                })
              })
            }else{
              message.error("创建有问题")
            }
          }
        })
      },
      handleCancel:()=>{
        this.setState({
          childVisible:false
        })
      }
    };

    const ChildUpdateData = {
      visible:this.state.childUpdateVisible,
      record:this.state.childRecord
    };

    const onUpdateChild = {
      onOk:(obj)=>{
        const { superId,childRecord } = this.state;
        const { dispatch } = this.props;
        console.log({
          reqData:{
            id:childRecord.id,
            claimformHId:superId,
            ...obj
          }
        })
        if(!superId) return;
        dispatch({
          type:'RR/childadd',
          payload: {
            reqData:{
              id:childRecord.id,
              claimformHId:superId,
              ...obj
            }
          },
          callback:(res)=>{
            if(res.errMsg === '成功'){
              message.success("编辑成功",1,()=>{
                this.setState({
                  childUpdateVisible:false
                });
                const conditions = [{
                  code:'CLAIMFORM_H_ID',
                  exp:'=',
                  value:superId + ''
                }];
                dispatch({
                  type:'RR/findId',
                  payload:{
                    pageSize:10,
                    pageIndex:0,
                    conditions
                  },
                  callback:(res)=>{
                    this.setState({
                      childTable:res
                    })
                  }
                })
              })
            }else{
              message.error("更新有问题")
            }
          }
        })
      },
      handleCancel:()=>{
        this.setState({
          childUpdateVisible:false
        })
      }
    };

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.userAdmin}>
            <div className={styles.userAdminForm}>{this.renderForm()}</div>
            <NormalTable
              style={{marginTop:'10px'}}
              //scroll={{y: 280 }}
              data={fetchData}
              //pagination={false}
              columns={columns}
              /*onRow={(record )=>{
                return {
                  onClick:()=>{
                    const { dispatch } = this.props;
                    const conditions = [{
                      code:'CLAIMFORM_H_ID',
                      exp:'=',
                      value:record.id+''
                    }];

                    dispatch({
                      type:'RR/findId',
                      payload:{
                        pageSize:10,
                        pageIndex:0,
                        conditions
                      },
                      callback:(res)=>{
                        console.log("res子表",res)
                        this.setState({
                          childTable:res,
                          superId:record.id,
                          rowId: record.id,
                        })
                      }
                    })
                   //  附件列表
                    dispatch({
                      type:'RR/uploadFileList',
                      payload:{
                        reqData:{
                          id:record.id,
                          type:'wfclaimform'
                        }
                      },
                      callback:(res)=>{

                      }
                    })

                  },
                  rowKey:record.id
                }
              }}*/
              onChange={this.handleStandardTableChange}
              //rowClassName={this.setRowClassName}
            />
          </div>
        </Card>

        {/*<Card bordered={false} style={{marginTop:'35px'}} title={"附件"}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="子表管理" key="1">
              <div style={{padding:'12px 0'}}>
                <Button type='primary' icon="plus" disabled={superId?0:1} onClick={this.childClick}>新建</Button>
              </div>
              <NormalTable
                loading={loading}
                data={childTable}
                columns={childColumns}
                onChange={this.handleStandardTableChange}
              />
            </TabPane>
            <TabPane tab="上传管理" key="2">
              <div style={{marginBottom:'15px'}}>
                <Upload {...props}>
                  <Button disabled={superId?0:1}>
                    <Icon type="upload"/>上传附件
                  </Button>
                </Upload>
                <Button
                  type="primary"
                  onClick={this.handleUpload}
                  disabled={fileList.length === 0}
                  loading={uploading}
                  style={{ marginTop: 16 }}
                >
                  {uploading ? '上传中' : '开始上传'}
                </Button>
              </div>
              <NormalTable
                loading={uploadListLoading}
                data={uploadData}
                columns={childUploadColumns}
                onChange={this.handleStandardTableChangeUpload}
              />
            </TabPane>
          </Tabs>
        </Card>*/}

        <Modal
          title={"附件列表"}
          width={"70%"}
          visible={this.state.modalUpLoad}
          onCancel={this.handleCancel}
          footer={[<Button onClick={this.handleCancel}>取消</Button>]}
        >
          <div style={{marginBottom:'15px'}}>
            <Upload {...props}>
              <Button disabled={this.state.findStatus==="初始状态"?0:1}>
                <Icon type="upload"/>上传附件
              </Button>
            </Upload>
            <Button
              type="primary"
              onClick={this.handleUpload}
              disabled={fileList.length === 0}
              loading={uploading}
              style={{ marginTop: 16 }}
            >
              {uploading ? '上传中' : '开始上传'}
            </Button>
          </div>
          <NormalTable
            loading={uploadListLoading}
            data={uploadData}
            columns={childUploadColumns}
            onChange={this.handleStandardTableChangeUpload}
          />
        </Modal>

        <RAdd on={AddOn} data={AddData}/>

        <RUpdate on={UpdateOn} data={UpdateData}/>

        <ChildAdd on={onAddChild} data={ChildAddData}/>

        <ChildUpdate on={onUpdateChild} data={ChildUpdateData}/>

      </PageHeaderWrapper>
    );
  }
}

export default ReimbursementRorm;

