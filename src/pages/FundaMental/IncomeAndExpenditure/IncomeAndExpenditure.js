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
  Select,
  Modal,
  message, Popconfirm,
} from 'antd';
import { getParentKey, toTree } from '@/pages/tool/ToTree';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
const { Option } = Select;
const { TreeNode } = Tree;
const Search = Input.Search;

@connect(({ IAE, loading }) => ({
  IAE,
  loading: loading.models.IAE,
}))
@Form.create()
class IncomeAndExpenditure extends PureComponent {
  state = {
    value: undefined,
    treeData:'',
    isdisabled:true,
    valueList:[],

    dataList:[], //原始数据

    initData:[],
    addtreeData:null,
    adddata:false,

    status:'',

    node:{},

    cloneNode:{},

    addStatus:false,
    updateStatus:false,
    deleteStatus:false,
    allvalue:[],

    expandedKeys: [],
    searchValue: '',
    autoExpandParent: true,
  }

  onSelect = (selectedKeys, info) => {
    const { dispatch } = this.props;
    console.log("info",info);
    if(info.selectedNodes[0]){
      const node = info.selectedNodes[0].props.dataRef;
      this.setState({
        node,
        isdisabled:true,
        cloneNode:node,
      })
    }else{
      this.setState({
        node:{},
        isdisabled:true,
        addStatus:false,
        updateStatus:false,
        deleteStatus:false,
      })
    }
  };

  componentDidMount(){
    const { dispatch} = this.props;
    dispatch({
      type: 'IAE/newdatasss',
      payload: {
        reqData:{}
      },
      callback:(res)=>{
        console.log("res",res)
        if (res.resData){
          const a = toTree(res.resData);
          this.setState({
            dataList:res.resData,
            valueList: a,
          })
        }
      }
    })
  }

  onChanged = (value,label, extra) => {
    console.log(value);
    this.setState({
      node:{
        ...this.state.node,
        pid:value,
      }
    });
  };

  onFocusValue = ()=>{
    const { dispatch} = this.props;
    dispatch({
      type: 'IAE/newdatasss',
      payload: {
        reqData:{}
      },
      callback:(res)=>{
        console.log("res",res)
        if (res.resData){
          const a = toTree(res.resData);
          this.setState({
            allvalue:a
          })
        }
      }
    })
  }

  onChange = value => {
    console.log(value);
    this.setState({ value });
  };

  handleSubmit = e => {
    const { dispatch,form } = this.props;
    const { status,node } = this.state;
    e.preventDefault();
    if(!status){
      message.error("请选择操作方式");
      return
    }
    form.validateFieldsAndScroll((err, values) => {
      let reqData;
      if(status === '新建'){
        reqData = {
          pid:node.id?node.id:null,
          ...values
        }
      }else if(status === '编辑'){
        reqData = {
          pid:node.pid,
          id:node.id,
          ...values
        }
      }
      console.log("reqData",reqData);
      dispatch({
        type:'IAE/addData',
        payload:{
          reqData:{
            ...reqData,
          }
        },
        callback:(res)=>{
          console.log("--res---",res);
          if(res.errMsg === "成功"){
            message.success(`${status === '新建'?'新建成功':'编辑成功'}`,1.5,()=>{
              if(status === '新建'){
                form.resetFields();
              }
              if(status === '编辑'){
                this.setState({
                  cloneNode:{
                    ...this.state.cloneNode,
                    ...values
                  }
                })
              }
              dispatch({
                type: 'IAE/newdatasss',
                payload: {
                  reqData:{}
                },
                callback:(res)=>{
                  if (res.resData){
                    const a = toTree(res.resData);
                    this.setState({
                      dataList:res.resData,
                      valueList: a,
                      isdisabled:true,
                      addStatus:false,
                      updateStatus:false,
                      deleteStatus:false,
                    })
                  }
                }
              })
            })
          }
        }
      })
    });
  };
  //编辑
  handleUpdate = e =>{
    const { node } = this.state;
    if(!node.id){
      message.error("请选择节点");
      return
    }
    this.setState({
      status:'编辑',
      isdisabled:false,
      addStatus:true,
      deleteStatus:true,
    })
  }
  //新建
  handleModalVisible = () =>{
    this.setState({
      isdisabled:false,
      status:'新建',
      node:{
        id:this.state.node.id,
        pName:this.state.node.name,
        pid:this.state.node.pid,
      },
      updateStatus:true,
      deleteStatus:true,
    })
  }

  handleRemove = e =>{
    const { dispatch,form} = this.props;
    const { node } = this.state;
    console.log("node",node)
    if(!node.id){
      message.error("请选择数据");
      return
    }
    console.log("node.id",node.id)
    dispatch({
      type: 'IAE/removenewdata',
      payload: {
        reqData:{
          id:node.id,
        }
      },
      callback:(res)=>{
        console.log("删除",res);
        if(res){
          message.success("删除成功",1,()=>{
            dispatch({
              type: 'IAE/newdatasss',
              payload: {
                reqData:{}
              },
              callback:(res)=>{
                console.log("res",res)
                if (res.resData){
                  const a = toTree(res.resData);
                  console.log("a",a)
                  this.setState({
                    dataList:res.resData,
                    valueList: a,
                    node:{}
                  })
                }
              }
            })
          })
        }
      }
    })
  }

  cancled = ()=>{
    const { form} = this.props;
    if(this.state.isdisabled){
      return
    };
    form.resetFields();
    console.log(this.state.cloneNode)
    this.setState({
      node:this.state.cloneNode,
      isdisabled:true,
      addStatus:false,
      updateStatus:false,
      deleteStatus:false,
    })
  };

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode  title={item.name} key={item.id} dataRef={item} />;
    });
  yy = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.id} value ={item.id} dataRef={item}>
            {this.yy(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode  title={item.name} key={item.id} value ={item.id} dataRef={item} />;
    });

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onChangeSearch = e => {
    const value = e.target.value;
    const { valueList,dataList } = this.state;
    if(!value){
      this.setState({expandedKeys:[]});
      return
    }
    const expandedKeys = dataList
      .map(item => {
        if (item.name.indexOf(value) > -1) {
          return getParentKey(item.id, valueList);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    const strExpandedKeys = expandedKeys.map(item =>{
      return item + ''
    });
    this.setState({
      expandedKeys:strExpandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span:6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset:12,
        },
        sm: {
          span: 16,
          offset:14,
        },
      },
    };
    const { node,isdisabled,expandedKeys,autoExpandParent,searchValue } = this.state;
    const loop = data =>
      data.map(item => {
        const index = item.name.indexOf(searchValue);
        const beforeStr = item.name.substr(0, index);
        const afterStr = item.name.substr(index + searchValue.length);
        const name =
          index > -1 ? (
            <span>
              {beforeStr}
              <span style={{ color: '#f50' }}>{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{item.name}</span>
          );
        if (item.children) {
          return (
            <TreeNode key={item.id} title={name} dataRef={item}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.id} title={name} dataRef={item}/>;
      });
    return (
      <PageHeaderWrapper>
        <div style={{display:'flex'}}>
          <Card style={{ flex:'1',marginRight:'3%',boxSizing:'border-box',overflow:'hodden' }} bordered={false}>
            <div>
              {
                this.state.addStatus?<Button icon="plus" disabled type="primary" >
                  新建
                </Button>:<Popconfirm title={node.id?"是否创建当前项子节点":"新建节点"} onConfirm={() => this.handleModalVisible()}>
                  <Button icon="plus" disabled={this.state.addStatus} type="primary" >
                    新建
                  </Button>
                </Popconfirm>
              }
              <Button style={{marginLeft:'20px'}} disabled={this.state.updateStatus} onClick={() => this.handleUpdate(true)}>
                编辑
              </Button>
              {
                this.state.deleteStatus?<Button disabled style={{marginLeft:'20px'}}  >
                  刪除
                </Button>:<Popconfirm title={formatMessage({ id: 'validation.confirmdelete' })} onConfirm={() => this.handleRemove()}>
                  <Button  style={{marginLeft:'20px'}}  >
                    刪除
                  </Button>
                </Popconfirm>
              }
            </div>
            <h3 style={{borderBottom:'1px solid #f5f5f5',height:'50px',lineHeight:'50px'}}>所有数据</h3>
            <div >
              <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={this.onChangeSearch} />
              <Tree
                onSelect={this.onSelect}
                onExpand={this.onExpand}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
              >
                {loop(this.state.valueList)}
              </Tree>
            </div>

          </Card>
          <Card title="分类明细" style={{ flex:'1',boxSizing:'border-box',overflow:'hodden' }} bordered={false}>
            <Form {...formItemLayout} layout="vertical" hideRequiredMark onSubmit={this.handleSubmit}>
              <Form.Item label="收支项目编号：">
                {getFieldDecorator('code', {
                  initialValue:node.code?node.code:'',
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Input placeholder='请填写收支项目编号' disabled={isdisabled}/>)}
              </Form.Item>
              <Form.Item label="收支项目名称：">
                {getFieldDecorator('name', {
                  initialValue:node.name?node.name:'',
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Input placeholder='请填写收支项目名称' disabled={isdisabled}/>)}
              </Form.Item>
              <Form.Item label="上级分类：">
                {getFieldDecorator('pName', {
                  initialValue:node.pName?node.pName:''
                })(<TreeSelect
                  treeDefaultExpandAll
                  onChange={this.onChanged}
                  onFocus={this.onFocusValue}
                  placeholder='上级分类'
                  disabled={isdisabled}>
                  {this.yy(this.state.allvalue)}
                </TreeSelect>)}
              </Form.Item>
              <Form.Item label="是否收入：">
                {getFieldDecorator('incomeflag', {
                  initialValue:node.incomeflag
                })(<Select placeholder="请选择是否收入" disabled={isdisabled}>
                  <Option value={0}>不是</Option>
                  <Option value={1}>是</Option>
                </Select>)}
              </Form.Item>
              <Form.Item label="是否支出：">
                {getFieldDecorator('outflag', {
                  initialValue:node.outflag
                })(<Select placeholder="请选择是否支出" disabled={isdisabled}>
                  <Option value={0}>不是</Option>
                  <Option value={1}>是</Option>
                </Select>)}
              </Form.Item>
              <Form.Item label="是否收支：">
                {getFieldDecorator('ioflag', {
                  initialValue:node.ioflag
                })(<Select placeholder="请选择是否收支" disabled={isdisabled}>
                  <Option value={0}>不是</Option>
                  <Option value={1}>是</Option>
                </Select>)}
              </Form.Item>
              <Form.Item label="封存标志：">
                {getFieldDecorator('sealflag', {
                  initialValue:node.sealflag
                })(<Select placeholder="请选择封存标志" disabled={isdisabled}>
                  <Option value={0}>未封存</Option>
                  <Option value={1}>已封存</Option>
                </Select>)}
              </Form.Item>
              <Form.Item {...tailFormItemLayout}>
                <Button onClick={this.cancled}>
                  取消
                </Button>
                <Button type="primary" htmlType="submit" style={{marginLeft:'20px'}}>
                  确定
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default IncomeAndExpenditure;

