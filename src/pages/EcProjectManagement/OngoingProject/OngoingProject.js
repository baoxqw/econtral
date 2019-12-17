import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
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
  Transfer,
  AutoComplete
} from 'antd';
import NormalTable from '@/components/NormalTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
import styles from '../../System/UserAdmin.less';
import storage from '@/utils/storage'
const FormItem = Form.Item;
const { Option } = Select;
@connect(({ fundproject, loading }) => ({
  fundproject,
  loading: loading.models.fundproject
}))
@Form.create()
class OngoingProjects extends PureComponent {
  state = {
    conditions:[],
    pageIndex:0,
    expandForm: false,
    visibleModal:false,
    attachdata:[],
    dataList:[]
  };
  columns = [
    {
      title: formatMessage({ id: 'validation.projectassign.projectname' }),
      dataIndex: 'project_name',
    },
    {
      title: formatMessage({ id: 'validation.investment.manager' }),
      dataIndex: 'pm_NAME',
      sorter: true,
    },
    {
      title: 'tag',
      dataIndex: 'tag',
    },
    {
      title: 'Lead partner',
      dataIndex: 'province',
    },
    {
      title: formatMessage({ id: 'validation.state' }),
      dataIndex: 'project_status',
      sorter: true,
      render:(project_status)=>{
        if(project_status === 'INITIAL'){
          return '初始状态'
        }else if(project_status === 'FILL'){
          return '完善项目信息'
        }else if(project_status === 'ICM'){
          return '投决会'
        }else if(project_status === 'ID'){
          return '项目决策'
        }else if(project_status === 'CIP'){
          return '确定投资计划'
        }else if(project_status === 'POST'){
          return '投后管理'
        }
      }
    },
    /*{
      title: formatMessage({ id: 'validation.attachment' }),
      //dataIndex: 'attachmentList',
      render:(record)=>{
        return <span onClick={()=> this.visibleModal(record)} style={{color:'#52c41a',cursor:'pointer'}}>
          查看附件
        </span>
      }
    },*/
    {
      title: formatMessage({ id: 'validation.operation' }),
      render: (text, record) => (
        <Fragment>
          <Button onClick={() => this.handleOngoingInfoView(record)} type="primary">
            {formatMessage({ id: 'validation.detail' })}
          </Button>
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
        bill_id:record.project_id,
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

  handleM = ()=>{
    this.setState({
      visibleModal:false
    })
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const user = storage.get("userinfo");
    const corp_id = user.corp.id;
    let obj={
      // user_id:8,
      id:corp_id,
      pageIndex:0,
      pageSize:10
    }
    dispatch({
      type: 'fundproject/fetchongoing',
      payload:obj,
    });
  }

  handleOngoingInfoView = (record) => {
    this.props.history.push("/projectmanagement/ongoingproject/checklist", {
      query: record
    });
    // router.push('/projectmanagement/ongoingproject/checklist');
  };
//分页
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const { conditions } = this.state;
    console.log('conditions',conditions)
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    const user = storage.get("userinfo");
    const corp_id = user.corp.id;
    const obj = {
      id:corp_id,
      pageIndex: pagination.current-1,
      pageSize: pagination.pageSize,
    };
    this.setState({
      pageIndex:obj.pageIndex
    })
    if(conditions.length){
      console.log('---')
      const obj = {
        id:corp_id,
        pageIndex: pagination.current-1,
        pageSize: pagination.pageSize,
        conditions
      };
      dispatch({
        type: 'fundproject/fetchongoing',
        payload: obj,
      });
      return
    }

    dispatch({
      type: 'fundproject/fetchongoing',
      payload: obj,
    });
  };
  //展开-收起
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };
  //查询
  handleSearch = (e) => {
    const { dispatch, form } = this.props;
    const { dataList } = this.state;
    e.preventDefault();
    const user = storage.get("userinfo");
    const corp_id = user.corp.id;
    form.validateFieldsAndScroll(async(err, values) => {
      const manage = dataList.find(item => item.id === Number(values.manage))
      const {project_name,pm_id,partner,project_status,tag }= values;
      if(project_name || manage || partner || project_status || tag || pm_id) {
        let conditions = [];
        let codeObj = {};
        let manageObj = {};
        let partnerObj = {};
        let statusObj = {};
        let tagObj = {};
        if (project_name) {
          codeObj = {
            code: 'project_name',
            exp: 'like',
            value: project_name
          }
          await conditions.push(codeObj)
        }
        if(pm_id){
          manageObj = {
            code:'pm_id',
            exp:'like',
            value:pm_id
          };
          await conditions.push(manageObj)
        }
        if(partner){
          partnerObj = {
            code:'partner',
            exp:'like',
            value:partner
          };
          await conditions.push(partnerObj)
        }
        if(project_status){
          statusObj = {
            code:'project_status',
            exp:'like',
            value:project_status
          };
          await conditions.push(statusObj)
        }
        if(tag){
          tagObj = {
            code:'tag',
            exp:'like',
            value:tag
          };
          await conditions.push(tagObj)
        }
        this.setState({conditions:conditions})
        const obj = {
          conditions,
          id: corp_id
        }
        dispatch({
          type: 'fundproject/findongoing',
          payload: obj
        })
      }

    })
  }
  //取消
  handleFormReset = ()=>{
    const { dispatch,form} = this.props;
    //清空输入框
    form.resetFields();
    //清空后获取列表
    dispatch({
      type:'fundproject/fetchongoing',
      payload:{
        id:1
      }
    })
  }

  renderAdvancedForm(){
    const {
      form: { getFieldDecorator },
    } = this.props;
    const {expandForm} = this.state;
    const options = this.state.dataList.map(group => (
      <Option key={group.id}>{group.name}</Option>
    ));
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label={formatMessage({ id: 'validation.projectassign.projectname' })}>
              {getFieldDecorator('project_name')(<Input placeholder={formatMessage({ id: 'validation.inputvalue' })} />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label='投资经理'>
              {getFieldDecorator('pm_id')(
                <AutoComplete
                  dataSource={options}
                  onFocus={()=>{
                    const { dispatch } = this.props;
                    dispatch({
                      type:'fundproject/findManager',
                      payload: {
                        pageSize:1000
                      },
                      callback:(res)=>{
                        if (res){
                          this.setState({
                            dataList: res
                          });
                        }
                      }
                    })
                  }}
                  /* onSelect={async (value,option)=>{
                     await this.setState({
                       lp_id: Number(option.key)
                     });
                   }}*/
                  filterOption={(inputValue, option) =>
                    option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                  }
                  placeholder='请输入投资经理' />)}
            </FormItem>
          </Col>
          { expandForm ? <Row>
            <Col md={6} sm={24}>
              <FormItem label=' Lead partner'>
                {getFieldDecorator('partner')(<Input placeholder='请输入 Lead partner' />)}
              </FormItem>
            </Col>
            <Col xl={{ span: 6, offset: 1 }}  md={6} sm={24}>
              <FormItem label='状态'>
                {getFieldDecorator('project_status')(
                  <Select placeholder="请选择项目状态">
                    <Option value="INITIAL">初始状态</Option>
                    <Option value="FILL">完善项目信息</Option>
                    <Option value="ICM">投决会</Option>
                    <Option value="ID">项目决策</Option>
                    <Option value="CIP">确定投资计划</Option>
                    <Option value="POST">投后管理</Option>
                  </Select>
                )}
              </FormItem>
            </Col>

            <Col xl={{  span: 6,offset: 2 }} md={6} sm={24}>
              <FormItem label='tag'>
                {getFieldDecorator('tag')(<Input placeholder='请输入tag' />)}
              </FormItem>
            </Col>
          </Row>:''}
          <Col xl={{  span: 6 }} style={{marginBottom:'18px'}}>
            <span>
              <Button type="primary" htmlType="submit">
                {formatMessage({ id: 'validation.query' })}
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                {formatMessage({ id: 'validation.cancle' })}
              </Button>
              {
                expandForm?<a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                  {formatMessage({ id: 'valid.Pack.up' })}
                  <Icon type="down" />
                </a>:<a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                  {formatMessage({ id: 'valid.Pack.open' })}
                  <Icon type="up" />
                </a>
              }
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      fundproject: { ongoingdata },
      loading,
    } = this.props;
    const { stepFormValues } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.userAdmin}>
            <div className={styles.userAdminForm}>{this.renderAdvancedForm()}</div>

            <NormalTable
              loading={loading}
              data={ongoingdata}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>

          <Modal
            title= '附件下载'
            visible={this.state.visibleModal}
            onCancel={this.handleM}
            footer={null}
          >
            { this.state.attachdata.length ?
              this.state.attachdata.map((item,index)=>{
                return <p key={index}>
                  <a download href={` https://www.leapingtech.net/nien-0.0.1-SNAPSHOT${item.path}/${item.name}`} >{item.name}</a>
                </p>
              }) : '暂无附件'
            }
          </Modal>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default OngoingProjects;
