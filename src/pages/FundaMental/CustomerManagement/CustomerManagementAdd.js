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
class CustomerManagementAdd extends PureComponent {
  state = {
    width: '100%',
    addid:'',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    if(this.props.location.record){
      this.setState({
        addid:this.props.location.record.addid,
        title:this.props.location.record.title
      })
    }
  }
  handleEditorChange = editorState => {
    this.setState({ editorState });
  };
  validate () {
    const { dispatch,form} = this.props;
    form.validateFields((err, fieldsValue) => {
      if(!err){
        const obj = {
          ...fieldsValue,
          areaclid:this.state.addid,
          custlevel:Number(fieldsValue['custlevel']),
          regmoney:Number(fieldsValue['regmoney']),
          custtype:'2'
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
            message.success('新建成功',1.2,()=>{
              router.push('/fundamental/customermanagement/list');
            });
          }
        })
      }

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
    const { width, editorState } = this.state;
    return (
      <PageHeaderWrapper>
        <Card title='客户新增'  bordered={false}>
          <Form layout="vertical" hideRequiredMark onSubmit={this.handleSubmit}>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label='客户编码'>
                  {getFieldDecorator('code', {
                    rules: [{ required: true, message: '客户编码'}],
                  })(<Input placeholder='请输入客户编码' />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label='客户名称'>
                  {form.getFieldDecorator('name', {
                    rules: [{ required: true, message:'客户名称' }],
                  })(<Input placeholder='请输入客户名称' />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label='所属地区'>
                  {form.getFieldDecorator('areaclid', {
                    initialValue:this.state.title,
                    rules: [{ required: true, message: '所属地区' }],
                  })(
                    <Input placeholder='请输入所属地区' disabled/>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label='简称'>
                  {form.getFieldDecorator('shortname', {
                    rules: [{ required: true, message: '简称' }],
                  })(
                    <Input placeholder='请输入简称' />
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label='客商类型'>
                  {form.getFieldDecorator('custtype', {
                    rules: [{ required: true, message: '客商类型' }],
                    initialValue: '客户'
                  })(
                    <Input disabled/>
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label='网址'>
                  {form.getFieldDecorator('website', {
                  })(<Input placeholder='请输入网址'/>)}
                </Form.Item>

              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label='联系人及电话'>
                  {form.getFieldDecorator('contact', {
                    rules: [
                      { required: true,message:'联系人及电话'},
                    ],
                  })(<Input placeholder='请输入联系人及电话'/>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label='传真'>
                  {form.getFieldDecorator('phone',{
                    rules: [
                      {

                        message: '请输入合法传真',
                      },
                    ],
                  })(<Input placeholder='请输入传真' />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label='法人姓名'>
                  {form.getFieldDecorator('respsnname', {
                    rules: [{ required: true, message:'法人姓名' }],
                  })(<Input placeholder='请输入法人姓名' />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label='地址'>
                  {form.getFieldDecorator('address', {
                    rules: [
                      { required: true, message:'地址' },
                      {
                        message: '请输入地址',
                      },
                    ],
                  })(<Input placeholder='请输入地址'/>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label='邮编'>
                  {form.getFieldDecorator('zipcode', {
                  })(<Input placeholder='请输入邮编' />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label='统一社会信用代码'>
                  {form.getFieldDecorator('uscc', {
                    rules: [{ required: true, message:'统一社会信用代码' }],
                  })(<Input placeholder='请输入统一社会信用代码' />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label='等级'>
                  {form.getFieldDecorator('custlevel', {
                    rules: [
                      { required: true, message:'等级'},
                    ],
                  })(<Input placeholder='请输入等级' type='number'/>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label='银行名称'>
                  {form.getFieldDecorator('bankname', {
                    rules: [
                      { required: true,message:'银行名称' },
                    ],
                  })(<Input placeholder='请输入银行名称' />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label='银行账号'>
                  {form.getFieldDecorator('bankaccount', {
                    rules: [{ required: true,message:'银行账号' }],
                  })(<Input placeholder='请输入银行账号' />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label='注册资本'>
                  {form.getFieldDecorator('regmoney', {
                    rules: [
                      { required: true, message:'注册资本' },
                      {
                        message: '请输入注册资本',
                      },
                    ],
                  })(<Input placeholder='请输入注册资本' type="number"/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={24} md={24} sm={24}>
                <Form.Item label={fieldLabels.memo}>
                  {getFieldDecorator('memo')(<TextArea placeholder={'请输入备注'}/>)}
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
            确定
          </Button>

        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}

export default CustomerManagementAdd;
