import {
  addMR,
  fetchpReview,
  removeReview,
  reviewUpdate,
  detailcheck,
  subresult,
  subrefuse,
  fileList
} from '@/services/AG';
import { fetchCMX, findId } from '@/services/CMX';

export default {
  namespace: 'AG',
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
      const obj = {
        list: response.resData,
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
    *fetchTable({ payload,callback }, { call, put }) {
      const response = yield call(fetchCMX, payload);
      if (callback) callback(response);
    },
    *fetchChild({ payload,callback }, { call, put }) {
      const response = yield call(findId, payload);
      if (callback) callback(response);
    },
    *fileList({ payload,callback }, { call, put }) {
      const response = yield call(fileList, payload);
      if(response.resData){
        response.resData.map(item =>{
          item.key = item.id;
          item.uid = item.id;
          item.url = 'https://www.leapingtech.net/nien-0.0.1-SNAPSHOT'+item.path+'/'+item.name;
          item.thumbUrl = 'https://www.leapingtech.net/nien-0.0.1-SNAPSHOT'+item.path+'/'+item.name;
          return item
        });
        if (callback) callback(response.resData);
      }
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
