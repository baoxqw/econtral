import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Form,
  Modal,
  Input,
  Tooltip,
  DatePicker,
  Divider ,
  Button,
  Card,
  Tabs,
  Icon,
  Select,
  message,
  Popconfirm,
  Upload,
} from 'antd';
import NormalTable from '@/components/NormalTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ChildAdd from './ContactManagementChildAdd'
import ChildUpdate from './ContactManagementChildUpdate'
import styles from '../../System/UserAdmin.less';
import CMACM from './ContactManagementAdd';
import CMUCM from './ContactManagementUpdate';
import Cadd from './Cadd';
import HistoryDetailed from './HistoryDetailed'
import './tableBg.less'
import ExportJsonExcel from 'js-export-excel';
const { Option } = Select;
const { TabPane } = Tabs;
const FormItem = Form.Item;

@connect(({ CMX, loading }) => ({
  CMX,
  loading: loading.models.CMX,
  listLoading:loading.effects['CMX/fetch'],
  uploading:loading.effects['CMX/uploadList'],
}))
@Form.create()
class ContactManagement extends PureComponent {
  state = {
    fileList: [],

    subApprove:false,//提交审核按钮是否禁用
    childShow:true,
    uploadShow:false,//上传附件的models是否禁用
    uploadButtonShow:true,//上传附件的按钮是否禁用
    expandForm:false,
    conditions:[],
    childTable:{},
    superId:null, //表头id
    childId:null,
    childVisible: false,
    childUpdateVisible:false,
    childRecord:{},
    rowId:null,
    addVisible:false,
    updateVisible:false,
    record:{
      id:null
    },
    spage:{},
    cpage:{},
    change:true,
    status:true,
    buttonStatus:true,
    changeStatue:false,

    //历史变更详情
    detailed:false,
    HDHT:{},

    resColumns:[]
  };

  componentDidMount(){
    const { dispatch } = this.props;
    dispatch({
      type:'CMX/fetch',
      payload:{
        pageSize:100000,
        pageIndex:0
      }
    })
  }

  handleCorpAdd = () => {
    this.setState({
      addVisible:true,
    })
  };
  clickUpload =()=>{
    const { dispatch } = this.props
    this.setState({
      uploadShow:true,
    })
    // 附件数据
    dispatch({
      type:'CMX/fileList',
      payload:{
        reqData:{
          id:this.state.superId,
          type:'contract'
        }
      },
      callback:(res)=>{
        res.map((item)=>{
          this.setState({fileList:res})
        })
      }
    })
  }
  sunmitApprove = ()=>{
    const { dispatch } = this.props;
    const { superId,record } = this.state;
    console.log("record",record)
    dispatch({
      type:'CMX/subapprove',
      payload:{
        reqData:{
          billcode:record.billcode,
          billtype:'PM_CONTRACT_H',
          billid:this.state.superId,
          auditors:[{
            id:94,
            name:'a',
          }],
          audittype:'PM_CONTRACT_H'
        }
      },
      callback:(res)=>{
        console.log("提交审核",res)
        if(res.errMsg === "提交成功"){
          message.success("提交成功",1,()=>{
            dispatch({
              type:'CMX/fetch',
              payload:{
                pageIndex:0,
                pageSize:100000
              },
              callback:()=>{
                this.setState({
                  subApprove:false,
                  change:false
                })
              }
            })
          })
        }else{
          message.error("提交失败")
        }

      }
    })

  }
  updataRoute = (e,record) => {
    e.preventDefault()
    this.setState({
      updateVisible:true,
      record
    })
  };

  childClick = () =>{
    this.setState({
      childVisible: true,
    })
  };

  toggleForm = () =>{
    const { expandForm } = this.state
    this.setState({expandForm:!expandForm})
  };

  handleDelete = (record)=>{
    const { id } = record;
    const { dispatch } = this.props;

    dispatch({
      type:'CMX/remove',
      payload:{
        reqData:{
          id
        }
      },
      callback:(res)=>{
        if(res){
          message.success("删除成功",1,()=>{
            dispatch({
              type:'CMX/fetch',
              payload:{
                pageSize:100000,
                pageIndex:0
              }
            })
          })
        }
      }
    })
  }
  //查询
  findList = (e)=>{
    e.preventDefault();
    const { form,dispatch } = this.props;
    form.validateFields((err, values) => {
      const { billcode, billname,status } = values;
      if(billcode || billname || status){
        let conditions = [];
        let billcodeObj = {};
        let billnameObj = {};
        let statusObj = {};

        if(billcode){
          billcodeObj = {
            code:'billcode',
            exp:'like',
            value:billcode
          };
          conditions.push(billcodeObj)
        }
        if(billname){
          billnameObj = {
            code:'billname',
            exp:'like',
            value:billname
          };
          conditions.push(billnameObj)
        }
        if(status){
          statusObj = {
            code:'status',
            exp:'like',
            value:status
          };
          conditions.push(statusObj)
        }
        this.setState({
          conditions
        });
        const obj = {
          pageSize:100000,
          pageIndex:0,
          conditions,
        };
        dispatch({
          type:'CMX/fetch',
          payload:obj,
        })
      }else{
        dispatch({
          type:'CMX/fetch',
          payload:{
            pageSize:100000,
            pageIndex:0
          }
        })
      }
    })

  }
  //取消
  handleFormReset = ()=>{
    const { dispatch,form} = this.props;
    //清空输入框
    form.resetFields();
    //清空后获取列表
    dispatch({
      type:'CMX/fetch',
      payload:{
        pageSize:100000,
        pageIndex:0
      }
    });
  };

  handleChangeStatus = ()=>{
    this.setState({
      status:false,
      childShow:false,
      //subApprove:true,
      uploadButtonShow:false,
      changeStatue:true,
    })
  };

  daoChu = ()=>{
    const { dispatch } = this.props;
    const { resColumns } = this.state;
    dispatch({
      type:'CMX/fetch',
      payload:{
        pageSize:100000,
        pageIndex:0
      },
      callback:(res)=>{
        if(res && res.list){
          let option={};
          let dataTable = [];
          let arr = []; //保存key
          res.list.map((item)=>{
            /*let obj = {
              '合同编码':item.billcode,
              '合同名称': item.billname,
              '合同类型':item.type,
              '版本号': item.version,
              '合同状态': item.status,
              '签约日期': item.signdate,
              '签约地址': item.signplace,
              '计划生效日期': item.planValidateTime,
              '计划终止日期': item.planTeminateTime,
              '客户': item.custname,
              '经办部门': item.deptname,
              '经办人员': item.operatorname,
              '合同金额': item.contractmny,
              '额外费用': item.additionalcharges,
              '有效合同额': item.eca,
            }*/
            let obj = {}
            resColumns.map(ite => {
              const title = ite.title;
              const dataIndex = ite.dataIndex;
              for(let key in item){
                if(key === dataIndex){
                  obj[title] = item[key]
                }
              }
            })
            dataTable.push(obj);
          });
          if(dataTable.length){
            for(let key in dataTable[0]){
              arr.push(key)
            }
          }
          option.fileName = '合同管理';
          option.datas=[
            {
              sheetData:dataTable,
              sheetName:'sheet',
              sheetFilter:arr,
              sheetHeader:arr,
            }
          ];

          const toExcel = new ExportJsonExcel(option);
          toExcel.saveExcel();
        }else{
          message.error("没有数据可导出");
        }
      }
    })

  };

  renderForm() {
    const {
      form: { getFieldDecorator },
      loading
    } = this.props;
    const { expandForm } = this.state
    return (
      <Form onSubmit={(e)=>this.findList(e)} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label='合同编码'>
              {getFieldDecorator('billcode')(<Input placeholder='请输入合同编码' />)}
            </FormItem>
          </Col>
          <Col md={8} sm={16}>
            <FormItem label='合同名称'>
              {getFieldDecorator('billname')(<Input placeholder='请输入合同名称' />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
               取消
              </Button>
              {
                expandForm?<a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                  收起
                  <Icon type="up" />
                </a>:<a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                  展开
                  <Icon type="down" />
                </a>
              }
            </span>
          </Col>

        </Row>
        {expandForm? <Row>
          <Col md={8} sm={16}>
            <FormItem label='合同状态'>
              {getFieldDecorator('status')(
                <Select style={{width:'217px'}} placeholder={"请选择合同状态"}>
                  <Option value={"初始状态"}>初始状态</Option>
                  <Option value={"审批进行中"}>审批进行中</Option>
                  <Option value={"审批通过"}>审批通过</Option>
                  <Option value={"审批不通过"}>审批不通过</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>:''}
        <div>
          <Button icon="plus" onClick={this.handleCorpAdd} type="primary" >
            新建
          </Button>

          <Button type='primary' style={{marginLeft:"20px"}}   onClick={this.clickUpload}>
            合同附件
          </Button>

          <Button type='primary' disabled={!this.state.subApprove} style={{marginLeft:"20px"}} onClick={this.sunmitApprove}>
            提交审核
          </Button>
          <Button style={{marginLeft:'20px'}} disabled={this.state.change} onClick={this.handleChangeStatus}>
            合同变更
          </Button>
          <Button type='primary' style={{marginLeft:'20px'}} onClick={this.daoChu}>
            导出
          </Button>
        </div>
      </Form>
    );
  }

  childupdataRoute = (e,record)=>{
    e.preventDefault();
    this.setState({
      childUpdateVisible:true,
      childRecord:record
    })
  }

  childHandleDelete = (record) => {
    const { id } = record;
    const { dispatch } = this.props;
    const { superId } = this.state;
    dispatch({
      type:'CMX/deleteChild',
      payload:{
        reqData:{
          id
        }
      },
      callback:(res)=>{
        if(res){
          message.success("删除成功",1,()=>{
            const conditions = [{
              code:'CONTRACT_H_ID',
              exp:'=',
              value:superId + ''
            }];
            dispatch({
              type:'CMX/findId',
              payload:{
                pageSize:10,
                pageIndex:0,
                conditions
              },
              callback:(res)=>{
                this.setState({
                  childTable:res
                })
              }
            })
          })
        }
      }
    })
  }

  setRowClassName = (record) => {
    return record.id === this.state.rowId ? 'clickRowStyl' : '';
  };

  handleOk = e => {
    const { dispatch } = this.props;
    const { fileList,rowId} = this.state;
    const formData = new FormData();
    if(fileList.length>0){
      fileList.forEach(file => {
        formData.append('files[]', file);
        formData.append('parentpath', 'contract');
        formData.append('bill_id', rowId);
      });
    }else{
      message.error('请先选择文件')
      return
    }
    dispatch({
      type:'CMX/uploadList',
      payload:formData,
      callback:(res)=>{
        message.success('上传成功',1.5,()=>{
          this.setState({
            uploadShow: false,
            fileList:[],
          });
        })
      }
    })
  };

  handleCancel = e => {
    this.setState({
      uploadShow: false,
    });
  };

  detailed = (e,record)=>{
    e.preventDefault();
    const { id } = record;
    const { dispatch } = this.props;
    dispatch({
      type:'CMX/historyDetails',
      payload:{
        reqData:{
          id
        }
      },
      callback:(res)=>{
        this.setState({
          detailed:true,
          HDHT:res
        })
      }
    });

  };

  callback = (key)=>{

  };

  onClickColumns = (res)=>{
    res = res.filter(item=>item.title !== "操作")
    this.setState({
      resColumns:res
    })
  }

  render() {
    const {
      loading,
      listLoading,
      CMX:{fetchData,historyList},
      dispatch,
      uploading
    } = this.props;
    const { childTable,superId,addVisible,updateVisible,record,fileList,childShow,subApprove,buttonStatus,status } = this.state;
    const props = {
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: file => {
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }));
        return false;
      },
      fileList,
    };
    const columns = [
      {
        title: '合同编码',
        dataIndex: 'billcode',
      },
      {
        title: '合同名称',
        dataIndex: 'billname',

      },
      {
        title: '合同类型',
        dataIndex: 'type',
      },
      {
        title: '合同状态',
        dataIndex: 'status',
      },
      {
        title: '版本号',
        dataIndex: 'version',
      },
      {
        title: '签约日期',
        dataIndex: 'signdate',
      },
      {
        title: '签约地址',
        dataIndex: 'signplace',
      },
      {
        title: '计划生效日期',
        dataIndex: 'planValidateTime',
      },
      {
        title: '计划终止日期',
        dataIndex: 'planTeminateTime',
      },
      {
        title: '客户',
        dataIndex: 'custname',
      },
      {
        title: '经办部门',
        dataIndex: 'deptname',
      },
      {
        title: '经办人员',
        dataIndex: 'operatorname',
      },
      {
        title: '合同金额',
        dataIndex: 'contractmny',
      },
      {
        title: '额外费用',
        dataIndex: 'additionalcharges',
      },
      {
        title: '有效合同额',
        dataIndex: 'eca',
      },
      {
        title: formatMessage({ id: 'validation.operation' }),
        dataIndex: 'caozuo',
        fixed: 'right',
        render: (text, record) => {
          if(record.status === '初始状态' && record.version === 1){
            return <Fragment>
              <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record)}>
                <a href="#javascript:;">删除</a>
              </Popconfirm>
              <Divider type="vertical" />
              <a href="#javascript:;"  onClick={(e)=>this.updataRoute(e,record)}>编辑</a>
            </Fragment>
          }else{
            return <Fragment>
              <Popconfirm title="确定删除吗?">
                <a href="#javascript:;" disabled={true}>删除</a>
              </Popconfirm>
              <Divider type="vertical" />
              <a href="#javascript:;" disabled={true}>编辑</a>
            </Fragment>
          }
        },
      },
    ];
    const columnHistory = [
      {
        title: '版本',
        dataIndex: 'version',
      },
      {
        title: '变更人',
        dataIndex: 'username',
      },
      {
        title: '变更日期',
        dataIndex: 'ct',
      },
      {
        title: '变更原因',
        dataIndex: 'memo',
      },
      {
        title:'备注',
        dataIndex:'memo',
        render:(text,record)=>{
          if(record.version === 1){
            return "原始版本"
          }
        }
      },
      {
        title: '操作',
        dataIndex: 'cao',
        fixed: 'right',
        render:(text,record)=> <a href="#javastring:;" onClick={(e)=>this.detailed(e,record)}>详情</a>
      },
    ];

    const ChildAddData = {
      visible:this.state.childVisible,
    };
    const onAddChild = {
      onOk:(obj)=>{
        const { superId } = this.state;
        const { dispatch } = this.props;
        if(!superId) return;
        if(obj.length<1){
          return
        }
        dispatch({
          type:'CMX/childadd',
          payload: {
            reqData:{
              contractHId:superId,
              ...obj
            }
          },
          callback:(res)=>{
            if(res.errMsg === '成功'){
              message.success("创建成功",1,()=>{
                this.setState({
                  childVisible:false
                });
                const conditions = [{
                  code:'CONTRACT_H_ID',
                  exp:'=',
                  value:superId + ''
                }];
                dispatch({
                  type:'CMX/findId',
                  payload:{
                    pageSize:10,
                    pageIndex:0,
                    conditions
                  },
                  callback:(res)=>{
                    this.setState({
                      childTable:res
                    })
                  }
                })
              })
            }else{
              message.error("创建有问题")
            }
          }
        })
      },
      handleCancel:()=>{
        this.setState({
          childVisible:false
        })
      }
    };

    const ChildUpdateData = {
      visible:this.state.childUpdateVisible,
      record:this.state.childRecord
    };
    const onUpdateChild = {
      onOk:(obj)=>{
        const { superId,childRecord } = this.state;
        const { dispatch } = this.props;
        if(!superId) return;
        dispatch({
          type:'CMX/childadd',
          payload: {
            reqData:{
              id:childRecord.id,
              contractHId:superId,
              ...obj
            }
          },
          callback:(res)=>{
            if(res.errMsg === '成功'){
              message.success("编辑成功",1,()=>{
                this.setState({
                  childUpdateVisible:false
                });
                const conditions = [{
                  code:'CONTRACT_H_ID',
                  exp:'=',
                  value:superId + ''
                }];
                dispatch({
                  type:'CMX/findId',
                  payload:{
                    pageSize:10,
                    pageIndex:0,
                    conditions
                  },
                  callback:(res)=>{
                    this.setState({
                      childTable:res
                    })
                  }
                })
              })
            }else{
              message.error("更新有问题")
            }
          }
        })
      },
      handleCancel:()=>{
        this.setState({
          childUpdateVisible:false
        })
      }
    };

    const AddBMData = {
      visible:addVisible,
      id:this.state.id,
      name:this.state.name
    };
    const AddBMOn = {
      onOk:(obj)=>{
        return new Promise((resolve, reject) => {
          dispatch({
            type:'CMX/add',
            payload: {
              reqData:{
                ...obj
              }
            },
            callback:(res)=>{
              console.log("新建",res)
              if(res.errMsg === "成功"){
                message.success("新建成功",1,()=>{
                  this.setState({
                    addVisible:false
                  });
                  dispatch({
                    type:'CMX/fetch',
                    payload:{
                      pageSize:100000,
                      pageIndex:0
                    }
                  })
                })
                resolve();
              }else{
                reject()
              }
            }
          })
        })
      },
      handleCancel:()=>{
        this.setState({
          addVisible:false
        })
      }
    };

    const UpdateBMData = {
      visible:updateVisible,
      record
    };
    const UpdateBMOn = {
      onOk:(obj)=>{
        dispatch({
          type:'CMX/add',
          payload: {
            reqData:{
              ...obj
            }
          },
          callback:(res)=>{
            if(res){
              message.success("编辑成功",1,()=>{
                this.setState({
                  updateVisible:false
                });
                dispatch({
                  type:'CMX/fetch',
                  payload:{
                    pageSize:100000,
                    pageIndex:0
                  }
                })
              })
            }
          }
        })
      },
      handleCancel:()=>{
        this.setState({
          updateVisible:false
        })
      }
    };


    const addChild = {
      onOk:(res)=>{
        const { changeStatue } = this.state;
        let count = 0;
        if(!res.length){
          message.error("请先新增信息");
          return
        }
        if(res.length){
          res.map(item =>{
            if(item.mnycurr){
              item.mnycurr = Number(item.mnycurr)
            }
            if(item.armnycurr){
              item.armnycurr = Number(item.armnycurr)
            }
            if(item.actrualmnycurr){
              item.actrualmnycurr = Number(item.actrualmnycurr)
            }else{
              item.actrualmnycurr = 0
            }
            if(item.id){
              delete item.id
            }
            count = count + item.mnycurr;
            return item
          })
        }
        const { dispatch } = this.props;
        dispatch({
          type:'CMX/childadd',
          payload:{
            reqData:{
              id:superId,
              contractmny:count,
              contractBasics:res
            }
          },
          callback:(res)=>{
            console.log('res',res)
            if(res.errMsg === "成功"){
              message.success(`${changeStatue?'变更成功':'提交成功'}`,1,()=>{
                dispatch({
                  type:'CMX/fetch',
                  payload:{
                    pageSize:100000,
                    pageIndex:0
                  }
                })
                const conditions = [{
                  code:'CONTRACT_H_ID',
                  exp:'=',
                  value:superId+''
                }];
                dispatch({
                  type:'CMX/findId',
                  payload:{
                    conditions
                  },
                  callback:(res)=>{
                    if(res.list){
                      res.list.map((item,index) =>{
                        item.key = `${index}-${index}`;
                        return item
                      });
                    }
                    this.setState({
                      childTable:res
                    })
                  }
                });
                this.setState({
                  buttonStatus:true
                })
              })
            }
          }
        })
      },
      cancel:()=>{
        const { dispatch } = this.props;
        const { status } = this.state;
        if(!status){
          this.setState({
            status:true,
            buttonStatus:true
          })
        }
        const conditions = [{
          code:'CONTRACT_H_ID',
          exp:'=',
          value:superId
        }];
        dispatch({
          type:'CMX/findId',
          payload:{
            pageSize:10,
            pageIndex:0,
            conditions
          },
          callback:(res)=>{
            if(res.list){
              res.list.map((item,index) =>{
                item.key = `${index}-${index}`;
                return item
              });
            }
            this.setState({
              childTable:res,
            })
          }
        });
      },
      onSave:(res,bool)=>{
        this.setState({
          buttonStatus:bool
        })
      },
      status,
      buttonStatus
    };

    const onDetailed = {
      handleCancel:()=>{
        this.setState({
          detailed:false
        })
      }
    };
    const DetailedData = {
      visible:this.state.detailed,
      headerData:this.state.HDHT
    };

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.userAdmin}>
            <div className={styles.userAdminForm}>{this.renderForm()}</div>
            <div className={styles.userAdminOperator}></div>
            <NormalTable
              loading={listLoading}
              data={fetchData}
              columns={columns}
              pagination={false}
              scroll={{y:200}}
              onClickColumns={this.onClickColumns}
              onRow={(record )=>{
                return {
                  onClick:()=>{
                    console.log("record",record)
                    const { dispatch } = this.props;
                    if(record.status === '初始状态' ) {
                      this.setState({ uploadButtonShow: false })
                    }else{
                      this.setState({ uploadButtonShow: true })
                    }
                    if(record.status === "审批进行中" || record.status==="审批通过"){
                      this.setState({
                        status:true
                      })
                    }else{
                      this.setState({
                        status:false
                      })
                    }
                    if(record.status==="审批通过"){
                      this.setState({
                        change:false
                      })
                    }else{
                      this.setState({
                        change:true
                      })
                    }
                    //子表数据
                    const conditions = [{
                      code:'CONTRACT_H_ID',
                      exp:'=',
                      value:record.id+''
                    }];
                    //合同基本
                    dispatch({
                      type:'CMX/findId',
                      payload:{
                        conditions
                      },
                      callback:(res)=>{
                        if(res.list){
                          res.list.map((item,index) =>{
                            item.key = `${index}-${index}`;
                            return item
                          });
                        }
                        if(res.list && res.list.length && record.status === "初始状态"){
                          this.setState({
                            subApprove:true
                          })
                        }else{
                          this.setState({
                            subApprove:false
                          })
                        }
                        this.setState({
                          childTable:res,
                          superId:record.id,
                          rowId: record.id,
                        })
                      }
                    });
                    //变更历史
                    dispatch({
                      type:"CMX/history",
                      payload:{
                        pageSize:10,
                        pageIndex:0,
                        reqData:{
                          contractno:record.billcode
                        }
                      },
                      callback:(res)=>{

                      }
                    });
                    // 附件数据
                    this.setState({
                      record,
                      superId:record.id,
                      changeStatue:false,
                      buttonStatus:true
                    })
                  },
                  rowKey:record.id
                }
              }}
              //onChange={this.handleStandardTableChange}
              rowClassName={this.setRowClassName}
            />
          </div>
          <Modal
            title="附件"
            visible={this.state.uploadShow}
            destroyOnClose
            onCancel={this.handleCancel}
            footer={[
              // 定义右下角 按钮的地方 可根据需要使用 一个或者 2个按钮
              <Button   onClick={this.handleCancel}>
                取消
              </Button>,
              <Button  type="primary"  onClick={this.handleOk} loading={uploading} disabled={this.state.uploadButtonShow}>
                确定
              </Button>,
            ]}
          >
            <Upload {...props}>
              {this.state.uploadButtonShow?'':<Button disabled={this.state.uploadButtonShow}>
                <Icon type="upload" /> 选择文件
              </Button>}
            </Upload>
          </Modal>
        </Card>
        <Card bordered={false} style={{marginTop:'35px'}}>
          <Tabs onChange={this.callback}>
            <TabPane tab="合同基本内容" key="1" style={{padding:'0!important'}}>
              {/*<div style={{padding:'12px 0'}}>
                <Button type='primary' icon="plus" disabled={superId?0:1} onClick={this.childClick}>新建</Button>
              </div>
              <NormalTable
                loading={loading}
                data={childTable}
                columns={childColumns}
              />*/}
              <Cadd  data={childTable.list} loading={loading} onaddChild={addChild}/>
            </TabPane>
            <TabPane tab="合同条款" key="2">

            </TabPane>
            <TabPane tab="合同大事记" key="3">

            </TabPane>
            <TabPane tab="变更历史" key="4">
              <NormalTable
                style={{marginTop:"8px"}}
                data={historyList}
                columns={columnHistory}
              />

            </TabPane>
            <TabPane tab="执行过程" key="5">

            </TabPane>
            <TabPane tab="计划收款" key="6">

            </TabPane>
          </Tabs>
        </Card>

        <CMACM on={AddBMOn} data={AddBMData}/>

        <CMUCM on={UpdateBMOn} data={UpdateBMData}/>

        <ChildAdd on={onAddChild} data={ChildAddData}/>

        <ChildUpdate on={onUpdateChild} data={ChildUpdateData}/>

        <HistoryDetailed on={onDetailed} data={DetailedData}/>
      </PageHeaderWrapper>
    );
  }
}

export default ContactManagement;
