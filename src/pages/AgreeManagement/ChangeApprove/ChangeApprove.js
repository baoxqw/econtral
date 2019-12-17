import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import storage from '@/utils/storage'
import { formatMessage, FormattedMessage } from 'umi/locale';
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
const data = [];

// .filter(item => +item.key % 3 > 1)
// .map(item => item.key);
@connect(({ ChangeA, loading }) => ({
  ChangeA,
  loading: loading.models.ChangeA,

}))
@Form.create()

class ChangeApprove extends PureComponent {
  state = {

  };

  filterOption = (inputValue, option) => option.description.indexOf(inputValue) > -1;

  columns = [

    {
      title: '合同名称',
      dataIndex: 'billname',
    },
    {
      title: '合同编号',
      dataIndex: 'billcode',
    },
    {
      title: '合同类型',
      dataIndex: 'type',
    },
    {
      title:'签约日期',
      dataIndex: 'signdate',
    },
    {
      title:'合同状态',
      dataIndex: 'status',
    },

    {
      title:'审核',
      render: (text, record) => (
        <Fragment>
          <a href="#javascript;" onClick={()=>this.handleCorpAdd(record)}>
            审核

          </a>
        </Fragment>
      ),
    },
    {
      title:'',
      dataIndex: 'caozuo',
    },
  ];

  handleCorpAdd = (record) => {
    this.props.history.push({pathname :"/agreemanagement/changeapprove/changeagree",query:record})
  };


  //点击删除
  handleDelete = (record)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'fundproject/remove',
      payload:{
        projectid: record.id
      }
    })
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type:'ChangeA/fetch',
      payload:{
        pageIndex:0,
        pageSize:10,
        reqData:{
          audittype:'PM_CONTRACT_H',
          version:2,
        }
      }
    })


  }

  // handleStandardTableChange = (pagination, filtersArg, sorter) => {
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { conditions} = this.state;

    const obj = {
      pageIndex: pagination.current-1,
      pageSize: pagination.pageSize,
      reqData:{
        audittype:'PM_CONTRACT_H',
        version:2,
      }
    };

    if(conditions){
      const param = {
        ...obj,
        conditions
      };
      dispatch({
        type:'ChangeA/fetch',
        payload: param,
      });
      return
    }
    dispatch({
      type: 'ChangeA/fetch',
      payload: obj,
    });
  };
  //展开收起
  toggleForm = ()=>{
    const { expandForm } = this.state;
    this.setState({expandForm: !expandForm,})
  }
  //查询
  findList = (e) => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err,values)=>{
      const {projectname,type,time} = values;
      if(projectname || type || time) {
        let conditions = [];
        let codeObj = {};
        let timeObj = {};
        let typeObj = {}

        if (projectname) {
          codeObj = {
            code: 'billname',
            exp: 'like',
            value: projectname
          };
          conditions.push(codeObj)
        }
        if (type) {
          typeObj = {
            code: 'type',
            exp: 'like',
            value: type
          };
          conditions.push(typeObj)
        }
        if (time) {
          timeObj = {
            code: 'signdate',
            exp: 'like',
            value: time
          };
          conditions.push(timeObj)
        }
        const obj = {
          pageIndex:0,
          pageSize:10,
          conditions,
        };
        this.setState({conditions})
        dispatch({
          type:'ChangeA/fetch',
          payload: {
            ...obj,
            reqData:{
              audittype:'PM_CONTRACT_H',
              version:2,
            }
          }
        })
      }else{
        this.setState({conditions:[]})
        dispatch({
          type:'ChangeA/fetch',
          payload: {
            pageIndex:0,
            pageSize:10,
            reqData:{
              audittype:'PM_CONTRACT_H',
              version:2,
            }
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
    this.setState({conditions:[]})
    //清空后获取列表
    dispatch({
      type:'ChangeA/fetch',
      payload:{
        pageIndex:0,
        pageSize:10,
        reqData:{
          audittype:'PM_CONTRACT_H',
          version:2,
        }
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
            <FormItem label='合同名称'>
              {getFieldDecorator('projectname')(<Input placeholder='合同名称' />)}
            </FormItem>
          </Col>
          <Col md={8} sm={16}>
            <FormItem label='合同类型'>
              {getFieldDecorator('type')(<Input placeholder='合同类型' />)}
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
            </span>
            {
              expandForm?<a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                收起
                <Icon type="up" />
              </a>:<a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开
                <Icon type="down" />
              </a>
            }
          </Col>

        </Row>
        {expandForm?<Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label='签约日期'>
              {getFieldDecorator('time')(
                <DatePicker style={{ width: '100%' }}/>
              )}
            </FormItem>
          </Col>
        </Row>:''}
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
      loading,
      ChangeA:{fetchData}
    } = this.props;
    const { stepFormValues } = this.state ;
    const parentMethods = {
      handleAdd: this.handleAdd,
    };


    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.userAdmin}>
            <div className={styles.userAdminForm}>{this.renderForm()}</div>
            <div className={styles.userAdminOperator}>
            </div>
            <NormalTable
              loading={loading}
              data={fetchData}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ChangeApprove;
