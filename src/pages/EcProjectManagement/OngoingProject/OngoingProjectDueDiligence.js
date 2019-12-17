import React, { PureComponent ,Fragment} from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import storage from '@/utils/storage';
import FooterToolbar from '@/components/FooterToolbar';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  InputNumber,
  Radio,
  Icon,
  Row,
  Col,
  Table,
  Tooltip,
  AutoComplete,
  Upload,
  message,
  Popconfirm,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import moment from 'moment';
import TextArea from 'antd/lib/input/TextArea';
// import styles from './style.less';

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

@connect(({ fundproject,loading }) => ({
  fundproject,
  loading: loading.models.fundproject,
  datavale:fundproject.datasource,
  submitting: loading.effects['form/submitProjectAddForm'],
}))

@Form.create()
class OngoingProjectDueDiligenceForms extends PureComponent {
  pmdatasource = ['anne', 'jack', 'jone'];
  companydatasource = ['companyA', 'companyB', 'companyC'];
  state = {
    project_id:1,
    project_status:'FILL',
    fileList:[],
    uploading: false,
    mem:'',
    pageIndex:0,
    datasource:[],
  }
  columns = [
    {
      title: '序号',
      dataIndex: 'key',

    },
    {
      title: '备注',
      dataIndex: 'memo',
      render:(item,record)=>{
        return  <a href={`https://www.leapingtech.net/nien-0.0.1-SNAPSHOT${record.path}/${record.name}`} download>{item}</a>
      }
    },
    {
      title: '上传人',
      dataIndex: 'upuser',
    },

    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record)}>
            <a href="javascript:;">删除</a>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];
  //点击删除
  handleDelete = (record)=>{
    const { dispatch } = this.props;
    const { pageIndex } = this.state;
    dispatch({
      type: 'fundproject/attachmentdeldue',
      payload: {
        id: record.id,
        pageIndex
      },
      callback:(res)=>{
        let dd;
        if(this.props.location.state){
          dd = this.props.location.state.query.query.project_id;
          const project_status = this.props.location.state.query.query.project_status;
          this.setState({
            dd:dd,
            project_status:project_status,
          })
        }
        const str = {
          reqData:{
            bill_id:dd,
            type:'dd',
            pageIndex:0,
            pageSize:10
          }
        }
        dispatch({
          type: 'fundproject/queryattchmentdue',
          payload: str,
          callback:(res)=>{
            this.setState({datasource:res})
          }
        })
      }
    })
  };
  componentDidMount(){
    const { dispatch} = this.props;
    let dd;
    if(this.props.location.state){
      dd = this.props.location.state.query.query.project_id;
      const project_status = this.props.location.state.query.query.project_status;
      this.setState({
        dd:dd,
        project_status:project_status,
      })
    }
    const str = {
      reqData:{
        bill_id:dd,
        type:'dd',
        pageIndex:0,
        pageSize:5
      }
    }
    dispatch({
      type: 'fundproject/queryattchmentdue',
      payload: str,
      callback:(res)=>{
        this.setState({datasource:res})
      }
    })
  }
  //分页
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
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
    const user = storage.get("userinfo");
    const corp_id = user.corp.id;
    const obj = {
      bill_id:this.state.project_id,
      type:'dd',
      pageIndex: pagination.current-1,
      pageSize: pagination.pageSize,
    };
    this.setState({
      pageIndex:obj.pageIndex
    })
    dispatch({
      type: 'fundproject/queryattchmentdue',
      payload: obj,
    });
  };
  handleDel = e => {
    const { dispatch,form} = this.props;
    const { fileList } = this.state;
    form.resetFields();
    this.setState({
      fileList: [],
    });
  }
  backClick = ()=>{
    this.props.history.go(-1)
  }
  handleUpload = e => {
    const { dispatch,form} = this.props;
    const { fileList } = this.state;
    const user = storage.get("userinfo");
    const corp_id = user.corp.id;
    let dd;
    if(this.props.location.state){
      dd = this.props.location.state.query.query.project_id;
      const project_status = this.props.location.state.query.query.project_status;
      this.setState({
        dd:dd,
        project_status:project_status,
      })
    }
    var mem = '';
    this.props.form.validateFields((err, values) => {
      mem = values.memo;
      this.setState({mem:values.memo})
    });
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('files[]', file);
      formData.append('type', 'business');
      formData.append('parentpath', 'dd');
      formData.append('status', 'DD');
      formData.append('corp_id', corp_id);
      formData.append('project_id', dd);
      formData.append('memo',mem);
      formData.append('project_status', this.state.project_status);
    });

    this.setState({
      uploading: true,
      fileList: []
    });
    dispatch({
      type: 'fundproject/submitProjectAddForm',
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
            bill_id:dd,
            type:'dd',
            pageIndex:this.state.pageIndex,
            pageSize:5
          }
        }
        dispatch({
          type: 'fundproject/queryattchmentdue',
          payload: str,
          callback:(res)=>{
            this.setState({datasource:res})
          }
        })

      }
    });
  };
  render() {
    const {
      submitting ,
      loading:loading,
      fundproject: { datasource },
    } = this.props;
    const { uploading, fileList } = this.state;
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    const form = this.props.fundproject.message;
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
        /*dispatch({
          type: 'formManage/beforeupload',
          payload: file,
        });*/
        return false;
      },
      fileList,
    };
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
        <GridContent>
          <Row gutter={24}>
            <Col>
              <Card title="尽职调查" bordered={false}>
                <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
                  <FormItem {...formItemLayout} label={<FormattedMessage id="form.title.memo" />}>
                    {getFieldDecorator('memo')(
                      <TextArea placeholder={formatMessage({ id: 'validation.memo.required' })} />
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label='文件'>
                    {getFieldDecorator('file')(
                      <div>
                        <Upload {...props}>
                          <Button style={{ width: '200px',marginBottom:'28%' }}>
                            <Icon type="upload" /> 选择文件
                          </Button>
                        </Upload>
                        <Button
                          type="plus"
                          onClick={this.handleUpload}
                          // disabled={fileList.length === 0}
                          loading={uploading}
                          style={{ marginTop: 16 ,background:'#52c41a',color:"#fff"}}
                          message={form}
                        >
                          {uploading ? '上传中...' : '提交'}

                        </Button>
                        <Button
                          onClick={this.handleDel}
                          style={{marginLeft:'20px'}}
                        >取消</Button>
                      </div>
                    )}
                  </FormItem>
                </Form>
              </Card>

            </Col>
            <Col>
              <Card title="附件列表" bordered={false}>
                <Table
                  style={{ marginBottom: 16 }}
                  // data={datasource?datasource:[]}
                  loading={loading}
                  dataSource={datasource}
                  columns={this.columns}
                  onChange={this.handleStandardTableChange}
                />
              </Card>
            </Col>
          </Row>
          <FooterToolbar style={{ width: '100%' }}>
            <Button
              onClick={this.backClick}
            >返回
            </Button>
          </FooterToolbar>
        </GridContent>
      </PageHeaderWrapper>
    );
  }
}

export default OngoingProjectDueDiligenceForms;;
