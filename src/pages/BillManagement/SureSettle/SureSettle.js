import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Row, Col, Form, Input, Button, Card,Popconfirm,DatePicker,message } from 'antd';
import NormalTable from '@/components/NormalTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
import './tableSureBg.less'
import storage from '@/utils/storage'
import styles from '../../System/UserAdmin.less';

const FormItem = Form.Item;
@connect(({ SS, loading }) => ({
  SS,
  loading: loading.models.SS,
  listLoading:loading.effects['SS/fetch'],
  childLoading:loading.effects['SS/findChild'],
}))
@Form.create()
class SureSettle extends PureComponent {
  columns = [
    {
      title: '结算单号',
      dataIndex: 'billcode',
    },
    {
      title:'结算日期',
      dataIndex:'settledate',
    },
    {
      title: '制单时间',
      dataIndex: 'ct',
      render:(text,record)=>{
        if(text){
          let n = text.toString()
          let year = n.substring(0,4)//年
          let month = n.substring(4,6)//月
          let day = n.substring(6,8)//日
          let all = year + '-'+ month + "-" + day
          return all
        }
      }
    },
    {
      title: '制单人',
      dataIndex: 'corpId',
    },
    {
      title: formatMessage({ id: 'validation.operation' }),
      dataIndex: 'caozuo',
      render: (text, record) => {
        return (
          <Fragment>
            <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record)}>
              <a href="#javascript:;">删除</a>
            </Popconfirm>
          </Fragment>
        )
      },
    },
  ];
  childColumns = [
    {
      title: '项目名称',
      dataIndex: 'projectname',
    },
    {
      title: '发票号',
      dataIndex: 'invoicecode',
    },
    {
      title: '结算金额',
      dataIndex: 'settlemny',
    },
    {
      title: '收款单经办人',
      dataIndex: 'salereturnname',
    },
    {
      title: '发票服务名称',
      dataIndex: 'serivcename',
    },
    {
      title: '',
      dataIndex: 'caozuo',
    },
    /*{
      title: '操作',
      dataIndex: 'operation',
    },
    {
      title: formatMessage({ id: 'validation.operation' }),
      render: (text, record) => (
        <Fragment>
          <Popconfirm title="确定删除吗?" onConfirm={() => this.childHandleDelete(record)}>
            <a href="javascript:;" style={{color:'#ff2340'}}>删除</a>
          </Popconfirm>
          <Divider type="vertical" />
          <span style={{color:'#0ba40d',cursor:'pointer'}} onClick={(e)=>this.childupdataRoute(e,record)}>编辑</span>
        </Fragment>
      ),
    },*/
  ];
  state = {
    pageIndex:0,
    rowId:null,
    conditions:[],
    childTable:[],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'SS/fetch',
      payload:{
        pageIndex:0,
        pageSize:100000
      }
    });
  }
  //点击删除
  handleDelete = (record)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'SS/remove',
      payload:{
        reqData:{
          id: record.id
        }
      },
      callback:(res)=>{
        if(res){
          message.success("删除成功",1,()=>{
            this.setState({
              superId:null,
              rowId:null,
            })
            dispatch({
              type: 'SS/fetch',
              payload:{
                pageIndex:0,
                pageSize:10
              }
            });
          })
        }
      }
    })
  };
  childChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const obj = {
      pageIndex: pagination.current-1,
      pageSize: pagination.pageSize,
      reqData:{
        id:this.state.superId
      }
    };
    dispatch({
      type:'SS/findChild',
      payload:obj,
      callback:(res)=>{
        this.setState({
          childTable:res,
        })
      }
    })
  };

  //查询
  handleSearch = (e) => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll(async (err, values) => {
      const conditions = [];
      const {billcode, data } = values
      if(billcode || data){
        if(billcode){
          const obj = {
            code:'billcode',
            exp:'like',
            value:billcode
          };
          conditions.push(obj);
        }
        if(data){
          const obj = {
            code:'settledate',
            exp:'like',
            value:data.format("YYYY-MM-DD")
          };
          conditions.push(obj);
        }
        this.setState({
          conditions
        })
        dispatch({
          type:'SS/fetch',
          payload: {
            pageSize:10,
            pageIndex:0,
            conditions,
          },
        })
      }else{
        this.setState({
          conditions:[]
        })
        dispatch({
          type:'SS/fetch',
          payload: {
            pageSize:10,
            pageIndex:0,
          },
        })
      }

    })
  };
  setRowClassName = (record) => {
    return record.id === this.state.rowId ? 'clickRowStyl' : '';
  }
  //取消
  handleFormReset = ()=>{
    const { dispatch,form} = this.props;
    //清空输入框
    form.resetFields();
    //清空后获取列表
    dispatch({
      type:'SS/fetch',
      payload:{
        pageIndex:0,
        pageSize:10
      }
    });
  }
  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label='结算单号'>
              {getFieldDecorator('billcode')(<Input placeholder='结算单号' />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label='结算日期'>
              {getFieldDecorator('data')(<DatePicker style={{ width: '100%' }}/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
               取消
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      SS:{ data },
      loading,
      listLoading,
      childLoading,
    } = this.props;
    const { childTable} = this.state;
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.userAdminForm}>{this.renderForm()}</div>
          <div>
            <NormalTable
              rowKey="id"
              loading={listLoading}
              data={data}
              scroll={{ y:360 }}
              pagination={false}
              columns={this.columns}
              onRow={(record )=>{
                return {
                  onClick:()=>{
                    const { dispatch } = this.props;
                    dispatch({
                      type:'SS/findChild',
                      payload:{
                        pageSize:10,
                        pageIndex:0,
                          reqData:{
                            id:record.id
                        }
                      },
                      callback:(res)=>{
                        this.setState({
                          childTable:res,
                          superId:record.id,
                          rowId: record.id,
                        })
                      }
                    })
                  },
                  rowKey:record.id
                }
              }}
              rowClassName={this.setRowClassName}
            />
          </div>
        </Card>
        <Card bordered={false} style={{marginTop:'26px'}}>
          <NormalTable
            loading={loading}
            data={childTable}
            columns={this.childColumns}
            scroll={{ y:360 }}
            onChange={this.childChange}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default SureSettle;
