import React, { PureComponent } from 'react';
import {
  Card,
  Button,
  Form,
  message,
  Col,
  Row,
  DatePicker,
  TimePicker,
  Input,
  Select,
  Popover,
  InputNumber,
} from 'antd';
import BraftEditor from 'braft-editor';
import { formatMessage, FormattedMessage } from 'umi/locale';
import 'braft-editor/dist/index.css';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FooterToolbar from '@/components/FooterToolbar';
import router from 'umi/router';

const fieldLabels = {
  name: 'LP名称',
  shortname: 'LP简称',
  type: '性质',
  contactperson: '联系人',
  contactinfo: '联系方式',
  email: '电子邮件',
  subscribed: '认缴投资额',
  payin: '实缴投资额',
  paydate: '缴纳时间',
  memo: '备注',
};

const { Option } = Select;
const { TextArea } = Input;
@connect(({ businessadmin, loading }) => ({
  businessadmin,
  submitting: loading.effects['businessadmin/add'],
}))

@Form.create()
class BusinessUpdate extends PureComponent {
  state = {
    width: '100%',
    initData:{},
  };

  submitContent = async () => {
    // 在编辑器获得焦点时按下ctrl+s会执行此方法
    // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
    const htmlContent = this.state.editorState.toHTML();
    const result = await saveEditorContent(htmlContent);
  };
  componentDidMount() {
    const { dispatch } = this.props;
    if(this.props.location.state){
      this.setState({
        addid:this.props.location.state.areaclid,
        title:this.props.location.state.title,
        initData:this.props.location.state
      })

    }
  }
  handleEditorChange = editorState => {
    this.setState({ editorState });
  };
  validate () {
    const { dispatch,form} = this.props;
    form.validateFields((err, fieldsValue) => {
      if(!fieldsValue.code && !fieldsValue.name  && !fieldsValue.shortname && !fieldsValue.areaclid
        && !fieldsValue.custlevel && !fieldsValue.phone && !fieldsValue.email && !fieldsValue.address && !fieldsValue.zipcode
        && !fieldsValue.regmoney  && !fieldsValue.website  && !fieldsValue.respsnname && !fieldsValue.uscc && !fieldsValue.memo
        && !fieldsValue.contact && !fieldsValue.bankname && !fieldsValue.bankaccount
      ){
        return
      }
      const obj = {
        ...fieldsValue,
        id:this.state.initData.id,
        areaclid:this.state.initData.areaclid,
        custlevel:Number(fieldsValue['custlevel']),
        regmoney:Number(fieldsValue['regmoney']),
        custtype:'1'
      };
      const object = {
        reqData:{
          ...obj
        }
      }
      dispatch({
        type:'businessadmin/add',
        payload: object,
        callback:()=>{
          message.success('编辑成功',1.2,()=>{
            router.push('/fundamental/businessadmin/businessadd');
          });

        }
      })
    });
  }
  backClick = ()=>{
    this.props.history.go(-1)
  }
  render() {
    const {
      form: { getFieldDecorator },
      submitting,
      dispatch,
      form
    } = this.props;
    const { width, initData } = this.state;
    return (
      <PageHeaderWrapper>
        <Card title='客商管理'  bordered={false}>
          <Form layout="vertical" hideRequiredMark onSubmit={this.handleSubmit}>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label='客商编码'>
                  {getFieldDecorator('code', {
                    initialValue:initData.code?initData.code:'',
                    rules: [{ required: true, message: '客商编码'}],
                  })(<Input placeholder='客商编码' />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label='客商名称'>
                  {form.getFieldDecorator('name', {
                    initialValue:initData.name?initData.name:'',
                    rules: [{ required: true, message:'客商名称' }],
                  })(<Input placeholder='客商名称' />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label='所属地区'>
                  {form.getFieldDecorator('areaclid', {
                    initialValue:initData.areaclname?initData.areaclname:'',
                    rules: [{ required: true, message: '所属地区' }],
                  })(
                    <Input placeholder='所属地区' disabled/>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label='简称'>
                  {form.getFieldDecorator('shortname', {
                    initialValue:initData.shortname?initData.shortname:'',
                    rules: [{ required: true, message: '简称' }],
                  })(
                    <Input placeholder='简称' />
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label='客商类型'>
                  {form.getFieldDecorator('custtype', {
                    rules: [{ required: true, message: '客商类型' }],
                    initialValue: '客商'
                  })(
                    <Input disabled/>
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label='电话'>
                  {form.getFieldDecorator('phone',{
                    initialValue:initData.phone?initData.phone:'',
                    rules: [
                      {
                        message: '请输入合法电话',
                      },
                    ],
                  })(<Input placeholder='电话' />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label='网址'>
                  {form.getFieldDecorator('website', {
                    initialValue:initData.website?initData.website:'',
                    rules: [
                      { required: true, message:'网址' },
                      {
                        message: '网址',
                      },
                    ],
                  })(<Input placeholder='网址'/>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label='等级'>
                  {form.getFieldDecorator('custlevel', {
                    initialValue:initData.custlevel?initData.custlevel:'',
                    rules: [
                      { required: true, message:'等级'},
                    ],
                  })(<Input placeholder='等级' />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label='法人姓名'>
                  {form.getFieldDecorator('respsnname', {
                    initialValue:initData.respsnname?initData.respsnname:'',
                    rules: [{ required: true, message:'法人姓名' }],
                  })(<Input placeholder='法人姓名' />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label='地址'>
                  {form.getFieldDecorator('address', {
                    initialValue:initData.address?initData.address:'',
                    rules: [
                      { required: true, message:'地址' },
                      {
                        message: '请输入地址',
                      },
                    ],
                  })(<Input placeholder='地址'/>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label='邮编'>
                  {form.getFieldDecorator('zipcode', {
                    initialValue:initData.zipcode?initData.zipcode:'',
                    rules: [
                      { required: true, message:'邮编'},
                      {
                        // pattern: /^(\d+)((?:\.\d+)?)$/,
                        message: '请输入合法邮编',
                      },
                    ],
                  })(<Input placeholder='邮编' />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label='统一社会信用代码'>
                  {form.getFieldDecorator('uscc', {
                    initialValue:initData.uscc?initData.uscc:'',
                    rules: [{ required: true, message:'统一社会信用代码' }],
                  })(<Input placeholder='统一社会信用代码' />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label='联系人'>
                  {form.getFieldDecorator('contact', {
                    rules: [
                      { required: true},
                    ],
                    initialValue:initData.contact?initData.contact:'',
                  })(<Input placeholder='请输入联系人'/>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label='银行名称'>
                  {form.getFieldDecorator('bankname', {
                    rules: [
                      { required: true },
                    ],
                    initialValue:initData.bankname?initData.bankname:'',
                  })(<Input placeholder='请输入银行名称' />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label='银行账号'>
                  {form.getFieldDecorator('bankaccount', {
                    rules: [{ required: true }],
                    initialValue:initData.bankaccount?initData.bankaccount:'',
                  })(<Input placeholder='请输入银行账号' />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={24} md={24} sm={24}>
                <Form.Item label='注册资本'>
                  {form.getFieldDecorator('regmoney', {
                    initialValue:initData.regmoney?initData.regmoney:'',
                    rules: [
                      { required: true, message:'注册资本' },
                      {
                        message: '请输入注册资本',
                      },
                    ],
                  })(<Input placeholder='注册资本' type="number"/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={24} md={24} sm={24}>
                <Form.Item label={fieldLabels.memo}>
                  {getFieldDecorator('memo',{
                    initialValue:initData.memo?initData.memo:'',
                  })(<TextArea />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>

        <FooterToolbar style={{ width }}>
          {/* {this.getErrorInfo()} */}
          <Button
            onClick={this.backClick}
          >
            取消
          </Button>
          <Button type="primary" onClick={()=>this.validate()} loading={submitting}>
            提交
          </Button>

        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}

export default BusinessUpdate;
