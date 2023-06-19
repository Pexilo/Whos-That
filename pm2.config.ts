module.exports = {
  apps: [
    {
      name: "WhosThat",
      script: "dist/index.js",
      instances: 1,
      autorestart: true,
      watch: false,
    },
  ],
};
