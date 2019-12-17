import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import NormalTable from '@/components/NormalTable';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Table,
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  Divider ,
  Button,
  Card,
  TextArea,
  Tree,
  Modal,
  message, Popconfirm,
} from 'antd';
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { getParentKey, toTree } from '@/pages/tool/ToTree';
const FormItem = Form.Item;
const { TreeNode } = Tree;
const Search = Input.Search;

@connect(({ personal, loading }) => ({
  personal,
  loading: loading.models.personal,
}))
@Form.create()
class PersonalFilelist extends PureComponent {
  state = {
    value: undefined,
    treeData:'',
    isdisabled:true,
    valueList:[],
    allvalue:[],
    dataList:[], //原始数据
    pid:null,
    dataRef:'',
    conditions:[],
    selectedRows: [],
    id:null,
    title:'',
    initData:[],
    addtreeData:null,
    adddata:false,
    page:{},
    pageCount:0,
    total:0,
    addState:false,

    expandedKeys: [],
    searchValue: '',
    autoExpandParent: true,
  }
  columns = [
    {
      title: '人员编码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '人员名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '部门',
      dataIndex: 'deptname',
      key: 'deptname',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) =>
        <Fragment>
          <a href="javascript:;" onClick={()=>this.handleUpdate(record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record)}>
          <a href="javascript:;">删除</a>
          </Popconfirm>
        </Fragment>
    },
  ];
  //删除
  handleDelete = (record)=>{
    const { dispatch } = this.props;
    /*const conditions = [{
      code:'cu',
      exp:'=',
      value:record.id+''
    }];
    console.log("conditions",conditions)
    dispatch({
      type:'personal/fetchCMX',
      payload: {
        conditions
      },
      callback:(res)=>{
        console.log("res",res)
        if(res.resData && res.resData.length){
          message.error("存在合同不能删除")
        }else{
          dispatch({
            type:'personal/fetchpApproval',
            payload: {
              conditions
            },
            callback:(res)=>{
              console.log("res2",res)
              if(res.resData && res.resData.length){
                message.error("存在立项不能删除")
              }else{

              }
            }
          })
        }
      }
    })*/
    dispatch({
      type: 'personal/remove',
      payload:{
        reqData:{
          id:record.id
        }
      },
      callback:(res)=>{
        message.success('删除成功');
        const obj = {
          pageIndex:0,
          pageSize:10,
          id:this.state.id
        };
        dispatch({
          type:'personal/fetch',
          payload:obj
        })
      }
    })
  };

  onSelect = (selectedKeys, info) => {
    const { dispatch} = this.props;
    if(info.selectedNodes[0]){
      this.setState({
        dataRef:info.selectedNodes[0].props,
        id:info.selectedNodes[0].props.dataRef.id,
        title:info.selectedNodes[0].props.dataRef.name,
        addState:true
      })
      const obj = {
        pageIndex:0,
        pageSize:10,
        id:info.selectedNodes[0].props.dataRef.id
      }
      dispatch({
        type:'personal/fetch',
        payload:obj
      })
    }else{
      const objrr = {
        pageIndex:0,
        pageSize:10,
      }
      dispatch({
        type:'personal/fetch',
        payload:objrr
      })
      this.setState({
        id:null,
        addState:false
      })
    }

  };

  componentDidMount(){
    const { dispatch} = this.props;
    dispatch({
      type: 'personal/newdata',
      payload: {
        reqData:{}
      },
      callback:(res)=>{

        if (res.resData){
          const a = toTree(res.resData);
          this.setState({
            dataList:res.resData,
            valueList: a,
          })
        }
      }
    })
    //表格数据
    const object = {
      pageIndex:0,
      pageSize:10,
    };
    dispatch({
      type:'personal/fetch',
      payload:object
    })
  }

  //查询
  handleSearch = (e) => {
    const {form,dispatch} = this.props
    e.preventDefault();

    form.validateFieldsAndScroll((err, values) => {
      const {code,name} = values;
      if(code || name){
        let conditions = [];
        let codeObj = {};
        let nameObj = {};

        if(code){
          codeObj = {
            code:'code',
            exp:'like',
            value:code
          };
          conditions.push(codeObj)
        }
        if(name){
          nameObj = {
            code:'name',
            exp:'like',
            value:name
          };
          conditions.push(nameObj)
        }
        this.setState({
          conditions
        })
        const obj = {
          pageIndex:0,
          pageSize:10,
          conditions,
        };
        dispatch({
          type:'personal/fetch',
          payload: obj
        })
      }else{
        this.setState({
          conditions:[]
        })
        if(this.state.id){
          dispatch({
            type:'personal/fetch',
            payload: {
              id:this.state.id,
              pageIndex:0,
              pageSize:10,
            }
          })
        }else{
          dispatch({
            type:'personal/fetch',
            payload:{
              pageIndex:0,
              pageSize:10,
            }
          })
        }
      }
    })
  };


  //编辑
  handleUpdate = record =>{
    router.push({pathname:'/fundamental/personalfile/update',record:record})
  }
  //新建
  handleModalVisible = () =>{
    router.push({pathname:'/fundamental/personalfile/add',record:{addid:this.state.id,title:this.state.title}});
    // router.push('/fundamental/personalfile/add',{addid:this.state.id,title:this.state.title});
  }
  //分页
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { conditions } = this.state;
    const obj = {
      pageIndex: pagination.current-1,
      pageSize:pagination.pageSize,
      id:this.state.id
    };
    if(conditions.length){
      const obj = {
        pageIndex: pagination.current -1,
        pageSize: pagination.pageSize,
        conditions
      };
      dispatch({
        type:'personal/fetch',
        payload: obj,
      });
      return
    }
    dispatch({
      type:'personal/fetch',
      payload:obj
    })
  };
  //取消
  handleReset = () => {
    const { dispatch,form} = this.props;
    //清空输入框
    form.resetFields();
    this.setState({
      conditions:[]
    })
    //清空后获取
    if(this.state.id){
      dispatch({
        type:'personal/fetch',
        payload: {
          id:this.state.id,
          pageIndex:0,
          pageSize:10,
        }
      })
    }else{
      dispatch({
        type:'personal/fetch',
        payload:{
          pageIndex:0,
          pageSize:10,
        }
      })
    }


  };
  handleRemove = e =>{
    const { dispatch} = this.props;
    dispatch({
      type: 'businessadmin/removenewdata',
      payload: {
        reqData:{
          id:this.state.id,
        }
      },
      callback:(res)=>{
        dispatch({
          type: 'businessadmin/newdata',
          payload: {
            reqData:{}
          },
          callback:(res)=>{
            if (res.resData){
              const a = toTree(res.resData)
              this.setState({
                dataList:res.resData,
                valueList: a
              })
            }
          }
        })
      }
    })
  }

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
      personal:{data,list},
      form,
      loading
    } = this.props;
    const { expandedKeys,autoExpandParent,searchValue } = this.state;
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
          <Card style={{ width:'25%',marginRight:'3%',boxSizing:'border-box',overflow:'hodden' }} bordered={false}>
            <div style={{overflow:'hidden',float:'right',marginTop:'8px'}}> {
              this.state.addState?<Button icon="plus" type="primary" onClick={this.handleModalVisible}>
                新建
              </Button>:''
            }</div>
            <div style={{overflow:'hidden',borderBottom:'1px solid #f5f5f5',}}>
              <h3 style={{height:'50px',lineHeight:'50px',float:'left'}}>人员档案</h3>
              {/*  <Button style={{float:'right',marginTop:'10px'}} onClick={() => this.handleRemoveBussiness(true)}>
                刪除
              </Button>*/}
            </div>
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
          <Card title="人员档案" style={{ width:'70%',boxSizing:'border-box',overflow:'hodden' }} bordered={false}>
            <Form onSubmit={this.handleSearch} layout="inline">
              <Row gutter={{xs: 24, sm: 24, md: 24 }}>
                <Col md={24} sm={24}>
                  <FormItem label='人员编码'>
                    {getFieldDecorator('code')(<Input placeholder='人员编码' />)}
                  </FormItem>
                  <FormItem label='姓名'>
                    {getFieldDecorator('name')(<Input placeholder='姓名' />)}
                  </FormItem>
                  <span style={{display:'inline-block',margin:'3px 0 15px 0',}}>
                    <Button type="primary" htmlType="submit">
                      查询
                    </Button>
                    <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                      取消
                    </Button>

                  </span>
                </Col>
                <Col md={8} sm={10}>

                </Col>
                <Col>
                </Col>
              </Row>
            </Form>
            <NormalTable
              loading={loading}
              data={data}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />

          </Card>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default PersonalFilelist;

