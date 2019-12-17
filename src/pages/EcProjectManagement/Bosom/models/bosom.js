
import {
  fetchList,
  addBosom,
  removeBosom

} from '@/services/bosom';


export default {
  namespace: 'bosom',

  state: {
    tableData: {
      list: [],
      pagination: {},
    },
    PersonData: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *add({ payload,callback }, { call, put }) {
      const response = yield call(addBosom, payload);
      if(callback) callback(response)
    },
    *remove({ payload,callback }, { call, put }) {
      const response = yield call(removeBosom, payload);
      if(callback) callback(response)
    },
    *fetch({ payload,callback }, { call, put }) {
      const response = yield call(fetchList, payload);
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
    },

  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },

  },
};
