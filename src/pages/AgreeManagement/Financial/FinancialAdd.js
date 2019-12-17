import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import momentt from 'moment'
import {
  Button,
  Row,
  Col,
  Card,
  Input,
  Select,
  DatePicker,
  Anchor,
  Cascader,
  Checkbox,
  Form,
  Divider,
  AutoComplete,
  Table
} from 'antd';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { formatMessage, FormattedMessage } from 'umi/locale';
import styles from '../../FundaMental/CorpAdmin/style.less';
import NormalTable from '@/components/NormalTable';
import BraftEditor from 'braft-editor';
import FinanceTableForm from '../../EcProjectManagement/OngoingProject/OngoingProjectUpdateProject';
import router from 'umi/router';
import { message } from 'antd';
const { TextArea } = Input;
const { Description } = DescriptionList;
const { Link } = Anchor;
const action = (
  <Fragment>
    {/*<Button>操作</Button>*/}
    {/*<Button>操作</Button>*/}
  </Fragment>
);

const description = (data)=>{
  let status;
  if(data){
    if(data.status === 'INITIAL'){
      status = '初始状态'
    }else if(data.status === 'FILL'){
      status = '完善项目信息'
    }else if(data.status === 'IR'){
      status = '投资者关系'
    }else if(data.status === 'IP'){
      status = '投资计划'
    }else if(data.status === 'DD'){
      status = '尽职调查'
    }else if(data.status === 'ICM'){
      status = '投决会'
    }else if(data.status === 'ID'){
      status = '项目决策'
    }else if(data.status === 'CIP'){
      status = '确定投资计划'
    }else if(data.status === 'POST'){
      status = '投后管理'
    }
  }
  return (
    <DescriptionList className={styles.headerList} size="small" col="2">
{/*      <Description term="创建人">{data ? data.creator_name:''}</Description>
      <Description term="投资经理">{data ? data.pm_name: ''}</Description>
      <Description term="创建时间">{data ? data.createdate:''}</Description>
      <Description term="主营业务">{data ? data.tag:''}</Description>
      <Description term="投资阶段">{data ? status:''}</Description>
      <Description term="备注">{data ? data.subjectdesc:''}</Description>*/}
      <Description term={formatMessage({id:'validation.creater'})}>{data ? data.creator_name:''}</Description>
      <Description term={formatMessage({id:'validation.investment.manager'})}>{data ? data.pm_name: ''}</Description>
      <Description term={formatMessage({id:'validation.createtime'})}>{data ? data.createdate:''}</Description>
      <Description term={formatMessage({id:'validation.majorbusinesses'})}>{data ? data.tag:''}</Description>
      <Description term={formatMessage({id:'validation.investmentstage'})}>{data ? status:''}</Description>
      <Description term={formatMessage({id:'form.title.memo'})}>{data ? data.subjectdesc:''}</Description>
    </DescriptionList>
  )};
const inveLabels = {
  investtype: formatMessage({id:'project.investment.type'}),//'投资类型',
  investtool:  formatMessage({id:'project.investment.tool'}),//'投资工具',
  fundname: formatMessage({id:'validation.fundname'}),// '基金名称',
  subscriptionamount:formatMessage({id:'project.Subscribe.bumber'}),// '订阅数量',
  noofshare:formatMessage({id:'project.piles.bumber'}),//'股数',
  parvalue: formatMessage({id:'project.par.value'}),//'票面价格',
  pricepershare:formatMessage({id:'project.price.value'}),//'每股价格',
  currency:formatMessage({id:'project.currency'}),// '币种',
  noofcapital:formatMessage({id:'project.total.capital'}),// '总资本',
  shareholdingratio:formatMessage({id:'project.shareholding'}),// '持股比例',
  memo: formatMessage({id:'form.title.memo'}),//'备注',
  investmentamount: formatMessage({id:'validation.investmentquantity'}),// '投资数量',
  couponrate: formatMessage({id:'project.discount.rate'}),// '折扣率',
  yieldtomaturity: formatMessage({id:'project.maturity.yiel'}),//'到期收益率',
  conversionprice: formatMessage({id:'project.conversion.price'}),//'转换价格',
  dateofmaturity: formatMessage({id:'project.date'}),// '到期日',
  ipoexchange: formatMessage({id:'project.Release.platform'}),//'发行平台',
  issuesize: formatMessage({id:'project.Release.size'}),//'发行规模',
  ipodate: formatMessage({id:'project.Proposed.time'}),//'拟上市时间',
  ipoprice: formatMessage({id:'project.listed.price'}),//'上市价格',
  briefdesc: formatMessage({id:'project.brief.introduction'}),// '简介',
  www: formatMessage({id:'project.website'}),//'网站',
  hardcap: formatMessage({id:'project.hard.top'}),//'硬顶',
  softcap: formatMessage({id:'project.soft.top'}),//'软顶',
  totalsupply: formatMessage({id:'project.aggregate.supply'}),// '总供给',
  forsalerate: formatMessage({id:'project.Available.rate'}),// '可售比率',
  Lockup: formatMessage({id:'project.Lock.number'}),//'锁定数量',
  tag: formatMessage({id:'validation.label'}),//'标签',
  equity:  formatMessage({id:'project.organization'}),//'机构',
  valuation: formatMessage({id:'project.current.valuation'}),// '本轮估值',
  preinvestor: formatMessage({id:'project.Previous.investor'}),// '上轮投资人',
  prevaluation: formatMessage({id:'project.current.Wheel'}),// '上轮估值',
  forsale: formatMessage({id:'project.Available.amount'}),//'可售额',
  investor: formatMessage({id:'project.current.Round'}),// '本轮投资人',
  price: formatMessage({id:'project.price'}),//'价格',
  discount: formatMessage({id:'project.discount'}),// '折扣',

  tokentype: formatMessage({id:'project.Token.type'}),//'代币类型',
  otherinvestors: formatMessage({id:'project.Other.investors'}),//'其他投资人',
  premium: formatMessage({id:'project.premium'}),// '本轮估值溢价',
};

const fieldLabels = {
  name: formatMessage({id:'form.title.projectname'}),//'项目名称',
  maininvestor: formatMessage({id:'project.staff.investor'}),// '投资主体',
  employeenum: formatMessage({id:'project.staff.number'}),// '员工数量',
  createdate: formatMessage({id:'validation.foundingtime'}),// '成立时间',
  mainbusiness: formatMessage({id:'validation.majorbusinesses'}),//'主营业务',
  ceo: 'CEO',
  projectname: formatMessage({id:'form.title.projectname'}),// '项目名称',
  registeredcapital: formatMessage({id:'validation.registered.capital'}),//'注册资本',
  currency: formatMessage({id:'project.currency'}),//'币种',

  industry:formatMessage({id:'project.guild'}),//  '行业',
  region:formatMessage({id:'validation.area'}),//  '地区',
  address:formatMessage({id:'project.company.address'}),// '公司地址',
  memo:formatMessage({id:'form.title.memo'}),//  '备注',
  subjectdesc:formatMessage({id:'project.underlying'}),// '标的简介',
  istoken: '是否涉及Token',
  tag:formatMessage({id:'validation.label'}),//  '标签',
  contactperson:formatMessage({id:'validation.contactpeople'}),// '联系人',
  contactemail:formatMessage({id:'form.email.placeholder'}),//'邮箱',
  contactmp:formatMessage({id:'project.tel.phone'}),// '电话（手机）',
};

//测试数据
const financeTableData = [
  {
    key: '1',
    year: '2018',
    index: '资产负债',
    count: '10,000',
  },
  {
    key: '2',
    year: '2018',
    index: '税前利润',
    count: '20,000',
  },
  {
    key: '3',
    year: '2018',
    index: '净利润',
    count: '-2,000',
  },
];



const financingData = [
  {
    key: '1',
    date: '2018-01-01',
    rounds: 'A轮',
    type: 'Token',
    mechanism: 'A,B',
    amount: '10,000',
    valuation: '10,0000',
  },
  {
    key: '2',
    date: '2018-06-01',
    rounds: 'B轮',
    type: 'Token',
    mechanism: 'A,C',
    amount: '19,000,000',
    valuation: '190,000,000',
  },
  {
    key: '3',
    date: '2019-06-01',
    rounds: 'C轮',
    type: 'Token',
    mechanism: 'B,D',
    amount: '2,000,000,000',
    valuation: '200,000,000,000',
  },
]

const licenseData = [
  {
    key: '1',
    name: 'MBS License',
    status: '已获得',
    date: '',
  },
  {
    key: '2',
    name: 'BD License',
    status: '未获得',
    date: '',
  },
  {
    key: '3',
    name: 'Banking License',
    status: '申请中',
    date: '2019.11',
  },
]

const distributionData = [
  {
    key: '1',
    use: '团队',
    proportion: '15%',
  },
  {
    key: '2',
    use: '融资',
    proportion: '55%',
  },
  {
    key: '3',
    use: '生态建设',
    proportion: '30%',
  },
]

const itemData = [
  {
    key: '1',
    name: 'AA',
    character: 'CEO',
  },
  {
    key: '2',
    name: 'BB',
    character: 'CTO',
  },
  {
    key: '3',
    name: 'CC',
    character: 'COO',
  },
]



@connect(({ vo, loading }) => ({
  vo,
  loading: loading.models.vo,
}))
@Form.create()
class FinancialAdd extends Component {
  state = {
    status: 'score',
    project_id: null,
    opinion:'',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    if(this.props.location.state){
      const dataSource = this.props.location.state.query;
      console.log("dataSource:",dataSource);
      const project_id = dataSource.project_id;
      this.setState({project_id:project_id});
      const id = dataSource.id;
      const fundvoterule_id = dataSource.fundvoterule_id;

      this.setState({
        project_id,
        fundvoterule_id,
        id
      })
      const str = {
        reqData:{
          id:project_id
        }
      };
      //调取概要信息
      dispatch({
        type: 'vo/fetchDetail',
        payload:{id:project_id},
        callback:(res)=>{
          console.log('概要信息：',res)
          this.setState({initData:res[0]})
        },
      });
    }

  }

  columns = [
    {
      title: '财务年度',
      dataIndex: 'financialyear',
    },
    {
      title: '财务指标',
      dataIndex: 'financialindex',
    },
    {
      title: '数值（单位：万元）',
      dataIndex: 'financialindexdata',
    }
  ];

  shareholder = [
    {
      title: '股东类型',
      dataIndex: 'shareholdertype',
    },
    {
      title: '占股比例',
      dataIndex: 'rate',
    }
  ];

  financing = [
    {
      title: '融资时间',
      dataIndex: 'investdate',
    },
    {
      title: '融资轮数',
      dataIndex: 'rounds',
    },
    {
      title: '融资类型',
      dataIndex: 'investtype',
    },
    {
      title: '投资机构',
      dataIndex: 'investor',
    },
    {
      title: '投资金额（单位：万元）',
      dataIndex: 'investmount',
    },
    {
      title: '公司估值（单位：万元',
      dataIndex: 'valuation',
    }
  ];

  license = [
    {
      title: '牌照名称',
      dataIndex: 'license_id',
    },
    {
      title: '状态',
      dataIndex: 'status',
    },
    {
      title: '预计取得时间',
      dataIndex: 'acquiredate',
    },
  ];

  distribution = [
    {
      title: '用途',
      dataIndex: 'uses',
    },
    {
      title: '比例',
      dataIndex: 'rate',
    },
  ];

  team = [
    {
      title: '姓名',
      dataIndex: 'membername',
    },
    {
      title: '角色',
      dataIndex: 'memebertitle',
    },
  ];

  onOperationTabChange = key => {
    const { dispatch } = this.props;
    if(key === 'projected'){
      const obj = {
        reqData:{
          id: this.state.project_id
        }
      };
      dispatch({
        type:'vo/fetch',
        payload: obj,
        callback:(res)=>{
          // 假设此处从服务端获取html格式的编辑器内容
          const htmlContent = res.projectDetail.corpdesc;
          const htmlContentt = res.projectDetail.roadmap;
          const htmlContento = res.projectDetail.hotcommunity;
          // 使用BraftEditor.createEditorState将html字符串转换为编辑器需要的editorStat
          this.setState({
            editorState: BraftEditor.createEditorState(htmlContent),
            editorState1: BraftEditor.createEditorState(htmlContentt),
            editorState2: BraftEditor.createEditorState(htmlContento),
          })
        }
      })
    }
  };

  about = (e)=>{
    this.setState({
      opinion: e.target.value
    })
  };

  aggree (value){
    const { dispatch } = this.props;
    let result;
    if(value === '同意'){
      result = 1
    }
    if(value === '有条件同意'){
      result = 2
    }
    if(value === '续议'){
      result = 3
    }
    if(value === '拒绝'){
      result = 0
    }
    if(value === '取消'){
      this.setState({
        opinion:''
      });
      return
    }
    const obj = {
      reqData:{
        result:result,
        opinion:this.state.opinion,
        fundvoterule_id:1,//上一个页面返回为null,所以模拟假数据：1
        id:this.state.id,
        project_id:this.state.project_id,
      }
    }
    dispatch({
      type: 'vo/result',
      payload:obj,
      callback:()=>{
        message.success('已完成');
        router.push('/workmanagement/investdecision');
      },
    });
  }

  render() {
    const {
      form: { getFieldDecorator },
      vo:{ data,finance,
        projectShareholderList,
        projectHistoryList,
        projectLicenseList,
        projectDistributionList,
        projectTeamList,
        investplan
      },
    } = this.props;
    console.log('data',data);
    var ee;
    if(this.state.initData){
      ee = this.state.initData.project_name;
    }else{
      ee = ''
    }
    if(investplan){
      if(investplan.investtype == 1){
        investplan.investtype = '股权 '
      }else if(investplan.investtype == 0){
        investplan.investtype = 'Token '
      }

      if(investplan.stocktype == 1){
        investplan.stocktype = '新股 '
      }else{
        investplan.stocktype = '老股 '
      }

      if(investplan.investtool == 'common'){
        investplan.investtool = '普通股'
      }else if(investplan.investtool == 'prefer'){
        investplan.investtool = '优先股'
      }else if(investplan.investtool == 'cb'){
        investplan.investtool = '债转股'
      }
      if(investplan.ipoexchange == 1){
        investplan.ipoexchange = 'coinmarketcap'
      }else if(investplan.ipoexchange == 2){
        investplan.ipoexchange = 'huobi'
      }else if(investplan.ipoexchange == 3){
        investplan.ipoexchange = 'binance'
      }else if(investplan.ipoexchange == 4){
        investplan.ipoexchange = 'okex'
      }
    }
    const operationTabList = [
      {
        key: 'score',
        tab: formatMessage({id:'project.mark'}),
        value: (
          <Card title={formatMessage({id:'validation.project.decision'})}>
            <Row gutter={24} style={{marginTop:24,marginLeft:90}}>
              <Col lg={2} md={2} sm={3}>
                {/*意见*/}
                {formatMessage({id:'form.opinion.label'})}
              </Col>
              <Col lg={16} md={16} sm={20}>
                <TextArea rows={4} placeholder={formatMessage({id:'form.opinion.label'})}  value={this.state.opinion} onChange={(e)=>this.about(e)}/>
              </Col>
            </Row>

            <Row style={{marginTop:40}}>
              <span>
                <Button type="primary" onClick={()=> this.aggree('同意')}>{formatMessage({id:'project.agree'})}</Button>
              </span>
              <span style={{marginLeft:14}}>
                <Button type="primary" onClick={()=> this.aggree('有条件同意')}>{formatMessage({id:'project.Conditional.consent'})}</Button>
              </span>
              <span style={{marginLeft:14}}>
                <Button type="primary" onClick={()=> this.aggree('续议')}>{formatMessage({id:'project.discussion'})}</Button>
              </span>
              <span style={{marginLeft:14}}>
                <Button style={{backgroundColor:'red',color:'#fff'}} onClick={()=> this.aggree('拒绝')}>{formatMessage({id:'project.reject'})}</Button>
              </span>
              <span style={{marginLeft:14}}>
                <Button onClick={()=> this.aggree('取消')}>{formatMessage({id:'validation.cancle'})}</Button>
              </span>
            </Row>
          </Card>
        )
      },
      {
        key: 'projected',
        tab: formatMessage({id:'project.material'}),
        value: (
          <Card title={formatMessage({id:'project.material'})}>
            <Row>
              <Col span={22}>
                <Form layout="vertical" hideRequiredMark>
                  <Row id='1' >
                    <Card title={formatMessage({id:'validation.projectinformation'})} className={styles.card} bordered={false}>
                        <Row gutter={16}>
                          <Col lg={6} md={12} sm={24}>
                            <Form.Item label={fieldLabels.name}>
                              {getFieldDecorator('name',{
                                initialValue:data.project_name,
                              })(
                                <Input placeholder="请输入项目名称"  disabled/>
                              )}
                            </Form.Item>
                          </Col>
                          <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                            <Form.Item label={fieldLabels.maininvestor}>
                              {getFieldDecorator('maininvestor',{
                                initialValue:data.maininvestor,
                              })(
                                <Input placeholder="请输入项目名称"  disabled/>
                              )}
                            </Form.Item>
                          </Col>
                          <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                            <Form.Item label={fieldLabels.createdate}>
                              {getFieldDecorator('createdate',{
                                initialValue:momentt(data.createdate),
                              })(
                                <Input placeholder="请输入项目日期"  disabled/>
                              )}
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={16}>
                          <Col lg={6} md={12} sm={24}>
                            <Form.Item label={fieldLabels.tag}>
                              {getFieldDecorator('tag',{
                                initialValue:data.tag,
                              })(
                                <Input placeholder="请输入标签"  disabled/>
                              )}
                            </Form.Item>
                          </Col>
                          <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                            <Form.Item label={fieldLabels.currency}>
                              {getFieldDecorator('currency',{
                                initialValue:data.currency	,
                              })(
                                <Input placeholder="请输入币种"  disabled/>
                              )}
                            </Form.Item>
                          </Col>
                          <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                            <Form.Item label={fieldLabels.region}>
                              {getFieldDecorator('region',{
                                initialValue:[data.province,data.city,data.region],
                              })(
                                <Input placeholder="请输入项目名称"  disabled/>
                              )}
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={16}>
               {/*           <Col lg={6} md={12} sm={24}>
                            <Form.Item label=''>
                              {getFieldDecorator('istoken',{
                                valuePropName: 'checked',
                                initialValue:this.state.istoken,
                              })(
                                <Checkbox onChange={this.onChange}>是否涉及Token</Checkbox>
                              )}

                            </Form.Item>
                          </Col>*/}
                          <Col lg={24} md={24} sm={24}>
                            <Form.Item label={fieldLabels.address}>
                              {getFieldDecorator('address',{
                                initialValue:data.address,
                              })(
                                <Input placeholder={fieldLabels.address}  disabled/>
                              )}
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={16}>
                          <Col lg={6} md={12} sm={24}>
                            <Form.Item label={fieldLabels.contactperson}>
                              {getFieldDecorator('contactperson',{
                                initialValue:data.contactperson,
                              })(
                                <Input placeholder={fieldLabels.contactperson} disabled/>
                              )}
                            </Form.Item>
                          </Col>
                          <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                            <Form.Item label={fieldLabels.contactemail}>
                              {getFieldDecorator('contactemail',{
                                initialValue:data.contactemail,
                              })(
                                <Input placeholder={fieldLabels.contactemail} disabled/>
                              )}
                            </Form.Item>
                          </Col>
                          <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                            <Form.Item label={fieldLabels.contactmp}>
                              {getFieldDecorator('contactmp',{
                                initialValue:data.contactmp,
                              })(
                                <Input placeholder={fieldLabels.contactmp} disabled/>
                              )}
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={16}>
                          <Col lg={24} md={24} sm={24}>
                            <Form.Item label={fieldLabels.subjectdesc}>
                              {getFieldDecorator('subjectdesc',{
                                initialValue:data.subjectdesc,
                              })(
                                <TextArea rows={3} disabled/>
                              )}
                            </Form.Item>
                          </Col>
                        </Row>
                    </Card>
                  </Row>

                  <Row id='2' >
                    <Card title={formatMessage({id:'project.company.profile'})} className={styles.card} bordered={false}>
                      <BraftEditor
                        value={this.state.editorState}
                        disabled
                      />
                    </Card>
                  </Row>

                  <Row id='3' >
                    <Card title={formatMessage({id:'project.roadmap'})} className={styles.card} bordered={false}>
                      <BraftEditor
                        value={this.state.editorState1}
                        disabled
                      />
                    </Card>
                  </Row>

                  <Row id='4' >
                    <Card title={formatMessage({id:'project.Community'})} className={styles.card} bordered={false}>
                      <BraftEditor
                        value={this.state.editorState2}
                        disabled
                      />
                    </Card>
                  </Row>

                  <Row id='5'>
                    <Card title={formatMessage({id:'project.corporate.finance'})} className={styles.card} bordered={false}>
                    <Table
                        dataSource={finance}
                        columns={this.columns}
                      />
                    </Card>
                  </Row>

                  <Row id='6'>
                    <Card title={formatMessage({id:'project.shareholder.structure'})} className={styles.card} bordered={false}>
                     <Table
                        dataSource={projectShareholderList}
                        columns={this.shareholder}
                      />
                    </Card>
                  </Row>

                  <Row id='7'>
                    <Card title={formatMessage({id:'project.Financing.history'})} className={styles.card} bordered={false}>
                      <Table
                        dataSource={projectHistoryList}
                        columns={this.financing}
                      />
                    </Card>
                  </Row>

                  <Row id='8'>
                    <Card title={formatMessage({id:'project.License.information'})} className={styles.card} bordered={false}>
                     <Table
                        dataSource={projectLicenseList}
                        columns={this.license}
                      />
                    </Card>
                  </Row>

                  <Row id='9'>
                    <Card title={formatMessage({id:'project.allocation.plan'})} className={styles.card} bordered={false}>
                     <NormalTable
                        dataSource={projectDistributionList}
                        columns={this.distribution}
                      />
                    </Card>
                  </Row>

                  <Row id='10'>
                    <Card title={formatMessage({id:'project.team'})} className={styles.card} bordered={false}>
                      <Table
                        dataSource={projectTeamList}
                        columns={this.team}
                      />
                    </Card>
                  </Row>

                  <Row id='11'>
                    <Card title={formatMessage({id:'project.investment.plan'})} className={styles.card} bordered={false}>
                      <Form
                        layout="vertical"
                        hideRequiredMark
                        style={{ marginTop: 8 }}
                      >
                        <Row gutter={16}>
                          <Col lg={6} md={12} sm={24}>
                            <Form.Item label={inveLabels.investtype}>
                              {getFieldDecorator('investtype',{
                                // initialValue:'---',
                                initialValue:investplan?investplan.investtype:'',
                              })(
                                <Input placeholder="请输入投资类型" disabled/>
                              )}
                            </Form.Item>
                          </Col>
                          <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                            <Form.Item label={inveLabels.investtool}>
                              {getFieldDecorator('investtool',{
                                initialValue:investplan?investplan.investtool:'',
                              })(
                                <Input placeholder="请输入投资工具" disabled/>
                              )}
                            </Form.Item>
                          </Col>
                          <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                            <Form.Item label={inveLabels.fundname}>
                              {getFieldDecorator('fundname',{
                                initialValue:investplan?investplan.fundname:'',
                              })(
                                <Input placeholder="请输入基金名称" disabled/>
                              )}
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={16}>
                          <Col lg={6} md={12} sm={24}>
                            <Form.Item label={inveLabels.subscriptionamount}>
                              {getFieldDecorator('subscriptionamount',{
                                initialValue:investplan?investplan.subscriptionamount:'',
                              })(
                                <Input placeholder="订阅数量" disabled/>
                              )}
                            </Form.Item>
                          </Col>
                          <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                            <Form.Item label={inveLabels.noofshare}>
                              {getFieldDecorator('noofshare',{
                                initialValue:investplan?investplan.noofshare:'',
                              })(
                                <Input placeholder="股数" disabled/>
                              )}
                            </Form.Item>
                          </Col>
                          <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                            <Form.Item label={inveLabels.parvalue}>
                              {getFieldDecorator('parvalue',{
                                initialValue:investplan?investplan.parvalue:'',
                              })(
                                <Input placeholder="票面价格"  disabled/>
                              )}
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={16}>
                          <Col lg={6} md={12} sm={24}>
                            <Form.Item label={inveLabels.pricepershare}>
                              {getFieldDecorator('pricepershare',{
                                initialValue:investplan?investplan.pricepershare:'',
                              })(
                                <Input placeholder="每股价格"  disabled/>
                              )}
                            </Form.Item>
                          </Col>
                          <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                            <Form.Item label={inveLabels.noofcapital}>
                              {getFieldDecorator('noofcapital',{
                                initialValue:investplan?investplan.noofcapital:'',
                              })(
                                <Input placeholder="总资本"  disabled/>
                              )}
                            </Form.Item>
                          </Col>
                          <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                            <Form.Item label={inveLabels.currency}>
                              {getFieldDecorator('currency',{
                                initialValue:investplan?investplan.currency:'',
                              })(
                                <Input placeholder="币种"  disabled/>
                              )}
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={16}>
                          <Col lg={6} md={12} sm={24}>
                            <Form.Item label={inveLabels.shareholdingratio}>
                              {getFieldDecorator('shareholdingratio',{
                                initialValue:investplan?investplan.shareholdingratio:'',
                              })(
                                <Input placeholder="持股比例"  disabled/>
                              )}
                            </Form.Item>
                          </Col>
                          <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                            <Form.Item label={inveLabels.couponrate}>
                              {getFieldDecorator('couponrate',{
                                initialValue:investplan?investplan.couponrate:'',
                              })(
                                <Input placeholder="折扣率"  disabled/>
                              )}
                            </Form.Item>
                          </Col>
                          <Col lg={6} md={12} sm={24}>
                            <Form.Item label={inveLabels.yieldtomaturity}>
                              {getFieldDecorator('yieldtomaturity',{
                                initialValue:investplan?investplan.yieldtomaturity:'',
                              })(
                                <Input placeholder="到期收益率"  disabled/>
                              )}
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={16}>
                          <Col lg={6} md={12} sm={24}>
                            <Form.Item label={inveLabels.conversionprice}>
                              {getFieldDecorator('conversionprice',{
                                initialValue:investplan?investplan.conversionprice:'',
                              })(
                                <Input placeholder="转换价格"  disabled/>
                              )}
                            </Form.Item>
                          </Col>
                          <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                            <Form.Item label={inveLabels.shareholdingratio}>
                              {getFieldDecorator('shareholdingratio',{
                                initialValue:investplan?investplan.shareholdingratio:'',
                              })(
                                <Input placeholder="持股比例"  disabled/>
                              )}
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={16}>
                          <Col xl={{ span: 24 }} lg={{ span: 24 }} md={{ span: 24 }} sm={24}>
                            <Form.Item label={inveLabels.memo}>
                              {getFieldDecorator('memo',{
                                initialValue:investplan?investplan.memo:'',
                              })(
                                <TextArea placeholder="请输入备注" />
                              )}
                            </Form.Item>
                          </Col>
                        </Row>
                      </Form>
                    </Card>
                  </Row>

                  <Row id='12'>
                    <Card title="投资计划（Token）" className={styles.card} bordered={false}>
                      <Form layout="vertical" hideRequiredMark>
                        <Row gutter={16}>
                          <Col lg={6} md={12} sm={24}>
                            <Form.Item label={inveLabels.fundname}>
                              {getFieldDecorator('fundname',{
                                initialValue:investplan?investplan.fundname:'',
                              })(
                                <Input placeholder="基金名称" disabled/>
                              )}
                            </Form.Item>
                          </Col>
                          <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                            <Form.Item label={inveLabels.ipoexchange}>
                              {getFieldDecorator('ipoexchange',{
                                initialValue:investplan?investplan.ipoexchange:'',
                              })(
                                <Input placeholder="发行平台" disabled/>
                              )}
                            </Form.Item>
                          </Col>
                          <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                            <Form.Item label={inveLabels.currency}>
                              {getFieldDecorator('currency',{
                                initialValue:investplan?investplan.currency:'',
                              })(
                                <Input placeholder="币种" disabled/>
                              )}
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={16}>
                          <Col lg={6} md={12} sm={24}>
                            <Form.Item label={inveLabels.www}>
                              {getFieldDecorator('www',{
                                initialValue:investplan?investplan.www:'',
                              })(
                                <Input placeholder="网站" disabled/>
                              )}
                            </Form.Item>
                          </Col>
                          <Col xl={{ span: 16, offset: 2 }} lg={{ span: 18 }} md={{ span: 12 }} sm={24}>
                            <Form.Item label={inveLabels.briefdesc}>
                              {getFieldDecorator('briefdesc',{
                                initialValue:investplan?investplan.briefdesc:'',
                              })(
                                <Input placeholder="简介" disabled/>
                              )}
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={16}>
                          <Col xl={{ span: 24 }} lg={{ span: 24 }} md={{ span: 24 }} sm={24}>
                            <Form.Item label={inveLabels.memo}>
                              {getFieldDecorator('memo',{
                                initialValue:investplan?investplan.memo:'',
                              })(
                                <Input placeholder="备注" disabled/>
                              )}
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={16}>
                          <Col lg={6} md={12} sm={24}>
                            <Form.Item label={inveLabels.tag}>
                              {getFieldDecorator('tag',{
                                initialValue:investplan?investplan.tag:'',
                              })(
                                <Input placeholder="标签" disabled/>
                              )}
                            </Form.Item>
                          </Col>
                          <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                            <Form.Item label={inveLabels.equity}>
                              {getFieldDecorator('equity',{
                                initialValue:investplan?investplan.equity:'',
                              })(
                                <Input placeholder="机构" disabled/>
                              )}
                            </Form.Item>
                          </Col>
                          <Col lg={6} md={12} sm={24}>
                            <Form.Item label={inveLabels.tokentype}>
                              {getFieldDecorator('tokentype',{
                                initialValue:investplan?investplan.tokentype:'',
                              })(
                                <Input placeholder="代币类型" disabled/>
                              )}
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={16}>
                          <Col lg={6} md={12} sm={24}>
                            <Form.Item label={inveLabels.hardcap}>
                              {getFieldDecorator('hardcap',{
                                initialValue:investplan?investplan.hardcap:'',
                              })(
                                <Input placeholder="硬顶" disabled/>
                              )}
                            </Form.Item>
                          </Col>
                          <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                            <Form.Item label={inveLabels.softcap}>
                              {getFieldDecorator('softcap',{
                                initialValue:investplan?investplan.softcap:'',
                              })(
                                <Input placeholder="软顶" disabled/>
                              )}
                            </Form.Item>
                          </Col>
                          <Col lg={6} md={12} sm={24}>
                            <Form.Item label={inveLabels.totalsupply}>
                              {getFieldDecorator('totalsupply',{
                                initialValue:investplan?investplan.totalsupply:'',
                              })(
                                <Input placeholder="总供给" disabled/>
                              )}
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={16}>
                          <Col lg={6} md={12} sm={24}>
                            <Form.Item label={inveLabels.forsalerate}>
                              {getFieldDecorator('forsalerate',{
                                initialValue:investplan?investplan.forsalerate:'',
                              })(
                                <Input placeholder="可售比例" disabled/>
                              )}
                            </Form.Item>
                          </Col>
                          <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                            <Form.Item label={inveLabels.Lockup}>
                              {getFieldDecorator('lockup',{
                                initialValue:investplan?investplan.lockup:'',
                              })(
                                <Input placeholder="锁定数量" disabled/>
                              )}
                            </Form.Item>
                          </Col>
                          <Col lg={6} md={12} sm={24}>
                            <Form.Item label={inveLabels.valuation}>
                              {getFieldDecorator('valuation',{
                                initialValue:investplan?investplan.valuation:'',
                              })(
                                <Input placeholder="本轮估值" disabled/>
                              )}
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={16}>
                          <Col lg={6} md={12} sm={24}>
                            <Form.Item label={inveLabels.preinvestor}>
                              {getFieldDecorator('preinvestor',{
                                initialValue:investplan?investplan.preinvestor:'',
                              })(
                                <Input placeholder="上轮投资人" disabled/>
                              )}
                            </Form.Item>
                          </Col>
                          <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                            <Form.Item label={inveLabels.prevaluation}>
                              {getFieldDecorator('prevaluation',{
                                initialValue:investplan?investplan.prevaluation:'',
                              })(
                                <Input placeholder="上轮估值" disabled/>
                              )}
                            </Form.Item>
                          </Col>
                          <Col lg={6} md={12} sm={24}>
                            <Form.Item label={inveLabels.premium}>
                              {getFieldDecorator('premium',{
                                initialValue:investplan?investplan.premium:'',
                              })(
                                <Input placeholder="本轮估值溢价" disabled/>
                              )}
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={16}>
                          <Col lg={6} md={12} sm={24}>
                            <Form.Item label={inveLabels.forsale}>
                              {getFieldDecorator('forsale',{
                                initialValue:investplan?investplan.forsale:'',
                              })(
                                <Input placeholder="可售额" disabled/>
                              )}
                            </Form.Item>
                          </Col>
                          <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                            <Form.Item label={inveLabels.investor}>
                              {getFieldDecorator('investor',{
                                initialValue:investplan?investplan.investor:'',
                              })(
                                <Input placeholder="本轮投资人" disabled/>
                              )}
                            </Form.Item>
                          </Col>
                          <Col lg={6} md={12} sm={24}>
                            <Form.Item label={inveLabels.price}>
                              {getFieldDecorator('price',{
                                initialValue:investplan?investplan.price:'',
                              })(
                                <Input placeholder="价格" disabled/>
                              )}
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={16}>
                          <Col lg={6} md={12} sm={24}>
                            <Form.Item label={inveLabels.discount}>
                              {getFieldDecorator('discount',{
                                initialValue:investplan?investplan.discount:'',
                              })(
                                <Input placeholder="折扣" disabled/>
                              )}
                            </Form.Item>
                          </Col>
                          <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                            <Form.Item label={inveLabels.otherinvestors}>
                              {getFieldDecorator('otherinvestors',{
                                initialValue:investplan?investplan.otherinvestors:'',
                              })(
                                <Input placeholder="其他投资人" disabled/>
                              )}
                            </Form.Item>
                          </Col>
                        </Row>
                      </Form>
                    </Card>
                  </Row>
                </Form>
              </Col>
              <Col span={2}>
                <Anchor style={{marginTop:10}}>
              {/*    <Link href="#1" title="项目信息" />
                  <Link href="#2" title="公司简介" />
                  <Link href="#3" title="路线图" />
                  <Link href="#4" title="社区热度" />
                  <Link href="#5" title="公司财务" />
                  <Link href="#6" title="股东结构" />
                  <Link href="#7" title="融资历史" />
                  <Link href="#8" title="牌照信息" />
                  <Link href="#9" title="分配方案" />
                  <Link href="#10" title="团队" />
                  <Link href="#11" title="投资(股权)" />
                  <Link href="#12" title="投资(Token)" />*/}
                  <Link href="#1" title={formatMessage({id:'validation.projectinformation'})} />
                  <Link href="#2" title={formatMessage({id:'project.company.profile'})} />
                  <Link href="#3" title={formatMessage({id:'project.roadmap'})} />
                  <Link href="#4" title={formatMessage({id:'project.Community'})} />
                  <Link href="#5" title={formatMessage({id:'project.corporate.finance'})} />
                  <Link href="#6" title={formatMessage({id:'project.shareholder.structure'})} />
                  <Link href="#7" title={formatMessage({id:'project.Financing.history'})} />
                  <Link href="#8" title={formatMessage({id:'project.License.information'})}/>
                  <Link href="#9" title={formatMessage({id:'project.allocation.plan'})} />
                  <Link href="#10" title={formatMessage({id:'project.team'})} />
                  <Link href="#11" title={formatMessage({id:'project.investment.plan'})}/>
                  <Link href="#12" title={formatMessage({id:'project.investment'})} />
                </Anchor>
              </Col>
            </Row>
          </Card>
        )
      }
    ];
    return (
      <PageHeaderWrapper
        title={`项目：${ee}`}
        logo={
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
        }
        action={action}
        content={description(this.state.initData)}
        tabList={operationTabList}
        onTabChange={(key)=>this.onOperationTabChange(key)}
      >
      </PageHeaderWrapper>
    );
  }
}

export default FinancialAdd;
