import React, { Component, Fragment } from 'react';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import { formatMessage, FormattedMessage } from 'umi/locale';
import FooterToolbar from '@/components/FooterToolbar';
import { connect } from 'dva';
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
  form,
  Badge,
  Table,
  Tooltip,
  Divider,
  message
} from 'antd';
import classNames from 'classnames';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
import styles from './OngoingProject.less';

const { Step } = Steps;
const { Description } = DescriptionList;
const ButtonGroup = Button.Group;

const getWindowWidth = () => window.innerWidth || document.documentElement.clientWidth;


const action =(props,dataSource)=> {
  //点击进入当前状态
  const btn = (e) => {
    e.preventDefault();
    const currentPagevalue =props.location.state.query.project_status;
    if(currentPagevalue === "INITIAL" || currentPagevalue === ""){
      props.history.push("/projectmanagement/ongoingproject/updateproject", {
        query: dataSource
      });
    }else if(currentPagevalue === "FILL"){
     props.history.push("/projectmanagement/ongoingproject/ir", {
        query: dataSource
      });
    }else if(currentPagevalue === "IR"){
      props.history.push('/projectmanagement/ongoingproject/investplan',{
        query:dataSource
      });
    }else if(currentPagevalue === "IP"){
      props.history.push('/projectmanagement/ongoingproject/duediligence',{
        query:dataSource
      });
    }else if(currentPagevalue === "DD"){
      props.history.push('/projectmanagement/ongoingproject/icm',{
        query:dataSource
      });
    }else if(currentPagevalue === "ICM"){
      props.history.push('/projectmanagement/ongoingproject/projectdecision',{
        query:dataSource
      });
    }else if(currentPagevalue === "ID"){
      props.history.push('/projectmanagement/ongoingproject/confirmproject',{
        query:dataSource
      });
    }else if(currentPagevalue === "CIP"){
      props.history.push('/projectmanagement/ongoingproject/portfolio',{
        query:dataSource
      });
    }else if(currentPagevalue === "POST"){
      props.history.push('/projectmanagement/ongoingproject/portfolio',{
        query:dataSource
      });
    }
  };
  return(
    <Fragment>
      <Button type="primary" onClick={(e)=>btn(e)}>进入当前阶段</Button>
    </Fragment>
  )
}

const extra = (data)=>{
  let status;
  if(data.status === 'INITIAL'){
    status = '初始状态'
  }else if(data.status === 'FILL'){
    status = '完善项目信息'
  }else if(data.status === 'ICM'){
    status = '投决会'
  }else if(data.status === 'ID'){
    status = '项目决策'
  }else if(data.status === 'CIP'){
    status = '确定投资计划'
  }else if(data.status === 'POST'){
    status = '投后管理'
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
  return (
    <DescriptionList className={styles.headerList} size="small" col="2">
      <Description term={formatMessage({ id: 'validation.creater' })}>{data.creator_name}</Description>
      <Description term={formatMessage({ id: 'validation.investment.manager' })}>{data.pm_name}</Description>
      <Description term={formatMessage({ id: 'validation.createtime' })}>{data.createdate}</Description>
      <Description term={formatMessage({ id: 'validation.majorbusinesses' })}>{data.tag}</Description>
      <Description term={formatMessage({ id: 'form.title.memo' })}>
        <div style={{display:'block',width:'500px',overflow:'hidden',textOverflow: 'ellipsis',whiteSpace:'nowrap'}}>
          {data ? data.subjectdesc:''}
        </div>

      </Description>
    </DescriptionList>
  )};

const popoverContent = (
  <div style={{ width: 160 }}>
    吴加号
    <span className={styles.textSecondary} style={{ float: 'right' }}>
      <Badge status="default" text={<span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>未响应</span>} />
    </span>
    <div className={styles.textSecondary} style={{ marginTop: 4 }}>
      耗时：2小时25分钟
    </div>
  </div>
);

const customDot = (dot, { status }) =>
  status === 'process' ? (
    <Popover placement="topLeft" arrowPointAtCenter content={popoverContent}>
      {dot}
    </Popover>
  ) : (
    dot
  );
@connect(({ fundproject, loading }) => ({
  fundproject,
  submitting: loading.models.fundproject
}))
// @Form.create()
class OngoingProjectCheckLists extends Component {
  state = {
    stepDirection: 'horizontal',
    dataSource:{},
    currentPage:0,
    initData:{},
  };

  componentDidMount() {
    const { dispatch} = this.props;
    //显示当前第几步
    if(this.props.location.state){
      const currentPagevalue = this.props.location.state.query.project_status;
      console.log('currentPagevalue',currentPagevalue)
      this.setState({page:currentPagevalue})
      if(currentPagevalue === "INITIAL"){
        this.setState({currentPage:0})
      }else if(currentPagevalue === "FILL"){
        this.setState({currentPage:1})
      }else if(currentPagevalue === "ICM"){
        this.setState({currentPage:2})
      }else if(currentPagevalue === "ID"){
        this.setState({currentPage:3})
      }else if(currentPagevalue === "CIP"){
        this.setState({currentPage:4})
      }else if(currentPagevalue === "POST"){
        this.setState({currentPage:5})
      }
      //概要信息
      if(this.props.location.state){
        const id = this.props.location.state.query.project_id;
        dispatch({
          type: 'fundproject/fetchinfor',
          payload:{id:id},
          callback:(res)=>{
            this.setState({initData:res[0]})
          },
        });
      }
    }
    const dataSource = this.props.location.state;
    this.setState({dataSource:dataSource})
    //   const { dispatch } = this.props;
    //   dispatch({
    //     type: 'profile/fetchAdvanced',
    //   });

    this.setStepDirection();
    window.addEventListener('resize', this.setStepDirection, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setStepDirection);
    this.setStepDirection.cancel();
  }

  desc = (rolestr, stage) => {
    return (
      <div>
        <Fragment>
          {rolestr}
          <Divider type="vertical" />
          <a onClick={() => this.handleUpdateProject(stage)}>{formatMessage({ id: 'validation.operation' })}</a>
          {/*<button style={{border:'0',background:'#ffff',color:'#2347ff'}} onClick={() => this.handleUpdateProject(stage)}>你-好</button>*/}
        </Fragment>

      </div>
    );
  };
  backClick = ()=>{
    this.props.history.go(-1)
  }
  handleUpdateProject = stage => {
    const { dispatch} = this.props;
    const {currentPage} = this.state;

    switch (stage) {
      case 1:
        this.props.history.push("/projectmanagement/ongoingproject/updateproject", {
          query: this.state.dataSource
        });
        break;
/*      case 2:
        if(currentPage>= 1){
          this.props.history.push("/projectmanagement/ongoingproject/ir", {
            query: this.state.dataSource
          });
        }else{
          message.error('请完善其他操作信息')
        }
        break;*/
/*      case 3:
        if(currentPage>= 2){
          this.props.history.push('/projectmanagement/ongoingproject/investplan',{
            query:this.state.dataSource
          });
        }else{
          message.error('请完善其他操作信息')
        }
        break;*/
/*      case 4:
        if(currentPage>= 3){
          this.props.history.push('/projectmanagement/ongoingproject/duediligence',{
            query:this.state.dataSource
          });
        }else{
          message.error('请完善其他操作信息')
        }
        break;*/
      case 2:
        if(currentPage>= 1){
          this.props.history.push('/projectmanagement/ongoingproject/icm',{
            query:this.state.dataSource
          });
        }else{
          message.error('请完善其他操作信息')
        }
        break;
      case 3:
        if(currentPage>= 2){
          this.props.history.push('/projectmanagement/ongoingproject/projectdecision',{
            query:this.state.dataSource
          });
        }else{
          message.error('请完善其他操作信息')
        }
        break;
      case 4:
        if(currentPage>= 3){
          this.props.history.push('/projectmanagement/ongoingproject/confirmproject',{
            query:this.state.dataSource
          });
        }else{
          message.error('请完善其他操作信息')
        }
        break;
      case 5:
        if(currentPage>= 4){
          this.props.history.push('/projectmanagement/ongoingproject/portfolio',{
            query:this.state.dataSource
          });
        }else{
          message.error('请完善其他操作信息')
        }
        break;
    }
  };

  handlea = () => {
    router.push('/projectmanagement/ongoingproject/investplan');
  };

  handleb = () => {
    router.push('/projectmanagement/ongoingproject/duediligence');
  };

  @Bind()
  @Debounce(200)
  setStepDirection() {
    const { stepDirection } = this.state;
    const w = getWindowWidth();
    if (stepDirection !== 'vertical' && w <= 576) {
      this.setState({
        stepDirection: 'vertical',
      });
    } else if (stepDirection !== 'horizontal' && w > 576) {
      this.setState({
        stepDirection: 'horizontal',
      });
    }
  }

  render() {
    const { stepDirection, operationkey,dataSource } = this.state;
    let ee;
    if(dataSource.query){
      ee = dataSource.query.project_name;
    }
    return (
      <PageHeaderWrapper
        title={`项目：${ee}`}
        logo={
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
        }
        action={action(this.props,this.state.dataSource)}
        content={description(this.state.initData)}
        extraContent={extra(this.state.initData)}
      >
        <Card title={formatMessage({ id: 'validation.process.schedule'})} style={{ marginBottom: 24 }} bordered={false}>
          <Steps direction={stepDirection} size="default" current={this.state.currentPage}>
            <Step title={formatMessage({ id: 'validation.improveprojectinformation' })} description={this.desc('PM', 1)} />
      {/*      <Step title={formatMessage({ id: 'validation.investor.relations' })} description={this.desc('PM', 2)} />
            <Step title={formatMessage({ id: 'validation.investor.plan' })} description={this.desc('PM', 3)} />
            <Step title={formatMessage({ id: 'validation.due.diligence' })} description={this.desc('PM', 4)} />*/}
            <Step title={formatMessage({ id: 'validation.cast.never.will' })} description={this.desc('Stuffer', 2)} />
            <Step title={formatMessage({ id: 'validation.project.decision' })} description={this.desc('H', 3)} />
            <Step title={formatMessage({ id: 'validation.confirm.investment.plan' })} description={this.desc('Treasure', 4)} />
            <Step title={formatMessage({ id: 'validation.post.investment.management' })} />
          </Steps>
        </Card>
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

export default OngoingProjectCheckLists;
