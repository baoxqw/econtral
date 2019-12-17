import React, { PureComponent } from 'react';
import { FormattedMessage, formatMessage } from 'umi/locale';
import { Spin, Tag, Menu, Icon, Avatar, List, Form, Modal, Input, message,Tabs,Badge} from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import NoticeIcon from '../NoticeIcon';
import HeaderSearch from '../HeaderSearch';
import HeaderDropdown from '../HeaderDropdown';
import SelectLang from '../SelectLang';
import styles from './index.less';
import { connect } from 'dva';
import storage from '@/utils/storage'
const FormItem = Form.Item;
const { TabPane } = Tabs;

function changestate(data=[]) {
  if(!data || !data.length){
    return
  }
  data.map((item)=>{
    if(item.state == 1){
      item.read = true;
    }
    item.title = item.content
    item.description = moment(item.senddate).fromNow()
  })
}

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleModalVisible, ax,} = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      if(fieldsValue.newpwd === fieldsValue.newpwd2){

        const obj = {
          reqData:{
            oldpwd:fieldsValue.oldpwd,
            newpwd:fieldsValue.newpwd
          }
        };
        ax.dispatch({
          type:'upuser/update',
          payload: obj,
          callback:(res)=>{
            // 这里
            message.success('成功',1,()=>{
              form.resetFields();
              handleModalVisible();
            });
          }
        });
        return
      }
      message.error("两次密码不一致")
    });
  };
  return (
    <Modal
      destroyOnClose
      title='修改密码'
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label='旧密码'>
        {form.getFieldDecorator('oldpwd', {
          rules: [{ required: true, message: '请输入用户编码！' }],
        })(<Input placeholder={formatMessage({ id: 'validation.inputvalue' })}/>)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label='新密码'>
        {form.getFieldDecorator('newpwd', {
          rules: [{ required: true, message: '请输入用户名称！' }],
        })(<Input autoComplete='new-password' placeholder={formatMessage({ id: 'validation.inputvalue' })} type='password'/>)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label='确认密码'>
        {form.getFieldDecorator('newpwd2', {
          rules: [{ required: true, message: '请输入用户名称！' }],
        })(<Input placeholder={formatMessage({ id: 'validation.inputvalue' })} type='password'/>)}
      </FormItem>
    </Modal>
  );
});
@connect(({ upuser, user,loading }) => ({
  upuser,
  ...user,
  loading: loading.models.upuser

}))

@Form.create()
export default class GlobalHeaderRight extends PureComponent {
  state = {
    modalVisible: false,
    personState:false
  };
  componentDidMount() {
    const { dispatch } = this.props;
    const userinfo = storage.get("userinfo");
    const person = userinfo.code
    //pm  登陆才会显示消息提醒
    if(person == 'pm' || person == 'stuffer'){
      this.setState({personState:true})
    }
    //个人任务信息提醒
    const payload = {
      pageSize: 10,
      pageIndex:0,
      reqData: {
        type: 1,
      },
    };
    dispatch({
      type: 'user/fetchUserTaskMsg',
      payload,
    });
    //投后项目信息
    const payload2 = {
      pageSize: 5,
      pageIndex:0,
      reqData: {
        type: 2,
      },
    };
    dispatch({
      type: 'user/fetchUserAfterInvestMsg',
      payload:payload2,
    });
  }

  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map(notice => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        );
      }

      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }

  getUnreadData = noticeData => {
    const unreadMsg = {};
    Object.entries(noticeData).forEach(([key, value]) => {
      if (!unreadMsg[key]) {
        unreadMsg[key] = 0;
      }
      if (Array.isArray(value)) {
        unreadMsg[key] = value.filter(item => !item.read).length;
      }
    });
    return unreadMsg;
  };

/*  changeReadState = clickedItem => {
    console.log('clickedItem',clickedItem)
    const { id } = clickedItem;
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeNoticeReadState',
      payload: id,
    });
  };*/
  changeReadState = clickedItem => {

    const { id,type} = clickedItem;
    const { dispatch } = this.props;
    dispatch({
      type: 'user/marked',
      payload: {
        type,
        id,
      },
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };


  render() {
    const {
      currentUser,
      fetchingNotices,
      onNoticeVisibleChange,
      onMenuClick,
      onNoticeClear,
      theme,
      userTaskMsg,
      userAfterInvestMsg,
      avatar,
    } = this.props;

    const { personState } = this.state

    if(personState){
      changestate(userTaskMsg.data)
      changestate(userAfterInvestMsg.data)
    }
    const {modalVisible} = this.state;
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item onClick={() => this.handleModalVisible(true)}  key='user'>
          <Icon type="user" />
          <FormattedMessage id="menu.account.center" defaultMessage="account center" />
        </Menu.Item>
        {/*<Menu.Item key="userinfo">
          <Icon type="setting" />
          <FormattedMessage id="menu.account.settings" defaultMessage="account settings" />
        </Menu.Item>*/}
        {/*<Menu.Item key="triggerError">
          <Icon type="close-circle" />
          <FormattedMessage id="menu.account.trigger" defaultMessage="Trigger Error" />
        </Menu.Item>
        <Menu.Divider />*/}
        <Menu.Item key="logout">
          <Icon type="logout" />
          <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
        </Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    const noticeData = this.getNoticeData();
    const unreadMsg = this.getUnreadData(noticeData);
    let className = styles.right;
    if (theme === 'dark') {
      className = `${styles.right}  ${styles.dark}`;
    }
    return (
      <div className={className}>
        <HeaderSearch
          className={`${styles.action} ${styles.search}`}
          placeholder={formatMessage({ id: 'component.globalHeader.search' })}
          dataSource={[
            formatMessage({ id: 'component.globalHeader.search.example1' }),
            formatMessage({ id: 'component.globalHeader.search.example2' }),
            formatMessage({ id: 'component.globalHeader.search.example3' }),
          ]}
          onSearch={value => {
            console.log('input', value); // eslint-disable-line
          }}
          onPressEnter={value => {
            console.log('enter', value); // eslint-disable-line
          }}
        />

        {personState?<NoticeIcon
          className={styles.action}
          count={userTaskMsg.unreadCount + userAfterInvestMsg.unreadCount}
          onItemClick={(item, tabProps) => {

            this.changeReadState(item, tabProps);
          }}
          locale={{
            emptyText: formatMessage({ id: 'component.noticeIcon.empty' }),

          }}
          onClear={onNoticeClear}
          onPopupVisibleChange={onNoticeVisibleChange}
          loading={fetchingNotices}
          clearClose
        >
          <NoticeIcon.Tab
            // count={unreadMsg.notification}
            count={userTaskMsg.unreadCount}
            list={userTaskMsg.data}
            title='个人任务信息'
            name="notification"
            emptyText={formatMessage({ id: 'component.globalHeader.notification.empty' })}
            emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
          />
          <NoticeIcon.Tab
            count={userAfterInvestMsg.unreadCount}
            list={userAfterInvestMsg.data}
            title='投后项目信息'
            name="message"
            emptyText={formatMessage({ id: 'component.globalHeader.message.empty' })}
            emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
          />
          <NoticeIcon.Tab
            count={unreadMsg.event}
            list={noticeData.event}
            title='可以'
            name="event"
            emptyText={formatMessage({ id: 'component.globalHeader.event.empty' })}
            emptyImage="https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg"
          />
        </NoticeIcon>:''}
        {currentUser.name ? (
          <HeaderDropdown overlay={menu}>
            <span className={`${styles.action} ${styles.account}`}>
              <Avatar size="small" className={styles.avatar} src={avatar} alt="avatar" />
              <span className={styles.name}>{currentUser.name}</span>
            </span>
          </HeaderDropdown>
        ) : (
          <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
        )}
        <SelectLang className={styles.action} />


        <CreateForm  {...parentMethods} modalVisible={modalVisible}  ax={this.props}/>
      </div>
    );
  }
}
