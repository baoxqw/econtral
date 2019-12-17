import { queryRole,addmeasure,removemeasure} from '@/services/measure';

import { message } from 'antd';

export default {
  namespace: 'measure',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryRole, payload);
      const { pageIndex } = payload;
      console.log('measure列表',response)
      let obj = [];
      if(response.resData){
         obj = {
          list: response.resData,
          pagination:{
            total: response.total,
            current:pageIndex + 1
          }
        };
        yield put({
          type: 'save',
          payload: obj,
        });
      }
    },
    *add({ payload,callback}, { call, put }) {
      const response = yield call(addmeasure, payload);
      console.log('measureAdd',response)
      if(callback) callback(response)
    },
    *update({ payload,callback}, { call, put }) {
      const response = yield call(addmeasure, payload);
      if(callback) callback(response)
    },
    *remove({ payload,callback}, { call, put }) {
      const response = yield call(removemeasure, payload);
      if(callback) callback(response)
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
