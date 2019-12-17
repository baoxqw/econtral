import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import NormalTable from '@/components/NormalTable';
import moment from 'moment'
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  InputNumber,
  Divider,
  Icon,
  Table,
  Row,
  Modal,
  Col,
  message,
  Steps
} from 'antd';
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../../System/UserAdmin.less';
const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const { Step } = Steps;

const label = {
  projectname:'项目名称',
  milestonenode:'里程碑节点',
  username:'填报人',
  actualenddate:'填报时间',
  estimateenddate:'完成时间',
  evidence:'证明材料',
  memo:'备注',
  opinion:'部门领导审核意见',
}

@connect(({ MM, loading }) => ({
  MM,
  loading: loading.models.MM,
}))
@Form.create()
class MarketingMilestone extends PureComponent {
  state ={
    reviewVisible:false,
    detailsVisible:false,
    review:{},
    current:0,
    process:[],
    person:'',
    agreeStatus:false,
    refuseStatus:false,
    returnStatus:false,
    conditions:[]
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type:'MM/fetch',
      payload:{
        pageIndex:0,
        pageSize:10,
        reqData:{
          type:'营销'
        }
      }
    })
  }

  jump = (e,record)=>{
    e.preventDefault();
    this.setState({
      reviewVisible:true,
      review: record,
    })
  }

  Details = (e,record)=>{
    e.preventDefault();
    const { dispatch } = this.props;
    this.setState({
      detailsVisible:true
    })
    dispatch({
      type:'MM/detailcheck',
      payload:{
        userDefineStr1:record.processInstanceId
      },
      callback:(res)=>{
        if(res && res.length){
          let current = 0; //第几步
          let person = ''; //发起人
          let process = []; //流程
          res.map((item) =>{
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
            <FormItem label='项目名称'>
              {getFieldDecorator('name')(<Input placeholder='项目名称' />)}
            </FormItem>
          </Col>
          <Col md={8} sm={16}>
            <FormItem label='填报时间'>
              {getFieldDecorator('time')(<DatePicker style={{ width: '100%' }}/>)}
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
  aggree = ()=>{
    const { form ,dispatch} = this.props;
    const { review } = this.state;
    this.setState({
      agreeStatus:true
    });
    form.validateFields((err, fieldsValue)=>{
      const obj = {
        userDefineStrGroup:[review.taskId,fieldsValue.opinion]
      };
      dispatch({
        type:'MM/check',
        payload:obj,
        callback:(res)=>{
          message.success('审核同意',1,()=>{
            this.setState({
              reviewVisible: false,
              agreeStatus:false
            });
            dispatch({
              type:'MM/fetch',
              payload:{
                pageIndex:0,
                pageSize:10,
                reqData:{
                  type:'营销'
                }
              }
            })
          })
        }
      })
    })
  }

  refuse = ()=>{
    const { form,dispatch } = this.props;
    const { review } = this.state;
    this.setState({
      refuseStatus:true
    });
    form.validateFields((err, fieldsValue)=>{
      const obj = {
        userDefineStrGroup:[review.taskId,fieldsValue.opinion]
      };
      dispatch({
        type:'MM/refuse',
        payload:obj,
        callback:(res)=>{
          message.success('审核拒绝',1,()=>{
            this.setState({
              reviewVisible: false,
              refuseStatus: false,
            });
            dispatch({
              type:'MM/fetch',
              payload:{
                pageIndex:0,
                pageSize:10,
                reqData:{
                  type:'营销'
                }
              }
            })
          })
        }
      })
    })
  }

  return = ()=>{
    const { form,dispatch } = this.props;
    const { review } = this.state;
    this.setState({
      returnStatus:true
    });
    form.validateFields((err, fieldsValue)=>{
      const obj = {
        userDefineStrGroup:[review.taskId,fieldsValue.opinion]
      };
     /* dispatch({
        type:'MM/return',
        payload:obj,
        callback:(res)=>{
          console.log("退回",res);
          message.success('审核退回',1,()=>{
            this.setState({
              reviewVisible: false,
              returnStatus: false,
            });
            dispatch({
              type:'MM/fetch',
              payload:{
                reqData:{
                  pageIndex:0,
                  pageSize:10
                }
              }
            })
          })
        }
      })*/
    })
  };

  reviewHandleCancel = ()=>{
    this.setState({
      reviewVisible:false,
    })
  }

  detailsHandleCancel = ()=>{
    this.setState({
      detailsVisible:false,
    })
  }
  // 查询
  findList = (e)=>{
    e.preventDefault();
    const { dispatch,form } = this.props
    form.validateFieldsAndScroll((err,values)=>{
      const {name,time} = values;
      if(name || time) {
        let conditions = [];
        let codeObj = {};
        let nameObj = {};

        if (name) {
          codeObj = {
            code: 'projectname',
            exp: 'like',
            value: name
          };
          conditions.push(codeObj)
        }
        if (time) {
          nameObj = {
            code: 'actualenddate',
            exp: 'like',
            value: values['time'].format('YYYY-MM-DD')
          };
          conditions.push(nameObj)
        }
        this.setState({conditions})
        const obj = {
          pageIndex:0,
          pageSize:10,
          reqData:{
            type:'营销'
          },
          conditions,
        };
        dispatch({
          type:'MM/fetch',
          payload:obj
        })
      }else{
        this.setState({conditions:[]})
        dispatch({
          type:'MM/fetch',
          payload:{
            pageIndex:0,
            pageSize:10,
            reqData:{
              type:'营销'
            },
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
      type:'MM/fetch',
      payload:{
        pageIndex:0,
        pageSize:10,
        reqData:{
          type:'营销'
        }
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
    const {  conditions} = this.state;

    const obj = {
      pageIndex: pagination.current-1,
      pageSize: pagination.pageSize,
      reqData:{
        type:'营销'
      }

    };
    if(conditions){
      const param = {
        ...obj,
        conditions
      };
      dispatch({
        type:'MM/fetch',
        payload: param,
      });
      return
    }
    dispatch({
      type:'MM/fetch',
      payload: obj,
    });
  };
  render() {
    const {
      form:{getFieldDecorator},
      MM:{ fetchData },
      loading
    } = this.props;

    const { review,agreeStatus,refuseStatus,returnStatus,process,current,person } = this.state;
    const columns = [
      {
        title: '项目名称',
        dataIndex: 'projectname',
      },
      {
        title: '里程碑节点',
        dataIndex: 'nodename',
      },
      {
        title: '填报人',
        dataIndex: 'username',
      },
      {
        title: '填报时间',
        dataIndex: 'actualenddate',
      },
      {
        title: '完成时间',
        dataIndex: 'estimateenddate',
      },
      {
        title:'审核状态',
        dataIndex:'status',
      },
      {
        title: '操作',
        dataIndex:'operation',
        fixed:'right',
        render: (text, record) => (
          <Fragment>
            {
              record.status === "已审核"? <span>审核</span>:<a href="#javascript;" onClick={(e)=> this.jump(e,record)} >审核</a>
            }

            <Divider type="vertical" />
            <a href="#javascript;" onClick={(e)=> this.Details(e,record)}>查看状态</a>
          </Fragment>
        ),
      },

    ];

    return (
      <PageHeaderWrapper>
        <Card>
          <div className={styles.userAdmin}>
            <div className={styles.userAdminForm}>{this.renderForm()}</div>
            <NormalTable
              columns={columns}
              data={fetchData}
              loading={loading}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>

        <Modal
          title="审批项目里程碑"
          destroyOnClose
          centered
          visible={this.state.reviewVisible}
          //onOk={this.reviewHandleOk}
          width={700}
          onCancel={this.reviewHandleCancel}
          footer={[
            <Button type="primary" loading={ agreeStatus } key={1} onClick={this.aggree}>同意</Button>,
            <Button  style={{backgroundColor:'red',color:'#fff'}} key={2} loading={ refuseStatus }  onClick={this.refuse}>拒绝</Button>,
            <Button type="primary" loading={ returnStatus } key={3}  onClick={this.return}>退回发起人</Button>,
            <Button   key={4}  onClick={this.reviewHandleCancel}>取消</Button>
          ]}
        >
          <Form hideRequiredMark style={{ marginTop: 8 }}>
            <Row>
              <Row style={{display:'flex',justifyContent:'space-between'}}>
                <Col style={{width:'40%'}}>
                  <FormItem  label={label.projectname}>
                    {getFieldDecorator('projectname', {
                      initialValue:review.projectname?review.projectname:''
                    })(<Input disabled/>)}
                  </FormItem>
                </Col>
                <Col style={{width:'40%'}}>
                  <FormItem  label={label.milestonenode}>
                    {getFieldDecorator('milestonenode',
                      {
                        initialValue:review.nodename?review.nodename:''
                      })(<Input disabled/>)}
                  </FormItem>
                </Col>
              </Row>
              <Row style={{display:'flex',justifyContent:'space-between'}}>
                <Col style={{width:'40%'}}>
                  <FormItem  label={label.username}>
                    {getFieldDecorator('username', {
                      initialValue:review.username?review.username:''
                    })(<Input disabled/>)}
                  </FormItem>
                </Col>
                <Col style={{width:'40%'}}>
                  <FormItem  label={label.actualenddate}>
                    {getFieldDecorator('actualenddate', {
                      initialValue:review.actualenddate?moment(review.actualenddate):null
                    })(<DatePicker   style={{ width: '100%' }} disabled/>)}
                  </FormItem>
                </Col>
              </Row>
              <Row style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <Col style={{width:'40%'}}>
                  <FormItem  label={label.estimateenddate}>
                    {getFieldDecorator('estimateenddate', {
                      initialValue:review.estimateenddate?moment(review.estimateenddate):null
                    })(<DatePicker   style={{ width: '100%' }} disabled/>)}
                  </FormItem>
                </Col>
                <Col style={{width:'40%',top:'8px'}}>
                  <a target='_blank' href={`https://www.leapingtech.net/nien-0.0.1-SNAPSHOT${review.attachmentList?review.attachmentList.length>0?review.attachmentList[0].path:'':''}/${review.attachmentList?review.attachmentList.length>0?review.attachmentList[0].name:'':''}`} download>
                    <Button type='primary' icon='cloud-download'>
                      下载附件
                    </Button>
                  </a>
                </Col>
              </Row>
              {/*<Row style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <Col style={{width:'40%'}}>
                  <FormItem  label={label.evidence}>
                    {getFieldDecorator('evidence', {
                      initialValue:review.evidence?review.evidence:''
                    })(<Input disabled/>)}
                  </FormItem>
                </Col>
                <Col style={{width:'40%',position:'relative',top:'8px'}}>

                </Col>
              </Row>*/}
              <Row style={{display:'flex',justifyContent:'center'}}>
                <Col style={{width:'88%'}}>
                  <FormItem  label={label.memo}>
                    {getFieldDecorator('memo', {
                      initialValue:review.memo?review.memo:''
                    })(<TextArea rows={3} disabled/>)}
                  </FormItem>
                </Col>
              </Row>
              <Row style={{display:'flex',justifyContent:'center'}}>
                <Col style={{width:'88%'}}>
                  <FormItem  label={label.opinion}>
                    {getFieldDecorator('opinion', {
                      initialValue:review.opinion?review.opinion:''
                    })(<TextArea rows={3} placeholder='部门领导审核意见' />)}
                  </FormItem>
                </Col>
              </Row>
            </Row>
          </Form>
        </Modal>

        <Modal
          title="查看流程进度"
          destroyOnClose
          centered
          visible={this.state.detailsVisible}
          //onOk={this.detailsHandleOk}
          width={700}
          onCancel={this.detailsHandleCancel}
          footer={[
            // 定义右下角 按钮的地方 可根据需要使用 一个或者 2个按钮
            <Button  onClick={()=>this.detailsHandleCancel()} >
              确定
            </Button>,

          ]}
        >
          <Steps current={current}>
            <Step  title={person}/>
            {
              process?process.map((item,index)=>{
                return <Step key= {index} title={item.name} />
              }):''
            }
            <Step title="完成" />
          </Steps>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default MarketingMilestone;
