import React, { PureComponent, Fragment } from 'react';
import { Table, Button, Input, message, Popconfirm, Divider, Tooltip } from 'antd';
import NormalTable from '@/components/NormalTable';
import styles from './style.less';
class Cadd extends PureComponent {
  index = 0;

  changeData = [];

  cacheOriginData = {};

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      loading: false,
      /* eslint-disable-next-line react/no-unused-state */
      value: props.value,
      status:false,
    };
  }

  /*static getDerivedStateFromProps(nextProps, preState) {
    if (isEqual(nextProps.data.list, preState.value)) {
      return null;
    }
    return {
      data: nextProps.data.list,
      value: nextProps.value,
    };
  }*/

  UNSAFE_componentWillReceiveProps(nextProps) {
    let data = nextProps.data;
    if (data === undefined || !data){
      this.changeData = [];
      this.setState({
        data:[]
      });
      return
    }
    if(nextProps.data !== this.props.data){
      this.changeData = data
      this.setState({
        data
      })
    }
  }

  getRowByKey(key, newData) {
    const { data } = this.state;
    return (newData || data).filter(item => item.key === key)[0];
  }

  isEqual = (a,b) => {

    //如果a和b本来就全等

    if(a===b){

      //判断是否为0和-0

      return a !== 0 || 1/a ===1/b;

    }

    //判断是否为null和undefined

    if(a==null||b==null){

      return a===b;

    }

    //接下来判断a和b的数据类型

    var classNameA=toString.call(a),

      classNameB=toString.call(b);

    //如果数据类型不相等，则返回false

    if(classNameA !== classNameB){

      return false;

    }

    //如果数据类型相等，再根据不同数据类型分别判断

    switch(classNameA){

      case '[object RegExp]':

      case '[object String]':

        //进行字符串转换比较

        return '' + a ==='' + b;

      case '[object Number]':

        //进行数字转换比较,判断是否为NaN

        if(+a !== +a){

          return +b !== +b;

        }

        //判断是否为0或-0

        return +a === 0?1/ +a === 1/b : +a === +b;

      case '[object Date]':

      case '[object Boolean]':

        return +a === +b;

    }

    //如果是对象类型

    if(classNameA == '[object Object]'){

      //获取a和b的属性长度

      var propsA = Object.getOwnPropertyNames(a),

        propsB = Object.getOwnPropertyNames(b);

      if(propsA.length != propsB.length){

        return false;

      }

      for(var i=0;i<propsA.length;i++){

        var propName=propsA[i];

        //如果对应属性对应值不相等，则返回false

        if(a[propName] !== b[propName]){

          return false;

        }

      }

      return true;

    }

    //如果是数组类型

    if(classNameA == '[object Array]'){

      if(a.toString() == b.toString()){

        return true;

      }

      return false;

    }

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
      const { onaddChild:{onSave} } = this.props;
      const newDataString = JSON.stringify(newData);
      let newData2 = JSON.parse(newDataString);
      if(typeof newData2 === 'object'){
        newData2.map(item =>{
          delete item.editable
          return item
        })
      }
      const status = JSON.stringify(newData2).indexOf(JSON.stringify(this.changeData));
      if(typeof onSave === 'function'){
        if(status === 0){
          onSave(newData,true)
        }else{
          onSave(newData,false)
        }

      }
      this.setState({ data: newData });
    }
  };

  newMember = () => {
    const { data } = this.state;
    const { onaddChild:{onSave} } = this.props;
    const newData = data.map(item => ({ ...item }));
    newData.push({
      key: `${this.index}`,
      incomename: '',
      rowno: '',
      mnycurr: '',
      armnycurr: '',
      actrualmnycurr:'',
      editable: true,
      isNew: true,
    });
    this.index += 1;
    this.setState({ data: newData });
    if(typeof onSave === 'function'){
      onSave(newData,true)
    }
  };

  remove(key) {
    const { data } = this.state;
    // const { onChange } = this.props;
    const { onaddChild:{onSave,buttonStatus} } = this.props;
    const newData = data.filter(item => item.key !== key);
    // onChange(newData);
    const newDataString = JSON.stringify(newData);
    let newData2 = JSON.parse(newDataString);
    if(typeof newData2 === 'object'){
      newData2.map(item =>{
        delete item.editable
        return item
      })
    }
    const status = JSON.stringify(newData2).indexOf(JSON.stringify(this.changeData));
    this.setState({ data: newData });
    if(typeof onSave === 'function'){
      if(status === 0){
        onSave(newData,true)
      }else{
        onSave(newData,false)
      }

    }
  }

  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }
  handleFChange(date,dateString, fieldName, key) {
    console.log("dateString:",dateString)

    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = dateString;
      this.setState({ data: newData });
    }
  }
  handleFieldChange(e, fieldName, key) {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = e.target.value;
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
      if (!target.armnycurr  || !target.rowno || !target.mnycurr || !target.incomename) {
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

  validate = (onOk)=>{
    const { data } = this.state;
    if(typeof onOk === 'function'){
      onOk(data)
    }
  };

  cancelLick = (cancel)=>{
    if(typeof cancel === 'function'){
      cancel()
    }
  };


  render() {
    const { onaddChild }  = this.props;
    const { onOk,cancel,status,buttonStatus } = onaddChild;

    const columns = [
      {
        title: '行号',
        dataIndex: 'rowno',
        key: 'rowno',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                onChange={e => this.handleFieldChange(e, 'rowno', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="行号"
              />
            );
          }
          return <Tooltip title={text}>
            <div style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              display: 'inline-block',
              width: 100
            }}>{text}</div>
          </Tooltip>
        },
      },
      {
        title: '收入项名称',
        dataIndex: 'incomename',
        key: 'incomename',
        render: (text, record) => {
          if (record.editable) {
            return <Input
              value={text}
              onChange={e => this.handleFieldChange(e, 'incomename', record.key)}
              onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder="收入项名称"
            />
          }
          return <Tooltip title={text}>
            <div style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              display: 'inline-block',
              width: 100
            }}>{text}</div>
          </Tooltip>
        },
      },
      {
        title: '金额',
        dataIndex: 'mnycurr',
        key: 'mnycurr',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                onChange={e => this.handleFieldChange(e, 'mnycurr', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="金额"
              />
            );
          }
          return <Tooltip title={text}>
            <div style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              display: 'inline-block',
              width: 100
            }}>{text}</div>
          </Tooltip>
        },
      },
      {
        title: '应收金额',
        dataIndex: 'armnycurr',
        key: 'armnycurr',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                onChange={e => this.handleFieldChange(e, 'armnycurr', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="应收金额"
              />
            );
          }
          return <Tooltip title={text}>
            <div style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              display: 'inline-block',
              width: 100
            }}>{text}</div>
          </Tooltip>
        },
      },
      {
        title: '实收金额',
        dataIndex: 'actrualmnycurr',
        key: 'actrualmnycurr',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                onChange={e => this.handleFieldChange(e, 'actrualmnycurr', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="实收金额"
              />
            );
          }
          return <Tooltip title={text}>
            <div style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              display: 'inline-block',
              width: 100
            }}>{text}</div>
          </Tooltip>
        },
      },
      {
        title: '操作',
        key: 'caozuo',
        render: (text, record) => {
          if(status){
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

    const { loading, data } = this.state;
    return (
      <div >
        <Table
          style={{marginTop:'8px'}}
          loading={loading}
          columns={columns}
          dataSource={data}
          pagination={false}
          rowClassName={record => (record.editable ? styles.editable : '')}
        />
        <Button
          disabled={status}
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type="dashed"
          onClick={this.newMember}
          icon="plus"
        >
          新增信息
        </Button>
        <div style={{display:'flex',justifyContent:'flex-end',margin:'20px'}}>
          <Button onClick={()=>this.cancelLick(cancel)} disabled={buttonStatus}>
            取消
          </Button>
          <Button style={{marginLeft:'20px'}} onClick={()=>this.validate(onOk)} disabled={buttonStatus}>
            确定
          </Button>
        </div>
      </div>
    );
  }
}

export default Cadd;
