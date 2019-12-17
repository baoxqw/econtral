import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import NormalTable from '@/components/NormalTable';
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
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../System/UserAdmin.less';
const FormItem = Form.Item;


@connect(({ NF, loading }) => ({
  NF,
  loading: loading.models.NF,
}))
@Form.create()
class NetFund extends PureComponent {
  state ={
    changeVisible:false,
    deleteVisible:false,
    expandForm:false
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type:'NF/fetch',
      payload:{
        reqData:{
          pageIndex:0,
          pageSize:10
        }
      }
    })
  }

  projectChange = (e,record)=>{
    e.preventDefault()
  }
  //展开-收起
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

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
              {getFieldDecorator('projectname')(<Input placeholder='请输入项目名称' />)}
            </FormItem>
          </Col>
          <Col md={8} sm={16}>
            <FormItem label='年份'>
              {getFieldDecorator('date')(
                <DatePicker />
              )}
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
        {
          expandForm?<Row gutter={{ md: 8, lg: 24, xl: 48 }}>

            <Col md={8} sm={16}>
              <FormItem label='部门名称'>
                {getFieldDecorator('departmentname')(<Input placeholder='请输入部门名称' />)}
              </FormItem>
            </Col>
          </Row>:''
        }
      </Form>
    );
  }

  render() {
    const {
      form:{ getFieldDecorator },
      NF:{ fetchData }
    } = this.props;
    const columns = [

      {
        title: '项目名称',
        dataIndex: 'projectname',
        width:120
      },
      {
        title: '部门名称',
        dataIndex: 'departmentname',
        width:120
      },
      {
        title: '年份',
        dataIndex: 'date',
        width:120
      },
      {
        title: '项目金额(元)',
        dataIndex: 'projectamount',
        width:120
      },
      {
        title: '人工成本(元)',
        dataIndex: 'laborcost',
        width:120
      },
      {
        title: '采购成本(元)',
        dataIndex: 'purchasecost',
        width:120
      },
      {
        title: '管理分摊(元)',
        dataIndex: 'managementallocation',
        width:120
      },
      {
        title: '部门分摊(元)',
        dataIndex: 'departmentalallocation',
        width:120
      },
      {
        title: '税金(元)',
        dataIndex: 'tax',
        width:120
      },
      {
        title: '其他成本(元)',
        dataIndex: 'othercosts',
        width:120
      },
      {
        title: '成本总计(元)',
        dataIndex: 'totalcost',
        width:120
      },
      {
        title: '操作',
        width:120,
        fixed:'right',
        dataIndex: 'operating',
        render: (text, record) => (
          <Fragment>
            <a href="#javascript:;" onClick={(e)=> this.projectChange(e,record)}>导出</a>
          </Fragment>
        ),
      },
    ];
    const data = [
      {
        key: '1',
        numbering: '1',
        node: '测试',
        projectname: '项目',
        projecttype: '类型',
        projectamount:'30000',
        projectbudget:'20000',
        projectprincipal:'张三',
        projectschedule:'50%',
        knottype:'',
        projectstatus:'已立项',
        ischange:'否',
      },
    ];
    return (
      <PageHeaderWrapper>
        <Card>
          <div className={styles.userAdmin}>
            <div className={styles.userAdminForm} style={{marginBottom:'20px'}}>{this.renderForm()}</div>
            <NormalTable
              columns={columns}
              data={fetchData}
              scroll={{ x:columns.length*120}}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default NetFund;
