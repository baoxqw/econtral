
import {
  fetchPro,
  proAdd,
  fetchProjectNode,
  fetchTree,
  newdataList,
  fetchPerson,
  fetchDept,
  fetchPersonList
  ,fetchMerchant,
  findMerchant,
  fetchContract
} from '@/services/pd';


export default {
  namespace: 'pau',

  state: {
    tableData: {
      list: [],
      pagination: {},
    },
    PersonData: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetchTree({ payload,callback }, { call, put }) {
      const response = yield call(fetchTree, payload);
      if(callback) callback(response.resData)
    },
    *fetchProjectNode({ payload,callback }, { call, put }) {
      const response = yield call(fetchProjectNode, payload);
      console.log('项目models:',response)
      if(callback) callback(response)
    },
    *fetchPro({ payload,callback }, { call, put }) {
      const response = yield call(fetchPro, payload);
      if(!response.resData){
        response.resData = []
      }
      if(callback) callback(response)
    },
    *proAdd({ payload,callback }, { call, put }) {
      const response = yield call(proAdd, payload);
      if(callback) callback(response)
    },
    *fetchPerson({ payload,callback }, { call, put }) {
      const response = yield call(fetchPerson, payload);
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
      }
      if(callback) callback(obj)
    },
    *fetchPersonList({ payload,callback }, { call, put }) {
      const response = yield call(fetchPersonList, payload);
      if(callback) callback(response.resData)
    },
    *fetchDept({ payload,callback }, { call, put }) {
      const response = yield call(fetchDept, payload);
      if(callback) callback(response.resData)
    },
    *fetch({ payload,callback }, { call, put }) {
      const response = yield call(newdataList, payload);
      console.log('根据id查询列表：',response)
      if(response.resData){
        const obj = {
          list: response.resData,
          pagination:{
            total: response.total
          }
        };
        yield put({
          type: 'save',
          payload: obj,
        });
      }else{
        yield put({
          type: 'save',
          payload: [],
        });
      }
    },
    *fetchMerchant({ payload,callback }, { call, put }) {
      const response = yield call(fetchMerchant, payload);
      if(callback) callback(response.resData)
    },
    *findMerchant({ payload,callback }, { call, put }) {
      const response = yield call(findMerchant, payload);
      if(response.resData) {
        const obj = {
          list: response.resData,
          pagination: {
            total: response.total
          }
        };
        if(callback) callback(obj)
      }
    },
    *fetchContract({ payload,callback }, { call, put }) {
      const response = yield call(fetchContract, payload);
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
      }
      if(callback) callback(obj)
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        tableData: action.payload,
      };
    },
    fp(state, action) {
      return {
        ...state,
        PersonData: action.payload,
      };
    },
  },
};
