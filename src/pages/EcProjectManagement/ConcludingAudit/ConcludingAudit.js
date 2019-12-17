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
  Steps,
  Divider,
  Icon,
  Table,
  Row,
  Modal,
  Radio,
  Upload,
  Col,
  message,
} from 'antd';
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../../System/UserAdmin.less';
import moment from '../OngoingProject/OngoingProjectICM';
const { Step } = Steps;
const FormItem = Form.Item;
import NormalTable from '@/components/NormalTable';
const { Option } = Select;
const { TextArea } = Input;


const CreateForm = Form.create()(props => {
  const { ax,addVisible,handleModalVisible,form,form:{getFieldDecorator} } = props;
  const { dispatch } = ax;
  const okHandle = () => {
    form.validateFields((err,values)=>{
      const obj = {
        customername:values.customername,
        contact:values.contact,
        phone:values.phone,
        email:values.email,
        address:values.address,
        customertype:values.customertype,
        industry:values.industry,
        memo:values.memo,
      }

      dispatch({
        type:'CM/add',
        payload: {
          reqData:{
            ...obj
          }
        },
        callback:(res)=>{
          if(res){
            message.success("添加成功",1,()=>{
              dispatch({
                type:'CM/fetch',
                payload:{
                  reqData:{
                    pageIndex:0,
                    pageSize:10
                  }
                }
              });
              form.resetFields();
              handleModalVisible(false)
            })
          }
        }
      })
    })
  };


  return (
    <Modal
      title="新建客户信息"
      visible={addVisible}
      onOk={okHandle}
      width='50%'
      onCancel={()=>handleModalVisible(false)}
    >
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={8} sm={16}>
          <FormItem label='客户名称'>
            {getFieldDecorator('customername',{
              rules: [
                {
                  required: true,
                }
              ],
            })(<Input placeholder='请输入客户名称' />)}
          </FormItem>
        </Col>
        <Col md={8} sm={16}>
          <FormItem label='联系人'>
            {getFieldDecorator('contact',{
              rules: [
                {
                  required: true,
                }
              ],
            })(<Input placeholder='请输入联系人' />)}
          </FormItem>
        </Col>
        <Col md={8} sm={16}>
          <FormItem label='电话'>
            {getFieldDecorator('phone',{
              rules: [
                {
                  required: true,
                }
              ],
            })(<Input placeholder='请输入联系人' type='number'/>)}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={8} sm={16}>
          <FormItem label='邮箱'>
            {getFieldDecorator('email',{
              rules: [
                {
                  required: true,
                }
              ],
            })(<Input placeholder='请输入邮箱' />)}
          </FormItem>
        </Col>
        <Col md={16} sm={24}>
          <FormItem label='客户地址'>
            {getFieldDecorator('address',{
              rules: [
                {
                  required: true,
                }
              ],
            })(<Input placeholder='请输入客户地址' />)}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={8} sm={16}>
          <FormItem label='客户类别'>
            {getFieldDecorator('customertype',{
              rules: [
                {
                  required: true,
                }
              ],
            })(<Select style={{width:'100%'}} placeholder="请选择客户类别" >
              <Option value="合资">合资</Option>
              <Option value="独资">独资</Option>
            </Select>)}
          </FormItem>
        </Col>
        <Col md={8} sm={16}>
          <FormItem label='所属行业'>
            {getFieldDecorator('industry',{
              rules: [
                {
                  required: true,
                }
              ],
            })(<Input placeholder='请输入所属行业' />)}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={24} sm={24}>
          <FormItem label='备注'>
            {getFieldDecorator('memo',{
              rules: [
                {
                  required: true,
                }
              ],
            })(<TextArea rows={4} />)}
          </FormItem>
        </Col>
      </Row>
    </Modal>
  );
});
const CreateUpdateForm = Form.create({
  name: 'global_state',
  onFieldsChange(props, changedFields) { //当 Form.Item 子节点的值发生改变时触发，可以把对应的值转存到 Redux store
    props.fields = changedFields
  },
  mapPropsToFields(props) {
    const { fields } = props;
    return {
      customername:Form.createFormField({
        value: fields.customername?fields.customername:'',
      }),
      contact:Form.createFormField({
        value: fields.contact?fields.contact:'',
      }),
      phone:Form.createFormField({
        value: fields.phone?fields.phone:'',
      }),
      email:Form.createFormField({
        value: fields.email? fields.email:'',
      }),
      address:Form.createFormField({
        value: fields.address?fields.address:'',
      }),
      customertype:Form.createFormField({
        value: fields.customertype?fields.customertype:'',
      }),
      industry:Form.createFormField({
        value: fields.industry?fields.industry:'',
      }),
      memo:Form.createFormField({
        value: fields.memo?fields.memo:'',
      }),
    }
  }})(props => {
  const { ax,updateVisible,updateChangeVisible,form,form:{getFieldDecorator},fields ,resultLoading,subrefuseLoading} = props;
  const { dispatch } = ax;
  const eee = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 上传成功`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败.`);
      }
    },
  };
  const okHandle = () => {
    const { id } = fields;
    form.validateFields((err,values)=>{
      form.resetFields();
      updateChangeVisible(false);
    })
  };
  const agree = ()=>{
    form.validateFields((err,values)=>{
      const userDefineStrGroup = [fields.taskId,values.opinion]
      const obj = {
        userDefineStrGroup
      }
      dispatch({
        type: 'CA/result',
        payload:obj,
        callback:(res)=>{
          form.resetFields();
          updateChangeVisible(false);
          dispatch({
            type:'CA/fetch',
            payload:{
              reqData:{
                pageIndex:0,
                pageSize:10
              }
            }
          })
        },
      });
    })
  }
  const refuse = ()=>{
    form.validateFields((err,values)=>{
      const userDefineStrGroup = [fields.taskId,values.opinion]
      const obj = {
        userDefineStrGroup
      }
      dispatch({
        type: 'CA/subrefuse',
        payload:obj,
        callback:(res)=>{
          form.resetFields();
          updateChangeVisible(false);
          dispatch({
            type:'CA/fetch',
            payload:{
              reqData:{
                pageIndex:0,
                pageSize:10
              }
            }
          })
        },
      });
    })
  }
  const goback = ()=>{

  }
  return (
    <Modal
      title="项目结项审核"
      visible={updateVisible}
      width={800}
      onCancel={()=>updateChangeVisible(false)}
      footer={[
        // 定义右下角 按钮的地方 可根据需要使用 一个或者 2个按钮
        <Button type="primary" onClick={agree} loading={resultLoading}>
          同意
        </Button>,
        <Button style={{backgroundColor:'red',color:'#fff'}} onClick={refuse} loading={subrefuseLoading}>
          拒绝
        </Button>,
        <Button  type="primary"  onClick={goback}>
          退回发起人
        </Button>,
        <Button  onClick={()=>updateChangeVisible(false)}>
          取消
        </Button>,
      ]}
    >
      <Form  layout="inline" style={{display:'flex',justifyContent:'center'}}>
        <Row>
          <Col style={{margin:'10px 0'}}>
            <FormItem label='项目名称'>
              {form.getFieldDecorator('projectname',{
                initialValue:fields.projectname,
              })(<Input placeholder='项目名称' style={{marginLeft:'20px',display:'inline-block'}} disabled/>)}
            </FormItem>
            <FormItem label='项目类型' style={{marginLeft:'43px',display:'inline-block'}}>
              {form.getFieldDecorator('type',{
                initialValue:fields.projecttype
              })(
                <Input placeholder='项目类型' style={{marginLeft:'28px',display:'inline-block'}} disabled/>
              )}
            </FormItem>
          </Col>
          <Col style={{display:'flex',alignItems:'center',}}>
            <Col>
              <FormItem label='项目负责人'>
                {form.getFieldDecorator('projectname',{
                  initialValue:fields.projectmanagername,
                })(<Input placeholder='项目负责人' style={{marginLeft:'5px',width:'194px',display:'inline-block'}} disabled/>)}
              </FormItem>
              <FormItem label='项目负责部门' style={{marginLeft:'20px'}}>
                {form.getFieldDecorator('projectname',{
                  initialValue:fields.deptname,
                })(<Input placeholder='项目负责部门' style={{marginLeft:'5px',width:'200px',display:'inline-block'}} disabled/>)}
              </FormItem>
            </Col>
          </Col>
          <Col style={{display:'flex',alignItems:'center',margin:'10px 0'}}>
            <Col>
              <FormItem label='审核状态'>
                {form.getFieldDecorator('projectname',{
                  initialValue:fields.status,
                })(<Input placeholder='审核状态' style={{marginLeft:'20px',width:'194px',display:'inline-block'}} disabled/>)}
              </FormItem>
              <FormItem label='结项类型' style={{marginLeft:'23px',display:'inline-block'}}>
                {form.getFieldDecorator('projectname',{
                  initialValue:fields.closeouttype === 0 ?'正常':'不正常',
                })(<Input placeholder='结项类型' style={{marginLeft:'28px',display:'inline-block'}} disabled/>)}
              </FormItem>
            </Col>
          </Col>
          <Col style={{display:'flex',alignItems:'center'}}>
            <Col>
              <FormItem label='部门领导'>
                {form.getFieldDecorator('projectname',{
                  initialValue:fields.leader,
                })(<Input placeholder='部门领导' style={{marginLeft:'20px',display:'inline-block'}} disabled/>)}
              </FormItem>
              <FormItem label='审核时间' style={{marginLeft:'44px'}}>
                {form.getFieldDecorator('projectname',{
                  initialValue:fields.closeoutdate,
                })(<Input placeholder='审核时间' style={{marginLeft:'28px',display:'inline-block'}} disabled/>)}
              </FormItem>
            </Col>
          </Col>
          <Col style={{display:'flex',alignItems:'center',marginTop:'10px'}}>
           <Col>
              <FormItem label='结项专项报告'>
                {form.getFieldDecorator('evidence',{
                    initialValue:fields.attachmentList?fields.attachmentList.length>0?fields.attachmentList[0].name:'暂无附件':'暂无附件',
                })(<Input placeholder='审核时间' style={{marginLeft:'51px',width:'315px',display:'inline-block'}} disabled/>)}
              </FormItem>
             <a target='_blank' style={{marginLeft:'33px',marginTop:'2px'}}  href={`https://www.leapingtech.net/nien-0.0.1-SNAPSHOT${fields.attachmentList?fields.attachmentList.length>0?fields.attachmentList[0].path:'':''}/${fields.attachmentList?fields.attachmentList.length>0?fields.attachmentList[0].name:'':''}`} download>
               <Button type='primary' icon='cloud-download'>
                 下载附件
               </Button>
             </a>
            </Col>
          </Col>
          <Col style={{margin:'15px 0'}}>
            <FormItem label='部门领导审核意见'>
              {
                form.getFieldDecorator('memo',{
                  initialValue:fields.memo
                })(
                  <TextArea style={{marginLeft:'22px',width:'475px',display:'inline-block'}} disabled></TextArea>
                )
              }
            </FormItem>
          </Col>
          <Col >
            <FormItem label='营销服务部审核意见'>
              {
                form.getFieldDecorator('opinion',{
                })(
                  <TextArea style={{marginLeft:'10px',width:'475px',display:'inline-block'}}></TextArea>
                )
              }
            </FormItem>
          </Col>


        </Row>
      </Form>
    </Modal>
  );
});

const ViewForm = Form.create({
  name: 'global_state',
  onFieldsChange(props, changedFields) { //当 Form.Item 子节点的值发生改变时触发，可以把对应的值转存到 Redux store
    props.fields = changedFields
  },
  mapPropsToFields(props) {
    const { fields } = props;
    return {
      customername:Form.createFormField({
        value: fields.customername?fields.customername:'',
      }),
      contact:Form.createFormField({
        value: fields.contact?fields.contact:'',
      }),
      phone:Form.createFormField({
        value: fields.phone?fields.phone:'',
      }),
      email:Form.createFormField({
        value: fields.email? fields.email:'',
      }),
      address:Form.createFormField({
        value: fields.address?fields.address:'',
      }),
      customertype:Form.createFormField({
        value: fields.customertype?fields.customertype:'',
      }),
      industry:Form.createFormField({
        value: fields.industry?fields.industry:'',
      }),
      memo:Form.createFormField({
        value: fields.memo?fields.memo:'',
      }),
    }
  }})(props => {
  const { viewVisible,viewHandleVisible,form:{getFieldDecorator} } = props;
  return (
    <Modal
      title="查看客户信息"
      visible={viewVisible}
      width='50%'
      onCancel={()=>viewHandleVisible(false)}
      footer={null}
    >
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={8} sm={16}>
          <FormItem label='客户名称'>
            {getFieldDecorator('customername',{
              rules: [
                {
                  required: true,
                }
              ]
            })(<Input placeholder='请输入客户名称' disabled/>)}
          </FormItem>
        </Col>
        <Col md={8} sm={16}>
          <FormItem label='联系人'>
            {getFieldDecorator('contact',{
              rules: [
                {
                  required: true,
                }
              ]
            })(<Input placeholder='请输入联系人' disabled/>)}
          </FormItem>
        </Col>
        <Col md={8} sm={16}>
          <FormItem label='电话'>
            {getFieldDecorator('phone',{
              rules: [
                {
                  required: true,
                }
              ]
            })(<Input placeholder='请输入联系人' type='number'disabled/>)}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={8} sm={16}>
          <FormItem label='邮箱'>
            {getFieldDecorator('email',{
              rules: [
                {
                  required: true,
                }
              ]
            })(<Input placeholder='请输入邮箱' disabled/>)}
          </FormItem>
        </Col>
        <Col md={16} sm={24}>
          <FormItem label='客户地址'>
            {getFieldDecorator('address',{
              rules: [
                {
                  required: true,
                }
              ]
            })(<Input placeholder='请输入客户地址' disabled/>)}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={8} sm={16}>
          <FormItem label='客户类别'>
            {getFieldDecorator('customertype',{
              rules: [
                {
                  required: true,
                }
              ]
            })(<Select placeholder="请选择客户类别" disabled>
              <Option value="合资">合资</Option>
              <Option value="独资">独资</Option>
            </Select>)}
          </FormItem>
        </Col>
        <Col md={8} sm={16}>
          <FormItem label='所属行业'>
            {getFieldDecorator('industry',{
              rules: [
                {
                  required: true,
                }
              ]
            })(<Input placeholder='请输入所属行业' disabled/>)}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={24} sm={24}>
          <FormItem label='备注'>
            {getFieldDecorator('memo',{
              rules: [
                {
                  required: true,
                }
              ]
            })(<TextArea rows={4} disabled/>)}
          </FormItem>
        </Col>
      </Row>
    </Modal>
  );
});

@connect(({ CA, loading }) => ({
  CA,
  loading: loading.models.CA,
  resultLoading: loading.effects['CA/result'],
  subrefuseLoading: loading.effects['CA/subrefuse'],
  checkstatusLoading: loading.effects['CA/checkstatus'],
}))
@Form.create()
class ConcludingAudit extends PureComponent {
  state ={
    statusVisible:false,
    addVisible:false,
    updateVisible:false,
    viewVisible:false,
    updata:{},
    checkSource:'',
    view:{},
    person:'',
    process:[],
    current:0,
    conditions:[],
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type:'CA/fetch',
      payload:{
        pageIndex:0,
        pageSize:10
      }
    })
  }

  //新建模态框
  handleModalVisible = (bool)=>{
    this.setState({
      addVisible:bool
    })
  }

  //修改模态框
  updateChange = (e,record)=>{
    e.preventDefault();
    this.setState({
      updateVisible:true,
      updata:record
    })
  }
  updateCheck =(e,record)=>{
    const { dispatch } = this.props;
    e.preventDefault();
    this.setState({
      statusVisible:true,
    })
    dispatch({
      type:'CA/checkstatus',
      payload:{
        userDefineStr1:record.processInstanceId
      },
      callback:(res)=>{
        if(res.resData && res.resData.length){
          let current = 0; //第几步
          let person = ''; //发起人
          let process = []; //流程
          res.resData.map((item) =>{
            for(let k in item){
              if(k === "AUDITOR_IDX"){
                current = item[k] + 1;
              }
              if(k === 'AUDIT_BILL'){
                person = JSON.parse(item[k]).username;
              }
              if(k === 'AUDITOR_LIST'){
                process = JSON.parse(item[k]); //流程
              }
            }
          });
          this.setState({
            current,
            person,
            process
          })
        }
        this.setState({
          detailsVisible:true
        })
      }
    })
  }
  updateChangeVisible = (bool)=>{
    this.setState({
      updateVisible:bool
    })
  }
//查看模态框
  viewChange = (e,record)=>{
    e.preventDefault();
    this.setState({
      viewVisible:true,
      view:record
    })
  }
  viewHandleVisible = (bool) =>{
    this.setState({
      viewVisible:bool
    })
  }
  //删除
  handleDelete = (record)=>{
    const { id } = record;
    const { dispatch } = this.props;
    dispatch({
      type:'CM/delete',
      payload:{
        reqData:{
          id
        }
      },
      callback:(res)=>{
        if(res){
          message.success("删除成功",1,()=>{
            dispatch({
              type:'CM/fetch',
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
  statusOk = ()=>{
    this.setState({
      statusVisible:false
    })
  }
  //查询
  findList = (e) => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err,values)=>{
      const {projectname,type} = values;
      if(projectname || type) {
        let conditions = [];
        let codeObj = {};
        let nameObj = {};

        if (projectname) {
          codeObj = {
            code: 'projectname',
            exp: 'like',
            value: projectname
          };
          conditions.push(codeObj)
        }
        if (type) {
          nameObj = {
            code: 'projecttype',
            exp: 'like',
            value: type
          };
          conditions.push(nameObj)
        }
        const obj = {
          pageIndex:0,
          pageSize:10,
          conditions,
        };
        this.setState({conditions})
        dispatch({
          type:'CA/fetch',
          payload:obj
        })
      }else{
        this.setState({conditions:[]})
        dispatch({
          type:'CA/fetch',
          payload:{
            pageIndex:0,
            pageSize:10,
          }
        })
      }
    })
  }
  //取消
  ListReset = ()=>{
    const { dispatch,form} = this.props;
    //清空输入框
    form.resetFields();
    this.setState({conditions:[]})
    //清空后获取列表
    dispatch({
      type:'CA/fetch',
      payload:{
        pageIndex:0,
        pageSize:10
      }
    })
  }
  //分页
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
        type:'CA/fetch',
        payload: param,
      });
      return
    }
    dispatch({
      type:'CA/fetch',
      payload: obj,
    });
  };
  statusCancel = ()=>{
    this.setState({
      statusVisible:false
    })
  }
  renderForm() {
    const {
      form: { getFieldDecorator },

    } = this.props;
    return (
      <Form onSubmit={this.findList} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label='项目名称'>
              {getFieldDecorator('projectname')(<Input placeholder='请输入项目名称' />)}
            </FormItem>
          </Col>
          <Col md={8} sm={16}>
            <FormItem label='项目类型'>
              {getFieldDecorator('type')(<Input placeholder='请输入项目类型' />)}
            </FormItem>
          </Col>
          <Col md={8} sm={16}>
            <span>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.ListReset}>
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
      form:{getFieldDecorator},
      CA:{ fetchData },
      loading,
      resultLoading,
      subrefuseLoading,
      checkstatusLoading,
    } = this.props;
    const { updata,view } = this.state;
    const columns = [
      {
        title: '项目名称',
        dataIndex: 'projectname',
      },
      {
        title: '项目类型',
        dataIndex:'projecttype',
      },
      {
        title: '项目负责人',
        dataIndex: 'projectmanagername',
      },
      {
        title: '负责部门',
        dataIndex: 'deptname',
      },
      {
        title: '完成时间',
        dataIndex: 'closeoutdate',
      },
      {
        title: '结项类型',
        dataIndex: 'closeouttype',
        render:(text,record)=>{
          if(text === 0){
            return '正常'
          }else{
            return '不正常'
          }
        }
      },
      {
        title: '审核状态',
        dataIndex: 'status',
      },
      {
        title: '操作',
        fixed:'right',
        dataIndex: 'operating',
        render: (text, record) => (
          <Fragment>
            <a href="#javascript;" onClick={(e)=> this.updateChange(e,record)}>审核</a>
            <Divider type="vertical" />
            <a href="#javascript;" onClick={(e)=> this.updateCheck(e,record)}>查看状态</a>
            {/* <Popconfirm title={formatMessage({ id: 'validation.confirmdelete' })} onConfirm={() => this.handleDelete(record)}>
              <a href="javascript:;">删除</a>
            </Popconfirm>*/}

          </Fragment>
        ),
      },

    ];

    const createProps = {
      ax:this.props,
      addVisible:this.state.addVisible,
      handleModalVisible:this.handleModalVisible,
    };

    const updateProps = {
      ax:this.props,
      updateVisible:this.state.updateVisible,
      updateChangeVisible:this.updateChangeVisible,
    };

    const viewProps = {
      viewVisible:this.state.viewVisible,
      viewHandleVisible:this.viewHandleVisible,
    };

    return (
      <PageHeaderWrapper>
        <Card>
          <div className={styles.userAdmin}>
            <div className={styles.userAdminForm} style={{marginBottom:'0px'}}>{this.renderForm()}</div>
            {/*<div className={styles.userAdminOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
            </div>*/}
            <NormalTable
              columns={columns}
              data={fetchData}
              loading={loading}
              onChange={this.handleStandardTableChange}/>
          </div>
        </Card>
        {/* 审核弹出框 */}
        <CreateUpdateForm {...updateProps} fields={updata} resultLoading={resultLoading} subrefuseLoading={subrefuseLoading}/>
        {/* 查看状态弹出框 */}
        <Modal
          title="查看当前状态"
          centered
          visible={this.state.statusVisible}
          onCancel={this.statusCancel}
          width={700}
          loading={checkstatusLoading}
          footer={[
            // 定义右下角 按钮的地方 可根据需要使用 一个或者 2个按钮
            <Button  onClick={()=>this.statusOk()} >
              确定
            </Button>,

          ]}
        >
          <Steps current={this.state.current}>
            <Step title={this.state.person} />
            {
              this.state.process?this.state.process.map((item,index)=>{
                return <Step key= {index} title={item.name} />
              }):''
            }
            <Step title="完成" />
          </Steps>
        </Modal>

{/*
        <CreateForm {...createProps}/>



        <ViewForm {...viewProps} fields={view}/>*/}
      </PageHeaderWrapper>
    );
  }
}

export default ConcludingAudit;
