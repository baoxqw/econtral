import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import storage from '@/utils/storage';
import NormalTable from '@/components/NormalTable';
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
  Radio,
  Icon,
  Tooltip,
  AutoComplete,
  Row,
  Col,
  message,
  Popconfirm,
  Table,
  Tabs
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../System/UserAdmin.less';


@connect(({ netFund, loading }) => ({
  netFund,
  submitting: loading.effects['netFund/submitRegularForm'],
}))
@Form.create()
class projectReceipt extends PureComponent {
  state = {

  };
  componentDidMount() {
    const {dispatch} = this.props
    dispatch({
      type:'netFund/fetch',
      payload:{
        reqData:{
          pageIndex:0,
          pageSize:10,
        }
      }

    })

  }

  render() {
    const {
      form:{getFieldDecorator},
      netFund: {data}
    } = this.props;
    console.log('dataNETFUBD:',data)
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        width:120
      },
      {
        title: '开票期',
        dataIndex: 'invoice',
        width:120
      },
      {
        title: '开票事项',
        children:[
          {
            title: '单位名称',
            dataIndex: 'companyname',
            width:120
          },
          {
            title: '项目',
            dataIndex: 'project',
            width:120
          },
          {
            title: '开票日期',
            dataIndex: 'invoicedata',
            width:120
          },
          {
            title: '发票号码',
            dataIndex: 'invoicenumber',
            width:120
          },
        ]
      },
      {
        title: '开票回款金额',
        children:[
          {
            title: '结款累计未到账款',
            dataIndex: 'settleaccount',
            width:120
          },
          {
            title: '2019开票金额',
            dataIndex: 'invoicemoney',
            width:120
          },
          {
            title: '2019实到账',
            dataIndex: 'account',
            width:120
          },
          {
            title: '银行乘兑换票',
            dataIndex: 'banknotes',
            width:120
          },
          {
            title: '未到金额',
            dataIndex: 'noamount',
            width:120
          },
        ]

      },
      {
        title: '2019年到账月份明细',
        children:[
          {
            title: '1月份',
            dataIndex: 'january',
            width:120
          },
          {
            title: '2月份',
            dataIndex: 'february',
            width:120
          },
          {
            title: '3月份',
            dataIndex: 'march',
            width:120
          },
          {
            title: '4月份',
            dataIndex: 'april',
            width:120
          },
          {
            title: '5月份',
            dataIndex: 'may',
            width:120
          },
          {
            title: '6月份',
            dataIndex: 'june',
            width:120
          },
        ]

      },
      {
        title: '未到账原因',
        dataIndex: 'reason',
        width:120
      },
      {
        title: '项目负责人',
        dataIndex: 'projectleader',
        width:120
      },
      {
        title: '',
        dataIndex: 'caozuo',
        width:120
      },
    ];
    return (
      <PageHeaderWrapper>
        <Card title='上海铱控自动化系统工程有限公司_2019年度项目开票回款汇总表'>
          <div className={styles.userAdmin}>
            {/*<div className={styles.userAdminForm} style={{marginBottom:'20px'}}>{this.renderForm()}</div>*/}
            <NormalTable
              scroll={{ x:18*120}}
              columns={columns}
              data={data} />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default projectReceipt;
