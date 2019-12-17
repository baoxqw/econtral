import React, { PureComponent, Fragment } from 'react';
import { Table, Button, AutoComplete,Input, Form,message,DatePicker, Popconfirm, Divider,Tooltip } from 'antd';
import NormalTable from '@/components/NormalTable';
import styles from './style.less';
import { connect } from 'dva';

const Option = AutoComplete.Option;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
@connect(({ lice,typem,pau, loading }) => ({
  lice,
  pau,
  typem,
  loading: loading.models.typem,
}))
@Form.create()
class ProCadd extends PureComponent {
  index = 0;

  cacheOriginData = {};

  constructor(props) {
    super(props);

    this.state = {
      data:[],
      ratioinit:'',
      loading: false,
      rownum:'',
      name:'',
      ratio:'',
      milestoneoutcome:'',
      ProAddList:[],
    };
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    let data = nextProps.data;
    if (data === undefined || !data){
      this.setState({
        data:[]
      });
      return
    }
    if(nextProps.data !== this.props.data){
      this.setState({
        data
      })
    }
    if(nextProps.on.prostatues !== this.props.on.prostatues){
      this.setState({
        vStatus:nextProps.on.prostatues
      })
    }
  }

  getRowByKey(key, newData) {
    const { data } = this.state;
    return (newData || data).filter(item => item.key === key)[0];
  }

  toggleEditable = (e, key) => {
    e.preventDefault();
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[key] = { ...target };
      }
      target.editable = !target.editable;
      this.setState({ data: newData });
    }
  };

  newMember = () => {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    newData.push({
      key: `NEW_TEMP_ID_${this.index}`,
      code:'',
      name:'',
      ratio:'',
      milestoneoutcome:'',
      estimateenddate:'',
      editable: true,
      isNew: true,
    });
    this.index += 1;
    this.setState({ data: newData });
  };

  remove(key) {
    const { data } = this.state;
    const { onChange,dispatch} = this.props;
    const newData = data.filter(item => item.key !== key);
    this.setState({ data: newData });
    // onChange(newData);
  }

  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }
  handleFieldChange(e, fieldName, key) {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      if(fieldName === "nameSelect"){
        target["name"] = e.name;
        target["ratio"] = e.proratio;
        target["milestoneoutcome"] = e.proend;

      }else if(fieldName === "nameChange"){
        target["name"] = e.name;
        target["ratio"] = e.proratio;
        target["milestoneoutcome"] = e.proend;
      }
      else{
        target[fieldName] = e.target.value;
      }

      this.setState({ data: newData });
    }
  }
  handleNChange(value,option, fieldName, key) {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = option.props.children;
      this.setState({ data: newData });
    }
  }
  validate = (onOk)=>{
    const { data } = this.state;
    if(typeof onOk === 'function'){
      onOk(data)
    }
  };
  handleFChange(date,dateString, fieldName, key) {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = dateString;
      this.setState({ data: newData });
    }
  }
  saveRow(e, key) {
    e.persist();
    this.setState({
      loading: true,
    });
    setTimeout(() => {
      if (this.clickedCancel) {
        this.clickedCancel = false;
        return;
      }
      const target = this.getRowByKey(key) || {};
      if (!target.name || !target.rownum ||!target.ratio) {
        message.error('请填写完整信息。');
        e.target.focus();
        this.setState({
          loading: false,
        });
        return;
      }
      delete target.isNew;
      this.toggleEditable(e, key);
      const { data } = this.state;
      // const { onChange } = this.props;
      // onChange(data);
      this.setState({
        loading: false,
      });
    }, 500);
  }

  cancel(e, key) {
    this.clickedCancel = true;
    e.preventDefault();
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (this.cacheOriginData[key]) {
      Object.assign(target, this.cacheOriginData[key]);
      delete this.cacheOriginData[key];
    }
    target.editable = false;
    this.setState({ data: newData });
    this.clickedCancel = false;
  }
  cancelLick = (onCancle)=>{
    onCancle()
  }
  render() {
    const {
      dispatch,
      on:{onOk,onFocus,onCancle,prostatues},
    } = this.props;
    const {loading, data } = this.state
    const optionsAdd = this.state.ProAddList.map(group => (
      <Option key={group.name}>{group.name}</Option>
    ));
    const columns = [
      {
        title: '序号',
        dataIndex: 'rownum',
        key: 'rownum',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                onChange={e => this.handleFieldChange(e, 'rownum', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="序号"
              />

            );
          }
          return text
        },
      },
      {
        title: '里程碑节点',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => {
          if (record.editable) {
            return (
              <AutoComplete
                value={text}
                // style={{marginLeft:'38px',width:'251px'}}
                dataSource={optionsAdd}
                onFocus={()=>{
                  onFocus().then((res)=>{
                    this.setState({
                      ProAddList: res
                    });
                  })
                }}
                onSelect={(value,option)=>{
                  let proratio= null
                  let proend= null
                  this.state.ProAddList.forEach((item,index)=>{
                    if(item.name === option.key){
                      proratio = item.ratio
                      proend = item.milestoneoutcome
                      this.setState({ratioinit:item.ratio})
                    }
                  })
                  this.handleFieldChange({proratio:proratio,proend:proend,name:value}, 'nameSelect', record.key)
                  this.setState({
                    proAdd_id: Number(option.key)
                  });
                }}
                onChange={(values)=>{
                  let proratio= null
                  let proend= null
                  this.state.ProAddList.forEach((item,index)=>{
                    if(item.name == values){
                      proratio = item.ratio
                      proend = item.milestoneoutcome
                    }
                  })
                  this.handleFieldChange({proratio:proratio,proend:proend,name:values}, 'nameChange', record.key)
                }}

                filterOption={(inputValue, option) =>
                  option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                }
                placeholder="请选择里程碑节点"
              />
            );
          }
          return <Tooltip title={text}>
            <p style={{width:'100px',overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis'}}>{text}</p>
          </Tooltip>
        },
      },
      {
        title: '里程碑占比',
        dataIndex: 'ratio',
        key: 'ratio',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                defaultValue = {1}
                value={text}
                onChange={e => this.handleFieldChange(e, 'ratio', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="里程碑占比"
              />

            );
          }
          return text
        },
      },
      {
        title: '里程碑成果',
        dataIndex: 'milestoneoutcome',
        key: 'milestoneoutcome',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                onChange={e => this.handleFieldChange(e, 'milestoneoutcome', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="里程碑成果"
              />

            );
          }
          return <Tooltip title={text}>
            <p style={{width:'100px',overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis'}}>{text}</p>
          </Tooltip>
        },
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => {
          if(this.state.vStatus){
            return ""
          }
          const { loading } = this.state;
          if (!!record.editable && loading) {
            return null;
          }
          if (record.editable) {
            if (record.isNew) {
              return (
                <span>
                  <a onClick={e => this.saveRow(e, record.key)}>添加</a>
                  <Divider type="vertical" />
                  <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                    <a>删除</a>
                  </Popconfirm>
                </span>
              );
            }
            return (
              <span>
                <a onClick={e => this.saveRow(e, record.key)}>保存</a>
                <Divider type="vertical" />
                <a onClick={e => this.cancel(e, record.key)}>取消</a>
              </span>
            );
          }
          return (
            <span>
              <a onClick={e => this.toggleEditable(e, record.key)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                <a>删除</a>
              </Popconfirm>
            </span>
          );
        },
      },
    ];

    console.log("datad",data)
    return (
      <Fragment>
        <NormalTable
          loading={loading}
          columns={columns}
          dataSource={data}
          pagination={false}
          rowClassName={record => (record.editable ? styles.editable : '')}
        />
        <Button
          disabled={prostatues}
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type="dashed"
          onClick={this.newMember}
          icon="plus"
        >
          新增信息
        </Button>
        <div style={{display:'flex',justifyContent:'flex-end',margin:'20px'}}>
          <Button onClick={()=>this.cancelLick(onCancle)}  disabled={prostatues}>
            取消
          </Button>
          <Button type='primary' style={{marginLeft:'20px'}} onClick={()=>this.validate(onOk)}  disabled={prostatues}>
            确定
          </Button>
        </div>
      </Fragment>
    );
  }
}

export default ProCadd;
