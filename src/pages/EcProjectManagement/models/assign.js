import { queryConfirm,addPlan,findPlan,updatePlan } from '@/services/project';

export default {
  namespace: 'assign',
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  //effects方法用处理异步动作
  effects: {
    *fetch({ payload,callback }, { call, put }) {
      const response = yield call(queryConfirm, payload);
      if (callback) callback(response);
    },
    *find({ payload,callback }, { call, put }) {
      const response = yield call(findPlan, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addPlan, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updatePlan, payload);
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
