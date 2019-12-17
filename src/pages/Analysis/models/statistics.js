import {
  fetchAreaStatistics,
  fetchProjectStageStatistics,
  fetchProjectRiskList,
  fetchFundProjectList,
  fetchNetFundList,
  fetchNetFundProjectList,
  fetchNetFundLpList,
  changeProjectPublishStatus,
  changeProjectRiskStatus,
  fetchDataMap
} from '@/services/analysis';
import { message } from 'antd';

export default {
  namespace: 'statistics',

  state: {
    fundList: [],
    areaData: [],
    projectData: [],
    projectRiskList: {
      condition: {},
      pageIndex: 0,
      pageSize: 10,
      data: [],
      total: 0,
    },
    fundProjectList: {
      data: [],
      total: 0,
    },
    netFundList: {
      data: [],
      total: 0,
    },
    netFundProjectList: {
      data: [],
      total: 0,
    },
    netFundLpList: {
      data: [],
      total: 0,
    },
  },

  effects: {
    // 获取区域统计数据
    *fetchAreaStatistics(_, { call, put }) {
      const { resData } = yield call(fetchAreaStatistics);
      if (!resData) return;

      yield put({
        type: 'setAreaStatistics',
        payload: resData,
      });
    },
    *fetchWord({payload,callback}, { call, put }) {
      const res = yield call(fetchDataMap);
      if(callback) callback(res)
    },
    // 获取项目阶段统计数据
    *fetchProjectStageStatistics(_, { call, put }) {
      const { resData } = yield call(fetchProjectStageStatistics);
      if (!resData) return;

      yield put({
        type: 'setProjectStageStatistics',
        payload: resData,
      });
    },
    // 获取项目风险统计数据
    *fetchProjectRiskList({ payload }, { call, put }) {
      const res = yield call(fetchProjectRiskList, payload);
      const { total, pageIndex, conditions, pageSize } = res;
      let { resData: data } = res;
      data = data || [];

      if (data) {
        yield put({
          type: 'setProjectRiskList',
          payload: { data, total, pageIndex, conditions, pageSize },
        });
      }
    },
    // 获取基金项目分析数据
    *fetchFundProjectList({ payload }, { call, put }) {
      const { resData: data, total } = yield call(fetchFundProjectList, payload);
      if (!data) return;

      yield put({
        type: 'setFundProjectList',
        payload: { data, total },
      });
    },
    // 获取基金净值列表
    *fetchNetFundList({ payload }, { call, put }) {
      const data = yield call(fetchNetFundList, payload);
      yield put({
        type: 'setNetFundList',
        payload: data,
      });
    },
    // 获取基金净值项目信息列表
    *fetchNetFundProjectList({ payload }, { call, put }) {
      const { resData: data, total } = yield call(fetchNetFundProjectList, payload);
      yield put({
        type: 'setNetFundProjectList',
        payload: { data, total },
      });
    },
    // 获取基金净值列表中查询基金LP列表
    *fetchNetFundLpList({ payload }, { call, put }) {
      const data = yield call(fetchNetFundLpList, payload);
      yield put({
        type: 'setNetFundLpList',
        payload: data,
      });
    },
    // 更改基金项目发布状态
    *changeProjectPublishStatus({ payload }, { call }) {
      const { publishStatus } = payload;
      yield call(changeProjectPublishStatus, payload);
      message.info(publishStatus ? '发布成功' : '已取消发布');
    },
    // 更改基金项目风险数据
    *changeProjectRiskStatus({ payload }, { call, put, select }) {
      const { key, status, projectId } = payload;
      yield call(changeProjectRiskStatus, { reqData: { key, status, projectId } });

      // 刷新风险数据
      const data = yield select(
        ({
          statistics: {
            projectRiskList: { condition, pageIndex, pageSize },
          },
        }) => ({ condition, pageIndex, pageSize })
      );
      const fetchPromise = yield put({
        type: 'fetchProjectRiskList',
        payload: data,
      });
      fetchPromise.then(() => message.info('已更改'));
    },
  },

  reducers: {
    // 设置区域统计数据
    setAreaStatistics(data, { payload: areaData }) {
      return {
        ...data,
        areaData,
      };
    },
    // 设置项目阶段统计数据
    setProjectStageStatistics(data, { payload: projectData }) {
      return { ...data, projectData };
    },
    // 设置项目风险列表
    setProjectRiskList(data, { payload: projectRiskList }) {
      return { ...data, projectRiskList };
    },
    // 设置基金项目分析列表
    setFundProjectList(data, { payload: fundProjectList }) {
      return { ...data, fundProjectList };
    },
    // 设置基金净值项目列表
    setNetFundProjectList(data, { payload: netFundProjectList }) {
      return { ...data, netFundProjectList };
    },
    // 设置基金净值列表
    setNetFundList(data, { payload: netFundList }) {
      return { ...data, netFundList };
    },
    // 设置基金净值lP列表
    setNetFundLpList(data, { payload: netFundLpList }) {
      return { ...data, netFundLpList };
    },
    // 设置基金项目风险状态
    setProjectRisk(
      data,
      {
        payload: { index, key, status },
      }
    ) {
      const { projectRiskList } = data;
      const updatedList = {
        ...projectRiskList,
        data: [
          ...projectRiskList.data.slice(0, index),
          { ...projectRiskList.data[index], [key]: status },
          ...projectRiskList.data.slice(index + 1),
        ],
      };

      return { ...data, projectRiskList: updatedList };
    },
  },
};
