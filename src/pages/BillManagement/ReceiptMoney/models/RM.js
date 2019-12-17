import { fetchRM,fetchTicket,endhandle} from '@/services/RM';

export default {
  namespace: 'RM',

  state: {
    list: [],
    manytableInvoice:{
      list:[]
    }
  },

  effects: {
    *fetch({ payload,callback }, { call, put }) {
      const response = yield call(fetchRM, payload);
      let object = {};
      if(response.resData){
        response.resData.map(item =>{
          item.key = item.id;
          item.nopay = item.paymentamount - item.accountmny;
          item.unsettlemny = item.includetaxmny - item.accountmny
          return item
        });
        object = {
          list:response.resData,
          pagination:{
            total: response.total
          }
        };

      }
      yield put({
        type: 'save',
        payload: object,
      });
      if (callback) callback(object);
    },
    *allfetch({ payload,callback }, { call, put }) {
      const response = yield call(fetchRM, payload);
      let object = {};
      if(response.resData){
        response.resData.map(item =>{
          item.key = item.id;
          item.nopay = item.paymentamount - item.accountmny;
          return item
        });
        response.resData = response.resData.filter(item =>{
          return item.isconfirm !== 1
        })
        object = {
          list:response.resData,
          pagination:{
            total: response.total
          }
        };

      }
      yield put({
        type: 'allsave',
        payload: object,
      });
      if (callback) callback(response.resData);
    },
    *ticketfetch({ payload,callback }, { call, put }) {
      const response = yield call(fetchTicket, payload);
      let object = {};
      if(response.resData){
        response.resData.map(item =>{
          item.key = item.invoiceBId;
          return item
        });
        object = {
          list:response.resData,
          pagination:{
            total: response.total
          }
        };
      }
      yield put({
        type: 'ticket',
        payload: object,
      });
      if (callback) callback(response.resData);
    },
    *allticketfetch({ payload,callback }, { call, put }) {
      const response = yield call(fetchTicket, payload);
      let objectF = {};
      if(response.resData){
        response.resData.map(item =>{
          item.key = item.invoiceBId;
          item.unsettlemny = item.includetaxmny - item.accountmny
          return item
        });
        objectF = {
          list:response.resData,
          pagination:{
            total: response.total
          }
        };

      }

      yield put({
        type: 'allticket',
        payload: objectF,
      });
      if (callback) callback(response.resData);
    },
    *endhandle({ payload,callback }, { call, put }) {
      const response = yield call(endhandle, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        tableStorage: action.payload,
      };
    },
    allsave(state, action) {
      return {
        ...state,
        manytableStorage: action.payload,
      };
    },
    ticket(state, action) {
      return {
        ...state,
        tableInvoice: action.payload,
      };
    },
    allticket(state, action) {
      return {
        ...state,
        manytableInvoice: action.payload,
      };
    },
  },
};
