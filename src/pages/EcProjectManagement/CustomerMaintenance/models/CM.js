import {
  addCM,
  fetchCM,
  updateCM,
  deleteCM
} from '@/services/CM';

export default {
  namespace: 'CM',
  state: {
    fetchData: {
      list: [],
      pagination: {},
    },
  },

  //effects方法用处理异步动作
  effects: {
    *fetch({ payload,callback }, { call, put }) {
      const response = yield call(fetchCM, payload);
      /*const obj = {
        list: response.resData,
        pagination:{
          total: response.total
        }
      };*/
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response.resData);
    },
    *add({ payload,callback }, { call, put }) {
      const response = yield call(addCM, payload);
      if (callback) callback(response);
    },
    *update({ payload,callback }, { call, put }) {
      const response = yield call(updateCM, payload);
      if (callback) callback(response);
    },
    *delete({ payload,callback }, { call, put }) {
      const response = yield call(deleteCM, payload);
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
