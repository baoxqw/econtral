import React, { PureComponent } from 'react';
import { Chart, View, Geom, Label, Tooltip, Axis, Legend } from 'bizcharts';
import DataSet from '@antv/data-set';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Card,Tabs  } from 'antd';
import { connect } from 'dva';
import mapData from './mapData.json';

import wordMap from './wordmap.json';

const TabPane = Tabs.TabPane;

const AreaChart = ({ data }) => {
  const geoDv = new DataSet.View().source(mapData, {
    type: 'GeoJSON',
  });
  const scale = {
    latitude: {
      sync: true,
      nice: false,
    },
    longitude: {
      sync: true,
      nice: false,
    },
  };
  const queryProvince = province => {
    const reg = new RegExp(province);
    return data.find(item => reg.test(item.province));
  };

  return (
    <Chart height={window.innerHeight} scale={scale} forceFit padding={0}>
      {/* // geo view */}
      <Tooltip />
      <View data={geoDv}>
        <Geom
          tooltip={[
            'name',
            val => {
              const queryResult = queryProvince(val);
              return {
                title: formatMessage({ id: 'validation.numberofitems' }),
                name: val,
                value: queryResult ? queryResult.projectCount : 0,
              };
            },
          ]}
          type="polygon"
          position="longitude*latitude"
          style={{
            lineWidth: 2,
            stroke: '#e4e4e4',
          }}
          color={[
            'name',
            val => {
              const queryResult = queryProvince(val);
              if (!data || !queryResult) return '#fff';

              // 项目数量颜色块
              const HOT_COLOR = 'rgb(179,78,76)';
              const NORMAL_COLOR = 'rgb(227, 197, 157)';
              const HOT_NUM = 20;

              return queryResult.projectCount > HOT_NUM ? HOT_COLOR : NORMAL_COLOR;
            },
          ]}
        >
          <Label
            content="name"
            textStyle={{
              fill: '#000',
            }}
          />
        </Geom>
      </View>
    </Chart>
  );
};

const WordChart = ({data}) => {
  console.log("data",data)
  const geoDv = new DataSet.View().source(wordMap, {
    type: 'GeoJSON',
  });
  const scale = {
    longitude: {
      sync: true
    },
    latitude: {
      sync: true
    }
  };
  const queryProvince = province => {
    return data.find(item => item.country === province);
  };
  return (
    <Chart scale={scale} height={window.innerHeight} forceFit padding={0}>
      <Tooltip />
      <View data={geoDv}>
        <Geom type="polygon"
              data={geoDv}
              position="longitude*latitude"
              style={{
                fill: '#fff',
                stroke: '#ccc',
                lineWidth: 1
              }}
              tooltip={[
                'name',
                val => {
                  const queryResult = queryProvince(val);
                  return {
                    title: formatMessage({ id: 'validation.numberofitems' }),
                    name: val,
                    value: queryResult ? queryResult.projectCount : 0,
                  };
                },
              ]}
              color={[
                'name',
                val => {
                  const queryResult = queryProvince(val);
                  if (!data || !queryResult) return '#fff';

                  // 项目数量颜色块
                  const HOT_COLOR = 'rgb(179,78,76)';
                  const NORMAL_COLOR = 'rgb(227, 197, 157)';
                  const HOT_NUM = 20;

                  return queryResult.projectCount > HOT_NUM ? HOT_COLOR : NORMAL_COLOR;
                },
              ]}
        >
        </Geom>
      </View>
    </Chart>
  )
}



@connect(({ statistics: { areaData } }) => ({
  areaData,
}))
class ProjectArea extends PureComponent {
  state = {
    wordData:[]
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'statistics/fetchAreaStatistics',
    });
    dispatch({
      type: 'statistics/fetchWord',
      callback:(res)=>{
        console.log(res);
        if(res.resData){
          this.setState({
            wordData:res.resData
          })
        }
      }
    });
  }

  render() {
    const { areaData } = this.props;

  return (
      <PageHeaderWrapper>
        <Tabs defaultActiveKey="1" style={{backgroundColor:"#fff"}}>
            <TabPane tab={formatMessage({ id: 'validation.globalstatistics' })} key="1">
              <WordChart data={this.state.wordData}/>
            </TabPane>
          <TabPane tab={formatMessage({ id: 'validation.geographicalstatistics' })} key="2">
            <AreaChart data={areaData} />
          </TabPane>
          </Tabs>
      </PageHeaderWrapper>
    );
  }
}

export default ProjectArea;
