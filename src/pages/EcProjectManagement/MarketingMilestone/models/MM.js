import {
  addMR,
  fetchMM,
  checkMM,
  refuse,
  detailcheck,
} from '@/services/MM';

export default {
  namespace: 'MM',
  state: {
    fetchData: {
      list: [],
      pagination: {},
    },
  },

  //effects方法用处理异步动作
  effects: {
    *fetch({ payload,callback }, { call, put }) {
      const response = yield call(fetchMM, payload);
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
      if (callback) callback(response);
    },
    *detailcheck({ payload,callback }, { call, put }) {
      const response = yield call(detailcheck, payload);
      if (callback) callback(response.resData);
    },
    *add({ payload,callback }, { call, put }) {
      const response = yield call(addMR, payload);
      if (callback) callback();
    },
    *check({ payload,callback }, { call, put }) {
      const response = yield call(checkMM, payload);
      if (callback) callback(response);
    },
    *refuse({ payload,callback }, { call, put }) {
      const response = yield call(refuse, payload);
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
