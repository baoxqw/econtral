import React, { PureComponent } from 'react';
import { Card, Button, Form, Col, Row, Input, Select,message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FooterToolbar from '@/components/FooterToolbar';
import styles from './style.less';
import storage from '@/utils/storage';
import router from 'umi/router';
import InvestContractTableForm from './InvestContractTableForm';
import { connect } from 'dva';

const fieldLabels = {
  capitalinvested: '投资金额',
  nativecurrencies: '数字币种',
  amountinvested: '投资数量',
  memo: '备注',
};

const investdetailTableData = [
  {
    key: '1',
    investdate: '2017-01-01',
    investmoney: '23,000',
    investrate: '30%',
    account: '2010201201201210',
  },
  {
    key: '2',
    investdate: '2018-01-01',
    investmoney: '23,000',
    investrate: '30%',
    account: '2010201201201210',
  },
  {
    key: '3',
    investdate: '2019-01-01',
    investmoney: '30,000',
    investrate: '40%',
    account: '2010201201201210',
  },
];

const { Option } = Select;
const { TextArea } = Input;

@connect(({ desci, loading }) => ({
  desci,
  loading: loading.models.desci,
}))
@Form.create()
class OngoingProjectConfirmProjects extends PureComponent {
  state = {
    width: '100%',
    dataSource:{},
    project_id:null,
    ticker:null,
    project_status:'',
    showSubmit:true,
  };
  backClick = ()=>{
    this.props.history.go(-1)
  }
  componentDidMount() {
    const { dispatch } = this.props;
    if(this.props.location.state){
      const dataSource = this.props.location.state.query;
      console.log("dadada",dataSource)
      const project_status = dataSource.query.project_status;
      if(project_status =='POST'){
        this.setState({showSubmit:false})
      }else{
        this.setState({showSubmit:true})
      }
      const project_id = dataSource.query.project_id;
      const ticker = dataSource.query.ticker;
      this.setState({
        project_id,
        project_status,
        ticker,
      });
      dispatch({
        type: 'desci/fetch',
        payload:{
          reqData:{
            id:project_id
          }
        },
        callback:async (res)=>{
          if(res){
            console.log('页面数据：',res)
            this.setState({
              dataSource:res[0]
            })
          }
        }
      });
    }
  }
  validate () {
    const { dispatch } = this.props;
    const { form} = this.props;
    const user = storage.get("userinfo");
    const corp_id = user.corp.id;
    form.validateFields((err, fieldsValue) => {
      console.log('---',fieldsValue);
      const obj = {
        reqData:{
            nativecurrencies:fieldsValue.nativecurrencies,
            amountinvested:Number(fieldsValue.amountinvested),
            capitalinvested:Number(fieldsValue.capitalinvested),
            project_id:this.state.project_id,
            corp_id,
            ticker:this.state.ticker,
            investplan_id:this.state.dataSource.id,
            project_status:this.state.project_status,
        }
      };
      dispatch({
        type: 'desci/add',
        payload: obj,
        callback:(res)=>{
          message.success("成功确认",1.5,()=>{
            router.push('/projectmanagement/ongoingproject/list');
          })
        }
      });
    })

  }
  render() {
    const {
      form: { getFieldDecorator },
      submitting,
    } = this.props;
    const { width,dataSource } = this.state;
    return (
      <PageHeaderWrapper>
        <Card title="确认投资信息" className={styles.card} bordered={false}>
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.capitalinvested}>
                  {getFieldDecorator('capitalinvested', {
                    initialValue:dataSource.subscriptionamount?dataSource.subscriptionamount:'',
                    rules: [
                      { required: true, message: '请输入投资金额' },
                      {
                        pattern: /^(\d+)((?:\.\d+)?)$/,
                        message: '请输入合法投资金额数字',
                      },
                    ],
                  })(<Input placeholder="请输入投资总额" type='number'/>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.nativecurrencies}>
                  {getFieldDecorator('nativecurrencies', {
                    initialValue:dataSource.currency?dataSource.currency:'',
                    rules: [{ required: true, message: '请输入数字币种' }],
                  })(<Input placeholder="请输入数字币种"/>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.amountinvested}>
                  {getFieldDecorator('amountinvested', {
                    initialValue:dataSource.noofshare?dataSource.noofshare:'',
                    rules: [
                      { required: true, message: '请输入投资数量' },
                      {
                        pattern: /^(\d+)((?:\.\d+)?)$/,
                        message: '请输入合法投资数量数字',
                      },
                    ],
                  })(<Input placeholder="请输入投资数量" type='number'/>)}
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col lg={24} md={24} sm={24}>
                <Form.Item label={fieldLabels.memo}>
                  {getFieldDecorator('memo',{
                    initialValue:dataSource.memo?dataSource.memo:'',
                  })(<TextArea />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>

        <Card title="投资条款明细" bordered={false}>
          {getFieldDecorator('investplan', {
            initialValue: investdetailTableData,
          })(<InvestContractTableForm />)}
        </Card>

        <FooterToolbar style={{ width }}>
          {/* {this.getErrorInfo()} */}
          <Button
            onClick={this.backClick}
          >返回</Button>
          {
            this.state.showSubmit?    <Button type="primary" onClick={()=>this.validate()} loading={submitting}>
              提交
            </Button>:''
          }
        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}

export default OngoingProjectConfirmProjects;
