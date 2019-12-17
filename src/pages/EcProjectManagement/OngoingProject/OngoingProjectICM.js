import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Form,
  Input,
  Table,
  DatePicker,
  Select,
  Button,
  Popconfirm,
  Card,
  InputNumber,
  Col,
  Row,
  Radio,
  Icon,
  Tooltip,
  AutoComplete,
  Upload,
  Transfer,
  message,
} from 'antd';
import BraftEditor from 'braft-editor';
import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import moment from 'moment';
import TextArea from 'antd/lib/input/TextArea';
import styles from './style.less';
import storage from '@/utils/storage';
import momentt from './OngoingProjectUpdateProject';
const dateFormat = 'YYYY-MM-DD';
function onSelect(value) {
  console.log('onSelect', value);
}
function onSelect1(value) {
  console.log('onSelect1', value);
}
const FormItem = Form.Item;
const Dragger = Upload.Dragger;
const props = {
  name: 'file',
  multiple: true,
  action: '//jsonplaceholder.typicode.com/posts/',
  onChange(info) {
    const status = info.file.status;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} 文件上传成功.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} 文件上传失败.`);
    }
  },
};
/*var props = {
  name: 'file',
  multiple: true,
  action: '//jsonplaceholder.typicode.com/posts/',
  defaultFileList: [...fileList],
  onChange(info) {
    const status = info.file.status;
    if (status !== 'uploading') {
      //console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};*/
function arrList(array) {
  console.log('array',array)
  let arr = [];
  if(array){
    for(let i=0;i<array.length;i++){
      const data = {
        key: i,
        id: array[i].id,
        title: array[i].name,
        description: array[i].name,
        chosen: Math.random() * 2 > 1,
      };
      arr.push(data);
    }
  }
  return arr
}
@connect(({ icm, loading,datainit }) => ({
  icm,
  datainit,
  loading: loading.models.icm,
}))
@Form.create()
class OngoingProjectICMForms extends PureComponent {
  state = {
    width: '100%',
    fileList:[],
    uploading: false,
    // 创建一个空的editorState作为初始值
    editorState: BraftEditor.createEditorState(null),
    mockData: [],
    targetKeys: [],
    attachmentList:[]
  };
  columns = [
    // {
    //   title: '序号',
    //   dataIndex: 'key',
    // },
    {
      title: '名称',
      dataIndex: 'name',

    },
    {
      title: '上传时间 ',
      dataIndex: 'uptime',
    },
    {
      title: '上传人 ',
      dataIndex: 'upuser',
    },

    {
      title: '操作',
      render: (text, record,index) => (
        <Fragment>
          <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(text,record,index)}>
            <a href="javascript:;">删除</a>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];
  submitContent = async () => {
    // 在编辑器获得焦点时按下ctrl+s会执行此方法
    // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
    // const htmlContent = this.state.editorState.toHTML();
    // const result = await saveEditorContent(htmlContent);
  };

  handleEditorChange = editorState => {
    this.setState({ editorState });
  };
  handleDelete = (text,record,index) =>{
    console.log('index',index);
    console.log('---',this.state.attachmentList);
    const arr = this.state.attachmentList;
    const arr2 = [];
    for(let i=0;i<arr.length;i++){
      arr2.push(arr[i])
    }
    arr2.splice(index,1);
    console.log(arr2);
    this.setState({
      attachmentList:arr2
    })
  };
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
    });
  };

 /* validate () {
    const { dispatch } = this.props;
    const { form} = this.props;
    const { mockData,targetKeys,pageIndex } = this.state;
    form.validateFields((err, fieldsValue) => {
      console.log('提交数据：');
      console.log(fieldsValue)
      const { mockData,targetKeys,pageIndex } = this.state;
      let array = []; // id合集
      for(let i=0;i<targetKeys.length;i++){
        array.push(mockData[targetKeys[i]].id)
      }
      const attend_id = array.join(',');
      const fileListValue = fieldsValue.attachment.fileList;
      const formDataValue = new FormData();
      const meetingdate = fieldsValue['meetingdate'].format('YYYY-MM-DD HH:mm:ss');
      const formData = form.getFieldsValue();
      //const meetingdesc = formData.meetingdesc.toHTML();
      const title = fieldsValue.meetingname;
      console.log('fileListValue',fileListValue)
      if(fileListValue){
        fileListValue.forEach((file) => {
          console.log('file',file)
          formDataValue.append('files[]', file);
          formDataValue.append('meetingtime', meetingdate);
          formDataValue.append('memo', this.state.editorState.toHTML());
          formDataValue.append('type', 'business');
          formDataValue.append('status', 'ICM');
          formDataValue.append('project_id', this.state.project_id);
          formDataValue.append('id', this.state.id);
          formDataValue.append('project_status', this.state.project_status);
          formDataValue.append('title',title);
          formDataValue.append('parentpath', 'icm');
          formDataValue.append('attend_id', attend_id);
        });
      }else{
        formDataValue.append('meetingtime', meetingdate);
        formDataValue.append('memo', this.state.editorState.toHTML());
        formDataValue.append('type', 'business');
        formDataValue.append('status', 'ICM');
        formDataValue.append('project_id', this.state.project_id);
        formDataValue.append('id', this.state.id);
        formDataValue.append('project_status', this.state.project_status);
        formDataValue.append('title',title);
        formDataValue.append('parentpath', 'icm');
        formDataValue.append('attend_id', attend_id);
      }
      dispatch({
        type: 'icm/icmupdate',
        payload: formDataValue,
        callback:()=>{
          form.resetFields();
          message.success('成功');
          router.push('/projectmanagement/ongoingproject/list');
        }
      });
    })

  }*/
  backClick = ()=>{
    this.props.history.go(-1)
  }
  componentDidMount() {
    const userinfo = storage.get("userinfo");
    const corpId = userinfo.corp.id;
    const userId = userinfo.id;
    const { dispatch} = this.props;
    let project_id;
    let id;
    if(this.props.location.state){
      console.log('页面数据：');
      console.log(this.props.location.state.query)
      project_id = this.props.location.state.query.query.project_id;
      const project_status = this.props.location.state.query.query.project_status;
      this.setState({
        project_id:project_id,
        project_status:project_status
      })

    }
    const ss ={
      reqData:{
        id:project_id
      }
    }
    //页面信息
    dispatch({
      type: 'icm/fetch',
      payload: ss,
      callback:(res)=>{
        this.setState({
          attachmentList:res[0].attachmentList,
          initsource:res,
          id:res[0].id
        });
        const htmlContent = res[0].memo;
        this.setState({
          editorState: BraftEditor.createEditorState(htmlContent),
        })
      }
    })
    //分配人员
    dispatch({
      type: 'icm/assign',
      payload:{
        id:userId,
        pageSize:1000
      },
      callback: res =>{
        console.log("全部",res)
        dispatch({
          type:'icm/even',
          payload: {
            reqData:{
              id:project_id
            }
          },
          callback:async ress =>{
            const left = arrList(res); //右边所有项带上key
            const projectPmeetingVoteList = ress.projectPmeetingVoteList;
            if(projectPmeetingVoteList){
              let rightRight = [];  //右边key集合
              for(let i=0;i<left.length;i++){
                for(let j=0;j<projectPmeetingVoteList.length;j++){
                  if(left[i].id === projectPmeetingVoteList[j].user_id){
                    rightRight.push(left[i].key);
                    break
                  }
                }
              }
              await this.setState({
                mockData:left,
                targetKeys:rightRight
              });
              return
            }
            this.setState({
              mockData:left
            });
          }
        })
      }
    });
  }


  filterOption = (inputValue, option) => option.description.indexOf(inputValue) > -1;

  handleChange = targetKeys => {
    this.setState({ targetKeys });
  };

  handleSelectChange = async (sourceSelectedKeys, targetSelectedKeys) => {
    await this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
  };

  handleSearch = (dir, value) => {
    console.log('search:', dir, value);
  };
  handleUpload = e => {
    const { dispatch,form} = this.props;
    const { fileList } = this.state;
    const user = storage.get("userinfo");
    const corp_id = user.corp.id;
    var name = '';
    var array = [];
    var meetingdate = '';
    var attend_id = '';
    this.props.form.validateFields((err, values) => {
      console.log('values',values);
      if(!values.meetingname){
        return
      }
      if(!values.meetingdate){
        return
      }
      name = values.meetingname;
      const { mockData,targetKeys,pageIndex } = this.state;
      // id合集
      for(let i=0;i<targetKeys.length;i++){
        array.push(mockData[targetKeys[i]].id)
      }

      attend_id = array.join(',');
      meetingdate = values.meetingdate.format('YYYY-MM-DD HH:mm:ss');
    });
     const formData = new FormData();
     const ff = new FormData();
     const arrayed = [];
     if(fileList.length>0){
       console.log('传输文件：')
       fileList.forEach((file) => {
         formData.append('files[]', file);
         formData.append('meetingtime', meetingdate);
         formData.append('memo', this.state.editorState.toHTML());
         formData.append('type', 'business');
         formData.append('status', 'ICM');
         formData.append('project_id', this.state.project_id);
         formData.append('id', this.state.id);
         formData.append('project_status', this.state.project_status);
         formData.append('oldattachmentList', this.state.attachmentList);
         formData.append('meetingname',name);
         formData.append('title',name);
         formData.append('parentpath', 'icm');
         formData.append('attend_id', attend_id);
       });
     }else{
         ff.append('meetingtime', meetingdate);
         ff.append('memo', this.state.editorState.toHTML());
         ff.append('type', 'business');
         ff.append('status', 'ICM');
         ff.append('project_id', this.state.project_id);
         ff.append('id', this.state.id);
         ff.append('project_status', this.state.project_status);
         ff.append('oldattachmentList', this.state.attachmentList);
         ff.append('meetingname',name);
         ff.append('title',name);
         ff.append('parentpath', 'icm');
         ff.append('attend_id', attend_id);
       dispatch({
         type: 'icm/icmupdatenofile',
         payload: ff,
         callback:()=>{
           form.resetFields();
           message.success('成功',1.2,()=>{
             router.push('/projectmanagement/ongoingproject/list');
           });
         }
       });
       return
     }

      dispatch({
        type: 'icm/icmupdate',
        payload: formData,
        callback:()=>{
          form.resetFields();
          message.success('成功',1.2,()=>{
            router.push('/projectmanagement/ongoingproject/list');
          });

        }
      });

/*    this.setState({
      uploading: true,
      fileList: []
    });*/

   /* dispatch({
      type: 'finace/submitProjectAddForm',
      payload: formData,
      callback: () => {
        message.success('上传成功')
        form.resetFields();
        this.setState({
          uploading: false,
          fileList: []
        });
        const str = {
          reqData:{
            bill_id:this.state.project_id,
            type:'fi',
            pageIndex:this.state.pageIndex,
            pageSize:10
          }
        }
        dispatch({
          type: 'finace/queryattchment',
          payload: str,
          callback:(res)=>{
            this.setState({datasource:res})
          }
        })

      }
    });*/
  };
  render() {
    const {
      submitting,
      icm: { data },
      loading
    } = this.props;
    const { uploading, fileList } = this.state;
    console.log('dataICM',data);

    const { width, editorState,initsource } = this.state;
    const props = {
      onRemove: (file) => {
        this.setState((state) => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: (file) => {
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }));
        return false;
      },
      fileList,
    };
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    return (
      <PageHeaderWrapper>
        <Card title="投决会" className={styles.card} bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            layout="vertical"
            hideRequiredMark
            style={{ marginTop: 8 }}
          >
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="会议名称">
                  {getFieldDecorator('meetingname', {
                    initialValue:data.title?data.title:'',
                    rules: [{ required: true, message: '请输入会议名称' }],
                  })(<Input placeholder="请输入会议名称" />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="会议时间">
                  {getFieldDecorator('meetingdate',{
                    initialValue:data.meetingtime?moment(data.meetingtime):'',
                    rules: [{ required: true, message: '请选择会议时间' }],
                  })(
                    <DatePicker
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      placeholder="请选择会议时间"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={24} md={24} sm={24}>
                <BraftEditor
                  value={this.state.editorState}
                  onChange={this.handleEditorChange}
                  // onSave={this.submitContent}
                />
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: 32 }}>
              <Col lg={24} md={24} sm={24}>
                <Form.Item label="请选择参会人员">
                  {getFieldDecorator('attendperson')(
                    <Transfer
                      dataSource={this.state.mockData}
                      titles={['待选人员', '已选人员']}
                      showSearch
                      filterOption={this.filterOption}
                      targetKeys={this.state.targetKeys}
                      onChange={this.handleChange}
                      onSearch={this.handleSearch}
                      onSelectChange={this.handleSelectChange}
                      render={item => item.title}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col >
                <div style={{marginBottom:'10px'}}>请选择文件</div>
                <FormItem {...formItemLayout} >
                  {getFieldDecorator('attachment')(
                    <div>
                      <Upload {...props}>
                        <Button style={{ width: '410px',marginBottom:'28%' }}>
                          <Icon type="upload" /> 选择文件
                        </Button>
                      </Upload>
                      <FooterToolbar style={{ width }}>
                        <Button
                          onClick={this.backClick}
                        >返回</Button>
                        <Button type="primary"
                                onClick={this.handleUpload}
                                loading={submitting}>
                          提交
                        </Button>

                      </FooterToolbar>
  {/*                    <Button
                        type="plus"
                        onClick={this.handleUpload}
                         disabled={fileList.length === 0}
                         loading={uploading}
                        style={{ marginTop: 16 ,background:'#40a9ff',color:"#fff"}}
                      >
                        {uploading ? '上传中...' : '提交'}
                      </Button>
                      <Button
                        onClick={this.handleDel}
                        style={{marginLeft:'20px'}}
                      >取消</Button>*/}
                    </div>
                  )}
                </FormItem>
                <Col >
                  <Card title="文件列表" bordered={false}>
                    <Table
                      style={{ marginBottom: 16 }}
                      // data={columdata}
                      loading={loading}
                      dataSource={this.state.attachmentList}
                      columns={this.columns}
                      // onChange={this.handleStandardTableChange}
                    />
                  </Card>
                </Col>
              </Col>
            </Row>
          </Form>
        </Card>
{/*        <FooterToolbar style={{ width }}>
          <Button
            onClick={this.backClick}
          >取消</Button>
          <Button type="primary" onClick={()=>this.validate()} loading={submitting}>
            提交
          </Button>
        </FooterToolbar>*/}
      </PageHeaderWrapper>
    );


  }
}

export default OngoingProjectICMForms;
