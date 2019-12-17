import React, { Component, Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { connect } from 'dva';
import FooterToolbar from '@/components/FooterToolbar';
import NormalTable from '@/components/NormalTable';
import storage from '@/utils/storage';
import {
  Button,
  Menu,
  Dropdown,
  Icon,
  Row,
  Col,
  Steps,
  Card,
  Popover,
  Badge,
  Table,
  Tooltip,
  Divider,
  Form,
  Input,
} from 'antd';
import classNames from 'classnames';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
import styles from './OngoingProject.less';
import TextArea from 'antd/lib/input/TextArea';

const { Step } = Steps;
const { Description } = DescriptionList;
const ButtonGroup = Button.Group;

const tabList = [
  {
    key: 'decision',
    tab: '项目决策',
  },
  {
    key: 'detail',
    tab: '投决会详情',
  },
];

const getWindowWidth = () => window.innerWidth || document.documentElement.clientWidth;
const extra = (data)=>{
  let status;
  if(data){
    if(data.status === 'INITIAL'){
      status = '初始状态'
    }else if(data.status === 'FILL'){
      status = '完善项目信息'
    }else if(data.status === 'IR'){
      status = '投资者关系'
    }else if(data.status === 'IP'){
      status = '投资计划'
    }else if(data.status === 'DD'){
      status = '尽职调查'
    }else if(data.status === 'ICM'){
      status = '投决会'
    }else if(data.status === 'ID'){
      status = '项目决策'
    }else if(data.status === 'CIP'){
      status = '确定投资计划'
    }else if(data.status === 'POST'){
      status = '投后管理'
    }
  }
  return (
    <Row>
      <Col xs={24} sm={12}>
        <div style={{color:'rgba(0, 0, 0, 0.65)',width:'200px',textAlign:'left'}}>{formatMessage({ id: 'validation.state' })}：
          <b style={{fontSize:'18px',fontWeight:'900',color:'rgba(0, 0, 0, 0.65)',}}>{status}</b>
        </div>
      </Col>
    </Row>
  )};

const description = (data)=>{
  return(
    <DescriptionList className={styles.headerList} size="small" col="2">
      <Description term="创建人">{data ? data.creator_name:''}</Description>
      <Description term="投资经理">{data ? data.pm_name: ''}</Description>
      <Description term="创建时间">{data ? data.createdate:''}</Description>
      <Description term="主营业务">{data ? data.tag:''}</Description>
      <Description term="投资阶段">{data ? data.status:''}</Description>
      <Description term="备注">
        <div style={{display:'block',width:'200px',overflow:'hidden',textOverflow: 'ellipsis',whiteSpace:'nowrap'}}>
          {data ? data.subjectdesc:''}
        </div>

      </Description>
    </DescriptionList>
  )
};
let tt;
let style;
@connect(({ fundproject,loading }) => ({
  fundproject,
  submitting: loading.models.fundproject
}))
@Form.create()
class OngoingProjectDecisions extends Component {
  state = {
    operationkey: 'decision',
    data:[]
  };
  columns = [
    {
      title:'投决人',
      dataIndex: 'user_name',
    },
    {
      title: '备注',
      dataIndex: 'memo',
    },
    {
      title: '投决结果',
      dataIndex: 'score',
      render:(item,record)=>{
        if(item == 1){
          return <span>同意</span>
        }else if(item == 0){
          return <span>否决</span>
        }else{
          return <span>未完成</span>
        }
      }
    },
  ];
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'form/add',
          payload: values,
        });
      }
    });
  };
  backClick = ()=>{
    this.props.history.go(-1)
  }
  componentDidMount() {
    const { dispatch } = this.props;
    const user = storage.get("userinfo");
    const corp_id = user.corp.id;
    if(this.props.location.state){
      const id = this.props.location.state.query.query.project_id;
      const obj = {
        reqData:{
          id:id
        }
      }
      //概要信息
      dispatch({
        type: 'fundproject/fetchinforaa',
        payload:{id:id},
        callback:(res)=>{
          this.setState({initData:res[0]})
        },
      });
      //投票结果
      dispatch({
        type: 'fundproject/fetchresult',
        payload:obj,
        callback:(res)=>{
          this.setState({
            initData:res,
            voteresult:res.voteresult,
            data:res.projectPmeetingVoteList
          })

          if( res.voteresult == 1){
            tt = '同意'
            style={
              color:'#52c41a',
              fontWeight:900,
              fontSize: '20px',
            }
          }else if(res.voteresult == 0){
            tt = '否决'
            style={
              color:'red',
              fontWeight:900,
              fontSize: '20px',
            }
          }else if(res.voteresult == null){
            tt = '投票未完成'
            style={
              color:'#999',
              fontWeight:900,
              fontSize: '20px',
            }
          }
        },
      });

    }
  }
  onOperationTabChange = key => {
    this.setState({ operationkey: key });
  };

  render() {
    const {
      submitting,
      form: { getFieldDecorator, getFieldValue },
      fundproject:{initdata}
    } = this.props;
    const {operationkey,data} = this.state;


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

    const contentList = {
      decision: (
        <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
           <Form.Item {...formItemLayout} label='投票结果'>
              <span style={style}>{tt}</span>
          {/*<TextArea*/}
                {/*value={tt}*/}
                {/*disabled*/}
              {/*/>*/}
          </Form.Item>
        </Form>
      ),
      detail: <div>
                <NormalTable
                  loading={submitting}
                  dataSource={this.state.data}
                  columns={this.columns}
                  pagination = {false}
                />
              </div>
    };
    return (
      <PageHeaderWrapper
        title={`项目：${initdata?initdata.project_name:''}`}
        logo={
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
        }
        //action={tabList}
        content={description(initdata)}
        tabList={tabList}
        onTabChange={(key)=>this.onOperationTabChange(key)}
        extraContent={extra(initdata)}
      >
        <Card bordered={false}>{contentList[operationkey]}</Card>
        <FooterToolbar style={{ width: '100%' }}>
          <Button
            onClick={this.backClick}
          >返回
          </Button>
        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}

export default OngoingProjectDecisions;
