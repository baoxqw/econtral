import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import NormalTable from '@/components/NormalTable';
import TreeSelectTransfer from './TreeSelectTransfer'
import {
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  Divider,
  InputNumber,
  Radio,
  Icon,
  Tooltip,
  Modal,
  message, Popconfirm, Transfer,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './UserAdmin.less';
import storage from '@/utils/storage'
// test git

const FormItem = Form.Item;

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

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible,ax,pageIndex } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      const { code,name} = fieldsValue
      if (!code || !name){
        message.error('请将表单填写完整')
        return;
      }else{
        const object = {
          obj:{
            reqData:{
              ...fieldsValue,
              corp_id:1,
            }
          },
          pageIndex,
        };

        ax.dispatch({
          type:'role/add',
          payload: object
        });
        form.resetFields();
        handleModalVisible();
      }
      /*const name = localStorage.getItem("name");
      const str = name.replace(/[^0-9]/ig,"");
      const corp_id = Number(str);
      const userinfo = localStorage.getItem("userinfo");
      const user = JSON.parse(userinfo);
      const id = user.id; //用户id*/

      //handleAdd(fieldsValue);
    });

  };
  return (
    <Modal
      destroyOnClose
      title={formatMessage({ id: 'validation.newrole' })}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label={formatMessage({ id: 'validation.rolecode' })}>
        {form.getFieldDecorator('code', {
          rules: [{ required: true, message: '请输入角色编码！' }],
        })(<Input placeholder={formatMessage({ id: 'validation.inputvalue' })} />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label={formatMessage({ id: 'validation.rolename' })}>
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入角色名称！' }],
        })(<Input placeholder={formatMessage({ id: 'validation.inputvalue' })} />)}
      </FormItem>
    </Modal>
  );
});

//编辑
const CreateUpdateForm = Form.create({
  name: 'global_state',
  onFieldsChange(props, changedFields) { //当 Form.Item 子节点的值发生改变时触发，可以把对应的值转存到 Redux store
    props.fields = changedFields
  },
  mapPropsToFields(props) {
    const { name, code } = props.fields;
    return {
      name:Form.createFormField({
        value: name,
      }),
      code:Form.createFormField({
        value: code,
      }),
    }
  }})(props => {
  const { modalVisible, form, handleEditVisible, ax, fields,pageIndex} = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      const { code,name} = fieldsValue
      const id = fields.id
      if (!code || !name){
        message.error('请将表单填写完整')
        return;
      }else{
        const object = {
          req:{
            reqData:{
              ...fieldsValue,
              id
            },
          },
          pageIndex,
        };
        ax.dispatch({
          type:'role/update',
          payload: object
        });
        form.resetFields();
        handleEditVisible();
      }


    });

  };
  return (
    <Modal
      destroyOnClose
      title={formatMessage({ id: 'validation.roleupdate' })}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleEditVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label={formatMessage({ id: 'validation.rolecode' })}>
        {form.getFieldDecorator('code', {
          rules: [{ required: true, message: '请输入用户编码！' }],
        })(<Input placeholder={formatMessage({ id: 'validation.inputvalue' })} disabled/>)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label={formatMessage({ id: 'validation.rolename' })}>
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入用户名称！' }],
        })(<Input placeholder={formatMessage({ id: 'validation.inputvalue' })} />)}
      </FormItem>
    </Modal>
  );
});

@connect(({ role, loading }) => ({
  role,
  loading: loading.models.role,
}))
@Form.create()
class RoleAdmins extends PureComponent {
  state = {
    modalVisible: false,
    editVisible: false,
    distribution:false,
    selectedRows: [],
    formValues: {},
    fields: {},
    pageIndex:0,
    mockData: [], //左边框数据
    targetKeys: [], //右边框数据
    selectedKeys:[], //存放选中的数据
    dataList:[],
    valueLiset:[],
    arrList:[],
    roleId:null,
    roleData:[],
    visibleIndex:false,
    inputValue:'',
    rId:null,
  };
  columns = [
    {
      title: `${formatMessage({ id: 'validation.code' })}`,
      dataIndex: 'code',
    },
    {
      title: `${formatMessage({ id: 'validation.name' })}`,
      dataIndex: 'name',
    },

    {
      title: `${formatMessage({ id: 'validation.operation' })}`,
      render: (text, record) => (
        <Fragment>
          <Popconfirm title={formatMessage({ id: 'validation.confirmdelete' })} onConfirm={() => this.handleDelete(record)}>
            <a href="javascript:;">{formatMessage({ id: 'validation.delete' })}</a>
          </Popconfirm>
          <Divider type="vertical" />
          <a href="javascript:;" onClick={() => this.handleEditVisible(true,record)}>{formatMessage({ id: 'validation.update' })}</a>
          <Divider type="vertical" />
          <a href="javascript:;" onClick={() => this.handleDistribution(true,record)}>分配权限</a>
          <Divider type="vertical" />
          <a href="javascript:;" onClick={() => this.showModal(record)}>选择</a>
        </Fragment>
      ),
    }
  ];

  showModal = (record)=>{
    console.log("rec",record)
      this.setState({
        visibleIndex:true,
        rId:record.id,
        inputValue:record.indexpage
      })
  };


  handleIndex = e => {
    const { inputValue,rId } = this.state;
    const { dispatch } = this.props;

    if(!inputValue){
      message.error("请输入首页路径");
      return
    }
    dispatch({
      type:'role/index',
      payload:{
        reqData:{
          role_id:rId,
          indexpage:inputValue
        }
      },
      callback:(res)=>{
        if(res.errMsg ===  "成功"){
          message.success("设置成功",1,()=>{
            this.setState({
              visibleIndex: false,
              inputValue:'',
              rId:null
            });
          })
        }
      }
    })
  };

  cancelIndex = e => {
    this.setState({
      visibleIndex: false,
      inputValue:'',
      rId:null
    });
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const obj = {
      pageIndex:0,
      pageSize:10
    };
    dispatch({
      type: 'role/find',
      payload: obj
    });
  }

  //删除
  handleDelete = (record)=>{
    const { dispatch } = this.props;
    const obj = {
      id:record.id,
      pageIndex:this.state.pageIndex
    }
    dispatch({
      type: 'role/remove',
      payload: obj
    })
  };

  handleEditVisible = (flag,record) => {
    const { dispatch } = this.props;
    this.setState({
      editVisible: !!flag,
    });
    if(!this.state.editVisible){
      this.setState({
        fields: record
      })
    }
  };

  handleDistribution = (flag,record) => {
    const { dispatch } = this.props;
    this.setState({
      distribution: !!flag,
      roleId:record.id
    });
    if(!this.state.editVisible){
      this.setState({
        fields: record
      })
    }
    dispatch({
      type:'role/fetchAntu',
      payload: {
        reqData:{}
      },
      callback:(res)=>{

        if(!res.resData){
          this.setState({
            roleData:[],
            valueLiset:[]
          })
          return
        }
        const a = toTree(res.resData)
        this.setState({
          dataList:res.resData,
          valueList: a,
          roleId:record.id
        })
        dispatch({
          type:'role/roleIdAntu',
          payload:{
            id:record.id
          },
          callback:(ress)=>{
            if(!ress.resData){
              this.setState({
                roleData:[]
              })
              return
            }
            this.setState({
              roleData:ress.resData
            })
          }
        })
      }
    })
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      pageIndex: pagination.current , //第几页
      pageSize: pagination.pageSize, //每页要展示的数量
    };

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    const obj = {
        pageIndex: pagination.current -1,
        pageSize: pagination.pageSize,
    };
    this.setState({
      pageIndex:obj.pageIndex
    });
    dispatch({
      type: 'role/fetch',
      payload: obj,
    });
  };

  //查询按钮
  handleSearch = (e) => {
    const { dispatch, form } = this.props;
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
            exp:'=',
            value:code
          };
          await conditions.push(codeObj)
        }
        if(name){
          nameObj = {
            code:'name',
            exp:'=',
            value:name
          };
          await conditions.push(nameObj)
        }
        const obj = {
          conditions,
        };
        dispatch({
          type:'role/fetch',
          payload: obj
        })
      }
    })
  };

  handleReset = () => {
    const { dispatch,form} = this.props;
    //清空输入框
    form.resetFields();
    //清空后获取
    dispatch({
      type:'role/find',
      payload: {
        id:1,
        pageIndex:this.state.pageIndex,
        pageSize:10
      }
    })

  };

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label={formatMessage({ id: 'validation.rolecode' })}>
              {getFieldDecorator('code')(<Input placeholder={formatMessage({ id: 'validation.inputvalue' })}/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label={formatMessage({ id: 'validation.rolename' })}>
              {getFieldDecorator('name')(<Input placeholder={formatMessage({ id: 'validation.inputvalue' })} />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span>
              <Button type="primary" htmlType="submit">
                {formatMessage({ id: 'validation.query' })}
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                {formatMessage({ id: 'validation.cancle' })}
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  handleCancel = ()=>{
    this.setState({
      distribution:false,
    })
  }


  getTheTree = (obj)=>{
    let arr = [];
    Object.keys(obj).forEach(function(key){
      arr.push(obj[key])
    });

    this.setState({
      arrList:arr
    })
  }

  handleOk = ()=>{
    const { dispatch } = this.props;
    const { arrList,roleId } = this.state;
    if(arrList.length){
      dispatch({
        type:'role/distribution',
        payload:{
          userDefineStrGroup:arrList,
          id:roleId
        },
        callback:(res)=>{

          message.success("分配成功",1.5,()=>{
            this.setState({
              distribution:false,
            })
          })
        }
      })
    }
  }


  chanValue = (e)=>{
    this.setState({
      inputValue:e.target.value
    })
  }

  render() {
    const {
      role: { data },
      loading,
    } = this.props;
    const {valueList} = this.state;
    const { selectedRows, modalVisible, editVisible,fields,pageIndex, targetKeys ,selectedKeys} = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const editMethods = {
      handleEditVisible: this.handleEditVisible,
    };


    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.userAdmin}>
            <div className={styles.userAdminForm}>{this.renderForm()}</div>
            <div className={styles.userAdminOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                {formatMessage({ id: 'validation.new' })}
              </Button>
            </div>
            <NormalTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              //onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} ax={this.props} pageIndex={this.state.pageIndex}/>
        <CreateUpdateForm {...editMethods} modalVisible={editVisible}  ax={this.props} fields={fields} pageIndex={pageIndex}/>

         <Modal
          title="分配权限"
          visible={this.state.distribution}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={700}
          destroyOnClose={true}
        >
           <TreeSelectTransfer dataSource={valueList} rightDataList={this.state.roleData} dataList={this.state.dataList} titles={['分配权限', "已分配权限"]} onChange={this.getTheTree}/>
        </Modal>

        <Modal
          title="设置首页"
          visible={this.state.visibleIndex}
          onOk={this.handleIndex}
          onCancel={this.cancelIndex}
        >
          <Input value={this.state.inputValue} onChange={(e)=>this.chanValue(e)}/>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default RoleAdmins;
