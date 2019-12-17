import storage from '@/utils/storage'
import {
  queryProject,
  findProject,
  findongoingProject,
  updateongoingProject,
  queryOngoingProject,
  fetchresult,
  removeProject,
  addProject,
  updateProject,
  assignProject,
  newassignProject,
  updateongoingProjectinfor,
  queryOngoingProjectUpdate,
  fetchongoingupdateinfor,
  ceshiProject,
  queryattchmentListdue,
  submitProjectAddFormend,
  queryattchmentList,
  deleteAT,
  querylist,
  icmupdate,
  submitProjectAddForm,
  submitProjectAddFormdue,
  findLpListData,
  FindManager,
  findUserFunc
} from '@/services/api';

export default {
  namespace: 'fundproject',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    list:{

    },
    detail:{

    },
    step: {
      payAccount: 'ant-design@alipay.com',
      receiverAccount: 'test@example.com',
      receiverName: 'Alex',
      amount: '500',

    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryProject, payload);
      const obj ={
        list:response.resData,
        pagination:{
          total: response.total
        }
      };
      yield put({
        type: 'save',
        payload: obj,
      });
    },
    *assign({ payload,callback }, { call, put }) {
      const response = yield call(assignProject, payload);
      console.log("fp",response)
      if (callback) callback(response.resData);
    },
    *newassign({ payload,callback }, { call, put }) {
      const {data,pageIndex} = payload;
      const response = yield call(newassignProject, data);
      // const obj ={
      //   list:response.resData
      // };
      const user = storage.get("userinfo");
      const corp_id = user.corp.id;
      yield put({
        type: 'fetch',
        payload: {
          id:corp_id,
          pageIndex,
          pageSize:10
        },
      });
      if (callback) callback();
    },
    *fetchongoing({ payload }, { call, put }) {
      const response = yield call(queryOngoingProject, payload);
      const obj = {
        list: response.resData,
        pagination:{
          total: response.total
        }
      };
      yield put({
        type: 'ongoing',
        payload: obj,
      });
    },
    *fetchongoingupdate({ payload,callback }, { call, put }) {
      const response = yield call(queryOngoingProjectUpdate, payload);
      if(response.resData){
        if (callback) callback(response.resData[0]);
        const detail =  response.resData[0];
        yield put({
          type: 'saveStepFormData',
          payload:detail,
        });
      }
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addProject, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *find({ payload }, { call, put }) {
      const response = yield call(findProject, payload);
      const obj = {
        list: response.resData
      }
      yield put({
        type: 'save',
        payload: obj
      });
    },
    *findongoing({ payload }, { call, put }) {
      const response = yield call(findongoingProject, payload);
      const obj = {
        list: response.resData,
        pagination:{
          total: response.total
        }
      }
      yield put({
        type: 'ongoing',
        payload: obj
      });
    },
    //根据id查询概要信息
    *fetchinfor({ payload,callback }, { call, put }) {
      const response = yield call(updateongoingProjectinfor, payload);
      if (callback) callback(response.resData);
    },
    *fetchinforaa({ payload,callback }, { call, put }) {
      const response = yield call(updateongoingProjectinfor, payload);
      yield put({
        type: 'bb',
        payload: response.resData[0],
      });
      if (callback) callback(response.resData);
    },
    //投资者关系附件上传
    *submitProjectAddForm({ payload,callback }, { call, put }) {
      const response = yield call(submitProjectAddForm, payload);
      if (callback) callback();
      // if (response) {
      //   message.success('创建成功');
      // }else{
      //   message.error('创建失败');
      // }
      //
      // yield put({
      //   type: 'newsave',
      //   payload: response
      // });

    },
    *submitProjectAddFormend({ payload,callback }, { call, put }) {
      const response = yield call(submitProjectAddFormend, payload);
      if (callback) callback();
      // if (response) {
      //   message.success('创建成功');
      // }else{
      //   message.error('创建失败');
      // }
      //
      // yield put({
      //   type: 'newsave',
      //   payload: response
      // });

    },
    //投决会表单提交
    *icmupdate({ payload,callback }, { call, put }) {
      const response = yield call(icmupdate, payload);
      if (callback) callback();
    },
    *fetchresult({ payload,callback }, { call, put }) {
      const response = yield call(fetchresult, payload);
      if (callback) callback(response.resData[0]);
    },
    //尽职调查附件上传
    *submitProjectAddFormdue({ payload,callback }, { call, put }) {
      const response = yield call(submitProjectAddFormdue, payload);
      if (callback) callback();
      // if (response){
      //   message.success('创建成功');
      // }else{
      //   message.error('创建失败');
      // }
      //
      // yield put({
      //   type: 'newsave',
      //   payload: response
      // });

    },
    //投资者关系-查询附件列表
    *queryattchment({ payload,callback }, { call, put }) {
      const response = yield call(queryattchmentList, payload);
      const obj = {
        list: response.resData,
        pagination:{
          total: response.total
        }
      };
      if(response.resData){
        const datasource =  response.resData.map((item,index)=>{
          item.key = index + 1
          return item
        })
        yield put({
          type: 'saveaa',
          payload: datasource,
        });
      }else{
        yield put({
          type: 'saveaa',
          payload: [],
        });
      }
      if (callback) callback(response.resData);
    },
    //尽职调查-查询附件列表
    *queryattchmentdue({ payload,callback }, { call, put }) {
      const response = yield call(queryattchmentListdue, payload);
      const obj = {
        list: response.resData,
        pagination:{
          total: response.total
        }
      };
      if(response.resData){
        const datasource =  response.resData.map((item,index)=>{
          item.key = index + 1
          return item
        })
        yield put({
          type: 'saveab',
          payload: datasource,
        });
      }else{
        yield put({
          type: 'saveaa',
          payload: [],
        });
      }

      if (callback) callback(response.resData);
    },
    //投资者关系-删除附件
    *attachmentdel({ payload, callback }, { call, put }) {
      const { id, pageIndex} = payload;
      const response = yield call(deleteAT, id);
      if(response.resData){
        const datasource =  response.resData.map((item,index)=>{
          item.key = index + 1
          return item
        })
        yield put({
          type: 'saveaa',
          payload: datasource,
        });
      }else{
        yield put({
          type: 'saveaa',
          payload: [],
        });
      }
      if (callback) callback();
    },
    //尽职调查-删除附件
    *attachmentdeldue({ payload, callback }, { call, put }) {
      const { id, pageIndex} = payload;
      const response = yield call(deleteAT, id);
      if(response.resData){
        const datasource =  response.resData.map((item,index)=>{
          item.key = index + 1
          return item
        })
        yield put({
          type: 'saveab',
          payload: datasource,
        });
      }else{
        yield put({
          type: 'saveab',
          payload: [],
        });
      }
/*      yield put({
        type: 'queryattchmentdue',
        payload: {
          id:id,
          pageIndex,
          pageSize:5
        }
      });*/
      if (callback) callback();
    },
    *ongoingupdateproject({ payload,callback }, { call, put }) {
      const response = yield call(updateongoingProject, payload);
      if (callback) callback(response);
    },
    *remove({ payload, callback }, { call, put }) {
      yield call(removeProject, payload);
      const res = yield call(removeProject, payload);
      yield put({
        type: 'fetch',
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateProject, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *ceshi({ payload, callback }, { call, put }) {
      const response = yield call(ceshiProject, payload);
    },
    *findLpList({ payload, callback }, { call, put }) {
      const response = yield call(findLpListData, payload);
      if (callback) callback(response.resData);
    },
    *findManager({ payload, callback }, { call, put }) {
      const response = yield call(FindManager, payload);
      if (callback) callback(response.resData);
    },
    *querylist({ payload, callback }, { call, put }) {
      const response = yield call(querylist, payload);
      if (callback) callback(response.resData);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveaa(state, action) {
      return {
        ...state,
        datasourced: action.payload,
      };
    },
    saveab(state, action) {
      return {
        ...state,
        datasources: action.payload,
      };
    },
    aaa(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    ongoing(state, action) {
      return {
        ...state,
        ongoingdata: action.payload,
      };
    },
    queryProject(state, action) {
      return {
        ...state,
        ongoingdata: action.payload,
      };
    },
    newsave(state, { payload }) {
      return {
        ...state,
        message: payload
      };
    },
    aa(state, action) {
      return {
        ...state,
        datasource: action.payload,
      };
    },
    bb(state, action) {
      return {
        ...state,
        initdata: action.payload,
      };
    },
    saveStepFormData(state,action) {
      return {
        ...state,
        step: {
          ...state.step,
        },
        htmlvalue:action.payload.projectDetail.corpdesc,
        detail:action.payload.projectDetail,
        finance:action.payload.projectFinanceList,
        shareholder:action.payload.projectShareholderList,
        history:action.payload.projectHistoryList,
        distribution:action.payload.projectDistributionList,
        team:action.payload.projectTeamList,
        license:action.payload.projectLicenseList,

      };
    },
  },
};
