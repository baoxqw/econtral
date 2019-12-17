import {
  addBP,
  fetchBP,
  fetchDept,
  fetchPerson,
  fetchProject,
  dataList
} from '@/services/BP';
import { newdataPer,queryPersonal } from '@/services/api';
import { message } from 'antd';
export default {
  namespace: 'BP',
  state: {
    fetchData: {
      list: [],
      pagination: {},
    },
  },

  //effects方法用处理异步动作
  effects: {
    *fetch({ payload,callback }, { call, put }) {
      const response = yield call(fetchBP, payload);
      console.log("列表",response);
      let obj = {};
      if(response.resData){
        obj = {
          list: response.resData,
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
    *add({ payload,callback }, { call, put }) {
      const response = yield call(addBP, payload);
      if (callback) callback();
    },
    *fetchDept({ payload,callback }, { call, put }) {
      const response = yield call(fetchDept, payload);
      if (callback) callback(response.resData);
    },
    *fetchPerson({ payload,callback }, { call, put }) {
      const response = yield call(fetchPerson, payload);
      const { pageIndex } = payload;
      let obj = [];
      if(response.resData){
        obj = {
          list: response.resData,
          pagination:{
            total: response.total,
            current:pageIndex + 1
          }
        };
      }
      if(callback) callback(obj)
    },
    *fetchProject({ payload,callback }, { call, put }) {
      const response = yield call(fetchProject, payload);
      const { pageIndex } = payload;
      let obj = [];
      if(response.resData){
        obj = {
          list: response.resData,
          pagination:{
            total: response.total,
            current:pageIndex + 1
          }
        };
      }
      if (callback) callback(obj);
    },
    *dataList({ payload,callback }, { call, put }) {
      const response = yield call(dataList, payload);
      if (callback) callback(response);
    },
    *newdata({ payload,callback }, { call, put }) {
      const response = yield call(newdataPer, payload);
      if (callback) callback(response);
    },
    *fetchTable({ payload,callback }, { call, put }) {
      const response = yield call(queryPersonal, payload);
      const { pageIndex } = payload;
      let obj = {};
      if(response.resData){
        obj = {
          list: response.resData,
          pagination:{
            total: response.total,
             current:pageIndex + 1
          }
        };
      }
      if (callback) callback(obj);
     /* yield put({
        type: 'save',
        payload: obj,
      });*/
    },
  },
  //reducers方法处理同步
  reducers: {
    save(state, action) {
      return {
        ...state,
        fetchData: action.payload,
      };
    }
  },
};
