import React, { PureComponent } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Table, Card, Spin, Button, Form, Select } from 'antd';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';

const { Option } = Select;

@Form.create()
@connect(({ statistics: { fundProjectList }, fund: { fundList }, loading: { models } }) => ({
  // ...netFund,
  fundProjectList,
  models,
  fundList,
}))
class NetFund extends PureComponent {
  state = {
    current: 1,
  };

  pageSize = 10; // 分页数据条数

  condition = {
    // fund_id: 84,
    // statisticalBase: 'province',
  }; // 查询条件

  componentDidMount() {
    const { dispatch } = this.props;
    // this.fetchFundProjectList();
    dispatch({
      type: 'fund/fetchFundList',
    });
  }

  // 获取表格数据
  fetchFundProjectList = (pageIndex = 0) => {
    const {
      props: { dispatch },
      pageSize,
    } = this;
    const payload = {
      pageSize,
      pageIndex,
      reqData: this.condition,
    };

    dispatch({
      type: 'statistics/fetchFundProjectList',
      payload,
    });

    this.setState({
      current: pageIndex + 1,
    });
  };

  // 表格发生变化
  handleTableChange = pagination => {
    const { current } = pagination;
    this.fetchFundProjectList(current - 1);
  };

  handleQuery = ({ fundId, statisticalBase }) => {
    this.condition = { fund_id: fundId, statisticalBase };
    console.log(this.condition);
    this.fetchFundProjectList();
  };

  render() {
    const {
      state: { current },
      pageSize,
      props: { fundProjectList, form, models, fundList },
    } = this;
    const { getFieldDecorator } = form;

    const columns = [
      {
        title: formatMessage({ id: 'validation.fundname' }),
        dataIndex: 'fundName',
      },
      {
        title: formatMessage({ id: 'validation.tagregionprojecttype' }),
        dataIndex: 'tag',
      },
      {
        title: formatMessage({ id: 'validation.average' }),
        dataIndex: 'average',
      },
      {
        title: formatMessage({ id: 'validation.number' }),
        dataIndex: 'count',
      },
      {
        title: formatMessage({ id: 'validation.quantity' }),
        dataIndex: 'countPercentage',
        render: val => `${val}%`,
      },
      {
        title: formatMessage({ id: 'validation.amount' }),
        dataIndex: 'sum',
      },
      {
        title: formatMessage({ id: 'validation.amount2' }),
        dataIndex: 'sumPercentage',
        render: val => `${val}%`,
      },
    ];

    return (
      <PageHeaderWrapper>
        <Card className="mg-b">
          <Form layout="inline" className="mg-b">
            <Form.Item label={formatMessage({ id: 'validation.fundname' })}>
              {getFieldDecorator('fundId', {
                rules: [{ required: true, message: formatMessage({ id: 'validation.pleasechoosefundname' }) }],
              })(
                <Select
                  placeholder={formatMessage({ id: 'validation.pleaseenterandselect' })}
                  showSearch
                  filterOption={(valueNow, { props: { children } }) =>
                    new RegExp(valueNow).test(children)
                  }
                  showArrow={false}
                  style={{ width: '200px' }}
                  notFoundContent={fundList.length ? null : <Spin size="small" />}
                >
                  {fundList.map((item, index) => (
                    <Option value={item.id} key={String(index)}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item label={formatMessage({ id: 'validation.statisticalbasis' })}>
              {getFieldDecorator('statisticalBase', {
                rules: [{ required: true, message: formatMessage({ id: 'validation.pleaseselectastatisticalbasis' }) }],
              })(
                <Select
                  placeholder="请选择"
                  onChange={val => console.log(val, 'data')}
                  style={{ width: '200px' }}
                >
                  <Option value="province">{formatMessage({ id: 'validation.area' })}</Option>
                  <Option value="tag">{formatMessage({ id: 'validation.label' })}</Option>
                  <Option value="projectstaus">{formatMessage({ id: 'validation.projectstatus' })}</Option>
                </Select>
              )}
            </Form.Item>
            <Form.Item>
              <Button
                onClick={() => {
                  form.validateFields((err, fieldsValue) => {
                    if (err) return;
                    this.handleQuery(fieldsValue);
                  });
                }}
                type="primary"
                style={{ marginRight: '8px' }}
              >
                {formatMessage({ id: 'validation.query' })}
              </Button>
              <Button>{formatMessage({ id: 'validation.cancle' })}</Button>
            </Form.Item>
          </Form>
          <Table
            loading={models.statistics}
            onChange={this.handleTableChange}
            columns={columns}
            dataSource={fundProjectList.data}
            pagination={{ total: fundProjectList.total, pageSize, current }}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default NetFund;
