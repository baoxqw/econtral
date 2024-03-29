import { finanQuery,submitapply } from '@/services/finan';

export default {
  namespace: 'finan',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload,callback }, { call, put }) {
      const response = yield call(finanQuery, payload);
      if (callback) callback(response.resData);
    },
    *submitApproval({ payload,callback }, { call, put }) {
      const response = yield call(submitapply, payload);
      if (callback) callback(response);
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
