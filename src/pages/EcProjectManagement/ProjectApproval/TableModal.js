import React, { PureComponent, Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Divider,
  Popconfirm,
  Form,
  Button,
  Modal,
} from 'antd';
import NormalTable from '@/components/NormalTable';
import './tableBg.less'

@Form.create()

class TableModal extends PureComponent {
  state = {
    visible:false,
    rowId:null,
    data:{
      list:[]
    },
    table:{
      list:[]
    }
  };

  setRowClassName = (record) => {
    return record.id === this.state.rowId ? 'clickRowStyl' : '';
  };

  handleOk = (onOk)=>{
      onOk(this.state.table.list)

    this.setState({
      visible:false,
      rowId:null,
      data:[],
      table:{
        list:[]
      }
    })
  }

  handleCancel = (onCancel)=>{
    if(onCancel === 'function'){
      onCancel()
    }
    this.setState({
      visible:false,
      rowId:null,
      data:[],
      table:{
        list:[]
      }
    })
  }

  onClick = (onClick)=>{
      console.log("11")
      onClick().then((res)=>{
        this.setState({
          data:{
            list:res
          }
        })
      },()=>{

      })

    this.setState({
      visible:true,
    })
  };

  render() {
    const {
      onClickRow,
      onOk,
      onCancel,
      columns1,
      columns2,
      title,
      button,
      onClick,
    } = this.props;

    return (
      <div>
        <div>
          <Button type="primary" style={{marginLeft:'20px'}} onClick={()=>this.onClick(onClick)} >{button}</Button>
        </div>
        <div>
          <Modal
            destroyOnClose
            centered
            title={title}
            visible={this.state.visible}
            width={'70%'}
            // onOk={()=>this.handleOk(onOk)}
             onCancel={()=>this.handleCancel(onCancel)}
            footer={[
              // 定义右下角 按钮的地方 可根据需要使用 一个或者 2个按钮
              <Button   onClick={()=>this.handleCancel(onCancel)}>
                取消
              </Button>,
              <Popconfirm title='模板导入之后将替换原始数据，确认导入吗?' onConfirm={()=>this.handleOk(onOk)}>
                <Button  type="primary">
                  提交
                </Button>
              </Popconfirm>
             ,
            ]}
          >
            <div style={{height:'500px',overflow:'hidden'}}>
              <NormalTable
                scroll={{ y: 180}}
                data={this.state.data}
                pagination={false}
                onRow={(record )=>{
                  return {
                    onClick:()=>{
                        onClickRow(record).then((res)=>{
                          this.setState({
                            table:{
                              list:res
                            }
                          })
                        },()=>{})
                      this.setState({
                        rowId: record.id,
                      })
                    },
                     rowKey:record.id
                  }
                }}
                rowClassName={this.setRowClassName}
                columns={columns1}
              />
              <Divider style={{margin:20}}/>
              <NormalTable
                data={this.state.table}
                scroll={{ y: 180}}
                pagination={false}
                columns={columns2}
              />
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}

export default TableModal;
