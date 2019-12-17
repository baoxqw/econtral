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
  Checkbox,
  InputNumber,
  Tree,
  Icon,
  Tooltip,
  Modal,
  message, Popconfirm,
} from 'antd';
import router from 'umi/router';
import { getParentKey, toTree } from '@/pages/tool/ToTree';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
const FormItem = Form.Item;
const { TreeNode } = Tree;
const Search = Input.Search;

@connect(({ businessadmin, loading }) => ({
  businessadmin,
  loading: loading.models.businessadmin,
}))
@Form.create()
class SupplierManagement extends PureComponent {
  state = {
    value: undefined,
    conditions:[],
    treeData:'',
    isdisabled:true,
    valueList:[],
    allvalue:[],
    dataList:[], //原始数据
    pid:null,
    id:null,
    initData:[],
    addtreeData:null,
    adddata:false,
    addState:false,
    page:{},
    pageCount:'',
    total:0,

    expandedKeys: [],
    searchValue: '',
    autoExpandParent: true,
  }
  columns = [
    {
      title: '供应商编码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '供应商名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '供应商类型',
      dataIndex: 'custtype',
      key: 'custtype',
      render:(text,item)=>{
        if(text == 1){
          return '客商'
        }else if(text == 2){
          return '客户'
        }else if(text == 3){
          return '供应商'
        }

      }

    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) =>
        <Fragment>
          <a href="javascript:;" onClick={() => this.handleUpdate(true,record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="确定删除吗?"  onConfirm={() => this.handleDelete(record)}>
            <a href="javascript:;">删除</a>
          </Popconfirm>
        </Fragment>
    },
  ];
  //删除
  handleDelete = (record)=>{
    const { dispatch } = this.props;
    const conditions = [{
      code:'CUST_ID',
      exp:'=',
      value:record.id+''
    }];
    dispatch({
      type: 'businessadmin/fetchCMX',
      payload: {
        conditions
      },
      callback:(res)=>{
        if(res.resData && res.resData.length){
          message.error("存在合同不能删除")
        }else{
          dispatch({
            type: 'businessadmin/remove',
            payload:{
              reqData:{
                id:record.id
              }
            },
            callback:(res)=>{
              message.success('删除成功',1,()=>{
                const obj = {
                  pageIndex:0,
                  pageSize:10,
                  id:this.state.id
                }
                dispatch({
                  type:'businessadmin/fetch',
                  payload:obj
                })
              })
            }
          })
        }
      }
    })
  };
  onSelect = (selectedKeys, info) => {

    const { dispatch} = this.props;
    if(info.selectedNodes[0]){
      this.setState({
        id:info.selectedNodes[0].props.dataRef.id,
        title:info.selectedNodes[0].props.dataRef.name,
        addState:true
      })
      let conditions = [];
      let codeObj = {
        code:'CUSTTYPE',
        exp:'like',
        value:'3'
      };
      conditions.push(codeObj)
      const obj = {
        pageIndex:0,
        pageSize:10,
        id:info.selectedNodes[0].props.dataRef.id,
        conditions
      }
      dispatch({
        type:'businessadmin/fetch',
        payload:obj
      })
    }
    else
      {
      const objtt = {
        pageIndex:0,
        pageSize:10,
      }
      dispatch({
        type:'businessadmin/fetch',
        payload:objtt
      })
      this.setState({
        id:null,
        addState:false
      })

    }

  };
  handleBussiness = () => {
    router.push({pathname:'/fundamental/suppliermanagement/add',record:{addid:this.state.id,title:this.state.title}});
  };
  componentDidMount(){
    const { dispatch} = this.props;
    //  树的数据
    dispatch({
      type:'businessadmin/tree',
      payload:{},
      callback:(res)=>{

        if (res){
          const a = toTree(res)
          this.setState({
            dataList:res,
            valueList: a,
            allvalue:a
          })
        }
      }
    })
    //  表格的数据
    let conditions = [];
    let codeObj = {
      code:'CUSTTYPE',
      exp:'like',
      value:'3'
    };
    conditions.push(codeObj)
    const object = {
      pageIndex:0,
      pageSize:10,
      conditions
    }
    dispatch({
      type:'businessadmin/fetch',
      payload:object
    })
  }

  onChange = value => {
    this.setState({ value });
  };
  //查询
  handleSearch = (e) => {
    const {form,dispatch} = this.props

    e.preventDefault();
    form.validateFieldsAndScroll(async (err, values) => {
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
          await conditions.push(codeObj)
        }
        if(name){
          nameObj = {
            code:'name',
            exp:'like',
            value:name
          };
          await conditions.push(nameObj)
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
          type:'businessadmin/fetch',
          payload: obj
        })
      }else{
        this.setState({
          conditions:[]
        })
        if(this.state.id){
          dispatch({
            type:'businessadmin/fetch',
            payload: {
              id:this.state.id,
              pageIndex:0,
              pageSize:10,
            }
          })
        }else{
          dispatch({
            type:'businessadmin/fetch',
            payload: {
              pageIndex:0,
              pageSize:10,
            }
          })
        }
      }
    })
  };
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
        type:'businessadmin/fetch',
        payload: obj,
      });
      return
    }
    dispatch({
      type:'businessadmin/fetch',
      payload:obj
    })
    this.setState({
      page:obj
    })
  };
  //编辑
  handleUpdate = (flag,record) => {
    router.push({pathname:'/fundamental/suppliermanagement/update',record:record})
  }
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
        type:'businessadmin/fetch',
        payload: {
          id:this.state.id,
          pageIndex:0,
          pageSize:10,
        }
      })
    }else{
      dispatch({
        type:'businessadmin/fetch',
        payload: {
          pageIndex:0,
          pageSize:10,
        }
      })
    }


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
      businessadmin:{dataSor},
      form: { getFieldDecorator },
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
            <div style={{overflow:'hidden',float:'right',marginTop:'8px'}}>{
              this.state.addState?<Button  icon="plus" type="primary" onClick={this.handleBussiness}>
                新建
              </Button>:''
            }</div>
            <div style={{overflow:'hidden',borderBottom:'1px solid #f5f5f5',}}>
              <h3 style={{height:'50px',lineHeight:'50px',float:'left'}}>客商分类</h3>
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
          <Card title="供应商档案" style={{ width:'75%',boxSizing:'border-box',overflow:'hodden' }} bordered={false}>
            <Form onSubmit={this.handleSearch} layout="inline">
              <Row gutter={{xs: 24, sm: 24, md: 24 }}>
                <Col md={24} sm={24}>
                  <FormItem label='供应商编码'>
                    {getFieldDecorator('code')(<Input placeholder='供应商编码' />)}
                  </FormItem>

                  <FormItem label='供应商名称'>
                    {getFieldDecorator('name')(<Input placeholder='供应商名称' />)}
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
              </Row>
            </Form>
            <NormalTable
              style={{marginTop:'15px'}}
              loading={loading}
              data={dataSor}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />

          </Card>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default SupplierManagement;

