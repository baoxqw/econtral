import {
  addRW,
  fetchRW,
  fetchChild,
} from '@/services/RW';

export default {
  namespace: 'RW',
  state: {
    fetchData: {
      list: [],
      pagination: {},
    },
  },

  //effects方法用处理异步动作
  effects: {
    *fetch({ payload,callback }, { call, put }) {
      const response = yield call(fetchRW, payload);
      let obj = {}
      if(response.resData){
        response.resData.map((item)=>{
          item.key = item.id
          item.nopay = item.includetaxmny - item.accountmny
          return item
        })
         obj = {
            list: response.resData,
            pagination:{
              total: response.total
            }
          };
      }

      yield put({
        type: 'save',
        payload: obj,
      });
      if (callback) callback(obj);
    },
    *add({ payload,callback }, { call, put }) {
      const response = yield call(addRW, payload);
      if (callback) callback();
    },
    *fetchChild({ payload,callback }, { call, put }) {
      const response = yield call(fetchChild, payload);
      if (callback) callback(response);
    },
  },
  //reducers方法处理同步
  reducers: {
    save(state, action) {
      return {
        ...state,
        fetchData: action.payload,
      };
    }
  },
};
