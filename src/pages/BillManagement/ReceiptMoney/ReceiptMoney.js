import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import React, { Fragment, PureComponent, useState } from 'react';
import { Steps, Form, Button, Input, Row, Col, Select , DatePicker,Checkbox, Icon, message,Modal, Card } from 'antd';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import NormalTable from '@/components/NormalTable';
const FormItem = Form.Item;
const { Step } = Steps;
const { Option } = Select;
// 顶部步骤条
const StepsBar = props => {
  // const steps = ['填写申请信息', '选择审批人员', '完成'];
  const steps = ['选择结算信息',
    '确认结算信息',
    '成功'];
  const { current } = props;

  return (
    <Row className="mg-v">
      <Col span={18} offset={3}>
        <Steps current={current} labelPlacement="vertical">
          {steps.map((item,index) => (
            <Step key={index} title={item} />
          ))}
        </Steps>
      </Col>
    </Row>
  );
};

// 第一步申请表格
const InvoiceInbound = (({ toNextStep,loading,tableInvoice,tableStorage,manytableStorage,manytableInvoice,onInvoice,onStorage,props,dataStorage,dataInvoice,onDataInvoice,onDataStorage,alldataInvoice,alldataStorage }) => {
  function handleSubmit(e) {
    e.preventDefault();
    if(!alldataStorage.length || !alldataInvoice.length){
      message.error("回款单与发票不匹配");
      return
    }
    //将数组中的相同的projectId合并，将金额相加
    let result = {};
    let s = [];
    alldataStorage.forEach(item => {
      if(result[item.projectId]){
        result[item.projectId] += item.nopay;
      }else{
        result[item.projectId] = item.nopay;
      }
    });
    for(let k in result){
      s.push({projectId:k,nopay:result[k]});
    }

    let res = {};
    let i = [];
    alldataInvoice.forEach(item => {
      if(res[item.projectId]){
        res[item.projectId] += item.includetaxmny;
      }else{
        res[item.projectId] = item.includetaxmny;
      }
    });
    for(let k in res){
      i.push({projectId:k,includetaxmny:res[k]});
    }
    if(!s.length || !i.length){
      message.error("回款单与发票不匹配");
      return
    }

    //数组中存储的是projectId的值，判断两个数组是否相等，不相等说明不匹配
    let arrs = [];
    let arri = [];
    s.map(item =>{
      arrs.push(item.projectId)
    });
    i.map(item =>{
      arri.push(item.projectId)
    });
    arrs.sort((a,b)=>{
      return a-b;
    });
    arri.sort((a,b)=>{
      return a-b;
    });

    if(arrs.length !== arri.length ){
      message.error("不匹配");
      return
    }

    let sta = false;
    arrs.map((item,index) =>{
      if(arrs[index] !== arri[index]){
        sta = true
      }
    });
    if(sta){
      message.error("不匹配");
      return
    }


    //判断回款单金额与发票金额
    let status = false;
    s.map(item =>{
      i.map(ite=>{
        if(item.projectId === ite.projectId){
          if(item.nopay < ite.includetaxmny){
            status = true
          }
        }
      })
    });

    /*if(status){
      message.error("发票金额不能大于回款单金额");
      return
    }*/


    //通过
    const data = {
      dataInvoice,
      dataStorage
    };
    toNextStep(1, data);
  }
  function handleStandardTableChangeTicket (pagination){
    const obj = {
      pageIndex: pagination.current-1,
      pageSize:pagination.pageSize,
      conditions:[{
        code: 'isconfirm',
        exp: 'like',
        value: 0
      }]
    };
    props.dispatch({
      type:'RM/fetch',
      payload:obj
    });

  };
  const columns = [
    {
      title: '项目名称',
      dataIndex: 'projectname',
    },
    {
      title: '发票类型',
      dataIndex: 'type',
    },

    {
      title: '含税金额',
      dataIndex: 'includetaxmny',
    },
    {
      title: '累计结算金额（元）',
      dataIndex: 'accountmny',
    },
    {
      title: '未结算金额（元）',
      dataIndex: 'unsettlemny',
    },
    {
      title: '发票号',
      dataIndex: 'code',
      render:((text,record)=>{
        return <div style={{width:'80px',wordWrap:'break-word',overFlow:'hidden'}}>{text}</div>
      })
    },
    {
      title: '客户名称',
      dataIndex: 'custname',
    //
    },
    {
      title: '部门',
      dataIndex: 'deptname',//deptname
    },
    {
      title: '制单人',
      dataIndex: 'operatorname',
    },
    {
      title: '发票总金额',
      dataIndex: 'totalsummoney',
    },
    {
      title: '结算标志',
      dataIndex: 'balanceflag',
      render:(text, record)=>{
        if(text === 0){
          return "未结算"
        }
        if (text === 1){
          return "已结算"
        }
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
    },
    {
      title: '行号',
      dataIndex: 'crowno',
    },
    {
      title: '服务内容',
      dataIndex: 'serivcename',
    },
    {
      title: '单位',
      dataIndex: 'unit',
    },
    {
      title: '数量',
      dataIndex: 'number',
    },
    {
      title: '税率',
      dataIndex: 'taxrate',
    },
    {
      title: '无税单价',
      dataIndex: 'price',
    },
    {
      title: '含税单价',
      dataIndex: 'includetaxprice',
    },
    {
      title: '无税金额',
      dataIndex: 'mny',
    },

    {
      title: '税额',
      dataIndex: 'taxmny',
    },
    {
      title: '',
      dataIndex: 'caozuo',
    }
  ]
  const childColumns = [
    {
      title: '项目名称',
      dataIndex: 'projectname',
    },
    {
      title: '回款金额(元)',
      dataIndex: 'paymentamount',
    },
    {
      title: '累计结算金额(元)',
      dataIndex: 'accountmny',
    },
    {
      title: '未结算金额(元)',
      dataIndex: 'nopay',
    },
    {
      title: '回款日期',
      dataIndex: 'paymentdate',
    },
    {
      title: '经办人',
      dataIndex: 'operatorname',
    },
    {
      title: '是否确认',
      dataIndex: 'isconfirm',
      render: (text, record) => {
        if(text === 1){
          return <Checkbox checked={true}/>
        }else {
          return <Checkbox checked={false}/>
        }
      }
    },
    {
      title: '备注',
      dataIndex: 'memo',
    },
    {
      title: '',
      dataIndex: 'caozuo',
    }
  ]
  function cancleList (){
    props.dispatch({
      type:'RM/allfetch',
      payload:{
        pageIndex:0,
        pageSize:10000,
        conditions:[{
          code: 'isconfirm',
          exp: '=',
          value: 0
        }]
      }
    });
  }
  function cancleListTicket (){
    props.dispatch({
      type:'RM/ticketfetch',
      payload:{
        pageIndex:0,
        pageSize:10000
      }
    })
  }
  const rowSelectionInvoice = {
    selectedRowKeys:dataInvoice,
    onChange: (selectedRowKeys, selectedRows) => {
      if(typeof onDataInvoice === 'function'){
        onDataInvoice(selectedRowKeys,selectedRows)
      }
    }
  };
  const rowSelectionStorage = {
    selectedRowKeys:dataStorage,
    onChange: (selectedRowKeys, selectedRows) => {
      let projectIds = [];
      let paymentamounts = [];
      selectedRows.map(item =>{
        for(let k in item){
          if(k === 'projectId'){
            projectIds.push(item[k]);
          }
          if(k === 'nopay'){
            paymentamounts.push(item[k])
          }
        }
      });
      let InvoiceIds = [];
      var allInvoice = [];//发票

      manytableInvoice.list.map(item =>{
        projectIds.map(ite =>{
          if(item.projectId === ite){
            paymentamounts.map(it=>{
              if(item.includetaxmny === it){
                InvoiceIds.unshift(item.key);
                allInvoice.unshift(item);
              }
            })
          }
        })
      });

      allInvoice.map((item,index)=>{
        if(!allInvoice[index + 1]){
          return
        }
        if(allInvoice[index].projectId === allInvoice[index + 1].projectId && allInvoice[index].includetaxmny === allInvoice[index + 1].includetaxmny){
          allInvoice[index] = null;
          InvoiceIds[index] = null;
        }
      });
      InvoiceIds = InvoiceIds.filter(item =>{
        return item !== null
      });
      allInvoice = allInvoice.filter(item =>{
        return item !== null
      });

      if(typeof onDataStorage === 'function'){
        onDataStorage(selectedRowKeys,selectedRows)
      }
      if(typeof onDataInvoice === 'function'){
        let count = InvoiceIds.concat(dataInvoice);
        let countData = allInvoice.concat(alldataInvoice);
        count = Array.from(new Set(count));
        countData = Array.from(new Set(countData));

        onDataInvoice(count,countData)
      }
    },
    getCheckboxProps:(record)=>{
      if(manytableInvoice.list.length){
        let aa = manytableInvoice.list;
        let status = true;
        for(let i=0;i< aa.length;i++){
          if(record.projectId === aa[i].projectId){
            status = false
          }
        }
        return {disabled:status}
      }else{
        return {disabled:false}
      }
    }
  };
  return (
    <Row>
      <Row style={{marginBottom:'20px'}}>
          <Button type="primary" onClick={()=>onStorage()}>回款单</Button>
          <Button  onClick={cancleList} style={{marginLeft:'12px'}}>取消</Button>
      </Row>
      <Row style={{marginTop:'12px'}}>
        <Col >
          <NormalTable
            loading={loading}
            data={manytableStorage}
            columns={childColumns}
            rowSelection={rowSelectionStorage}
            scroll={{ y:330 }}
            pagination={false}
            // onChange={handleStandardTableChangeTicket}
          />
        </Col>
        <Button type="primary" onClick={()=> onInvoice()} style={{marginTop:'20px'}}>发票</Button>
        <Button  onClick={cancleListTicket} style={{marginLeft:'12px'}}>取消</Button>
        <Col style={{marginTop:'20px'}}>
          <NormalTable
            style={{width:'100%'}}
            loading={loading}
            data={manytableInvoice}
            rowSelection={rowSelectionInvoice}
            columns={columns}
            scroll={{ y:380 }}
            pagination={false}
          />
        </Col>
      </Row>
      <Row>
        <Col style={{textAlign:'center',marginTop:'20px'}}>
          <Button type="primary" onClick={handleSubmit}>
            {/*下一步*/}
            {formatMessage({id:'valid.next'})}
          </Button>
        </Col>
      </Row>
    </Row>

  );
});

// 第二步 选择审批人员
const InvoiceInboundTable = ({ toNextStep,loading,endLoading,props,alldataInvoice,alldataStorage,resultInfo }) => {
  const { dataInvoice,dataStorage } = resultInfo;
  //发票id
  let ticketid = []
  alldataInvoice.forEach((item)=>{
    ticketid.push(item.id)
  })

  //回款id
  let backid = []
  alldataStorage.forEach((item)=>{
    backid.push(item.id)
  })
  // const arrData = dataInvoice.concat(dataStorage);
  // 下一步

  const toNext = () => {
    let sublist = []
    //发票
    alldataInvoice.forEach((item)=>{
      let aa = {}
      // aa.salesreturn_id = null
      aa.invoice_h_id = Number(item.id)
      aa.invoice_b_id = Number(item.invoiceBId)
     /* aa.mny = Number(item.includetaxmny)
      aa.accountmny = Number(item.accountmny)
      aa.unsettlemny = Number(item.unsettlemny)
      aa.unsettlemny = Number(item.includetaxmny)*/
      aa.unsettlemny = Number(item.unsettlemny)
      aa.project_id = item.projectId
      sublist.push(aa)
    })
    //回款单
    alldataStorage.forEach((item)=>{
      let bb = {};
      bb.salesreturn_id = Number(item.id)
      bb.unsettlemny = Number(item.nopay)
      // bb.invoice_h_id = null
      // bb.paymentamount = Number(item.paymentamount)
      // bb.accountmny = Number(item.accountmny)
      // bb.invoice_b_id = null
      // bb.mny = Number(item.nopay)
      bb.project_id = item.projectId
      sublist.push(bb)
    })
    props.dispatch({
      type:'RM/endhandle',
      payload:{
        reqDataList:sublist
      },
      callback:(res)=>{
        return toNextStep(1, sublist);
      }
    })
  };
  const columns = [
    {
      title: '项目名称',
      dataIndex: 'projectname',
    },
    {
      title: '发票类型',
      dataIndex: 'type',
    },
    {
      title: '含税金额',
      dataIndex: 'includetaxmny',
    },
    {
      title: '发票号',
      dataIndex: 'code',
    },
    {
      title: '客户名称',
      dataIndex: 'custname',
    },
    {
      title: '部门',
      dataIndex: 'deptname',//deptname
    },
    {
      title: '制单人',
      dataIndex: 'operatorname',
    },
    {
      title: '发票总金额',
      dataIndex: 'totalsummoney',
    },
    {
      title: '结算标志',
      dataIndex: 'balanceflag',
      render:(text, record)=>{
        if(text === 0){
          return "未结算"
        }
        if (text === 1){
          return "已结算"
        }
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
    },
    {
      title: '行号',
      dataIndex: 'crowno',
    },
    {
      title: '服务内容',
      dataIndex: 'serivcename',
    },
    {
      title: '单位',
      dataIndex: 'unit',
    },
    {
      title: '数量',
      dataIndex: 'number',
    },
    {
      title: '税率',
      dataIndex: 'taxrate',
    },
    {
      title: '无税单价',
      dataIndex: 'price',
    },
    {
      title: '含税单价',
      dataIndex: 'includetaxprice',
    },
    {
      title: '无税金额',
      dataIndex: 'mny',
    },

    {
      title: '税额',
      dataIndex: 'taxmny',
    },
    {
      title: '',
      dataIndex: 'caozuo',
    },
  ]
  //回款单
  const childColumns = [
    {
      title: '项目名称',
      dataIndex: 'projectname',
    },
    {
      title: '回款金额(元)',
      dataIndex: 'paymentamount',
    },
    {
      title: '累计结算金额(元)',
      dataIndex: 'accountmny',
    },
    {
      title: '未结算金额(元)',
      dataIndex: 'nopay',
    },
    {
      title: '回款日期',
      dataIndex: 'paymentdate',
    },
    {
      title: '经办人',
      dataIndex: 'operatorname',
    },
    {
      title: '是否确认',
      dataIndex: 'isconfirm',
      render:(text, record)=>{
        if(text === 0){
          return "已确认"
        }
        if (text === 1){
          return "未确认"
        }
      }
    },
    {
      title: '备注',
      dataIndex: 'memo',
    },
    {
      title: '',
      dataIndex: 'caozuo',
    }
  ];
  return (
    <div>
      <Row>
        <Col>
          <NormalTable
            loading={loading}
            pagination={false}
            dataSource={alldataStorage}
            columns={childColumns}
            scroll={{ y: 260}}
          />
        </Col>
        <Col style={{marginTop:'60px'}}>
          <NormalTable
            style={{width:'100%'}}
            loading={loading}
            dataSource={alldataInvoice}
            columns={columns}
            pagination={false}
            scroll={{ y: 260}}
          />
        </Col>
      </Row>

      <Row type="flex" justify="center" style={{marginTop:"20px"}}>
        <Col>
          <Button onClick={() => toNextStep(-1)} className="mg-r">
            上一步
          </Button>
          <Button type="primary" onClick={toNext} loading={endLoading}>
            下一步
          </Button>
        </Col>
      </Row>
    </div>
  );
};

// 申请成功界面
const Complete = ({ onNext }) => {
  return (
    <div className="flex flex-column flex-v-center">
      <Icon
        type="check-circle"
        theme="filled"
        style={{ color: '#24cb24', fontSize: '60px', marginBottom: '20px' }}
      />
      <div className="mg-b text-center">
        <h3>操作成功</h3>
        <div>等待人员审核</div>
      </div>
     {/* <Button type="primary" onClick={() => onNext(-2)}>
        返回
      </Button>*/}
    </div>
  );
};

@connect(({ RM, loading }) => ({
  RM,
  loading: loading.models.RM,
  endLoading:loading.effects['RM/endhandle'],
}))
@Form.create()
class ReceiptMoney extends PureComponent {

  state = {
    current: 0,
    tableInvoice: [], //发票
    tableStorage: [], //入库单
    InvoiceVisible:false, //发票模态框
    StorageVisible:false, //入库单模态框
    resultInfo:{}, //保存发票和入库单选中的数据
    dataInvoice:[],
    alldataInvoice:[], //存储的是发票集合
    dataStorage:[],
    alldataStorage:[], //回款单集合
  };

  componentDidMount() {
    const { dispatch } = this.props;
    //发票
    /*dispatch({
      type:'RM/ticketfetch',
      payload:{
        pageIndex:0,
        pageSize:10,
      }
    })*/
    //发票全部数据
    dispatch({
      type:'RM/allticketfetch',
      payload:{
        pageSize:10000

      }
    });
    //回款
    dispatch({
      type:'RM/fetch',
      payload:{
        pageIndex:0,
        pageSize:10000,
        conditions:[{
          code: 'isconfirm',
          exp: 'like',
          value: 0
        }]
      }
    });
    //回款全部数据
    dispatch({
      type:'RM/allfetch',
      payload:{
        pageIndex:0,
        pageSize:10000,
        /*conditions:[{
          code: 'isconfirm',
          exp: '=',
          value: 0
        }]*/
      }
    });
  }

  toNextStep = async (step, data) => {
    // 合并每一步需要提交数据

    if (data) {
      this.setState({
        resultInfo:data
      })
    }

    if(step === -1){
      this.setState({
        resultInfo:{}
      })
    }

    const { current } = this.state;
    const nextStep = current + (typeof step === 'number' ? step : 1);

    // 下一步为完成页面则提交数据
    if (nextStep === 2) {

    }

    // 切换下一步
    this.setState({
      current: nextStep,
    });
  };

  //发票事件
  onInvoice = ()=>{
    this.setState({
      InvoiceVisible:true
    })
  }
  InvoiceHandleCancel = ()=>{
    const { dispatch } = this.props
    dispatch({
      type:'RM/allticketfetch',
      payload:{
        reqData:{
          pageIndex:0,
          pageSize:10000
        }
      }
    })
    this.setState({
      InvoiceVisible:false
    })
  }
  //取消
  cancleList = ()=>{
    const { dispatch } = this.props
    dispatch({
      type:'RM/ticketfetch',
      payload:{
        reqData:{
          pageIndex:0,
          pageSize:10
        }
      }
    })
    dispatch({
      type:'RM/fetch',
      payload:{
        reqData:{
          pageIndex:0,
          pageSize:10
        }
      }
    })
  }
  //查询发票
  InvoiceHandleOk = (e)=>{
    e.preventDefault();
    this.setState({
      InvoiceVisible:false
    })
    const { dispatch,form } = this.props
    form.validateFieldsAndScroll((err,values)=>{
      const {npname,ncname} = values;
      if(npname || ncname) {
        let conditions = [];
        let codeObj = {};
        let nameObj = {};

        if (npname) {
          codeObj = {
            code: 'projectname',
            exp: 'like',
            value: npname
          };
          conditions.push(codeObj)
        }
        if (ncname) {
          nameObj = {
            code: 'custname',
            exp: 'like',
            value: ncname
          };
          conditions.push(nameObj)
        }
        const obj = {
          conditions,
          pageSize:10000
        };
        dispatch({
          type:'RM/allticketfetch',
          payload:obj
        })
      }
    })

  }
  //入库事件
  onStorage = ()=>{
    this.setState({
      StorageVisible:true
    })
  }
  StorageHandleCancel = ()=>{
    const { dispatch } = this.props
    dispatch({
      type:'RM/fetch',
      payload:{
        reqData:{
          pageIndex:0,
          pageSize:10
        }
      }
    })
    this.setState({
      StorageVisible:false
    })
  }
  //回款单查询

  StorageHandleOk = (e)=>{
    e.preventDefault();
    this.setState({
      StorageVisible:false
    })
    const { dispatch,form } = this.props
    form.validateFieldsAndScroll((err,values)=>{
      const {hhname,hhtime} = values;
      if( hhname || hhtime) {
        let conditions = [];
        let codeObj = {};
        let nameObj = {};

        if (hhname) {
          codeObj = {
            code: 'projectname',
            exp: 'like',
            value: hhname
          };
          conditions.push(codeObj)
        }
        if (hhtime) {
          nameObj = {
            code: 'paymentdate',
            exp: 'like',
            value:values['hhtime'].format('YYYY-MM-DD')
          };
          conditions.push(nameObj)
        }
        const obj = {
          conditions,
          pageSize:10000
        };
        dispatch({
          type:'RM/allfetch',
          payload:obj
        })
      }
    })

  }

  render() {
    const {
      state: { current,resultInfo },
      props: { loading,form:{getFieldDecorator} ,},
    } = this;
    const {
      RM:{ tableStorage,tableInvoice ,manytableStorage,manytableInvoice},
      endLoading
    } = this.props;
    const dataProps1 = {
      toNextStep:this.toNextStep,
      loading,
      tableInvoice,
      tableStorage,
      manytableStorage,
      manytableInvoice,
      onInvoice:this.onInvoice,
      onStorage:this.onStorage,
      props:this.props,
      dataInvoice:this.state.dataInvoice,
      alldataInvoice:this.state.alldataInvoice,
      dataStorage:this.state.dataStorage,
      alldataStorage:this.state.alldataStorage,
      onDataInvoice:(res,rows)=>{
        this.setState({
          dataInvoice:res,
          alldataInvoice:rows,
        })
      },
      onDataStorage:(res,rows)=>{
        this.setState({
          dataStorage:res,
          alldataStorage:rows,
        })
      },
    };

    const dataProps2 = {
      toNextStep:this.toNextStep,
      loading,
      endLoading,
      props:this.props,
      alldataInvoice:this.state.alldataInvoice,
      alldataStorage:this.state.alldataStorage,
      resultInfo,
    };

    return (
      <PageHeaderWrapper>
        <Card bordered={false} bodyStyle={{padding:'0 24px'}}>
          <Row>
            <Col>
              <StepsBar current={current} />
              {
                [
                  <InvoiceInbound {...dataProps1}  />,
                  <InvoiceInboundTable {...dataProps2} />,
                  <Complete onNext={this.toNextStep} />,
                ][current]
              }
            </Col>
          </Row>

          <Modal
            title="发票查询"
            visible={this.state.InvoiceVisible}
            onOk={this.InvoiceHandleOk}
            width='50%'
            destroyOnClose
            onCancel={this.InvoiceHandleCancel}
          >
            <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
              <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label='项目名称'>
                {getFieldDecorator('npname', {
                  // rules: [{ required: true, message: '请输入项目名称！' }],
                })(<Input/>)}
              </FormItem>
              <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label='客户名称'>
                {getFieldDecorator('ncname', {
                  // rules: [{ required: true, message: '请输入客户名称！' }],
                })(<Input />)}
              </FormItem>
            </Form>
          </Modal>

          <Modal
            title="回款单查询"
            destroyOnClose
            visible={this.state.StorageVisible}
            onOk={this.StorageHandleOk}
            width='50%'
            onCancel={this.StorageHandleCancel}
          >
            <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
              <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label='项目名称'>
                {getFieldDecorator('hhname', {
                  rules: [{ required: true, message: '请输入项目名称！' }],
                })(<Input/>)}
              </FormItem>
              <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label='回款日期'>
                {getFieldDecorator('hhtime', {
                  rules: [{ required: true, message: '请选择回款日期！' }],
                })(<DatePicker  placeholder="请选择回款日期" style={{ width: '100%' }}/>)}
              </FormItem>
            </Form>
          </Modal>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
export default ReceiptMoney;
