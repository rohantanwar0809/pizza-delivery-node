const http = require('http');

// handlers 
const userHandler = require("./handlers/userHandler");
const authHandler = require('./handlers/authHandler');
const shopHandler = require("./handlers/shopHandler");
const { checkAuth } = require('./utils/auth');
const requestListener = function (req, res) {

  let data = '';
  req.on('data', chunk => {
    data += chunk;
  })
  req.on('end', () => {
    req.body = data.length > 0 ? JSON.parse(data) : {};
    res.setHeader('Content-Type', 'application/json;charset=utf-8');

    const { pathname, search } =  new URL(req.url,'http://127.0.0.1/')

    // token verification middleware
    req.isAuthenticated = checkAuth(req)

    // parse query params whenever required
    req.query =  Object.fromEntries(new URLSearchParams(search).entries())// will be available all over app

    // A global method to send response
    res.send = (data) => {
      const response = typeof data === "object" ? JSON.stringify(data) : data.toString()
      return res.end(response)
    }

    switch (pathname) {
      case "/":
        res.writeHead(200)
        return res.end('Server Listening at 8080!');
      case "/user":
        return userHandler(req, res)
      case "/auth":
        return authHandler(req, res)
      case "/shop":
        return shopHandler(req,res)
      default:
        res.end("Not found")
    }
  })

}

const server = http.createServer(requestListener);
server.listen(8080, () => {
  console.log("Server Started")
});