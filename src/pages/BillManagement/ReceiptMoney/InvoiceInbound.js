import React, { PureComponent, useState } from 'react';
import { Steps, Form, Button, Input, Row, Col, Select , Transfer, Icon, message, Card } from 'antd';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import NormalTable from '@/components/NormalTable';
const FormItem = Form.Item;

@connect(({ RM, loading }) => ({
  RM,
  loading: loading.models.RM,
}))
@Form.create()
class InvoiceInbound extends PureComponent {
  resultInfo = {};

  state = {
    current: 0,
  };

  componentDidMount() {

  }

  render() {
    const {
      form: { getFieldDecorator },
      loading
    } = this.props;
    return (
      <Row>
        <Row>
          <Col>
            <Button>发票</Button>
          </Col>
          <Col>
            <Button>入库</Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <NormalTable
              loading={loading}
              dataSource={tableData}
              columns={columns}
              onRow={(record )=>{
                return {
                  onClick:()=>{
                    console.log("record",record)
                  }
                }
              }}
              //onChange={this.handleStandardTableChange}
            />
          </Col>
          <Col style={{marginTop:'20px'}}>
            <NormalTable
              loading={loading}
              dataSource={this.state.childTable}
              columns={childColumns}
              //onChange={this.handleStandardTableChange}
            />
          </Col>
        </Row>
        <Row>
          <Col offset={4}>
            <Button type="primary" htmlType="submit">
              {/*下一步*/}
              {formatMessage({id:'valid.next'})}
            </Button>
          </Col>
        </Row>
      </Row>
    );
  }
}
export default InvoiceInbound;
