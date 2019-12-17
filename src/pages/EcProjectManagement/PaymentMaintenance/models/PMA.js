import {
  addPMA,
  fetchPMA,
  deletePMA,
  updatePMA,
  fetchProject,
  fetchTree,
  fetchPerson
} from '@/services/PMA';

export default {
  namespace: 'PMA',
  state: {
    fetchData: {
      list: [],
      pagination: {},
    },
  },

  //effects方法用处理异步动作
  effects: {
    *fetch({ payload,callback }, { call, put }) {
      const response = yield call(fetchPMA, payload);
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
      yield put({
        type: 'save',
        payload: obj,
      });
      if (callback) callback(response.resData);
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
    *add({ payload,callback }, { call, put }) {
      const response = yield call(addPMA, payload);
      if (callback) callback(response);
    },
    *update({ payload,callback }, { call, put }) {
      const response = yield call(updatePMA, payload);
      if (callback) callback(response);
    },
    *delete({ payload,callback }, { call, put }) {
      const response = yield call(deletePMA, payload);
      if (callback) callback(response);
    },
    *fetchTree({ payload,callback }, { call, put }) {
      const response = yield call(fetchTree, payload);
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
