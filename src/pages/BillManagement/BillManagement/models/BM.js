import {
  addBM,
  fetchBM,
  updateBM,
  deleteBM,
  fetchClientTree,
  findClientTable,
  fetchDept,
  findPerson,
  findId,
  childadd,
  deleteChild,
  fetchProject
} from '@/services/BM';

import { queryPersonal } from '@/services/api';

export default {
  namespace: 'BM',
  state: {
    fetchData: {
      list: [],
      pagination: {},
    },
    childTable: {
      list: [],
      pagination: {},
    },
  },

  //effects方法用处理异步动作
  effects: {
    *fetch({ payload,callback }, { call, put }) {
      const response = yield call(fetchBM, payload);
      let obj = {}
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
      if (callback) callback(obj);
    },
    *fetchPerson({ payload,callback }, { call, put }) {
      const response = yield call(queryPersonal, payload);
      const { pageIndex } = payload;
      const obj = {
        list: response.resData,
        pagination:{
          total: response.total,
          current:pageIndex + 1
        }
      };
      if (callback) callback(obj);
    },
    *add({ payload,callback }, { call, put }) {
      const response = yield call(addBM, payload);
      if (callback) callback(response);
    },
    *update({ payload,callback }, { call, put }) {
      const response = yield call(updateBM, payload);
      if (callback) callback(response);
    },
    *delete({ payload,callback }, { call, put }) {
      const response = yield call(deleteBM, payload);
      if (callback) callback(response);
    },
    *findId({ payload,callback }, { call, put }) {
      const response = yield call(findId, payload);
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
    *fetchClientTree({ payload,callback }, { call, put }) {
      const response = yield call(fetchClientTree, payload);
      if (callback) callback(response.resData);
    },
    *findClientTable({ payload,callback }, { call, put }) {
      const response = yield call(findClientTable, payload);
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
    *fetchDept({ payload,callback }, { call, put }) {
      const response = yield call(fetchDept, payload);
      if(callback) callback(response.resData)
    },
    *findPerson({ payload,callback }, { call, put }) {
      const response = yield call(findPerson, payload);
      let obj = {};
      if(response.resData){
        obj = {
          list: response.resData,
          pagination:{
            total: response.total
          }
        };
      }
      if (callback) callback(obj);
    },
    *childadd({ payload,callback }, { call, put }) {
      const response = yield call(childadd, payload);
      if (callback) callback(response);
    },
    *deleteChild({ payload,callback }, { call, put }) {
      const response = yield call(deleteChild, payload);
      if (callback) callback(response);
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
  },
  //reducers方法处理同步
  reducers: {
    save(state, action) {
      return {
        ...state,
        fetchData: action.payload,
      };
    },
    find(state, action) {
      return {
        ...state,
        childTable: action.payload,
      };
    }
  },
};
