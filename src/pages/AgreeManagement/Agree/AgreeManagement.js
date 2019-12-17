/*合同管理*/
import React, { Fragment, PureComponent } from 'react';
import { Card, Button, Form, Col, Row, Input, Divider, } from 'antd';
import NormalTable from '@/components/NormalTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../../System/UserAdmin.less';
import { formatMessage, FormattedMessage } from 'umi/locale';
import router from 'umi/router';
import { connect } from 'dva';

@connect(({  }) => ({

}))
@Form.create()

class AgreeManagement extends PureComponent {
  state = {};



  componentDidMount() {

  }



  render() {

    return (
      <PageHeaderWrapper>
        <Card className={styles.card} bordered={false} title={formatMessage({id:'project.items.list'})}>
          合同管理
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default AgreeManagement;

