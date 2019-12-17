import { queryMatemanage,getRole, newdata,matype,maunit,submitData,
  removeDM,findnewdataDapart,fetchUcum,addMatemanage,deleteMatemanage
   } from '@/services/matemanage';

export default {
  namespace: 'matemanage',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryMatemanage, payload);
      console.log('表格列表：',response)
      const { pageIndex } = payload;
      let obj = [];
      if(response.resData){
        obj = {
          list: response.resData,
          pagination:{
            total: response.total,
            current:pageIndex + 1
          }
        };
        if(obj.list[0] === null){
          obj.list[0] = {}
        }
      }
      yield put({
        type: 'save',
        payload: obj,
      });
    },
    *fetchUcum({ payload,callback }, { call, put }) {
      const response = yield call(fetchUcum, payload);
      console.log("res",response)
      let obj = {};
      if(response.resData){
        obj = {
          list: response.resData,
          pagination:{
            total: response.total
          }
        };
      }
     if(callback) callback(obj)
    },
    *add({ payload,callback }, { call, put }) {
      const response = yield call(addMatemanage, payload);
      console.log("新增",response)
      if (callback) callback(response);
    },
    *delete({ payload,callback }, { call, put }) {
      const response = yield call(deleteMatemanage, payload);
      if (callback) callback(response);
    },
    *newdata({ payload,callback }, { call, put }) {
      const response = yield call(newdata, payload);
      if (callback) callback(response);
    },
    *matype({ payload,callback }, { call, put }) {
      const response = yield call(matype, payload);
      if (callback) callback(response);
    },
    *maunit({ payload,callback }, { call, put }) {
      const response = yield call(maunit, payload);
      if (callback) callback(response);
    },
    *submit({ payload,callback }, { call, put }) {
      const response = yield call(submitData, payload);
      if (callback) callback(response);
    },
    *findnewdata({ payload,callback }, { call, put }) {
      const response = yield call(findnewdataDapart, payload);
      if (callback) callback(response);
    },
    *get({ payload, callback }, { call, put }) {
      const response = yield call(getRole, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *removeDM({ payload, callback }, { call, put }) {
      const response = yield call(removeDM, payload);
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
