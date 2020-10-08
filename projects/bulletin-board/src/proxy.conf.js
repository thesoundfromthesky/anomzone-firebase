const config = require("./config/config.dev.json");

const PROXY_CONFIG = [
  {
    context: ["/api"],
    target: config.baseUrl,
    secure: false
    // ,"pathRewrite": {
    //   "^/api": ""
    /*}*/
    //  ,"changeOrigin": true
    // ,"logLevel": "debug"
    // ,bypass: function(req, res, proxyOptions) {
    //   if (req.headers.accept.indexOf("html") !== -1) {
    //     console.log("Skipping proxy for browser request.");
    //     return "/index.html";
    //   }
    //   req.headers["X-Custom-Header"] = "yes";
    // }
  }
];

module.exports = PROXY_CONFIG;
