import {
  addMR,
  fetchpReview,
  removeReview,
  reviewUpdate,
  detailcheck,
  subresult,
  subrefuse,
} from '@/services/review';

export default {
  namespace: 'review',
  state: {
    fetchData: {
      list: [],
      pagination: {},
    },
  },

  //effects方法用处理异步动作
  effects: {
    *fetch({ payload,callback }, { call, put }) {
      const response = yield call(fetchpReview, payload);
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
    *detailcheck({ payload,callback }, { call, put }) {
      const response = yield call(detailcheck, payload);
      if (callback) callback(response);
    },
    *result({ payload ,callback}, { call, put }) {
      const res = yield call(subresult, payload);
      if (callback) callback(res);
    },
    *refuse({ payload ,callback}, { call, put }) {
      const res = yield call(subrefuse, payload);
      if (callback) callback(res);
    },
    *remove({ payload,callback }, { call, put }) {
      const response = yield call(removeReview, payload);
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
        fetchData: action.payload,
      };
    }
  },
};
