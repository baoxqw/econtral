import { queryApplyed,queryReadyApply,queryReadyApplyed,updatePlan,fetchStatus,
  removePlan,FindManager,checkStatustable,refuseStatustable } from '@/services/api';
import { fetchList }from '@/services/statu';
import moment from 'moment';

export default {
  namespace: 'statustable',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    dataList: {
      list: [],
      pagination: {},
    },
    fetchData: {
      list: [],
      pagination: {},
    },
  },

  //effects方法用处理异步动作
  effects: {
    *fetch({ payload,callback }, { call, put }) {
      const response = yield call(queryApplyed, payload);
      let obj = {}
      if( response.resData){
        response.resData.map((item,index)=>{
          item.startTime = moment(parseInt(item.startTime)).format("YYYY-MM-DD");
          item.endTime = moment(parseInt(item.endTime)).format("YYYY-MM-DD");
          if(item.params){
            // item.billcode = item.params.billcode
            item.username = item.params.username
          }
          return item
        })
        obj ={
          list:response.resData,
          pagination:{
            total: response.total
          }
        };
      }
      yield put({
        type: 'save',
        payload: obj,
      });
    },
    *fetchList({ payload,callback }, { call, put }) {
      const response = yield call(fetchList, payload);
      let obj  = {}
      if(response.resData){
         obj ={
          list:response.resData,
          pagination:{
            total: response.total
          }
        };
      }
      yield put({
        type: 'save',
        payload: obj,
      });
      if (callback) callback(response.resData);
    },
    *query({ payload,callback }, { call, put }) {
      const response = yield call(fetchStatus, payload);
      yield put({
        type: 'fetchD',
        payload: response,
      });
      if (callback) callback(response.resData);
    },
    *readyfetch({ payload,callback }, { call, put }) {
      const response = yield call(queryReadyApply, payload);
      let obj = {};
      if(response.resData){
        response.resData.map((item,index)=>{
          item.startTime = moment(parseInt(item.startTime)).format("YYYY-MM-DD");
          item.endTime = moment(parseInt(item.endTime)).format("YYYY-MM-DD");
          if(item.params){
            // item.billcode = item.params.billcode
            item.username = item.params.username
          }
          return item
        })
        obj ={
          list:response.resData,
          pagination:{
            total: response.total
          }
        };
      }
      yield put({
        type: 'data',
        payload: obj,
      });
    },
    *readyfetched({ payload,callback }, { call, put }) {
      const response = yield call(queryReadyApplyed, payload);
      let obj = {}
      if(response.resData){
        response.resData.map((item,index)=>{
          item.startTime = moment(parseInt(item.startTime)).format("YYYY-MM-DD");
          item.endTime = moment(parseInt(item.endTime)).format("YYYY-MM-DD");
          if(item.params){
            // item.billcode = item.params.billcode
            item.username = item.params.username
          }
          return item
        })
        obj ={
          list:response.resData,
          pagination:{
            total: response.total
          }
        };
      }
      yield put({
        type: 'data',
        payload: obj,
      });
    },
    *find({ payload,callback }, { call, put }) {
      const response = yield call(findPlan, payload);
      if (callback) callback(response.resData);
    },
    *remove({ payload,callback }, { call, put }) {
      const response = yield call(removePlan, payload);
       if(response.errCode == '0'){
         if (callback) callback(response);
       }

    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addPlan, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updatePlan, payload);
      /*yield put({
        type: 'save',
        payload: response,
      });*/
      if (callback) callback();
    },
    *findManager({ payload, callback }, { call, put }) {
      const response = yield call(FindManager, payload);
      if (callback) callback(response.resData);
    },
    *check({ payload, callback }, { call, put }) {
      const response = yield call(checkStatustable, payload);
      if (callback) callback(response);
    },
    *refuse({ payload, callback }, { call, put }) {
      const response = yield call(refuseStatustable, payload);
      if (callback) callback(response);
    },
  },
  //reducers方法处理同步
  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    data(state, action) {
      return {
        ...state,
        dataList: action.payload,
      };
    },
    fetchD(state, action) {
      return {
        ...state,
        fetchData: action.payload,
      };
    },
  },
};
