import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import NormalTable from '@/components/NormalTable';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  InputNumber,
  Divider,
  Icon,
  Tooltip,
  AutoComplete,
  Row,
  Col,
  message,
  Tree,
  Table,
  Tabs,
  Modal
} from 'antd';
const { Option } = Select;
const FormItem = Form.Item;
const { TreeNode } = Tree;

function toTree(data) {
  // 删除 所有 children,以防止多次调用
  data.forEach(function (item) {
    delete item.routes;
  });
  // 将数据存储为 以 id 为 KEY 的 map 索引数据列
  let map = {};
  data.forEach((item) =>{
    map[item.id] = item;
  });
  let val = [];
  data.forEach((item)=>{
    //item.key = item.id;
    // 以当前遍历项的pid,去map对象中找到索引的id
    let parent = map[item.pid];
    // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
    if (parent) {
      (parent.children || ( parent.children = [] )).push(item);
    } else {
      //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
      val.push(item);
    }
  });
  return val;
}

@connect(({ TB, loading }) => ({
  TB,
  submitting: loading.models.TB,
}))
@Form.create()

class TreeTableClick extends PureComponent {
  state={
    visible:false,
    selectedRowKeys:[],
  };


  handleChange = (value,onSelectChange)=>{
    let numberSelect = value.map((item)=>{
      return Number(item)
    })
    this.setState({
      selectedRowKeys:numberSelect
    });
    onSelectChange(value)
  };

  onButton = (onButton)=>{
    const {data:{SelectValue}} = this.props;
    let numberSelect = [];
    if(SelectValue){
      numberSelect = SelectValue.map((item)=>{
        return Number(item)
      })
    }

    this.setState({
      visible:true,
      selectedRowKeys:numberSelect
    })
    onButton();
  }

  onSelect = (selectedKeys, info,onSelectTree) => {
    onSelectTree(selectedKeys, info)
  };

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode defaultExpandAll title={item.name} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode  title={item.name} key={item.id} dataRef={item} />;
    });

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  handleTableChange = ()=>{

  }

  onFocus=(onFocusInput)=>{
    onFocusInput()
  };

  handleOk = (onOk)=>{
    const { selectedRowKeys } = this.state;
    let stringSelect = selectedRowKeys.map((item)=>{
      return item + ''
    });
    this.setState({
      visible:false,
    });
    onOk(stringSelect)
  }

  handleCancel = ()=>{
    this.setState({
      visible:false
    })
  }

  render() {
    const {
      on,
      form:{getFieldDecorator},
      loading,
      data,
      columns,
      fetchList=[],
      title
    } = this.props;
    const { onButton,onSelectTree,handleTableChange,onFocusInput,onOk,onCancel,onSelectChange } = on;
    const { TreeData,TableData,childrenList,SelectValue  } = data;
    const { selectedRowKeys } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    if(TableData && TableData.list){
      TableData.list.map(item=>{
        item.key = item.id;
        return item
      })
    }

    const children = (data)=>{
      if(!data || !data.length){
        return;
      }
      return data.map((item)=>{
        return <Option key={item.id}>{item.name}</Option>
      })
    }

    return (
      <div>
        <div style={{display:'flex'}}>
          <Select
            mode="multiple"
            style={{ width: '80%' }}
            value={SelectValue}
            onFocus={()=>this.onFocus(onFocusInput)}
            onChange={(value)=>this.handleChange(value,onSelectChange)}
          >
            {children(childrenList)}
          </Select>
          <Button onClick={()=>this.onButton(onButton)} style={{marginLeft:'5px'}}>
            详情
          </Button>
        </div>
        <div>
          <Modal
            title={title}
            visible={this.state.visible}
            width='70%'
            onOk={()=>this.handleOk(onOk)}
            onCancel={()=>this.handleCancel(onCancel)}
          >
            <div style={{display:'flex'}}>
              <Card style={{ width:'35%'}} bordered>
                <div >
                  <Tree
                    defaultExpandAll
                    onSelect={(selectedKeys,info)=>this.onSelect(selectedKeys, info,onSelectTree)}
                  >
                    {this.renderTreeNodes(TreeData)}
                  </Tree>
                </div>
              </Card>
              <Card title="" style={{ width:'75%'}} bordered>
                <Form onSubmit={this.handleSearch} layout="inline">
                  <Row gutter={{xs: 24, sm: 24, md: 24 }}>
                    <Col>
                      {
                        fetchList.map((item,index)=>{
                            return (
                              <FormItem label={item.label} key={item.index}>
                                {getFieldDecorator(item.code)(<Input placeholder={item.placeholder} />)}
                              </FormItem>
                            )
                        })
                      }
                    </Col>
                    <Col md={12} sm={12}>
                      <span style={{display:'inline-block',margin:'10px 0 15px 0',}}>
                    <Button type="primary" htmlType="submit">
                      查询
                    </Button>
                    <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                      取消
                    </Button>
                  </span>
                    </Col>
                    <Col>
                    </Col>
                  </Row>
                </Form>
               <NormalTable
                  loading={loading}
                  data={TableData}
                  columns={columns}
                  rowSelection={rowSelection}
                  onChange={()=>this.handleTableChange(handleTableChange)}
                 />
              </Card>
            </div>
          </Modal>
        </div>
      </div>

    );
  }
}

export default TreeTableClick;
