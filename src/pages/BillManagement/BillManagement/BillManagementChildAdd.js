import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  TreeSelect ,
  Button,
  Card,
  TextArea,
  Checkbox,
  InputNumber,
  Tree,
  Icon,
  Tooltip,
  Modal,
  Select,
  message,
  Popconfirm,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
import { toTree } from '../../tool/ToTree';
import TreeTable from '../../tool/TreeTable/TreeTable';
const { Option } = Select;
const FormItem = Form.Item;
const { TreeNode } = TreeSelect;
@connect(({ BM, loading }) => ({
  BM,
  loading: loading.models.BM,
}))
@Form.create()
class BillManagementChildAdd extends PureComponent {
  state = {
    invoiceHId:null,
  }

  componentDidMount(){
   /* const superId = this.props.location.state.superId;
    console.log("superId",superId);
    this.setState({
      invoiceHId:superId
    })*/
  }

  onOk = (onOk)=>{
    const { form } = this.props;
    form.validateFields((err,values)=>{
      if(!values.crowno||!values.serivcename||
        !values.spec||!values.type||!values.unit||
        !values.number||!values.taxrate||!values.price||!values.includetaxprice||!values.mny||!values.includetaxmny||!values.taxmny){
        return
      }
      const obj = {
        //invoiceHId:superId, //发票主表ID
        crowno:values.crowno, //行号
        serivcename:values.serivcename, //服务内容
        spec:values.spec, //规格
        type:values.type, //型号
        unit:values.unit, //单位
        number:values.number?Number(values.number).toFixed(2):null, //数量
        taxrate:values.taxrate?Number(values.taxrate):null, //税率
        price:values.price?Number(values.price).toFixed(2):null, //无税单价
        includetaxprice:values.includetaxprice?Number(values.includetaxprice).toFixed(2):null, //含税单价
        mny:values.mny?Number(values.mny).toFixed(2):null, //无税金额
        includetaxmny:values.includetaxmny?Number(values.includetaxmny).toFixed(2):null, //含税金额
        taxmny:values.taxmny?Number(values.taxmny).toFixed(2):null, //税额
        balanceflag:values.balanceflag, //结算标志
      };
      console.log("obj",obj)
      onOk(obj)
    })
  }

  handleCancel = (handleCancel)=>{
    handleCancel()
  }

  render() {
    const {
      form: { getFieldDecorator },
      on,
      data
    } = this.props;

    const { onOk,handleCancel } = on;

    const { visible } = data;

    return (
        <Modal
          title="添加"
          width='80%'
          centered
          destroyOnClose
          visible={visible}
          onOk={()=>this.onOk(onOk)}
          onCancel={()=>this.handleCancel(handleCancel)}
        >
          <div style={{padding:'0 24px'}}>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="行号">
                  {getFieldDecorator('crowno',{
                    rules: [{required: true}]
                  })(<Input placeholder="请输入行号" />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="服务内容">
                  {getFieldDecorator('serivcename',{
                    rules: [
                      {
                        required: true,
                      }
                    ]
                  })(
                    <Input placeholder="请输入服务内容" />
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label="规格">
                  {getFieldDecorator('spec', {
                    rules: [
                      {
                        required: true,
                      }
                    ]
                  })(<Input placeholder="请输入规格" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="型号">
                  {getFieldDecorator('type',{
                    rules: [{required: true}],
                  })(<Input placeholder="请输入型号" />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="单位">
                  {getFieldDecorator('unit', {
                    rules: [
                      {
                        required: true,
                      }
                    ]
                  })( <Input placeholder="请输入单位" />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label="数量">
                  {getFieldDecorator('number',{
                    rules: [{required: true}]
                  })(<Input placeholder="请输入数量" type='Number'/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="税率">
                  {getFieldDecorator('taxrate',{
                    rules: [
                      {
                        required: true,
                      }
                    ],
                  })(
                    <Select placeholder="请选择税率" style={{ width: '100%' }}>
                      <Option value={0}>0%</Option>
                      <Option value={0.03}>3%</Option>
                      <Option value={0.06}>6%</Option>
                      <Option value={0.09}>9%</Option>
                      <Option value={0.13}>13%</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="无税单价">
                  {getFieldDecorator('price', {
                    rules: [
                      {
                        required: true,
                      }
                    ]
                  })(<Input placeholder="请输入无税单价" type='Number'/>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label="含税单价">
                  {getFieldDecorator('includetaxprice',{
                    rules: [{required: true}]
                  })(<Input placeholder="请输入含税单价" type='Number'/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="无税金额">
                  {getFieldDecorator('mny',{
                    rules: [
                      {
                        required: true,
                      }
                    ]
                  })(
                    <Input placeholder="请输入无税金额" type='Number'/>
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="含税金额">
                  {getFieldDecorator('includetaxmny', {
                    rules: [
                      {
                        required: true,
                      }
                    ]
                  })( <Input placeholder="请输入含税金额" type='Number'/>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label="税额">
                  {getFieldDecorator('taxmny',{
                    rules: [{required: true}]
                  })(<Input placeholder="请输入税额" type='Number'/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="结算标志">
                  {getFieldDecorator('balanceflag', {
                    rules: [
                      {
                        required: true,
                      }
                    ]
                  })( <Select style={{width:'100%'}} placeholder='请选择结算标志'>
                    <Option value={0}>未结算</Option>
                    <Option value={1}>已结算</Option>
                  </Select>)}
                </Form.Item>
              </Col>
            </Row>
          </div>
        </Modal>
    );
  }
}

export default BillManagementChildAdd;

