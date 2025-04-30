module.exports = {
  apps: [
    {
      name: 'FlylinkingDistributorFront',
      port: '3000',
      exec_mode: 'cluster',
      instances: 2, // 'max',
      script: '/flylinking-distributor-front/server/index.mjs'      
      // script: '.output/server/index.mjs' //! 仅本地打包起PM2服务时使用
    }
  ]
}