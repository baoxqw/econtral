import React, { PureComponent } from 'react';
import {
  Card,
  Button,
  Form,
  Col,
  Row,
  DatePicker,
  TimePicker,
  Input,
  Select,
  message,
  Checkbox,
} from 'antd';

import BraftEditor from 'braft-editor';
import { formatMessage, FormattedMessage } from 'umi/locale';
import 'braft-editor/dist/index.css';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FooterToolbar from '@/components/FooterToolbar';
import router from 'umi/router';

import ModelTable from '../../tool/ModelTable/ModelTable';

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

const { Option } = Select;
const { TextArea } = Input;
@connect(({ personal, loading }) => ({
  personal,
  submitting: loading.effects['personal/add'],
}))

@Form.create()
class PersonalFileadd extends PureComponent {
  state = {
    width: '100%',
    // 创建一个空的editorState作为初始值
    editorState: BraftEditor.createEditorState(null),

    TreeData:[], //存储左边树的数据
    conditions:[], //存储查询条件
    person_id:null, //存储立项人左边数点击时的id  分页时使用
    TableData:[], //存储表数据  格式{list: response.resData, pagination:{total: response.total}}
    SelectValue:[], //存储右表选中时时的name  初始进来时可以把获取到的name存入进来显示
    selectedRowKeys:[], //立项人  存储右表选中时的挣个对象  可以拿到id
    page:{},
  };

  submitContent = async () => {
    // 在编辑器获得焦点时按下ctrl+s会执行此方法
    // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
    const htmlContent = this.state.editorState.toHTML();
    const result = await saveEditorContent(htmlContent);
  };
  componentDidMount() {
    const { dispatch } = this.props;
    if(this.props.location.record){
      this.setState({
        addid:this.props.location.record.addid,
        title:this.props.location.record.title,
      })

    }
    // const cropid = userinfo.crop.id;
  }
  handleEditorChange = editorState => {
    this.setState({ editorState });
  };
  validate () {
    const { dispatch } = this.props;
    const { form} = this.props;

    form.validateFields((err, fieldsValue) => {
      if(!err){
        const values = {
          reqData:{
            ...fieldsValue,
            dept_id:this.state.addid,
            'birthdate': fieldsValue['birthdate'].format('YYYY-MM-DD'),
            user_id:this.state.selectedRowKeys[0],
          }
        };
        dispatch({
          type:'personal/add',
          payload: values,
          callback:()=>{
            message.success('新建成功',1.2,()=>{
              router.push('/fundamental/personalfile/list');
            });
          }
        })
      }

    })

  }
  backClick = ()=>{
    this.props.history.go(-1)
  }
  render() {
    const {
      form: { getFieldDecorator },
      submitting,
      dispatch,
      form
    } = this.props;
    const { width, editorState } = this.state;

    const on = {
      onIconClick:()=>{
        const { dispatch } = this.props;
        dispatch({
          type:'personal/fetchPerson',
          payload:{
            pageIndex:0,
            pageSize:10,
          },
          callback:(res)=>{
            this.setState({
              TableData:res,
            })
          }
        })
      }, //input聚焦时调用的接口获取信息
      handleTableChange:(obj)=>{
        const { dispatch } = this.props;
        const { conditions,person_id } = this.state;
        const param = {
          id:person_id,
          ...obj
        };
        this.setState({
          page:param
        })
        if(conditions.length){
          dispatch({
            type:'personal/fetchPerson',
            payload:{
              conditions,
              ...obj,
            },
            callback:(res)=>{
              this.setState({
                TableData:res,
              })
            }
          });
          return
        }
        dispatch({
          type:'personal/fetchPerson',
          payload:param,
          callback:(res)=>{
            this.setState({
              TableData:res,
            })
          }
        })
      }, //分页
      onOk:(selectedRowKeys,selectedRows,onChange)=>{
        if(!selectedRowKeys || !selectedRows){
          return
        }
        const nameList = selectedRows.map(item =>{
          return item.name
        });
        onChange(nameList)
        this.setState({
          SelectValue:nameList,
          selectedRowKeys,
        })
      }, //模态框确定时触发
      onCancel:()=>{

      },  //取消时触发
      handleSearch:(values)=>{
        //点击查询调的方法 参数是个对象  就是输入框的值
        const { code, name } = values;
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
          };
          dispatch({
            type:'personal/fetchPerson',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TableData:res,
              })
            }
          })
        }
      }, //查询时触发
      handleReset:()=>{
        const { page } = this.state;
        this.setState({
          conditions:[]
        })
        dispatch({
          type:'personal/fetchPerson',
          payload:{
            ...page
          },
          callback:(res)=>{
            this.setState({
              TableData:res,
            })
          }
        })
      }, //清空时触发
      onButtonEmpty:()=>{
        this.setState({
          SelectValue:[],
          selectedRowKeys:[],
        })
      }
    };
    const data = {
      TableData:this.state.TableData, //表的数据
      SelectValue:this.state.SelectValue, //框选中的集合
      selectedRowKeys:this.state.selectedRowKeys, //右表选中的数据
      placeholder:'请选择关联人',
      columns:[
        {
          title: '编码',
          dataIndex: 'code',
          width:'40%',
          key: 'code',
        },
        {
          title: '名称',
          dataIndex: 'name',
          width:'40%',
          key: 'name',
        },
        {
          title: '',
          dataIndex: 'caozuo',
          key: 'name',
        }
      ],
      fetchList:[
        {label:'编码',code:'code',placeholder:'请输入编码'},
        {label:'姓名',code:'name',placeholder:'请输入姓名'},
      ],
      title:'关联人选择'
    }

    return (
      <PageHeaderWrapper>
        <Card title='人员档案'  bordered={false}>
          <Form layout="vertical"  onSubmit={this.handleSubmit}>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label='人员编码'>
                  {getFieldDecorator('code', {
                    rules: [{ required: true, message: '人员编码'}],
                  })(<Input placeholder='人员编码' />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label='姓名'>
                  {form.getFieldDecorator('name', {
                    rules: [{ required: true, message:'姓名' }],
                  })(<Input placeholder='请输入姓名' />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label='曾用名'>
                  {form.getFieldDecorator('usedname', {
                    // rules: [{ required: true, message:'曾用名' }],
                  })(<Input placeholder='曾用名' />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label='紧急联系人'>
                  {getFieldDecorator('urgpsn', {
                    // rules: [{ required: true, message: '紧急联系人'}],
                  })(<Input placeholder='紧急联系人' />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label='紧急联系电话'>
                  {form.getFieldDecorator('urgphone', {
                    // rules: [{ required: true, message:'紧急联系电话' }],
                  })(<Input placeholder='请输入紧急联系电话' />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label='手机'>
                  {form.getFieldDecorator('mobile', {
                    rules: [
                      { required: true, message:'手机' },
                      {
                        pattern: /^1[3456789]\d{9}$/,
                        message: '请输入正确手机号',
                      },
                      ],
                  })(<Input placeholder='手机' />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label='部门'>
                  {form.getFieldDecorator('dept_id', {
                    initialValue:this.state.title,
                    // rules: [{ required: true, message:'部门' }],
                  })(<Input placeholder='部门' disabled/>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label='电话'>
                  {form.getFieldDecorator('phone', {
                    // rules: [{ required: true, message:'电话' }],
                  })(<Input placeholder='电话' />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label='email'>
                  {form.getFieldDecorator('email', {
                    rules: [
                      { required: true, message:'email' },
                      {
                        type: 'email',
                        message: '邮箱格式错误!',
                      },
                      ],
                  })(<Input placeholder='email' />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label='生日'>
                  {form.getFieldDecorator('birthdate', {
                    rules: [{ required: true, message:'出生日期' }],
                  })(<DatePicker style={{ width: '100%' }} placeholder="请选择生日" />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label='性别'>
                  {form.getFieldDecorator('sex', {
                    rules: [{ required: true,message:'性别'}],
                  })(<Select placeholder='是否封存'>
                    <Option value={'男'}>男</Option>
                    <Option value={'女'}>女</Option>
                  </Select>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label='是否封存'>
                  {form.getFieldDecorator('sealed', {
                    rules: [{ required: true, message:'是否封存' }],
                  })( <Select placeholder='是否封存'>
                    <Option value={'0'}>否</Option>
                    <Option value={'1'}>是</Option>
                  </Select>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label='人员类别'>
                  {getFieldDecorator('psntype',{
                    rules:[{required:true,message:'人员类别'}]
                  })( <Select placeholder='人员类别'>
                    <Option value={'1'}>在职</Option>
                    <Option value={'2'}>离职</Option>
                  </Select>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label='部门位置'>
                  {getFieldDecorator('address',{
                    // rules:[{required:true,message:'部门位置'}]
                  })(<Input placeholder='部门位置' />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label='邮编'>
                  {getFieldDecorator('zipcode',{
                    // rules:[{required:true,message:'邮编'}]
                  })(<Input placeholder='邮编' />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label='身份证号'>
                  {getFieldDecorator('personalid',{
                    rules:[
                      {required:true,message:'身份证号'},
                      {
                        pattern: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,
                        message: '请输入正确身份证号',
                      },
                      ]
                  })(<Input placeholder='请输入身份证号' />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label='关联用户'>
                  {getFieldDecorator('user_id',{
                     // rules:[{required:true,}],
                    initialValue: this.state.SelectValue
                  })(<ModelTable
                    on={on}
                    data={data}
                  />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={24} md={24} sm={24}>
                <Form.Item label={fieldLabels.memo}>
                  {getFieldDecorator('memo',{
                   // rules:[{required:true,message:'备注'}]
                  })(<TextArea />)}
                </Form.Item>
              </Col>
            </Row>

          </Form>
        </Card>

        <FooterToolbar style={{ width }}>
          {/* {this.getErrorInfo()} */}
          <Button
            onClick={this.backClick}
          >
            取消
          </Button>
          <Button type="primary" onClick={()=>this.validate()} loading={submitting}>
            确定
          </Button>

        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}

export default PersonalFileadd;
