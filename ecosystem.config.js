module.exports = {
  apps: [
    {
      name: "Listening",
      script: "./src/listen.js",
      // watch: ["src"],
      // watch_delay: 100,
      // ignore_watch: ["node_modules", "./src/profiles"],
    },
    {
      name: "Images",
      script: "./src/images.js",
      // watch: ["src"],
      // watch_delay: 100,
      // ignore_watch: ["node_modules", "./src/profiles"],
    },
    {
      name: "Render",
      script: "./src/server.js",
      watch: ["src/server.js"],
      // watch_delay: 100,
      // ignore_watch: ["node_modules", "./src/profiles"],
    },
    // {
    //   name: "Speaking",
    //   script: "./src/speak.js",
    //   // watch: ["src"],
    //   // watch_delay: 100,
    //   // ignore_watch: ["node_modules", "./src/profiles"],
    // },
  ],
};
