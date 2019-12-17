
import {
  matype,
  queryMatemanage,
  topadd,
  childAdd,
  toplist,
  childList,
  topDelete,
  childAdds,
  queryPId
} from '@/services/paneed';


export default {
  namespace: 'paneed',

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
    *topadd({ payload,callback }, { call, put }) {
      const response = yield call(topadd, payload);
      if(callback) callback(response)
    },
    *childAdds({ payload,callback }, { call, put }) {
      const response = yield call(childAdds, payload);
      console.log("response",response)
      if(callback) callback(response)
    },
    *childAdd({ payload,callback }, { call, put }) {
      const response = yield call(childAdd, payload);
      if(callback) callback(response)
    },
    *topDelete({ payload,callback }, { call, put }) {
      const response = yield call(topDelete, payload);
      if(callback) callback(response)
    },
    *childDelete({ payload,callback }, { call, put }) {
      const response = yield call(childDelete, payload);
      console.log('删除结果',response)
      if(callback) callback(response)
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
    *toplist({ payload,callback }, { call, put }) {
      const response = yield call(toplist, payload);
      console.log("表头",response)
      let obj = {
        list:[]
      }
      if(response.resData && response.resData.length){
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
      if(callback) callback(obj)
    },
    *queryPId({ payload,callback }, { call, put }) {
      const response = yield call(queryPId, payload);
      console.log("表头222",response)
      if(callback) callback(response)
    },
    *childList({ payload,callback }, { call, put }) {
      const response = yield call(childList, payload);
      console.log("表体",response)
      if(response.resData){
        response.resData.map((item,index) =>{
          item.key = item.id + '' + index + 'key'
          return item
        })
      }
      if(callback) callback(response)
    },
    *matype({ payload,callback}, { call, put }) {
      const response = yield call(matype, payload);
      if(callback) callback(response)

    },
    *fetchMata({ payload,callback }, { call, put }) {
      const response = yield call(queryMatemanage, payload);
      let obj = {};
      if(response.resData){
        obj = {
          list: response.resData,
          pagination:{
            total: response.total
          }
        };
        if(obj.list[0] === null){
          obj.list[0] = {}
        }
      }
      if(callback) callback(obj)
    },

  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    childsave(state, action) {
      return {
        ...state,
        childdata: action.payload,
      };
    },

  },
};
