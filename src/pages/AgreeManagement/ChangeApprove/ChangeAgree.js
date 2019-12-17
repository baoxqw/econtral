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
import NormalTable from '@/components/NormalTable';

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const FormItem = Form.Item;
const { Description } = DescriptionList;
const { TextArea } = Input;
const ButtonGroup = Button.Group;
const { Step } = Steps;
@connect(({ ChangeG, loading }) => ({
  ChangeG,
  loading: loading.models.result,
  refuseLoading:loading.effects['review/ChangeG'],
  agreeLoading:loading.effects['review/ChangeG'],
}))
@Form.create()
class ChangeAgree extends PureComponent {
  state = {
    status:false,
    fileList:[],
    attachdata:[],
    current:0,
    process:'',
    person:'',
    leave:'',
    fileShow:false,
    finaceok:true,
    asks:true,
    initDate:'',
    agreeStatus:false,
    refuseStatus:false,
    returnStatus:false,
    superTable:[],
    childTable:[],
    contactModal:false,
  };
  about = (e)=>{
    this.setState({
      opinion: e.target.value
    })
  };
  backClick = ()=>{
    router.push('/agreemanagement/changeapprove/changeapprove');
  }

  componentDidMount(){
    const { dispatch, form } = this.props;
    this.setState({
      initDate:this.props.location.query
    })
    dispatch({
      type:'ChangeG/detailcheck',
      payload:{
        userDefineStr1:this.props.location.query.processInstanceId
      },
      callback:(res)=>{
        console.log('当前状态',res)
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
    //  附件类表
    dispatch({
      type:'ChangeG/fileList',
      payload:{
        pagesize:10000,
        pageindex:0,
        reqData:{
          id:this.props.location.query.id,
          type:'contract'
        }
      },
      callback:(res)=>{
        console.log('附件列表',res)
        res.map((item)=>{
          this.setState({attachdata:res})
        })
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
      type: 'ChangeG/result',
      payload:obj,
      callback:(res)=>{
        message.success('已完成',1.5,()=>{
          this.setState({
            agreeStatus:false,
            refuseStatus:false,
            returnStatus:false,
          })
          router.push('/agreemanagement/changeapprove/changeapprove');
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
      type: 'ChangeG/refuse',
      payload:obj,
      callback:(res)=>{
        message.success('已完成',1.5,()=>{
          this.setState({
            agreeStatus:false,
            returnStatus:false,
          })
          router.push('/agreemanagement/changeapprove/changeapprove');
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
  filemodal = ()=>{
    this.setState({
      fileShow: true
    })
  }
  fileCancel = ()=>{
    this.setState({
      fileShow: false
    })
  }
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

  filemContact = ()=>{
    const { dispatch } = this.props;
    const { initDate } = this.state;
    const conditions = [{
      code:'id',
      exp:'=',
      value:initDate.id
    }]
    dispatch({
      type:'ChangeG/fetchTable',
      payload:{
        conditions
      },
      callback:(res)=>{
        console.log("主",res)
        if(res.resData && res.resData.length){
          this.setState({
            superTable:{
              list:res.resData
            }
          })
          const conditions = [{
            code:'CONTRACT_H_ID',
            exp:'=',
            value:res.resData[0].id
          }];
          dispatch({
            type:'ChangeG/fetchChild',
            payload:{
              conditions
            },
            callback:(res)=>{
              console.log("子",res)
              if(res.resData && res.resData.length){
                this.setState({
                  childTable:{
                    list:res.resData
                  }
                })
              }
            }
          })
        }
      }
    })
    this.setState({
      contactModal:true
    })
  };

  onCancel = ()=>{
    this.setState({
      contactModal:false
    })
  };

  render() {
    const {
      loading,
      refuseLoading,
      agreeLoading,
    } = this.props;
    const { superTable } = this.state
    const parentMethods = {
      handleAdd: this.handleAdd,
    };

    const description = (
      <DescriptionList >
        <Description term="合同名称">{this.state.initDate?this.state.initDate.billname:''}</Description>
        <Description term="合同类型">{this.state.initDate?this.state.initDate.type:''}</Description>
        <Description term="合同编号">{this.state.initDate?this.state.initDate.billcode:''}</Description>

        <Description term="计划终止日期">{this.state.initDate?this.state.initDate.planTeminateTime:''}</Description>
        <Description term="计划生效日期">{this.state.initDate?this.state.initDate.planValidateTime:''}</Description>
        <Description term="签约日期">{this.state.initDate?this.state.initDate.signdate:''}</Description>

        <Description term="签约地址">{this.state.initDate?this.state.initDate.signplace:''}</Description>
        <Description term="合同状态"><b>{this.state.initDate?this.state.initDate.status:''}</b></Description>

      </DescriptionList>
    );
    const action = (
      <Fragment>
        <Button type="primary" onClick={()=>this.onStatus()}>查看当前状态</Button>
        <Button type="primary" onClick={this.filemodal}>查看附件</Button>
        <Button type="primary" onClick={this.filemContact}>查看合同详情</Button>
      </Fragment>
    );

    const superTableColumns = [
      {
        title: '合同编码',
        width:210,
        dataIndex: 'billcode',
      },
      {
        title: '合同名称',
        width:210,
        dataIndex: 'billname',
      },
      {
        title: '合同类型',
        dataIndex: 'type',
      },
      {
        title: '版本号',
        dataIndex: 'version',
      },
      {
        title: '合同状态',
        dataIndex: 'status',
      },
      {
        title: '签约日期',
        dataIndex: 'signdate',
      },
      {
        title: '签约地址',
        dataIndex: 'signplace',
      },
      {
        title: '计划生效日期',
        dataIndex: 'planValidateTime',
      },
      {
        title: '计划终止日期',
        dataIndex: 'planTeminateTime',
      },
      {
        title: '客户',
        dataIndex: 'custname',
      },
      {
        title: '经办部门',
        dataIndex: 'deptname',
      },
      {
        title: '经办人员',
        dataIndex: 'operatorname',
      },
      {
        title: '合同金额',
        dataIndex: 'contractmny',
      },
      {
        title: '额外费用',
        dataIndex: 'additionalcharges',
      },
      {
        title: '有效合同额',
        dataIndex: 'eca',
      },
      {
        title:"",
        dataIndex: 'caozuo',
      },
    ];

    const childTableColumns = [
      {
        title: '行号',
        dataIndex: 'rowno',
        key: 'rowno',
      },
      {
        title: '收入项名称',
        dataIndex: 'incomename',
        key: 'incomename',
      },
      {
        title: '金额',
        dataIndex: 'mnycurr',
        key: 'mnycurr',
      },
      {
        title: '应收金额',
        dataIndex: 'armnycurr',
        key: 'armnycurr',
      },
      {
        title: '实收金额',
        dataIndex: 'actrualmnycurr',
        key: 'actrualmnycurr',
      },
      {
        title: '',
        dataIndex: 'caozuo',
        key: 'action',
      },
    ];
    console.log('superTable',superTable)
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
        <Modal
          title="点击下载"
          visible={this.state.fileShow}
          onCancel={this.fileCancel}
          footer={null}
        >
          { this.state.attachdata.length ?
            this.state.attachdata.map((item,index)=>{
              return <p  key={index}>
                <a target="_blank" href={`https://www.leapingtech.net/nien-0.0.1-SNAPSHOT${item.path}/${item.name}`} download>{item.name}</a>
              </p>
            }) : '暂无附件'
          }
        </Modal>
        {/* <FooterToolbar style={{ width: '100%' }}>
          <Button
            onClick={this.backClick}
          >返回
          </Button>
        </FooterToolbar>*/}
        <Modal
          title="查看合同详情"
          style={{padding:20}}
          width={"70%"}
          centered
          visible={this.state.contactModal}
          onCancel={this.onCancel}
          footer={null}
        >
          <NormalTable
            data={this.state.superTable}
            columns={superTableColumns}
            pagination={false}
          />
          <Divider orientation="left">合同基本内容</Divider>
          <NormalTable
            data={this.state.childTable}
            columns={childTableColumns}
            pagination={false}
          />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default ChangeAgree;
