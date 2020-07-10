'use strict';
const express =  require('express');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');

// to read and write to file
const  fs = require('fs');
var path = require('path');
const util = require('util');
const readFile = util.promisify(fs.readFile);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: true } ));
app.use('/.netlify/functions/server', router);  // path must route to lambda functions

const router = express.Router();
router.get('/', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<h1>Hello from Express.js!</h1>');
    res.end();
});
// app.use('/', (req, res) => res.send(""));
// app.listen(process.env.PORT, () => {
//     console.log(' Server is ready on localhost:' + process.env.PORT);
//     // to set user roles as a global variabl?e
//     // this.userRoles = getUserRoles();
// });

module.exports = app;
module.exports.handler = serverless(app);