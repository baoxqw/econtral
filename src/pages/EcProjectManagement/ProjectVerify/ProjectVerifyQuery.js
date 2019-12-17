import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import DescriptionList from '@/components/DescriptionList';

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
  Transfer, Badge, Dropdown, Steps,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
import FooterToolbar from '@/components/FooterToolbar';

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const FormItem = Form.Item;
const { Description } = DescriptionList;
const { TextArea } = Input;
const ButtonGroup = Button.Group;
const { Step } = Steps;
@connect(({ review, loading }) => ({
  review,
  loading: loading.models.result,
  refuseLoading:loading.effects['review/refuse'],
  agreeLoading:loading.effects['review/result'],
}))
@Form.create()
class ProjectQuery extends PureComponent {
  state = {
    opinion:'',
    status:false,
    detail:'',
    current:0,
    process:'',
    person:'',
    leave:'',
    finaceok:true,
    asks:true,
    initDate:'',
    agreeStatus:false,
    refuseStatus:false,
    returnStatus:false,
  };
  about = (e)=>{
    this.setState({
      opinion: e.target.value
    })
  };
  backClick = ()=>{
    router.push('/ecprojectmanagement/projectreview/list');
  }

  componentDidMount(){
    const { dispatch, form } = this.props;
    this.setState({
      initDate:this.props.location.query
    })
    dispatch({
      type:'review/detailcheck',
      payload:{
        userDefineStr1:this.props.location.query.processInstanceId
      },
      callback:(res)=>{
        if(res.resData && res.resData.length){
          let person = "";
          let current = null;
          let process = [];
          res.resData.map((item)=>{
            for(let key in item){
              //发起人
              if(key === 'AUDIT_BILL'){
                person = item[key].username
              }
              //步骤
              if(key === 'AUDITOR_IDX'){
                current = item[key] + 1;
              }
              //流程
              if(key === 'AUDITOR_LIST'){
                process = JSON.parse(item[key])
              }
            }
          })
          this.setState({
            person,
            current,
            process
          })
        }
      }
    })
  }

  aggree =()=>{
    const { dispatch } = this.props;
    const userDefineStrGroup = [this.state.initDate.taskId,this.state.opinion]
    const obj = {
      userDefineStrGroup
    }
    dispatch({
      type: 'review/result',
      payload:obj,
      callback:(res)=>{
        message.success('已完成',1.5,()=>{
          this.setState({
            agreeStatus:false,
            refuseStatus:false,
            returnStatus:false,
          })
          router.push('/ecprojectmanagement/projectverify/list');
        });
      },
    });
  }
  refuse = ()=>{
    const { dispatch } = this.props;
    const userDefineStrGroup = [this.state.initDate.taskId,this.state.opinion]
    const obj = {
      userDefineStrGroup
    }
    dispatch({
      type: 'review/refuse',
      payload:obj,
      callback:(res)=>{
        message.success('已完成',1.5,()=>{
          this.setState({
            agreeStatus:false,
            returnStatus:false,
          })
          router.push('/ecprojectmanagement/projectverify/list');
        });
      },
    });
  }
  giveback = ()=>{
    // router.push('/ecprojectmanagement/projectreview/list');
  }
  onStatus = ()=>{
    this.setState({
      status: !this.state.status
    })
  };

  renderStatus(){
    return <Card title="流程进度" style={{ marginTop: 24 }} bordered={false}>
      <Steps current={this.state.current}>
        <Step title={this.state.person} />
        {
          this.state.process?this.state.process.map((item,index)=>{
            return <Step key= {index} title={item.name} />
          }):''
        }
        <Step title="完成" />
      </Steps>
    </Card>
  }

  render() {
    const {
      loading,
      refuseLoading,
      agreeLoading,
    } = this.props;
    const parentMethods = {
      handleAdd: this.handleAdd,
    };

    const handleCorpAdd = () => {
      router.push('/projectmanagement/projectassign/add');
    };

    const description = (
      <DescriptionList >
        <Description term="项目名称">{this.state.initDate?this.state.initDate.projectname:''}</Description>
        <Description term="项目类型">{this.state.initDate?this.state.initDate.type:''}</Description>
        <Description term="立项日期">{this.state.initDate?this.state.initDate.initiationdate:''}</Description>

        <Description term="项目负责人">{this.state.initDate?this.state.initDate.projectmanagerName:''}</Description>
        <Description term="客户名称">{this.state.initDate?this.state.initDate.custName:''}</Description>
        <Description term="客户类型">{this.state.initDate?this.state.initDate.customertype:''}</Description>

        <Description term="商务负责人">{this.state.initDate?this.state.initDate.businessleaderName:''}</Description>
        <Description term="负责部门">{this.state.initDate?this.state.initDate.deptName:''}</Description>
        <Description term="项目分级">{this.state.initDate?this.state.initDate.projectgrading:''}</Description>

        <Description term="税率">{this.state.initDate?this.state.initDate.taxrate:''}</Description>
        <Description term="项目金额">{this.state.initDate?this.state.initDate.projectmoney:''}</Description>
        <Description term="项目状态"><b>{this.state.initDate?this.state.initDate.status:''}</b></Description>

        <Description term="合同签订时间">{this.state.initDate?this.state.initDate.signingdate:''}</Description>
        <Description term="合同验收时间">{this.state.initDate?this.state.initDate.acceptancedate:''}</Description>
        <Description term="项目所在地">{this.state.initDate?this.state.initDate.projectaddress:''}</Description>

        <Description term="余额">{this.state.initDate?this.state.initDate.balance:''}</Description>
        <Description term="成本预算">{this.state.initDate?this.state.initDate.budget:''}</Description>
        <Description term="额外费用">{this.state.initDate?this.state.initDate.additionalcharges:''}</Description>

        <Description term="分包比例">{this.state.initDate?this.state.initDate.subcontractingratio:''}</Description>
        <Description term="分包金额">{this.state.initDate?this.state.initDate.subcontractingmoney:''}</Description>
        <Description term="有效合同额">{this.state.initDate?this.state.initDate.eca:''}</Description>


      </DescriptionList>
    );
    const action = (
      <Fragment>
        <Button type="primary" onClick={()=>this.onStatus()}>查看当前状态</Button>
      </Fragment>
    );
    return (
      <PageHeaderWrapper
        title='审核详情'
        logo={
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
        }
         action={action}
        content={description}
        /*extraContent={}*/
        onTabChange={this.onOperationTabChange}
      >
        {/* <Card bordered={false}>
            2222
        </Card>*/}
        {
          this.state.asks?<Card title=''>
            <Row gutter={24} style={{marginTop:24}}>
              <Col lg={2} md={2} sm={3}>
                意见
              </Col>
              <Col lg={16} md={16} sm={20}>
                <TextArea rows={4} placeholder='请输入意见' value={this.state.opinion} onChange={(e)=>this.about(e)}/>
              </Col>
            </Row>

            <Row style={{marginTop:40,marginLeft:90}}>
              <span>
                <Button type="primary" loading={ agreeLoading } onClick={this.aggree}>同意</Button>
              </span>
              <span style={{marginLeft:14}}>
                <Button  style={{backgroundColor:'red',color:'#fff'}} loading={ refuseLoading } onClick={this.refuse}>拒绝</Button>
              </span>
              <span style={{marginLeft:14}}>
                <Button type="primary"  onClick={this.giveback}>退回发起人</Button>
              </span>
              <span style={{marginLeft:14}}>
                <Button  onClick={this.backClick}>取消</Button>
              </span>
            </Row>
          </Card>:''
        }

        {this.state.status?this.renderStatus():null}

       {/* <FooterToolbar style={{ width: '100%' }}>
          <Button
            onClick={this.backClick}
          >返回
          </Button>
        </FooterToolbar>*/}
      </PageHeaderWrapper>
    );
  }
}

export default ProjectQuery;
