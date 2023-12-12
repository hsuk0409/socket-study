module.exports = {
  apps: [
    {
      name: "socket.server",
      script: "./app.js",
      instances: 0,
      exec_mode: "cluster",
      max_memory_restart: "500M",
      wait_ready: true,
      listen_timeout: 6000,
      kill_timeout: 4800,
      autorestart: true,
      watch: true,
      reactStrictMode: true,
      ignore_watch: ["node_modules", "public", "logs"],
      env_dev: {
        NODE_ENV: "dev",
        THIS_SERVER_PORT: 16001,
      },

      env_live: {},
    },
  ],
};
