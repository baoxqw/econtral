import {
  addMR,
  fetchpNetfund,
  removeReview,
  reviewUpdate,
} from '@/services/netFund';

export default {
  namespace: 'netFund',
  state: {
    fetchData: {
      list: [],
      pagination: {},
    },
  },

  //effects方法用处理异步动作
  effects: {
    *fetch({ payload,callback }, { call, put }) {
      const response = yield call(fetchpNetfund, payload);
      const obj = {
        list: response.list,
        pagination:{
          total: response.total
        }
      };
      yield put({
        type: 'save',
        payload: obj,
      });
      if (callback) callback();
    },
    *add({ payload,callback }, { call, put }) {
      const response = yield call(addMR, payload);
      if (callback) callback();
    },
    *update({ payload,callback }, { call, put }) {
      const response = yield call(reviewUpdate, payload);
      if (callback) callback(response);
    },
    *remove({ payload,callback }, { call, put }) {
      const response = yield call(removeReview, payload);
      console.log('删除之后的数据：',response)
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
      if (callback) callback();
    },
  },
  //reducers方法处理同步
  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    }
  },
};
