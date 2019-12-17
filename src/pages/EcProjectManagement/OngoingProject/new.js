import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
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
  Tooltip,
  AutoComplete,
  Upload,
  message,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
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
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

@connect(({ loading }) => ({
  submitting: loading.effects['form/submitProjectAddForm'],
}))
@Form.create()
class newOngoingProjectUpdateProjectForms extends PureComponent {
  pmdatasource = ['anne', 'jack', 'jone'];
  companydatasource = ['companyA', 'companyB', 'companyC'];
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'form/submitProjectAddForm',
          payload: values,
        });
      }
    });
  };

  render() {
    const { submitting } = this.props;
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
        <Card title="完善项目信息" bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label={<FormattedMessage id="form.title.projectname" />}>
              {getFieldDecorator('projectname', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.projectname.required' }),
                  },
                ],
              })(
                <Input
                  disabled="true"
                  placeholder={formatMessage({ id: 'validation.projectname.required' })}
                />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="form.title.projectmanager" />}
            >
              {getFieldDecorator('projectmanager', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.projectmanager.required' }),
                  },
                ],
              })(
                <AutoComplete
                  disabled="true"
                  dataSource={this.pmdatasource}
                  style={{ width: 200 }}
                  onSelect={onSelect}
                  filterOption={(inputValue, option) =>
                    option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                  }
                  placeholder={formatMessage({ id: 'validation.projectmanager.required' })}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={<FormattedMessage id="form.title.company" />}>
              {getFieldDecorator('company', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.company.required' }),
                  },
                ],
              })(
                <AutoComplete
                  dataSource={this.companydatasource}
                  style={{ width: 200 }}
                  onSelect={onSelect1}
                  filterOption={(inputValue, option) =>
                    option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                  }
                  placeholder={formatMessage({ id: 'validation.company.required' })}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={<FormattedMessage id="form.title.investstage" />}>
              {getFieldDecorator('investstage', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.investstage.required' }),
                  },
                ],
              })(<Input placeholder={formatMessage({ id: 'validation.investstage.required' })} />)}
            </FormItem>
            <FormItem {...formItemLayout} label={<FormattedMessage id="form.title.investtime" />}>
              {getFieldDecorator('investtime', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.investtime.required' }),
                  },
                ],
              })(
                <DatePicker placeholder={formatMessage({ id: 'validation.investtime.required' })} />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={<FormattedMessage id="form.title.createdate" />}>
              {getFieldDecorator('createdate')(
                <DatePicker defaultValue={moment('2018-06-06', dateFormat)} disabled />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={<FormattedMessage id="form.title.memo" />}>
              {getFieldDecorator('memo')(
                <TextArea placeholder={formatMessage({ id: 'validation.memo.required' })} />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="附件">
              {getFieldDecorator('attachment')(
                <Dragger {...props}>
                  <p className="ant-upload-drag-icon">
                    <Icon type="inbox" />
                  </p>
                  <p className="ant-upload-text">
                    <FormattedMessage id="form.upload.title" />
                  </p>
                  <p className="ant-upload-hint">
                    <FormattedMessage id="form.upload.desc" />
                  </p>
                </Dragger>
              )}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                <FormattedMessage id="form.submit" />
              </Button>
              <Button style={{ marginLeft: 8 }}>
                <FormattedMessage id="form.save" />
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default newOngoingProjectUpdateProjectForms;
