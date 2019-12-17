
import { queryVote ,resultVote,updateongoingProjectinfor} from '@/services/api';

export default {
  namespace: 'vo',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload,callback }, { call, put }) {
      const response = yield call(queryVote, payload);
      console.log('sssss',response)
      yield put({
        type:'save',
        payload:response.resData[0]
      });
      if (callback) callback(response.resData[0]);
    },
    //根据id查询概要信息
    *fetchDetail({ payload,callback }, { call, put }) {
      const response = yield call(updateongoingProjectinfor, payload);
      if (callback) callback(response.resData);
    },
    *result({ payload,callback }, { call, put }) {
      const response = yield call(resultVote, payload);
      if(response.errMsg === '成功'){
        if (callback) callback();
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload.projectDetail,
        finance:action.payload.projectFinanceList,
        projectShareholderList:action.payload.projectShareholderList,
        projectHistoryList:action.payload.projectHistoryList,
        projectLicenseList:action.payload.projectLicenseList,
        projectDistributionList:action.payload.projectDistributionList,
        projectTeamList:action.payload.projectTeamList,
        investplan:action.payload.investplan
      };
    },
  },
};
