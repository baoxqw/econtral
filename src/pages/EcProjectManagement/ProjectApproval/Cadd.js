import React, { PureComponent, Fragment } from 'react';
import { Table, Button, Input, message, Popconfirm, Divider, Form } from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import { toTree } from '@/pages/tool/ToTree';
import TreeTable from '@/pages/tool/TreeTable/TreeTable';
import NormalTable from '@/components/NormalTable';

@connect(({ pd, papproval,paneed,loading }) => ({
  pd,
  papproval,
  paneed,
  loading:loading.models.paneed,
  topLoading:loading.effects['paneed/toplist'],
  childLoading:loading.effects['paneed/childList'],

}))
@Form.create()
class Cadd extends PureComponent {
  index = 0;

  cacheOriginData = {};

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      loading: false,
      /* eslint-disable-next-line react/no-unused-state */
      value: props.value,
      status:false,

      TreeMaterialData:[], //存储左边树的数据
      MaterialConditions:[], //存储查询条件
      material_id:null, //存储立项人左边数点击时的id  分页时使用
      TableMaterialData:[], //存储表数据  格式{list: response.resData, pagination:{total: response.total}}
      SelectMaterialValue:[], //存储右表选中时时的name  初始进来时可以把获取到的name存入进来显示
      selectedMaterialRowKeys:[], //立项人  存储右表选中时的挣个对象  可以拿到id
      pageMaterial:{},

      vStatus:true
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
    if(nextProps.on.status !== this.props.on.status){
      this.setState({
        vStatus:nextProps.on.status
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
      key: `${this.index}`,
      materialcode: [],
      materialname: '',
      materialBaseId: null,
      num: null,
      materialmodel: null,
      materialspec: null,
      memo:null,
      editable: true,
      isNew: true,
    });
    this.index += 1;
    this.setState({ data: newData });
  };

  remove(key) {
    const { data } = this.state;
    // const { onChange } = this.props;
    const newData = data.filter(item => item.key !== key);
    this.setState({ data: newData });
    // onChange(newData);
  }

  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }
  handleFChange(date,dateString, fieldName, key) {
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
      if(fieldName === "materialcode"){
        target["materialcode"] = e.materialBaseCode;
        target["materialname"] = e.selectedRows.name;
        target["materialBaseId"] = e.selectedRows.id;
        target["materialmodel"] = e.selectedRows.model;
        target["materialspec"] = e.selectedRows.spec;
      }else{
        target[fieldName] = e.target.value;
      }
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
      if (!target.materialBaseId || !target.materialname || !target.num || !target.materialmodel || !target.materialspec) {
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
    const { on:{onOk,cancel,status},dispatch } = this.props;
    const { loading, data } = this.state;
    const columns = [
      {
        title: '物料编码',
        dataIndex: 'materialcode',
        key: 'materialcode',
        render: (text, record) => {
          if (record.editable) {
            const on = {
              onIconClick:()=>{
                const { dispatch } = this.props;
                dispatch({
                  type:'paneed/matype',
                  payload: {
                    reqData:{}
                  },
                  callback:(res)=>{
                    const a = toTree(res.resData);
                    this.setState({
                      TreeMaterialData:a
                    })
                  }
                });
                dispatch({
                  type:'paneed/fetchMata',
                  payload:{
                    pageIndex:0,
                    pageSize:10,
                  },
                  callback:(res)=>{
                    this.setState({
                      TableMaterialData:res,
                    })
                  }
                })
              }, //input聚焦时调用的接口获取信息
              onSelectTree:(selectedKeys, info)=>{
                const { dispatch} = this.props;
                if(info.selectedNodes[0]){
                  const obj = {
                    pageIndex:0,
                    pageSize:10,
                    id:info.selectedNodes[0].props.dataRef.id
                  }
                  dispatch({
                    type:'paneed/fetchMata',
                    payload:obj,
                    callback:(res)=>{
                      this.setState({
                        TableMaterialData:res,
                        material_id:obj.id
                      })
                    }
                  })
                }
              }, //点击左边的树
              handleTableChange:(obj)=>{
                const { dispatch } = this.props;
                const { MaterialConditions,material_id } = this.state;
                const param = {
                  id:material_id,
                  ...obj
                };
                this.setState({
                  pageMaterial:param
                })
                if(MaterialConditions.length){
                  dispatch({
                    type:'paneed/fetchMata',
                    payload:{
                      conditions:MaterialConditions,
                      ...obj,
                    },
                    callback:(res)=>{
                      this.setState({
                        TableMaterialData:res,
                      })
                    }
                  });
                  return
                }
                dispatch({
                  type:'paneed/fetchMata',
                  payload:param,
                  callback:(res)=>{
                    this.setState({
                      TableMaterialData:res,
                    })
                  }
                })
              }, //分页
              onOk:(selectedRowKeys,selectedRows)=>{
                if(!selectedRowKeys || !selectedRows){
                  return
                }
                const codeList = selectedRows.map(item =>{
                  return item.code
                });
                this.handleFieldChange({selectedRows:selectedRows[0],materialBaseCode:codeList[0]}, 'materialcode', record.key)
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
                    MaterialConditions:conditions
                  })
                  const obj = {
                    pageIndex:0,
                    pageSize:10,
                    conditions,
                  };
                  dispatch({
                    type:'paneed/fetchMata',
                    payload:obj,
                    callback:(res)=>{
                      this.setState({
                        TableMaterialData:res,
                      })
                    }
                  })
                }
              }, //查询时触发
              handleReset:()=>{
                const { pageMaterial } = this.state;
                this.setState({
                  MaterialConditions:[]
                })
                dispatch({
                  type:'paneed/fetchMata',
                  payload:{
                    ...pageMaterial
                  },
                  callback:(res)=>{
                    this.setState({
                      TableMaterialData:res,
                    })
                  }
                })
              }, //清空时触发
              onButtonEmpty:()=>{
                this.setState({
                  SelectMaterialValue:[],
                  selectedMaterialRowKeys:[],
                })
              }
            };
            const datas = {
              TreeData:this.state.TreeMaterialData, //树的数据
              TableData:this.state.TableMaterialData, //表的数据
              SelectValue:text, //框选中的集合
              selectedRowKeys:[record.materialBaseId], //右表选中的数据
              placeholder:'请选择物料',
              columns : [
                {
                  title: '物料编码',
                  dataIndex: 'code',
                  key: 'code',
                },
                {
                  title: '物料名称',
                  dataIndex: 'name',
                  key: 'name',

                },
                {
                  title: '规格',
                  dataIndex: 'spec',
                  key: 'spec',
                },
                {
                  title: '型号',
                  dataIndex: 'model',
                  key: 'model',
                },
                {
                  title: '计量单位',
                  dataIndex: 'ucumName',
                  key: 'ucumName',
                },
                {
                  title: '物料简称',
                  dataIndex: 'materialshortname',
                  key: 'materialshortname',
                },
                {
                  title: '物料条形码',
                  dataIndex: 'materialbarcode',
                  key: 'materialbarcode',
                },
                {
                  title: '物料助记器',
                  dataIndex: 'materialmnecode',
                  key: 'materialmnecode',
                },
                {
                  title: '图号',
                  dataIndex: 'graphid',
                  key: 'graphid',
                },
                {
                  title: '',
                  dataIndex: 'caozuo',
                  key: 'caozuo',
                },
              ],
              fetchList:[
                {label:'物料编码',code:'code',placeholder:'请输入物料编码'},
                {label:'物料名称',code:'name',placeholder:'请输入物料名称'},
              ],
              title:'物料选择'
            };
            return (
              <TreeTable
                value={text}
                on={on}
                data={datas}
              />
            );
          }
          return text;
        },
      },
      {
        title: '物料名称',
        dataIndex: 'materialname',
        key: 'materialname',
        render: (text, record) => {
          if (record.editable) {
            return <Input
              value={text}
              onChange={e => this.handleFieldChange(e, 'materialname', record.key)}
              onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder="请输入物料名称"
              disabled
            />
          }
          return text;
        },
      },
      {
        title: '物料规格',
        dataIndex: 'materialspec',
        key: 'materialspec',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                disabled
                value={text}
                onChange={e => this.handleFieldChange(e, 'materialspec', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="请输入物料规格"
              />
            );
          }
          return text;
        },
      },
      {
        title: '物料型号',
        dataIndex: 'materialmodel',
        key: 'materialmodel',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                disabled
                value={text}
                onChange={e => this.handleFieldChange(e, 'materialmodel', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="请输入物料型号"
              />
            );
          }
          return text;
        },
      },
      {
        title: '数量',
        dataIndex: 'num',
        key: 'num',
        render: (text, record) => {
          if (record.editable) {
            return <Input
              value={text}
              onChange={e => this.handleFieldChange(e, 'num', record.key)}
              onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder="请输入数量"
            />
          }
          return text;
        },
      },
      {
        title: '备注',
        dataIndex: 'memo',
        key: 'memo',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                onChange={e => this.handleFieldChange(e, 'memo', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="请输入备注"
              />
            );
          }
          return text;
        },
      },
      {
        title: '操作',
        key: 'action',
        fixed:'right',
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

    return (
      <div >
        <NormalTable
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
          <Button onClick={()=>this.cancelLick(cancel)} disabled={status}>
            取消
          </Button>
          <Button style={{marginLeft:'20px'}} onClick={()=>this.validate(onOk)} disabled={status}>
            确定
          </Button>
        </div>
      </div>
    );
  }
}

export default Cadd;
