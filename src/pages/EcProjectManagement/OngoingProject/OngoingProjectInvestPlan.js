import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import FooterToolbar from '@/components/FooterToolbar';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  InputNumber,
  Col,
  Row,
  Radio,
  Icon,
  Tooltip,
  AutoComplete,
  Upload,
  message,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import moment from 'moment';
import TextArea from 'antd/lib/input/TextArea';
import styles from './style.less';
import BraftEditor from 'braft-editor';
import storage from '@/utils/storage'
import router from 'umi/router';
const Option = Select.Option;

const dateFormat = 'YYYY-MM-DD';

const FormItem = Form.Item;
const Dragger = Upload.Dragger;

const fieldLabels = {
  stocktype:'股权类型',
  investtype: '投资类型',
  investtool: '投资工具',
  fundname: '基金名称',
  subscriptionamount: '认购金额',
  noofshare: '股数',
  parvalue: '票面价格',
  pricepershare: '每股价格',
  currency: '币种',
  noofcapital: '总资本',
  shareholdingratio: '持股比例',
  memo: '备注',
  investmentamount: '投资数量',
  couponrate: '折扣率',
  yieldtomaturity: '到期收益率',
  conversionprice: '转换价格',
  dateofmaturity: '到期日',
  ipoexchange: '发行平台',
  issuesize: '发行规模',
  ipodate: '拟上市时间',
  ipoprice: '上市价格',
  briefdesc: '简介',
  www: '网站',
  hardcap: '硬顶',
  softcap: '软顶',
  totalsupply: '总供给',
  forsalerate: '可售比率',
  Lockup: '锁定数量',
  tag: '标签',
  equity: '机构',
  valuation: '本轮估值',
  preinvestor: '上轮投资人',
  prevaluation: '上轮估值',
  forsale: '可售额',
  investor: '本轮投资人',
  price: '价格',
  discount: '折扣',
  tokentype: '代币类型',
  otherinvestors: '其他投资人',
  premium: '本轮估值溢价',
};

const props = {
  name: 'file',
  multiple: true,
  action: '//jsonplaceholder.typicode.com/posts/',
  onChange(info) {
    const status = info.file.status;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

@connect(({ plan,loading }) => ({
  plan,
  submitting: loading.models.plan,
}))
@Form.create()
class OngoingProjectIRForms extends PureComponent {
  state = {
    investtype:1,
    dataSource:{}, //返回来的所有数据
    project_id:null,
    project_status:'', //项目状态
    dataList:[],  //存储基金
    fund_id:null,  // 基金id
    id:null,
    isId:false,
  };

  validate = ()=>  {
    const { dispatch, form } = this.props;
    const user = storage.get("userinfo");
    const corp_id = user.corp.id;
    form.validateFieldsAndScroll((err, values) => {
      if(!this.state.fund_id){
        message.error("请选择基金名臣");
        return
      }
      if(!values.subscriptionamount){
        message.error("认购金额不能为空");
        return
      }
      if(!values.noofshare){
        message.error("股数不能为空");
        return
      }
      if(!values.currency){
        message.error("币种不能为空");
        return
      }
      if(!values.preinvestor){
        message.error("上轮投资人不能为空");
        return
      }
      if(!values.investor){
        message.error("本轮投资人不能为空");
        return
      }
      if(!values.otherinvestors){
        message.error("其他投资人不能为空");
        return
      }
      if(this.state.investtype === '1'){ //股权投资
        if(!values.stocktype){
          message.error("股权类型不能为空");
          return
        }
        if(!values.investtool){
          message.error("投资工具不能为空");
          return
        }
        if(!values.pricepershare){
          message.error("每股价格不能为空");
          return
        }
        if(!values.parvalue){
          message.error("票面价格不能为空");
          return
        }
        if(!values.noofcapital){
          message.error("总资本不能为空");
          return
        }
        if(!/^(\d+)((?:\.\d+)?)$/.test(values.shareholdingratio)){
          message.error("持股比例不合法");
          return
        }
        if(!/^(\d+)((?:\.\d+)?)$/.test(values.couponrate)){
          message.error("折扣率不合法");
          return
        }
        if(!values.yieldtomaturity){
          message.error("到期收益率不能为空");
          return
        }
        if(!values.conversionprice){
          message.error("转换价格不能为空");
          return
        }
      }
      if(this.state.investtype === '2'){
        if(!values.ipoexchange){
          message.error("发行平台不能为空");
          return
        }
        if(!/^((ht|f)tps?:)\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g.test(values.www)){
          message.error("网址不合法");
          return
        }
        if(!values.tag){
          message.error("标签不能为空");
          return
        }
        if(!values.tokentype){
          message.error("代币类型不能为空");
          return
        }
        if(!values.hardcap){
          message.error("硬顶不能为空");
          return
        }
        if(!values.softcap){
          message.error("软顶不能为空");
          return
        }
        if(!values.totalsupply){
          message.error("总供给不能为空");
          return
        }
        if(!values.forsalerate){
          message.error("可售比率不能为空");
          return
        }
        if(!values.lockup){
          message.error("锁定数量不能为空");
          return
        }
        if(!values.valuation){
          message.error("本轮估值不能为空");
          return
        }
        if(!values.prevaluation){
          message.error("上轮估值不能为空");
          return
        }
        if(!values.premium){
          message.error("本轮估值溢价不能为空");
          return
        }
        if(!values.forsale){
          message.error("可售额不能为空");
          return
        }
        if(!values.price){
          message.error("价格不能为空");
          return
        }
        if(!/^(\d+)((?:\.\d+)?)$/.test(values.discount)){
          message.error("折扣不合法");
          return
        }
      }

      const obj = {
        reqData:{
          project_id: this.state.project_id,
          fund_id:this.state.fund_id,
          corp_id,
          investtype:values.investtype?Number(values.investtype):null, // 投资类型
          stocktype:values.stocktype?Number(values.stocktype):null,  //股权类型
          investtool:values.investtool,  // 投资工具
          subscriptionamount:values.subscriptionamount, // 认购金额
          noofshare:values.noofshare?Number(values.noofshare):null,   //股数
          currency: values.currency, //币种
          pricepershare: values.pricepershare?Number(values.pricepershare):null, //每股价格
          parvalue:values.parvalue?Number(values.parvalue):null, //票面价格
          noofcapital:values.noofcapital?Number(values.noofcapital):null, //总资本
          shareholdingratio: values.shareholdingratio?Number(values.shareholdingratio):null,//持股比例
          couponrate:values.couponrate?Number(values.couponrate):null, //折扣率
          yieldtomaturity:values.yieldtomaturity?Number(values.yieldtomaturity):null, //到期收益率
          conversionprice:values.conversionprice?Number(values.conversionprice):null, //转换价格
          ipoexchange:values.ipoexchange?Number(values.ipoexchange):null, //发行平台
          www: values.www, //网站网址
          briefdesc: values.briefdesc, //简介
          memo: values.memo, //备注
          tag:values.tag, //标签
          tokentype:values.tokentype, //代币类型
          hardcap: values.hardcap?Number(values.hardcap).toFixed(4):null,  //硬顶
          softcap: values.softcap?Number(values.softcap):null,  //软顶
          totalsupply: values.totalsupply?Number(values.totalsupply):null, //总供给
          forsalerate: values.forsalerate?Number(values.forsalerate).toFixed(4):null,  //可售比率
          lockup: values.lockup?Number(values.lockup):null, //锁定数量
          valuation: values.valuation?Number(values.valuation).toFixed(4):null, //本轮估值
          prevaluation:values.prevaluation? Number(values.prevaluation):null, //上轮估值
          premium:values.premium?Number(values.premium).toFixed(4):null, //本轮估值溢价
          forsale:values.forsale?Number(values.forsale):null, //可售额
          price: values.price?Number(values.price):null,  //价格
          discount: values.discount?Number(values.discount):null, //折扣
          preinvestor:values.preinvestor,  //上轮投资人(逗号分隔)
          investor: values.investor, //本轮投资人(逗号分隔)
          otherinvestors:values.otherinvestors,  //其他投资人(逗号分隔)
          project_status:this.state.project_status //项目状态
        }
      };
      if(this.state.id){
        obj.reqData.id = this.state.id;
      }
      console.log("obj",obj)
      dispatch({
        type:'plan/update',
        payload:obj,
        callback:(res)=>{
          if(res.errCode === '0'){
            message.success("添加成功",1.5,()=>{
              router.push('/projectmanagement/ongoingproject/list');
            });
            return
          }
          message.error("提交失败",1.5);
          return
        }
      })
    });
  };

  backClick = ()=>{
    this.props.history.go(-1)
  }

  componentDidMount(){
    const { dispatch} = this.props;
    if(this.props.location.state){
      const dataSource = this.props.location.state.query;
      const project_status = dataSource.query.project_status;
      const project_id = dataSource.query.project_id;
      this.setState({
        project_id,
        project_status
      });
      dispatch({
        type: 'plan/fetch',
        payload:{
          reqData:{
            id:project_id
          }
        },
        callback:async (res)=>{
            if(res.length && res[0]!=null){
              await this.setState({
              dataSource: res[0],
              fund_id:res[0].fund_id,
              id:res[0].id
            });
            if(res[0].investtype){
              await this.setState({
                investtype: res[0].investtype + ''
              })
            }
          }

          if(this.state.dataSource.parvalue && this.state.dataSource.noofshare){
            await this.setState({
              dataSource:{
                ...this.state.dataSource,
                noofcapital:this.state.dataSource.parvalue * this.state.dataSource.noofshare
              }
            })
          }

          if(this.state.dataSource.hardcap  && this.state.dataSource.forsalerate ){
            await this.setState({
              dataSource:{
                ...this.state.dataSource,
                valuation:this.state.dataSource.hardcap / this.state.dataSource.forsalerate
              }
            })
          }

          if(this.state.dataSource.valuation  && this.state.dataSource.prevaluation ){
            await this.setState({
              dataSource:{
                ...this.state.dataSource,
                premium:this.state.dataSource.valuation / this.state.dataSource.prevaluation
              }
            })
          }

        }
      });
    }
  }

  // 股数
  gushu = (e) =>{
    if(this.state.dataSource.parvalue){
      this.setState({
        dataSource:{
          ...this.state.dataSource,
          noofshare: Number(e.target.value),
          noofcapital:this.state.dataSource.parvalue * Number(e.target.value)
        }
      });
      return
    }
    this.setState({
      dataSource:{
        ...this.state.dataSource,
        noofshare: Number(e.target.value)
      }
    })
  };

  // 票面价格
  parvalueValue = (e)=>{
    if(this.state.dataSource.noofshare){
      this.setState({
        dataSource: {
          ...this.state.dataSource,
          parvalue: Number(e.target.value),
          noofcapital:this.state.dataSource.noofshare * Number(e.target.value)
        }
      });
      return
    }
    this.setState({
      dataSource:{
        ...this.state.dataSource,
        parvalue: Number(e.target.value)
      }
    })
  };

  //硬顶
  yinding =async (e)=>{
    if(this.state.dataSource.forsalerate){
      const valuation = (Number(e.target.value) / this.state.dataSource.forsalerate).toFixed(4);
      const prevaluation = this.state.dataSource.prevaluation || 0;
      this.setState({
        dataSource: {
          ...this.state.dataSource,
          hardcap : Number(e.target.value),
          valuation,
          premium: (valuation / prevaluation).toFixed(4)
        }
      });
      return
    }
    this.setState({
      dataSource:{
        ...this.state.dataSource,
        hardcap : Number(e.target.value)
      }
    });
  };

  //总供给
  onTotalsupply=(e)=>{
    if(this.state.dataSource.forsalerate){
      const forsale = (this.state.dataSource.forsalerate * Number(e.target.value)).toFixed(4);
      this.setState({
        dataSource: {
          ...this.state.dataSource,
          totalsupply : Number(e.target.value),
          forsale
        }
      });
      return
    }
    this.setState({
      dataSource:{
        ...this.state.dataSource,
        totalsupply : Number(e.target.value)
      }
    });
  }

  //可售比率
  keshoubi = (e)=>{
    if(this.state.dataSource.hardcap){
      const valuation = (this.state.dataSource.hardcap / Number(e.target.value)).toFixed(4);
      const prevaluation = this.state.dataSource.prevaluation || 0;
      const totalsupply = this.state.dataSource.totalsupply || 0;
      const forsale = (Number(totalsupply) * Number(e.target.value)).toFixed(4);
      this.setState({
        dataSource: {
          ...this.state.dataSource,
          forsalerate : Number(e.target.value),
          valuation,
          premium: (valuation / prevaluation).toFixed(4),
          forsale
        }
      });
      return
    }
    this.setState({
      dataSource:{
        ...this.state.dataSource,
        forsalerate : Number(e.target.value)
      }
    });

  };

  // 上轮
  shanglun = (e)=>{
    if(this.state.dataSource.valuation){
      this.setState({
        dataSource: {
          ...this.state.dataSource,
          prevaluation : Number(e.target.value),
          premium : (this.state.dataSource.valuation / Number(e.target.value)).toFixed(4)
        }
      });
      return
    }
    this.setState({
      dataSource:{
        ...this.state.dataSource,
        prevaluation : Number(e.target.value)
      }
    })
  };


  renderEquity(getFieldDecorator){
    return (
      <Row>
        <Row gutter={16}>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label={fieldLabels.stocktype}>
              {getFieldDecorator('stocktype',{
                initialValue: this.state.dataSource.stocktype ? this.state.dataSource.stocktype:'1',
                rules: [
                  {
                    required: true,
                    message:'请选择股权类型'
                  }
                ]
              })(
                <Select placeholder="股权类型">
                  <Option value="1">新股</Option>
                  <Option value="2">老股</Option>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label={fieldLabels.investtool}>
              {getFieldDecorator('investtool',{
                initialValue: this.state.dataSource.investtool?this.state.dataSource.investtool:'common',
                rules: [
                  {
                    required: true,
                    message:'请选择投资工具'
                  }
                ]
              })(
                <Select placeholder="请选择投资工具">
                  <Option value="common">普通股</Option>
                  <Option value="prefer">优先股</Option>
                  <Option value="cb">债转股</Option>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
            <Form.Item label={fieldLabels.pricepershare}>
              {getFieldDecorator('pricepershare', {
                initialValue: this.state.dataSource.pricepershare?this.state.dataSource.pricepershare:'',
                rules: [
                  {
                    required: true,
                    message:'请输入每股价格'
                  }
                ]
              })(<Input placeholder="每股价格"  type='number'/>)}
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label={fieldLabels.parvalue}>
              {getFieldDecorator('parvalue', {
                initialValue: this.state.dataSource.parvalue?this.state.dataSource.parvalue:'',
                rules: [
                  {
                    required: true,
                    message:'请输入票面价格'
                  }
                ]
              })(<Input placeholder="票面价格" type='number' onChange={(e)=>this.parvalueValue(e)}/>)}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label={fieldLabels.noofcapital}>
              {getFieldDecorator('noofcapital', {
                initialValue: this.state.dataSource.noofcapital ? this.state.dataSource.noofcapital: '',
                rules: [
                  {
                    required: true,
                    message:'请输入总资本'
                  }
                ]
              })(<Input placeholder="总资本"  disabled/>)}
            </Form.Item>
          </Col>
          <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
            <Form.Item label={fieldLabels.shareholdingratio}>
              {getFieldDecorator('shareholdingratio', {
                initialValue: this.state.dataSource.shareholdingratio?this.state.dataSource.shareholdingratio:'',
                rules: [
                  { required: true, message: '请输入持股比例' },
                  {
                    pattern: /^(\d+)((?:\.\d+)?)$/,
                    message: '请输入合法持股比例数字',
                  },
                ],
              })(<Input placeholder="请输入持股比例" />)}
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label={fieldLabels.couponrate}>
              {getFieldDecorator('couponrate', {
                initialValue: this.state.dataSource.couponrate?this.state.dataSource.couponrate:'',
                rules: [
                  { required: true, message: '请输入折扣率' },
                  {
                    pattern: /^(\d+)((?:\.\d+)?)$/,
                    message: '请输入合法折扣率数字',
                  },
                ],
              })(<Input placeholder="请输入折扣率" type='number'/>)}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label={fieldLabels.yieldtomaturity}>
              {getFieldDecorator('yieldtomaturity', {
                initialValue: this.state.dataSource.yieldtomaturity?this.state.dataSource.yieldtomaturity:'',
                rules: [
                  {
                    required: true,
                    message:'请输入到期收益率'
                  }
                ]
              })(<Input placeholder="到期收益率"  type='number'/>)}
            </Form.Item>
          </Col>
          <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
            <Form.Item label={fieldLabels.conversionprice}>
              {getFieldDecorator('conversionprice', {
                initialValue: this.state.dataSource.conversionprice?this.state.dataSource.conversionprice:'',
                rules: [
                  {
                    required: true,
                    message:'请输入转换价格'
                  }
                ]
              })(<Input placeholder="转换价格"  type='number'/>)}
            </Form.Item>
          </Col>
        </Row>

      </Row>
    )
  }

  renderToken(getFieldDecorator){
      return (
        <Row>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label={fieldLabels.ipoexchange}>
                {getFieldDecorator('ipoexchange', {
                  initialValue: !this.state.dataSource.ipoexchange? '1':this.state.dataSource.ipoexchange + '',
                  rules: [{ required: true, message: '发行平台' }],
                })(
                  <Select placeholder="请选择发行平台">
                    <Option value="1">Coinmarketcap</Option>
                    <Option value="2">Huobi</Option>
                    <Option value="3">Binance</Option>
                    <Option value="4">OKEX</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item label={fieldLabels.www}>
                {getFieldDecorator('www',{
                  initialValue: this.state.dataSource.www?this.state.dataSource.www:'',
                  rules: [
                    { required: true, message: '请输入网站网址' },
                    {
                      pattern: /^((ht|f)tps?:)\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g,
                      message: '请输入合法网址',
                    },
                  ],
                })(<Input placeholder="请输入网站网址" />)}
              </Form.Item>
            </Col>
            <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
              <Form.Item label={fieldLabels.tag}>
                {getFieldDecorator('tag', {
                  initialValue: this.state.dataSource.tag?this.state.dataSource.tag:'',
                  rules: [{ required: true, message: '请输入标签' }],
                })(<Input placeholder="请输入标签" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label={fieldLabels.tokentype}>
                {getFieldDecorator('tokentype', {
                  initialValue: this.state.dataSource.tokentype?this.state.dataSource.tokentype:'',
                  rules: [{ required: true, message: '请输入代币类型' }],
                })(<Input placeholder="请输入代币类型" />)}
              </Form.Item>
            </Col>
            <Col  xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item label={fieldLabels.hardcap}>
                {getFieldDecorator('hardcap', {
                  initialValue: this.state.dataSource.hardcap?this.state.dataSource.hardcap:'',
                  rules: [
                    { required: true, message: '请输入硬顶' },
                    {
                      pattern: /^(\d+)((?:\.\d+)?)$/,
                      message: '请输入合法硬顶数字',
                    },
                  ],
                })(<Input placeholder="请输入硬顶" type='number' onChange={(e)=>this.yinding(e)}/>)}
              </Form.Item>
            </Col>
            <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
              <Form.Item label={fieldLabels.softcap}>
                {getFieldDecorator('softcap', {
                  initialValue: this.state.dataSource.softcap?this.state.dataSource.softcap:'',
                  rules: [
                    { required: true, message: '请输入软顶' },
                    {
                      pattern: /^(\d+)((?:\.\d+)?)$/,
                      message: '请输入合法软顶数字',
                    },
                  ],
                })(<Input placeholder="请输入软顶" type='number'/>)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.totalsupply}>
                  {getFieldDecorator('totalsupply', {
                    initialValue: this.state.dataSource.totalsupply?this.state.dataSource.totalsupply:'',
                    rules: [
                      { required: true, message: '请输入总供给' },
                      {
                        pattern: /^(\d+)((?:\.\d+)?)$/,
                        message: '请输入合法总供给数字',
                      },
                    ],
                  })(<Input placeholder="请输入总供给" type='number' onChange={(e)=>this.onTotalsupply(e)}/>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.forsalerate}>
                  {getFieldDecorator('forsalerate', {
                    initialValue: this.state.dataSource.forsalerate?this.state.dataSource.forsalerate:'',
                    rules: [
                      { required: true, message: '请输入可售比率' },
                      {
                        pattern: /^(\d+)((?:\.\d+)?)$/,
                        message: '请输入合法可售比率数字',
                      },
                    ],
                  })(<Input placeholder="请输入可售比率" type='number' onChange={(e)=>this.keshoubi(e)}/>)}
                </Form.Item>
            </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.Lockup}>
                  {getFieldDecorator('lockup', {
                    initialValue: this.state.dataSource.lockup?this.state.dataSource.lockup:'',
                    rules: [
                      { required: true, message: '请输入锁定数量' },
                      {
                        pattern: /^(\d+)((?:\.\d+)?)$/,
                        message: '请输入合法锁定数量数字',
                      },
                    ],
                  })(<Input placeholder="请输入锁定数量" type='number' />)}
                </Form.Item>
              </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label={fieldLabels.valuation}>
                {getFieldDecorator('valuation', {
                  initialValue: this.state.dataSource.valuation?this.state.dataSource.valuation:'',
                  rules: [
                    { required: true, message: '请输入本轮估值' },
                    {
                      pattern: /^(\d+)((?:\.\d+)?)$/,
                      message: '请输入合法本轮估值数字',
                    },
                  ],
                })(<Input placeholder="本轮估值(计算得到)" type='number' disabled/>)}
              </Form.Item>
            </Col>
            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item label={fieldLabels.prevaluation}>
                {getFieldDecorator('prevaluation', {
                  initialValue: this.state.dataSource.prevaluation?this.state.dataSource.prevaluation:'',
                  rules: [
                    { required: true, message: '请输入上轮估值' },
                    {
                      pattern: /^(\d+)((?:\.\d+)?)$/,
                      message: '请输入合法上轮估值数字',
                    },
                  ],
                })(<Input placeholder="请输入上轮估值" type='number' onChange={(e)=>this.shanglun(e)}/>)}
              </Form.Item>
            </Col>
            <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
              <Form.Item label={fieldLabels.premium}>
                {getFieldDecorator('premium', {
                  initialValue: this.state.dataSource.premium ? this.state.dataSource.premium:'',
                  rules: [
                    { required: true, message: '请输入本轮估值溢价' },
                    {
                      pattern: /^(\d+)((?:\.\d+)?)$/,
                      message: '请输入合法本轮估值溢价数字',
                    },
                  ],
                })(<Input placeholder="本轮估值溢价(计算得到)" type='number' disabled/>)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.forsale}>
                  {getFieldDecorator('forsale', {
                    initialValue: this.state.dataSource.forsale?this.state.dataSource.forsale:'',
                    rules: [
                      { required: true, message: '请输入可售额' },
                      {
                        pattern: /^(\d+)((?:\.\d+)?)$/,
                        message: '请输入合法可售额数字',
                      },
                    ],
                  })(<Input placeholder="请输入可售额"  disabled type='number'/>)}
                </Form.Item>
            </Col>
            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item label={fieldLabels.price}>
                {getFieldDecorator('price', {
                  initialValue: this.state.dataSource.price?this.state.dataSource.price:'',
                  rules: [
                    { required: true, message: '请输入价格' },
                    {
                      pattern: /^(\d+)((?:\.\d+)?)$/,
                      message: '请输入合法可售额数字',
                    },
                  ],
                })(<Input placeholder="请输入价格" type='number'/>)}
              </Form.Item>
            </Col>
            <Col  xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
              <Form.Item label={fieldLabels.discount}>
                {getFieldDecorator('discount', {
                  initialValue: this.state.dataSource.discount?this.state.dataSource.discount:'',
                  rules: [
                    { required: true, message: '请输入折扣' },
                    {
                      pattern: /^(\d+)((?:\.\d+)?)$/,
                      message: '请输入合法折扣数字',
                    },
                  ],
                })(<Input placeholder="请输入折扣" type='number' />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
              <Col lg={12} md={12} sm={24}>
                <Form.Item label={fieldLabels.briefdesc}>
                  {getFieldDecorator('briefdesc',{
                    initialValue: this.state.dataSource.briefdesc?this.state.dataSource.briefdesc:'',
                  })(<TextArea placeholder="请输入简介" />)}
                </Form.Item>
              </Col>
          </Row>
          <Row gutter={16}>
            <Col xl={{ span: 24 }} lg={{ span: 24 }} md={{ span: 24 }} sm={24}>
              <Form.Item label={fieldLabels.memo}>
                {getFieldDecorator('memo',{
                  initialValue: this.state.dataSource.memo?this.state.dataSource.memo:'',
                })(<TextArea placeholder="请输入备注" />)}
              </Form.Item>
            </Col>
          </Row>
        </Row>
      )
  }

  valueInvesttype = async (value)=>{
    await this.setState({
      investtype:value
    });
  };

  render() {
    const { submitting,dispatch } = this.props;
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    const { dataSource } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    const user = storage.get("userinfo");
    const id = user.corp.id;

    const options = this.state.dataList.map(group => (
      <Option key={group.id}>{group.name}</Option>
    ));


    return (
      <PageHeaderWrapper>
        <Form
          onSubmit={this.handleSubmit}
          layout="vertical"
          hideRequiredMark
          style={{ marginTop: 8 }}
        >
          <Row>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label={fieldLabels.investtype}>
                {getFieldDecorator('investtype',{
                  initialValue: !this.state.dataSource.investtype ? '2':this.state.dataSource.investtype + ''
                })(
                  <Select placeholder="请选择投资类型" onChange={this.valueInvesttype}>
                    <Option value="2">token</Option>
                    <Option value="1">股权</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>

          <Card title="共同" className={styles.card} bordered={false} >
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={fieldLabels.fundname}>
                    {getFieldDecorator('fundname', {
                      initialValue: dataSource.fundname? dataSource.fundname:'',
                      rules: [{ required: true, message: '请选择所用基金' }],
                  })(
                      <AutoComplete
                        dataSource={options}
                        onFocus={()=>{
                          dispatch({
                            type:'plan/find',
                            payload: {
                              id,
                              pageSize:1000
                            },
                            callback:(res)=>{
                              this.setState({
                                dataList: res
                              });
                            }
                          })
                        }}
                        onSelect={async (value,option)=>{
                          await this.setState({
                              fund_id: Number(option.key)
                          });
                        }}
                        filterOption={(inputValue, option) =>
                          option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                        }
                        placeholder="请选择所用基金"
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.subscriptionamount}>
                  {getFieldDecorator('subscriptionamount', {
                    initialValue: dataSource.subscriptionamount?dataSource.subscriptionamount:'',
                    rules: [{ required: true, message: '认购金额' }],
                  })(<Input placeholder="认购金额" type='number'/>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.noofshare}>
                  {getFieldDecorator('noofshare', {
                    initialValue: dataSource.noofshare?dataSource.noofshare:'',
                    rules: [
                      { required: true, message: '请输入股数' },
                      {
                        pattern: /^(\d+)((?:\.\d+)?)$/,
                        message: '请输入合法股数数字',
                      },
                    ],
                  })(<Input placeholder="请输入股数" type='number' onChange={(e)=> this.gushu(e)}/>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.currency}>
                  {getFieldDecorator('currency', {
                    initialValue: dataSource.currency?dataSource.currency:'',
                    rules: [{ required: true, message: '请选择币种' }],
                  })(
                    <Select placeholder="请选择币种">
                      <Option value="rmb">人民币</Option>
                      <Option value="usd">美元</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={fieldLabels.preinvestor}>
                    {getFieldDecorator('preinvestor', {
                      initialValue: dataSource.preinvestor?dataSource.preinvestor:'',
                      rules: [{ required: true, message: '请输入上轮投资人' }],
                    })(<Input placeholder="请输入上轮投资人"/>)}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                  <Form.Item label={fieldLabels.investor}>
                    {getFieldDecorator('investor', {
                      initialValue: dataSource.investor?dataSource.investor:'',
                      rules: [{ required: true, message: '请输入本轮投资人' }],
                    })(<Input placeholder="请输入本轮投资人"/>)}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                  <Form.Item label={fieldLabels.otherinvestors}>
                    {getFieldDecorator('otherinvestors', {
                      initialValue: dataSource.otherinvestors?dataSource.otherinvestors:'',
                      rules: [{ required: true, message: '请输入其他投资人' }],
                    })(<Input placeholder="请输入其他投资人"/>)}
                  </Form.Item>
                </Col>
              </Row>
          </Card>

          <Card title={this.state.investtype === '1' ? '股权':'Token' } className={styles.card} bordered={false}>
            {
              this.state.investtype === '1' ? this.renderEquity(getFieldDecorator):this.renderToken(getFieldDecorator)
            }
          </Card>
        </Form>
        <FooterToolbar style={{ width: '100%' }}>
          {/* {this.getErrorInfo()} */}
          <Button
            onClick={this.backClick}
          >取消</Button>
          <Button type="primary" onClick={()=>this.validate()} loading={submitting}>
            提交
          </Button>


        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}

export default OngoingProjectIRForms;
