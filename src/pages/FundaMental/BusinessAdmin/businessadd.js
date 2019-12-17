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
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
const FormItem = Form.Item;
const { TreeNode } = Tree;
import storage from '@/utils/storage'
import styles from '../../System/UserAdmin.less';
// test git
const fieldLabels = {
  name: 'LP名称',
  shortname: 'LP简称',
  type: '性质',
  contactperson: '联系人',
  contactinfo: '联系方式',
  email: '电子邮件',
  subscribed: '认缴投资额',
  payin: '实缴投资额',
  paydate: '缴纳时间',
  memo: '备注',
};
const newtreeData = []
const sour = [
  {
    title: '中国',
    value: '0-0',
    key: '0-0',
    children: [
      {
        title: '河南',
        value: '0-0-1',
        key: '0-0-1',
      },
      {
        title: '浙江',
        value: '0-0-2',
        key: '0-0-2',
      },
      {
        title: '上海',
        value: '0-0-3',
        key: '0-0-3',
      },
    ],
  },
  {
    title: '美国',
    value: '0-1',
    key: '0-1',
    children: [
      {
        title: '纽约',
        value: '0-1-1',
        key: '0-1-1',
      },
      {
        title: '洛杉矶',
        value: '0-1-2',
        key: '0-1-2',
      },
      {
        title: '芝加哥',
        value: '0-1-3',
        key: '0-1-3',
      },
    ],
  },
  {
    title: '韩国',
    value: '0-2',
    key: '0-2',
    children: [
      {
        title: '首尔',
        value: '0-2-1',
        key: '0-2-1',
      },
      {
        title: '仁川',
        value: '0-2-2',
        key: '0-2-2',
      },
    ],
  },
];
const data = [
  {
    key: '1',
    name: 'KS1',
    age: '上海AFGHHY',
    address: '上海',
  },
  {
    key: '2',
    name: 'KS2',
    age: '北京AFGHHY',
    address: '上海',
  },
  {
    key: '3',
    name: 'KS3',
    age: '四川AFGHHY',
    address: '上海',
  },

];
const DirectoryTree = Tree.DirectoryTree;

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

@connect(({ businessadmin, loading }) => ({
  businessadmin,
  loading: loading.models.businessadmin,
}))
@Form.create()
class Businessadd extends PureComponent {
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


  }
  columns = [
    {
      title: '客商编码',
      dataIndex: 'code',
      key: 'code',
      width: 120,
    },
    {
      title: '客商名称',
      dataIndex: 'name',
      key: 'name',
      width: 120,

    },
    {
      title: '客商类型',
      dataIndex: 'custtype',
      key: 'custtype',
      width: 120,
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
      width: 120,
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
        title:info.selectedNodes[0].props.title,

        addState:true
      })
      const obj = {
        pageIndex:0,
        pageSize:10,
        id:info.selectedNodes[0].props.dataRef.id
      }
      dispatch({
        type:'businessadmin/fetch',
        payload:obj
      })
    }else{
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
    router.push('/fundamental/businessadmin/businessnew',{addid:this.state.id,title:this.state.title});
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
    const object = {
      pageIndex:0,
      pageSize:10,
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
    router.push('/fundamental/businessadmin/businessupdate',record)
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
          ...this.state.page
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
  render() {
    const {
      businessadmin:{dataSor},
      form: { getFieldDecorator },
      loading
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
    const {initData} = this.state;
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
              <Tree
                defaultExpandAll={true}
                onSelect={this.onSelect}
              >
                {this.renderTreeNodes(this.state.valueList)}
              </Tree>
            </div>

          </Card>
          <Card title="客商档案" style={{ width:'70%',boxSizing:'border-box',overflow:'hodden' }} bordered={false}>
            <Form onSubmit={this.handleSearch} layout="inline">
              <Row gutter={{xs: 24, sm: 24, md: 24 }}>
                <Col md={24} sm={24}>
                  <FormItem label='客商编码'>
                    {getFieldDecorator('code')(<Input placeholder='客商编码' />)}
                  </FormItem>

                  <FormItem label='客商名称'>
                    {getFieldDecorator('name')(<Input placeholder='客商名称' />)}
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
              scroll={{x:this.columns.length*120}}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />

          </Card>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default Businessadd;

