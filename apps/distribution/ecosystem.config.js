module.exports = {
  apps: [
    {
      name: 'FlylinkingMonorepoDistributor',
      port: '3000',
      exec_mode: 'cluster',
      instances: 2, // 'max',
      max_memory_restart : "1024M",
      script: '/flylinking-monorepo-distribution/server/index.mjs'      
      // script: '.output/server/index.mjs' //! 仅本地打包起PM2服务时使用
    }
  ]
}