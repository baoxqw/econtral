import {
  queryMaterial,
  addMaterial,
  deleteMaterial
} from '@/services/material';

export default {
  namespace: 'material',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload,callback }, { call, put }) {
      const response = yield call(queryMaterial, payload);
      console.log("response",response)
      if(callback) callback(response)
    },
    *add({ payload,callback }, { call, put }) {
      const response = yield call(addMaterial, payload);
      console.log("提交",response)
      if(callback) callback(response)
    },
    *delete({ payload,callback }, { call, put }) {
      const response = yield call(deleteMaterial, payload);
      console.log("删除",response)
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
    show(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
