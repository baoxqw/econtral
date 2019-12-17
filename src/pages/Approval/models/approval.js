import { submitApproval, fileUpload,fetchApprovalDetail,
  subresult,fetchLeaveDetail,fetchSdetail,refuseed } from '@/services/approval';
import { fetchAllUser } from '@/services/user';

export default {
  namespace: 'approval',

  state: {
    approvalPerson: [],
  },

  effects: {
    *fetchApprovalPerson(_, { call, put }) {
      const { resData } = yield call(fetchAllUser, {});
      if (!resData) return;

      yield put({
        type: 'setApprovalPerson',
        payload: resData,
      });
    },
    *submitApproval({ payload }, { call, put }) {
      const res = yield call(submitApproval, payload);
      console.log(res, 'res');
    },
    *fetchSdetail({ payload,callback }, { call, put }) {
      const res = yield call(fetchSdetail, payload);
      if (callback) callback(res);
    },
    *fetchdetail({ payload ,callback}, { call, put }) {
      const res = yield call(fetchApprovalDetail, payload);
      if (callback) callback(res);
    },
    *fetchleavedetail({ payload ,callback}, { call, put }) {
      const res = yield call(fetchLeaveDetail, payload);
      if (callback) callback(res);
    },
    *result({ payload ,callback}, { call, put }) {
      const res = yield call(subresult, payload);
      if (callback) callback(res);
    },
    *refuse({ payload ,callback}, { call, put }) {
      const res = yield call(refuseed, payload);
      console.log('拒绝',res)
      if (callback) callback(res);
    },
  },

  reducers: {
    setApprovalPerson(state, { payload }) {
      return {
        ...state,
        approvalPerson: payload,
      };
    },
  },
};
