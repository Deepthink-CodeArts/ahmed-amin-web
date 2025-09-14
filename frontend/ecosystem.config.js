module.exports = {
  apps: [{
    name: 'ahmed-amin-group-frontend',
    script: 'npm',
    args: 'run preview',
    cwd: '/var/www/ahmed-amin-group/frontend',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
