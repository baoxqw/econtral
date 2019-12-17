import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import NormalTable from '@/components/NormalTable';
import { formatMessage, FormattedMessage } from 'umi/locale';
import FooterToolbar from '@/components/FooterToolbar';
import {
  Table,
  Row,
  Col,
  Form,
  Input,
  Select,
  Divider ,
  Button,
  Card,
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
const { Option } = Select;
const { TextArea } = Input;
import storage from '@/utils/storage'
import styles from '../../System/UserAdmin.less';
// test git



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

@connect(({ bosom, loading }) => ({
  bosom,
  loading: loading.models.bosom,
}))
@Form.create()
class BosomUpdate extends PureComponent {
  state = {
    initData:{}


  }

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

  componentDidMount(){
    const { dispatch} = this.props;
    const initData = this.props.location.record
    this.setState({initData})

  }
  backClick =()=>{
    router.push('/ecprojectmanagement/bosom/list')
  }

  validate = ()=>{
    const { form,dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      const {code,name,type,ratio,milestoneoutcome} = values
      const {id} = this.state.initData
      if(err){
        return
      }
      const obj ={
        reqData:{
          id,
          ...values,
          ratio:Number(values.ratio)
        }

      }
      dispatch({
        type:'bosom/add',
        payload:obj,
        callback:(res)=>{
          if(res.errMsg === '成功'){
            message.success('编辑成功',1,()=>{
              router.push('/ecprojectmanagement/bosom/list')
            })
          }
        }
      })
    })
  }
  render() {
    const {
      form: { getFieldDecorator },
      loading
    } = this.props;
    const { initData } = this.state
    return (
      <PageHeaderWrapper>
        <Card bordered={false} title="里程碑档案">
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="项目里程碑编码">
                {getFieldDecorator('code',{
                  initialValue:initData.code?initData.code:'',
                  rules: [{required: true,message:'项目里程碑编码'}]
                })(<Input placeholder="请输入项目里程碑编码" />)}
              </Form.Item>
            </Col>
            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item label="项目里程碑名称">
                {getFieldDecorator('name',{
                  initialValue:initData.name?initData.name:'',
                  rules: [
                    {
                      required: true,
                      message:'项目里程碑名称'
                    }
                  ]
                })(
                  <Input placeholder="请输入项目里程碑名称" />
                )}
              </Form.Item>
            </Col>
            <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
              <Form.Item label="里程碑类型">
                {getFieldDecorator('type',{
                  initialValue:initData.type?initData.type:'',
                  rules: [{required: true}],
                })(<Select placeholder={'请选择里程碑'} style={{width:'100%'}}>
                  <Option value='项目'>项目里程碑</Option>
                  <Option value='营销'>营销里程碑</Option>
                </Select>)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="里程碑占比">
                {getFieldDecorator('ratio', {
                  initialValue:initData.ratio?initData.ratio:'',
                  rules: [{required: true,message:'里程碑占比'}],
                })(<Input placeholder="请输入里程碑占比"  type='number'/>)}
              </Form.Item>
            </Col>
            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item label="项目里程碑成果">
                {getFieldDecorator('milestoneoutcome',{
                  initialValue:initData.milestoneoutcome?initData.milestoneoutcome:'',
                  rules: [
                    {
                      required: true,
                      message:'项目里程碑成果'
                    }
                  ]
                })(
                  <Input placeholder="请输入项目里程碑成果" />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={24} md={24} sm={24}>
              <Form.Item label="备注">
                {getFieldDecorator('memo', {
                  initialValue:initData.memo?initData.memo:'',
                })(<TextArea rows={4} />)}
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <FooterToolbar >
          {/* {this.getErrorInfo()} */}
          <Button
            onClick={this.backClick}
          >
            取消
          </Button>
          <Button type="primary" onClick={()=>this.validate()} loading={loading}>
            确定
          </Button>

        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}

export default BosomUpdate;

