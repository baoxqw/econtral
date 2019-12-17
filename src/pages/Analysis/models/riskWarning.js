import { fetchRiskStatus } from '@/services/analysis';

export default {
  namespace: 'riskWarining',

  state: {
    riskStatusList: [],
  },

  effects: {
    *getRiskStatus(_, { call, put }) {
      const data = yield call(fetchRiskStatus);
      yield put({
        type: 'setRiskStatusList',
        payload: data,
      });
    },
  },

  reducers: {
    setRiskStatusList(data, { payload }) {
      return {
        ...data,
        riskList: payload,
      };
    },
  },
};
