import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import NormalTable from '@/components/NormalTable';
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Card,
  Modal,
} from 'antd';

@connect(({ CMX, loading }) => ({
  CMX,
  loading: loading.models.CMX,
}))
@Form.create()
class HistoryDetailed extends PureComponent {
  state = {

  };

  handleCancel = (handleCancel)=>{
    if(typeof handleCancel === 'function'){
      handleCancel()
    }
  };

  render() {
    const { on,data } = this.props;
    const { visible,headerData } = data;
    let pmContractBasicList = {
      list:[]
    };
    if(headerData){
      if(headerData.list){
        pmContractBasicList.list = headerData.list[0].pmContractBasicList;
        pmContractBasicList.list.map(item =>{
          item.key = item.id;
          return item
        })
      }
    }
    const { handleCancel } = on;
    const  columns = [
      {
        title: '合同编码',
        dataIndex: 'billcode',
        width:'7.6%'
      },
      {
        title: '合同名称',
        dataIndex: 'billname',
        width:'7.6%'
      },
      {
        title: '合同类型',
        dataIndex: 'type',
        width:'7.6%'
      },
      {
        title: '版本号',
        dataIndex: 'version',
        width:'7.6%'
      },
      {
        title: '合同状态',
        dataIndex: 'status',
        width:'7.6%'
      },
      {
        title: '签约日期',
        dataIndex: 'signdate',
        width:'7.6%'
      },
      {
        title: '签约地址',
        dataIndex: 'signplace',
        width:'7.6%'
      },
      {
        title: '计划生效日期',
        dataIndex: 'planValidateTime',
        width:'7.6%'
      },
      {
        title: '计划终止日期',
        dataIndex: 'planTeminateTime',
        width:'7.6%'
      },
      {
        title: '客户',
        dataIndex: 'custname',
        width:'7.6%'
      },
      {
        title: '经办部门',
        dataIndex: 'deptname',
        width:'7.6%'
      },
      {
        title: '经办人员',
        dataIndex: 'operatorname',
        width:'7.6%'
      },
      {
        title: '合同金额',
        dataIndex: 'contractmny',
      },
    ];
    const  columns2  = [
      {
        title: '收入项目',
        dataIndex: 'incomename',
        width:'20%',
        key:1
      },
      {
        title: '行号',
        dataIndex: 'rowno',
        width:'20%',
        key:2
      },
      {
        title: '金额',
        dataIndex: 'mnycurr',
        width:'20%',
        key:3
      },
      {
        title: '应收金额',
        dataIndex: 'armnycurr',
        width:'20%',
        key:4
      },
      {
        title: '实收金额',
        dataIndex: 'actrualmnycurr',
        key:5
      },
    ];

    return (
      <Modal
        title={"历史变更详情"}
        visible={visible}
        centered
        width='80%'
        onCancel={()=>this.handleCancel(handleCancel)}
        footer={[
          <Button onClick={()=>this.handleCancel(handleCancel)}>取消</Button>,
        ]}
      >
        <div style={{height:'400px',overflow:'hidden'}}>
          <Card bordered={false}>
            <NormalTable
              columns={columns}
              data={headerData}
              scroll={{ x:columns.length*120,y: 150}}
              pagination={ false }
              />
          </Card>
          <Card bordered={false} style={{marginTop:"12px"}}>
            <NormalTable
              columns={columns2}
              scroll={{ x:columns2.length*120,y: 150}}
              data={pmContractBasicList}
              pagination={ false }
            />
          </Card>
        </div>
      </Modal>
    );
  }
}

export default HistoryDetailed;
