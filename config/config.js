// https://umijs.org/config/
import os from 'os';
import pageRoutes from './router.config';
import webpackPlugin from './plugin.config';
import defaultSettings from '../src/defaultSettings';
import slash from 'slash2';

const plugins = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        enable: true, // default false
        default: 'zh-CN', // default zh-CN
        baseNavigator: true, // default true, when it is true, will use `navigator.language` overwrite default
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
      },
      pwa: {
        workboxPluginMode: 'InjectManifest',
        workboxOptions: {
          importWorkboxFrom: 'local',
        },
      },
      ...(!process.env.TEST && os.platform() === 'darwin'
        ? {
            dll: {
              include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
              exclude: ['@babel/runtime'],
            },
            hardSource: true,
          }
        : {}),
    },
  ],
];

// 针对 preview.pro.ant.design 的 GA 统计代码
// 业务上不需要这个
if (process.env.APP_TYPE === 'site') {
  plugins.push([
    'umi-plugin-ga',
    {
      code: 'UA-72788897-6',
    },
  ]);
}

export default {
  // add for transfer to umi
  plugins,
  define: {
    APP_TYPE: process.env.APP_TYPE || '',
     // DID_MOCK: process.env.MOCK !== 'none',
  },
  targets: {
    ie: 11,
  },
  // 路由配置
  routes: pageRoutes,
   // Themefor:antd,
   // https:ant.design/docs/react/customize-theme-cn,
  //
  theme: {

     // 'primary-color': defaultSettings.primaryColor,
     'primary-color': '#F5222D',
    // 'primary-color': '#1DA57A',
  },
  externals: {
    '@antv/data-set': 'DataSet',
  },
  proxy: {
    // '/server/api/': {
    //   target: 'https://preview.pro.ant.design/',
    //   changeOrigin: true,
    //   pathRewrite: { '^/server': '' },
    // },
    '/wookong': {
                 // target: 'http://www.leapingtech.net:9090/',
                 target: 'https://www.leapingtech.net/nien-0.0.1-SNAPSHOT',
                 //   target: 'http://192.168.2.180:8080',

           //target: 'http://118.24.64.142:8000/',
        //     target: 'http://192.168.2.106:8080/',
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        '^/wookong/': '',
      },
    },
    '/aa': {
      target: 'https://api.huobi.pro',
      changeOrigin: true,
      pathRewrite: {
        '^/aa/': '',
      },
    },
    '/bb': {
      target: 'https://pro-api.coinmarketcap.com',
      changeOrigin: true,
      pathRewrite: {
        '^/bb/': '',
      },
    },
    '/cc': {
      target: 'https://api.binance.com',
      changeOrigin: true,
      pathRewrite: {
        '^/cc/': '',
      },
    },
    '/dd': {
      target: 'https://www.okex.com',
      changeOrigin: true,
      pathRewrite: {
        '^/dd/': '',
      },
    },
    // '/mycomputer/': {
    //     //   target: 'http://127.0.0.1:8080/',
    //     //   changeOrigin: true,
    //     //   pathRewrite: {
    //     //     '^/mycomputer': '',
    //     //   },
    //     // },
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, localIdentName, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }
      const match = context.resourcePath.match(/src(.*)/);
      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }
      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },

  chainWebpack: webpackPlugin,
};
