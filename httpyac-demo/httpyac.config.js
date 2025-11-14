module.exports = {
  // 配置环境变量文件
  envDirName: './',

  // 配置不同环境
  environments: {
    $default: {
      env: 'development'
    },
    development: {
      API_BASE_URL: 'https://reqres.in/api',
      JSONPLACEHOLDER_URL: 'https://jsonplaceholder.typicode.com'
    },
    production: {
      API_BASE_URL: 'https://reqres.in/api',
      JSONPLACEHOLDER_URL: 'https://jsonplaceholder.typicode.com'
    }
  },

  // 日志配置
  log: {
    level: 'info',
    supportAnsiColors: true
  },

  // 请求配置
  request: {
    timeout: 30000,
    followRedirect: true
  }
};
