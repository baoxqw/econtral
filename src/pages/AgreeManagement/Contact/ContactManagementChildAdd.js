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
class ContactManagementChildAdd extends PureComponent {
  state = {

  };


  onOk = (onOk)=>{
    const { form } = this.props;
    form.validateFields((err,values)=>{
      const obj = {
        incomename:values.incomename,
        rowno:values.rowno,
        mnycurr:values.mnycurr?Number(values.mnycurr):null,
        armnycurr:values.armnycurr?Number(values.armnycurr):null,
        actrualmnycurr:values.actrualmnycurr?Number(values.actrualmnycurr):null,
      };
      onOk(obj)
    })
  }

  handleCancel = (handleCancel)=>{
    handleCancel()
  };

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
          destroyOnClose
          visible={visible}
          onOk={()=>this.onOk(onOk)}
          onCancel={()=>this.handleCancel(handleCancel)}
        >
          <Card bordered={false}>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="收入项名称">
                  {getFieldDecorator('incomename',{
                    rules: [{required: true}]
                  })(<Input placeholder="收入项名称" />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="行号">
                  {getFieldDecorator('rowno',{
                    rules: [
                      {
                        required: true,
                      }
                    ]
                  })(
                    <Input placeholder="请输入行号" />
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label="金额">
                  {getFieldDecorator('mnycurr', {
                    rules: [
                      {
                        required: true,
                      }
                    ]
                  })(<Input placeholder="请输入金额" type="Number"/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="应收金额">
                  {getFieldDecorator('armnycurr',{
                    rules: [{required: true}],
                  })(<Input placeholder="请输入应收金额" type="Number"/>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="实收金额">
                  {getFieldDecorator('actrualmnycurr', {
                    rules: [
                      {
                        required: true,
                      }
                    ]
                  })( <Input placeholder="请输入实收金额" type="Number"/>)}
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Modal>
    );
  }
}

export default ContactManagementChildAdd;

