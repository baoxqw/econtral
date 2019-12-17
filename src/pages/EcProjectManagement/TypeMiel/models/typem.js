import {
  approvalAdd,
  fetchpApproval,
  removeApproval,
  fetchProjectNode,
  fetchMarketNode,
  proAddModleArray,
  proAdd,
  addModleData,
  fetchModle,
  proAddModleData,
  endHandle,
  fetchChildModle,
  deleteNode,
  deleteProTop,
  deleteAddModleArray,
} from '@/services/papproval';

export default {
  namespace: 'typem',
  state: {
    fetchData: {
      list: [],
      pagination: {},
    },
  },

  //effects方法用处理异步动作
  effects: {
    *fetch({ payload,callback }, { call, put }) {
      const response = yield call(fetchpApproval, payload);
      let obj = {}
      if(response.resData){
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
      if (callback) callback();
    },
    *fetchProjectNode({ payload,callback }, { call, put }) {
      const response = yield call(fetchProjectNode, payload);
      console.log('节点：',response)
      let obj = {}
      if(response.resData){
        response.resData.map(item=>{
          item.key = item.id
          return item
        })
        obj = {
          list: response.resData,
          pagination:{
            total: response.total
          }
        }
      }
      yield put({
        type: 'prosave',
        payload: obj,
      });
      if(callback) callback(response)
    },
    *fetchNodeData({ payload,callback }, { call, put }) {
      yield put({
        type: 'prosave',
        payload: {
          list:payload
        },
      });
    },
    *fetchMarketNode({ payload,callback }, { call, put }) {
      const response = yield call(fetchMarketNode, payload);
      let obj ={}
      if(response.resData){
        obj = {
          list: response.resData,
          pagination:{
            total: response.total
          }
        }
      }

      yield put({
        type: 'marsave',
        payload: obj,
      });
      if(callback) callback(response)
    },
    *proAdd({ payload,callback }, { call, put }) {
      const response = yield call(proAdd, payload);
      console.log('里程碑：',response)
      if(callback) callback(response)
    },
    *proAddModleData({ payload,callback }, { call, put }) {
      const response = yield call(proAddModleData, payload);
      if(callback) callback(response)
    },
    *deleteProTop({ payload,callback }, { call, put }) {
      const response = yield call(deleteProTop, payload);
      if(callback) callback(response)
    },
    *fetchModle({ payload,callback }, { call, put }) {
      const response = yield call(fetchModle, payload);
      let object = []
      if(response.resData){
        object = response.resData
      }
      if(callback) callback(object)
    },
    *fetchChildModle({ payload,callback }, { call, put }) {
      const response = yield call(fetchChildModle, payload);
      let obj = []
      if(response.resData){
        obj = response.resData
      }
      if(callback) callback(obj)

    },
    *proAddModleArray({ payload,callback }, { call, put }) {
      const response = yield call(proAddModleArray, payload);
      if(callback) callback(response)
    },
    *addModleData({ payload,callback }, { call, put }) {
      const response = yield call(addModleData, payload);
      if(callback) callback(response)
    },
    *deleteAddModleArray({ payload,callback }, { call, put }) {
      const response = yield call(deleteAddModleArray, payload);
      if(callback) callback(response)
    },
    *endhandle({ payload,callback }, { call, put }) {
      const response = yield call(endHandle, payload);
      if(callback) callback(response)
    },
    *deleteNode({ payload,callback }, { call, put }) {
      const response = yield call(deleteNode, payload);
      if(callback) callback(response)
    },
    *deleteNodeMarket({ payload,callback }, { call, put }) {
      const response = yield call(deleteNode, payload);
      if(callback) callback(response)
    },
    *approvalAdd({ payload,callback }, { call, put }) {
      const response = yield call(approvalAdd, payload);
      const a = {
        reqData:{
          pageIndex:0,
          pageSize:10
        }
      }
      yield put({
        type:'fetch',
        payload:a,
      })
      if (callback) callback(response);
    },
    *remove({ payload,callback }, { call, put }) {
      const response = yield call(removeApproval, payload);
      if(response){
        yield put({
          type: 'fetch',
          payload: {
            reqData:{
              pageIndex:0,
              pageSize:10
            }
          },
        });
      }


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
    prosave(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    marsave(state, action) {
      return {
        ...state,
        mardata: action.payload,
      };
    },
  },

};
