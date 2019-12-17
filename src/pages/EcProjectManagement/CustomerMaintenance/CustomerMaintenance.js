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
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../../System/UserAdmin.less';
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
  const { ax,updateVisible,updateChangeVisible,form,form:{getFieldDecorator},fields } = props;
  const { dispatch } = ax;
  const okHandle = () => {
    const { id } = fields;
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
        type:'CM/update',
        payload: {
          reqData:{
            id,
            ...obj
          }
        },
        callback:(res)=>{
          if(res){
            message.success("修改成功",1,()=>{
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
              updateChangeVisible(false);
            })
          }
        }
      })
    })
  };
  return (
    <Modal
      title="修改客户信息"
      visible={updateVisible}
      onOk={okHandle}
      width='50%'
      onCancel={()=>updateChangeVisible(false)}
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
              ]
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
              ]
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
              ]
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
              ]
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
              ]
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
              ]
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
              ]
            })(<TextArea rows={4} />)}
          </FormItem>
        </Col>
      </Row>
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

@connect(({ CM, loading }) => ({
  CM,
  loading: loading.models.CM,
}))
@Form.create()
class FindProject extends PureComponent {
  state ={
    addVisible:false,
    updateVisible:false,
    viewVisible:false,
    updata:{},
    view:{},
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type:'CM/fetch',
      payload:{
        reqData:{
          pageIndex:0,
          pageSize:10
        }
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


  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.findList} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label='客户名称'>
              {getFieldDecorator('projectname')(<Input placeholder='项目名称' />)}
            </FormItem>
          </Col>
          <Col md={8} sm={16}>
            <FormItem label='客户编码'>
              {getFieldDecorator('projectcode')(<Input placeholder='客户编码' />)}
            </FormItem>
          </Col>
          <Col md={8} sm={16}>
            <span>
              <Button type="primary" htmlType="submit">
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
      form:{getFieldDecorator},
      CM:{fetchData}
    } = this.props;
    const { updata,view } = this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
      },
      {
        title: '客户编号',
        dataIndex: 'customernumber',
      },
      {
        title: '客户名称',
        dataIndex: 'customername',
      },
      {
        title: '客户简称',
        dataIndex: 'abbreviation',
      },
      {
        title: '联系人',
        dataIndex: 'contact',
      },
      {
        title: '电话',
        dataIndex: 'phone',
      },
      {
        title: '客户类别',
        dataIndex: 'customertype',
      },
      {
        title: '所属行业',
        dataIndex: 'industry',
      },
      {
        title: '操作',
        dataIndex: 'operating',
        fixed:'right',
        render: (text, record) => (
          <Fragment>
            <a href="#javascript;" onClick={(e)=> this.updateChange(e,record)}>修改</a>
            <Divider type="vertical" />
            <Popconfirm title={formatMessage({ id: 'validation.confirmdelete' })} onConfirm={() => this.handleDelete(record)}>
              <a href="javascript:;">{formatMessage({ id: 'validation.delete' })}</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a href="#javascript;" onClick={(e)=> this.viewChange(e,record)}>查看</a>
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
            <div className={styles.userAdminOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
            </div>
            <NormalTable  columns={columns} data={fetchData} />
          </div>
        </Card>

        <CreateForm {...createProps}/>

        <CreateUpdateForm {...updateProps} fields={updata}/>

        <ViewForm {...viewProps} fields={view}/>
      </PageHeaderWrapper>
    );
  }
}

export default FindProject;
