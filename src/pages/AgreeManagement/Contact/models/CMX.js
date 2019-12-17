import {
  addCMX,
  fetchCMX,
  removeCMX,
  updateCMX,
  deleteCMX,
  fetchClientTree,
  findClientTable,
  fetchDept,
  findPerson,
  findId,
  childadd,
  deleteChild,
  fetchProject,
  fetchTree,
  fetchPerson,
  uploadList,
  fileList,
  subapprove,
  historyCMX,
  historyDetailsCMX
} from '@/services/CMX';


export default {
  namespace: 'CMX',
  state: {
    fetchData: {
      list: [],
      pagination: {},
    },
    childTable: {
      list: [],
      pagination: {},
    },
    historyList: {
      list: [],
      pagination: {},
    },
  },

  //effects方法用处理异步动作
  effects: {
    *fetch({ payload,callback }, { call, put }) {
      const response = yield call(fetchCMX, payload);
      console.log("response",response)
      const { pageIndex } = payload;
      const obj = {
        list: response.resData,
        pagination:{
          total: response.total,
          current:pageIndex + 1
        }
      };
      yield put({
        type: 'save',
        payload: obj,
      });
      if (callback) callback(obj);
    },
    *add({ payload,callback }, { call, put }) {
      const response = yield call(addCMX, payload)
      if (callback) callback(response);
    },
    *uploadList({ payload,callback }, { call, put }) {
      const response = yield call(uploadList, payload);
      if (callback) callback(response);
    },
    *fileList({ payload,callback }, { call, put }) {
      const response = yield call(fileList, payload);
      if(response.resData){
        response.resData.map(item =>{
          item.key = item.id;
          item.uid = item.id;
          //https://www.leapingtech.net/nien-0.0.1-SNAPSHOT
          item.url = 'https://www.leapingtech.net/nien-0.0.1-SNAPSHOT'+item.path+'/'+item.name;
          item.thumbUrl = 'https://www.leapingtech.net/nien-0.0.1-SNAPSHOT'+item.path+'/'+item.name;
          return item
        });
        if (callback) callback(response.resData);
      }
    },
    *update({ payload,callback }, { call, put }) {
      const response = yield call(updateCMX, payload);
      if (callback) callback(response);
    },
    *delete({ payload,callback }, { call, put }) {
      const response = yield call(deleteCMX, payload);
      console.log('删除结果：',response)
      if (callback) callback(response);
    },

    *remove({ payload,callback }, { call, put }) {
      const response = yield call(removeCMX, payload);
      console.log('删除结果：',response)
      if (callback) callback(response);
    },
    *findId({ payload,callback }, { call, put }) {
      const response = yield call(findId, payload);
      let obj = {};
      if(response.resData){
        obj = {
          list: response.resData,
          pagination:{
            total: response.total
          }
        };
        yield put({
          type: 'savechild',
          payload: obj,
        });
      }
      if (callback) callback(obj);
    },
    *fetchClientTree({ payload,callback }, { call, put }) {
      const response = yield call(fetchClientTree, payload);
      if (callback) callback(response.resData);
    },
    *findClientTable({ payload,callback }, { call, put }) {
      const response = yield call(findClientTable, payload);
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
      if (callback) callback(obj);
    },
    *fetchDept({ payload,callback }, { call, put }) {
      const response = yield call(fetchDept, payload);
      if(callback) callback(response.resData)
    },
    *findPerson({ payload,callback }, { call, put }) {
      const response = yield call(findPerson, payload);
      let obj = {};
      if(response.resData){
        obj = {
          list: response.resData,
          pagination:{
            total: response.total
          }
        };
      }
      if (callback) callback(obj);
    },
    *subapprove({ payload,callback }, { call, put }) {
      const response = yield call(subapprove, payload);
      if (callback) callback(response);
    },
    *deleteChild({ payload,callback }, { call, put }) {
      const response = yield call(deleteChild, payload);
      if (callback) callback(response);
    },
    *fetchProject({ payload,callback }, { call, put }) {
      const response = yield call(fetchProject, payload);
      let obj = {};
      if(response.resData){
        obj = {
          list: response.resData,
          pagination:{
            total: response.total
          }
        };
      }
      if (callback) callback(obj);
    },
    *fetchTree({ payload,callback }, { call, put }) {
      const response = yield call(fetchTree, payload);
      if (callback) callback(response.resData);
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
    //合同基本
    *childadd({ payload,callback }, { call, put }) {
      const response = yield call(childadd, payload);
      if (callback) callback(response);
    },
    //变更历史
    *history({ payload,callback }, { call, put }) {
      const response = yield call(historyCMX, payload);
      let obj = {};
      if(response.resData){
        obj = {
          list: response.resData,
          pagination:{
            total: response.total
          }
        };
      }
      yield put({
        type: 'hst',
        payload: obj,
      });
      //if (callback) callback(response);
    },
    *historyDetails({ payload,callback }, { call, put }) {
      const response = yield call(historyDetailsCMX, payload);
      let obj = {};
      if(response.resData){
        obj = {
          list: response.resData,
          pagination:{
            total: response.total
          }
        };
      }
      if (callback) callback(obj);
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
    find(state, action) {
      return {
        ...state,
        childTable: action.payload,
      };
    },
    savechild(state, action) {
      return {
        ...state,
        newChild: action.payload,
      };
    },
    hst(state, action) {
      return {
        ...state,
        historyList: action.payload,
      };
    },
  },
};
