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
const mockData = [];
const handleCorpAdd = () => {
  router.push('/ecprojectmanagement/bosom/add');
};

@connect(({ bosom, loading }) => ({
  bosom,
  loading: loading.models.bosom,
}))
@Form.create()

class Bosom extends PureComponent {
  state = {
    conditions:null,
    visible: false,
    disabled: false,
    create_id:null,  //创建人id
    pageIndex:0,
    show:0,
    attachdata:[],
    visibleModal:false,
    expandForm:false
  };
  filterOption = (inputValue, option) => option.description.indexOf(inputValue) > -1;
  columns = [
    {
      title: '项目里程碑名称',
      dataIndex: 'name',
    },
    {
      title: '项目里程碑编码',
      dataIndex: 'code',
    },
    {
      title: '里程碑类型',
      dataIndex: 'type',
    },
    {
      title:'项目里程碑成果',
      dataIndex: 'milestoneoutcome',

    },
    {
      title:'里程碑占比',
      dataIndex: 'ratio',
    },
    {
      title: formatMessage({ id: 'validation.operation' }),
      dataIndex: 'operation',
      render: (text, record) => (
        <Fragment>
          <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record)}>
            <a href="#javascript:;">删除</a>
          </Popconfirm>
          <Divider type="vertical" />
          {/* <span style={{color:'#123dff',cursor:'pointer'}}>撤回</span>
          <Divider type="vertical" />*/}
          <a href="#javascript:;" onClick={(e)=>this.update(e,record)}>编辑</a>
          {/*<span style={{color:'#1890ff',cursor:'pointer'}} onClick={()=>this.update(record)}>编辑</span>*/}

        </Fragment>
      ),
    },
  ];
  visibleModal = async (record) => {
    await this.setState({
      visibleModal: true,
    });
    const { dispatch} = this.props;
    const str = {
      reqData:{
        bill_id:record.id,
        type:'pm',
      }
    };
    dispatch({
      type: 'fundproject/queryattchment',
      payload: str,
      callback:(res)=>{
        if(res){
          this.setState({
            attachdata:res,
          });
          return
        }
        this.setState({
          attachdata:[],
        });
      }
    })

  };

  //点击删除
  handleDelete = (record)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'bosom/remove',
      payload:{
        reqData:{
          id: record.id
        }
      },
      callback:(res)=>{
        message.success('删除成功',1,()=>{
          dispatch({
            type:'bosom/fetch',
            payload:{
              pageIndex:0,
              pageSize:10
            }
          })
        })

      }
    })
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type:'bosom/fetch',
      payload:{
        pageIndex:0,
        pageSize:10
      }
    })
  }
  //编辑
  update = (e,record)=>{
    e.preventDefault()
    router.push({pathname:'/ecprojectmanagement/bosom/update',record});
  }

  //展开-收起
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };
  //查询
  findList = (e) => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err,values)=>{
      const {projectname,projectcode} = values;
      if(projectname || projectcode ) {
        let conditions = [];
        let codeObj = {};
        let nameObj = {};

        if (projectname) {
          codeObj = {
            code: 'name',
            exp: 'like',
            value: projectname
          };
          conditions.push(codeObj)
        }
        if (projectcode) {
          nameObj = {
            code: 'code',
            exp: 'like',
            value: projectcode
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
          type: 'bosom/fetch',
          payload: obj
        })
      }else{
        this.setState({conditions:[]})
        dispatch({
          type: 'bosom/fetch',
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
    this.setState({conditions:[]})
    //清空后获取列表
    dispatch({
      type: 'bosom/fetch',
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
            <FormItem label='项目里程碑名称'>
              {getFieldDecorator('projectname')(<Input placeholder='项目里程碑名称' />)}
            </FormItem>
          </Col>
          <Col md={8} sm={16}>
            <FormItem label='项目里程碑编码'>
              {getFieldDecorator('projectcode')(<Input placeholder='项目里程碑编码' />)}
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
          </Col>
        </Row>


        <div >
          <Button icon="plus" onClick={handleCorpAdd} type="primary" >
            新建
          </Button>
        </div>
      </Form>

    );
  }

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
        type:'papproval/fetch',
        payload: param,
      });
      return
    }
    dispatch({
      type:'papproval/fetch',
      payload: obj,
    });

  };

  handleM = ()=>{
    this.setState({
      visibleModal:false
    })
  }

  render() {
    const {
      loading,
      bosom:{data}
    } = this.props;

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.userAdmin}>
            <div className={styles.userAdminForm}>{this.renderForm()}</div>
            <div className={styles.userAdminOperator}>

            </div>
            <NormalTable
              loading={loading}
              data={data}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />

          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Bosom;
