import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import storage from '@/utils/storage'
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Form,
  Input,
  Checkbox,
  Select,
  Button,
  Card,
  Divider,
  InputNumber,
  Radio,
  Icon,
  Tooltip,
  Modal,
  message,
  Switch,
  Popconfirm,
  Transfer,
} from 'antd';
import NormalTable from '@/components/NormalTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
import styles from '../../System/UserAdmin.less';

const { Option } = Select;

const FormItem = Form.Item;

const handleCorpAdd = () => {
  router.push('/ecprojectmanagement/projectapproval/add');
};

@connect(({ measure, loading }) => ({
  measure,
  loading: loading.models.measure,
}))
@Form.create()

class MeasureMent extends PureComponent {
  state = {
    pageIndex:0,
    addVisible:false,
    updateVisible:false,
    updateSource:{},
    updateSourceCheck:false,
    conditions:[],
  };
  //点击删除
  handleDelete = (record)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'measure/remove',
      payload:{
        reqData:{
          id: record.id
        }
      },
      callback:(res)=>{
        dispatch({
          type:'measure/fetch',
          payload:{
            reqData:{
              pageIndex:0,
              pageSize:10
            }
          }
        })
      }
    })
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type:'measure/fetch',
      payload:{
        pageIndex:0,
        pageSize:10
      }
    })
  }
  //编辑
  update = (record)=>{
    router.push('/ecprojectmanagement/projectapproval/update',{record:record});
  }
  handleCorpAdd = ()=>{
    this.setState({
      addVisible:true,
    })
  }
  handleCancel = ()=>{
    this.setState({
      addVisible:false,
    })
  }
  updatehandleCancel = ()=>{
    this.setState({
      updateVisible:false,
    })
  }
  //展开-收起
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };
  updataRoute = (record)=>{
    console.log('record',record)
    this.setState({
      updateSource:record,
      updateSourceCheck:record.basecodeflag,
      updateVisible:true
    })
  }
  //查询
  findList = (e) => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err,values)=>{
      const {searchcode,searchname} = values;
      if(searchcode || searchname) {
        let conditions = [];
        let codeObj = {};
        let nameObj = {};

        if (searchcode) {
          codeObj = {
            code: 'code',
            exp: 'like',
            value: searchcode
          };
          conditions.push(codeObj)
        }
        if (searchname) {
          nameObj = {
            code: 'name',
            exp: 'like',
            value: searchname
          };
          conditions.push(nameObj)
        }
        this.setState({conditions})
        const obj = {
          pageIndex:0,
          pageSize:10,
          conditions,
        };
        dispatch({
          type: 'measure/fetch',
          payload: obj
        })
      }else{
        this.setState({
          conditions:[]
        })
        dispatch({
          type: 'measure/fetch',
          payload: {
            pageIndex:0,
            pageSize:10
          }
        })
      }
    })
  }
  //分页
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
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
        type:'measure/fetch',
        payload: param,
      });
      return
    }
    this.setState({
      pageIndex:obj.pageIndex
    });
    dispatch({
      type:'measure/fetch',
      payload: obj,
    });
  };
  //新建--提交
  handleOk = e =>{
    e.preventDefault();
    const { form,dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      console.log('values',values)
      if(!values.centercode || !values.centername || !values.dimension || !values.conversionrate){
        return message.error(
          '请填写完整表单'
        )
      }
      const obj = {
        reqData:{
          code:values.centercode,
          name:values.centername,
          dimension:values.dimension,
          conversionrate:values.conversionrate,
          basecodeflag:values.basecodeflag?1:0,
        }
      }
      dispatch({
        type:'measure/add',
        payload:obj,
        callback:(res)=>{
          this.setState({
            addVisible:false
          })
          dispatch({
            type:'measure/fetch',
            payload:{
              pageIndex:0,
              pageSize:10
            }
          })
        }
      })
    })
  }
  //编辑提交
  updatehandleOk = e =>{
    e.preventDefault();
    const { form,dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if(!values.centercode || !values.centername || !values.dimension || !values.conversionrate){
        return message.error(
          '请填写完整表单'
        )
      }
      const obj = {
        reqData:{
          id:this.state.updateSource.id,
          code:values.centercode,
          name:values.centername,
          dimension:values.dimension,
          conversionrate:values.conversionrate,
          basecodeflag:values.isbasecodeflag?1:0,
        }
      }
      dispatch({
        type:'measure/update',
        payload:obj,
        callback:(res)=>{
          this.setState({
            updateVisible:false
          })
          dispatch({
            type:'measure/fetch',
            payload:{
              pageIndex:0,
              pageSize:10
            }
          })
        }
      })
    })
  }
  onChangeBox = (e)=>{
    const checked = e.target.checked;
    if(checked){
      this.setState({
        updateSourceCheck:1
      })
    }else{
      this.setState({
        updateSourceCheck:0
      })
    }

  }
  //取消
  handleFormReset = ()=>{
    const { dispatch,form} = this.props;
    //清空输入框
    form.resetFields();
    this.setState({
      conditions:[]
    })
    //清空后获取列表
    dispatch({
      type: 'measure/fetch',
      payload:{
        pageIndex:0,
        pageSize:10
      }
    })
  }
  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { expandForm } = this.state
    return (
      <Form onSubmit={this.findList} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label='编码'>
              {getFieldDecorator('searchcode')(<Input placeholder='请输入编码' />)}
            </FormItem>
          </Col>
          <Col md={8} sm={16}>
            <FormItem label='名称'>
              {getFieldDecorator('searchname')(<Input placeholder='请输入名称' />)}
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
       {/* {expandForm?<Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label='项目类型'>
              {getFieldDecorator('type')(
                <Select placeholder="请选择项目类型" style={{ width: '100%' }}>
                  <Option value="咨询类">咨询类</Option>
                  <Option value="技术服务类">技术服务类</Option>
                  <Option value="设备类">设备类</Option>
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

  handleM = ()=>{
    this.setState({
      visibleModal:false
    })
  }


   render() {
    const {
      form: { getFieldDecorator },
      loading,
      measure:{data}
    } = this.props;
    const { stepFormValues,updateSource,updateSourceCheck} = this.state;
    const { targetKeys, selectedKeys, disabled } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
    };
    const columns = [
      {
        title: '编码',
        dataIndex: 'code',
        width:120,
      },
      {
        title: '名称',
        dataIndex: 'name',
        width:120,
      },
      {
        title: '所属量纲',
        dataIndex: 'dimension',
        width:120,
      },
      {
        title: '是否基本计量单位',
        width:120,
        dataIndex: 'basecodeflag',
        render:(text,record)=>{
          if(text == 0){
            return <Checkbox/>
          }else if(text == 1){
            return <Checkbox checked='true'/>
          }
        }
      },
      {
        title: '换算率（与量纲基本单位）',
        dataIndex: 'conversionrate',

      },
      {
        title: formatMessage({ id: 'validation.operation' }),
        dataIndex: 'caozuo',
        width:120,
        render: (text, record) => {
          return <Fragment>
            <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record)}>
              <a href="#javascript:;">删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a href="#javascript:;"  onClick={(e)=>this.updataRoute(record)}>编辑</a>
          </Fragment>
        }
      },
    ];
    const add = {
      onOk:(res)=>{
        console.log("res",res)
        let count = 0;
        if(res.length){
          res.map(item =>{
            return item
          })
        }
        const { dispatch } = this.props;
      },
      cancel:()=>{
        const { dispatch } = this.props;
        const { status } = this.state;
      }
    };

    return (
      <PageHeaderWrapper>
        <Card bordered={false} title="计量单位">
          <div className={styles.userAdmin}>
            <div className={styles.userAdminForm}>{this.renderForm()}</div>
            <div className={styles.userAdminOperator}>

            </div>
            <NormalTable
              loading={loading}
              data={data}
              columns={columns}
              onChange={this.handleStandardTableChange}
            />
            {/*<Cadd  data={data.list} onAdd={add}/>*/}
            <Modal
              title="新建"
              visible={this.state.addVisible}
              width={700}
              destroyOnClose
              onCancel={this.handleCancel}
              footer={[
                // 定义右下角 按钮的地方 可根据需要使用 一个或者 2个按钮
                <Button   onClick={this.handleCancel}>
                  取消
                </Button>,
                <Button  type="primary"  onClick={this.handleOk} loading={loading}>
                  确定
                </Button>
              ]}
            >
              <Form layout="inline" >
                <Row style={{width:'300px',display:'inline-block'}}>
                  <Col>
                    <FormItem label='编号'>
                      {getFieldDecorator('centercode',{
                        rules:[{
                          required:true,
                          message:'编号'
                        }]
                      })(<Input placeholder='编号' style={{marginLeft:'28px',width:'189px'}}/>)}
                    </FormItem>
                  </Col>
                </Row>
                <Row style={{width:'300px',display:'inline-block'}}>
                  <Col>
                    <FormItem label='名称'>
                      {getFieldDecorator('centername',{
                        rules: [{
                          required:true,
                          message:'名称'
                        }]
                      })(<Input placeholder='请输入名称' style={{marginLeft:'27px'}}/>)}
                    </FormItem>
                  </Col>
                </Row>
                <Row style={{width:'300px',display:'inline-block',marginTop:'20px'}}>
                  <Col>
                    <FormItem label='换算率'>
                      {getFieldDecorator('conversionrate',{
                        rules: [{
                          required:true,
                          message:'换算率'
                        }]
                      })(<Input placeholder='请输入换算率' style={{marginLeft:'14px'}}/>)}
                    </FormItem>
                  </Col>
                </Row>
                <Row style={{width:'300px',display:'inline-block',marginTop:'20px'}}>
                  <Col>
                    <FormItem label='所属量纲'>
                      {getFieldDecorator('dimension',{
                        rules: [{
                          required:true,
                          message:'所属量纲'
                        }]
                      })(<Input placeholder='请输入所属量纲' style={{width:'200px'}}/>)}
                    </FormItem>
                  </Col>
                </Row>
                <Row style={{width:'50%',marginTop:'20px'}}>
                  <Col>
                    <FormItem label='是否基本计量单位'>
                      {getFieldDecorator('basecodeflag',{
                      })(<Checkbox />)}
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            </Modal>
            <Modal
              title="编辑"
              visible={this.state.updateVisible}
              width={700}
              destroyOnClose
              onCancel={this.updatehandleCancel}
              footer={[
                // 定义右下角 按钮的地方 可根据需要使用 一个或者 2个按钮
                <Button   onClick={this.updatehandleCancel}>
                  取消
                </Button>,
                <Button  type="primary"  onClick={this.updatehandleOk} loading={loading}>
                  确定
                </Button>
              ]}
            >
              <Form layout="inline" >
                <Row style={{width:'300px',display:'inline-block'}}>
                  <Col>
                    <FormItem label='编号'>
                      {getFieldDecorator('centercode',{
                        initialValue:updateSource.code,
                        rules:[{
                          required:true,
                          message:'编号'
                        }]
                      })(<Input placeholder='编号' style={{marginLeft:'28px',width:'189px'}}/>)}
                    </FormItem>
                  </Col>
                </Row>
                <Row style={{width:'300px',display:'inline-block'}}>
                  <Col>
                    <FormItem label='名称'>
                      {getFieldDecorator('centername',{
                        initialValue:updateSource.name,
                        rules: [{
                          required:true,
                          message:'名称'
                        }]
                      })(<Input placeholder='请输入名称' style={{marginLeft:'27px'}}/>)}
                    </FormItem>
                  </Col>
                </Row>
                <Row style={{width:'300px',display:'inline-block',marginTop:'20px'}}>
                  <Col>
                    <FormItem label='换算率'>
                      {getFieldDecorator('conversionrate',{
                        initialValue:updateSource.conversionrate,
                        rules: [{
                          required:true,
                          message:'换算率'
                        }]
                      })(<Input placeholder='请输入换算率' style={{marginLeft:'14px'}}/>)}
                    </FormItem>
                  </Col>
                </Row>
                <Row style={{width:'300px',display:'inline-block',marginTop:'20px'}}>
                  <Col>
                    <FormItem label='所属量纲'>
                      {getFieldDecorator('dimension',{
                        initialValue:updateSource.dimension,
                        rules: [{
                          required:true,
                          message:'所属量纲'
                        }]
                      })(<Input placeholder='请输入所属量纲' style={{width:'200px'}}/>)}
                    </FormItem>
                  </Col>
                </Row>
                <Row style={{width:'50%',marginTop:'20px'}}>
                  <Col>
                    <FormItem label='是否基本计量单位'>
                      {getFieldDecorator('isbasecodeflag',{
                      })(<Checkbox
                        checked={updateSourceCheck == 1?true:false}
                        onChange={this.onChangeBox}
                      />)}
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            </Modal>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default MeasureMent;
