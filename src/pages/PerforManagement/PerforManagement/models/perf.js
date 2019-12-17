//股东信息
import {
  fetchList,
  fetchChild,
} from '@/services/perf';

export default {
  namespace: 'perf',
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  //effects方法用处理异步动作
  effects: {
    *fetch({ payload,callback }, { call, put }) {
      const response = yield call(fetchList, payload);
      let obj = {}
      console.log('response',response)
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
        payload: obj
      });
      if (callback) callback(obj);
    },
    *fetchChild({ payload,callback }, { call, put }) {
      const response = yield call(fetchChild, payload);
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

  },
};
