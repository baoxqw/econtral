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
class FindProject extends PureComponent {
  state ={
    changeVisible:false,
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

  projectChange = (e)=>{
    e.preventDefault()
    this.setState({
      changeVisible:true
    })
  }

  changeHandleCancel=(e)=>{
    this.setState({
      changeVisible:false
    })
  }

  changeHandleOk = (e)=>{
    this.setState({
      changeVisible: false,
    });
  }

  onSubmitForm = ()=>{
    const { form,dispatch } = this.props;
    const { dataList } = this.state;
    form.validateFields((err,values)=>{
      const obj = {
        numbering:values.numbering,
        projecttype:values.projecttype,
        projectname:values.projectname,
        projectperson:values.projectperson,
        projectdate:values.projectdate.format('YYYY-MM-DD'),
        projectprincipal:values.projectprincipal,
        department:values.department,
        projectamount:values.projectamount,
        projectbudget:values.projectbudget,
        projectdurationstart:values.projectdurationstart.format('YYYY-MM-DD'),
        projectdurationstop:values.projectdurationstop.format('YYYY-MM-DD'),
        allocation:values.allocation,
        taxrate:values.taxrate,
        ispreproject:values.ispreproject,
        subcontracting:values.subcontracting,
        system:values.system,
        projectgrading:values.projectgrading,
        contracttime:values.contracttime.format('YYYY-MM-DD'),
        acceptancetime:values.acceptancetime.format('YYYY-MM-DD'),
        importantmatters:values.importantmatters,
        clientsname:values.clientsname,
        budget:{
          hardwarecost:values.hardwarecost?Number(values.hardwarecost):null,
          laborcost:values.laborcost?Number(values.laborcost):null,
          labor:values.labor?Number(values.labor):null,
          business:values.business?Number(values.business):null,
          subcontractbusiness:values.subcontractbusiness?Number(values.subcontractbusiness):null,
          subcontractindustry:values.subcontractindustry?Number(values.subcontractindustry):null,
          inspectiontest:values.inspectiontest?Number(values.inspectiontest):null,
          conferencefee:values.conferencefee?Number(values.conferencefee):null,
          other:values.other?Number(values.other):null,
        }
      }
      dispatch({
        type:'FP/update',
        payload:{
          reqData:{
            id:dataList.id,
            ...obj
          }
        },
        callback:(res)=>{
          if(res){
            message.success("编辑成功",1,()=>{
              router.push("/ecprojectmanagement/findproject/list")
            })
          }
        }
      })
    })
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
                  })(<Input placeholder='请输入申请单编号'/>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="项目类型">
                  {getFieldDecorator('projecttype', {
                    initialValue: dataList.projecttype?dataList.projecttype:''
                  })(<Select placeholder="请选择项目类型" >
                    <Option value={1}>项目类型1</Option>
                    <Option value={2}>项目类型2</Option>
                  </Select>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 3 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label='项目名称'>
                  {getFieldDecorator('projectname', {
                    initialValue: dataList.projectname?dataList.projectname:''
                  })(<Input placeholder='请输入项目名称'/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="立项人">
                  {getFieldDecorator('projectperson', {
                    initialValue: dataList.projectperson?dataList.projectperson:''
                  })(<Input placeholder='请输入立项人'/>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="立项日期">
                  {getFieldDecorator('projectdate', {
                    initialValue: dataList.projectdate?moment(dataList.projectdate):null
                  })(<DatePicker style={{width:'100%'}} placeholder="请选择立项日期"/>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 3 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label='项目负责人'>
                  {getFieldDecorator('projectprincipal', {
                    initialValue: dataList.projectprincipal?dataList.projectprincipal:''
                  })(<Input placeholder='请输入项目负责人'/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="项目负责部门">
                  {getFieldDecorator('department', {
                    initialValue: dataList.department?dataList.department:''
                  })(<Input placeholder='请输入项目负责部门'/>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="项目金额(元)">
                  {getFieldDecorator('projectamount', {
                    initialValue: dataList.projectamount?dataList.projectamount:''
                  })(<Input placeholder='请输入项目金额' type='number'/>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 3 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24} style={{display:'flex',alignItems:'center'}}>
                <Form.Item label='成本预算(元)'>
                  {getFieldDecorator('projectbudget', {
                    initialValue: dataList.projectbudget?dataList.projectbudget:''
                  })(<Input placeholder='请输入成本预算'/>)}
                </Form.Item>
                <Button onClick={(e)=>this.projectChange(e)} type='primary' style={{marginLeft:'8px',position:'relative',bottom:'3px'}}>
                  变更
                </Button>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="项目工期(开始)">
                  {getFieldDecorator('projectdurationstart', {
                    initialValue: dataList.projectdurationstart?moment(dataList.projectdurationstart,dateFormat):null
                  })(<DatePicker style={{width:'100%'}} placeholder="请选择开始项目工期"/>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="项目工期(结束)">
                  {getFieldDecorator('projectdurationstop', {
                    initialValue: dataList.projectdurationstop?moment(dataList.projectdurationstop,dateFormat):null
                  })(<DatePicker style={{width:'100%'}} placeholder="请选择结束项目工期"/>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 3 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label='管理分摊(元)'>
                  {getFieldDecorator('allocation', {
                    initialValue: dataList.allocation?dataList.allocation:''
                  })(<Input placeholder='请输入管理分摊' type='number'/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="税率">
                  {getFieldDecorator('taxrate', {
                    initialValue: dataList.taxrate?dataList.taxrate:''
                  })(<Input placeholder='请输入税率' type='number'/>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="是否前期立项">
                  {getFieldDecorator('ispreproject', {
                    initialValue: dataList.ispreproject
                  })(<Select placeholder="请选择项目分级" >
                    <Option value={1}>是</Option>
                    <Option value={0}>否</Option>
                  </Select>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 3 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label='专业分包(元)'>
                  {getFieldDecorator('subcontracting', {
                    initialValue: dataList.subcontracting?dataList.subcontracting:''
                  })(<Input placeholder='请输入专业分包'/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="系统内外">
                  {getFieldDecorator('system', {
                    initialValue: dataList.system?dataList.system:''
                  })(<Input placeholder='请输入系统内外'/>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="项目分级">
                  {getFieldDecorator('projectgrading', {
                    initialValue: dataList.projectgrading?dataList.projectgrading:''
                  })(<Select placeholder="请选择项目分级" >
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
                  })(<DatePicker style={{width:'100%'}} placeholder="请选择合同签订时间"/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label='合同验收时间'>
                  {getFieldDecorator('acceptancetime', {
                    initialValue: dataList.acceptancetime?moment(dataList.acceptancetime,dateFormat):null
                  })(<DatePicker style={{width:'100%'}} placeholder="请选择合合同验收时间"/>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="重要事项">
                  {getFieldDecorator('importantmatters', {
                    initialValue: dataList.importantmatters?dataList.importantmatters:''
                  })(<Select placeholder="请选择重要事项" >
                    <Option value='1'>重要事项1</Option>
                    <Option value='2'>重要事项2</Option>
                  </Select>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 3 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label="客户名称">
                  {getFieldDecorator('clientsname', {
                    initialValue: dataList.clientsname?dataList.clientsname:''
                  })(<Select placeholder="请选择客户名称" >
                    <Option value="jack">jack</Option>
                    <Option value="lucy">lucy</Option>
                  </Select>)}
                </Form.Item>
              </Col>
            </Row>
            <Row style={{display:'flex',justifyContent:'flex-end',marginTop:'30px'}}>
              <Button  >取消</Button>
              <Button type='primary' style={{marginLeft:"30px"}} onClick={this.onSubmitForm}>确定</Button>
            </Row>
          </Form>
        </Card>
        <Modal
          title="查看成本预算明细"
          visible={this.state.changeVisible}
          onOk={this.changeHandleOk}
          width='50%'
          onCancel={this.changeHandleCancel}
        >
          <Form  layout="vertical"
                 hideRequiredMark>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="硬件设备费用">
                  {getFieldDecorator('hardwarecost', {
                    initialValue:dataList.budget?dataList.budget.hardwarecost:''
                  })(<Input placeholder='请输入硬件设备费用'/>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="人工成本">
                  {getFieldDecorator('laborcost', {
                    initialValue:dataList.budget?dataList.budget.laborcost:''
                  })(<Input placeholder='请输入人工成本' type='number'/>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 3 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label='劳务分包'>
                  {getFieldDecorator('labor', {
                    initialValue:dataList.budget?dataList.budget.labor:''
                  })(<Input placeholder='请输入劳务分包' type='number'/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="业务分包">
                  {getFieldDecorator('business', {
                    initialValue:dataList.budget?dataList.budget.business:''
                  })(<Input placeholder='请输入业务分包'/>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="差旅费(商务)">
                  {getFieldDecorator('subcontractbusiness', {
                    initialValue:dataList.budget?dataList.budget.subcontractbusiness:''
                  })(<Input placeholder='请输入差旅费(商务)' type='number'/>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 3 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label='差旅费(业务)'>
                  {getFieldDecorator('subcontractindustry', {
                    initialValue:dataList.budget?dataList.budget.subcontractindustry:''
                  })(<Input placeholder='请输入差旅费(业务)' type='number'/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="检验测试费">
                  {getFieldDecorator('inspectiontest', {
                    initialValue:dataList.budget?dataList.budget.inspectiontest:''
                  })(<Input placeholder='请输入检验测试费'/>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 3 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="会议费">
                  {getFieldDecorator('conferencefee', {
                    initialValue:dataList.budget?dataList.budget.conferencefee:''
                  })(<Input placeholder='请输入会议费' type='number'/>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 3 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label='其他'>
                  {getFieldDecorator('other', {
                    initialValue:dataList.budget?dataList.budget.other:''
                  })(<Input placeholder='请输入'/>)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default FindProject;
