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

@connect(({ review, loading }) => ({
  review,
  loading: loading.models.review,

}))
@Form.create()

class ProjectReview extends PureComponent {
  state = {
    visible: false,
    mockData: [], //左边框数据
    targetKeys: [], //右边框数据
    selectedKeys:[], //存放选中的数据
    disabled: false,
    create_id:null,  //创建人id
    pageIndex:0,
    show:0,
    attachdata:[],
    expandForm:false
  };

  filterOption = (inputValue, option) => option.description.indexOf(inputValue) > -1;

  columns = [
    {
      title: '申请单编号',
      dataIndex: 'id',
    },
    {
      title: '项目名称',
      dataIndex: 'projectname',
    },
    {
      title: '项目类型',
      dataIndex: 'type',
    },
    {
      title: '项目负责人',
      dataIndex: 'projectmanagerName',
    },
    {
      title:'负责部门',
      dataIndex: 'deptName',
    },
    {
      title:'申请单状态',
      dataIndex: 'status',
    },

    {
      title:'审核',
      dataIndex: 'operation',
      render: (text, record) => (
        <Fragment>
          <a href="#javascript;" onClick={()=>this.handleCorpAdd(record)}>审核</a>
        </Fragment>
      ),
    },
    {
      title: '',
      dataIndex: 'caozuo',
    },
  ];


  handleCorpAdd = (record) => {
    this.props.history.push({pathname :"/ecprojectmanagement/projectverify/query",query:record})
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
      type:'review/fetch',
      payload:{
        pageIndex:0,
        pageSize:10,
        reqData:{
          audittype:'PM_PROJECT_H'
        }
      }
    })
  }

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
      const {projectname,status,type} = values;
      if(projectname || status || type) {
        let conditions = [];
        let codeObj = {};
        let nameObj = {};
        let typeObj = {}

        if (projectname) {
          codeObj = {
            code: 'projectname',
            exp: 'like',
            value: projectname
          };
          conditions.push(codeObj)
        }
        if (status) {
          nameObj = {
            code: 'status',
            exp: 'like',
            value: status
          };
          conditions.push(nameObj)
        }
        if (type) {
          typeObj = {
            code: 'type',
            exp: 'like',
            value: type
          };
          conditions.push(typeObj)
        }
        const obj = {
          conditions,
          pageIndex:0,
          pageSize:10,
          reqData:{
            audittype:'PM_PROJECT_H'
          }
        };
        this.setState({conditions})
        dispatch({
          type:'review/fetch',
          payload: obj
        })
      }else{
        this.setState({conditions:[]})
        dispatch({
          type:'review/fetch',
          payload: {
            pageIndex:0,
            pageSize:10,
            reqData:{
              audittype:'PM_PROJECT_H'
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
    this.setState({conditions:[]});
    //清空后获取列表
    dispatch({
      type:'review/fetch',
      payload:{
        pageIndex: 0,
        pageSize: 10,
        reqData:{
          audittype:'PM_PROJECT_H'
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
            <FormItem label='项目名称'>
              {getFieldDecorator('projectname')(<Input placeholder='项目名称' />)}
            </FormItem>
          </Col>
          <Col md={8} sm={16}>
            <FormItem label='申请单状态'>
              {getFieldDecorator('status')(<Input placeholder='申请单状态' />)}
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
        </Row>:''}
      </Form>
    );
  }
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
      reqData:{
        audittype:'PM_PROJECT_H'
      }
    };
    if(conditions){
      const params = {
        ...obj,
        conditions
      }
      dispatch({
        type:'review/fetch',
        payload: params,
      });
      return
    }
    dispatch({
      type:'review/fetch',
      payload: obj,
    });

  };

  render() {
    const {
      loading,
      review:{fetchData}
    } = this.props;
    const { stepFormValues } = this.state;
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

export default ProjectReview;
