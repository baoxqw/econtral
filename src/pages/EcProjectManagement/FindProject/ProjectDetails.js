import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import moment from 'moment'
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  Upload,
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
const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const dateFormat = 'YYYY-MM-DD';

@connect(({ FP, loading }) => ({
  FP,
  loading: loading.models.FP,
}))
@Form.create()
class ProjectDetails extends PureComponent {
  state ={
    dataList:{}
  }

  componentDidMount() {
    const record = this.props.location.state.query;
    if(record){
      this.setState({
        dataList:record
      })
    }
  }


  render() {
    const { form:{getFieldDecorator} } = this.props;
    const { dataList } = this.state;
    return (
      <PageHeaderWrapper>
        <Card>
          <Form  layout="vertical" hideRequiredMark >
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="申请单编号">
                  {getFieldDecorator('numbering', {
                    initialValue: dataList.numbering?dataList.numbering:''
                  })(<Input placeholder='请输入申请单编号' disabled/>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="项目类型">
                  {getFieldDecorator('projecttype', {
                    initialValue: dataList.projecttype?dataList.projecttype:''
                  })(<Select placeholder="请选择项目类型" disabled>
                    <Option value={1}>项目类型1</Option>
                    <Option value={2}>项目类型2</Option>
                  </Select>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 3 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label='项目名称'>
                  {getFieldDecorator('projectname', {
                    initialValue: dataList.projectname?dataList.projectname:''
                  })(<Input placeholder='请输入项目名称' disabled/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="立项人">
                  {getFieldDecorator('projectperson', {
                    initialValue: dataList.projectperson?dataList.projectperson:''
                  })(<Input placeholder='请输入立项人' disabled/>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="立项日期">
                  {getFieldDecorator('projectdate', {
                    initialValue: dataList.projectdate?moment(dataList.projectdate):null
                  })(<DatePicker style={{width:'100%'}} placeholder="请选择立项日期" disabled/>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 3 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label='项目负责人'>
                  {getFieldDecorator('projectprincipal', {
                    initialValue: dataList.projectprincipal?dataList.projectprincipal:''
                  })(<Input placeholder='请输入项目负责人' disabled/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="项目负责部门">
                  {getFieldDecorator('department', {
                    initialValue: dataList.department?dataList.department:''
                  })(<Input placeholder='请输入项目负责部门' disabled/>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="项目金额(元)">
                  {getFieldDecorator('projectamount', {
                    initialValue: dataList.projectamount?dataList.projectamount:''
                  })(<Input placeholder='请输入项目金额' type='number' disabled/>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 3 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24} >
                <Form.Item label='成本预算(元)'>
                  {getFieldDecorator('projectbudget', {
                    initialValue: dataList.projectbudget?dataList.projectbudget:''
                  })(<Input placeholder='请输入成本预算' disabled/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="项目工期(开始)">
                  {getFieldDecorator('projectdurationstart', {
                    initialValue: dataList.projectdurationstart?moment(dataList.projectdurationstart,dateFormat):null
                  })(<DatePicker style={{width:'100%'}} placeholder="请选择开始项目工期" disabled/>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="项目工期(结束)">
                  {getFieldDecorator('projectdurationstop', {
                    initialValue: dataList.projectdurationstop?moment(dataList.projectdurationstop,dateFormat):null
                  })(<DatePicker style={{width:'100%'}} placeholder="请选择结束项目工期" disabled/>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 3 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label='管理分摊(元)'>
                  {getFieldDecorator('allocation', {
                    initialValue: dataList.allocation?dataList.allocation:''
                  })(<Input placeholder='请输入管理分摊' type='number' disabled/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="税率">
                  {getFieldDecorator('taxrate', {
                    initialValue: dataList.taxrate?dataList.taxrate:''
                  })(<Input placeholder='请输入税率' type='number' disabled/>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="是否前期立项">
                  {getFieldDecorator('ispreproject', {
                    initialValue: dataList.ispreproject
                  })(<Select placeholder="请选择项目分级" disabled>
                    <Option value={1}>是</Option>
                    <Option value={0}>否</Option>
                  </Select>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 3 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label='专业分包(元)'>
                  {getFieldDecorator('subcontracting', {
                    initialValue: dataList.subcontracting?dataList.subcontracting:''
                  })(<Input placeholder='请输入专业分包' disabled/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="系统内外">
                  {getFieldDecorator('system', {
                    initialValue: dataList.system?dataList.system:''
                  })(<Input placeholder='请输入系统内外' disabled/>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="项目分级">
                  {getFieldDecorator('projectgrading', {
                    initialValue: dataList.projectgrading?dataList.projectgrading:''
                  })(<Select placeholder="请选择项目分级" disabled>
                    <Option value={0}>1级</Option>
                    <Option value={1}>2级</Option>
                    <Option value={3}>3级</Option>
                  </Select>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 3 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label='合同签订时间'>
                  {getFieldDecorator('contracttime', {
                    initialValue: dataList.contracttime?moment(dataList.contracttime,dateFormat):null
                  })(<DatePicker style={{width:'100%'}} placeholder="请选择合同签订时间" disabled/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label='合同验收时间'>
                  {getFieldDecorator('acceptancetime', {
                    initialValue: dataList.acceptancetime?moment(dataList.acceptancetime,dateFormat):null
                  })(<DatePicker style={{width:'100%'}} placeholder="请选择合合同验收时间" disabled/>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="重要事项">
                  {getFieldDecorator('importantmatters', {
                    initialValue: dataList.importantmatters?dataList.importantmatters:''
                  })(<Select placeholder="请选择重要事项" disabled>
                    <Option value={1}>重要事项1</Option>
                    <Option value={2}>重要事项2</Option>
                  </Select>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 3 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label="客户名称">
                  {getFieldDecorator('clientsname', {
                    initialValue: dataList.clientsname?dataList.clientsname:''
                  })(<Select placeholder="请选择客户名称" disabled>
                    <Option value="jack">jack</Option>
                    <Option value="lucy">lucy</Option>
                  </Select>)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ProjectDetails;
