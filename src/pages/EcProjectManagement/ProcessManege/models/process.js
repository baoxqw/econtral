import {
  addMR,
  fetchpProcess,
  removeProcess,
  fetchpHistoryProcess,
  fetchBosom,
  updateProcess,
  addProject,
  hismarketFetch,
  addMarketProject,
  endApplication,
  fetchPro,
  endhandle,
  endhandleSub,
  endhandleMarket,
  newProject,
} from '@/services/process';

export default {
  namespace: 'process',
  state: {
    fetchData: {
      list: [],
      pagination: {},
    },
  },

  //effects方法用处理异步动作
  effects: {
    *fetch({ payload,callback }, { call, put }) {
      const response = yield call(fetchpProcess, payload);
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
      if (callback) callback();
    },
    *historyfetch({ payload,callback }, { call, put }) {
      const response = yield call(fetchpHistoryProcess, payload);
     let obj = {}
      if(response.resData){
          obj = {
           list: response.resData,
           pagination:{
             total: response.total
           }
         };
        yield put({
          type: 'history',
          payload: obj,
        });
      }

      if (callback) callback();
    },
    *bosomfetch({ payload,callback }, { call, put }) {
      const response = yield call(fetchBosom, payload);
     /* if(response.resData){
        const obj = {
          list: response.resData,
          pagination:{
            total: response.total
          }
        };
        yield put({
          type: 'bosom',
          payload: obj,
        });
      }*/

      if (callback) callback(response.resData);
    },
    *hismarketFetch({ payload,callback }, { call, put }) {
      const response = yield call(hismarketFetch, payload);
      const obj = {
        list: response.list,
        pagination:{
          total: response.pagination.total
        }
      };
      yield put({
        type: 'hismarket',
        payload: obj,
      });
      if (callback) callback();
    },
    *fetchPro({ payload,callback }, { call, put }) {
      const response = yield call(fetchPro, payload);
      console.log('里程碑节点response：',response)
      if(callback) callback(response.resData)
    },
    *endhandle({ payload,callback }, { call, put }) {
      const response = yield call(endhandle, payload);
      if(callback) callback(response)
    },
    *endhandleMarket({ payload,callback }, { call, put }) {
      const response = yield call(endhandleMarket, payload);
      if(callback) callback(response)
    },
    *endhandleSub({ payload,callback }, { call, put }) {
      const response = yield call(endhandleSub, payload);
      if(callback) callback(response)
    },
    *updateProcess({ payload,callback }, { call, put }) {
      const response = yield call(updateProcess, payload);
      let obj = {
        reqData:{
         pageSize:10,
          pageIndex:0
        }
      };
      yield put({
        type: 'fetch',
        payload: obj,
      });
      if (callback) callback(response);
    },
    *add({ payload,callback }, { call, put }) {
      const response = yield call(addMR, payload);
      if (callback) callback();
    },
    *newProject({ payload,callback }, { call, put }) {
      const response = yield call(newProject, payload);
      if (callback) callback(response.resData);
    },
    *addProject({ payload,callback }, { call, put }) {
      const response = yield call(addProject, payload);
      if (callback) callback(response);
    },
    *addMarket({ payload,callback }, { call, put }) {
      const response = yield call(addProject, payload);
      if (callback) callback(response);
    },
    *addMarketProject({ payload,callback }, { call, put }) {
      const response = yield call(addMarketProject, payload);
      if (callback) callback();
    },
    *endApplication({ payload,callback }, { call, put }) {
      const response = yield call(endApplication, payload);

      if (callback) callback(response);
    },
    *remove({ payload,callback }, { call, put }) {
      const response = yield call(removeProcess, payload);
      const object = {
        reqData:{
          pageIndex:0,
          pageSize:10
        }
      }
      yield put({
        type: 'fetch',
        payload: object,
      });
      if (callback) callback();
    },
  },
  //reducers方法处理同步
  reducers: {
    save(state, action) {
      return {
        ...state,
        fetchData: action.payload,
      };
    },
    history(state, action) {
      return {
        ...state,
        historyData: action.payload,
      };
    },
    bosom(state, action) {
      return {
        ...state,
        bosomData: action.payload,
      };
    },
    hismarket(state, action) {
      return {
        ...state,
        hismarketData: action.payload,
      };
    },

  },
};
