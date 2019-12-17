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
import styles from '../../System/UserAdmin.less';
import moment from '../OngoingProject/OngoingProjectICM';
const FormItem = Form.Item;
// import styles from './style.less';
const { Option } = Select;
const { TextArea } = Input;


const label = {
  projectname:'项目名称',
  milestonenode:'里程碑节点',
  completetime:'完成时间',
  evidence:'证明材料',
  memo:'备注',
  opinion:'部门领导审核意见',
}
@connect(({ FP, loading }) => ({
  FP,
  loading: loading.models.FP,
}))
@Form.create()
class FindProject extends PureComponent {
  state ={
    changeVisible:false,
    deleteVisible:false,
    expandForm:false
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type:'FP/fetch',
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
    this.props.history.push("/ecprojectmanagement/findproject/change", {
      query: record
    });
  }
  //展开-收起
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };
  detailsChange = (e,record)=>{
    e.preventDefault()
    this.props.history.push("/ecprojectmanagement/findproject/project",{
      query: record
    })
  }

  reviewHandleCancel=(d)=>{
    this.setState({
      changeVisible:false
    })
  }
  detailsHandleCancel=(e)=>{
    this.setState({
      detailsVisible:false
    })
  }

  reviewHandleOk = (e)=>{
    this.setState({
      changeVisible: false,
    });
  }
  detailsHandleOk = (e)=>{
    this.setState({
      detailsVisible: false,
    });
  }


  handleDelete = (record)=>{
    console.log("record",record)
    const { id } = record;
    const { dispatch } = this.props;
    dispatch({
      type:'FP/delete',
      payload:{
        reqData:{
          id
        }
      },
      callback:(res)=>{
        if(res){
          message.success("删除成功",1,()=>{
            dispatch({
              type:'FP/fetch',
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
    const { expandForm } = this.state
    return (
      <Form onSubmit={this.findList} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label='申请编号'>
              {getFieldDecorator('code')(<Input placeholder='申请编号' />)}
            </FormItem>
          </Col>
          <Col md={8} sm={16}>
            <FormItem label='项目名称'>
              {getFieldDecorator('projectname')(<Input placeholder='项目名称' />)}
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
            <FormItem label='申请状态'>
              {getFieldDecorator('status')(
                <Select style={{width:"100%"}}>
                  <Option value="0">状态1</Option>
                  <Option value="1">状态2</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>:''}
      </Form>
    );
  }

  render() {
    const {
      form:{ getFieldDecorator },
      FP:{ fetchData }
    } = this.props;
    const columns = [
      {
        title: '申请单编号',
        dataIndex: 'numbering',
      },
      {
        title: '项目名称',
        dataIndex: 'projectname',
      },
      {
        title: '项目类型',
        dataIndex: 'projecttype',
      },

      {
        title: '项目负责人',
        dataIndex: 'projectprincipal',
      },
      {
        title: '项目进度',
        dataIndex: 'projectschedule',
      },
      {
        title: '结项类型',
        dataIndex: 'knottype',
      },
      {
        title: '项目状态',
        dataIndex: 'projectstatus',
      },
      {
        title: '是否变更',
        dataIndex: 'ischange',
      },
      {
        title: '操作',
        dataIndex: 'operating',
        render: (text, record) => (
          <Fragment>
            <a href="#javascript;" onClick={(e)=> this.projectChange(e,record)}>变更</a>
            <Divider type="vertical" />
            <Popconfirm title={formatMessage({ id: 'validation.confirmdelete' })} onConfirm={() => this.handleDelete(record)}>
              <a href="javascript:;">{formatMessage({ id: 'validation.delete' })}</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a href="#javascript;" onClick={(e)=> this.detailsChange(e,record)}>详情</a>
          </Fragment>
        ),
      },

    ];

    return (
      <PageHeaderWrapper>
        <Card>
          <div className={styles.userAdmin}>
            <div className={styles.userAdminForm} style={{marginBottom:'20px'}}>{this.renderForm()}</div>
            <NormalTable  columns={columns} data={fetchData} />
          </div>
        </Card>

        <Modal
          title="查看里程碑节点填报详情"
          visible={this.state.detailsVisible}
          onOk={this.detailsHandleOk}
          width={700}
          onCancel={this.detailsHandleCancel}
        >
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <Row>
              <Row style={{display:'flex',justifyContent:'space-between'}}>
                <Col style={{width:'40%'}}>
                  <FormItem  label={label.projectname}>
                    {getFieldDecorator('projectname', {
                    })(<Input />)}
                  </FormItem>
                </Col>
                <Col style={{width:'40%'}}>
                  <FormItem  label={label.milestonenode}>
                    {getFieldDecorator('milestonenode', {
                    })(<Select  style={{ width: '100%' }}>
                      <Option value="common">节点1</Option>
                      <Option value="prefer">节点2</Option>
                      <Option value="cb">节点3</Option>
                    </Select>)}
                  </FormItem>
                </Col>
              </Row>
              <Row style={{display:'flex',justifyContent:'space-between'}}>
                <Col style={{width:'40%'}}>
                  <FormItem  label={label.completetime}>
                    {getFieldDecorator('completetime', {
                    })(<DatePicker   style={{ width: '100%' }}/>)}
                  </FormItem>
                </Col>
                <Col style={{width:'40%'}}>

                </Col>
              </Row>
              <Row style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <Col style={{width:'40%'}}>
                  <FormItem  label={label.evidence}>
                    {getFieldDecorator('evidence', {
                    })(<Input />)}
                  </FormItem>
                </Col>
                <Col style={{width:'40%',position:'relative',top:'8px'}}>
                  <Button type={'primary'} icon='cloud-download'>下载</Button>
                </Col>
              </Row>
              <Row style={{display:'flex',justifyContent:'center'}}>
                <Col style={{width:'88%'}}>
                  <FormItem  label={label.memo}>
                    {getFieldDecorator('memo', {
                    })(<TextArea rows={3} />)}
                  </FormItem>
                </Col>
              </Row>
              <Row style={{display:'flex',justifyContent:'center'}}>
                <Col style={{width:'88%'}}>
                  <FormItem  label={label.opinion}>
                    {getFieldDecorator('opinion', {
                      rules: [
                        {
                          required: true,
                        }
                      ]
                    })(<TextArea rows={3} placeholder='部门领导审核意见' />)}
                  </FormItem>
                </Col>
              </Row>
            </Row>
          </Form>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default FindProject;
