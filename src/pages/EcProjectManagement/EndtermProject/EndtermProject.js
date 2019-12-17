import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import storage from '@/utils/storage'
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Button,
  Card,
  Divider,
  DatePicker,
  Radio,
  Icon,
  Upload,
  Modal,
  message,
  Switch,
  Popconfirm,
  Transfer,
} from 'antd';
import NormalTable from '@/components/NormalTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
import styles from '../../System/UserAdmin.less';
const { Option } = Select;
const { RangePicker} = DatePicker;
const FormItem = Form.Item;
const mockData = [];
const { TextArea } = Input;
const props = {
  name: 'file',
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};
const data = [];

for (let i = 0; i < 10; i++) {
  data.push({
    key: i,
    name: `name ${i}`,
    age: 32,
    address: `a. ${i}`,
    phone:'2',
    money:'100',
    his:'未完成',
    per:'hey'
  });
}
const data2 = [
  {
    key: '1',
    predict: '20',
    process: '40',
    people: 'Allay',
    data: '2019-2-22',
    class:'测试部'
  },
  {
    key: '2',
    predict: '40',
    process: '70',
    people: 'Allay',
    data: '2019-2-22',
    class:'测试部'
  },
]
const handleCorpAdd = () => {
  console.log('----')
  router.push('/projectmanagement/projectassign/add');
};
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: record => ({
    disabled: record.name === 'Disabled User', // Column configuration not to be checked
    name: record.name,
  }),
};

for (let i = 0; i < 20; i++) {
  mockData.push({
    key: i.toString(),
    title: `content${i + 1}`,
    description: `description of content${i + 1}`,
    disabled: i % 3 < 1,
  });
}

const oriTargetKeys = mockData
// .filter(item => +item.key % 3 > 1)
// .map(item => item.key);
@connect(({ fundproject, loading }) => ({
  fundproject,
  loading: loading.models.fundproject,
}))
@Form.create()

class EndtermProject extends PureComponent {
  state = {
    visible: false,
    mockData: [], //左边框数据
    targetKeys: [], //右边框数据
    selectedKeys:[], //存放选中的数据
    disabled: false,
    create_id:null,  //创建人id
    pageIndex:0,
    show:0,
    typeValue:1,
    attachdata:[],
    visibleModal:false,
    addvisib:false,//新建弹出框
    updatevisib:false,//修改弹出框
    detailvisib:false,//详情弹出框
    bosomvisib:false,//历史里程碑弹出框
    marketvisib:false,//营销里程碑弹出框
    hismarketvisib:false,//历史营销里程碑弹出框
    endvisib:false,//结项申请弹出框
  };

  showModal = async (record) => {
    console.log('record',record)
    // e.preventDefault();
    await this.setState({
      visible: true,
      create_id: record.id
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'fundproject/assign',
      payload:{
        id: record.id,
        pageSize:1000
      },
      callback:(res)=>{
        if(res){
          let newArray = [];
          for(let i=0;i<res.length;i++){
            const data = {
              key: i.toString(),
              id: res[i].id,
              title: res[i].name,
              description: res[i].name,
              chosen: Math.random() * 2 > 1,
            };
            newArray.push(data);
          }
          this.setState({
            mockData:newArray
          });
        }
      }
    });
  };

  handleChanged =(value) => {
    if(value == 0){
      this.setState({
        //updatevisib
        addvisib:true,//新建弹出框
        updatevisib:false,//修改弹出框
        detailvisib:false,//详情弹出框
        bosomvisib:false,//历史里程碑弹出框
        marketvisib:false,//营销里程碑弹出框
        hismarketvisib:false,//历史营销里程碑弹出框
        endvisib:false,//结项申请弹出框
      })
    }
    else if(value == 1){
      this.setState({
        addvisib:false,//新建弹出框
        updatevisib:true,//修改弹出框
        detailvisib:false,//详情弹出框
        bosomvisib:false,//历史里程碑弹出框
        marketvisib:false,//营销里程碑弹出框
        hismarketvisib:false,//历史营销里程碑弹出框
        endvisib:false,//结项申请弹出框
      })
    }
    else if(value == 2){
      this.setState({
        addvisib:false,//新建弹出框
        updatevisib:false,//修改弹出框
        detailvisib:true,//详情弹出框
        bosomvisib:false,//历史里程碑弹出框
        marketvisib:false,//营销里程碑弹出框
        hismarketvisib:false,//历史营销里程碑弹出框
        endvisib:false,//结项申请弹出框
      })
    }
    else if(value == 3){
      this.setState({
        addvisib:false,//新建弹出框
        updatevisib:false,//修改弹出框
        detailvisib:false,//详情弹出框
        bosomvisib:true,//历史里程碑弹出框
        marketvisib:false,//营销里程碑弹出框
        hismarketvisib:false,//历史营销里程碑弹出框
        endvisib:false,//结项申请弹出框
      })
    }
    else if(value == 4){
      this.setState({
        addvisib:false,//新建弹出框
        updatevisib:false,//修改弹出框
        detailvisib:false,//详情弹出框
        bosomvisib:false,//历史里程碑弹出框
        marketvisib:true,//营销里程碑弹出框
        hismarketvisib:false,//历史营销里程碑弹出框
        endvisib:false,//结项申请弹出框
      })
    }
    else if(value == 5){
      this.setState({
        addvisib:false,//新建弹出框
        updatevisib:false,//修改弹出框
        detailvisib:false,//详情弹出框
        bosomvisib:false,//历史里程碑弹出框
        marketvisib:false,//营销里程碑弹出框
        hismarketvisib:true,//历史营销里程碑弹出框
        endvisib:false,//结项申请弹出框
      })
    }
    else if(value == 6){
      this.setState({
        addvisib:false,//新建弹出框
        updatevisib:false,//修改弹出框
        detailvisib:false,//详情弹出框
        bosomvisib:false,//历史里程碑弹出框
        marketvisib:false,//营销里程碑弹出框
        hismarketvisib:false,//历史营销里程碑弹出框
        endvisib:true,//结项申请弹出框
      })
    }
    console.log(`selected ${value}`);
  }
  handleCancel = (e) => {
    this.setState({
      visible: false,
      targetKeys:[]
    });
  };

  columns = [
    {
      title: '申请单编号',
      dataIndex: 'key',
    },
    {
      title: '项目名称',
      dataIndex: 'name',

    },
    {
      title: '项目类型',
      dataIndex: 'age',

    },
    {
      title: '项目负责人',
      dataIndex: 'per',

    },
    {
      title:'负责部门',
      dataIndex: 'phone',
    },
    {
      title:'项目合同额（元）',
      dataIndex: 'money',
    },
    {
      title:'项目状态',
      dataIndex: 'his',
    },
    {
      title: '管理',
      render: (text, record) => (
        <Fragment>
          <Select placeholder="请选择操作" style={{width:120}} onChange={this.handleChanged}>
            <Option value="0">新建</Option>
            <Option value="1">修改</Option>
            <Option value="2">详情</Option>
            <Option value="99">流程图</Option>
            <Option value="999">预览</Option>
          </Select>
        </Fragment>
      ),
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <Popconfirm title='确认删除吗？'>
            <a href="javascript:;">删除</a>
          </Popconfirm>
          <Divider type="vertical" />
          <span style={{color:'#40a9ff',cursor:'pointer'}} type="primary" >
           撤回
          </span>
        </Fragment>
      ),
    },
  ];
  columns2 = [

    {
      title: '预估进度',
      dataIndex: 'predict',
      key: 'predict',
    },
    {
      title: '项目进度',
      dataIndex: 'process',
      key: 'process',
    },
    {
      title: '创建人',
      dataIndex: 'people',
      key: 'people',
    },
    {
      title: '创建时间',
      dataIndex: 'data',
      key: 'data',
    },
    {
      title: '创建部门',
      dataIndex: 'class',
      key: 'class',
    },
  ]
  componentDidMount() {
    const { dispatch } = this.props;

  }
  //新建弹出框操作
  addOk = e => {
    this.setState({
      addvisib: false,
    });
  };
  addCancle = e => {
    this.setState({
      addvisib: false,
    });
  };
  //修改操作
  updateOk = e => {
    this.setState({
      updatevisib: false,
    });
  };
  updateCancle = e => {
    this.setState({
      updatevisib: false,
    });
  };
  onChangeData =(date, dateString) =>{
    console.log('历史进度时间：', dateString);
  }
  //项目里程碑填报
  detailOk = e => {
    this.setState({
      detailvisib: false,
    });
  };
  detailCancle = e => {
    this.setState({
      detailvisib: false,
    });
  };
  onChangeTime = (date, dateString) =>{
    console.log('项目里程碑填报：', dateString);
  }
  handleChangePro = (value) =>{
    console.log(`selected ${value}`);
  }
  //历史里程碑
  bosomOk = e => {
    this.setState({
      bosomvisib: false,
    });
  };
  bosomCancle = e => {
    this.setState({
      bosomvisib: false,
    });
  };
  //营销里程碑填报
  marketOk  = e => {
    this.setState({
      marketvisib: false,
    });
  };
  marketCancle = e => {
    this.setState({
      marketvisib: false,
    });
  };
  //历史营销里程碑
  hismarketOk = e => {
    this.setState({
      hismarketvisib: false,
    });
  };
  hismarketCancle = e => {
    this.setState({
      hismarketvisib: false,
    });
  };
  //项目结项申请
  endOk = e => {
    this.setState({
      endvisib: false,
    });
  };
  endCancle = e => {
    this.setState({
      endvisib: false,
    });
  };
  onChangeType = e =>{
    this.setState({
      typeValue: e.target.value,
    });
  }

  handleSearch = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'fundproject/fetch',
      payload: params,
    });
  };

  //查询
  findList = (e) => {
    const { dispatch, form } = this.props;
    e.preventDefault();

  }
  //计划出发时间
  onStartChange = (date, dateString)=>{

  }
  //计划结束时间
  onEndChange = (date, dateString)=>{

  }
  //取消
  handleFormReset = ()=>{
    const { dispatch,form} = this.props;
    //清空输入框
    form.resetFields();
    //清空后获取列表
    dispatch({
      type:'fundproject/fetch',
      payload:{
        id:1
      }
    })
  }
  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.findList} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label='申请编号'>
              {getFieldDecorator('code')(<Input placeholder='申请编号' />)}
            </FormItem>
          </Col>
          <Col md={8} sm={16}>
            <FormItem label='项目名称'>
              {getFieldDecorator('projectname')(<Input placeholder='项目名称' />)}
            </FormItem>
          </Col>
          <Col md={8} sm={16}>
            <span>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
               取消
              </Button>
            </span>
          </Col>
          {/*          <Col md={8} sm={16}>
            <FormItem label='申请状态'>
              {getFieldDecorator('status')(
                <Select >
                  <Option value="0">状态1</Option>
                  <Option value="1">状态2</Option>
                </Select>
              )}
            </FormItem>
          </Col>*/}
        </Row>
        {/* <Row>
          <Col md={8} sm={24}>
            <span>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
               取消
              </Button>
            </span>
          </Col>
        </Row>*/}
      </Form>
    );
  }
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    /*
      pagination中包含：
        current: 2
        pageSize: 10
        showQuickJumper: true
        showSizeChanger: true
        total: 48
    */
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    const params = {
      pageIndex: pagination.current, //第几页
      pageSize: pagination.pageSize, //每页要展示的数量
    };

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    // const user = storage.get("userinfo");
    const id = 1;
    const user_id =2;
    const obj = {
      id,
      pageIndex: pagination.current-1,
      pageSize: pagination.pageSize,
      reqData:{
        user_id
      }
    };
    this.setState({
      pageIndex:obj.pageIndex
    });
    dispatch({
      type: 'fundproject/fetch',
      payload: obj,
    });

  };

  render() {
    const {
      loading,
      form: { getFieldDecorator },
    } = this.props;
    const parentMethods = {
      handleAdd: this.handleAdd,
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.userAdmin}>
            <div className={styles.userAdminForm}>{this.renderForm()}</div>
            <NormalTable
              loading={loading}
              dataSource={data}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
            {/*新建*/}
            <Modal
              title="项目结项申请"
              visible={this.state.addvisib}
              onOk={this.addOk}
              width={700}
              onCancel={this.addCancle}
            >
              <Form onSubmit={this.updateForm} layout="inline" style={{display:'flex',justifyContent:'center'}}>
                <Row>
                  <Col style={{margin:'10px 0'}}>
                    <FormItem label='项目名称'>
                      {getFieldDecorator('name')(<Input placeholder='项目名称' style={{width:'300px',display:'inline-block'}}/>)}
                    </FormItem>
                  </Col>
                  <Col style={{display:'flex',alignItems:'center'}}>
                    <Col>
                      <FormItem label='结项类型'>
                        {getFieldDecorator('type')(
                          <Radio.Group onChange={this.onChangeType} defaultValue={1}>
                            <Radio value={1}>正常</Radio>
                            <Radio value={2}>非正常</Radio>
                          </Radio.Group>
                        )}
                      </FormItem>
                    </Col>
                  </Col>
                  <Col style={{margin:'10px 0'}}>
                    <FormItem label='证明材料'>
                      {
                        getFieldDecorator('upload')(
                          <Upload {...props}>
                            <span style={{color:'#123dff',width:'300px',cursor:'pointer'}}><Icon type="upload" />点击上传</span>
                          </Upload>,
                        )
                      }
                      {
                        getFieldDecorator('file')(
                          <TextArea style={{width:'300px',display:'inline-block'}}></TextArea>
                        )
                      }
                    </FormItem>
                  </Col>
                  <Col >
                    <FormItem label='填写备注'>
                      {
                        getFieldDecorator('memo')(
                          <TextArea style={{width:'300px',display:'inline-block'}}></TextArea>
                        )
                      }
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            </Modal>
            {/*修改结项申请*/}
            <Modal
              title="修改结项申请"
              visible={this.state.updatevisib}
              onOk={this.updateOk}
              width={700}
              onCancel={this.updateCancle}
            >
              <Form onSubmit={this.addForm} layout="inline" style={{display:'flex',justifyContent:'center'}}>
                <Row>
                  <Col style={{margin:'10px 0'}}>
                    <FormItem label='项目名称'>
                      {getFieldDecorator('name')(<Input placeholder='项目名称' style={{width:'300px',display:'inline-block'}}/>)}
                    </FormItem>
                  </Col>
                  <Col style={{display:'flex',alignItems:'center'}}>
                    <Col>
                      <FormItem label='结项类型'>
                        {getFieldDecorator('type')(
                          <Radio.Group onChange={this.onChangeType} defaultValue={1}>
                            <Radio value={1}>正常</Radio>
                            <Radio value={2}>非正常</Radio>
                          </Radio.Group>
                        )}
                      </FormItem>
                    </Col>
                  </Col>
                  <Col style={{margin:'10px 0'}}>
                    <FormItem label='证明材料'>
                      {
                        getFieldDecorator('upload')(
                          <Upload {...props}>
                            <span style={{color:'#123dff',width:'300px',cursor:'pointer'}}><Icon type="upload" />点击上传</span>
                          </Upload>,
                        )
                      }
                      {
                        getFieldDecorator('file')(
                          <TextArea style={{width:'300px',display:'inline-block'}}></TextArea>
                        )
                      }
                    </FormItem>
                  </Col>
                  <Col >
                    <FormItem label='填写备注'>
                      {
                        getFieldDecorator('memo')(
                          <TextArea style={{width:'300px',display:'inline-block'}}></TextArea>
                        )
                      }
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            </Modal>
            {/*查看出差申请单*/}
            <Modal
              title="查看出差申请单"
              visible={this.state.detailvisib}
              onOk={this.detailOk}
              width={700}
              onCancel={this.detailCancle}
            >
              <Form onSubmit={this.projectForm} layout="inline" style={{display:'flex',justifyContent:'center'}}>
                <Row>
                  <Col style={{display:'inline-block',margin:'10px 0'}}>
                    <FormItem label='申请单编号' style={{width:'350px'}}>
                      {getFieldDecorator('code')(<Input placeholder='申请单编号' style={{display:'inline-block'}}/>)}
                    </FormItem>
                    <FormItem label='出差地点'  >
                      {getFieldDecorator('address')(<Input placeholder='出差地点' style={{display:'inline-block'}}/>)}
                    </FormItem>

                  </Col>
                  <Col style={{display:'inline-block',margin:'10px 0'}}>
                    <FormItem label='项目申请人' style={{width:'350px'}}>
                      {getFieldDecorator('people')(<Input placeholder='申请人' style={{display:'inline-block'}}/>)}
                    </FormItem>
                    <FormItem label='计划出差天数'>
                      {getFieldDecorator('days')(<Input placeholder='计划出差天数' style={{display:'inline-block'}}/>)}
                    </FormItem>
                  </Col>
                  <Col style={{display:'inline-block',margin:'10px 0'}}>
                    <FormItem label='交通工具' style={{width:'350px'}}>
                      {getFieldDecorator('tool')(<Input placeholder='交通工具' style={{display:'inline-block'}}/>)}
                    </FormItem>
                    <FormItem label='计划出发时间'  >
                      {getFieldDecorator('starttime')( <DatePicker onChange={this.onStartChange} />)}
                    </FormItem>
                  </Col>
                  <Col style={{display:'inline-block',margin:'10px 0'}}>
                    <FormItem label='所属项目' style={{width:'350px'}}>
                      {getFieldDecorator('haveproject')(<Input placeholder='所属项目' style={{display:'inline-block'}}/>)}
                    </FormItem>

                    <FormItem label='计划结束时间'>
                      {getFieldDecorator('endtime')( <DatePicker onChange={this.onEndChange} />)}
                    </FormItem>
                  </Col>
                  <Col style={{width:'600px',}}>
                    <FormItem label='填写备注' >
                      {
                        getFieldDecorator('memo')(
                          <TextArea cols='70' rows='5' style={{display:'inline-block',marginTop:'10px'}}></TextArea>
                        )
                      }
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            </Modal>
            {/*历史里程碑*/}
            <Modal
              title="历史里程碑"
              visible={this.state.bosomvisib}
              onOk={this.bosomOk}
              width={700}
              onCancel={this.bosomCancle}
            >
              <Form onSubmit={this.hisProcess} layout="inline" style={{display:'flex',justifyContent:'center'}}>
                <Row style={{display:'flex',}}>
                  <Col >
                    <FormItem label='创建时间'>
                      {getFieldDecorator('name')(<RangePicker onChange={this.onChangeData} style={{width:200}}/>)}
                    </FormItem>
                  </Col>
                  <Col >
                    <span>
                      <Button type="primary" htmlType="submit">
                        查询
                      </Button>
                      <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                       重置
                      </Button>
                    </span>
                  </Col>
                </Row>
              </Form>
              <NormalTable
                loading={loading}
                dataSource={data2}
                style={{marginTop:20}}
                columns={this.columns2}
                onChange={this.handleStandardTableChange}
              />
            </Modal>
            {/*营销里程碑填报*/}
            <Modal
              title="营销里程碑填报"
              visible={this.state.marketvisib}
              onOk={this.marketOk}
              width={700}
              onCancel={this.marketCancle}
            >
              <Form onSubmit={this.marketForm} layout="inline" style={{display:'flex',justifyContent:'center'}}>
                <Row>
                  <Col style={{margin:'10px 0'}}>
                    <FormItem label='项目名称'>
                      {getFieldDecorator('name')(<Input placeholder='项目名称' style={{width:'300px',display:'inline-block'}}/>)}
                    </FormItem>
                  </Col>
                  <Col style={{display:'flex',alignItems:'center'}}>
                    <Col>
                      <FormItem label='完成时间'>
                        {getFieldDecorator('time')(<DatePicker onChange={this.onChangeTime} style={{width:'300px',display:'inline-block'}}/>)}
                      </FormItem>
                    </Col>
                  </Col>
                  <Col style={{display:'flex',alignItems:'center',marginTop:'10px'}}>
                    <Col>
                      <FormItem label='里程碑节点'>
                        {getFieldDecorator('projectname')(
                          <Select placeholder="里程碑节点" style={{ width:'285px' }} onChange={this.handleChangePro}>
                            <Option value="jack">节点1</Option>
                            <Option value="lucy">节点2</Option>
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Col>
                  <Col style={{marginTop:'10px'}}>
                    <FormItem label='证明材料'>
                      {
                        getFieldDecorator('upload')(
                          <Upload {...props}>
                            <Button style={{width:'300px',display:'inline-block'}}>
                              <Icon type="upload" /> 点击上传
                            </Button>
                          </Upload>,
                        )
                      }
                      {
                        getFieldDecorator('file')(
                          <TextArea></TextArea>
                        )
                      }
                    </FormItem>
                  </Col>
                  <Col style={{marginTop:'10px'}}>
                    <FormItem label='填写备注'>
                      {
                        getFieldDecorator('memo')(
                          <TextArea style={{width:'300px',display:'inline-block'}}></TextArea>
                        )
                      }
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            </Modal>
            {/*历史营销里程碑*/}
            <Modal
              title="历史营销里程碑"
              visible={this.state.hismarketvisib}
              onOk={this.hismarketOk}
              width={700}
              onCancel={this.hismarketCancle}
            >
              <Form onSubmit={this.hisMarket} layout="inline" style={{display:'flex',justifyContent:'center'}}>
                <Row style={{display:'flex'}}>
                  <Col >
                    <FormItem label='创建时间'>
                      {getFieldDecorator('name')(<RangePicker onChange={this.onChangeData} style={{width:200}}/>)}
                    </FormItem>
                  </Col>
                  <Col >
                    <span>
                      <Button type="primary" htmlType="submit">
                        查询
                      </Button>
                      <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                       重置
                      </Button>
                    </span>
                  </Col>
                </Row>
              </Form>
              <NormalTable
                loading={loading}
                dataSource={data2}
                style={{marginTop:20}}
                columns={this.columns2}
                onChange={this.handleStandardTableChange}
              />
            </Modal>
            {/*项目结项申请*/}
            <Modal
              title="项目结项申请"
              visible={this.state.endvisib}
              onOk={this.endOk}
              width={700}
              onCancel={this.endCancle}
            >
              <Form onSubmit={this.endForm} layout="inline" style={{display:'flex',justifyContent:'center'}}>
                <Row>
                  <Col style={{margin:'10px 0'}}>
                    <FormItem label='项目名称'>
                      {getFieldDecorator('name')(<Input placeholder='项目名称' style={{width:'300px',display:'inline-block'}}/>)}
                    </FormItem>
                  </Col>
                  <Col style={{display:'flex',alignItems:'center'}}>
                    <Col>
                      <FormItem label='结项类型'>
                        {getFieldDecorator('type')(
                          <Radio.Group onChange={this.onChangeType} defaultValue={1}>
                            <Radio value={1}>正常</Radio>
                            <Radio value={2}>非正常</Radio>
                          </Radio.Group>
                        )}
                      </FormItem>
                    </Col>
                  </Col>
                  <Col style={{margin:'10px 0'}}>
                    <FormItem label='证明材料'>
                      {
                        getFieldDecorator('upload')(
                          <Upload {...props}>
                            <Button style={{width:'300px',display:'inline-block'}}>
                              <Icon type="upload" /> 点击上传
                            </Button>
                          </Upload>,
                        )
                      }
                      {
                        getFieldDecorator('file')(
                          <TextArea></TextArea>
                        )
                      }
                    </FormItem>
                  </Col>
                  <Col >
                    <FormItem label='填写备注'>
                      {
                        getFieldDecorator('memo')(
                          <TextArea style={{width:'300px',display:'inline-block'}}></TextArea>
                        )
                      }
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            </Modal>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default EndtermProject;
