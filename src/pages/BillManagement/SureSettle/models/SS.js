//财务信息
import {
  fetchSS,
  removeSS,
  findChild
} from '@/services/SS';

export default {
  namespace: 'SS',
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  //effects方法用处理异步动作
  effects: {
    *fetch({ payload,callback }, { call, put }) {
      const response = yield call(fetchSS, payload);
      let obj = {}
      if(response.resData){
         obj = {
          list:response.resData,
          pagination:{
            total: response.total
          }
        };
      }
      yield put({
        type: 'save',
        payload: obj
      });
      if (callback) callback();
    },
    *remove({ payload,callback }, { call, put }) {
      const response = yield call(removeSS, payload);
      if(callback) callback(response)
    },
    *findChild({ payload,callback }, { call, put }) {
      const response = yield call(findChild, payload);
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
        data: action.payload,
      };
    },
  },
};
