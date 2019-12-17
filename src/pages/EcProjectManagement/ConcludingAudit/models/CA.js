import {
  addMR,
  fetchCA,
  checkMM,
  result,
  checkstatus,
  subrefuse,
} from '@/services/CA';

export default {
  namespace: 'CA',
  state: {
    fetchData: {
      list: [],
      pagination: {},
    },
  },

  //effects方法用处理异步动作
  effects: {
    *fetch({ payload,callback }, { call, put }) {
      const response = yield call(fetchCA, payload);
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
      yield put({
        type: 'save',
        payload: obj,
      });
      if (callback) callback(response.resData);
    },
    *add({ payload,callback }, { call, put }) {
      const response = yield call(addMR, payload);
      if (callback) callback();
    },
    *result({ payload,callback }, { call, put }) {
      const response = yield call(result, payload);
      if (callback) callback(response);
    },
    *subrefuse({ payload,callback }, { call, put }) {
      const response = yield call(subrefuse, payload);
      if (callback) callback(response);
    },
    *checkstatus({ payload,callback }, { call, put }) {
      const response = yield call(checkstatus, payload);
      if (callback) callback(response);
    },
    *check({ payload,callback }, { call, put }) {
      const response = yield call(checkMM, payload);
      const object = {
        reqData:{
          pageIndex:0,
          pageSize:10
        }
      }
      yield put({
        type: 'fetch',
        payload: object,
      });
      if (callback) callback(response);
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
