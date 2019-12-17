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


@connect(({ matemanage, loading }) => ({
  matemanage,
  loading: loading.models.matemanage,
}))
@Form.create()
class Matemanage extends PureComponent {
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
    pageCount:0,
    total:0,
    addState:false,

    expandedKeys: [],
    searchValue: '',
    autoExpandParent: true,
  }
  columns = [
    {
      title: '物料编码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '物料名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '规格',
      dataIndex: 'spec',
      key: 'spec',
    },
    {
      title: '型号',
      dataIndex: 'model',
      key: 'model'
    },
    {
      title: '计量单位',
      dataIndex: 'ucumName',
      key: 'ucumName',
    },
    {
      title: '存货档案',
      dataIndex: 'invclName',
      key: 'invclName',
    },
    {
      title: '物料简称',
      dataIndex: 'materialshortname',
      key: 'materialshortname',
    },
    {
      title: '物料条形码',
      dataIndex: 'materialbarcode',
      key: 'materialbarcode',
    },
    {
      title: '物料助记器',
      dataIndex: 'materialmnecode',
      key: 'materialmnecode',
    },
    {
      title: '图号',
      dataIndex: 'graphid',
      key: 'graphid',
    },
    {
      title: '计划价格',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: '生产厂家',
      dataIndex: 'manufactureName',
      key: 'manufactureName',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      fixed: 'right',
      render: (text, record) =>
        <Fragment>
          <a href="#javascript:;" onClick={(e)=>this.handleUpdate(e,record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record)}>
            <a href="#javascript:;">删除</a>
          </Popconfirm>
        </Fragment>
    },
  ];
  //删除
  handleDelete = (record)=>{
    const { dispatch } = this.props;
    const { page,id } = this.props;
    dispatch({
      type: 'matemanage/delete',
      payload:{
        reqData:{
          id:record.id
        }
      },
      callback:(res)=>{
        if(res.errMsg === "成功"){
          message.success('删除成功',1,()=>{
            const obj = {
              ...page,
                id
            };
            dispatch({
              type:'matemanage/fetch',
              payload:obj
            })
          })
        }
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
        type:'matemanage/fetch',
        payload:obj
      })
    }else{
      const objrr = {
        pageIndex:0,
        pageSize:10,
      };
      dispatch({
        type:'matemanage/fetch',
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
    const { page } = this.state;
    dispatch({
      type: 'matemanage/matype',
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
    dispatch({
      type:'matemanage/fetch',
      payload:{
        pageIndex:0,
        pageSize:10,
      }
    })
  }
  //查询
  handleSearch = (e) => {
    const {form,dispatch} = this.props
    e.preventDefault();

    form.validateFieldsAndScroll( (err, values) => {
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
          conditions,
          reqData:{}
        };
        dispatch({
          type:'matemanage/fetch',
          payload: obj
        })
      }else{
        this.setState({
          conditions:[]
        });
        if(this.state.id){
          dispatch({
            type:'matemanage/fetch',
            payload: {
              id:this.state.id,
              pageIndex:0,
              pageSize:10,
            }
          })
        }else {
          dispatch({
            type:'matemanage/fetch',
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
  handleUpdate = (e,record) =>{
    e.preventDefault()
    router.push({pathname:'/fundamental/matemanage/update',record})
  }
  //新建
  handleModalVisible = () =>{

    // router.push('/fundamental/matemanage/add',{addid:this.state.id,title:this.state.title});
    router.push({pathname:'/fundamental/matemanage/add',record:{addid:this.state.id,title:this.state.title}});
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
      console.log("执行")
      const obj = {
        pageIndex: pagination.current -1,
        pageSize: pagination.pageSize,
        conditions
      };
      dispatch({
        type:'matemanage/fetch',
        payload: obj,
      });
      return
    }
    dispatch({
      type:'matemanage/fetch',
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
    });
    //清空后获取
    if(this.state.id){
      dispatch({
        type:'matemanage/fetch',
        payload: {
          id:this.state.id,
          pageIndex:0,
          pageSize:10,
        }
      })
    }else {
      dispatch({
        type:'matemanage/fetch',
        payload:{
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
      form: { getFieldDecorator },
      matemanage:{data},
      loading
    } = this.props;
    console.log('data',data)
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
              <h3 style={{height:'50px',lineHeight:'50px',float:'left'}}>物料分类</h3>
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
          <Card title="物料档案" style={{ width:'70%',boxSizing:'border-box',overflow:'hodden' }} bordered={false}>
            <Form onSubmit={this.handleSearch} layout="inline">
              <Row gutter={{xs: 24, sm: 24, md: 24 }}>
                <Col md={24} sm={24}>
                  <FormItem label='物料编码'>
                    {getFieldDecorator('code')(<Input placeholder='请输入物料编码' />)}
                  </FormItem>
                  <FormItem label='物料名称'>
                    {getFieldDecorator('name')(<Input placeholder='请输入物料名称' />)}
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

export default Matemanage;

