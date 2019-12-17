import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import storage from '@/utils/storage'
import { formatMessage, FormattedMessage } from 'umi/locale';
import moment from 'moment';
import les from './process.less';
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Button,
  Card,
  AutoComplete,
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
// 更新进度
const CreateUpdateForm = Form.create()(props => {
  const { visible,form,ax,updateCancle,updataSource,updateProcessLoading} = props;
  //更新进度里程碑操作
  const updateOk = () => {
    form.validateFields((err, fieldsValue) => {
      let actu = Number(fieldsValue['actualschedule']);
      if(actu>100){
        message.error('错误')
        return
      }
      let obj = {
        reqData:{
          actualschedule:Number(fieldsValue['actualschedule']),
          project_id:updataSource.id,
          ...fieldsValue
        },
      }

      ax.dispatch({
        type:'process/updateProcess',
        payload:obj,
        callback:(res)=>{
          message.success('成功')
          updateCancle()
        }
      })

    })

  };
  return (

   <Modal
    title="更新项目进度"
    visible={visible}
    destroyOnClose
    onOk={updateOk}
    width={700}
    loading={updateProcessLoading}
    onCancel={() => updateCancle()}
  >
    <Form  layout="inline" style={{display:'flex',justifyContent:'center'}}>
      <Row>
        <Col style={{display:'inline-block',margin:'10px 0'}}>
          <FormItem label='项目名称'>
            {form.getFieldDecorator('projectname',{
              initialValue:updataSource?updataSource.projectname:'',
            })(<Input placeholder='项目名称' disabled/>)}
          </FormItem>
        </Col>
        <Col style={{display:'flex',alignItems:'center',}}>
          <Col>
            <FormItem label='预估进度'>
              {form.getFieldDecorator('estimateschedule',{
                initialValue:updataSource?updataSource.foreproject:'',
              })(<Input placeholder='预估进度' style={{display:'inline-block'}} disabled/>)}
            </FormItem>
            <span style={{display:'inline-block',marginTop:'8px'}}>
              %
            </span>
          </Col>
        </Col>
        <Col style={{display:'flex',alignItems:'center',marginTop:'10px',marginLeft:'-11px'}}>
          <Col>
            <FormItem label='项目进度'>
              {form.getFieldDecorator('actualschedule',{
                  initialValue:updataSource?updataSource.realproject:'',
                  rules: [
                    { required: true, message: '请输入项目进度' },
                    {
                      pattern: /^([1-9]\d?|100)$/,
                      message: '项目进度不能大于100',
                    },
                  ]
              })(<Input placeholder='项目进度'  type='number' />)}
            </FormItem>
            <span style={{display:'inline-block',marginTop:'8px'}}>
              %
            </span>
          </Col>
        </Col>


      </Row>
    </Form>
  </Modal>
  )
})
//历史进度
const CreateHisForm = Form.create()(props=>{
  const { visible,form,ax,hisCancle,historyData ,historySource,loading} = props;
  const  columns2 = [

    {
      title: '预估进度',
      dataIndex: 'actualschedule',
      key: 'actualschedule',
      width:120,
    },
    {
      title: '项目进度',
      dataIndex: 'estimateschedule',
      key: 'estimateschedule',
      width:120,
    },
    {
      title: '创建人',
      dataIndex: 'creater',
      key: 'creater',
      width:120,
    },
    {
      title: '创建时间',
      dataIndex: 'createdata',
      key: 'createdata',
      width:120,
    },
    {
      title: '创建部门',
      dataIndex: 'department',
      key: 'department',
      width:120,
    },
    {
      title: '操作',
      dataIndex: 'opreation',
      key: 'department',
    },
  ]
 let pageIndex = 0
  const onChangeData =(date, dateString) =>{

  }
  //查询
  const handleSearch = ()=>{
    form.validateFields((err, fieldsValue) => {


    })
  }
  //重置
  const  handleFormReset = ()=>{
    //清空输入框
      form.resetFields();
    //清空后获取列表
    ax.dispatch({
      type:'process/historyfetch',
      payload:{
       reqData:{
         id:historySource.id,
         pageSize:5,
         pageIndex:pageIndex
       }
      }
    })
  }
  //分页
  const handleStandardTableChange = (pagination, filtersArg, sorter) => {
     /* pagination中包含：
        current: 2
        pageSize: 10
        showQuickJumper: true
        showSizeChanger: true
        total: 48*/

    const params = {
      pageIndex: pagination.current, //第几页
      pageSize: pagination.pageSize, //每页要展示的数量
    };

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    const obj = {
      pageIndex: pagination.current-1,
      pageSize: pagination.pageSize,

    };

    pageIndex = obj.pageIndex

    ax.dispatch({
      type:'process/historyfetch',
      payload:{
        reqData:{
          id:historySource.id,
          pageSize:5,
          pageIndex:0
        }
      }
    })

  };

  return (
    <Modal
      title="查看历史进度"
      visible={visible}
      centered
      onOk={()=>hisCancle()}
      width={700}
      height={500}
      onCancel={()=>hisCancle()}
    >
      <Form  layout="inline" style={{display:'flex',justifyContent:'center'}}>
        <Row style={{display:'flex'}}>
          <Col >
            <FormItem label='创建时间'>
              {form.getFieldDecorator('name',{
                initialValue:''
              })(<RangePicker onChange={onChangeData}  />)}
            </FormItem>
          </Col>
          <Col >
            <span>
              <Button type="primary" htmlType="submit" onClick={handleSearch}>
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={handleFormReset}>
               重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
      <NormalTable
        loading={loading}
        data={historyData}
        style={{marginTop:20}}
        columns={columns2}
        scroll={{ x:columns2.length*120,y: 300}}
        // onChange={handleStandardTableChange}
      />
    </Modal>
  )
})
//项目里程碑填报
let proAdd_id;
let groupData;
let groupCode;
let groupId;
let groupName;
let aaList = [];
const CreateProForm = Form.create()(props=>{
  const { visible,form,ax,projectCancle,projectSourceId,oldProjectName,Prolist,projectAddLoading,projectSubLoading} = props;
  const  options = Prolist.map(group => {
    return  <Option key={group.id} ref={group.estimateenddate} _owner={group.code} props={group.id}>{group.name}</Option>
  });

  const ddd = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info ) {
      if (info.file.status !== 'uploading') {
      }
      aaList = info.fileList

      if (info.file.status === 'done') {

        message.success(`${info.file.name} 上传成功`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败.`);
      }
    },
  };

  const projectOk = ()=>{
    const formDataValue = new FormData();
    form.validateFields((err, fieldsValue) => {
      const time = fieldsValue.time?fieldsValue.time.format('YYYY-MM-DD'):''
      const filememo = fieldsValue.filememo
      const memo = fieldsValue.memo
      if(!Prolist.length){
        message.error('暂无程碑节点')
        return
      }
      if(!groupId){
          message.error('请选择里程碑节点')
          return
      }
      if(fieldsValue.evidence){
        const fileListValue = fieldsValue.evidence.fileList
        fileListValue.forEach((file) => {
          formDataValue.append('files[]', file.originFileObj);
          formDataValue.append('time', time);
          formDataValue.append('estimatetime',groupData);
          formDataValue.append('project_id', projectSourceId);
          formDataValue.append('node_id', groupId);
          formDataValue.append('node_name', groupName);
          formDataValue.append('memo', memo);
          formDataValue.append('filememo', filememo);
          formDataValue.append('code', groupCode);
          // formDataValue.append('id', groupId);
          formDataValue.append('parentpath', 'projectmilestone');
        })
      }
      else{
        formDataValue.append('time', time);
        formDataValue.append('estimatetime',groupData);
        formDataValue.append('project_id', projectSourceId);
        formDataValue.append('node_id', groupId);
        formDataValue.append('node_name', groupName);
        formDataValue.append('memo', memo);
        formDataValue.append('filememo', filememo);
        formDataValue.append('code', groupCode);
        // formDataValue.append('id', groupId);
        formDataValue.append('parentpath', 'projectmilestone');
      }

      ax.dispatch({
        type:'process/addProject',
        payload:formDataValue,
        callback:(res)=>{
          ax.dispatch({
            type:'process/endhandle',
            payload:{
              reqData:{
                billcode:groupId+'',
                billid:groupId+'',
                billtype:'PM_PROJECT_BMILESTONE',
                auditors:[{
                  id:94,
                  name:'a',
                }],
                audittype:'PM_PROJECT_BMILESTONE'
              }
            },
            callback:(res)=>{
              form.resetFields();
              message.success('成功',1,()=>{
                groupId = null
                groupName = null
                groupData = null
                groupCode = null
                proAdd_id = null
                groupData = null
                aaList = []
                projectCancle()
              })

            }
          })
        }
      })
    })

  }

  return (
    <Modal
      title="项目里程碑填报"
      visible={visible}
      width={700}
      centered
      onCancel={()=>projectCancle()}
      destroyOnClose
      footer={[
        // 定义右下角 按钮的地方 可根据需要使用 一个或者 2个按钮
        <Button   onClick={()=>projectCancle()}>
          取消
        </Button>,
        <Button  type="primary"  onClick={projectOk} loading={projectAddLoading}>
         确定
        </Button>,
      ]}
    >
      <Form  layout="inline" style={{display:'flex',justifyContent:'center'}}>
        <Row>
          <Col style={{display:'inline-block',margin:'10px 0'}}>
            <FormItem label='项目名称'>
              {form.getFieldDecorator('projectname',{
                initialValue:oldProjectName
              })(
               <Input  disabled style={{marginLeft:'50px',width:'300px',display:'inline-block'}}/>
                )}
            </FormItem>
          </Col>
          <Col style={{display:'flex',alignItems:'center',margin:'10px 0'}}>
            <Col>
              <FormItem label='里程碑节点'>
                {form.getFieldDecorator('node')(
                  <AutoComplete
                    style={{display:'inline-block',width:'300px',marginLeft:'36px'}}
                    dataSource={options}
                    onSelect={ (value,option)=>{
                      groupData = option.ref
                      groupId = option.props.props
                      groupName = option.props.children
                      groupCode = option.props._owner
                      proAdd_id = Number(option.key)
                    }}

                    filterOption={(inputValue, option) =>
                      option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                    }
                    placeholder="请选择里程碑节点"
                  />
                )}
              </FormItem>
            </Col>
          </Col>
          <Col style={{display:'inline-block',margin:'10px 0'}}>
            <FormItem label='里程碑序号'>
              {form.getFieldDecorator('code',{
                initialValue:groupCode
              })(
                <Input  disabled style={{marginLeft:'36px',width:'300px',display:'inline-block'}}/>
              )}
            </FormItem>
          </Col>
          <Col style={{display:'flex',alignItems:'center',marginTop:'10px'}}>
            <Col>
              <FormItem label='预计完成时间'>
                {form.getFieldDecorator('estimatetime',{
                   initialValue:groupData?moment(groupData):null
                })(<DatePicker disabled style={{marginLeft:'22px',width:'300px',display:'inline-block'}}/>)}
              </FormItem>
            </Col>
          </Col>
          <Col style={{display:'flex',alignItems:'center',marginTop:'20px'}}>
            <Col>
              <FormItem label='完成时间'>
                {form.getFieldDecorator('time')(<DatePicker style={{marginLeft:'50px',width:'300px',display:'inline-block'}}/>)}
              </FormItem>
            </Col>
          </Col>
          <Col >
            <FormItem label='证明材料' >
              {
                form.getFieldDecorator('evidence')(
                  <Upload {...ddd} >
                    {
                      aaList.length > 0 ? null: <span style={{color:'#123dff',marginLeft:'50px',width:'300px',cursor:'pointer'}} ><Icon type="upload" />点击上传</span>
                    }

                  </Upload>,
                )
              }
              {
                form.getFieldDecorator('filememo')(
                  <TextArea style={{width:'300px',marginTop:'10px',marginLeft:'50px',display:'inline-block'}}></TextArea>
                )
              }
            </FormItem>
          </Col>
          <Col style={{marginTop:'10px'}}>
            <FormItem label='填写备注'>
              {
                form.getFieldDecorator('memo')(
                  <TextArea style={{width:'300px',marginLeft:'50px',display:'inline-block',marginTop:'10px'}}></TextArea>
                )
              }
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
})
//历史项目里程碑
const CreateBosomForm = Form.create()(props=>{
  const { visible,form,ax,bosomCancle ,bosomSource,loading,hisProject} = props;
  const  columns3 = [

    {
      title: '序号',
      dataIndex: 'code',
      key: 'code',
      width:120,
    },
    {
      title: '里程碑节点',
      dataIndex: 'name',
      key: 'name',
      width:120,
    },
    {
      title: '预计完成时间',
      dataIndex: 'estimateenddate',
      key: 'estimateenddate',
      width:120,
    },
    {
      title: '实际完成时间',
      dataIndex: 'actualenddate',
      key: 'actualenddate',
      width:120,
    },
    {
      title: '填报人',
      dataIndex: 'username',
      key: 'username',
      width:120,
    },
    {
      title: '填报时间',
      dataIndex: 'ct',
      key: 'ct',
      width:120,
      render:(text,record)=>{
        if(text){
          let n = text.toString()
          let year = n.substring(0,4)//年
          let month = n.substring(4,6)//月
          let day = n.substring(6,8)//日
          let all = year + '-'+ month + "-" + day
          return all
        }
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width:120,
    },
    /*{
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
    },*/
  ]

  //查询
  const handleSearch = ()=>{
    form.validateFields((err, fieldsValue) => {

    })
  }
  //重置
  const  handleFormReset = ()=>{
    //清空输入框
    form.resetFields();
    //清空后获取列表
    ax.dispatch({
      type:'process/bosomfetch',
      payload:{
        reqData:{
          id:bosomSource.id,
          pageSize:5,
          pageIndex:0
        }
      }
    })
  }
  return (
    <Modal
      title="历史项目里程碑"
      visible={visible}
      centered
      onOk={()=>bosomCancle()}
      width={700}
      onCancel={()=>bosomCancle()}
    >
      <Form  layout="inline" style={{display:'flex',justifyContent:'center'}}>
        <Row style={{display:'flex',}}>
          <Col >
            <FormItem label='填报时间'>
              {form.getFieldDecorator('time',{
                initialValue:''
              })(<RangePicker />)}
            </FormItem>
          </Col>
          <Col >
            <span>
              <Button type="primary" htmlType="submit" onClick={handleSearch}>
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={handleFormReset}>
               重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
      <NormalTable
        loading={loading}
        dataSource={hisProject}
        style={{marginTop:20}}
        columns={columns3}
        scroll={{x:columns3.length*120}}
        pagination={false}
        // onChange={this.handleStandardTableChange}
      />
    </Modal>
  )
})
//营销里程碑填报
let marketprojetcADD_id;
let groupMarketData;
let groupMarketCode;
let marketAdd_id;
let marketId;
let marketName;
let markUpload = [];
const CreateMarketForm = Form.create()(props=>{
  const { visible,form,ax,marketCancle,marketSourceId,Marketlist,oldProjectName,marketAddLoading,marketSubLoading} = props;
  let  options = Marketlist.map(group => {
    return <Option key={group.id} ref={group.estimateenddate} _owner={group.code} props={group.id}>{group.name}</Option>
  });

  const mmm = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      markUpload = info.fileList
      if (info.file.status !== 'uploading') {

      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 上传成功`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败.`);
      }
    },
  };
  const marketOk = ()=>{
    const formDataValue = new FormData();
    form.validateFields((err, fieldsValue) => {
      const time = fieldsValue.time?fieldsValue.time.format('YYYY-MM-DD'):''
      // const estimatetime = fieldsValue.estimatetime?fieldsValue.estimatetime.format('YYYY-MM-DD'):''
      const filememo = fieldsValue.filememo
      const memo = fieldsValue.memo
       if(!Marketlist.length){
        message.error('暂无程碑节点')
        return
      }
      if(!fieldsValue.node){
        message.error('请选择里程碑节点')
        return
      }
      if(fieldsValue.evidence){
        const fileListValue = fieldsValue.evidence.fileList
        fileListValue.forEach((file) => {
          formDataValue.append('files[]', file.originFileObj);
          formDataValue.append('time', time);
          formDataValue.append('estimatetime',groupMarketData);
          formDataValue.append('project_id', marketSourceId);
          formDataValue.append('node_id', Number(fieldsValue.node));
          // formDataValue.append('node_name', marketName);
          // formDataValue.append('id', marketId);
          formDataValue.append('memo', memo);
          formDataValue.append('filememo', filememo);
          formDataValue.append('code', fieldsValue.code);
          formDataValue.append('parentpath', 'projectmilestone');
        })
      }
      else{
        formDataValue.append('time', time);
        formDataValue.append('estimatetime',groupMarketData);
        formDataValue.append('project_id', marketSourceId);
        formDataValue.append('node_id', Number(fieldsValue.node));
        // formDataValue.append('node_name', marketName);
        // formDataValue.append('id', marketId);
        formDataValue.append('memo', memo);
        formDataValue.append('filememo', filememo);
        formDataValue.append('code', fieldsValue.code);
        formDataValue.append('parentpath', 'projectmilestone');
      }

     ax.dispatch({
        type:'process/addMarket',
        payload:formDataValue,
        callback:(res)=>{
          ax.dispatch({
            type:'process/endhandleMarket',
            payload:{
              reqData:{
                billcode:fieldsValue.node+'',
                billid:fieldsValue.node+'',
                billtype:'PM_PROJECT_BMILESTONE',
                auditors:[{
                  id:94,
                  name:'a',
                }],
                audittype:'PM_PROJECT_BMILESTONE'
              }
            },
            callback:(res)=>{
              message.success('成功',1,()=>{
                form.resetFields();
                markUpload = []
                marketId = null
                marketName = null
                groupMarketData = null
                marketAdd_id = null
                groupMarketCode = null
                marketCancle()
              })

            }
          })
        }
      })
    })
  }

  return (
    <Modal
      title="营销里程碑填报"
      visible={visible}
      width={700}
      centered
      onCancel={()=>marketCancle()}
      destroyOnClose
      footer={[
        // 定义右下角 按钮的地方 可根据需要使用 一个或者 2个按钮
        <Button  onClick={()=>marketCancle()} >
          取消
        </Button>,
        <Button  type="primary"  onClick={marketOk} loading={marketAddLoading}>
          确定
        </Button>,

      ]}
    >
      <Form  layout="inline" style={{display:'flex',justifyContent:'center'}}>
        <Row>
          <Col style={{display:'inline-block',margin:'10px 0'}}>
            <FormItem label='项目名称'>
              {form.getFieldDecorator('projectname',{
                initialValue:oldProjectName
              })(
                <Input  disabled style={{marginLeft:'50px',width:'300px',display:'inline-block'}}/>
              )}
            </FormItem>
          </Col>

          <Col style={{display:'flex',alignItems:'center',margin:'10px 0'}}>
            <Col>
              <FormItem label='里程碑节点'>
                {form.getFieldDecorator('node')(
                  <AutoComplete
                    style={{display:'inline-block',width:'300px',marginLeft:'36px'}}
                    dataSource={options}
                    onSelect={ (value,option)=>{
                      groupMarketData = option.ref
                      groupMarketCode = option.props._owner
                      marketId = option.props.props
                      marketName = option.props.children
                      marketAdd_id = Number(option.key)

                    }}

                    filterOption={(inputValue, option) =>
                      option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                    }
                    placeholder="请选择里程碑节点"
                  />
                )}
              </FormItem>
            </Col>
          </Col>
          <Col style={{display:'inline-block',margin:'10px 0'}}>
            <FormItem label='里程碑序号'>
              {form.getFieldDecorator('code',{
                initialValue:groupMarketCode
              })(
                <Input  disabled style={{marginLeft:'36px',width:'300px',display:'inline-block'}}/>
              )}
            </FormItem>
          </Col>
          <Col style={{display:'flex',alignItems:'center',marginTop:'10px'}}>
            <Col>
              <FormItem label='预计完成时间'>
                {form.getFieldDecorator('estimatetime',{
                  initialValue:groupMarketData?moment(groupMarketData):null
                })(<DatePicker  disabled style={{marginLeft:'22px',width:'300px',display:'inline-block'}}/>)}
              </FormItem>
            </Col>
          </Col>
          <Col style={{display:'flex',alignItems:'center',marginTop:'20px'}}>
            <Col>
              <FormItem label='完成时间'>
                {form.getFieldDecorator('time')(<DatePicker style={{marginLeft:'50px',width:'300px',display:'inline-block'}}/>)}
              </FormItem>
            </Col>
          </Col>
          <Col >
            <FormItem label='证明材料' >
              {
                form.getFieldDecorator('evidence')(
                  <Upload {...mmm}>
                    {
                      markUpload.length >0?null:<span style={{color:'#123dff',marginLeft:'50px',width:'300px',cursor:'pointer'}}><Icon type="upload" />点击上传</span>
                    }

                  </Upload>,
                )
              }
              {
                form.getFieldDecorator('filememo',{

                })(
                  <TextArea style={{width:'300px',marginTop:'10px',marginLeft:'50px',display:'inline-block'}}></TextArea>
                )
              }
            </FormItem>
          </Col>
          <Col style={{marginTop:'10px'}}>
            <FormItem label='填写备注'>
              {
                form.getFieldDecorator('memo')(
                  <TextArea style={{width:'300px',marginLeft:'50px',display:'inline-block',marginTop:'10px'}}></TextArea>
                )
              }
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
})
//历史营销里程碑
const CreateHismarketForm = Form.create()(props=>{
  const { visible,form,ax,hismarketCancle ,hismarketDataId,hisMarket,mkLoading} = props;
  const  columns4 = [

    {
      title: '序号',
      dataIndex: 'code',
      key: 'code',
      width:120,
    },
    {
      title: '里程碑节点',
      dataIndex: 'name',
      key: 'name',
      width:120,
    },
    {
      title: '预计完成时间',
      dataIndex: 'estimateenddate',
      key: 'estimateenddate',
      width:120,
    },
    {
      title: '实际完成时间',
      dataIndex: 'actualenddate',
      key: 'actualenddate',
      width:120,
    },
    {
      title: '填报人',
      dataIndex: 'username',
      key: 'username',
      width:120,
    },
    {
      title: '填报时间',
      dataIndex: 'ct',
      width:120,
      key: 'ct',
      render:(text,record)=>{
        if(text){
          let n = text.toString()
          let year = n.substring(0,4)//年
          let month = n.substring(4,6)//月
          let day = n.substring(6,8)//日
          let all = year + '-'+ month + "-" + day
          return all
        }
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width:120,
    },
    /*{
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
    },*/
  ]

  //查询
  const handleSearch = ()=>{
    form.validateFields((err, fieldsValue) => {

    })
  }
  //重置
  const  handleFormReset = ()=>{
    //清空输入框
    form.resetFields();
    //清空后获取列表
    ax.dispatch({
      type:'process/hismarketFetch',
      payload:{
        reqData:{
          id:hismarketDataId,
          pageSize:5,
          pageIndex:0
        }
      }
    })
  }
  return (
    <Modal
      title="历史营销里程碑"
      visible={visible}
      centered
      onOk={()=>hismarketCancle()}
      width={700}
      onCancel={()=>hismarketCancle()}
    >
      <Form layout="inline" style={{display:'flex',justifyContent:'center'}}>
        <Row style={{display:'flex'}}>
          <Col >
            <FormItem label='填报时间'>
              {form.getFieldDecorator('time',{
                initialValue:''
              })(<RangePicker/>)}
            </FormItem>
          </Col>
          <Col >
            <span>
              <Button type="primary" htmlType="submit" onClick={handleSearch}>
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={handleFormReset}>
               重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
      <NormalTable
        loading={mkLoading}
        dataSource={hisMarket}
        style={{marginTop:20}}
        columns={columns4}
        scroll={{x:columns4.length*120}}
        pagination={false}
        // onChange={this.handleStandardTableChange}
      />
    </Modal>
  )
})
//项目结项申请

const CreateEndForm = Form.create()(props=>{
  const { visible,form,ax,endCancle,endId,oldProjectName,endOkLoading,endSubLoading} = props;
  const eee = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {

      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 上传成功`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败.`);
      }
    },
  };
  const endOk = ()=>{
    const formDataValue = new FormData();
    form.validateFields((err, fieldsValue) => {
      const projectname = fieldsValue.projectname
      const type = fieldsValue.type
      const filememo = fieldsValue.filememo
      const memo = fieldsValue.memo
      const closeoutdate = fieldsValue.closeoutdate.format('YYYY-MM-DD')
      if(fieldsValue.evidence){
        const fileListValue = fieldsValue.evidence.fileList
        fileListValue.forEach((file) => {
          formDataValue.append('files[]', file.originFileObj);
          formDataValue.append('project_id', endId);
          formDataValue.append('type', type);
          formDataValue.append('memo', memo);
          formDataValue.append('closeoutdate', closeoutdate);
          formDataValue.append('filememo', filememo);
          formDataValue.append('parentpath', 'projectcloseout');
          // formDataValue.append('id', endId);
        })
      }
      else{
        formDataValue.append('project_id', endId);
        formDataValue.append('type', type);
        formDataValue.append('memo', memo);
        formDataValue.append('closeoutdate', closeoutdate);
        formDataValue.append('filememo', filememo);
        formDataValue.append('parentpath', 'projectcloseout');
        // formDataValue.append('id', endId);
      }

      ax.dispatch({
        type:'process/endApplication',
        payload:formDataValue,
        callback:(res)=>{
          ax.dispatch({
            type:'process/endhandleSub',
            payload:{
              reqData:{
                billcode:res.id+'',
                billid:res.id+'',
                billtype:'PM_PROJECT_BCLOSEOUT',
                auditors:[{
                  id:94,
                  name:'a',
                }],
                audittype:'PM_PROJECT_BCLOSEOUT'
              }
            },
            callback:(res)=>{
              message.success('已成功')
              form.resetFields();
              endCancle()
            }
          })
        }
      })
    })
  }

  return (
    <Modal
      title="项目结项申请"
      visible={visible}
      width={700}
      centered
      onCancel={()=>endCancle()}
      destroyOnClose
      footer={[
        // 定义右下角 按钮的地方 可根据需要使用 一个或者 2个按钮
        <Button  onClick={()=>endCancle()} >
          取消
        </Button>,
        <Button  type="primary"  onClick={endOk} loading={endOkLoading}>
          确定
        </Button>,
      ]}
      onCancel={()=>endCancle()}
    >
      <Form  layout="inline" style={{display:'flex',justifyContent:'center'}}>
        <Row>
          <Col style={{margin:'10px 0'}}>
            <FormItem label='项目名称'>
              {form.getFieldDecorator('projectname',{
                initialValue:oldProjectName,
              })(<Input placeholder='项目名称' style={{marginLeft:'50px',width:'300px',display:'inline-block'}} disabled/>)}
            </FormItem>
          </Col>
          <Col style={{display:'flex',alignItems:'center'}}>
            <Col>
              <FormItem label='结项时间'>
                {form.getFieldDecorator('closeoutdate')(<DatePicker style={{marginLeft:'50px',width:'300px',display:'inline-block'}}/>)}
              </FormItem>
            </Col>
          </Col>
          <Col style={{display:'flex',alignItems:'center'}}>
            <Col>
              <FormItem label='结项类型'>
                {form.getFieldDecorator('type')(
                  <Radio.Group  defaultValue={1} style={{marginLeft:'50px',}}>
                    <Radio value={0}>正常</Radio>
                    <Radio value={1}>非正常</Radio>
                  </Radio.Group>
                )}
              </FormItem>
            </Col>
          </Col>
          <Col style={{margin:'10px 0'}}>
            <FormItem label='证明材料'>
              {
                form.getFieldDecorator('evidence')(
                  <Upload {...eee}>
                    <span style={{marginLeft:'50px',marginTop:'10px',color:'#123dff',width:'300px',cursor:'pointer'}}><Icon type="upload" />点击上传</span>
                  </Upload>,
                )
              }
              {
                form.getFieldDecorator('filememo')(
                  <TextArea style={{marginLeft:'50px',width:'300px',display:'inline-block'}}></TextArea>
                )
              }
            </FormItem>
          </Col>
          <Col >
            <FormItem label='填写备注'>
              {
                form.getFieldDecorator('memo')(
                  <TextArea style={{marginLeft:'50px',width:'300px',display:'inline-block'}}></TextArea>
                )
              }
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
})
@connect(({ process, loading }) => ({
  process,
  loading: loading.models.process,
  fetchListLoading:loading.models.process,
  updateProcessLoading:loading.effects['process/updateProcess'],
  projectAddLoading:loading.effects['process/addProject'],
  marketAddLoading:loading.effects['process/addMarket'],
  projectSubLoading:loading.effects['process/endhandle'],
  endOkLoading:loading.effects['process/endApplication'],
  marketSubLoading:loading.effects['process/endhandleMarket'],
  endSubLoading:loading.effects['process/endhandleSub'],
  mkLoading:loading.effects['process/fetchPro'],
}))
@Form.create()

class ProcessManege extends PureComponent {
  state = {
    Prolist:[],
    oldProjectName:'',
    hisProject:[],//历史项目里程碑
    hisMarket:[],//历史营销里程碑
    Marketlist:[],
    visible: false,
    updataSource:{},
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
    updatevisib:false,//更新进度弹出框
    hisvisib:false,//历史进度弹出框
    projectvisib:false,//项目里程碑弹出框
    bosomvisib:false,//历史里程碑弹出框
    marketvisib:false,//营销里程碑弹出框
    hismarketvisib:false,//历史营销里程碑弹出框
    endvisib:false,//结项申请弹出框
    projectname:'',
    projectstatus:'',
    id:null,
    newProjectName:[],
    conditions:[]
  };
  handleSelect=(value,record) => {
    const { dispatch } = this.props
    this.setState({
      id:record.id,
      oldProjectName:record.projectname
    })
    if(value === '0'){
      this.setState({
        updataSource:record,
        updatevisib:true,//更新进度弹出框
      })

    }
    else if(value == 1){
      this.setState({
        hisvisib:true,//历史进度弹出框
        historySource:record,
      })
      //  历史进度列表
      dispatch({
        type:'process/historyfetch',
        payload:{
          reqData:{
            id:record.id,
            pageIndex:0,
            pageSize:10
          }
        },
        callback:(res)=>{

        }
      })
    }
    else if(value == 2){
      this.setState({
        projectvisib:true,//项目里程碑弹出框
      })
      dispatch({
        type:'process/fetchPro',
        payload: {
         reqData:{
           project_id:record.id,
           type:'项目'
         }
        },
        callback:(res)=>{
          this.setState({Prolist:res})
        }
      })
    }
    else if(value == 3){
      this.setState({
        bosomvisib:true,//历史项目里程碑弹出框
        bosomSource:record
      })
      dispatch({
        type:'process/bosomfetch',
        payload:{
          reqData:{
            project_id:record.id,
            type:'项目',
          }
        },
        callback:(res)=>{
          this.setState({hisProject:res})

        }
      })
    }
    else if(value == 4){
      this.setState({
        marketvisib:true,//营销里程碑弹出框
      })
      dispatch({
        type:'process/fetchPro',
        payload: {
          reqData:{
            project_id:record.id,
            type:'营销'
          }
        },
        callback:(res)=>{
          this.setState({Marketlist:res})
        }
      })
    }
    else if(value == 5){
      this.setState({
        hismarketvisib:true,//历史营销里程碑弹出框
      })

      dispatch({
        type:'process/bosomfetch',
        payload:{
          reqData:{
            project_id:record.id,
            type:'营销',
          }
        },
        callback:(res)=>{
          this.setState({hisMarket:res})

        }
      })
    }
    else if(value == 6){
      this.setState({
        endvisib:true,//结项申请弹出框
      })
    }

  }
  handleChanged =(value,record) => {
    if(value === '0'){
      this.setState({
        updatevisib:true,//更新进度弹出框
        projectname:record.name,
        projectstatus:record.status,
      })

    }
    else if(value == 1){
      this.setState({
        hisvisib:true,//历史进度弹出框
      })
    }
    else if(value == 2){
      this.setState({
        projectvisib:true,//项目里程碑弹出框
      })
    }
    else if(value == 3){
      this.setState({
        bosomvisib:true,//历史里程碑弹出框
      })
    }
    else if(value == 4){
      this.setState({
        marketvisib:true,//营销里程碑弹出框
      })
    }
    else if(value == 5){
      this.setState({
        hismarketvisib:true,//历史营销里程碑弹出框
      })
    }
    else if(value == 6){
      this.setState({
        endvisib:true,//结项申请弹出框
      })
    }

  }
  //列表
  columns = [
    {
      title: '项目名称',
      dataIndex: 'projectname',
    },
    {
      title: '项目类型',
      dataIndex: 'type',
    },
    {
      title: '项目负责人',
      dataIndex: 'projectmanagerName',
    },
    {
      title:'负责部门',
      dataIndex: 'deptName',
    },
    {
      title:'项目状态',
      dataIndex: 'status',
    },
    {
      title:'项目合同额（元）',
      dataIndex: 'eca',
    },

    {
      title: '操作',
      dataIndex:'operation',
      fixed:'right',
      render: (text, record) => (
        <Fragment>
          <Select placeholder="请选择操作" style={{width:"100%"}} value={'请选择操作'} onSelect={(value)=>this.handleSelect(value,record)} onChange={(value)=>this.handleChanged(value,record)}>
            <Option value="0">更新进度</Option>
            <Option value="1">历史进度</Option>
            <Option value="2">项目里程碑填报</Option>
            <Option value="3">历史项目里程碑</Option>
            <Option value="4">营销里程碑填报</Option>
            <Option value="5">历史营销里程碑</Option>
            <Option value="6">结项申请</Option>
          </Select>
        </Fragment>
      ),
    },

  ];
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type:'process/fetch',
      payload:{
        pageIndex:0,
        pageSize:10
      }
    })
   //  项目里程碑名称
    dispatch({
      type:'process/newProject',
      payload:{
        reqData:{}
      },
      callback:(res)=>{
        this.setState({newProjectName:res})
      }
    })
  }
  //列表分页
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
    const obj = {
      pageIndex: pagination.current-1,
      pageSize: pagination.pageSize,

    };
    this.setState({
      pageIndex:obj.pageIndex
    });
    dispatch({
      type:'process/fetch',
      payload: obj,
    });

  };
  //更新
  updateCancle = () => {
    this.setState({
      updatevisib: false,
    });
  };
  //历史进度操作
  hisCancle = e => {
    this.setState({
      hisvisib: false,
    });
  };
  hisProcess = (e) => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err,values)=>{

    })
  }
  //项目里程碑填报
  projectCancle = e => {
    groupId = null
    groupName = null
    groupData = null
    groupCode = null
    proAdd_id = null
    groupData = null
    aaList = []
    this.setState({
      projectvisib: false,
    });
  };
  //历史里程碑
  bosomCancle = e => {
    this.setState({
      bosomvisib: false,
    });
  };
  //营销里程碑填报
  marketCancle = e => {
    markUpload = []
    marketId = null;
    marketName = null;
    groupMarketData = null
    marketAdd_id = null
    groupMarketCode = null
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
  hisMarket = (e) => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err,values)=>{

    })
  }
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
    form.validateFieldsAndScroll((err,values)=>{
      const {projectname,status} = values;
      if(projectname || status) {
        let conditions = [];
        let codeObj = {};
        let nameObj = {};

        if (projectname) {
          codeObj = {
            code: 'projectname',
            exp: 'like',
            value: projectname
          };
          conditions.push(codeObj)
        }
        if (status) {
          nameObj = {
            code: 'status',
            exp: 'like',
            value: status
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
          type:'process/fetch',
          payload:obj
        })
      }else{
        this.setState({
          conditions:[]
        })
        dispatch({
          type:'process/fetch',
          payload:{
            pageIndex:0,
            pageSize:10
          }
        })
      }
    })
  }
  //取消
  ListReset = ()=>{
    const { dispatch,form} = this.props;
    //清空输入框
    form.resetFields();
    this.setState({
      conditions:[]
    })
    //清空后获取列表
    dispatch({
      type:'process/fetch',
      payload:{
        pageIndex:0,
        pageSize:10
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
            <FormItem label='项目名称'>
              {getFieldDecorator('projectname')(<Input placeholder='项目名称' />)}
            </FormItem>
          </Col>
          <Col md={8} sm={16}>
            <FormItem label='项目状态'>
              {getFieldDecorator('status')(<Input placeholder='项目状态' />)}
            </FormItem>
          </Col>
          <Col md={8} sm={16}>
            <span>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.ListReset}>
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
      </Form>
    );
  }

  render() {
    const {
      loading,
      fetchListLoading,
      updateProcessLoading,
      projectAddLoading,
      projectSubLoading,
      marketAddLoading,
      marketSubLoading,
      mkLoading,
      endOkLoading,
      endSubLoading,
       process:{fetchData ,historyData,bosomData,hismarketData},
      form: { getFieldDecorator },
    } = this.props;
    const parentMethods = {
      handleAdd: this.handleAdd,
    };

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.userAdmin} className = 'myClass' style={les}>
            <div className={styles.userAdminForm}>{this.renderForm()}</div>
            <NormalTable
              loading={fetchListLoading}
              data={fetchData}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
            {/*更新进度*/}
            <CreateUpdateForm  visible={this.state.updatevisib} ax={this.props} updateCancle={this.updateCancle} updataSource={this.state.updataSource} updateProcessLoading={updateProcessLoading}/>

            {/*历史进度*/}
            <CreateHisForm  visible={this.state.hisvisib} ax={this.props} hisCancle={this.hisCancle} historyData={historyData} historySource={this.state.historySource} loading={loading}/>

            {/*项目里程碑填报*/}
            <CreateProForm  visible={this.state.projectvisib} ax={this.props} projectCancle={this.projectCancle} projectSourceId={this.state.id} oldProjectName={this.state.oldProjectName} Prolist={this.state.Prolist} projectAddLoading={projectAddLoading} projectSubLoading={projectSubLoading}/>

            {/*历史项目里程碑*/}
            <CreateBosomForm  visible={this.state.bosomvisib} ax={this.props} bosomCancle={this.bosomCancle}  bosomSource={this.state.bosomSource} loading={loading} hisProject = {this.state.hisProject}/>

            {/*营销里程碑填报*/}
            <CreateMarketForm  visible={this.state.marketvisib} ax={this.props} marketCancle={this.marketCancle}  marketSourceId={this.state.id} Marketlist={this.state.Marketlist} oldProjectName={this.state.oldProjectName} marketAddLoading={marketAddLoading} marketSubLoading={marketSubLoading}/>

            {/*历史营销里程碑*/}
            <CreateHismarketForm  visible={this.state.hismarketvisib} ax={this.props} hismarketCancle={this.hismarketCancle}  hismarketDataId={this.state.id}  hisMarket={this.state.hisMarket} mkLoading={mkLoading}/>

            {/*项目结项申请*/}
            <CreateEndForm  visible={this.state.endvisib} ax={this.props} endCancle={this.endCancle}  endId={this.state.id} oldProjectName={this.state.oldProjectName} endOkLoading={endOkLoading} endSubLoading={endSubLoading}/>

          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ProcessManege;
