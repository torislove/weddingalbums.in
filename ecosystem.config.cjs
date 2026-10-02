module.exports = {
  apps: [
    {
      name: 'weddingalbums-api',
      script: 'server/index.js',
      instances: 'max', // Utilizes all CPU cores (e.g. 4 OCPUs on Oracle Cloud)
      exec_mode: 'cluster',
      max_memory_restart: '800M',
      autorestart: true,
      restart_delay: 3000,
      env: {
        PORT: 4000,
        NODE_ENV: 'production'
      },
      error_file: 'logs/server-err.log',
      out_file: 'logs/server-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true
    }
  ]
};
