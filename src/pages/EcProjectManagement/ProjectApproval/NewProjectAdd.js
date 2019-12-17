import React, { PureComponent } from 'react';
import { connect } from 'dva';
import axiosApi from "../../../services/axios";
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
// import styles from './style.less';
function onSelect(value) {
  console.log('onSelect', value);
}
const FormItem = Form.Item;
const Dragger = Upload.Dragger;

const props = {
  name: 'file',
  multiple: true,
  //http://192.168.2.208:8080/rest/uploadfile
  //jsonplaceholder.typicode.com/posts/',
  action: 'http://192.168.2.208:8080/rest/uploadfile',
  headers: {
    "X-Requested-With": null
  },
  onChange(info) {
    const status = info.file.status;
    if (status !== 'uploading') {
      console.log( info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      console.log('错误上传')
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};
@connect(({formManage,loading }) => ({
  formManage,
  submitting: loading.effects['formManage/submitRegularForm'],
}))
@Form.create()
class ProjectAddForms extends PureComponent {
  state ={
    type:'',
    payload: ""
  }
  pmdatasource = ['anne', 'jack', 'jone'];
  handleSubmit = e => {
    const { dispatch, form} = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {

      dispatch({
        type: 'formManage/submitRegularForm',
        payload: values,
      });

    });
  };

  render() {
    const {formManage, submitting } = this.props;

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
        <Card title="新增项目" bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
          <FormItem {...formItemLayout} label={<FormattedMessage id="form.title.projectname" />}>
            {getFieldDecorator('projectname', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'validation.projectname.requiredojectname' }),
                },
              ],
            })(<Input placeholder={formatMessage({ id: 'validation.projectname.required' })} />)}
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
          <FormItem {...formItemLayout} label="附件">
            {getFieldDecorator('attachment')(
              <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                  Support for a single or bulk upload. Strictly prohibit from uploading company
                  data or other band files
                </p>
              </Dragger>
            )}
          </FormItem>
          <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
            <Button type="primary" htmlType="submit" loading={submitting} onClik={this.sub}>
              <FormattedMessage id="form.submit" />
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.save}>
              <FormattedMessage id="form.save"  />
            </Button>
          </FormItem>

        </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ProjectAddForms;
