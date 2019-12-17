import { queryIcm,evenIcm,newqueryIcm,assignIcm,icmupdateIcm,icmupdateIcmNoFile } from '@/services/api';

export default {
  namespace: 'icm',
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  //effects方法用处理异步动作
  effects: {
    *fetch({ payload,callback }, { call, put }) {
      const response = yield call(newqueryIcm, payload);
      if(response.resData){
        yield put({
          type: 'save',
          payload: response.resData[0],
        });
        if (callback) callback(response.resData);
      }
    },
    *newfetch({ payload,callback }, { call, put }) {
      const response = yield call(newqueryIcm, payload);
      yield put({
        type: 'nnn',
        payload: response.resData,
      });
      if (callback) callback(response.resData);
    },
    *assign({ payload,callback }, { call, put }) {
      const response = yield call(assignIcm, payload);
      /*const obj ={
        list:response.resData
      };
      yield put({
        type: 'aaa',
        payload: obj,
      });*/

      if (callback) callback(response.resData);
    },
    *even({ payload, callback }, { call, put }) {
      const response = yield call(evenIcm, payload);
      if (callback) callback(response.resData[0]);
    },
    *icmupdate({ payload,callback }, { call, put }) {
      const response = yield call(icmupdateIcm, payload);
      console.log('投决会返回响应：');
      console.log(response)
      if (callback) callback();
    },
    *icmupdatenofile({ payload,callback }, { call, put }) {
      const response = yield call(icmupdateIcmNoFile, payload);
      console.log('投决会没有文件返回响应：');
      console.log(response)
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
    nnn(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
