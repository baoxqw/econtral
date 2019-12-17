import { queryPlan,addDesc,findPlan,updatePlan } from '@/services/api';

export default {
  namespace: 'desci',
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  //effects方法用处理异步动作
  effects: {
    *fetch({ payload,callback }, { call, put }) {
      const response = yield call(queryPlan, payload);
      console.log("resss:",response);
      if (callback) callback(response.resData);
    },
    *find({ payload,callback }, { call, put }) {
      const response = yield call(findPlan, payload);
      if (callback) callback(response.resData);
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addDesc, payload);
      console.log('确认投资计划：');
      console.log(response);
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updatePlan, payload);
      console.log("回调",response)
      /*yield put({
        type: 'save',
        payload: response,
      });*/
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
    },
  },
};
