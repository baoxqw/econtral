import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';

import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Form,
  Input,
  Checkbox,
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
import router from 'umi/router';
import ModelTable from '../../tool/ModelTable/ModelTable';
import { toTree } from '../../tool/ToTree';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../../System/UserAdmin.less';
import moment from 'moment';
const FormItem = Form.Item;
import NormalTable from '@/components/NormalTable';
const { Option } = Select;
const { TextArea } = Input;
const dateFormat = 'YYYY-MM-DD';


@connect(({ PMA, loading }) => ({
  PMA,
  loading: loading.models.PMA,
}))
@Form.create()
class PaymentMaintenance extends PureComponent {
  state ={
    addVisible:false,
    updateVisible:false,
    viewVisible:false,
    updata:{},
    conditions:[]
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type:'PMA/fetch',
      payload:{
        pageIndex:0,
        pageSize:10
      }
    })
  }

  //新建模态框
  handleModalVisible = ()=>{
    router.push("/ecprojectmanagement/paymentmaintenance/add")
  }


  //修改模态框
  updateChange = (e,record)=>{
    e.preventDefault();
    router.push('/ecprojectmanagement/paymentmaintenance/update',{record});
  };

  handleDelete = (record)=>{
    const { id } = record;
    const { dispatch } = this.props;
    dispatch({
      type:'PMA/delete',
      payload:{
        reqData:{
          id
        }
      },
      callback:(res)=>{
        if(res){
          message.success("删除成功",1,()=>{
            dispatch({
              type:'PMA/fetch',
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

  // 查询
  findList = (e)=>{
    e.preventDefault();
    const { dispatch,form } = this.props
    form.validateFieldsAndScroll((err,values)=>{
      const {projectname,operatorname} = values;
      if(projectname || operatorname) {
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
        if (operatorname) {
          nameObj = {
            code: 'operatorname',
            exp: 'like',
            value: operatorname
          };
          conditions.push(nameObj)
        }
        this.setState({
          conditions
        })
        const obj = {
          pageIndex:0,
          pageSize:10,
          conditions,
        };
        dispatch({
          type:'PMA/fetch',
          payload:obj
        })
      }else{
        this.setState({
          conditions:[]
        })
        dispatch({
          type:'PMA/fetch',
          payload:{
            pageIndex:0,
            pageSize:10
          }
        })
      }
    })

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
      type:'PMA/fetch',
      payload:{
        pageIndex:0,
        pageSize:10
      }
    })
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { conditions } = this.state;
    const obj = {
      pageIndex: pagination.current-1,
      pageSize:pagination.pageSize,
    };
    if(conditions.length){
      const obj = {
        pageIndex: pagination.current -1,
        pageSize: pagination.pageSize,
        conditions
      };
      dispatch({
        type:'PMA/fetch',
        payload: obj,
      });
      return
    }
    dispatch({
      type:'PMA/fetch',
      payload:obj
    });
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.findList} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label='项目名称'>
              {getFieldDecorator('projectname')(<Input placeholder='项目名称' />)}
            </FormItem>
          </Col>
          <Col md={8} sm={16}>
            <FormItem label='经办人'>
              {getFieldDecorator('operatorname')(<Input placeholder='经办人' />)}
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
      PMA:{ fetchData }
    } = this.props;
    const { updata } = this.state;
    const columns = [
      {
        title: '项目名称',
        dataIndex: 'projectname',
      },
      {
        title: '回款金额(元)',
        dataIndex: 'paymentamount',
      },
      {
        title: '回款日期',
        dataIndex: 'paymentdate',
      },
      {
        title: '经办人',
        dataIndex: 'operatorname',
      },
      {
        title: '是否确认',
        dataIndex: 'isconfirm',
        render: (text, record) => {
          if(text === 1){
            return <Checkbox checked={true}/>
          }else {
            return <Checkbox checked={false}/>
          }
        }
      },
      {
        title: '备注',
        dataIndex: 'memo',
      },
      {
        title: '操作',
        dataIndex: 'operating',
        fixed:'right',
        render: (text, record) => (
          <Fragment>
            <Popconfirm title={formatMessage({ id: 'validation.confirmdelete' })} onConfirm={() => this.handleDelete(record)}>
              <a href="javascript:;">{formatMessage({ id: 'validation.delete' })}</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a href="#javascript;" onClick={(e)=> this.updateChange(e,record)}>编辑</a>
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
    return (
      <PageHeaderWrapper>
        <Card>
          <div className={styles.userAdmin}>
            <div className={styles.userAdminForm} style={{marginBottom:'0px'}}>{this.renderForm()}</div>
            <div className={styles.userAdminOperator}>
              <Button icon="plus" type="primary" onClick={this.handleModalVisible}>
                新建
              </Button>
            </div>
            <NormalTable
              columns={columns}
              data={fetchData}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default PaymentMaintenance;
