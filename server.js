const express = require('express');

const UserRouter = require('./users/userRouter.js');

const server = express();

server.use(express.json());
server.use(myLogger); // should be on top of applying of router as well, otherwise is triggered by errors only

server.use('/api/users', UserRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});

//custom middleware

function myLogger(req, res, next) {
  console.log(`Method: ${req.method}, url: ${req.url}, timestamp: [${new Date().toISOString()}]`);
  next();
};

module.exports = server;